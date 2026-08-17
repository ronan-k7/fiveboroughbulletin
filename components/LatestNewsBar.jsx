import siteConfig from "@/data/siteConfig.json";

/**
 * Top strip of the header. In the reference design this is a horizontally
 * scrolling "Outstanding" ticker of article links. For now it's wired up
 * as a single dummy "latest news" headline (same fonts/weights preserved)
 * so it can be swapped for a live feed later without restyling.
 */
export default function LatestNewsBar() {
  return (
    <div className="border-b border-hairline bg-white">
      <div className="mx-auto flex max-w-[1440px] items-center gap-3 px-4 py-2.5 md:px-6">
        <h1 className="shrink-0 font-sans text-[13px] font-bold uppercase tracking-wide text-ink md:text-sm">
          Latest
        </h1>
        <span className="hidden h-4 w-px bg-hairline md:block" aria-hidden="true" />
        <p className="min-w-0 flex-1 truncate font-serif text-[13px] italic text-ink-soft md:text-sm">
          {siteConfig.latestNewsPlaceholder}
        </p>
      </div>
    </div>
  );
}
