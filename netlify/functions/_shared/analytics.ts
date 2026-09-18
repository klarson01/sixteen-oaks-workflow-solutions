import { createHmac } from "node:crypto";
import type { Context } from "@netlify/functions";
import type {
  AnalyticsDailyRecord,
  AnalyticsEvent,
  AnalyticsSummary,
} from "../../../src/content/analytics";
import { ANALYTICS_RETENTION_DAYS } from "../../../src/content/analytics";
import type { Inquiry } from "../../../src/content/model";
import { formKey } from "./form-key";
import { storeFor } from "./store";

const PUBLIC_PATH = /^\/(?:$|services\/$|work\/$|approach\/$|work\/[a-z0-9]+(?:-[a-z0-9]+)*\/$)/;
const SESSION = /^[a-f0-9-]{36}$/i;
const DAY_KEY = "analytics/daily/";
const chicagoDate = new Intl.DateTimeFormat("en-CA", {
  timeZone: "America/Chicago",
  year: "numeric",
  month: "2-digit",
  day: "2-digit",
});

function dateKey(value = new Date()) {
  const parts = Object.fromEntries(
    chicagoDate
      .formatToParts(value)
      .filter((part) => part.type !== "literal")
      .map((part) => [part.type, part.value]),
  );
  return `${parts.year}-${parts.month}-${parts.day}`;
}

function recentDates(days: number, now = new Date()) {
  const dates: string[] = [];
  for (let offset = days - 1; offset >= 0; offset -= 1)
    dates.push(dateKey(new Date(now.getTime() - offset * 86400000)));
  return [...new Set(dates)];
}

function emptyDay(date: string): AnalyticsDailyRecord {
  return {
    date,
    pageViews: 0,
    sessionHashes: [],
    pages: {},
    sources: {},
    actions: { formStarts: 0, emailClicks: 0, phoneClicks: 0 },
  };
}

function validDay(value: unknown, date: string): AnalyticsDailyRecord {
  if (!value || typeof value !== "object") return emptyDay(date);
  const source = value as Partial<AnalyticsDailyRecord>;
  return {
    date,
    pageViews: Number.isInteger(source.pageViews) ? source.pageViews! : 0,
    sessionHashes: Array.isArray(source.sessionHashes)
      ? source.sessionHashes.filter((item) => typeof item === "string")
      : [],
    pages:
      source.pages && typeof source.pages === "object" ? source.pages : {},
    sources:
      source.sources && typeof source.sources === "object"
        ? source.sources
        : {},
    actions: {
      formStarts: Number.isInteger(source.actions?.formStarts)
        ? source.actions!.formStarts
        : 0,
      emailClicks: Number.isInteger(source.actions?.emailClicks)
        ? source.actions!.emailClicks
        : 0,
      phoneClicks: Number.isInteger(source.actions?.phoneClicks)
        ? source.actions!.phoneClicks
        : 0,
    },
  };
}

function normalizedPath(value: string) {
  let path = value.split(/[?#]/, 1)[0] || "/";
  if (!path.startsWith("/")) path = "/" + path;
  if (path !== "/") path = path.replace(/\/+$/, "") + "/";
  return PUBLIC_PATH.test(path) ? path : null;
}

function sourceLabel(referrer: string | undefined, siteHost: string) {
  if (!referrer) return "Direct";
  let host: string;
  try {
    host = new URL(referrer).hostname.toLowerCase().replace(/^www\./, "");
  } catch {
    return "Direct";
  }
  if (!host) return "Direct";
  if (host === siteHost.replace(/^www\./, "")) return "Internal navigation";
  if (host === "google.com" || host.endsWith(".google.com")) return "Google";
  if (host === "bing.com" || host.endsWith(".bing.com")) return "Bing";
  if (host === "duckduckgo.com") return "DuckDuckGo";
  if (host === "facebook.com" || host.endsWith(".facebook.com"))
    return "Facebook";
  if (host === "linkedin.com" || host.endsWith(".linkedin.com") || host === "lnkd.in")
    return "LinkedIn";
  if (host === "instagram.com" || host.endsWith(".instagram.com"))
    return "Instagram";
  return host.slice(0, 100);
}

function pageLabel(path: string) {
  const known: Record<string, string> = {
    "/": "Home",
    "/services/": "Services",
    "/work/": "Our work",
    "/approach/": "About",
  };
  if (known[path]) return known[path];
  const segments = path.split("/").filter(Boolean);
  const slug = segments[segments.length - 1] ?? path;
  return slug
    .split("-")
    .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
    .join(" ");
}

export async function recordAnalytics(
  context: Context,
  event: AnalyticsEvent,
  siteHost: string,
) {
  if (!SESSION.test(event.session)) throw new Error("Invalid session.");
  const path = normalizedPath(event.path);
  if (!path) return;
  const date = dateKey();
  const sessionHash = createHmac("sha256", await formKey(context))
    .update(`${date}:${event.session}`)
    .digest("base64url")
    .slice(0, 24);
  const store = storeFor(context);
  const key = DAY_KEY + date;
  for (let attempt = 0; attempt < 8; attempt += 1) {
    const current = await store.getWithMetadata(key, { type: "json" });
    const next = validDay(current?.data, date);
    const isNewSession = !next.sessionHashes.includes(sessionHash);
    if (isNewSession) {
      next.sessionHashes.push(sessionHash);
      const source = sourceLabel(event.referrer, siteHost);
      next.sources[source] = (next.sources[source] ?? 0) + 1;
    }
    if (event.kind === "pageview") {
      next.pageViews += 1;
      next.pages[path] = (next.pages[path] ?? 0) + 1;
    } else if (event.kind === "form_start") next.actions.formStarts += 1;
    else if (event.kind === "email_click") next.actions.emailClicks += 1;
    else if (event.kind === "phone_click") next.actions.phoneClicks += 1;
    else return;
    const result = await store.setJSON(
      key,
      next,
      current ? { onlyIfMatch: current.etag } : { onlyIfNew: true },
    );
    if (result.modified) return;
  }
  throw new Error("Analytics were busy. Try again.");
}

export async function analyticsSummary(
  context: Context,
  requestedDays: number,
): Promise<AnalyticsSummary> {
  const days = ([7, 30, 90].includes(requestedDays) ? requestedDays : 30) as
    | 7
    | 30
    | 90;
  const dates = recentDates(days);
  const dateSet = new Set(dates);
  const store = storeFor(context);
  const entries = await store.list({ prefix: DAY_KEY });
  const matching = entries.blobs.filter((entry) =>
    dateSet.has(entry.key.slice(DAY_KEY.length)),
  );
  const records = await Promise.all(
    matching.map(async (entry) => {
      const date = entry.key.slice(DAY_KEY.length);
      return validDay(await store.get(entry.key, { type: "json" }), date);
    }),
  );
  const byDate = new Map(records.map((record) => [record.date, record]));
  const inquiryEntries = await store.list({ prefix: "inquiries/" });
  const inquiries: Inquiry[] = [];
  for (let index = 0; index < inquiryEntries.blobs.length; index += 50) {
    const batch = await Promise.all(
      inquiryEntries.blobs
        .slice(index, index + 50)
        .map((entry) => store.get(entry.key, { type: "json" })),
    );
    inquiries.push(...batch.filter((value): value is Inquiry => !!value));
  }
  const leadsByDate = new Map<string, number>();
  for (const inquiry of inquiries) {
    const date = dateKey(new Date(inquiry.createdAt));
    if (dateSet.has(date))
      leadsByDate.set(date, (leadsByDate.get(date) ?? 0) + 1);
  }
  const pages: Record<string, number> = {};
  const sources: Record<string, number> = {};
  const actions = { formStarts: 0, emailClicks: 0, phoneClicks: 0 };
  let sessions = 0;
  let pageViews = 0;
  const daily = dates.map((date) => {
    const record = byDate.get(date) ?? emptyDay(date);
    const daySessions = record.sessionHashes.length;
    sessions += daySessions;
    pageViews += record.pageViews;
    for (const [path, count] of Object.entries(record.pages))
      pages[path] = (pages[path] ?? 0) + count;
    for (const [source, count] of Object.entries(record.sources))
      sources[source] = (sources[source] ?? 0) + count;
    actions.formStarts += record.actions.formStarts;
    actions.emailClicks += record.actions.emailClicks;
    actions.phoneClicks += record.actions.phoneClicks;
    return {
      date,
      sessions: daySessions,
      pageViews: record.pageViews,
      inquiries: leadsByDate.get(date) ?? 0,
    };
  });
  const inquiryCount = [...leadsByDate.values()].reduce(
    (sum, count) => sum + count,
    0,
  );
  return {
    environment:
      context.deploy.context === "production" ? "production" : "preview",
    days,
    rangeStart: dates[0],
    rangeEnd: dates[dates.length - 1],
    totals: {
      sessions,
      pageViews,
      inquiries: inquiryCount,
      conversionRate: sessions ? (inquiryCount / sessions) * 100 : 0,
    },
    actions,
    daily,
    topPages: Object.entries(pages)
      .map(([path, views]) => ({ path, label: pageLabel(path), views }))
      .sort((a, b) => b.views - a.views || a.path.localeCompare(b.path)),
    sources: Object.entries(sources)
      .map(([label, count]) => ({ label, sessions: count }))
      .sort((a, b) => b.sessions - a.sessions || a.label.localeCompare(b.label)),
    privacy: {
      cookies: false,
      personalIdentifiers: false,
      retentionDays: ANALYTICS_RETENTION_DAYS,
    },
  };
}

export async function deleteExpiredAnalytics(context: Context) {
  const cutoff = dateKey(
    new Date(Date.now() - ANALYTICS_RETENTION_DAYS * 86400000),
  );
  const store = storeFor(context);
  const entries = await store.list({ prefix: DAY_KEY });
  const expired = entries.blobs.filter(
    (entry) => entry.key.slice(DAY_KEY.length) < cutoff,
  );
  await Promise.all(expired.map((entry) => store.delete(entry.key)));
  return expired.length;
}
