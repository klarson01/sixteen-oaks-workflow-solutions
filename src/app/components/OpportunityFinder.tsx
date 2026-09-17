import { useSite } from "../../content/context";
import {
  businessTypes,
  exampleOpportunity as example,
} from "../../content/opportunity";
export default function OpportunityFinder() {
  const { formToken } = useSite();
  return (
    <section
      className="section opportunity-section"
      id="ai-opportunity"
      aria-labelledby="opportunity-title"
    >
      <div className="container">
        <div className="opportunity-heading" data-reveal="">
          <div>
            <p className="eyebrow">Practical AI. Built around your business.</p>
            <h2 id="opportunity-title">
              Where could AI
              <br />
              <em>give you time back?</em>
            </h2>
          </div>
          <p>
            Tell us what slows your day down. Explore a useful place to start.
          </p>
        </div>
        <div className="opportunity-panel" data-opportunity="" data-reveal="">
          <form
            data-opportunity-form=""
            method="post"
            action="/api/opportunity"
          >
            <input type="hidden" name="formToken" value={formToken} />
            <p className="eyebrow">01 / Your business</p>
            <fieldset className="business-choices">
              <legend>What kind of business do you run?</legend>
              {businessTypes.map((type, i) => (
                <label key={type}>
                  <input
                    type="radio"
                    name="businessType"
                    value={type}
                    defaultChecked={i === 0}
                  />
                  <span>{type}</span>
                </label>
              ))}
            </fieldset>
            <label className="challenge-label" htmlFor="opportunity-challenge">
              What takes too much time?
              <textarea
                id="opportunity-challenge"
                name="challenge"
                rows={4}
                minLength={15}
                maxLength={1200}
                required
                placeholder="For example: following up on estimates after a busy day."
                aria-describedby="opportunity-privacy"
              />
            </label>
            <p id="opportunity-privacy" className="finder-note">
              Your description is sent to an AI service to generate a
              suggestion. Keep names, customer details, and confidential
              information out. See our <a href="/privacy/">Privacy Policy</a>.
            </p>
            <div className="finder-actions finder-live-action">
              <button className="button" type="submit" data-find-opportunity="">
                Find my opportunity <span aria-hidden="true">→</span>
              </button>
              <button
                className="finder-example"
                type="button"
                data-show-example=""
              >
                Try an example
              </button>
            </div>
            <p
              className="finder-status"
              data-finder-status=""
              role="status"
              aria-live="polite"
            />
            <noscript>
              <p>
                To generate a suggestion, enable JavaScript or{" "}
                <a href="#contact">tell Kevin about your business</a>.
              </p>
              <style>{".finder-live-action {display:none!important}"}</style>
            </noscript>
          </form>
          <div
            className="opportunity-result"
            data-opportunity-result=""
            aria-labelledby="opportunity-result-title"
          >
            <p className="eyebrow" data-result-label="">
              02 / An example
            </p>
            <h3
              id="opportunity-result-title"
              tabIndex={-1}
              data-result-title=""
            >
              {example.title}
            </h3>
            <p data-result-summary="">{example.summary}</p>
            <ol className="opportunity-steps">
              {example.steps.map((step, i) => (
                <li key={i}>
                  <span aria-hidden="true">{i + 1}</span>
                  <p data-result-step="">{step}</p>
                </li>
              ))}
            </ol>
            <div className="opportunity-first">
              <p className="eyebrow">Start small</p>
              <p data-result-first="">{example.firstStep}</p>
            </div>
            <p className="finder-note" data-result-note="">
              An illustrative example. Your suggestion will appear here.
            </p>
            <button
              className="button finder-discuss finder-live-action"
              type="button"
              data-discuss-opportunity=""
              hidden
            >
              Explore this with Kevin <span aria-hidden="true">→</span>
            </button>
            <p className="finder-note" data-review-note="" hidden>
              You’ll review your inquiry before anything is sent.
            </p>
          </div>
        </div>
        <p className="opportunity-footnote">
          A helpful first step. A real conversation when you’re ready.
        </p>
      </div>
    </section>
  );
}
