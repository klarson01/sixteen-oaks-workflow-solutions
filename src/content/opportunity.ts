export const businessTypes = [
  "Service business",
  "Real estate",
  "Retail",
  "Other small business",
] as const;
export interface Opportunity {
  title: string;
  summary: string;
  steps: [string, string, string];
  firstStep: string;
}
export const exampleOpportunity: Opportunity = {
  title: "A thoughtful estimate follow-up",
  summary:
    "Draft a personal follow-up from your estimate notes. Review it before it goes to your customer.",
  steps: ["Estimate ready", "AI drafts a follow-up", "You review & send"],
  firstStep:
    "Start with one sample estimate and the follow-up you would normally write.",
};
export function parseOpportunity(value: unknown): Opportunity {
  if (!value || typeof value !== "object")
    throw new Error("Invalid suggestion");
  const item = value as Record<string, unknown>;
  function field(v: unknown, max: number) {
    if (
      typeof v !== "string" ||
      !v.trim() ||
      v.length > max ||
      /[<>\u0000-\u0008]/.test(v)
    )
      throw new Error("Invalid suggestion");
    return v.trim();
  }
  if (!Array.isArray(item.steps) || item.steps.length !== 3)
    throw new Error("Invalid steps");
  return {
    title: field(item.title, 100),
    summary: field(item.summary, 600),
    steps: item.steps.map((v) => field(v, 100)) as Opportunity["steps"],
    firstStep: field(item.firstStep, 350),
  };
}
export function opportunityBrief(
  business: string,
  challenge: string,
  result: Opportunity,
  isExample = false,
) {
  return `I'd like to explore this ${isExample ? "example" : "AI-generated starting point"} with Kevin.\n\nBusiness type: ${business}\nWhat slows my day down: ${challenge}\n\n${result.title}\n${result.summary}\n\nSuggested workflow:\n${result.steps.map((step, i) => `${i + 1}. ${step}`).join("\n")}\n\nFirst step: ${result.firstStep}\n\nPlease help me confirm what fits my business and existing tools.`;
}
