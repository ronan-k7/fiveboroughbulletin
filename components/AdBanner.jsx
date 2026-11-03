import Image from "next/image";

/**
 * Full-width panoramic banner for the "ad space" sections.
 *
 * Two native-resolution crops of the same artwork (no downscaling, so the
 * text stays crisp). `unoptimized` serves the files exactly as supplied
 * instead of re-compressing them through next/image.
 *   - tablet / desktop (md and up): ultra-wide 2172x380 crop (~5.7:1)
 *   - phones: 1400x460 crop (~3:1) so the headline fills the width
 * The box always keeps its aspect ratio, so the layout never jumps.
 * Pass `href` to make the banner clickable (opens in a new tab).
 */
export default function AdBanner({
  href,
  alt = "Independent Journalism for a More Informed America",
  priority = false,
  className = "",
}) {
  const banner = (
    <div className={`w-full overflow-hidden border border-hairline bg-white ${className}`}>
      {/* Phones */}
      <div className="relative aspect-[1400/460] w-full md:hidden">
        <Image
          src="/images/ad-banner-mobile.webp"
          alt={alt}
          fill
          sizes="100vw"
          unoptimized
          priority={priority}
          className="object-cover"
        />
      </div>
      {/* Tablet / desktop */}
      <div className="relative hidden aspect-[2172/380] w-full md:block">
        <Image
          src="/images/ad-banner-desktop.webp"
          alt={alt}
          fill
          sizes="100vw"
          unoptimized
          priority={priority}
          className="object-cover"
        />
      </div>
    </div>
  );

  if (!href) return banner;
  return (
    <a href={href} target="_blank" rel="sponsored noopener noreferrer" className="block">
      {banner}
    </a>
  );
}
