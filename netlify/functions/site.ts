import { readFile } from "node:fs/promises";
import type { Context, Config } from "@netlify/functions";
import { render } from "../../src/entry-server";
import { renderDocument } from "../../scripts/render-document.mjs";
import { readContent } from "./_shared/store";
import { formKey } from "./_shared/form-key";
import { formToken } from "./_shared/secrets";
let template: Promise<string> | undefined;
export default async function (request: Request, context: Context) {
  try {
    const { content } = await readContent(context);
    const page = render(
      new URL(request.url).pathname,
      content,
      formToken(await formKey(context)),
    );
    template ??= readFile(".build/template.html", "utf8");
    const html = renderDocument(await template, page);
    return new Response(request.method === "HEAD" ? null : html, {
      status: page.notFound ? 404 : 200,
      headers: {
        "Content-Type": "text/html; charset=utf-8",
        "Cache-Control": "no-store",
        "X-Content-Type-Options": "nosniff",
        "Referrer-Policy": "strict-origin-when-cross-origin",
      },
    });
  } catch {
    console.error("Public page could not be rendered.");
    return new Response(
      "This page is temporarily unavailable. Please try again shortly.",
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
  method: ["GET"],
};
