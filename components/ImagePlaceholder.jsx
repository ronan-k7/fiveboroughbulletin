"use client";

/**
 * Image box used everywhere an article/author photo is needed.
 *
 * Pass `src` with a filename that lives in /public/images/ (e.g. an
 * article's `image` field or an author's `image` field) to show that
 * specific photo. Drop the file in with that exact filename and it will
 * appear wherever that article/author is rendered (hero, grid cards,
 * sidebar thumbnails, author photo, detail page hero image, etc).
 *
 * When `src` is omitted (older data with no `image` field), this falls
 * back to the single shared /public/images/pay-for-power.webp placeholder,
 * so existing categories/authors are unaffected.
 *
 * The fallback icon+label sits underneath the <img> at all times (not
 * swapped in via onError), so it's visible immediately whether the file
 * is missing, still loading, or a broken link — no flash of a raw broken
 * image icon while the file/error event resolves.
 *
 * `alt` sets the <img> alt text (defaults to `label`, then empty).
 *
 * `position` is a CSS object-position (e.g. "42% 28%", from an article's
 * `imagePosition`) so a face stays in frame however the box crops the photo.
 * `priority` marks the above-the-fold photo (eager + high fetch priority) and
 * `width`/`height` reserve its space so the page doesn't jump while loading.
 *
 * `variant="ad"` renders the dashed-border "ad space" box instead, which
 * intentionally does NOT use an image since ad slots are a separate
 * concern from article/author photos.
 */
export default function ImagePlaceholder({
  className = "",
  label,
  variant = "photo",
  rounded = "",
  src,
  alt,
  position,
  priority = false,
  width,
  height,
  sizes,
}) {
  const isAd = variant === "ad";
  const imageSrc = src ? `/images/${src}` : "/images/pay-for-power.webp";

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
        src={imageSrc}
        alt={alt ?? label ?? ""}
        width={width}
        height={height}
        sizes={sizes}
        loading={priority ? "eager" : "lazy"}
        fetchPriority={priority ? "high" : undefined}
        decoding="async"
        style={position ? { objectPosition: position } : undefined}
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
