import Brand from "./Brand";

export default function SiteFooter() {
  return (
    <footer className="site-footer">
      <div className="container footer-inner">
        <div>
          <Brand footer />
          <div>© 2026 Sixteen Oaks Workflow Solutions · Monroe, Wisconsin</div>
        </div>
        <div className="footer-right">
          <button className="motion-toggle" aria-pressed="false" hidden={true}>
            <svg viewBox="0 0 20 20" aria-hidden="true">
              <path d="M2 6h16M2 14h16"></path>
              <circle cx="7" cy="6" r="2.5" fill="var(--ink)"></circle>
              <circle cx="13" cy="14" r="2.5" fill="var(--ink)"></circle>
            </svg>
            <span>Reduce motion</span>
          </button>
          <a className="back-top" href="#top">
            Back to top{" "}
            <svg className="arrow" viewBox="0 0 24 24" aria-hidden="true">
              <path d="M12 20V5m-6 6 6-6 6 6"></path>
            </svg>
          </a>
        </div>
      </div>
    </footer>
  );
}
