import type { CSSProperties } from "react";
import { Monitor, Settings, ChartNoAxesCombined, UsersRound, MapPin } from "lucide-react";
import OpportunityFinder from "../components/OpportunityFinder";
import Contact from "../components/Contact";

function Arrow() {
  return <svg className="arrow" viewBox="0 0 24 24" aria-hidden="true"><path d="M4 12h15m-6-6 6 6-6 6" /></svg>;
}
const services = [
  { title: "Websites", description: "Modern, effective websites that work for your business.", href: "/services/#websites", Icon: Monitor },
  { title: "Automation", description: "Streamline everyday tasks with practical AI.", href: "/services/#practical-ai", Icon: Settings },
  { title: "Workflow systems", description: "Tools that fit the way your business works.", href: "/services/#custom-workflows", Icon: ChartNoAxesCombined },
  { title: "Real support", description: "A partner who understands your world.", href: "/approach/", Icon: UsersRound },
];

export default function Home() {
  return (
    <div className="mainstreet-home">
      <section className="hero" id="top" aria-labelledby="hero-title">
        <div className="container mainstreet-hero-grid">
          <div className="hero-copy">
            <p className="eyebrow" data-hero="" style={{ "--order": "0" } as CSSProperties}>
              <span>Practical solutions<br />for real businesses.</span>
            </p>
            <h1 id="hero-title">
              <span data-hero="" style={{ "--order": "1" } as CSSProperties}>Good business.</span>
              <span data-hero="" style={{ "--order": "2" } as CSSProperties}><em>Less busywork.</em></span>
            </h1>
            <p className="hero-description" data-hero="" style={{ "--order": "3" } as CSSProperties}>
              Websites, automation, and workflow systems built around your business — so you can spend less time managing the work, and more time doing what you do best.
            </p>
            <div className="hero-actions" data-hero="" style={{ "--order": "4" } as CSSProperties}>
              <a className="button" href="/#contact">Let’s make room for better <Arrow /></a>
              <a className="text-link" href="#ai-opportunity">See what we can improve <Arrow /></a>
            </div>
            <div className="hero-footnote" data-hero="" style={{ "--order": "5" } as CSSProperties}>
              <MapPin size={23} strokeWidth={1.4} aria-hidden="true" />
              Rooted in Wisconsin. Built around you.
            </div>
          </div>
          <figure className="hero-visual" data-hero="" style={{ "--order": "2" } as CSSProperties}>
            <div className="hero-image-frame">
              <img src="/assets/oak-landscape.webp" srcSet="/assets/oak-landscape-768.webp 768w, /assets/oak-landscape.webp 1536w" sizes="(max-width: 640px) 100vw, 40vw" width="1536" height="1024" alt="A mature oak spreading its canopy over a sunlit meadow." loading="eager" decoding="async" {...{ fetchpriority: "high" }} />
            </div>
          </figure>
          <aside className="hero-margin" aria-label="Our promise">
            <svg className="oak-outline" viewBox="0 0 110 220" fill="none" stroke="currentColor" strokeWidth="3" aria-hidden="true">
              <path d="M49 205C25 174 8 157 13 146c3-6 12-1 17 3-20-27-27-49-15-49 5 0 10 9 15 12-13-27-19-48-7-51 8-2 12 13 17 18-7-26-4-52 8-49 8 2 8 20 11 24C62 26 77 4 89 10c14 8-6 33-11 44 12-6 24-4 24 5 0 13-18 25-27 31 18-6 28-3 26 9-2 12-19 24-36 32 21-5 28 1 22 12-6 12-29 20-35 27l-3 35Z" />
              <path d="M49 205C44 153 60 78 84 23M46 153l-20-24m22 5 32-22M51 109 38 88m22-8 27-17" />
            </svg>
            <p>Real people.<br />Practical technology.<br />Brighter tomorrows.</p>
          </aside>
        </div>
      </section>
      <section className="service-strip" id="services" aria-label="How we help">
        <div className="container service-strip-grid">
          {services.map(({ title, description, href, Icon }) => (
            <a href={href} className="service-pillar" key={title}>
              <Icon size={43} strokeWidth={1.25} aria-hidden="true" />
              <h2>{title}</h2><p>{description}</p>
            </a>
          ))}
        </div>
      </section>
      <section className="community-split" aria-labelledby="community-title">
        <figure className="community-photo">
          <img src="/assets/main-street-preview.webp" width="1254" height="1254" alt="Illustrative tree-lined Main Street with welcoming brick storefronts in warm afternoon light." loading="lazy" decoding="async" />
          <figcaption>Strong businesses<br />build stronger<br />communities.</figcaption>
        </figure>
        <div className="community-copy" data-reveal="">
          <p className="eyebrow">Small business. Big possibilities.</p>
          <h2 id="community-title">Technology that<br />works <em>for you.</em></h2>
          <p>We help small and growing businesses put AI and automation to work — without the complexity. From websites and lead capture to custom workflows and everyday tools, we design practical solutions that save time, prevent loss, and help you grow.</p>
          <a className="button" href="/services/">Explore our services <Arrow /></a>
        </div>
      </section>
      <section className="landscape-cta" aria-labelledby="closing-title">
        <div className="container landscape-cta-grid">
          <div><p className="eyebrow">Let’s build a more productive tomorrow.</p>
            <h2 id="closing-title">Ready to make<br />room <em>for better?</em></h2>
          </div>
          <div className="landscape-action"><a className="button" href="#contact">Let’s talk <Arrow /></a><p>Simple conversation. Real possibilities.</p></div>
        </div>
      </section>
      <OpportunityFinder />
      <Contact />
    </div>
  );
}
