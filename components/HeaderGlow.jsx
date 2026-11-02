/**
 * Purely decorative diagonal "circuit glow" lines used behind the dark
 * ticker bar (LatestNewsBar), matching the reference header design.
 * Rendered with a percentage viewBox + preserveAspectRatio="none" so it
 * stretches cleanly to fill a bar of any width/height without pixelating
 * or needing per-breakpoint assets.
 */
export default function HeaderGlow({ className = "" }) {
  return (
    <svg
      className={`pointer-events-none absolute inset-0 h-full w-full ${className}`}
      viewBox="0 0 100 100"
      preserveAspectRatio="none"
      aria-hidden="true"
      focusable="false"
    >
      <defs>
        <linearGradient id="hg-line-a" x1="0" y1="1" x2="1" y2="0">
          <stop offset="0%" stopColor="var(--color-header-cyan-bright)" stopOpacity="0" />
          <stop offset="55%" stopColor="var(--color-header-cyan-bright)" stopOpacity="0.6" />
          <stop offset="100%" stopColor="var(--color-header-cyan-bright)" stopOpacity="0" />
        </linearGradient>
        <linearGradient id="hg-line-b" x1="0" y1="1" x2="1" y2="0">
          <stop offset="0%" stopColor="var(--color-header-cyan)" stopOpacity="0" />
          <stop offset="60%" stopColor="var(--color-header-cyan)" stopOpacity="0.4" />
          <stop offset="100%" stopColor="var(--color-header-cyan)" stopOpacity="0" />
        </linearGradient>
        <radialGradient id="hg-glow" cx="88%" cy="0%" r="85%">
          <stop offset="0%" stopColor="var(--color-header-cyan)" stopOpacity="0.32" />
          <stop offset="55%" stopColor="var(--color-header-cyan)" stopOpacity="0.08" />
          <stop offset="100%" stopColor="var(--color-header-cyan)" stopOpacity="0" />
        </radialGradient>
      </defs>
      <rect x="0" y="0" width="100" height="100" fill="url(#hg-glow)" />
      <line x1="55" y1="140" x2="118" y2="-40" stroke="url(#hg-line-a)" strokeWidth="0.9" vectorEffect="non-scaling-stroke" />
      <line x1="68" y1="140" x2="131" y2="-40" stroke="url(#hg-line-b)" strokeWidth="0.5" vectorEffect="non-scaling-stroke" />
      <line x1="80" y1="140" x2="143" y2="-40" stroke="url(#hg-line-b)" strokeWidth="0.3" vectorEffect="non-scaling-stroke" />
    </svg>
  );
}
