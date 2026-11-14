import type { Context, Config } from "@netlify/functions";
import type { Inquiry } from "../../src/content/model";
import { text, email, ValidationError } from "../../src/content/validation";
import { storeFor, readContent, json } from "./_shared/store";
import { formKey } from "./_shared/form-key";
import { verifyFormToken } from "./_shared/secrets";
import { deliver } from "./_shared/mail";
import { forwardInquiryToIronwood } from "./_shared/ironwood";
export default async function (request: Request, context: Context) {
  const wantsJson = request.headers.get("accept")?.includes("application/json");
  function response(message: string, status: number, id?: string) {
    if (wantsJson) return json({ message, id }, status);
    return new Response(
      `<!doctype html><html lang="en"><meta charset="utf-8"><meta name="viewport" content="width=device-width"><title>Sixteen Oaks — Your inquiry</title><body style="font:20px/1.6 system-ui;max-width:650px;margin:12vh auto;padding:24px"><h1>${status === 200 ? "Thank you." : "Please try again."}</h1><p>${message}</p><a href="/#contact">Return to Sixteen Oaks</a></body></html>`,
      {
        status,
        headers: {
          "Content-Type": "text/html; charset=utf-8",
          "Cache-Control": "no-store",
        },
      },
    );
  }
  try {
    if (Number(request.headers.get("content-length") ?? 0) > 16000)
      return response("Please shorten your message.", 413);
    const raw = await request.text();
    if (raw.length > 16000)
      return response("Please shorten your message.", 413);
    const fields = new URLSearchParams(raw);
    if (fields.get("website"))
      return response("Your message has been received.", 200);
    const id = verifyFormToken(
      fields.get("formToken") ?? "",
      await formKey(context),
    );
    if (!id)
      return response(
        "Please refresh the page, then send your message again.",
        400,
      );
    const isAssessment = fields.get("service") === "Business Technology Assessment";
    const assessmentQuestions = [
      ["assessmentWebsite", "Website & online presence", ["Yes, it works well", "Somewhat, it needs improvement", "No, or we don't have a website"]],
      ["assessmentLeads", "Customer management", ["Yes, in a dedicated system", "Partially, across multiple tools", "No, mostly manually"]],
      ["assessmentScheduling", "Appointments & requests", ["Yes, with a smooth process", "Only by email or basic form", "No, mostly by phone"]],
      ["assessmentWorkflow", "Daily workflows", ["Most recurring work", "Some recurring work", "Very little or none"]],
      ["assessmentReporting", "Business visibility", ["Yes, in dashboards or reports", "Somewhat, with manual effort", "No, information is scattered"]],
      ["assessmentSystems", "Connected systems", ["Yes, well integrated", "A few systems connect", "No, mostly disconnected"]],
      ["assessmentMarketing", "Marketing & follow-up", ["Yes, with planned campaigns", "Sometimes, when time allows", "No consistent process"]],
      ["assessmentAI", "Practical AI", ["Yes, routinely", "Experimenting or exploring", "No, not yet"]],
    ] as const;
    let assessmentMessage = "";
    if (isAssessment) {
      if (fields.get("assessmentConsent") !== "yes") throw new ValidationError("Please confirm that we may contact you about your assessment.");
      const allowedIndustries = ["Construction & trades","Automotive & repair","Retail & hospitality","Professional services","Healthcare & wellness","Real estate","Manufacturing & logistics","Other"];
      const allowedSizes = ["Just me","2–10","11–50","51–200","200+"];
      const allowedTiming = ["Just exploring","Within the next month","Within 1–3 months","Later this year"];
      const choice = (field: string, label: string, allowed: readonly string[]) => {
        const value = text(fields.get(field), label, 160, true);
        if (!allowed.includes(value)) throw new ValidationError("Please complete all assessment questions.");
        return value;
      };
      const industry = choice("assessmentIndustry", "Industry", allowedIndustries);
      const size = choice("assessmentSize", "Business size", allowedSizes);
      const timing = choice("assessmentTiming", "Timing", allowedTiming);
      const challenge = text(fields.get("assessmentChallenge"), "Biggest challenge", 2000, true);
      if (challenge.length < 10) throw new ValidationError("Please describe your business challenge in a little more detail.");
      const answers = assessmentQuestions.map(([field, title, options]) => title + ": " + choice(field, title, options));
      assessmentMessage = ["BUSINESS TECHNOLOGY ASSESSMENT", "Industry: " + industry, "Business size: " + size, "Timing: " + timing, "", ...answers, "", "Biggest challenge:", challenge, "", "Consent: Contact about this assessment only"].join("\\n");
      if (!String(fields.get("business") ?? "").trim()) throw new ValidationError("Please enter your business name.");
    }
    const inquiry: Inquiry = {
      id,
      createdAt: new Date().toISOString(),
      name: text(fields.get("name"), "Name", 120, true),
      email: email(fields.get("email")),
      phone: text(fields.get("phone") ?? "", "Phone", 40),
      business: text(fields.get("business") ?? "", "Business", 160),
      service: text(fields.get("service") ?? "", "Service", 80),
      message: isAssessment ? assessmentMessage : text(fields.get("message"), "Message", 5000, true),
      page: new URL(
        request.headers.get("referer") ?? context.site.url ?? request.url,
      ).pathname.slice(0, 200),
      status: "new",
      notification: "not-configured",
    };
    if (inquiry.message.length < 10)
      throw new ValidationError(
        "Please include a little more detail in your message.",
      );
    const store = storeFor(context);
    const result = await store.setJSON(`inquiries/${id}`, inquiry, {
      onlyIfNew: true,
    });
    if (result.modified) {
      const intakeForward = forwardInquiryToIronwood(inquiry).catch((error) => {
        console.error(
          error instanceof Error
            ? error.message
            : "Ironwood intake forwarding failed.",
        );
      });
      if (typeof context.waitUntil === "function")
        context.waitUntil(intakeForward);
      else await intakeForward;
      try {
        const { content } = await readContent(context);
        try {
          inquiry.notification = await deliver(
            context,
            content.settings.notificationEmail,
            inquiry,
          );
        } catch {
          inquiry.notification = "failed";
          console.error("Inquiry saved; email notification failed.");
        }
        await store.setJSON(`inquiries/${id}`, inquiry, {
          onlyIfMatch: result.etag,
        });
      } catch {
        console.error(
          "Inquiry saved; notification status could not be updated.",
        );
      }
    }
    return response(
      "Your message has been received. We’ll be in touch.",
      200,
      id,
    );
  } catch (error) {
    if (error instanceof ValidationError) return response(error.message, 400);
    console.error("Inquiry could not be saved.");
    return response(
      "We couldn’t save your message. Please try again or use the email link on the website.",
      503,
    );
  }
}
export const config: Config = {
  path: "/api/inquiries",
  method: ["POST"],
  rateLimit: { windowLimit: 6, windowSize: 60, aggregateBy: "ip" },
};
