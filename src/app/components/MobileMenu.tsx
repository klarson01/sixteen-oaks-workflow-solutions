import Brand from "./Brand";
import Navigation from "./Navigation";
import type { PagePath } from "../routes";

export default function MobileMenu({ path }: { path: PagePath }) {
  return (
    <dialog
      id="mobile-navigation"
      className="mobile-menu"
      aria-label="Navigation"
    >
      <div className="menu-header">
        <Brand />
        <button className="menu-close" aria-label="Close navigation">
          <svg viewBox="0 0 24 24" fill="none" aria-hidden="true">
            <path d="m5 5 14 14M19 5 5 19"></path>
          </svg>
        </button>
      </div>
      <Navigation path={path} mobile />
      <div className="menu-footer">
        <a href="mailto:kevin.larson@sixteenoaksllc.com">
          Start a conversation
        </a>
        <p>Rooted in Wisconsin. Built around you.</p>
      </div>
    </dialog>
  );
}
