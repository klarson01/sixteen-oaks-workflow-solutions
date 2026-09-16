export function escapeHtml(value: string): string;
export function renderDocument(
  template: string,
  page: {
    html: string;
    title: string;
    description: string;
    notFound?: boolean;
    canonicalUrl?: string | null;
    structuredData?: Record<string, unknown> | null;
  },
  options?: { noIndex?: boolean },
): string;
