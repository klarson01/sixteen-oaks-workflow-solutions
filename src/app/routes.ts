export const routes = {
  "/": {
    label: "Home",
    title: "Sixteen Oaks Workflow Solutions | Good business. Less busywork.",
    description:
      "Practical AI, custom websites, and connected workflows for small businesses. Based in Monroe, Wisconsin, and built around you.",
  },
  "/services/": {
    label: "Services",
    title: "Our Services | Sixteen Oaks Workflow Solutions",
    description:
      "Custom websites, practical AI and automation, and business workflows for small businesses in southern Wisconsin and Northern Illinois.",
  },
  "/products/": {
    label: "Products",
    title: "Products and Platforms | Sixteen Oaks Workflow Solutions",
    description: "Explore Ironwood CRM, Canopy Forge marketing intelligence, Real Estate Intelligence and Aethralion—software products for businesses and specialized industries.",
  },
  "/products/ironwood/": {
    label: "Ironwood",
    title: "Ironwood CRM | Sixteen Oaks Workflow Solutions",
    description: "Explore Ironwood: configurable lead management, intake, assignment and follow-up for small businesses across industries.",
  },
  "/products/real-estate-intelligence/": {
    label: "Real Estate Intelligence",
    title: "Real Estate Intelligence Product | Sixteen Oaks Workflow Solutions",
    description: "Explore property analyzers, AI-assisted review skills, saved reports, and the Real Estate Intelligence workspace.",
  },
  "/products/aethralion/": {
    label: "Aethralion",
    title: "Aethralion Platform | Sixteen Oaks Workflow Solutions",
    description: "Learn about the Aethralion real estate operating platform: LeadOrbit, HelmOrbit, PropOrbit and BuildOrbit.",
  },
  "/real-estate-intelligence/": {
    label: "Real Estate Intelligence",
    title: "Real Estate Intelligence | Sixteen Oaks Workflow Solutions",
    description: "Six analyzers and seven AI workflows for property and acquisition decisions. One private workspace, agency-branded reports and a free 14-day trial with limited AI attempts.",
  },
  "/work/": {
    label: "Our work",
    title: "Our Work | Sixteen Oaks Workflow Solutions",
    description:
      "Explore websites, automation projects, and custom applications built by Sixteen Oaks Workflow Solutions.",
  },
  "/approach/": {
    label: "About",
    title: "Our Approach | Sixteen Oaks Workflow Solutions",
    description:
      "A personal, practical approach to better business tools. Listen first, agree on a useful next step, and build around your everyday work.",
  },
} as const;

export type RoutePath = keyof typeof routes;
export type PagePath = RoutePath | "/404/" | `/work/${string}/`;
export const routePaths = Object.keys(routes) as RoutePath[];

export function resolvePagePath(path: string): PagePath {
  const normalized = path === "/" ? "/" : path.replace(/\/+$/, "") + "/";
  if (/^\/work\/[a-z0-9]+(?:-[a-z0-9]+)*\/$/.test(normalized)) return normalized as PagePath;
  return normalized in routes ? (normalized as RoutePath) : "/404/";
}
