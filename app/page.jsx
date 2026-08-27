import ArticleCard from "@/components/ArticleCard";
import SidebarWidget from "@/components/SidebarWidget";
import ImagePlaceholder from "@/components/ImagePlaceholder";
import TripleFeature from "@/components/TripleFeature";
import { getArticlesByCategory, withRelations, getSidebarResolved } from "@/lib/content";

function pick(categorySlug, slugs) {
  const all = getArticlesByCategory(categorySlug).map((a) => withRelations(a, categorySlug));
  return slugs.map((slug) => all.find((a) => a.slug === slug)).filter(Boolean);
}

export default function HomePage() {
  const sidebar = getSidebarResolved();

  const spain = getArticlesByCategory("spain").map((a) => withRelations(a, "spain"));

  // Top feature: 3-column layout (left text list / centre story / right
  // small-image items + opinion pick), replacing the old hero+rail block.
  const featureLeft = pick("spain", [
    "committee-session-closes-debate",
    "case-escalates-national-court",
    "coalition-partners-clash-budget-timeline",
  ]);
  const featureCenter = pick("economy", ["inflation-gap-widens-europe"])[0];
  if (featureCenter) featureCenter.eyebrow = "Macroeconomy";
  const featureRight = pick("spain", ["wildfire-respite-andalusia"]);
  const featurePicks = pick("opinion", ["backstabbing-that-never-stops", "outlandish-trend-tourism"]);
  featurePicks.forEach((a) => (a.opinionLabel = "Challenge"));

  const featuredEconomy = pick("economy", ["grid-investment-approved"])[0];
  const economyGrid = pick("economy", [
    "inflation-gap-widens-europe",
    "seven-day-contracts-employment",
    "banks-raise-deposit-rates-fourth-time",
    "housing-prices-forecast-2028",
  ]);

  const opinionPicks = pick("opinion", ["backstabbing-that-never-stops", "outlandish-trend-tourism", "long-eclipse"]);

  const cultureGrid = pick("culture", [
    "century-old-printing-press-history",
    "profile-separatist-intellectual",
    "spanish-thriller-review",
    "hemingway-reflects-on-spain",
  ]);

  const lifestyleGrid = [
    ...pick("welfare", ["air-conditioning-night-advice", "exercise-routine-fitness-later-life"]),
    ...pick("dolcefita", ["elegant-living-room-colour"]),
    ...pick("spain", ["storm-warning-heavy-rain"]),
  ];

  return (
    <div className="mx-auto w-full max-w-[1440px] px-4 py-6 sm:px-6 md:py-8">
      {/* Top feature: 3 columns on desktop (text list / centre story /
          small-image items + opinion pick), stacking to a single column
          on mobile with the centre story surfaced first. */}
      <TripleFeature
        leftItems={featureLeft}
        center={featureCenter}
        rightItems={featureRight}
        rightPicks={featurePicks}
      />

      {/* Economy section: featured story (image+excerpt) on the left,
          grid below, sticky "Latest" widget fills the right column for
          the full height of the section. */}
      <section className="mt-10 border-t-2 border-ink pt-6">
        <h2 className="font-sans text-sm font-bold uppercase tracking-wide text-brand-teal">Economy</h2>
        <div className="mt-4 grid grid-cols-1 gap-8 lg:grid-cols-[1fr_360px]">
          <div>
            {featuredEconomy && (
              <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 sm:items-start">
                <div>
                  <h3 className="font-serif text-2xl font-bold leading-tight text-ink">
                    <a href={`/economy/${featuredEconomy.slug}`} className="hover:underline decoration-2 underline-offset-2">
                      <span className="text-brand-teal">{featuredEconomy.subCategoryLabel}. </span>
                      {featuredEconomy.title}
                    </a>
                  </h3>
                  <p className="mt-3 text-[15px] leading-relaxed text-ink-soft">{featuredEconomy.excerpt}</p>
                  <a
                    href={`/authors/${featuredEconomy.author}`}
                    className="mt-3 inline-block text-xs font-semibold uppercase tracking-wide text-ink-soft hover:text-brand-teal transition-colors"
                  >
                    {featuredEconomy.authorInfo?.name}
                  </a>
                </div>
                <a href={`/economy/${featuredEconomy.slug}`} className="block">
                  <ImagePlaceholder className="aspect-[4/3] w-full" />
                </a>
              </div>
            )}

            <div className="mt-8 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
              {economyGrid.map((a) => (
                <ArticleCard key={a.slug} article={a} variant="grid" imageAspect="aspect-[4/3]" />
              ))}
            </div>
          </div>

          <SidebarWidget title="Latest" items={sidebar.latest} sticky />
        </div>
      </section>

      {/* Opinion strip */}
      <section className="mt-10 border-t-2 border-ink pt-6">
        <h2 className="font-sans text-sm font-bold uppercase tracking-wide text-ink">Opinion</h2>
        <div className="mt-4 grid grid-cols-1 gap-5 sm:grid-cols-3">
          {opinionPicks.map((a) => (
            <ArticleCard key={a.slug} article={a} variant="opinion" />
          ))}
        </div>
      </section>

      {/* Full-width ad slot — placeholder only. Swap for a real ad unit later. */}
      <div className="mt-10">
        <ImagePlaceholder className="h-32 w-full sm:h-40" label="Ad space — 728x90 / 970x250" variant="ad" />
      </div>

      {/* Culture section with Trending widget. The grid renders as a single
          row of 4 cards on desktop, so the Trending list is capped to the
          same number of items — otherwise the list (up to 8 items) grows
          well past the grid's height and leaves an oversized, uneven gap
          before the section ends. */}
      <section className="mt-10 border-t-2 border-ink pt-6">
        <h2 className="font-sans text-sm font-bold uppercase tracking-wide text-brand-teal">Culture</h2>
        <div className="mt-4 grid grid-cols-1 gap-8 lg:grid-cols-[1fr_360px]">
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {cultureGrid.map((a) => (
              <ArticleCard key={a.slug} article={a} variant="grid" imageAspect="aspect-[4/3]" />
            ))}
          </div>
          <SidebarWidget title="Trending" items={sidebar.trending.slice(0, cultureGrid.length)} />
        </div>
      </section>

      {/* Lifestyle grid with sticky Most read widget */}
      <section className="mt-10 border-t-2 border-ink pt-6">
        <h2 className="font-sans text-sm font-bold uppercase tracking-wide text-brand-teal">Lifestyle</h2>
        <div className="mt-4 grid grid-cols-1 gap-8 lg:grid-cols-[1fr_360px]">
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
            {lifestyleGrid.map((a) => (
              <ArticleCard key={a.slug} article={a} variant="grid" imageAspect="aspect-[16/10]" />
            ))}
          </div>
          <SidebarWidget title="Most read" items={sidebar.mostRead} sticky />
        </div>
      </section>
    </div>
  );
}
