import { imageSrcSet } from "../lib/images";

export default function Brand({ footer = false }: { footer?: boolean }) {
  return (
    <a
      className={footer ? "brand footer-brand" : "brand"}
      href="/"
      aria-label="Sixteen Oaks Workflow Solutions, home"
    >
      <span className="brand-art" aria-hidden="true">
        <img
          src="/assets/sixteen-oaks-logo.png"
          srcSet={imageSrcSet("/assets/sixteen-oaks-logo.png", 1536, 90)}
          sizes="(max-width: 640px) 286px, (max-width: 820px) 300px, 341px"
          width="1536"
          height="1024"
          alt=""
          decoding="async"
        />
      </span>
    </a>
  );
}
