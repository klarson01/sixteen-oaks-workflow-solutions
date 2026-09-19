import { routePaths, routes, type PagePath, type RoutePath } from "../app/routes";
import { serviceFaqs } from "./faq";
import { publishedProjects, projectUrl, type SiteContent } from "./model";

export const SITE_ORIGIN = "https://sixteenoaksllc.com";
const BUSINESS_NAME = "Sixteen Oaks Workflow Solutions";
const SERVICE_AREAS = [
  { "@type": "State", name: "Wisconsin" },
  { "@type": "AdministrativeArea", name: "Northern Illinois" },
] as const;

const services = [
  {
    slug: "custom-websites",
    anchor: "websites",
    name: "Custom business websites",
    description:
      "Business discovery, content planning, custom design, clear service pages, contact paths, search foundations, and ongoing care options.",
  },
  {
    slug: "practical-ai-automation",
    anchor: "practical-ai",
    name: "Practical AI and automation",
    description:
      "Workflow discovery, reusable AI guidance, drafting and follow-up workflows, clear review steps, and hands-on team training.",
  },
  {
    slug: "connected-workflows-applications",
    anchor: "custom-workflows",
    name: "Connected workflows and custom applications",
    description:
      "Process mapping, practical integrations, job and approval workflows, custom dashboards, and mobile-friendly small-business tools.",
  },
] as const;

export function searchPaths(content: SiteContent) {
  return [...routePaths, ...publishedProjects(content).map(projectUrl)];
}

export function searchMetadata(
  path: PagePath,
  content: SiteContent,
  metadata: { title: string; description: string },
) {
  if (path === "/404/") return { canonicalUrl: null, structuredData: null };
  const canonicalUrl = SITE_ORIGIN + path;
  const organizationId = SITE_ORIGIN + "/#organization";
  const websiteId = SITE_ORIGIN + "/#website";
  const serviceCatalogId = SITE_ORIGIN + "/services/#service-catalog";
  const faqId = SITE_ORIGIN + "/services/#common-questions";
  const project = publishedProjects(content).find((p) => projectUrl(p) === path);
  const projects = publishedProjects(content);
  const digits = content.settings.phone.replace(/\D/g, "");
  const telephone = digits.length === 10 ? "+1" + digits : content.settings.phone;
  const serviceNodes = services.map((service) => ({
    "@type": "Service",
    "@id": SITE_ORIGIN + "/services/#" + service.slug,
    name: service.name,
    description: service.description,
    url: SITE_ORIGIN + "/services/#" + service.anchor,
    provider: { "@id": organizationId },
    areaServed: SERVICE_AREAS,
    audience: { "@type": "BusinessAudience", audienceType: "Small businesses" },
  }));
  const graph: Record<string, unknown>[] = [
    {
      "@type": "Organization",
      "@id": organizationId,
      name: BUSINESS_NAME,
      url: SITE_ORIGIN + "/",
      logo: SITE_ORIGIN + "/assets/sixteen-oaks-logo.png",
      description: routes["/"].description,
      email: content.settings.publicEmail,
      telephone,
      address: {
        "@type": "PostalAddress",
        addressLocality: "Monroe",
        addressRegion: "WI",
        addressCountry: "US",
      },
      areaServed: SERVICE_AREAS,
      founder: { "@type": "Person", name: "Kevin Larson" },
      knowsAbout: services.map((service) => service.name),
      contactPoint: {
        "@type": "ContactPoint",
        contactType: "customer inquiries",
        email: content.settings.publicEmail,
        telephone,
        areaServed: SERVICE_AREAS,
        availableLanguage: "English",
      },
      hasOfferCatalog: { "@id": serviceCatalogId },
    },
    {
      "@type": "WebSite",
      "@id": websiteId,
      url: SITE_ORIGIN + "/",
      name: BUSINESS_NAME,
      inLanguage: "en-US",
      publisher: { "@id": organizationId },
    },
    {
      "@type": path === "/approach/" ? "AboutPage" : path === "/work/" ? "CollectionPage" : "WebPage",
      "@id": canonicalUrl + "#webpage",
      url: canonicalUrl,
      name: metadata.title,
      description: metadata.description,
      inLanguage: "en-US",
      isPartOf: { "@id": websiteId },
      about: { "@id": organizationId },
      ...(project ? { primaryImageOfPage: SITE_ORIGIN + project.cover.src } : {}),
      ...(path === "/services/"
        ? {
            mainEntity: serviceNodes.map((service) => ({ "@id": service["@id"] })),
            hasPart: { "@id": faqId },
          }
        : {}),
      ...(path === "/work/"
        ? { mainEntity: { "@id": SITE_ORIGIN + "/work/#project-list" } }
        : {}),
      ...(project ? { mainEntity: { "@id": canonicalUrl + "#project" } } : {}),
    },
    {
      "@type": "OfferCatalog",
      "@id": serviceCatalogId,
      name: "Sixteen Oaks services",
      url: SITE_ORIGIN + "/services/",
      itemListElement: serviceNodes.map((service) => ({
        "@type": "Offer",
        itemOffered: { "@id": service["@id"] },
      })),
    },
    ...serviceNodes,
  ];
  if (path === "/services/") {
    graph.push({
      "@type": "FAQPage",
      "@id": faqId,
      url: faqId,
      name: "Common questions about Sixteen Oaks services",
      isPartOf: { "@id": canonicalUrl + "#webpage" },
      mainEntity: serviceFaqs.map((item) => ({
        "@type": "Question",
        name: item.question,
        acceptedAnswer: { "@type": "Answer", text: item.answer },
      })),
    });
  }
  if (path === "/work/") {
    graph.push({
      "@type": "ItemList",
      "@id": SITE_ORIGIN + "/work/#project-list",
      name: "Sixteen Oaks project case studies",
      numberOfItems: projects.length,
      itemListElement: projects.map((item, index) => ({
        "@type": "ListItem",
        position: index + 1,
        name: item.title,
        url: SITE_ORIGIN + projectUrl(item),
      })),
    });
  }
  if (project) {
    graph.push({
      "@type": "CreativeWork",
      "@id": canonicalUrl + "#project",
      name: project.title,
      headline: project.tagline,
      description: project.summary,
      url: canonicalUrl,
      image: SITE_ORIGIN + project.cover.src,
      creator: { "@id": organizationId },
      about: {
        "@type": "Organization",
        name: project.title,
        description: project.business,
        location: { "@type": "Place", name: project.location },
      },
      spatialCoverage: { "@type": "Place", name: project.location },
    });
  }
  if (path !== "/") {
    const crumbs = [{ name: "Home", item: SITE_ORIGIN + "/" }];
    if (project) crumbs.push({ name: "Our work", item: SITE_ORIGIN + "/work/" });
    crumbs.push({ name: project?.title ?? routes[path as RoutePath].label, item: canonicalUrl });
    graph.push({
      "@type": "BreadcrumbList",
      "@id": canonicalUrl + "#breadcrumb",
      itemListElement: crumbs.map((crumb, i) => ({ "@type": "ListItem", position: i + 1, ...crumb })),
    });
  }
  return { canonicalUrl, structuredData: { "@context": "https://schema.org", "@graph": graph } };
}

export function sitemapXml(paths: readonly string[]) {
  const escape = (value: string) => value.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
  return '<?xml version="1.0" encoding="UTF-8"?>\n' +
    '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n' +
    paths.map((path) => "  <url><loc>" + escape(SITE_ORIGIN + path) + "</loc></url>").join("\n") +
    "\n</urlset>\n";
}

export function robotsText(production: boolean) {
  if (!production) return "User-agent: *\nDisallow: /\n";
  // The admin sign-in remains crawlable so its noindex header can be read.
  // Public /api/media/ images remain accessible to image crawlers.
  const publicRules = "Allow: /\nDisallow: /api/admin/\nDisallow: /api/inquiries\nDisallow: /api/opportunity\nDisallow: /.netlify/identity/\n";
  return "User-agent: OAI-SearchBot\n" + publicRules +
    "\nUser-agent: GPTBot\n" + publicRules +
    "\nUser-agent: *\n" + publicRules +
    "\nSitemap: " + SITE_ORIGIN + "/sitemap.xml\n";
}
