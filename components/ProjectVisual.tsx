const ACID = "#d1fe17";
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

  if (id === "galactic-life") {
    return (
      <svg viewBox="0 0 600 400" className={common} role="img" aria-label="Orbital illustration">
        <rect width="600" height="400" fill="#17191d" />
        <Grid id={id} />
        <ellipse cx="300" cy="200" rx="230" ry="90" fill="none" stroke={DIM} strokeWidth="1" />
        <ellipse cx="300" cy="200" rx="160" ry="60" fill="none" stroke={DIM} strokeWidth="1" />
        <circle cx="300" cy="200" r="52" fill={ACID} />
        <circle cx="284" cy="188" r="9" fill="#17191d" opacity="0.25" />
        <circle cx="316" cy="212" r="6" fill="#17191d" opacity="0.2" />
        <circle cx="470" cy="152" r="7" fill={INK} />
        <circle cx="140" cy="248" r="5" fill={ACID} />
        <circle cx="95" cy="110" r="2" fill={INK} opacity="0.6" />
        <circle cx="520" cy="300" r="2" fill={INK} opacity="0.6" />
        <circle cx="430" cy="70" r="1.5" fill={INK} opacity="0.5" />
      </svg>
    );
  }

  if (id === "studio") {
    return (
      <svg viewBox="0 0 600 400" className={common} role="img" aria-label="Gate arcs illustration">
        <rect width="600" height="400" fill="#17191d" />
        <Grid id={id} />
        {[200, 160, 120, 80].map((r, i) => (
          <path
            key={r}
            d={`M ${300 - r} 400 A ${r} ${r} 0 0 1 ${300 + r} 400`}
            fill="none"
            stroke={i === 2 ? ACID : DIM}
            strokeWidth={i === 2 ? 2 : 1}
          />
        ))}
        <circle cx="300" cy="400" r="36" fill={ACID} />
        <path d="M 292 120 l 8 -22 l 8 22 l 22 8 l -22 8 l -8 22 l -8 -22 l -22 -8 z" fill={INK} />
      </svg>
    );
  }

  if (id === "marketplace") {
    return (
      <svg viewBox="0 0 600 400" className={common} role="img" aria-label="Market bars illustration">
        <rect width="600" height="400" fill="#17191d" />
        <Grid id={id} />
        {[
          { x: 120, h: 110 },
          { x: 210, h: 170 },
          { x: 300, h: 140 },
          { x: 390, h: 230 },
        ].map((bar, i) => (
          <rect
            key={bar.x}
            x={bar.x}
            y={340 - bar.h}
            width="60"
            height={bar.h}
            fill={i === 3 ? ACID : "none"}
            stroke={i === 3 ? ACID : DIM}
            strokeWidth="1"
          />
        ))}
        <line x1="80" y1="340" x2="520" y2="340" stroke={INK} strokeWidth="1" opacity="0.4" />
        <circle cx="420" cy="82" r="6" fill={ACID} />
        <path d="M 420 82 L 480 60" stroke={DIM} strokeWidth="1" />
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
