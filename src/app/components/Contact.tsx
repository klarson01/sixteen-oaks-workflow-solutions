import { useSite } from "../../content/context";
export default function Contact() {
  const {
    content: { settings },
    formToken,
  } = useSite();
  return (
    <section
      className="contact-section"
      id="contact"
      aria-labelledby="contact-title"
    >
      <div className="container contact-grid">
        <div data-reveal="">
          <p className="eyebrow">A conversation is a good place to start</p>
          <h2 id="contact-title">
            What could a<br />
            <em>better day look like?</em>
          </h2>
          <p className="contact-lead">
            Tell us about your business and what you’d like to make possible.
          </p>
          <div className="contact-details">
            <a href={`mailto:${settings.publicEmail}`}>
              {settings.publicEmail}
            </a>
            <a href={`tel:${settings.phone.replace(/[^+\d]/g, "")}`}>
              {settings.phone}
            </a>
          </div>
        </div>
        <form
          className="inquiry-form"
          method="post"
          action="/api/inquiries"
          data-inquiry-form=""
          data-reveal=""
        >
          <input type="hidden" name="formToken" value={formToken} />
          <div className="form-trap" aria-hidden="true">
            <label>
              Leave this field empty
              <input name="website" tabIndex={-1} autoComplete="off" />
            </label>
          </div>
          <div className="form-row">
            <label htmlFor="contact-name">
              Your name
              <input
                id="contact-name"
                name="name"
                autoComplete="name"
                required
                maxLength={120}
              />
            </label>
            <label htmlFor="contact-email">
              Email
              <input
                id="contact-email"
                name="email"
                type="email"
                autoComplete="email"
                required
                maxLength={254}
              />
            </label>
          </div>
          <div className="form-row">
            <label htmlFor="contact-business">
              Business <span>(optional)</span>
              <input
                id="contact-business"
                name="business"
                autoComplete="organization"
                maxLength={160}
              />
            </label>
            <label htmlFor="contact-phone">
              Phone <span>(optional)</span>
              <input
                id="contact-phone"
                name="phone"
                type="tel"
                autoComplete="tel"
                maxLength={40}
              />
            </label>
          </div>
          <label htmlFor="contact-service">
            What can we help with?
            <select id="contact-service" name="service">
              <option>Let’s explore</option>
              <option>Website</option>
              <option>AI &amp; automation</option>
              <option>Custom application</option>
            </select>
          </label>
          <label htmlFor="contact-message">
            Tell us a little about your project
            <textarea
              id="contact-message"
              name="message"
              required
              minLength={10}
              maxLength={5000}
              rows={4}
            />
          </label>
          <button className="button" type="submit">
            Send your message <span aria-hidden="true">→</span>
          </button>
          <p className="form-status" role="status" aria-live="polite" />
          <p className="form-privacy">
            We’ll use these details to respond to your inquiry. See our{" "}
            <a href="/privacy/">Privacy Policy</a>.
          </p>
        </form>
      </div>
    </section>
  );
}
