/* Harley-Davidson Bar & Shield — silhouette SVG
   Proporciones fieles al logo original: escudo + barra horizontal + "H-D" */
export default function HDLogo({
  color = "#ffffff",
  height = 38,
}: {
  color?: string;
  height?: number;
}) {
  const w = Math.round(height * 0.84);

  return (
    <svg
      width={w}
      height={height}
      viewBox="0 0 84 100"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      aria-label="Harley-Davidson"
    >
      {/* ── Escudo exterior (blanco/color) ─────────────────────
          Forma: tope plano, lados rectos, base apuntada          */}
      <path
        d="M4 4 L80 4 L80 62 Q80 85 42 98 Q4 85 4 62 Z"
        fill={color}
      />

      {/* ── Interior del escudo recortado en bg ─────────────── */}
      <path
        d="M10 10 L74 10 L74 62 Q74 80 42 92 Q10 80 10 62 Z"
        fill="#080808"
      />

      {/* ── Barra horizontal (la "Bar") — tapa el interior ─── */}
      <rect x="4" y="40" width="76" height="20" fill={color} />

      {/* ── Texto H-D en la barra ────────────────────────────── */}
      <text
        x="42"
        y="51"
        textAnchor="middle"
        dominantBaseline="middle"
        fontFamily="'Arial Black', Arial, sans-serif"
        fontWeight="900"
        fontSize="10.5"
        fill="#080808"
        letterSpacing="2"
      >
        H-D
      </text>
    </svg>
  );
}
