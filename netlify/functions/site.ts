import { readFile } from "node:fs/promises";
import type { Context, Config } from "@netlify/functions";
import { render } from "../../src/entry-server";
import { renderDocument } from "../../scripts/render-document.mjs";
import { readContent } from "./_shared/store";
import { formKey } from "./_shared/form-key";
import { formToken } from "./_shared/secrets";
import { SITE_ORIGIN } from "../../src/content/search";
let template: Promise<string> | undefined;
export default async function (request: Request, context: Context) {
  if (!["GET", "HEAD"].includes(request.method))
    return new Response("Method not allowed", { status: 405, headers: { Allow: "GET, HEAD" } });
  const production = context.deploy.context === "production";
  const url = new URL(request.url);
  // Consolidate public marketing pages; admin, Identity, and OrbitDesk URLs stay intact.
  if (production && ["sixteenoaks.netlify.app", "www.sixteenoaksllc.com"].includes(url.hostname)) {
    return Response.redirect(SITE_ORIGIN + url.pathname + url.search, 301);
  }
  try {
    // Independent reads run together; content stays fresh and tokens stay per request.
    template ??= readFile(".build/template.html", "utf8");
    const [{ content }, signingKey, shell] = await Promise.all([
      readContent(context),
      formKey(context),
      template,
    ]);
    const page = render(
      new URL(request.url).pathname,
      content,
      formToken(signingKey),
    );
    const html = renderDocument(shell, page, { noIndex: !production });
    return new Response(request.method === "HEAD" ? null : html, {
      status: page.notFound ? 404 : 200,
      headers: {
        "Content-Type": "text/html; charset=utf-8",
        "Cache-Control": "no-store",
        "X-Content-Type-Options": "nosniff",
        "Referrer-Policy": "strict-origin-when-cross-origin",
        ...(!production || page.notFound ? { "X-Robots-Tag": "noindex, nofollow" } : {}),
      },
    });
  } catch {
    console.error("Public page could not be rendered.");
    return new Response(
      request.method === "HEAD" ? null : "This page is temporarily unavailable. Please try again shortly.",
      { status: 503, headers: { "Cache-Control": "no-store" } },
    );
  }
}
export const config: Config = {
  path: [
    "/",
    "/services",
    "/services/",
    "/work",
    "/work/*",
    "/approach",
    "/approach/",
  ],
  // HEAD is handled alongside GET above; other methods return 405.
};
