import {
  exampleOpportunity,
  parseOpportunity,
  opportunityBrief,
  type Opportunity,
} from "../../content/opportunity";
type Result = {
  business: string;
  challenge: string;
  suggestion: Opportunity;
  example: boolean;
};
const results = new WeakMap<HTMLElement, Result>();
function renderResult(panel: HTMLElement, result: Result) {
  const { suggestion, example } = result;
  function set(selector: string, value: string) {
    panel.querySelector<HTMLElement>(selector)!.textContent = value;
  }
  set(
    "[data-result-label]",
    example
      ? "02 / Example starting point"
      : "02 / Your AI-generated starting point",
  );
  set("[data-result-title]", suggestion.title);
  set("[data-result-summary]", suggestion.summary);
  set("[data-result-first]", suggestion.firstStep);
  panel
    .querySelectorAll<HTMLElement>("[data-result-step]")
    .forEach((el, i) => (el.textContent = suggestion.steps[i]));
  set(
    "[data-result-note]",
    example
      ? "Illustrative example. Kevin can help you adapt it."
      : "AI-generated guidance. Kevin will confirm scope, feasibility, and fit with your tools.",
  );
  panel.querySelector<HTMLButtonElement>("[data-discuss-opportunity]")!.hidden =
    false;
  panel.querySelector<HTMLElement>("[data-review-note]")!.hidden = false;
  results.set(panel, result);
  panel
    .querySelector<HTMLElement>("[data-result-title]")!
    .focus({ preventScroll: true });
}
export default function initializeOpportunity() {
  document.addEventListener("submit", async (event) => {
    const form = event.target;
    if (
      !(form instanceof HTMLFormElement) ||
      !form.matches("[data-opportunity-form]")
    )
      return;
    event.preventDefault();
    const panel = form.closest<HTMLElement>("[data-opportunity]")!;
    const button = form.querySelector<HTMLButtonElement>(
      "[data-find-opportunity]",
    )!;
    if (button.disabled) return;
    const status = form.querySelector<HTMLElement>("[data-finder-status]")!;
    const data = new FormData(form);
    const business = String(data.get("businessType"));
    const challenge = String(data.get("challenge")).trim();
    const exampleButton = form.querySelector<HTMLButtonElement>(
      "[data-show-example]",
    )!;
    results.delete(panel);
    panel.querySelector<HTMLButtonElement>(
      "[data-discuss-opportunity]",
    )!.hidden = true;
    panel.querySelector<HTMLElement>("[data-review-note]")!.hidden = true;
    const controls = form.querySelectorAll<
      HTMLInputElement | HTMLTextAreaElement
    >("input:not([type=hidden]),textarea");
    controls.forEach((el) => (el.disabled = true));
    button.disabled = true;
    exampleButton.disabled = true;
    form.setAttribute("aria-busy", "true");
    status.textContent = "Looking for a practical place to start…";
    try {
      const response = await fetch("/api/opportunity", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
        },
        body: JSON.stringify({
          business,
          challenge,
          formToken: data.get("formToken"),
        }),
        signal: AbortSignal.timeout(25000),
      });
      let payload;
      try {
        payload = await response.json();
      } catch {
        throw new Error(
          response.status === 429
            ? "Please wait a minute before trying again."
            : "The finder is unavailable right now. Try the example or tell Kevin about your idea below.",
        );
      }
      if (!response.ok)
        throw new Error(
          payload.message || "The finder is unavailable. Please try again.",
        );
      if (!panel.isConnected) return;
      renderResult(panel, {
        business,
        challenge,
        suggestion: parseOpportunity(payload.suggestion),
        example: false,
      });
      status.textContent =
        "Your starting point is ready. Review it, then explore it with Kevin.";
    } catch (error) {
      if (panel.isConnected)
        status.textContent =
          error instanceof Error && error.name !== "TimeoutError"
            ? error.message
            : "That took too long. Please try again, or use the contact form below.";
    } finally {
      controls.forEach((el) => (el.disabled = false));
      button.disabled = false;
      exampleButton.disabled = false;
      form.removeAttribute("aria-busy");
    }
  });
  document.addEventListener("click", (event) => {
    if (!(event.target instanceof Element)) return;
    const example = event.target.closest("[data-show-example]");
    const discuss = event.target.closest("[data-discuss-opportunity]");
    const panel = (example || discuss)?.closest<HTMLElement>(
      "[data-opportunity]",
    );
    if (!panel) return;
    const status = panel.querySelector<HTMLElement>("[data-finder-status]")!;
    if (example) {
      const form = panel.querySelector<HTMLFormElement>("form")!;
      const challenge = "Following up on estimates after a busy day.";
      form.querySelector<HTMLTextAreaElement>('[name="challenge"]')!.value =
        challenge;
      form.querySelector<HTMLInputElement>('[name="businessType"]')!.checked =
        true;
      renderResult(panel, {
        business: "Service business",
        challenge,
        suggestion: exampleOpportunity,
        example: true,
      });
      status.textContent = "Showing an example. No AI request was made.";
      return;
    }
    const result = results.get(panel);
    if (!result) return;
    const form = document.querySelector<HTMLFormElement>("[data-inquiry-form]");
    const message =
      form?.querySelector<HTMLTextAreaElement>('[name="message"]');
    if (!form || !message || message.disabled) {
      status.textContent =
        "To start a new inquiry, refresh the page or use the email link below.";
      return;
    }
    const brief = opportunityBrief(
      result.business,
      result.challenge,
      result.suggestion,
      result.example,
    );
    if (!message.value.includes(brief)) {
      const next = message.value.trim()
        ? message.value.trim() + "\n\n" + brief
        : brief;
      if (next.length > message.maxLength) {
        status.textContent =
          "Your contact message is already quite long. Shorten it before adding this idea.";
        return;
      }
      message.value = next;
    }
    const service = form.querySelector<HTMLSelectElement>('[name="service"]');
    if (service) service.value = "AI & automation";
    form.querySelector<HTMLElement>('[role="status"]')!.textContent =
      "Your idea is included below. Add your contact details, review the message, then send when you’re ready.";
    form.scrollIntoView({
      behavior:
        matchMedia("(prefers-reduced-motion: reduce)").matches ||
        document.documentElement.dataset.motion === "off"
          ? "instant"
          : "smooth",
      block: "start",
    });
    form
      .querySelector<HTMLInputElement>('[name="name"]')!
      .focus({ preventScroll: true });
    status.textContent = "Added to your inquiry. Nothing has been sent.";
  });
  document.addEventListener("input", (event) => {
    if (!(event.target instanceof Element)) return;
    const panel = event.target.closest<HTMLElement>("[data-opportunity]");
    if (!panel || !results.has(panel)) return;
    results.delete(panel);
    panel.querySelector<HTMLButtonElement>(
      "[data-discuss-opportunity]",
    )!.hidden = true;
    panel.querySelector<HTMLElement>("[data-review-note]")!.hidden = true;
    panel.querySelector<HTMLElement>("[data-finder-status]")!.textContent =
      "Your details changed. Generate a new suggestion to use them.";
  });
}
