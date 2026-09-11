import { renderToStaticMarkup } from "react-dom/server";
import App from "./app/App";
import { routes, routePaths, resolvePagePath } from "./app/routes";

export { routePaths };

export function render(pathname: string) {
  const path = resolvePagePath(pathname);
  const metadata =
    path === "/404/"
      ? {
          title: "Page Not Found | Sixteen Oaks Workflow Solutions",
          description:
            "Explore the Sixteen Oaks website for practical AI, custom websites, and business workflows.",
        }
      : routes[path];
  return {
    html: renderToStaticMarkup(<App path={path} />),
    ...metadata,
    notFound: path === "/404/",
  };
}
