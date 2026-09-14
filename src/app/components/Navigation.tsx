import { routes, routePaths, type PagePath } from "../routes";

function Arrow() {
  return (
    <svg className="arrow" viewBox="0 0 24 24" aria-hidden="true">
      <path d="M4 12h15m-6-6 6 6-6 6" />
    </svg>
  );
}

export default function Navigation({
  path,
  mobile = false,
}: {
  path: PagePath;
  mobile?: boolean;
}) {
  const contactPath = path === "/404/" ? "/" : path;
  return (
    <nav
      className={mobile ? "mobile-links" : "desktop-nav"}
      aria-label={mobile ? "Mobile navigation" : "Main navigation"}
    >
      {routePaths.map((url) => (
        <a
          key={url}
          className={mobile ? undefined : "nav-link"}
          href={url}
          aria-current={path === url || (url === "/work/" && path.startsWith("/work/")) ? "page" : undefined}
        >
          {routes[url].label}
          {mobile ? <Arrow /> : null}
        </a>
      ))}
      {mobile ? (
        <a href={contactPath + "#contact"}>
          Let’s talk
          <Arrow />
        </a>
      ) : null}
    </nav>
  );
}
