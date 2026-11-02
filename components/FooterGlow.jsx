/**
 * Purely decorative diagonal "circuit glow" lines for the dark footer
 * panel — the closing echo of HeaderGlow's opening ones. Same palette and
 * technique (percentage viewBox + preserveAspectRatio="none" so it
 * stretches cleanly to any panel size), mirrored so the lines rise from
 * the bottom-right instead of falling from the top-right, and the glow
 * sits in the bottom corner rather than the top one.
 */
export default function FooterGlow({ className = "" }) {
  return (
    <svg
      className={`pointer-events-none absolute inset-0 h-full w-full ${className}`}
      viewBox="0 0 100 100"
      preserveAspectRatio="none"
      aria-hidden="true"
      focusable="false"
    >
      <defs>
        <linearGradient id="fg-line-a" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stopColor="var(--color-header-cyan-bright)" stopOpacity="0" />
          <stop offset="55%" stopColor="var(--color-header-cyan-bright)" stopOpacity="0.5" />
          <stop offset="100%" stopColor="var(--color-header-cyan-bright)" stopOpacity="0" />
        </linearGradient>
        <linearGradient id="fg-line-b" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stopColor="var(--color-header-cyan)" stopOpacity="0" />
          <stop offset="60%" stopColor="var(--color-header-cyan)" stopOpacity="0.35" />
          <stop offset="100%" stopColor="var(--color-header-cyan)" stopOpacity="0" />
        </linearGradient>
        <radialGradient id="fg-glow" cx="85%" cy="100%" r="85%">
          <stop offset="0%" stopColor="var(--color-header-cyan)" stopOpacity="0.22" />
          <stop offset="55%" stopColor="var(--color-header-cyan)" stopOpacity="0.06" />
          <stop offset="100%" stopColor="var(--color-header-cyan)" stopOpacity="0" />
        </radialGradient>
      </defs>
      <rect x="0" y="0" width="100" height="100" fill="url(#fg-glow)" />
      <line x1="52" y1="-40" x2="115" y2="140" stroke="url(#fg-line-a)" strokeWidth="0.9" vectorEffect="non-scaling-stroke" />
      <line x1="65" y1="-40" x2="128" y2="140" stroke="url(#fg-line-b)" strokeWidth="0.5" vectorEffect="non-scaling-stroke" />
      <line x1="77" y1="-40" x2="140" y2="140" stroke="url(#fg-line-b)" strokeWidth="0.3" vectorEffect="non-scaling-stroke" />
    </svg>
  );
}
