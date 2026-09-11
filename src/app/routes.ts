export const routes = {
  "/": {
    label: "Home",
    title: "Sixteen Oaks Workflow Solutions | Good business. Less busywork.",
    description:
      "Practical AI, custom websites, and connected workflows for small businesses. Based in Monroe, Wisconsin, and built around you.",
  },
  "/services/": {
    label: "What we do",
    title: "Our Services | Sixteen Oaks Workflow Solutions",
    description:
      "Custom websites, practical AI and automation, and business workflows designed around the way you work.",
  },
  "/work/": {
    label: "Our work",
    title: "Our Work | Sixteen Oaks Workflow Solutions",
    description:
      "Explore the Ray’s Mobile Repair website project: custom design, mobile layouts, service pages, and clear paths for customers and job applicants.",
  },
  "/approach/": {
    label: "How we work",
    title: "Our Approach | Sixteen Oaks Workflow Solutions",
    description:
      "A personal, practical approach to better business tools. Listen first, agree on a useful next step, and build around your everyday work.",
  },
} as const;

export type RoutePath = keyof typeof routes;
export type PagePath = RoutePath | "/404/";
export const routePaths = Object.keys(routes) as RoutePath[];

export function resolvePagePath(path: string): PagePath {
  const normalized = path === "/" ? "/" : path.replace(/\/+$/, "") + "/";
  return normalized in routes ? (normalized as RoutePath) : "/404/";
}
