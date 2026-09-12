import type { CSSProperties } from "react";
import Contact from "../components/Contact";
import { useSite } from "../../content/context";
import { publishedProjects, projectUrl } from "../../content/model";
export default function Work() {
  const { content } = useSite();
  const projects = publishedProjects(content);
  return (
    <>
      <section className="page-intro work-intro" id="top">
        <div className="container work-intro-grid">
          <div>
            <p
              className="eyebrow"
              data-hero=""
              style={{ "--order": 0 } as CSSProperties}
            >
              Our work
            </p>
            <h1 data-hero="" style={{ "--order": 1 } as CSSProperties}>
              Built around
              <br />
              <em>real businesses.</em>
            </h1>
          </div>
          <p data-hero="" style={{ "--order": 2 } as CSSProperties}>
            Every project starts with understanding the business. Explore the
            websites, workflows, and applications we build around it.
          </p>
        </div>
      </section>
      <section className="light-section section">
        <div className="container">
          <div className="project-grid">
            {projects.map((p) => (
              <article
                className="project-card"
                id={p.slug}
                key={p.id}
                data-reveal=""
              >
                <a
                  href={projectUrl(p)}
                  className="work-preview"
                  aria-label={`Explore ${p.title}`}
                >
                  <img
                    src={p.cover.src}
                    alt={p.cover.alt}
                    width={p.cover.width}
                    height={p.cover.height}
                    loading="lazy"
                    decoding="async"
                  />
                </a>
                <div className="project-card-copy">
                  <p className="project-category">{p.category}</p>
                  <h2>
                    <a href={projectUrl(p)}>{p.title}</a>
                  </h2>
                  <p>{p.summary}</p>
                  <a className="text-link" href={projectUrl(p)}>
                    Explore the project <span aria-hidden="true">→</span>
                  </a>
                </div>
              </article>
            ))}
          </div>
          {!projects.length && (
            <p>
              More work is on the way. Get in touch to discuss your project.
            </p>
          )}
        </div>
      </section>
      <Contact />
    </>
  );
}
