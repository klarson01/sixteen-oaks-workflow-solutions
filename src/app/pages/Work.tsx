import type { CSSProperties } from "react";
import Contact from "../components/Contact";

export default function Work() {
  return (
    <>
      <section className="page-intro work-intro" id="top">
        <div className="container work-intro-grid">
          <div>
            <p
              className="eyebrow"
              data-hero=""
              style={{ "--order": "0" } as CSSProperties}
            >
              Our work
            </p>
            <h1 data-hero="" style={{ "--order": "1" } as CSSProperties}>
              Built around
              <br />
              <em>real businesses.</em>
            </h1>
          </div>
          <p data-hero="" style={{ "--order": "2" } as CSSProperties}>
            Every project starts with understanding the business. Here’s a
            closer look at how that becomes a useful, welcoming online
            experience.
          </p>
        </div>
      </section>
      <article
        className="light-section section case-study"
        id="rays-mobile-repair"
        aria-labelledby="case-title"
      >
        <div className="container">
          <div className="case-heading">
            <div data-reveal="">
              <p className="eyebrow">Featured project</p>
              <h2 id="case-title">Ray’s Mobile Repair.</h2>
              <p>A local business. A clear online home.</p>
            </div>
            <a
              className="text-link"
              href="https://www.raysmobilerepair.com/"
              target="_blank"
              rel="noopener noreferrer"
              data-reveal=""
            >
              Visit Ray’s website
              <span className="sr-only"> (opens in a new tab)</span>
              <svg className="arrow" viewBox="0 0 24 24" aria-hidden="true">
                <path d="M4 12h15m-6-6 6 6-6 6"></path>
              </svg>
            </a>
          </div>
          <dl className="case-meta" data-reveal="">
            <div>
              <dt>Business</dt>
              <dd>Mobile repair &amp; fleet service</dd>
            </div>
            <div>
              <dt>Location</dt>
              <dd>Monroe, Wisconsin</dd>
            </div>
            <div>
              <dt>Project</dt>
              <dd>Custom business website</dd>
            </div>
          </dl>
          <figure className="case-figure" data-reveal="">
            <a
              className="work-preview"
              href="https://www.raysmobilerepair.com/"
              target="_blank"
              rel="noopener noreferrer"
              aria-label="Visit Ray’s Mobile Repair website (opens in a new tab)"
            >
              <img
                src="/assets/rays-mobile-repair-website.jpg"
                width="1348"
                height="926"
                alt="Ray’s Mobile Repair website, with its green and gold branding, service truck, and clear Call Now and Request Service buttons."
                loading="eager"
                decoding="async"
              />
            </a>
            <figcaption>
              The Ray’s Mobile Repair homepage, with direct paths to call or
              request service.
            </figcaption>
          </figure>
          <div className="case-story">
            <section data-reveal="" aria-labelledby="case-need">
              <p className="case-index">01 / THE NEED</p>
              <h3 id="case-need">Make the next step clear.</h3>
              <p>
                Give a local mobile repair business a clear online home. Explain
                the services, introduce the business, and help customers reach
                Ray when a truck or piece of equipment needs attention.
              </p>
            </section>
            <section data-reveal="" aria-labelledby="case-build">
              <p className="case-index">02 / OUR WORK</p>
              <h3 id="case-build">Build around the business.</h3>
              <p>
                A custom, mobile-friendly website shaped around Ray’s branding,
                service offering, and story. Dedicated pages cover repair
                services, fleet support, hiring, and customer contact.
              </p>
            </section>
            <section data-reveal="" aria-labelledby="case-experience">
              <p className="case-index">03 / THE EXPERIENCE</p>
              <h3 id="case-experience">Connect people to help.</h3>
              <p>
                Visitors can call for urgent repair, send a service request,
                explore fleet support, or apply for a job. Each path supports a
                real part of the business’s day.
              </p>
            </section>
          </div>
          <div className="case-delivered" data-reveal="">
            <h3>What went into it.</h3>
            <ul>
              <li>Business discovery &amp; content planning</li>
              <li>Custom website design</li>
              <li>Responsive mobile layouts</li>
              <li>Service &amp; fleet pages</li>
              <li>Contact &amp; hiring forms</li>
              <li>Launch &amp; domain setup</li>
            </ul>
          </div>
        </div>
      </article>
      <Contact />
    </>
  );
}
