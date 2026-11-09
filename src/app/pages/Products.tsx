import { ArrowUpRight, BrainCircuit, Building2, ChartNoAxesCombined, ContactRound, Workflow } from "lucide-react";
import Contact from "../components/Contact";

const products = [
  {
    name: "Ironwood",
    category: "Lead management & CRM",
    audience: "Built for businesses across industries",
    status: "Available",
    statusType: "available",
    Icon: ContactRound,
    description:
      "Organize inquiries, assign leads, track conversations and follow-ups, and give your team a clear view of opportunities. More campaign automation is on the roadmap.",
    features: ["Lead intake and routing", "Contact and follow-up tracking", "Business-ready workflows"],
    href: "/products/ironwood/",
    cta: "Learn more",
    external: false,
    signIn: "https://ironwood.sixteenoaksllc.com/",
  },
  {
    name: "Canopy Forge",
    category: "AI marketing & growth intelligence",
    audience: "Built for businesses across industries",
    status: "In development",
    statusType: "development",
    Icon: BrainCircuit,
    description:
      "Our developing approach to practical marketing intelligence: content planning, search visibility, campaigns and AI-assisted growth.",
    features: ["Content and campaign planning", "SEO / GEO strategy", "Future Ironwood integration"],
    href: "/#contact",
    cta: "Ask about Canopy Forge",
    external: false,
    signIn: null,
  },
  {
    name: "Real Estate Intelligence",
    category: "Specialized real estate analysis",
    audience: "For real estate professionals",
    status: "Available",
    statusType: "available",
    Icon: ChartNoAxesCombined,
    description:
      "Property analyzers and AI-assisted review workflows to support buying, selling, investing and transaction decisions.",
    features: ["Property and financial analyzers", "Document review skills", "Private, branded workspace"],
    href: "/products/real-estate-intelligence/",
    cta: "Learn more",
    external: false,
    signIn: "https://intelligence.sixteenoaksllc.com/",
  },
  {
    name: "Aethralion",
    category: "Real estate operations platform",
    audience: "For real estate teams and brokerages",
    status: "In development",
    statusType: "development",
    Icon: Building2,
    description:
      "An integrated real estate operations platform for transaction coordination and specialized team workflows.",
    features: ["Transaction workflows", "Team operations", "Specialized real estate modules"],
    href: "/products/aethralion/",
    cta: "Learn more",
    external: false,
    signIn: "https://aethralion.com/auth/login",
  },
] as const;

export default function Products() {
  return (
    <>
      <section className="page-intro products-intro" id="top">
        <div className="container">
          <p className="eyebrow">Sixteen Oaks products &amp; platforms</p>
          <h1>
            Useful software.
            <br />
            <em>Built around business.</em>
          </h1>
          <p>
            From lead management and marketing intelligence to specialized
            industry tools, our products help businesses spend less time on
            busywork and more time moving forward.
          </p>
        </div>
      </section>
      <section className="products-section section" aria-labelledby="products-heading">
        <div className="container">
          <div className="products-section-heading">
            <div>
              <p className="eyebrow">Explore our software</p>
              <h2 id="products-heading">A growing family of tools.</h2>
            </div>
            <p>Some products are available today. Others are being developed and refined through real-world projects.</p>
          </div>
          <div className="products-grid">
            {products.map(({ name, category, audience, status, statusType, Icon, description, features, href, cta, external, signIn }) => (
              <article className="product-card" key={name}>
                <div className="product-card-top">
                  <span className="product-card-icon" aria-hidden="true"><Icon size={29} strokeWidth={1.5} /></span>
                  <span className={`product-status product-status--${statusType}`}>{status}</span>
                </div>
                <p className="product-category">{category}</p>
                <h3>{name}</h3>
                <p className="product-audience">{audience}</p>
                <p className="product-description">{description}</p>
                <ul>{features.map((feature) => <li key={feature}>{feature}</li>)}</ul>
                <div className="product-card-actions">
                  <a className="product-action" href={href} {...(external ? { target: "_blank", rel: "noopener noreferrer" } : {})}>
                    {cta} <ArrowUpRight size={18} aria-hidden="true" />
                  </a>
                  {signIn && <a className="product-signin" href={signIn}>Sign in <ArrowUpRight size={15} aria-hidden="true"/></a>}
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>
      <section className="products-service-note section" aria-labelledby="custom-solution-heading">
        <div className="container products-service-inner">
          <Workflow size={35} strokeWidth={1.3} aria-hidden="true" />
          <div>
            <p className="eyebrow">Need something different?</p>
            <h2 id="custom-solution-heading">Software isn't one-size-fits-all.</h2>
            <p>We also build custom websites, dashboards, integrations and practical AI workflows for businesses with their own way of working.</p>
          </div>
          <a className="button" href="/services/">See our services <ArrowUpRight size={18} aria-hidden="true" /></a>
        </div>
      </section>
      <Contact />
    </>
  );
}
