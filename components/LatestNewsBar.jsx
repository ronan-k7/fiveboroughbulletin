import Link from "next/link";
import siteConfig from "@/data/siteConfig.json";
import HeaderGlow from "./HeaderGlow";
import TickerSocialIcons from "./TickerSocialIcons";

function BoltIcon({ className = "" }) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" className={className} aria-hidden="true">
      <path d="M13.4 1.6 3.6 13.8c-.4.5 0 1.2.6 1.2h5.9l-1.7 7.4c-.2.8.8 1.3 1.3.6l9.8-12.2c.4-.5 0-1.2-.6-1.2h-5.9l1.7-7.4c.2-.8-.8-1.3-1.3-.6Z" />
    </svg>
  );
}

function CaretIcon({ direction = "up", className = "" }) {
  return (
    <svg viewBox="0 0 12 12" fill="currentColor" className={className} aria-hidden="true">
      {direction === "down" ? (
        <path d="M6 9 1 3h10L6 9Z" />
      ) : (
        <path d="M6 3l5 6H1l5-6Z" />
      )}
    </svg>
  );
}

/**
 * Top strip of the header: a dark "circuit glow" ticker bar carrying the
 * Latest headline plus a live-style markets index. `marketTicker` and
 * `latestNewsPlaceholder` are placeholder/data-config values in
 * siteConfig.json so this can be wired to a real feed later without
 * restyling.
 */
export default function LatestNewsBar() {
  const { marketTicker } = siteConfig;
  const isDown = marketTicker?.direction === "down";

  return (
    <div className="relative overflow-hidden bg-header-navy">
      <HeaderGlow />
      <div className="relative mx-auto flex max-w-[1440px] items-center gap-3 px-4 py-2.5 md:gap-4 md:px-6">
        <div className="flex shrink-0 items-center gap-2 md:gap-3">
          <BoltIcon className="h-4 w-4 text-header-cyan-bright md:h-[18px] md:w-[18px]" />
          <span className="rounded-md bg-gradient-to-br from-header-cyan-bright to-header-cyan-dark px-3 py-1 text-[11px] font-extrabold uppercase tracking-wide text-white shadow-[0_0_14px_rgba(34,211,238,0.55)] md:px-3.5 md:py-1.5 md:text-[13px]">
            Latest
          </span>
        </div>

        <span className="hidden h-4 w-px shrink-0 bg-white/25 sm:block" aria-hidden="true" />

        <p className="min-w-0 flex-1 truncate font-sans text-[12.5px] text-white/90 md:text-[13.5px]">
          {siteConfig.latestNewsPlaceholder}
        </p>

        {marketTicker && (
          <div className="hidden shrink-0 items-center gap-4 md:flex lg:gap-5">
            <Link
              href={marketTicker.href}
              className="text-[13px] font-extrabold uppercase tracking-wide text-header-cyan-bright transition-colors hover:text-white"
            >
              {marketTicker.label}
            </Link>
            <span className="h-4 w-px bg-white/25" aria-hidden="true" />
            <span className="flex items-center gap-1.5 whitespace-nowrap text-[13px] font-semibold text-white">
              {marketTicker.index}
              <CaretIcon
                direction={isDown ? "down" : "up"}
                className={`h-2.5 w-2.5 ${isDown ? "text-red-500" : "text-header-green"}`}
              />
              <span className={isDown ? "text-red-500" : "text-header-green"}>{marketTicker.change}</span>
            </span>
          </div>
        )}

        <TickerSocialIcons links={siteConfig.headerSocialLinks} className="hidden md:flex" />
      </div>
    </div>
  );
}
