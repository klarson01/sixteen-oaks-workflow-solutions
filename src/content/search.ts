import { routePaths, routes, type PagePath, type RoutePath } from "../app/routes";
import { publishedProjects, projectUrl, type SiteContent } from "./model";

export const SITE_ORIGIN = "https://sixteenoaksllc.com";
const BUSINESS_NAME = "Sixteen Oaks Workflow Solutions";

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
  const project = publishedProjects(content).find((p) => projectUrl(p) === path);
  const digits = content.settings.phone.replace(/\D/g, "");
  const graph: Record<string, unknown>[] = [
    {
      "@type": "Organization",
      "@id": organizationId,
      name: BUSINESS_NAME,
      url: SITE_ORIGIN + "/",
      logo: SITE_ORIGIN + "/assets/sixteen-oaks-logo.png",
      description: routes["/"].description,
      email: content.settings.publicEmail,
      telephone: digits.length === 10 ? "+1" + digits : content.settings.phone,
      address: {
        "@type": "PostalAddress",
        addressLocality: "Monroe",
        addressRegion: "WI",
        addressCountry: "US",
      },
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
    },
  ];
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
  return "User-agent: *\nAllow: /\nDisallow: /api/admin/\nDisallow: /api/inquiries\nDisallow: /api/opportunity\nDisallow: /.netlify/identity/\n\nSitemap: " + SITE_ORIGIN + "/sitemap.xml\n";
}
