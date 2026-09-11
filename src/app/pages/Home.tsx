import type { CSSProperties } from "react";
import Contact from "../components/Contact";

export default function Home() {
  return (
    <>
      <section className="hero" id="top" aria-labelledby="hero-title">
        <div className="container">
          <div className="hero-grid">
            <div className="hero-copy">
              <p
                className="eyebrow"
                data-hero=""
                style={{ "--order": "0" } as CSSProperties}
              >
                Thoughtful technology. Everyday possibility.
              </p>
              <h1 id="hero-title">
                <span data-hero="" style={{ "--order": "1" } as CSSProperties}>
                  Good business.
                </span>
                <span data-hero="" style={{ "--order": "2" } as CSSProperties}>
                  <em>Less busywork.</em>
                </span>
              </h1>
              <p
                className="hero-description"
                data-hero=""
                style={{ "--order": "3" } as CSSProperties}
              >
                Practical AI and websites built around your business. So you can
                spend less time managing the work, and more time doing what you
                do best.
              </p>
              <div
                className="hero-actions"
                data-hero=""
                style={{ "--order": "4" } as CSSProperties}
              >
                <a className="button" href="/#contact">
                  Let’s make room for better
                  <svg className="arrow" viewBox="0 0 24 24" aria-hidden="true">
                    <path d="M4 12h15m-6-6 6 6-6 6"></path>
                  </svg>
                </a>
                <a className="text-link" href="/services/">
                  Explore our services
                  <svg className="arrow" viewBox="0 0 24 24" aria-hidden="true">
                    <path d="M4 12h15m-6-6 6 6-6 6"></path>
                  </svg>
                </a>
              </div>
              <div
                className="hero-footnote"
                data-hero=""
                style={{ "--order": "5" } as CSSProperties}
              >
                <svg
                  className="small-sun"
                  viewBox="0 0 20 20"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="1.2"
                  aria-hidden="true"
                >
                  <circle cx="10" cy="10" r="3"></circle>
                  <path d="M10 0v4m0 12v4M0 10h4m12 0h4M3 3l3 3m8 8 3 3M3 17l3-3M14 6l3-3"></path>
                </svg>
                Rooted in Wisconsin. Built around you.
              </div>
            </div>
            <figure
              className="hero-visual"
              data-hero=""
              style={{ "--order": "2" } as CSSProperties}
            >
              <div className="hero-image-frame">
                <img
                  src="/assets/oak-landscape.webp"
                  srcSet="/assets/oak-landscape-768.webp 768w, /assets/oak-landscape.webp 1536w"
                  sizes="(max-width: 640px) 100vw, 45vw"
                  width="1536"
                  height="1024"
                  alt="A mature oak spreading its canopy over a sunlit meadow."
                  loading="eager"
                  decoding="async"
                  {...{ fetchpriority: "high" }}
                />
              </div>
              <figcaption className="hero-caption">
                <span>Strong roots. Thoughtful growth.</span>
                <span className="caption-index">SIXTEEN OAKS</span>
              </figcaption>
            </figure>
          </div>
          <div className="hero-bottom">
            <span>For the people behind small businesses.</span>
            <a href="#services">
              A little more possibility{" "}
              <svg className="arrow" viewBox="0 0 24 24" aria-hidden="true">
                <path d="M12 4v15m-6-6 6 6 6-6"></path>
              </svg>
            </a>
          </div>
        </div>
      </section>
      <section
        className="light-section section"
        id="services"
        aria-labelledby="services-title"
      >
        <div className="container">
          <div className="section-heading">
            <div data-reveal="">
              <p className="eyebrow">What we do</p>
              <h2 id="services-title">
                Technology that fits
                <br />
                your business.
              </h2>
            </div>
            <p data-reveal="">
              You’ve built something worth caring about. We bring the same care
              to the tools, websites, and workflows that help it grow.
            </p>
          </div>
          <div className="services-grid">
            <article className="service-card" data-reveal="">
              <div className="service-card-top">
                <span>01 / YOUR ONLINE PRESENCE</span>
                <svg
                  className="service-icon"
                  viewBox="0 0 32 32"
                  aria-hidden="true"
                >
                  <rect x="3" y="5" width="26" height="19" rx="1"></rect>
                  <path d="M3 10h26M11 29h10m-5-5v5M7 7.5h1m2 0h1"></path>
                </svg>
              </div>
              <h3>A website that’s yours.</h3>
              <p>
                Thoughtfully designed around your business, your customers, and
                what makes you different.
              </p>
              <a className="card-link" href="/services/#websites">
                Custom websites{" "}
                <svg className="arrow" viewBox="0 0 24 24" aria-hidden="true">
                  <path d="M4 12h15m-6-6 6 6-6 6"></path>
                </svg>
              </a>
            </article>
            <article className="service-card" data-reveal="">
              <div className="service-card-top">
                <span>02 / YOUR EVERYDAY WORK</span>
                <svg
                  className="service-icon"
                  viewBox="0 0 32 32"
                  aria-hidden="true"
                >
                  <path d="m16 3 3.5 9.5L29 16l-9.5 3.5L16 29l-3.5-9.5L3 16l9.5-3.5Z"></path>
                  <path d="M16 11v10m-5-5h10"></path>
                </svg>
              </div>
              <h3>AI with a purpose.</h3>
              <p>
                Practical help with the repetitive work. Clear guidance to make
                AI useful in your day.
              </p>
              <a className="card-link" href="/services/#practical-ai">
                Practical AI &amp; automation{" "}
                <svg className="arrow" viewBox="0 0 24 24" aria-hidden="true">
                  <path d="M4 12h15m-6-6 6 6-6 6"></path>
                </svg>
              </a>
            </article>
            <article className="service-card" data-reveal="">
              <div className="service-card-top">
                <span>03 / YOUR WAY OF WORKING</span>
                <svg
                  className="service-icon"
                  viewBox="0 0 32 32"
                  aria-hidden="true"
                >
                  <rect x="3" y="3" width="9" height="9" rx="1"></rect>
                  <rect x="20" y="20" width="9" height="9" rx="1"></rect>
                  <path d="M16 7.5h8.5V16M7.5 16v8.5H16m-2-2 2 2-2 2m8.5-12 2 2 2-2"></path>
                </svg>
              </div>
              <h3>Less friction. More flow.</h3>
              <p>
                Connected workflows and custom tools that turn scattered tasks
                into a clearer way forward.
              </p>
              <a className="card-link" href="/services/#custom-workflows">
                Workflows &amp; applications{" "}
                <svg className="arrow" viewBox="0 0 24 24" aria-hidden="true">
                  <path d="M4 12h15m-6-6 6 6-6 6"></path>
                </svg>
              </a>
            </article>
          </div>
        </div>
      </section>
      <section
        className="section featured-work"
        aria-labelledby="featured-work-title"
      >
        <div className="container featured-work-grid">
          <a
            className="work-preview"
            href="/work/#rays-mobile-repair"
            data-reveal=""
            aria-label="Explore the Ray’s Mobile Repair project"
          >
            <img
              src="/assets/rays-mobile-repair-website.jpg"
              width="1348"
              height="926"
              alt="Ray’s Mobile Repair website, with its green and gold branding, service truck, and clear Call Now and Request Service buttons."
              loading="lazy"
              decoding="async"
            />
          </a>
          <div className="featured-work-copy" data-reveal="">
            <p className="eyebrow">Our work</p>
            <h2 id="featured-work-title">Ray’s Mobile Repair.</h2>
            <p className="project-category">
              Custom website · Monroe, Wisconsin
            </p>
            <p>
              A website built around a local business and the customers who
              count on it. Clear services, direct contact, and a place for the
              business to grow.
            </p>
            <a className="text-link" href="/work/#rays-mobile-repair">
              Explore the project
              <svg className="arrow" viewBox="0 0 24 24" aria-hidden="true">
                <path d="M4 12h15m-6-6 6 6-6 6"></path>
              </svg>
            </a>
          </div>
        </div>
      </section>
      <section className="section" aria-labelledby="principle-title">
        <div className="container principle-grid">
          <div className="principle-copy" data-reveal="">
            <p className="eyebrow">The Sixteen Oaks approach</p>
            <h2 id="principle-title">
              Start with your day.
              <br />
              <em>Make room for better.</em>
            </h2>
            <p>
              Good technology starts with understanding people. We take time to
              learn how your business works, then make the next step feel
              manageable.
            </p>
            <a className="text-link" href="/approach/">
              How we work together
              <svg className="arrow" viewBox="0 0 24 24" aria-hidden="true">
                <path d="M4 12h15m-6-6 6 6-6 6"></path>
              </svg>
            </a>
          </div>
          <ol className="steps">
            <li className="step" data-reveal="">
              <span className="step-number">01</span>
              <div>
                <h3>Listen first.</h3>
                <p>
                  Your goals, your routines, and the little things taking more
                  time than they should.
                </p>
              </div>
            </li>
            <li className="step" data-reveal="">
              <span className="step-number">02</span>
              <div>
                <h3>Build what matters.</h3>
                <p>
                  A focused solution that fits your business and the people who
                  will use it.
                </p>
              </div>
            </li>
            <li className="step" data-reveal="">
              <span className="step-number">03</span>
              <div>
                <h3>Make it feel natural.</h3>
                <p>
                  Clear guidance, a thoughtful handoff, and a plan for what
                  comes next.
                </p>
              </div>
            </li>
          </ol>
        </div>
      </section>
      <Contact />
    </>
  );
}
