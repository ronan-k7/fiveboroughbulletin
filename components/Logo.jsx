import Link from "next/link";
import siteConfig from "@/data/siteConfig.json";

/**
 * Site logo (Five Borough Bulletin).
 *
 * Uses the image at /public/images/logo.webp (transparent background, so it
 * sits cleanly on the header's light gradient). The dark-footer version is
 * /public/images/logo-light.webp and is used in Footer.jsx.
 *
 * `shrink` scales the logo down (56px -> 40px) once the page has scrolled.
 * It is a transform, not a height change, so it never reflows the page.
 * Width/height attributes are the file's intrinsic
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
        decoding="async"
        className={`block h-9 w-auto max-w-full origin-center object-contain transition-transform duration-[380ms] ease-[cubic-bezier(0.22,1,0.36,1)] will-change-transform motion-reduce:transition-none sm:h-10 md:h-14 ${
          shrink ? "md:scale-[0.7143]" : ""
        }`}
      />
    </Link>
  );
}
