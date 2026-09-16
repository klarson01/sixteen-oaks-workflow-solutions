import type { Config, Context } from "@netlify/functions";
import { readContent } from "./_shared/store";
import { robotsText, searchPaths, sitemapXml } from "../../src/content/search";

export default async function (request: Request, context: Context) {
  if (!["GET", "HEAD"].includes(request.method))
    return new Response("Method not allowed", { status: 405, headers: { Allow: "GET, HEAD" } });
  const production = context.deploy.context === "production";
  const robots = new URL(request.url).pathname === "/robots.txt";
  const headers = {
    "Content-Type": robots ? "text/plain; charset=utf-8" : "application/xml; charset=utf-8",
    "Cache-Control": "no-store",
    "X-Content-Type-Options": "nosniff",
    ...(production ? {} : { "X-Robots-Tag": "noindex, nofollow" }),
  };
  try {
    const body = robots ? robotsText(production) : sitemapXml(
      production ? searchPaths((await readContent(context)).content) : [],
    );
    return new Response(request.method === "HEAD" ? null : body, { headers });
  } catch {
    // An unavailable store must not publish a stale or partial list of projects.
    return new Response(request.method === "HEAD" ? null : "Temporarily unavailable.", {
      status: 503,
      headers: { ...headers, "Content-Type": "text/plain; charset=utf-8" },
    });
  }
}

// Handle methods in the function: the installed routing types omit HEAD.
export const config: Config = { path: ["/sitemap.xml", "/robots.txt"] };
