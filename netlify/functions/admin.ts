import { randomUUID } from "node:crypto";
import type { Context, Config } from "@netlify/functions";
import type { Inquiry } from "../../src/content/model";
import {
  validateContent,
  validateMail,
  ValidationError,
} from "../../src/content/validation";
import { requireAdmin } from "./_shared/auth";
import { storeFor, readContent, json } from "./_shared/store";
import { seal } from "./_shared/secrets";
import { deliver, type StoredMail } from "./_shared/mail";

export default async function (request: Request, context: Context) {
  try {
    await requireAdmin(request);
    const path = new URL(request.url).pathname.replace(/^\/api\/admin\/?/, "");
    const store = storeFor(context);
    if (Number(request.headers.get("content-length") ?? 0) > 3000000)
      return json({ message: "The file is too large." }, 413);
    if (path === "content" && request.method === "GET")
      return json({
        ...(await readContent(context)),
        preview: context.deploy.context !== "production",
      });
    if (path === "content" && request.method === "PUT") {
      const body = await request.json();
      const content = validateContent(body.content);
      const current = await readContent(context);
      if (body.etag !== current.etag)
        return json(
          {
            message:
              "Someone saved a newer version. Reload before making further changes.",
          },
          409,
        );
      for (const p of content.projects) {
        const before = current.content.projects.find((x) => x.id === p.id);
        if (before && before.slug !== p.slug)
          throw new ValidationError(
            "Saved project addresses cannot change. This keeps existing links working.",
          );
      }
      const result = await store.setJSON(
        "content",
        content,
        current.etag === "seed"
          ? { onlyIfNew: true }
          : { onlyIfMatch: current.etag },
      );
      if (!result.modified)
        return json(
          { message: "A newer version was saved. Reload before continuing." },
          409,
        );
      return json({ content, etag: result.etag });
    }
    if (path === "mail" && request.method === "GET") {
      const data = await store.getWithMetadata("mail", { type: "json" });
      const value = data?.data;
      return json({
        encryptionReady: !!Netlify.env.get("SIXTEEN_OAKS_SECRET_KEY"),
        host: value?.host ?? "",
        port: value?.port ?? 587,
        username: value?.username ?? "",
        from: value?.from ?? "",
        enabled: value?.enabled ?? false,
        passwordConfigured: !!value?.encryptedPassword,
        etag: data?.etag ?? "seed",
      });
    }
    if (path === "mail" && request.method === "PUT") {
      const body = await request.json();
      const settings = validateMail(body);
      const old = await store.getWithMetadata("mail", { type: "json" });
      if (body.etag !== (old?.etag ?? "seed"))
        return json(
          { message: "Email settings changed. Reload before saving." },
          409,
        );
      if (settings.password && !Netlify.env.get("SIXTEEN_OAKS_SECRET_KEY"))
        throw new ValidationError(
          "One-time server setup is required before saving email credentials. See docs/ADMIN-SETUP.md.",
        );
      const encryptedPassword = settings.password
        ? seal(settings.password)
        : (old?.data.encryptedPassword ?? "");
      if (settings.enabled && !encryptedPassword)
        throw new ValidationError(
          "Enter the mail account password or app password before enabling delivery.",
        );
      const { password, ...safe } = settings;
      const result = await store.setJSON(
        "mail",
        { ...safe, encryptedPassword },
        old ? { onlyIfMatch: old.etag } : { onlyIfNew: true },
      );
      if (!result.modified)
        return json(
          { message: "Email settings changed. Reload before saving." },
          409,
        );
      return json({
        ...safe,
        passwordConfigured: !!encryptedPassword,
        etag: result.etag,
      });
    }
    if (path === "test-mail" && request.method === "POST") {
      const { content } = await readContent(context);
      try {
        const result = await deliver(
          context,
          content.settings.notificationEmail,
          {
            name: "Sixteen Oaks delivery test",
            email: content.settings.publicEmail,
            phone: "",
            business: "",
            service: "Email setup",
            page: "/admin/",
            message:
              "Your Sixteen Oaks website can send inquiry notifications to this address.",
          },
        );
        return result === "sent"
          ? json({
              message: "Test email sent. Check your inbox and spam folder.",
            })
          : json(
              { message: "Enable and save your email connection first." },
              400,
            );
      } catch {
        return json(
          {
            message:
              "Delivery failed. Check your mail server, sender address, and account password.",
          },
          502,
        );
      }
    }
    if (path === "inbox" && request.method === "GET") {
      const entries = await store.list({ prefix: "inquiries/" });
      const values: Inquiry[] = [];
      for (let i = 0; i < entries.blobs.length; i += 20) {
        const batch = await Promise.all(
          entries.blobs
            .slice(i, i + 20)
            .map((b) => store.get(b.key, { type: "json" })),
        );
        values.push(...batch.filter((v): v is Inquiry => !!v));
      }
      return json(
        values.sort((a, b) => b.createdAt.localeCompare(a.createdAt)),
      );
    }
    if (/^inbox\/[a-f0-9-]{36}$/.test(path) && request.method === "PATCH") {
      const body = await request.json();
      if (!["new", "read", "archived"].includes(body.status))
        throw new ValidationError("Invalid inbox status.");
      const key = "inquiries/" + path.split("/")[1];
      const entry = await store.getWithMetadata(key, { type: "json" });
      if (!entry) return json({ message: "Inquiry not found." }, 404);
      const result = await store.setJSON(
        key,
        { ...entry.data, status: body.status },
        { onlyIfMatch: entry.etag },
      );
      return result.modified
        ? json({ ok: true })
        : json({ message: "Inquiry changed. Refresh your inbox." }, 409);
    }
    if (path === "upload" && request.method === "POST") {
      const bytes = new Uint8Array(await request.arrayBuffer());
      if (bytes.length > 2000000 || bytes.length < 12)
        throw new ValidationError("Choose an image smaller than 2 MB.");
      const signature = Buffer.from(bytes);
      let type = "";
      if (
        signature
          .subarray(0, 8)
          .equals(Buffer.from([137, 80, 78, 71, 13, 10, 26, 10]))
      )
        type = "image/png";
      else if (
        signature[0] === 255 &&
        signature[1] === 216 &&
        signature[2] === 255
      )
        type = "image/jpeg";
      else if (
        signature.toString("ascii", 0, 4) === "RIFF" &&
        signature.toString("ascii", 8, 12) === "WEBP"
      )
        type = "image/webp";
      if (!type) throw new ValidationError("Choose a JPG, PNG, or WebP image.");
      const id = randomUUID();
      await store.set("media/" + id, bytes, {
        metadata: { contentType: type },
      });
      return json({ src: "/api/media/" + id });
    }
    return json({ message: "Not found." }, 404);
  } catch (error) {
    if (error instanceof Response) return error;
    if (error instanceof ValidationError)
      return json({ message: error.message }, 400);
    console.error("Admin request failed.");
    return json(
      { message: "Unable to complete the request. Please try again." },
      500,
    );
  }
}
export const config: Config = {
  path: ["/api/admin/:resource", "/api/admin/inbox/:id"],
  method: ["GET", "PUT", "POST", "PATCH"],
  rateLimit: { windowLimit: 120, windowSize: 60, aggregateBy: "ip" },
};
