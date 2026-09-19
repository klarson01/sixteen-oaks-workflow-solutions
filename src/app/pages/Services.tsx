import type { CSSProperties } from "react";
import Contact from "../components/Contact";
import { serviceFaqs } from "../../content/faq";

export default function Services() {
  return (
    <>
      <section className="page-intro" id="top">
        <div className="container">
          <p
            className="eyebrow"
            data-hero=""
            style={{ "--order": "0" } as CSSProperties}
          >
            What we do
          </p>
          <h1 data-hero="" style={{ "--order": "1" } as CSSProperties}>
            The right tools.
            <br />
            <em>Room to do more.</em>
          </h1>
          <p data-hero="" style={{ "--order": "2" } as CSSProperties}>
            A stronger online presence. Less repetitive work. Systems that fit
            the way you do business. Start where it will make the most
            difference.
          </p>
        </div>
      </section>
      <section className="light-section section" aria-label="Our services">
        <div className="container">
          <article className="service-detail" id="websites">
            <span className="detail-number" data-reveal="">
              01
            </span>
            <div data-reveal="">
              <h2>Custom websites.</h2>
              <p className="detail-subtitle">
                Make your first impression feel like you.
              </p>
            </div>
            <div className="detail-body" data-reveal="">
              <p>
                A clear, welcoming website that helps customers understand your
                business and take the next step. Built around your story,
                services, and real customer needs.
              </p>
              <ul>
                <li>Business discovery and content planning</li>
                <li>Custom design for desktop, tablet, and mobile</li>
                <li>Clear service pages and contact paths</li>
                <li>Search foundations and ongoing care options</li>
              </ul>
              <p className="detail-example">
                <strong>Picture this</strong>A customer finds your service,
                understands how you can help, and knows exactly how to get in
                touch.
              </p>
            </div>
          </article>
          <article className="service-detail" id="practical-ai">
            <span className="detail-number" data-reveal="">
              02
            </span>
            <div data-reveal="">
              <h2>
                Practical AI
                <br />
                &amp; automation.
              </h2>
              <p className="detail-subtitle">
                Give the repetitive work a helping hand.
              </p>
            </div>
            <div className="detail-body" data-reveal="">
              <p>
                We help you find useful places for AI in the work you already
                do. Then we set up a practical starting point and show your team
                how to use it with confidence.
              </p>
              <ul>
                <li>Everyday workflow discovery</li>
                <li>Reusable AI skills, prompts, and guidance</li>
                <li>Drafting, summaries, and follow-up workflows</li>
                <li>Clear review steps and hands-on team training</li>
              </ul>
              <p className="detail-example">
                <strong>Picture this</strong>Job notes become a clear draft for
                an estimate or customer update, ready for your review.
              </p>
            </div>
          </article>
          <article className="service-detail" id="custom-workflows">
            <span className="detail-number" data-reveal="">
              03
            </span>
            <div data-reveal="">
              <h2>
                Connected workflows.
                <br />
                Custom applications.
              </h2>
              <p className="detail-subtitle">
                A simpler path from one task to the next.
              </p>
            </div>
            <div className="detail-body" data-reveal="">
              <p>
                When your process has outgrown a spreadsheet or scattered
                messages, we can connect the tools you use or create a focused
                application around your work.
              </p>
              <ul>
                <li>Process mapping and practical integration planning</li>
                <li>Job, task, and approval workflows</li>
                <li>Custom dashboards and small business tools</li>
                <li>Mobile-friendly workflows for people on the move</li>
              </ul>
              <p className="detail-example">
                <strong>Picture this</strong>A technician records job details on
                site. The office has what it needs to review the work and
                prepare the invoice.
              </p>
            </div>
          </article>
          <div className="service-note" data-reveal="">
            <p>
              You don’t need to have the solution figured out. Bring us the part
              of your day you’d like to make easier.
            </p>
            <a className="text-link" href="/approach/">
              See our approach
              <svg className="arrow" viewBox="0 0 24 24" aria-hidden="true">
                <path d="M4 12h15m-6-6 6 6-6 6"></path>
              </svg>
            </a>
          </div>
          <section
            className="service-faq"
            aria-labelledby="service-faq-title"
          >
            <div className="service-faq-heading" data-reveal="">
              <div>
                <p className="eyebrow">Common questions</p>
                <h2 id="service-faq-title">
                  A few helpful
                  <br />
                  <em>answers.</em>
                </h2>
              </div>
              <p>
                You don’t need to arrive with a technical plan. Start with what
                you want to make clearer, easier, or more useful.
              </p>
            </div>
            <div className="service-faq-grid">
              {serviceFaqs.map((item) => (
                <article
                  className="service-faq-item"
                  data-reveal=""
                  key={item.question}
                >
                  <h3>{item.question}</h3>
                  <p>{item.answer}</p>
                </article>
              ))}
            </div>
          </section>
        </div>
      </section>
      <Contact />
    </>
  );
}
