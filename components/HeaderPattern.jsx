/**
 * Purely decorative background for the light logo section of the header:
 * two soft diagonal "folded paper" ribbons plus a faint dot-cluster wash,
 * matching the reference header design. Vector-based (not a raster image)
 * so it stays crisp and reflows cleanly at every viewport width.
 */
export default function HeaderPattern({ className = "" }) {
  return (
    <svg
      className={`pointer-events-none absolute inset-0 h-full w-full ${className}`}
      viewBox="0 0 1440 320"
      preserveAspectRatio="xMidYMid slice"
      aria-hidden="true"
      focusable="false"
    >
      <defs>
        <pattern id="hp-dots" width="9" height="9" patternUnits="userSpaceOnUse">
          <circle cx="1.5" cy="1.5" r="1.3" fill="var(--color-header-cyan-dark)" />
        </pattern>
        <mask id="hp-dot-mask">
          <ellipse cx="1180" cy="70" rx="270" ry="150" fill="white" />
          <ellipse cx="1340" cy="230" rx="170" ry="110" fill="white" />
          <ellipse cx="980" cy="40" rx="120" ry="70" fill="white" />
        </mask>
        <radialGradient id="hp-cyan-wash" cx="100%" cy="100%" r="75%">
          <stop offset="0%" stopColor="var(--color-header-cyan)" stopOpacity="0.10" />
          <stop offset="100%" stopColor="var(--color-header-cyan)" stopOpacity="0" />
        </radialGradient>
      </defs>

      {/* soft diagonal ribbon bands */}
      <polygon points="60,320 330,320 560,-20 290,-20" fill="#0f172a" opacity="0.035" />
      <polygon points="330,320 430,320 660,-20 560,-20" fill="#0f172a" opacity="0.05" />

      {/* faint dot-cluster texture, upper right */}
      <rect x="0" y="0" width="1440" height="320" fill="url(#hp-dots)" opacity="0.35" mask="url(#hp-dot-mask)" />

      {/* subtle cyan glow bleeding in from the bottom-right (Subscribe button) */}
      <rect x="0" y="0" width="1440" height="320" fill="url(#hp-cyan-wash)" />
    </svg>
  );
}
