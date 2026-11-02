import ArticleCard from "@/components/ArticleCard";
import SidebarWidget from "@/components/SidebarWidget";
import ImagePlaceholder from "@/components/ImagePlaceholder";
import TripleFeature from "@/components/TripleFeature";
import JsonLd from "@/components/JsonLd";
import {
  buildPageMetadata,
  collectionPageNode,
  graph,
  SITE_TITLE,
  SITE_NAME,
  SITE_DESCRIPTION,
  SITE_KEYWORDS,
} from "@/lib/seo";
import { getArticlesByCategory, getLatestArticles, withRelations, getSidebarResolved } from "@/lib/content";

export const metadata = buildPageMetadata({
  title: SITE_TITLE,
  absoluteTitle: true,
  description: SITE_DESCRIPTION,
  path: "/",
  keywords: SITE_KEYWORDS,
});

/** Newest-first articles of one category, minus anything already shown higher up the page. */
function newestIn(categorySlug, count, usedKeys) {
  return getArticlesByCategory(categorySlug)
    .filter((a) => !usedKeys.has(`${categorySlug}/${a.slug}`))
    .slice(0, count)
    .map((a) => withRelations(a, categorySlug));
}

export default function HomePage() {
  const sidebar = getSidebarResolved();

  // Everything on this page is picked by date (newest first, then time) --
  // nothing is hand-picked. A new article added to any data/categories/*.json
  // file lands in the top block automatically, and pushes the oldest one out.
  //
  // Top feature, 7 newest stories site-wide: 1 centre story, 3 text items on
  // the left, 1 small-image item on the right and 2 picks under it.
  const top = getLatestArticles(7);
  const featureCenter = top[0];
  const featureLeft = top.slice(1, 4);
  const featureRight = top.slice(4, 5);
  const featurePicks = top.slice(5, 7);

  // Stories already shown in the top block aren't repeated in the sections below.
  const used = new Set(top.map((a) => `${a.category}/${a.slug}`));

  const businessGrid = newestIn("business", 4, used);
  const featuredBusiness = businessGrid[0];
  const financePicks = newestIn("finance", 3, used);

  return (
    <div className="mx-auto w-full max-w-[1440px] px-4 py-6 sm:px-6 md:py-8">
      <JsonLd
        data={graph(
          collectionPageNode({
            path: "/",
            name: SITE_TITLE,
            description: SITE_DESCRIPTION,
            articles: getLatestArticles(10),
          })
        )}
      />
      <h1 className="sr-only">{SITE_NAME}: U.S., Business, Finance and World News</h1>
      {/* Top feature: 3 columns on desktop (text list / centre story /
          small-image items + world pick), stacking to a single column
          on mobile with the centre story surfaced first. */}
      <TripleFeature
        leftItems={featureLeft}
        center={featureCenter}
        rightItems={featureRight}
        rightPicks={featurePicks}
      />

      {/* Business section: featured story (image+excerpt) on the left,
          grid below, sticky "Latest" widget fills the right column for
          the full height of the section. */}
      <section className="mt-10 border-t-2 border-ink pt-6">
        <h2 className="font-sans text-sm font-bold uppercase tracking-wide text-brand-teal">Business</h2>
        <div className="mt-4 grid grid-cols-1 gap-8 lg:grid-cols-[1fr_360px]">
          <div>
            {featuredBusiness && (
              <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 sm:items-start">
                <div>
                  <h3 className="font-serif text-2xl font-bold leading-tight text-ink">
                    <a href={`/business/${featuredBusiness.slug}`} className="hover:underline decoration-2 underline-offset-2">
                      <span className="text-brand-teal">{featuredBusiness.categoryInfo?.label}. </span>
                      {featuredBusiness.title}
                    </a>
                  </h3>
                  <p className="mt-3 text-[15px] leading-relaxed text-ink-soft">{featuredBusiness.excerpt}</p>
                </div>
                <a href={`/business/${featuredBusiness.slug}`} className="block">
                  <ImagePlaceholder className="aspect-[4/3] w-full" src={featuredBusiness.image} />
                </a>
              </div>
            )}

            <div
              className={`mt-8 grid grid-cols-1 gap-6 sm:grid-cols-2 ${
                businessGrid.length >= 4 ? "lg:grid-cols-4" : "lg:grid-cols-3"
              }`}
            >
              {businessGrid.map((a) => (
                <ArticleCard key={a.slug} article={a} variant="grid" imageAspect="aspect-[4/3]" />
              ))}
            </div>
          </div>

          <SidebarWidget title="Latest" items={sidebar.latest} sticky />
        </div>
      </section>

      {/* Finance strip */}
      <section className="mt-10 border-t-2 border-ink pt-6">
        <h2 className="font-sans text-sm font-bold uppercase tracking-wide text-ink">Finance</h2>
        <div className="mt-4 grid grid-cols-1 gap-5 sm:grid-cols-3">
          {financePicks.map((a) => (
            <ArticleCard key={a.slug} article={a} variant="grid" imageAspect="aspect-[4/3]" />
          ))}
        </div>
      </section>

      {/* Full-width ad slot — placeholder only. Swap for a real ad unit later. */}
      <div className="mt-10">
        <ImagePlaceholder className="h-32 w-full sm:h-40" label="Ad space — 728x90 / 970x250" variant="ad" />
      </div>
    </div>
  );
}
