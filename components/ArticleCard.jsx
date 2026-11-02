import Link from "next/link";
import ImagePlaceholder from "./ImagePlaceholder";
import { getCategory } from "@/lib/content";

/**
 * Reusable article teaser card.
 *
 * variants:
 *  - "hero"       big lead story, image left/top, large serif headline
 *  - "sideRail"    small image + headline, used in the hero's right column
 *  - "grid"        image-on-top card used in 2/3-column grids
 *  - "opinion"     italic serif headline, muted photo card (columnist tone)
 *  - "row"         compact text-first row, no image (used in sidebars/lists)
 *  - "list"        image-left / headline+excerpt-right row, matches the
 *                   category/author page list layout from the reference videos
 */
export default function ArticleCard({ article, variant = "grid", imageAspect = "aspect-[16/10]" }) {
  if (!article) return null;
  const href = `/${article.category}/${article.slug}`;
  // Cards only ever show the label of the category the article belongs to
  // (e.g. "Finance"), never a sub-category such as "Federal Reserve".
  const subLabel = article.categoryInfo?.label || getCategory(article.category)?.label;

  if (variant === "hero") {
    return (
      <article>
        <Link href={href} className="block">
          <ImagePlaceholder className={`w-full ${imageAspect}`} src={article.image} />
        </Link>
        <h2 className="mt-3 font-serif text-2xl font-bold leading-tight text-ink md:text-[2rem]">
          <Link href={href} className="hover:underline decoration-2 underline-offset-2">
            {subLabel && <span className="text-brand-teal">{subLabel}. </span>}
            {article.title}
          </Link>
        </h2>
      </article>
    );
  }

  if (variant === "sideRail") {
    return (
      <article className="flex gap-3 py-3">
        <Link href={href} className="shrink-0">
          <ImagePlaceholder className="h-20 w-20 sm:h-24 sm:w-24" src={article.image} />
        </Link>
        <div className="min-w-0">
          <h3 className="font-serif text-base font-bold leading-snug text-ink line-clamp-3">
            <Link href={href} className="hover:underline decoration-2 underline-offset-2">
              {subLabel && <span className="text-brand-teal">{subLabel}. </span>}
              {article.title}
            </Link>
          </h3>
        </div>
      </article>
    );
  }

  if (variant === "opinion") {
    return (
      <article className="bg-neutral-100 p-5">
        <h3 className="font-serif text-xl italic font-semibold leading-snug text-ink">
          <Link href={href} className="hover:underline decoration-2 underline-offset-2">
            {article.title}
          </Link>
        </h3>
      </article>
    );
  }

  if (variant === "row") {
    return (
      <article className="py-2.5">
        <h4 className="font-serif text-[15px] font-semibold leading-snug text-ink">
          <Link href={href} className="hover:text-brand-teal transition-colors">
            {article.title}
          </Link>
        </h4>
      </article>
    );
  }

  if (variant === "list") {
    // Matches the category/author page reference video: image left,
    // small-caps category label, serif headline, excerpt. (Author bylines are only shown on the article detail page.)
    return (
      <article className="flex flex-col gap-4 py-6 first:pt-0 sm:flex-row">
        <Link href={href} className="shrink-0 sm:w-[220px]">
          <ImagePlaceholder className="aspect-[16/10] w-full" src={article.image} />
        </Link>
        <div className="min-w-0 flex-1">
          {subLabel && (
            <p className="text-xs font-bold uppercase tracking-wide text-ink-soft">{subLabel}</p>
          )}
          <h3 className="mt-1.5 font-serif text-xl font-bold leading-snug text-ink">
            <Link href={href} className="hover:underline decoration-2 underline-offset-2">
              {article.title}
            </Link>
          </h3>
          {article.excerpt && (
            <p className="mt-2 text-[15px] leading-relaxed text-ink-soft">{article.excerpt}</p>
          )}
        </div>
      </article>
    );
  }

  // "grid" (default)
  return (
    <article>
      <Link href={href} className="block">
        <ImagePlaceholder className={`w-full ${imageAspect}`} src={article.image} />
      </Link>
      <h3 className="mt-3 font-serif text-lg font-bold leading-snug text-ink">
        <Link href={href} className="hover:underline decoration-2 underline-offset-2">
          {subLabel && <span className="text-brand-teal">{subLabel}. </span>}
          {article.title}
        </Link>
      </h3>
    </article>
  );
}
