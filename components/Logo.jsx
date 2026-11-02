import Link from "next/link";
import siteConfig from "@/data/siteConfig.json";

/**
 * Site logo (Five Borough Bulletin).
 *
 * Uses the image at /public/images/logo.webp (transparent background, so it
 * sits cleanly on the header's light gradient). The dark-footer version is
 * /public/images/logo-light.webp and is used in Footer.jsx.
 *
 * `shrink` makes the logo smaller once the page has scrolled, matching the
 * condensed sticky header. Width/height attributes are the file's intrinsic
 * size so the browser reserves space and the header never jumps while the
 * image loads.
 */
export default function Logo({ className = "", shrink = false }) {
  return (
    <Link
      href="/"
      aria-label={siteConfig.siteName}
      className={`inline-flex min-w-0 items-center justify-center select-none ${className}`}
    >
      <img
        src="/images/logo.webp"
        alt={siteConfig.siteName}
        width={1100}
        height={278}
        fetchPriority="high"
        decoding="async"
        className={`block w-auto max-w-full object-contain transition-all duration-300 ease-out ${
          shrink ? "h-9 md:h-10" : "h-9 sm:h-10 md:h-14"
        }`}
      />
    </Link>
  );
}
