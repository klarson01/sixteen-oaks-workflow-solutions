import { useSite } from "../../content/context";
import { homepageFor } from "../../content/homepage";
import FeaturedProject from "../components/FeaturedProject";
import type { CSSProperties } from "react";
import { Monitor, Settings, ChartNoAxesCombined, UsersRound, MapPin } from "lucide-react";
import OpportunityFinder from "../components/OpportunityFinder";
import Contact from "../components/Contact";
import { imageSrcSet } from "../lib/images";

function Arrow() {
  return <svg className="arrow" viewBox="0 0 24 24" aria-hidden="true"><path d="M4 12h15m-6-6 6 6-6 6" /></svg>;
}
const services = [
  { href: "/services/#websites", Icon: Monitor },
  { href: "/services/#practical-ai", Icon: Settings },
  { href: "/services/#custom-workflows", Icon: ChartNoAxesCombined },
  { href: "/approach/", Icon: UsersRound },
];

export default function Home() {
  const { content } = useSite();
  const home = homepageFor(content);
  return (
    <div className="mainstreet-home">
      <section className="hero" id="top" aria-labelledby="hero-title">
        <div className="container mainstreet-hero-grid">
          <div className="hero-copy">
            <p className="eyebrow">
              <span className="editable-lines">{home.eyebrow}</span>
            </p>
            <h1 id="hero-title">
              <span>{home.headline}</span>
              <span><em>{home.headlineAccent}</em></span>
            </h1>
            <p className="hero-description">
              {home.description}
            </p>
            <div className="hero-actions" data-hero="" style={{ "--order": "4" } as CSSProperties}>
              <a className="button" href="/#contact">{home.primaryLabel} <Arrow /></a>
              <a className="text-link" href="#ai-opportunity">{home.secondaryLabel} <Arrow /></a>
            </div>
            <div className="hero-footnote" data-hero="" style={{ "--order": "5" } as CSSProperties}>
              <MapPin size={23} strokeWidth={1.4} aria-hidden="true" />
              {home.footnote}
            </div>
          </div>
          <figure className="hero-visual">
            <div className="hero-image-frame">
              <img src={home.heroImage.src} srcSet={imageSrcSet(home.heroImage.src, home.heroImage.width)} sizes="(max-width: 640px) calc(100vw - 32px), 40vw" width={home.heroImage.width} height={home.heroImage.height} alt={home.heroImage.alt} loading="eager" decoding="async" {...{ fetchpriority: "high" }} />
            </div>
          </figure>
          <aside className="hero-margin" aria-label="Our promise">
            <svg className="oak-outline" viewBox="0 0 110 220" fill="none" stroke="currentColor" strokeWidth="3" aria-hidden="true">
              <path d="M49 205C25 174 8 157 13 146c3-6 12-1 17 3-20-27-27-49-15-49 5 0 10 9 15 12-13-27-19-48-7-51 8-2 12 13 17 18-7-26-4-52 8-49 8 2 8 20 11 24C62 26 77 4 89 10c14 8-6 33-11 44 12-6 24-4 24 5 0 13-18 25-27 31 18-6 28-3 26 9-2 12-19 24-36 32 21-5 28 1 22 12-6 12-29 20-35 27l-3 35Z" />
              <path d="M49 205C44 153 60 78 84 23M46 153l-20-24m22 5 32-22M51 109 38 88m22-8 27-17" />
            </svg>
            <p className="editable-lines">{home.sideNote}</p>
          </aside>
        </div>
      </section>
      <section className="service-strip" id="services" aria-label="How we help">
        <div className="container service-strip-grid">
          {services.map(({ href, Icon }, index) => (
            <a href={href} className="service-pillar" key={href}>
              <Icon size={43} strokeWidth={1.25} aria-hidden="true" />
              <h2>{home.services[index].title}</h2><p>{home.services[index].description}</p>
            </a>
          ))}
        </div>
      </section>
      <section className="community-split" aria-labelledby="community-title">
        <figure className="community-photo">
          <img src={home.communityImage.src} srcSet={imageSrcSet(home.communityImage.src, home.communityImage.width)} sizes="(max-width: 820px) 100vw, 50vw" width={home.communityImage.width} height={home.communityImage.height} alt={home.communityImage.alt} loading="lazy" decoding="async" />
          {home.communityImage.caption && <figcaption className="editable-lines">{home.communityImage.caption}</figcaption>}
        </figure>
        <div className="community-copy" data-reveal="">
          <p className="eyebrow">{home.communityEyebrow}</p>
          <h2 id="community-title"><span className="editable-lines">{home.communityHeading}</span> <em>{home.communityAccent}</em></h2>
          <p>{home.communityDescription}</p>
          <a className="button" href="/services/">{home.communityButton} <Arrow /></a>
        </div>
      </section>
      <FeaturedProject />
      <section className="landscape-cta" aria-labelledby="closing-title">
        <img className="landscape-background" src={home.closingImage.src} srcSet={imageSrcSet(home.closingImage.src, home.closingImage.width)} sizes="100vw" width={home.closingImage.width} height={home.closingImage.height} alt="" loading="lazy" decoding="async" />
        <div className="container landscape-cta-grid">
          <div><p className="eyebrow">{home.closingEyebrow}</p>
            <h2 id="closing-title"><span className="editable-lines">{home.closingHeading}</span> <em>{home.closingAccent}</em></h2>
          </div>
          <div className="landscape-action"><a className="button" href="#contact">{home.closingButton} <Arrow /></a><p>{home.closingNote}</p></div>
        </div>
      </section>
      <OpportunityFinder />
      <Contact />
    </div>
  );
}
