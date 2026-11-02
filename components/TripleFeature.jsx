import Link from "next/link";
import ImagePlaceholder from "./ImagePlaceholder";
import { getCategory } from "@/lib/content";
import { bodyPlainText } from "@/lib/richText";
import { formatLongDate, readingMinutes } from "@/lib/format";

/** Only the article's own category label is ever shown on a card, never a sub-category. */
const categoryLabelOf = (article) => article.categoryInfo?.label || getCategory(article.category)?.label;

/**
 * Homepage top feature: 3-column layout with a large centered story
 * (image + kicker + headline + excerpt) flanked by a left column of
 * text-first items and a right column of small image items plus two
 * compact picks at the bottom. No bylines are shown on this block.
 *
 * Responsive behaviour:
 *  - lg+   : 3 even columns side by side, left/right columns divided by
 *            hairline rules matching the site's existing rail styling.
 *  - below lg: stacks to a single column, centre story first (it's the
 *            lead item), then left column items, then right column items,
 *            so the most important story always appears first on mobile.
 */
export default function TripleFeature({ leftItems = [], center, rightItems = [], rightPicks = [] }) {
  return (
    // Asymmetric column widths on desktop: centre story is widest (the
    // "focused" lead item), left text column narrower, right image column
    // narrowest — instead of splitting evenly into thirds.
    <section className="grid grid-cols-1 gap-8 lg:grid-cols-[0.8fr_1.4fr_0.8fr] lg:gap-8">
      {/* Centre column comes first in DOM for mobile priority, reordered via lg:order */}
      <div className="order-1 lg:order-2">
        {center && <CenterStory article={center} />}
      </div>

      <div className="order-2 lg:order-1 divide-y divide-hairline lg:border-r lg:border-hairline lg:pr-6">
        {leftItems.map((a) => (
          <TextItem key={a.slug} article={a} />
        ))}
      </div>

      <div className="order-3 lg:border-l lg:border-hairline lg:pl-6">
        <div className="divide-y divide-hairline">
          {rightItems.map((a) => (
            <SmallImageItem key={a.slug} article={a} />
          ))}
        </div>
        {rightPicks.length > 0 && (
          <div className="mt-3 flex flex-col gap-3 border-t-2 border-ink pt-3">
            {rightPicks.map((a) => (
              <OpinionPickItem key={a.slug} article={a} />
            ))}
          </div>
        )}
      </div>
    </section>
  );
}

function CenterStory({ article }) {
  const href = `/${article.category}/${article.slug}`;
  const label = categoryLabelOf(article);
  const when = formatLongDate(article.date);

  return (
    <article className="group">
      {/* Photo: category chip + soft bottom shade sit on the image, so the
          only label on the card is the story's category. */}
      <Link
        href={href}
        className="relative block overflow-hidden [&_img]:transition-transform [&_img]:duration-700 group-hover:[&_img]:scale-[1.03]"
        tabIndex={-1}
        aria-hidden="true"
      >
        <ImagePlaceholder
          className="aspect-[4/3] w-full sm:aspect-[3/2]"
          src={article.image}
          position={article.imagePosition}
          alt=""
          sizes="(min-width: 1024px) 46vw, 100vw"
          priority
        />
        <span className="pointer-events-none absolute inset-x-0 bottom-0 h-2/5 bg-gradient-to-t from-black/60 via-black/15 to-transparent" />
        {label && (
          <span className="absolute bottom-3 left-3 inline-flex items-center gap-1.5 bg-brand-teal px-2.5 py-1 text-[11px] font-extrabold uppercase tracking-[0.14em] text-white shadow-md sm:bottom-4 sm:left-4">
            <span className="h-1.5 w-1.5 rounded-full bg-header-cyan-bright" />
            {label}
          </span>
        )}
      </Link>

      <h2 className="mt-4 font-serif text-[1.55rem] font-black leading-[1.16] tracking-[-0.005em] text-ink sm:text-[1.85rem] xl:text-[2.05rem]">
        <Link href={href} className="decoration-brand-teal decoration-[3px] underline-offset-4 hover:underline">
          {article.title}
        </Link>
      </h2>

      {article.excerpt && (
        <p className="mt-3 line-clamp-3 text-[15.5px] leading-relaxed text-ink-soft sm:text-base">{article.excerpt}</p>
      )}

      <div className="mt-4 flex flex-wrap items-center justify-between gap-x-4 gap-y-2 border-t border-hairline pt-3 text-[13px] text-ink-soft">
        <p className="flex items-center gap-2">
          <time dateTime={article.date} className="font-semibold text-ink">
            {when}
          </time>
          <span aria-hidden="true" className="text-hairline-dark/40">&middot;</span>
          <span>{readingMinutes(article.content ? bodyPlainText(article.content) : "")} min read</span>
        </p>
        <Link
          href={href}
          className="inline-flex items-center gap-1.5 font-bold uppercase tracking-wide text-brand-teal transition-colors hover:text-brand-teal-dark"
        >
          Read the full story
          <svg viewBox="0 0 24 24" width="14" height="14" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
            <path d="M5 12h14M13 6l6 6-6 6" />
          </svg>
        </Link>
      </div>
    </article>
  );
}

function TextItem({ article }) {
  const href = `/${article.category}/${article.slug}`;
  const subLabel = categoryLabelOf(article);

  return (
    <article className="py-4 first:pt-0">
      <h3 className="font-serif text-lg font-bold leading-snug text-ink">
        <Link href={href} className="hover:underline decoration-2 underline-offset-2">
          {subLabel && <span className="text-brand-teal">{subLabel}{subLabel.endsWith(".") ? " " : ". "}</span>}
          {article.title}
        </Link>
      </h3>
      {article.excerpt && (
        <p className="mt-2 text-[14px] leading-relaxed text-ink-soft line-clamp-3">{article.excerpt}</p>
      )}
    </article>
  );
}

function SmallImageItem({ article }) {
  const href = `/${article.category}/${article.slug}`;
  const subLabel = categoryLabelOf(article);

  return (
    <article className="py-4 first:pt-0">
      <Link href={href} className="block">
        <ImagePlaceholder className="aspect-[16/10] w-full" src={article.image} position={article.imagePosition} />
      </Link>
      <h3 className="mt-3 font-serif text-base font-bold leading-snug text-ink">
        <Link href={href} className="hover:underline decoration-2 underline-offset-2">
          {subLabel && <span className="text-brand-teal">{subLabel}{subLabel.endsWith(".") ? " " : ". "}</span>}
          {article.title}
        </Link>
      </h3>
    </article>
  );
}

function OpinionPickItem({ article }) {
  const href = `/${article.category}/${article.slug}`;

  return (
    <article className="bg-neutral-100 p-4">
      <h3 className="font-serif text-base italic font-semibold leading-snug text-ink">
        <Link href={href} className="hover:underline decoration-2 underline-offset-2">
          {categoryLabelOf(article) && <span className="text-brand-teal not-italic">{categoryLabelOf(article)}{categoryLabelOf(article).endsWith(".") ? " " : ". "}</span>}
          {article.title}
        </Link>
      </h3>
    </article>
  );
}
