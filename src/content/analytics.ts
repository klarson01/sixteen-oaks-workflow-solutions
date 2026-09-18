export const ANALYTICS_RETENTION_DAYS = 400;

export type AnalyticsEventKind =
  | "pageview"
  | "form_start"
  | "email_click"
  | "phone_click";

export interface AnalyticsEvent {
  kind: AnalyticsEventKind;
  path: string;
  session: string;
  referrer?: string;
}

export interface AnalyticsDailyRecord {
  date: string;
  pageViews: number;
  sessionHashes: string[];
  pages: Record<string, number>;
  sources: Record<string, number>;
  actions: {
    formStarts: number;
    emailClicks: number;
    phoneClicks: number;
  };
}

export interface AnalyticsSummary {
  environment: "production" | "preview";
  days: 7 | 30 | 90;
  rangeStart: string;
  rangeEnd: string;
  totals: {
    sessions: number;
    pageViews: number;
    inquiries: number;
    conversionRate: number;
  };
  actions: AnalyticsDailyRecord["actions"];
  daily: Array<{
    date: string;
    sessions: number;
    pageViews: number;
    inquiries: number;
  }>;
  topPages: Array<{ path: string; label: string; views: number }>;
  sources: Array<{ label: string; sessions: number }>;
  privacy: {
    cookies: false;
    personalIdentifiers: false;
    retentionDays: number;
  };
}
