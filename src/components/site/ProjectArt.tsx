/** Generative cover art for concept projects (pure SVG, no image files). */
export function ProjectArt({ kind }: { kind: "tower" | "rings" | "wave" | "orbit" }) {
  if (kind === "tower") {
    return (
      <svg viewBox="0 0 400 300" className="h-full w-full" aria-hidden="true">
        <defs>
          <linearGradient id="tw-bg" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0" stopColor="#1b1040" />
            <stop offset="1" stopColor="#0a0a0b" />
          </linearGradient>
          <linearGradient id="tw-side" x1="0" y1="0" x2="1" y2="0">
            <stop offset="0" stopColor="#7c5cff" />
            <stop offset="1" stopColor="#3b2a99" />
          </linearGradient>
        </defs>
        <rect width="400" height="300" fill="url(#tw-bg)" />
        <circle cx="300" cy="70" r="40" fill="#7c5cff" opacity=".25" />
        {Array.from({ length: 9 }).map((_, i) => {
          const y = 250 - i * 22;
          return (
            <g key={i} className="origin-center" opacity={0.35 + i * 0.07}>
              <path d={`M200 ${y - 14} L250 ${y} L200 ${y + 14} L150 ${y} Z`} fill="#f5f5f4" opacity=".9" />
              <path d={`M150 ${y} L200 ${y + 14} L200 ${y + 30} L150 ${y + 16} Z`} fill="url(#tw-side)" />
              <path d={`M250 ${y} L200 ${y + 14} L200 ${y + 30} L250 ${y + 16} Z`} fill="#2a1670" />
            </g>
          );
        })}
        <g stroke="#f5f5f4" strokeOpacity=".12">
          {Array.from({ length: 12 }).map((_, i) => (
            <line key={i} x1={0} y1={280 + i * 4} x2={400} y2={280 + i * 4} />
          ))}
        </g>
      </svg>
    );
  }
  if (kind === "rings") {
    return (
      <svg viewBox="0 0 400 300" className="h-full w-full" aria-hidden="true">
        <defs>
          <radialGradient id="rg-bg" cx="50%" cy="50%" r="70%">
            <stop offset="0" stopColor="#2b2312" />
            <stop offset="1" stopColor="#0a0a0b" />
          </radialGradient>
        </defs>
        <rect width="400" height="300" fill="url(#rg-bg)" />
        <g transform="translate(200 150)">
          {[110, 90, 70, 52].map((r, i) => (
            <circle
              key={r}
              r={r}
              fill="none"
              stroke={i === 1 ? "#d9b76e" : "#f5f5f4"}
              strokeOpacity={i === 1 ? 0.9 : 0.25}
              strokeWidth={i === 1 ? 2 : 1}
              strokeDasharray={i === 0 ? "2 6" : undefined}
            >
              <animateTransform attributeName="transform" type="rotate" from="0" to={i % 2 ? "-360" : "360"} dur={`${20 + i * 6}s`} repeatCount="indefinite" />
            </circle>
          ))}
          {Array.from({ length: 12 }).map((_, i) => (
            <line key={i} x1="0" y1="-48" x2="0" y2="-40" stroke="#d9b76e" strokeWidth="2" transform={`rotate(${i * 30})`} />
          ))}
          <line x1="0" y1="0" x2="0" y2="-36" stroke="#f5f5f4" strokeWidth="2.5" strokeLinecap="round">
            <animateTransform attributeName="transform" type="rotate" from="0" to="360" dur="12s" repeatCount="indefinite" />
          </line>
          <line x1="0" y1="0" x2="24" y2="0" stroke="#7c5cff" strokeWidth="3" strokeLinecap="round" />
          <circle r="4" fill="#d9b76e" />
        </g>
      </svg>
    );
  }
  if (kind === "wave") {
    const line = (amp: number, phase: number) =>
      Array.from({ length: 41 })
        .map((_, i) => {
          const x = i * 10;
          const y = 170 - Math.sin(i / 4 + phase) * amp - i * 1.6;
          return `${i === 0 ? "M" : "L"}${x} ${y.toFixed(1)}`;
        })
        .join(" ");
    return (
      <svg viewBox="0 0 400 300" className="h-full w-full" aria-hidden="true">
        <defs>
          <linearGradient id="wv-bg" x1="0" y1="0" x2="1" y2="1">
            <stop offset="0" stopColor="#0a0a0b" />
            <stop offset="1" stopColor="#10233a" />
          </linearGradient>
          <linearGradient id="wv-fill" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0" stopColor="#7c5cff" stopOpacity=".45" />
            <stop offset="1" stopColor="#7c5cff" stopOpacity="0" />
          </linearGradient>
        </defs>
        <rect width="400" height="300" fill="url(#wv-bg)" />
        <g stroke="#f5f5f4" strokeOpacity=".07">
          {Array.from({ length: 8 }).map((_, i) => (
            <line key={i} x1="0" y1={40 + i * 32} x2="400" y2={40 + i * 32} />
          ))}
        </g>
        <path d={`${line(28, 0)} L400 300 L0 300 Z`} fill="url(#wv-fill)" />
        <path d={line(28, 0)} fill="none" stroke="#a594ff" strokeWidth="2.5" />
        <path d={line(18, 1.4)} fill="none" stroke="#2ee6c4" strokeWidth="1.5" strokeOpacity=".8" />
        {[
          [40, 60, 70],
          [130, 60, 46],
          [220, 60, 92],
        ].map(([x, y, w]) => (
          <g key={x}>
            <rect x={x} y={y - 26} width="80" height="40" rx="8" fill="#f5f5f4" fillOpacity=".06" stroke="#f5f5f4" strokeOpacity=".12" />
            <rect x={x + 10} y={y - 14} width={w * 0.6} height="5" rx="2.5" fill="#f5f5f4" fillOpacity=".5" />
            <rect x={x + 10} y={y - 2} width="30" height="4" rx="2" fill="#7c5cff" />
          </g>
        ))}
      </svg>
    );
  }
  return (
    <svg viewBox="0 0 400 300" className="h-full w-full" aria-hidden="true">
      <defs>
        <radialGradient id="or-bg" cx="50%" cy="60%" r="70%">
          <stop offset="0" stopColor="#3a1608" />
          <stop offset="1" stopColor="#0a0a0b" />
        </radialGradient>
      </defs>
      <rect width="400" height="300" fill="url(#or-bg)" />
      <g transform="translate(200 160)">
        <ellipse rx="150" ry="46" fill="none" stroke="#f5f5f4" strokeOpacity=".15" />
        <ellipse rx="100" ry="30" fill="none" stroke="#ff8a3d" strokeOpacity=".5" />
        <circle r="38" fill="#ff8a3d" opacity=".9" />
        <circle r="38" fill="url(#or-bg)" opacity=".35" />
        <g>
          <animateTransform attributeName="transform" type="rotate" from="0" to="360" dur="10s" repeatCount="indefinite" />
          <circle cx="100" cy="0" r="9" fill="#f5f5f4" />
          <circle cx="-100" cy="0" r="6" fill="#7c5cff" />
        </g>
        <g>
          <animateTransform attributeName="transform" type="rotate" from="360" to="0" dur="16s" repeatCount="indefinite" />
          <circle cx="0" cy="-46" r="5" fill="#ffd27a" />
          <circle cx="150" cy="0" r="4" fill="#f5f5f4" opacity=".6" />
        </g>
      </g>
    </svg>
  );
}
