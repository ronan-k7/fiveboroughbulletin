import Link from "next/link";
import ImagePlaceholder from "./ImagePlaceholder";
import { getCategory } from "@/lib/content";

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
  const eyebrow = categoryLabelOf(article);

  return (
    <article>
      <Link href={href} className="block">
        <ImagePlaceholder className="aspect-[4/3] w-full" src={article.image} />
      </Link>
      {eyebrow && (
        <p className="mt-3 flex items-center gap-1.5 text-xs font-bold uppercase tracking-wide text-ink-soft">
          <span className="inline-block h-2.5 w-2.5 bg-brand-teal" aria-hidden="true" />
          {eyebrow}
        </p>
      )}
      <h2 className={`font-serif text-2xl font-bold leading-tight text-ink ${eyebrow ? "mt-1.5" : "mt-3"}`}>
        <Link href={href} className="hover:underline decoration-2 underline-offset-2">
          {article.title}
        </Link>
      </h2>
      {article.excerpt && (
        <p className="mt-3 text-[15px] leading-relaxed text-ink-soft">{article.excerpt}</p>
      )}
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
          {subLabel && <span className="text-brand-teal">{subLabel}. </span>}
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
        <ImagePlaceholder className="aspect-[16/10] w-full" src={article.image} />
      </Link>
      <h3 className="mt-3 font-serif text-base font-bold leading-snug text-ink">
        <Link href={href} className="hover:underline decoration-2 underline-offset-2">
          {subLabel && <span className="text-brand-teal">{subLabel}. </span>}
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
          {categoryLabelOf(article) && <span className="text-brand-teal not-italic">{categoryLabelOf(article)}. </span>}
          {article.title}
        </Link>
      </h3>
    </article>
  );
}
