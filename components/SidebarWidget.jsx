import Link from "next/link";

/**
 * Reusable "Latest / Trending / Most read" list widget for the right rail.
 *
 * `sticky` pins the widget within its section as the user scrolls, so a
 * long sidebar list keeps filling the right column even after a shorter
 * main content column (grid, article body, etc) has ended — this is what
 * avoids the empty right-side gaps seen when the body runs out first.
 *
 * `numbered` shows "01, 02, ..." markers (matches the "Most read"-style
 * widget from the reference videos); when false it renders a plain
 * divided list (matches the "Other news" style widget).
 */
export default function SidebarWidget({ title, items, sticky = false, numbered = true, topOffsetClass = "top-24" }) {
  if (!items || items.length === 0) return null;

  return (
    <aside className={`border-t-2 border-ink pt-3 ${sticky ? `lg:sticky ${topOffsetClass} self-start` : ""}`}>
      <h2 className="font-sans text-sm font-bold uppercase tracking-wide text-ink">{title}</h2>
      <ol className="mt-3 divide-y divide-hairline">
        {items.map((item, idx) => (
          <li key={`${item.category}-${item.slug}`} className="flex gap-3 py-3 first:pt-0">
            {numbered && (
              <span className="font-serif text-xl font-black leading-none text-neutral-300">
                {String(idx + 1).padStart(2, "0")}
              </span>
            )}
            <h3 className="font-serif text-[15px] font-semibold leading-snug text-ink">
              <Link href={`/${item.category}/${item.slug}`} className="hover:text-brand-teal transition-colors">
                {item.title}
              </Link>
            </h3>
          </li>
        ))}
      </ol>
    </aside>
  );
}
