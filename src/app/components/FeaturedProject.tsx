import { useSite } from "../../content/context";
import { imageSrcSet } from "../lib/images";
import { publishedProjects, projectUrl } from "../../content/model";
export default function FeaturedProject() {
  const { content } = useSite();
  const p = publishedProjects(content).find(
    (p) => p.id === content.settings.featuredProjectId,
  );
  if (!p) return null;
  return (
    <section
      className="section featured-work"
      aria-labelledby="featured-work-title"
    >
      <div className="container featured-work-grid">
        <a
          className="work-preview"
          href={projectUrl(p)}
          data-reveal=""
          aria-label={`Explore ${p.title}`}
        >
          <img
            src={p.cover.src}
            srcSet={imageSrcSet(p.cover.src, p.cover.width)}
            sizes="(max-width: 700px) calc(100vw - 32px), 50vw"
            alt={p.cover.alt}
            width={p.cover.width}
            height={p.cover.height}
            loading="lazy"
            decoding="async"
          />
        </a>
        <div className="featured-work-copy" data-reveal="">
          <p className="eyebrow">Our work</p>
          <h2 id="featured-work-title">{p.title}.</h2>
          <p className="project-category">
            {p.category} · {p.location}
          </p>
          <p>{p.summary}</p>
          <a className="text-link" href={projectUrl(p)}>
            Explore the project <span aria-hidden="true">→</span>
          </a>
        </div>
      </div>
    </section>
  );
}
