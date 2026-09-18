import type { AnalyticsEvent, AnalyticsEventKind } from "../../content/analytics";

const SESSION_KEY = "sixteen-oaks-analytics-session";
const ACTION_KEY = "sixteen-oaks-analytics-actions";

function privacyOptOut() {
  return (
    navigator.doNotTrack === "1" ||
    (navigator as Navigator & { globalPrivacyControl?: boolean })
      .globalPrivacyControl === true
  );
}

function sessionId() {
  try {
    const existing = sessionStorage.getItem(SESSION_KEY);
    if (existing) return existing;
    const created = crypto.randomUUID();
    sessionStorage.setItem(SESSION_KEY, created);
    return created;
  } catch {
    return crypto.randomUUID();
  }
}

function referrerOrigin() {
  if (!document.referrer) return "";
  try {
    return new URL(document.referrer).origin;
  } catch {
    return "";
  }
}

function send(kind: AnalyticsEventKind) {
  if (privacyOptOut()) return;
  const payload: AnalyticsEvent = {
    kind,
    path: location.pathname,
    session: sessionId(),
    referrer: referrerOrigin(),
  };
  const body = JSON.stringify(payload);
  if (navigator.sendBeacon) {
    navigator.sendBeacon(
      "/api/analytics",
      new Blob([body], { type: "application/json" }),
    );
    return;
  }
  void fetch("/api/analytics", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body,
    keepalive: true,
  });
}

function sendActionOnce(kind: Exclude<AnalyticsEventKind, "pageview">) {
  try {
    const sent = new Set(
      JSON.parse(sessionStorage.getItem(ACTION_KEY) ?? "[]") as string[],
    );
    if (sent.has(kind)) return;
    sent.add(kind);
    sessionStorage.setItem(ACTION_KEY, JSON.stringify([...sent]));
  } catch {
    // Storage may be unavailable; the aggregate endpoint remains safe to call.
  }
  send(kind);
}

export default function initializeAnalytics() {
  if (privacyOptOut()) return;
  send("pageview");
  window.addEventListener("sixteen-oaks:navigation", () => send("pageview"));
  document.addEventListener("focusin", (event) => {
    if ((event.target as Element | null)?.closest?.("[data-inquiry-form]"))
      sendActionOnce("form_start");
  });
  document.addEventListener("click", (event) => {
    const link = (event.target as Element | null)?.closest?.("a[href]");
    const href = link?.getAttribute("href")?.toLowerCase() ?? "";
    if (href.startsWith("mailto:")) sendActionOnce("email_click");
    if (href.startsWith("tel:")) sendActionOnce("phone_click");
  });
}
