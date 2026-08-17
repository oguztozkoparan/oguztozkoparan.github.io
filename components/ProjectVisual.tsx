const ACID = "#a78bfa";
const INK = "#f7f7f8";
const DIM = "rgba(247,247,248,0.25)";

function Grid({ id }: { id: string }) {
  return (
    <>
      <defs>
        <pattern id={`grid-${id}`} width="40" height="40" patternUnits="userSpaceOnUse">
          <path d="M 40 0 L 0 0 0 40" fill="none" stroke="rgba(247,247,248,0.06)" strokeWidth="1" />
        </pattern>
      </defs>
      <rect width="600" height="400" fill={`url(#grid-${id})`} />
    </>
  );
}

export default function ProjectVisual({ id }: { id: string }) {
  const common = "h-full w-full transition-transform duration-700 ease-out group-hover:scale-105";

  if (id === "dos-terminal") {
    return (
      <svg viewBox="0 0 600 400" className={common} role="img" aria-label="Terminal window illustration">
        <rect width="600" height="400" fill="#17191d" />
        <Grid id={id} />
        <rect x="120" y="80" width="360" height="240" rx="8" fill="#0e0f11" stroke={DIM} strokeWidth="1" />
        <rect x="120" y="80" width="360" height="28" rx="8" fill="none" stroke={DIM} strokeWidth="1" />
        <circle cx="140" cy="94" r="4" fill={DIM} />
        <circle cx="156" cy="94" r="4" fill={DIM} />
        <circle cx="172" cy="94" r="4" fill={ACID} />
        <text x="140" y="150" fill={ACID} style={{ font: "600 18px var(--font-jbmono), monospace" }}>
          C:\&gt; dir
        </text>
        <rect x="140" y="170" width="180" height="8" fill={DIM} />
        <rect x="140" y="190" width="220" height="8" fill={DIM} />
        <rect x="140" y="210" width="140" height="8" fill={DIM} />
        <text x="140" y="256" fill={INK} style={{ font: "600 18px var(--font-jbmono), monospace" }}>
          C:\&gt;
        </text>
        <rect x="196" y="240" width="12" height="20" fill={ACID}>
          <animate attributeName="opacity" values="1;0;1" dur="1.2s" repeatCount="indefinite" />
        </rect>
      </svg>
    );
  }

  if (id === "mini-games") {
    return (
      <svg viewBox="0 0 600 400" className={common} role="img" aria-label="Snake game illustration">
        <rect width="600" height="400" fill="#17191d" />
        <Grid id={id} />
        {[
          [220, 200], [260, 200], [300, 200], [300, 240], [340, 240],
        ].map(([x, y], i) => (
          <rect key={i} x={x} y={y} width="36" height="36" rx="6" fill={ACID} opacity={1 - i * 0.13} />
        ))}
        <rect x="420" y="160" width="36" height="36" rx="18" fill={INK} />
        <rect x="140" y="120" width="36" height="36" rx="6" fill="none" stroke={DIM} strokeWidth="1" />
        <rect x="460" y="280" width="36" height="36" rx="6" fill="none" stroke={DIM} strokeWidth="1" />
        <path d="M 100 340 h 400" stroke={DIM} strokeWidth="1" />
        <path d="M 100 60 h 400" stroke={DIM} strokeWidth="1" />
      </svg>
    );
  }

  if (id === "sprite-gen") {
    return (
      <svg viewBox="0 0 600 400" className={common} role="img" aria-label="Sprite sheet illustration">
        <rect width="600" height="400" fill="#17191d" />
        <Grid id={id} />
        <circle cx="130" cy="120" r="22" fill="none" stroke={DIM} strokeWidth="2" />
        <rect x="108" y="180" width="44" height="44" rx="6" fill="none" stroke={DIM} strokeWidth="2" />
        <path d="M 130 250 l 22 40 h -44 z" fill="none" stroke={DIM} strokeWidth="2" />
        <path d="M 210 200 h 90" stroke={ACID} strokeWidth="2" markerEnd="none" />
        <path d="M 292 192 l 12 8 l -12 8" fill="none" stroke={ACID} strokeWidth="2" />
        <rect x="340" y="100" width="200" height="200" rx="10" fill="none" stroke={ACID} strokeWidth="2" />
        {[0, 1, 2].map((r) =>
          [0, 1, 2].map((c) => (
            <rect
              key={`${r}-${c}`}
              x={356 + c * 60}
              y={116 + r * 60}
              width="48"
              height="48"
              rx="6"
              fill={r === 1 && c === 1 ? ACID : "none"}
              stroke={DIM}
              strokeWidth="1"
            />
          ))
        )}
        <text x="340" y="330" fill={DIM} style={{ font: "600 14px var(--font-jbmono), monospace" }}>
          metadata.json
        </text>
      </svg>
    );
  }

  return (
    <svg viewBox="0 0 600 400" className={common} role="img" aria-label="Type specimen illustration">
      <rect width="600" height="400" fill="#17191d" />
      <Grid id={id} />
      <text
        x="300"
        y="235"
        textAnchor="middle"
        fill={ACID}
        style={{ font: "700 170px var(--font-anton), sans-serif", letterSpacing: "-0.02em" }}
      >
        V3
      </text>
      <rect x="428" y="118" width="26" height="26" fill="none" stroke={INK} strokeWidth="2" />
      <rect x="120" y="280" width="360" height="1" fill={DIM} />
      <circle cx="140" cy="120" r="4" fill={INK} />
    </svg>
  );
}
