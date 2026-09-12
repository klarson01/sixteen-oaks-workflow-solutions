import "./styles/site.css";
import initializeOpportunity from "./app/lib/opportunity";
import initializeMotion from "./app/lib/motion";

// Every route is already complete HTML. React is used at build time, so this
// enhancement never replaces the page and the site remains usable without JS.
initializeMotion();
initializeOpportunity();

// Identity emails may return to the homepage; preserve the token for the admin.
if (
  /^#(?:invite_token|recovery_token|confirmation_token|access_token)=/.test(
    location.hash,
  )
) {
  location.replace("/admin/" + location.hash);
}
document.addEventListener("submit", async (event) => {
  const form = event.target;
  if (
    !(form instanceof HTMLFormElement) ||
    !form.matches("[data-inquiry-form]")
  )
    return;
  event.preventDefault();
  const button = form.querySelector<HTMLButtonElement>(
    'button[type="submit"]',
  )!;
  if (button.disabled) return;
  const status = form.querySelector<HTMLElement>('[role="status"]')!;
  button.disabled = true;
  status.textContent = "Sending your message…";
  try {
    const data = new URLSearchParams();
    new FormData(form).forEach((value, key) => data.set(key, String(value)));
    const response = await fetch(form.action, {
      method: "POST",
      headers: { Accept: "application/json" },
      body: data,
    });
    const result = await response.json();
    if (!response.ok) throw new Error(result.message || "Please try again.");
    status.textContent = result.message;
    button.textContent = "Message received";
    form
      .querySelectorAll<
        HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
      >("input,textarea,select")
      .forEach((input) => (input.disabled = true));
  } catch (error) {
    status.textContent =
      error instanceof Error
        ? error.message
        : "Unable to send. Please try again or use our email link.";
    button.disabled = false;
  }
});
