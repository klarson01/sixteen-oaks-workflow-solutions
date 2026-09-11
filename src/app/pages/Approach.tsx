import type { CSSProperties } from "react";
import Contact from "../components/Contact";

export default function Approach() {
  return (
    <>
      <section className="page-intro" id="top">
        <div className="container">
          <p
            className="eyebrow"
            data-hero=""
            style={{ "--order": "0" } as CSSProperties}
          >
            How we work
          </p>
          <h1 data-hero="" style={{ "--order": "1" } as CSSProperties}>
            Your business comes first.
            <br />
            <em>The technology follows.</em>
          </h1>
          <p data-hero="" style={{ "--order": "2" } as CSSProperties}>
            Thoughtful questions. Clear next steps. Useful work. A personal
            approach to making your business day a little better.
          </p>
        </div>
      </section>
      <section
        className="light-section section"
        aria-labelledby="approach-title"
      >
        <div className="container">
          <div data-reveal="">
            <div className="approach-banner">
              <img
                src="/assets/oak-landscape.webp"
                srcSet="/assets/oak-landscape-768.webp 768w, /assets/oak-landscape.webp 1536w"
                sizes="100vw"
                width="1536"
                height="1024"
                alt="A mature oak spreading its canopy over a sunlit meadow."
                loading="lazy"
                decoding="async"
              />
            </div>
          </div>
          <h2 className="approach-heading" id="approach-title" data-reveal="">
            A clear path.
            <br />
            At a pace that makes sense.
          </h2>
          <div className="approach-step" data-reveal="">
            <span className="step-number">01 /</span>
            <h3>Begin with a conversation.</h3>
            <p>
              We learn about your business, customers, and routines. Together,
              we find the work that takes too much time and the opportunities
              you care about most.
            </p>
          </div>
          <div className="approach-step" data-reveal="">
            <span className="step-number">02 /</span>
            <h3>Define a useful first step.</h3>
            <p>
              We agree on a focused scope, what it needs to accomplish, and how
              the work will be delivered. You know what you’re getting before we
              build.
            </p>
          </div>
          <div className="approach-step" data-reveal="">
            <span className="step-number">03 /</span>
            <h3>Build it around real work.</h3>
            <p>
              We create the website, workflow, or tool and review it with you.
              Your feedback and everyday scenarios help shape the details.
            </p>
          </div>
          <div className="approach-step" data-reveal="">
            <span className="step-number">04 /</span>
            <h3>Make it yours.</h3>
            <p>
              We walk you through the result, help your team feel comfortable,
              and agree on any ongoing care. Your next step stays clear.
            </p>
          </div>
        </div>
      </section>
      <section className="section" aria-labelledby="grounded-title">
        <div className="container grounded-grid">
          <div data-reveal="">
            <p className="eyebrow">Local roots. Practical experience.</p>
            <h2 id="grounded-title">
              Built on understanding
              <br />
              how people work.
            </h2>
          </div>
          <div className="grounded-copy" data-reveal="">
            <p>
              Sixteen Oaks is led by Kevin Larson in Monroe, Wisconsin. His
              background spans technology, project management, operations, and
              real estate.
            </p>
            <p>
              That experience shapes a straightforward belief: a good solution
              should respect your time, make sense to your team, and help you do
              the work that matters.
            </p>
            <div className="grounded-signature">Kevin Larson</div>
            <p className="grounded-title">Sixteen Oaks Workflow Solutions</p>
          </div>
        </div>
      </section>
      <Contact />
    </>
  );
}
