type MarkProps = { className?: string; title?: string };

/** The Renderlane mark: a hexagon gem between two code chevrons. */
export function LogoMark({ className, title = "Renderlane" }: MarkProps) {
  return (
    <svg viewBox="0 0 160 100" className={className} role="img" aria-label={title} fill="currentColor">
      {/* left chevron */}
      <polygon points="30,18 41,18 21,50 41,82 30,82 9,50" />
      {/* hexagon ring with bevelled facets */}
      <path
        fillRule="evenodd"
        d="M116 50 L98 81.2 L62 81.2 L44 50 L62 18.8 L98 18.8 Z M104 50 L92 70.8 L68 70.8 L56 50 L68 29.2 L92 29.2 Z"
      />
      <path d="M62 18.8 L98 18.8 L92 29.2 L68 29.2 Z" opacity="0.55" />
      <path d="M98 81.2 L62 81.2 L68 70.8 L92 70.8 Z" opacity="0.7" />
      {/* right chevron */}
      <polygon points="130,18 119,18 139,50 119,82 130,82 151,50" />
    </svg>
  );
}

export function Logo({ className }: { className?: string }) {
  return (
    <span className={`inline-flex items-center gap-3 ${className ?? ""}`}>
      <LogoMark className="h-7 w-auto" />
      <span className="h-6 w-px bg-current opacity-70" aria-hidden="true" />
      <span className="font-display text-[1.05rem] font-medium tracking-[0.18em]">RENDERLANE</span>
    </span>
  );
}
