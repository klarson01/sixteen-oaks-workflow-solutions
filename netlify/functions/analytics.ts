import type { Context, Config } from "@netlify/functions";
import type { AnalyticsEvent } from "../../src/content/analytics";
import { recordAnalytics } from "./_shared/analytics";

const BOT = /bot|crawler|spider|preview|facebookexternalhit|linkedinbot|slurp/i;
const KINDS = new Set([
  "pageview",
  "form_start",
  "email_click",
  "phone_click",
]);

function empty(status: number) {
  return new Response(null, {
    status,
    headers: {
      "Cache-Control": "no-store",
      "X-Content-Type-Options": "nosniff",
    },
  });
}

export default async function (request: Request, context: Context) {
  if (request.method !== "POST") return empty(405);
  const requestUrl = new URL(request.url);
  if (request.headers.get("origin") !== requestUrl.origin) return empty(403);
  if (BOT.test(request.headers.get("user-agent") ?? "")) return empty(204);
  if (Number(request.headers.get("content-length") ?? 0) > 1200)
    return empty(413);
  try {
    const body = (await request.json()) as Partial<AnalyticsEvent>;
    if (
      typeof body.kind !== "string" ||
      !KINDS.has(body.kind) ||
      typeof body.path !== "string" ||
      typeof body.session !== "string" ||
      (body.referrer !== undefined && typeof body.referrer !== "string") ||
      body.path.length > 200 ||
      body.session.length > 80 ||
      (body.referrer?.length ?? 0) > 500
    )
      return empty(400);
    await recordAnalytics(
      context,
      body as AnalyticsEvent,
      requestUrl.hostname.toLowerCase(),
    );
    return empty(204);
  } catch {
    return empty(400);
  }
}

export const config: Config = {
  path: "/api/analytics",
  method: ["POST"],
  rateLimit: { windowLimit: 120, windowSize: 60, aggregateBy: "ip" },
};
