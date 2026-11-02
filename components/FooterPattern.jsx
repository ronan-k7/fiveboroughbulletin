/**
 * Purely decorative background for the dark footer panel: the same
 * dot-cluster wash and "folded paper" ribbons as HeaderPattern, recolored
 * for a dark navy surface (light dots + white ribbons instead of dark
 * ones) so the footer reads as part of the same visual system as the
 * header instead of a plain, unrelated block underneath it.
 */
export default function FooterPattern({ className = "" }) {
  return (
    <svg
      className={`pointer-events-none absolute inset-0 h-full w-full ${className}`}
      viewBox="0 0 1440 360"
      preserveAspectRatio="xMidYMid slice"
      aria-hidden="true"
      focusable="false"
    >
      <defs>
        <pattern id="fp-dots" width="9" height="9" patternUnits="userSpaceOnUse">
          <circle cx="1.5" cy="1.5" r="1.3" fill="var(--color-header-cyan-bright)" />
        </pattern>
        <mask id="fp-dot-mask">
          <ellipse cx="120" cy="60" rx="260" ry="150" fill="white" />
          <ellipse cx="1300" cy="300" rx="220" ry="140" fill="white" />
          <ellipse cx="60" cy="300" rx="120" ry="80" fill="white" />
        </mask>
      </defs>

      {/* soft diagonal ribbon bands, mirrored from the header's */}
      <polygon points="1380,360 1110,360 880,0 1150,0" fill="#e2f6ff" opacity="0.03" />
      <polygon points="1110,360 1010,360 780,0 880,0" fill="#e2f6ff" opacity="0.045" />

      {/* faint dot-cluster texture, spread across both bottom corners */}
      <rect x="0" y="0" width="1440" height="360" fill="url(#fp-dots)" opacity="0.3" mask="url(#fp-dot-mask)" />
    </svg>
  );
}
