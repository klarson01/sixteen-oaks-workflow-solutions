import Brand from "./Brand";
import Navigation from "./Navigation";
import type { PagePath } from "../routes";

export default function SiteHeader({ path }: { path: PagePath }) {
  const contactPath = path === "/404/" || path === "/privacy/" ? "/" : path;
  return (
    <header className="site-header">
      <div className="container header-inner">
        <Brand />
        <Navigation path={path} />
        <a
          className="header-cta"
          href={`${contactPath}#contact`}
        >
          Let’s talk
          <svg className="arrow" viewBox="0 0 24 24" aria-hidden="true">
            <path d="M4 12h15m-6-6 6 6-6 6"></path>
          </svg>
        </a>
        <button
          className="menu-toggle"
          aria-label="Open navigation"
          aria-expanded="false"
          aria-controls="mobile-navigation"
        >
          <span>Menu</span>
          <span className="menu-lines" aria-hidden="true">
            <span></span>
            <span></span>
          </span>
        </button>
      </div>
    </header>
  );
}
