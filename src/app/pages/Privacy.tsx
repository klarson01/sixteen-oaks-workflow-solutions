import type { CSSProperties } from "react";

export default function Privacy() {
  return (
    <>
      <section className="page-intro" id="top">
        <div className="container">
          <p
            className="eyebrow"
            data-hero=""
            style={{ "--order": "0" } as CSSProperties}
          >
            Privacy policy
          </p>
          <h1 data-hero="" style={{ "--order": "1" } as CSSProperties}>
            Clear about the
            <br />
            <em>information you share.</em>
          </h1>
          <p data-hero="" style={{ "--order": "2" } as CSSProperties}>
            This notice explains what this website collects, why we use it,
            and the choices you have.
          </p>
        </div>
      </section>

      <section className="light-section section legal-section">
        <div className="container legal-layout">
          <aside className="legal-summary" aria-label="Policy summary">
            <p className="eyebrow">In plain language</p>
            <p>
              We collect only what helps us answer inquiries, operate the
              website, and provide the optional AI Opportunity Finder. We do
              not sell personal information or use advertising trackers.
            </p>
            <p className="legal-date">
              Effective and last updated September 17, 2026
            </p>
          </aside>

          <div className="legal-content">
            <section aria-labelledby="privacy-who">
              <h2 id="privacy-who">Who this policy covers</h2>
              <p>
                This Privacy Policy applies to the Sixteen Oaks Workflow
                Solutions website at sixteenoaksllc.com. It does not control
                the privacy practices of customer websites or other sites we
                link to.
              </p>
            </section>

            <section aria-labelledby="privacy-collect">
              <h2 id="privacy-collect">Information we collect</h2>
              <h3>Contact inquiries</h3>
              <p>
                When you send the contact form, we collect your name, email
                address, message, selected service, and the page where the form
                was submitted. You may also choose to provide a phone number
                and business name. We record the submission time and its
                follow-up status.
              </p>
              <h3>AI Opportunity Finder</h3>
              <p>
                When you use the finder, your selected business type and the
                description you enter are sent to an AI service to generate a
                suggestion. Do not include customer names, confidential
                information, account details, health information, or other
                sensitive data.
              </p>
              <p>
                Sixteen Oaks does not intentionally save the finder description
                in its inquiry inbox unless you choose to add the resulting idea
                to the contact form and submit it.
              </p>
              <h3>Technical and preference information</h3>
              <p>
                Our hosting provider may automatically process information such
                as IP address, browser and device details, request times, and
                security or performance data to deliver and protect the site.
                The site also stores your reduced-motion preference in your
                browser when you use that control.
              </p>
              <p>
                The public website does not currently use advertising cookies,
                cross-site advertising trackers, or visitor analytics. The
                private administrator area uses an authentication session to
                keep access restricted.
              </p>
            </section>

            <section aria-labelledby="privacy-use">
              <h2 id="privacy-use">How we use information</h2>
              <ul>
                <li>Respond to questions and discuss potential work.</li>
                <li>Generate the AI suggestion you request.</li>
                <li>Operate, secure, troubleshoot, and improve the website.</li>
                <li>Maintain appropriate business and communication records.</li>
                <li>Comply with legal obligations and protect our rights.</li>
              </ul>
            </section>

            <section aria-labelledby="privacy-providers">
              <h2 id="privacy-providers">Service providers and sharing</h2>
              <p>
                We use service providers only where needed to run these
                features. Netlify hosts the website, functions, stored inquiry
                records, and administrator sign-in. Google email services may
                deliver inquiry notifications. The AI Opportunity Finder sends
                its request to OpenAI through our hosted server configuration.
              </p>
              <p>
                OpenAI states that API data is not used to train its models
                unless the account holder opts in. Its standard abuse-monitoring
                logs may retain prompts and responses for up to 30 days, subject
                to its policies and legal requirements. See the
                {" "}
                <a href="https://developers.openai.com/api/docs/guides/your-data">
                  OpenAI API data controls
                </a>
                {" "}and
                {" "}
                <a href="https://www.netlify.com/privacy/">
                  Netlify Privacy Policy
                </a>
                {" "}for provider details.
              </p>
              <p>
                We do not sell personal information or share it for
                cross-context behavioral advertising. We may disclose
                information when required by law, to protect people or systems,
                or as part of a business transfer where permitted by law.
              </p>
            </section>

            <section aria-labelledby="privacy-retention">
              <h2 id="privacy-retention">Retention and security</h2>
              <p>
                Inquiry records are retained for customer service, business
                recordkeeping, security, and legal purposes. We keep them only
                as long as reasonably needed for those purposes. You may ask us
                to delete an inquiry, although we may retain information where
                reasonably necessary or legally required.
              </p>
              <p>
                We use reasonable administrative and technical safeguards,
                including HTTPS, restricted administrator access, and protected
                server-side storage. No online service or email transmission can
                be guaranteed completely secure.
              </p>
            </section>

            <section aria-labelledby="privacy-choices">
              <h2 id="privacy-choices">Your choices</h2>
              <p>
                You may contact us to request access to, correction of, or
                deletion of personal information you submitted through this
                website. You can use the website without the AI Opportunity
                Finder and can contact us directly by email or phone instead of
                submitting the form.
              </p>
            </section>

            <section aria-labelledby="privacy-children">
              <h2 id="privacy-children">Children’s privacy</h2>
              <p>
                This business website is not directed to children under 13, and
                we do not knowingly collect personal information from them. If
                you believe a child submitted information, contact us so we can
                review and remove it.
              </p>
            </section>

            <section aria-labelledby="privacy-updates">
              <h2 id="privacy-updates">Policy updates</h2>
              <p>
                We may update this policy when the website or our practices
                change. The date near the top of the page shows the latest
                revision.
              </p>
            </section>

            <section aria-labelledby="privacy-contact">
              <h2 id="privacy-contact">Contact us</h2>
              <p>
                Questions or privacy requests can be sent to
                {" "}
                <a href="mailto:kevin.larson@sixteenoaksllc.com">
                  kevin.larson@sixteenoaksllc.com
                </a>
                {" "}or made by phone at
                {" "}
                <a href="tel:+16085585639">608.558.5639</a>.
              </p>
            </section>
          </div>
        </div>
      </section>
    </>
  );
}
