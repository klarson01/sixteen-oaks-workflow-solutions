export default function Brand({ footer = false }: { footer?: boolean }) {
  return (
    <a
      className={footer ? "brand footer-brand" : "brand"}
      href="/"
      aria-label="Sixteen Oaks Workflow Solutions, home"
    >
      <span className="brand-art" aria-hidden="true">
        <img
          src={
            footer
              ? "/assets/midnight-brass-stacked.png"
              : "/assets/midnight-brass-horizontal.png"
          }
          width={footer ? 1040 : 1600}
          height={footer ? 1040 : 667}
          alt=""
          decoding="async"
        />
      </span>
    </a>
  );
}
