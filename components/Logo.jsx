import Link from "next/link";
import siteConfig from "@/data/siteConfig.json";

/**
 * Site logo / wordmark.
 *
 * To use a real logo image instead of the text-based mimic below:
 * 1. Drop your logo file at /public/images/logo.png (or .svg)
 * 2. Uncomment the <img> block and remove the wordmark block.
 *
 * `shrink` compacts the tagline + wordmark once the page has scrolled,
 * matching the reference video's condensed sticky header.
 */
export default function Logo({ className = "", shrink = false }) {
  return (
    <Link
      href="/"
      aria-label={siteConfig.siteName}
      className={`inline-flex min-w-0 flex-col items-center leading-none select-none ${className}`}
    >
      {/* --- Image placeholder (uncomment and point to your own asset) ---
      <img
        src="/images/logo.png"
        alt={siteConfig.siteName}
        className={shrink ? "h-7 w-auto" : "h-9 md:h-11 w-auto"}
      />
      ------------------------------------------------------------------ */}

      <span
        className={`flex max-w-full items-center gap-1 overflow-hidden whitespace-nowrap font-bold tracking-wide text-brand-teal uppercase transition-all duration-300 ease-out ${
          shrink
            ? "max-h-0 opacity-0 text-[7.5px]"
            : "max-h-4 opacity-100 text-[7.5px] sm:text-[9px] md:text-[11px]"
        }`}
      >
        {siteConfig.tagline}
        <svg
          width="12"
          height="9"
          viewBox="0 0 14 10"
          fill="none"
          className="shrink-0 -mb-0.5 md:h-2.5 md:w-3.5"
          aria-hidden="true"
        >
          <path d="M0 9L14 1V9H0Z" fill="var(--color-brand-teal)" />
        </svg>
      </span>
      <span
        className={`font-serif font-black tracking-tight text-ink transition-all duration-300 ease-out ${
          shrink ? "text-xl md:text-2xl" : "text-2xl sm:text-3xl md:text-[2.75rem] -mt-0.5"
        }`}
      >
        {siteConfig.siteName}
      </span>
    </Link>
  );
}
