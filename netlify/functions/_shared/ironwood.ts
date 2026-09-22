import type { Inquiry } from "../../../src/content/model";

function splitName(name: string) {
  const parts = name.trim().split(/\s+/);
  return {
    firstName: parts.shift() || "",
    lastName: parts.join(" "),
  };
}

export async function forwardInquiryToIronwood(inquiry: Inquiry) {
  const endpoint = Netlify.env.get("IRONWOOD_INTAKE_URL");
  const apiKey = Netlify.env.get("IRONWOOD_INTAKE_KEY");
  if (!endpoint || !apiKey) return "not-configured" as const;

  const { firstName, lastName } = splitName(inquiry.name);
  const details = [
    inquiry.service ? `Service: ${inquiry.service}` : "",
    inquiry.business ? `Business: ${inquiry.business}` : "",
    inquiry.page ? `Website page: ${inquiry.page}` : "",
    inquiry.message,
  ].filter(Boolean).join(" | ");

  const response = await fetch(endpoint, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "X-Ironwood-Key": apiKey,
      "Idempotency-Key": `sixteen-oaks-inquiry-${inquiry.id}`,
    },
    body: JSON.stringify({
      external_id: `sixteen-oaks:${inquiry.id}`,
      first_name: firstName,
      last_name: lastName,
      company_name: inquiry.business || null,
      email: inquiry.email,
      phone: inquiry.phone || null,
      message: details,
    }),
    signal: AbortSignal.timeout(10_000),
  });

  if (!response.ok) {
    const result = await response.json().catch(() => ({}));
    const reason = typeof result?.error === "string" ? result.error : `HTTP ${response.status}`;
    throw new Error(`Ironwood intake rejected the inquiry: ${reason}`);
  }
  return "sent" as const;
}
