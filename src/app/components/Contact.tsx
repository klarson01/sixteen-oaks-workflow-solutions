export default function Contact() {
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
        </div>
        <div className="contact-actions" data-reveal="">
          <p>
            Tell us about your business, the work that slows you down, and what
            you’d like to make possible.
          </p>
          <a
            className="button"
            href="mailto:kevin.larson@sixteenoaksllc.com?subject=Let%E2%80%99s%20talk%20about%20my%20business"
          >
            Let’s talk about your business
            <svg className="arrow" viewBox="0 0 24 24" aria-hidden="true">
              <path d="M4 12h15m-6-6 6 6-6 6"></path>
            </svg>
          </a>
          <div className="contact-details">
            <a href="mailto:kevin.larson@sixteenoaksllc.com">
              kevin.larson@sixteenoaksllc.com
            </a>
            <a href="tel:+16085585639">608.558.5639</a>
          </div>
        </div>
      </div>
    </section>
  );
}
