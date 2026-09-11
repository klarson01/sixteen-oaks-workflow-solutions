import SiteHeader from "./components/SiteHeader";
import SiteFooter from "./components/SiteFooter";
import MobileMenu from "./components/MobileMenu";
import Home from "./pages/Home";
import Services from "./pages/Services";
import Work from "./pages/Work";
import Approach from "./pages/Approach";
import type { PagePath } from "./routes";

const pages = {
  "/": Home,
  "/services/": Services,
  "/work/": Work,
  "/approach/": Approach,
};
const noScriptStyles =
  ".menu-toggle{display:none}.desktop-nav{display:flex;flex-wrap:wrap;gap:8px 18px;font-size:.8125rem}.header-inner{height:auto;min-height:92px;flex-wrap:wrap;padding:18px 0;gap:10px}.desktop-nav{margin-left:0}.motion-toggle{display:none}";

/** React owns the build-time templates; the browser enhances the complete HTML. */
export default function App({ path }: { path: PagePath }) {
  const Page = path === "/404/" ? null : pages[path];
  return (
    <>
      <a className="skip-link" href="#main">
        Skip to content
      </a>
      <SiteHeader path={path} />
      <div className="route-status" aria-hidden="true" />
      <div
        className="sr-only"
        role="status"
        aria-live="polite"
        id="page-announcement"
      />
      <main id="main" tabIndex={-1}>
        {Page ? (
          <Page />
        ) : (
          <section className="page-intro" id="top">
            <div className="container">
              <p className="eyebrow">Page not found</p>
              <h1>This page isn’t here.</h1>
              <p>
                Use the navigation to explore our services and work, or head
                back to the homepage.
              </p>
              <a className="text-link" href="/">
                Return home
              </a>
            </div>
          </section>
        )}
      </main>
      <SiteFooter />
      <MobileMenu path={path} />
      <noscript>
        <style dangerouslySetInnerHTML={{ __html: noScriptStyles }} />
      </noscript>
    </>
  );
}
