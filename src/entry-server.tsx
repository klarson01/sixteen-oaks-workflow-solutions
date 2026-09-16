import { renderToStaticMarkup } from "react-dom/server";
import App from "./app/App";
import {
  routes,
  routePaths,
  resolvePagePath,
  type RoutePath,
} from "./app/routes";
import { SiteContext, defaultContent } from "./content/context";
import { searchMetadata } from "./content/search";
import {
  publishedProjects,
  projectUrl,
  type SiteContent,
} from "./content/model";
export { routePaths };
export function getRenderPaths(content: SiteContent = defaultContent) {
  return [...routePaths, ...publishedProjects(content).map(projectUrl)];
}
export function render(
  pathname: string,
  content: SiteContent = defaultContent,
  formToken = "",
) {
  let path = resolvePagePath(pathname);
  const project = publishedProjects(content).find(
    (p) => projectUrl(p) === path,
  );
  if (path.startsWith("/work/") && path !== "/work/" && !project)
    path = "/404/";
  const metadata = project
    ? {
        title: `${project.title} | Our Work | Sixteen Oaks`,
        description: project.summary,
      }
    : path === "/404/"
      ? {
          title: "Page Not Found | Sixteen Oaks Workflow Solutions",
          description:
            "Explore practical AI, custom websites, and business workflows.",
        }
      : routes[path as RoutePath];
  return {
    html: renderToStaticMarkup(
      <SiteContext.Provider value={{ content, formToken }}>
        <App path={path} project={project} />
      </SiteContext.Provider>,
    ),
    ...metadata,
    ...searchMetadata(path, content, metadata),
    notFound: path === "/404/",
  };
}
