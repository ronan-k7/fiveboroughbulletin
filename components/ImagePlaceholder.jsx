"use client";

/**
 * Image box used everywhere an article/author photo is needed.
 *
 * Points at /public/images/pay-for-power.webp — drop your image in with
 * that exact filename and it will appear in every placeholder across the
 * whole site at once (hero, grid cards, sidebar thumbnails, author photo,
 * detail page hero image, etc).
 *
 * The fallback icon+label sits underneath the <img> at all times (not
 * swapped in via onError), so it's visible immediately whether the file
 * is missing, still loading, or a broken link — no flash of a raw broken
 * image icon while the file/error event resolves.
 *
 * `variant="ad"` renders the dashed-border "ad space" box instead, which
 * intentionally does NOT use pay-for-power.webp since ad slots are a
 * separate concern from article photos.
 */
export default function ImagePlaceholder({ className = "", label, variant = "photo", rounded = "" }) {
  const isAd = variant === "ad";

  if (isAd) {
    return (
      <div
        className={`flex items-center justify-center border border-dashed border-neutral-300 bg-neutral-50 ${rounded} ${className}`}
      >
        <div className="flex flex-col items-center gap-1.5 px-3 text-center">
          <PictureIcon className="text-neutral-300" />
          <span className="text-[11px] font-medium uppercase tracking-wide text-neutral-400">
            {label || "Ad space"}
          </span>
        </div>
      </div>
    );
  }

  return (
    <div className={`relative overflow-hidden border border-hairline bg-neutral-100 ${rounded} ${className}`}>
      <div className="absolute inset-0 flex items-center justify-center">
        <div className="flex flex-col items-center gap-1.5 px-3 text-center">
          <PictureIcon className="text-neutral-400" />
          <span className="text-[11px] font-medium uppercase tracking-wide text-neutral-400">
            {label || "Image placeholder"}
          </span>
        </div>
      </div>
      <img
        src="/images/pay-for-power.webp"
        alt={label || ""}
        className="relative h-full w-full object-cover"
        onError={(e) => {
          e.currentTarget.style.visibility = "hidden";
        }}
      />
    </div>
  );
}

function PictureIcon({ className = "" }) {
  return (
    <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className={className}>
      <rect x="3" y="4" width="18" height="16" rx="1.5" />
      <circle cx="9" cy="10" r="1.75" />
      <path d="M21 16l-5.5-5.5L4 21" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}
