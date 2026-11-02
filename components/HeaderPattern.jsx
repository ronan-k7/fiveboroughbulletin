/**
 * Purely decorative background for the light logo section of the header:
 * two soft diagonal "folded paper" ribbons on the left, mirrored on the
 * right so the header reads as a symmetrical pair of angled cuts around
 * the logo. Vector-based (not a raster image) so it stays crisp and
 * reflows cleanly at every viewport width.
 *
 * The SVG is centred (xMidYMid slice), so the right-hand ribbons are an
 * exact horizontal mirror of the left-hand ones at every width: the left
 * pair leans up-right "/", the right pair leans up-left "\".
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
      {/* left ribbon bands  "/" */}
      <polygon points="60,320 330,320 560,-20 290,-20" fill="#0f172a" opacity="0.035" />
      <polygon points="330,320 430,320 660,-20 560,-20" fill="#0f172a" opacity="0.05" />

      {/* right ribbon bands  "\" -- mirror image of the left pair (x -> 1440 - x) */}
      <polygon points="1380,320 1110,320 880,-20 1150,-20" fill="#0f172a" opacity="0.035" />
      <polygon points="1110,320 1010,320 780,-20 880,-20" fill="#0f172a" opacity="0.05" />
    </svg>
  );
}
