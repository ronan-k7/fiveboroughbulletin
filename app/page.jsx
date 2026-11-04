import ArticleCard from "@/components/ArticleCard";
import SidebarWidget from "@/components/SidebarWidget";
import ImagePlaceholder from "@/components/ImagePlaceholder";
import AdBanner from "@/components/AdBanner";
import TripleFeature from "@/components/TripleFeature";
import PoliticsPuertoRicoSection from "@/components/PoliticsPuertoRicoSection";
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
import {
  getAllArticlesFlat,
  getArticlesByCategory,
  getLatestArticles,
  withRelations,
  getSidebarResolved,
} from "@/lib/content";

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
    .filter((a) => !usedKeys.has(`${categorySlug}/${a.slug}`) && !a.hideFromHome)
    .slice(0, count)
    .map((a) => withRelations(a, categorySlug));
}

const keyOf = (a) => `${a.category}/${a.slug}`;

/**
 * Fills empty slots without ever repeating a story already on the page.
 * Candidates are every homepage-eligible story not used yet; the pick always
 * comes from the category that has appeared the FEWEST times so far (so a
 * category with no story on the page yet goes first, ties -> newest first).
 * `used` and `shown` are updated as stories are picked.
 */
function freshPicks(count, usedKeys, shown) {
  const pool = getAllArticlesFlat().filter((a) => !a.hideFromHome && !usedKeys.has(keyOf(a)));
  const out = [];
  while (out.length < count && pool.length > 0) {
    pool.sort((a, b) => (shown[a.category] || 0) - (shown[b.category] || 0)); // stable: keeps newest-first on ties
    const a = pool.shift();
    usedKeys.add(keyOf(a));
    shown[a.category] = (shown[a.category] || 0) + 1;
    out.push(withRelations(a, a.category));
  }
  return out;
}

export default function HomePage() {
  const sidebar = getSidebarResolved({ home: true });

  // Everything on this page is picked by date (newest first, then time) --
  // nothing is hand-picked. A new article added to any data/categories/*.json
  // file lands in the top block automatically, and pushes the oldest one out.
  //
  // Articles flagged "hideFromHome": true in their JSON are skipped here
  // (and in the sidebar below) but stay live everywhere else on the site.
  //
  // Top feature, 7 newest stories site-wide: 1 centre story, 3 text items on
  // the left, 1 small-image item on the right and 2 picks under it.
  //
  // Exception: an article with  "homePin": N  in its JSON is placed in slot N
  // of this block (1 = centre story, 2 = first left text item, ...) instead of
  // wherever its date would put it. Everything else keeps its date order
  // around it. Remove "homePin" to return the article to normal ordering.
  //
  // Politics and Puerto Rico have their own section further down (3 newest
  // stories each). They are picked FIRST and kept out of the top block and the
  // fill-in picks, so none of those six stories is ever shown twice.
  const politicsPicks = newestIn("politics", 3, new Set());
  const puertoRicoPicks = newestIn("puerto-rico", 3, new Set());
  const reserved = new Set([...politicsPicks, ...puertoRicoPicks].map(keyOf));

  const pool = getLatestArticles(40, null, { home: true }).filter((a) => !reserved.has(keyOf(a)));
  const pinned = pool.filter((a) => a.homePin).sort((a, b) => a.homePin - b.homePin);
  const top = pool.filter((a) => !a.homePin).slice(0, 7 - pinned.length);
  pinned.forEach((a) => top.splice(Math.min(a.homePin - 1, top.length), 0, a));
  const featureCenter = top[0];
  const featureLeft = top.slice(1, 4);
  const featureRight = top.slice(4, 5);
  const featurePicks = top.slice(5, 7);

  // Stories already shown in the top block aren't repeated in the sections below.
  const used = new Set([...top.map(keyOf), ...reserved]);
  const shown = {}; // how many times each category appears on the page so far
  const markShown = (list) => list.forEach((a) => (shown[a.category] = (shown[a.category] || 0) + 1));
  markShown(top);
  markShown(politicsPicks);
  markShown(puertoRicoPicks);

  // Business: 1 featured story + a grid of the next ones. The featured story is
  // NOT repeated in the grid. If business runs short, the empty grid slots are
  // filled with a story from the category shown least on the page (a category
  // with nothing on the page yet comes first) -- never with a repeat.
  const businessPicks = newestIn("business", 5, used);
  businessPicks.forEach((a) => used.add(keyOf(a)));
  markShown(businessPicks);
  const featuredBusiness = businessPicks[0];
  let financePicks = newestIn("finance", 3, used);
  financePicks.forEach((a) => used.add(keyOf(a)));
  markShown(financePicks);

  const businessGrid = businessPicks.slice(1, 5);
  if (businessGrid.length < 3) businessGrid.push(...freshPicks(3 - businessGrid.length, used, shown));
  if (financePicks.length < 3) financePicks = [...financePicks, ...freshPicks(3 - financePicks.length, used, shown)];

  return (
    <div className="mx-auto w-full max-w-[1440px] px-4 py-6 sm:px-6 md:py-8">
      <JsonLd
        data={graph(
          collectionPageNode({
            path: "/",
            name: SITE_TITLE,
            description: SITE_DESCRIPTION,
            articles: getLatestArticles(10, null, { home: true }),
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
                      <span className="text-brand-teal">{featuredBusiness.categoryInfo?.label}{featuredBusiness.categoryInfo?.label?.endsWith(".") ? " " : ". "}</span>
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

      {/* Politics & Puerto Rico: dark navy two-desk feature band (3 newest
          stories of each category, see components/PoliticsPuertoRicoSection.jsx). */}
      <PoliticsPuertoRicoSection politics={politicsPicks} puertoRico={puertoRicoPicks} />

      {/* Finance strip */}
      <section className="mt-10 border-t-2 border-ink pt-6">
        <h2 className="font-sans text-sm font-bold uppercase tracking-wide text-ink">Finance</h2>
        <div className="mt-4 grid grid-cols-1 gap-5 sm:grid-cols-3">
          {financePicks.map((a) => (
            <ArticleCard key={a.slug} article={a} variant="grid" imageAspect="aspect-[4/3]" />
          ))}
        </div>
      </section>

      {/* Full-width ad slot (panoramic desktop crop, wider mobile crop). */}
      <div className="mt-10">
        <AdBanner />
      </div>
    </div>
  );
}
