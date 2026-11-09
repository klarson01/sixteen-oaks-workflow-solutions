import type { ReactNode } from "react";
import { ArrowUpRight, ArrowLeft, Check, ContactRound, BrainCircuit, LayoutDashboard, FileCheck2, ChartNoAxesCombined, Building2, ClipboardList, Workflow, Users, ListChecks } from "lucide-react";
import Contact from "../components/Contact";

type ProductKey = "ironwood" | "real-estate-intelligence" | "aethralion";
type Feature = { title: string; description: string; icon: ReactNode };
type Product = {
  name: string; label: string; headline: string; italic: string; intro: string;
  status: string; audience: string; signIn: string; signLabel: string;
  primaryHref: string; primaryLabel: string; overview: string; features: Feature[];
  images?: { src: string; alt: string; caption: string }[];
};
const icon = (Icon: typeof ContactRound) => <Icon size={25} strokeWidth={1.55} aria-hidden="true" />;
const products: Record<ProductKey, Product> = {
  ironwood: {
    name: "Ironwood", label: "Lead management & CRM", headline: "Every lead matters.", italic: "Keep the next step clear.",
    intro: "A practical lead and contact workspace for small businesses. Capture inquiries, organize conversations, assign the right person and follow up without losing track.",
    status: "Available", audience: "Service businesses, teams and owners across industries",
    signIn: "https://ironwood.sixteenoaksllc.com/", signLabel: "Sign in to Ironwood",
    primaryHref: "/#contact", primaryLabel: "Ask about Ironwood",
    overview: "When new inquiries arrive through a website, a referral or a team member, they need somewhere to go. Ironwood creates a clear handoff from first contact to follow-up and opportunity tracking. The system is designed to work with different kinds of businesses—not just real estate.",
    features: [
      { title: "Capture inquiries", description: "Bring website inquiries, manual leads and supported imports into one working list.", icon: icon(ClipboardList) },
      { title: "Route and assign", description: "Give team members ownership of leads, with acceptance and review steps.", icon: icon(Users) },
      { title: "Follow through", description: "Track conversations, next actions and reminders so opportunities stay visible.", icon: icon(ListChecks) },
      { title: "Grow with your business", description: "Configurable business workflows; expanded campaign automation is in development.", icon: icon(Workflow) },
    ],
  },
  "real-estate-intelligence": {
    name: "Real Estate Intelligence", label: "Real estate analysis & AI workflows", headline: "Clearer numbers.", italic: "Better conversations.",
    intro: "Specialized analyzers and document-review workflows that help real estate professionals organize assumptions, explore scenarios and prepare clearer client conversations.",
    status: "Available", audience: "Real estate agents, teams, brokerages and investors",
    signIn: "https://intelligence.sixteenoaksllc.com/", signLabel: "Sign in to workspace",
    primaryHref: "https://intelligence.sixteenoaksllc.com/?intent=trial", primaryLabel: "Start free trial",
    overview: "Work through buyer costs, seller proceeds, rental and investment assumptions, then review supporting documents using guided AI-assisted workflows. Save private analyses and prepare branded outputs. Results remain planning support, not appraisals, guarantees or professional advice.",
    features: [
      { title: "Financial analyzers", description: "Buyer, seller, rental, multifamily, commercial and acquisition analysis.", icon: icon(ChartNoAxesCombined) },
      { title: "AI review skills", description: "Guided workflows for inspection, appraisal, offer and related document review.", icon: icon(FileCheck2) },
      { title: "Reports worth sharing", description: "Saved workspaces and agency-branded reports for more useful discussions.", icon: icon(LayoutDashboard) },
      { title: "Accessible on its own", description: "Use the intelligence workspace without purchasing another Sixteen Oaks product.", icon: icon(Check) },
    ],
    images: [
      { src: "/assets/analyzers/buyer.webp", alt: "Actual Buyer Analyzer interface displaying a sample payment and cost breakdown.", caption: "Buyer Analyzer — application screen" },
      { src: "/assets/analyzers/seller.webp", alt: "Actual Seller Analyzer interface displaying seller proceeds and cost estimates.", caption: "Seller Analyzer — application screen" },
      { src: "/assets/analyzers/multifamily.webp", alt: "Actual Multifamily Analyzer interface with investment assumptions and analysis.", caption: "Multifamily Analyzer — application screen" },
    ],
  },
  aethralion: {
    name: "Aethralion", label: "Real estate operations platform", headline: "Bring the operation together.", italic: "See what comes next.",
    intro: "A connected real estate operations platform built around the work of agents, brokers, transaction coordinators, property managers and builders.",
    status: "In development", audience: "Real estate professionals and operational teams",
    signIn: "https://aethralion.com/auth/login", signLabel: "Aethralion sign in",
    primaryHref: "https://aethralion.com/", primaryLabel: "Explore Aethralion.com",
    overview: "Aethralion brings specialized real estate workflows under one product family. Modules are being built and refined for lead operations, transactions, brokerage visibility, property management and builder projects. Availability varies by module; this is not a claim that every planned capability is ready for general use.",
    features: [
      { title: "LeadOrbit", description: "Real estate lead and client-lifecycle workflows.", icon: icon(Users) },
      { title: "HelmOrbit", description: "Transaction coordination, deadlines, documents and commissions.", icon: icon(ClipboardList) },
      { title: "PropOrbit", description: "Property and lease management workflows under development.", icon: icon(Building2) },
      { title: "BuildOrbit", description: "Builder projects, lots and construction operations under development.", icon: icon(Workflow) },
    ],
  },
};

export default function ProductDetail({ product }: { product: ProductKey }) {
  const p = products[product];
  return (
    <div className="product-detail-page">
      <section className="product-detail-hero" id="top">
        <div className="container">
          <a className="product-back" href="/products/"><ArrowLeft size={18} aria-hidden="true"/> All products</a>
          <p className="eyebrow">{p.label} <span className="product-detail-dot" aria-hidden="true">·</span> {p.status}</p>
          <h1>{p.headline}<br/><em>{p.italic}</em></h1>
          <p className="product-detail-lead">{p.intro}</p>
          <div className="product-detail-actions">
            <a className="button" href={p.primaryHref}>{p.primaryLabel} <ArrowUpRight size={19} aria-hidden="true"/></a>
            <a className="product-outline" href={p.signIn}> {p.signLabel} <ArrowUpRight size={17} aria-hidden="true"/></a>
          </div>
          <p className="product-detail-audience">Designed for: {p.audience}</p>
        </div>
      </section>
      <section className="product-detail-overview section">
        <div className="container product-detail-overview-grid">
          <div><p className="eyebrow">The idea</p><h2>Less complexity.<br/>More clarity.</h2></div>
          <p>{p.overview}</p>
        </div>
      </section>
      <section className="product-detail-features section" aria-labelledby="product-features-heading">
        <div className="container">
          <p className="eyebrow">What you can do</p>
          <h2 id="product-features-heading">Built for the work you actually do.</h2>
          <div className="product-features-grid">
            {p.features.map(f => <article key={f.title} className="product-feature"><span className="product-feature-icon">{f.icon}</span><h3>{f.title}</h3><p>{f.description}</p></article>)}
          </div>
        </div>
      </section>
      {p.images && <section className="product-screens section" aria-labelledby="product-screens-heading">
        <div className="container"><p className="eyebrow">Inside the workspace</p><h2 id="product-screens-heading">See the tools in action.</h2>
          <div className="product-screens-grid">{p.images.map(im => <figure key={im.src}><img src={im.src} alt={im.alt} loading="lazy"/><figcaption>{im.caption}</figcaption></figure>)}</div>
        </div>
      </section>}
      {!p.images && <section className="product-screens product-screens--text section">
        <div className="container"><p className="eyebrow">Explore the product</p><h2>{p.name === "Ironwood" ? "See how Ironwood could fit your business." : "Explore the Aethralion platform."}</h2>
        <p>{p.name === "Ironwood" ? "Talk with us about a guided walkthrough of lead intake, assignment and follow-up. We'll add verified application screenshots here as they become available for public use." : "Visit the Aethralion website for current product information, module detail and available workspace previews."}</p>
        <a className="product-outline" href={p.primaryHref}>{p.primaryLabel} <ArrowUpRight size={18} aria-hidden="true"/></a>
        </div>
      </section>}
      <section className="product-detail-last section"><div className="container"><h2>Ready to explore {p.name}?</h2><p>See the product, sign in to your workspace, or talk with Sixteen Oaks about the right next step.</p>
        <div className="product-detail-actions"><a className="button" href={p.primaryHref}>{p.primaryLabel} <ArrowUpRight size={18} aria-hidden="true"/></a><a className="product-outline" href={p.signIn}>{p.signLabel}</a></div>
      </div></section>
      <Contact/>
    </div>
  );
}
