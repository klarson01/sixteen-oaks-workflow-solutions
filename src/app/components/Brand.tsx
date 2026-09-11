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
          width="1536"
          height="1024"
          alt=""
          decoding="async"
        />
      </span>
    </a>
  );
}
