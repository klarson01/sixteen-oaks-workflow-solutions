import Contact from "../components/Contact";
import type { Project } from "../../content/model";
export default function ProjectPage({ project: p }: { project: Project }) {
  return (
    <>
      <section className="page-intro" id="top">
        <div className="container">
          <a className="text-link" href="/work/">
            ← All work
          </a>
          <p className="eyebrow">{p.category}</p>
          <h1>{p.title}</h1>
          <p>{p.tagline}</p>
        </div>
      </section>
      <article className="light-section section case-study">
        <div className="container">
          <div className="case-heading">
            <div>
              <p className="eyebrow">The project</p>
              <h2>{p.tagline}</h2>
            </div>
            {p.website && (
              <a
                className="text-link"
                href={p.website}
                target="_blank"
                rel="noopener noreferrer"
              >
                Visit website{" "}
                <span className="sr-only">(opens in a new tab)</span>
                <span aria-hidden="true">↗</span>
              </a>
            )}
          </div>
          <dl className="case-meta">
            <div>
              <dt>Business</dt>
              <dd>{p.business}</dd>
            </div>
            <div>
              <dt>Location</dt>
              <dd>{p.location}</dd>
            </div>
            <div>
              <dt>Project</dt>
              <dd>{p.category}</dd>
            </div>
          </dl>
          <figure className="case-figure" data-reveal="">
            <img
              src={p.cover.src}
              alt={p.cover.alt}
              width={p.cover.width}
              height={p.cover.height}
              decoding="async"
            />
            {p.cover.caption && <figcaption>{p.cover.caption}</figcaption>}
          </figure>
          <div className="case-story">
            {[
              { label: "01 / THE NEED", title: p.needTitle, text: p.need },
              { label: "02 / OUR WORK", title: p.buildTitle, text: p.build },
              {
                label: "03 / THE EXPERIENCE",
                title: p.experienceTitle,
                text: p.experience,
              },
            ]
              .filter((s) => s.text)
              .map((s) => (
                <section data-reveal="" key={s.label}>
                  <p className="case-index">{s.label}</p>
                  <h3>{s.title}</h3>
                  <p>{s.text}</p>
                </section>
              ))}
          </div>
          {!!p.delivered.length && (
            <div className="case-delivered" data-reveal="">
              <h3>What went into it.</h3>
              <ul>
                {p.delivered.map((item, i) => (
                  <li key={i}>{item}</li>
                ))}
              </ul>
            </div>
          )}
          {!!p.gallery.length && (
            <div className="project-gallery">
              {p.gallery.map((im, i) => (
                <figure key={i} data-reveal="">
                  <img
                    src={im.src}
                    alt={im.alt}
                    width={im.width}
                    height={im.height}
                    loading="lazy"
                    decoding="async"
                  />
                  {im.caption && <figcaption>{im.caption}</figcaption>}
                </figure>
              ))}
            </div>
          )}
        </div>
      </article>
      <Contact />
    </>
  );
}
