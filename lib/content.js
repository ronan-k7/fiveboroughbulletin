import categoriesRegistry from "@/data/categories.json";
import authorsRegistry from "@/data/authors.json";

// Per-category article files, loaded eagerly (small dataset). Keyed by
// category slug so lookups stay O(1) without a build step.
import us from "@/data/categories/us.json";
import business from "@/data/categories/business.json";
import finance from "@/data/categories/finance.json";
import world from "@/data/categories/world.json";
import politics from "@/data/categories/politics.json";
import investigation from "@/data/categories/investigation.json";
import puertoRico from "@/data/categories/puerto-rico.json";
import technology from "@/data/categories/technology.json";
import sports from "@/data/categories/sports.json";

/**
 * Single-author site: every article is published by the newsroom account in
 * data/authors.json. Whatever `author` an article carries (or doesn't carry)
 * in its JSON, it is normalised to this slug when loaded, so future articles
 * are always credited to "FiveBoroughBulletin Staff" without extra work.
 */
const STAFF_SLUG = authorsRegistry.authors[0].slug;
const asStaff = (article) => ({ ...article, author: STAFF_SLUG });

const CATEGORY_ARTICLES = {
  us,
  business,
  finance,
  world,
  politics,
  investigation,
  "puerto-rico": puertoRico,
  technology,
  sports,
};

/**
 * "Latest" rule used everywhere on the site: newest first by `date`, then by
 * `time` (e.g. "14:20 ET" or "2:20 PM ET") within the same day. Anything
 * still tied keeps its original order. Articles with no valid date sink to
 * the bottom. Because every list below is built from these helpers, a new
 * article you add to any data/categories/*.json file is slotted in
 * automatically by its date -- the position in the JSON file doesn't matter.
 */
export function minutesOfDay(time) {
  const m = /(\d{1,2}):(\d{2})\s*(am|pm)?/i.exec(time || "");
  if (!m) return 0;
  let h = Number(m[1]);
  const ap = (m[3] || "").toLowerCase();
  if (ap === "pm" && h < 12) h += 12;
  if (ap === "am" && h === 12) h = 0;
  return h * 60 + Number(m[2]);
}

function publishedAt(article) {
  const day = Date.parse(article.date);
  if (Number.isNaN(day)) return -Infinity;
  return day + minutesOfDay(article.time) * 60 * 1000;
}

function newestFirst(list) {
  return [...list].sort((a, b) => publishedAt(b) - publishedAt(a));
}

export function getAllCategories() {
  return categoriesRegistry.categories;
}

export function getCategory(slug) {
  return categoriesRegistry.categories.find((c) => c.slug === slug) || null;
}

export function getArticlesByCategory(categorySlug) {
  const file = CATEGORY_ARTICLES[categorySlug];
  return file ? newestFirst(file.articles.map(asStaff)) : [];
}

export function getArticleBySlug(categorySlug, slug) {
  const articles = getArticlesByCategory(categorySlug);
  return articles.find((a) => a.slug === slug) || null;
}

/** Every article across every category (newest first), each tagged with its category slug. */
export function getAllArticlesFlat() {
  return newestFirst(
    Object.entries(CATEGORY_ARTICLES).flatMap(([categorySlug, file]) =>
      file.articles.map((a) => ({ ...asStaff(a), category: categorySlug }))
    )
  );
}

/**
 * The newest `count` articles across the whole site (by date, then time).
 * `exclude` ({ category, slug }) leaves one article out, e.g. the story the
 * reader is currently on.
 * `home: true` also skips articles flagged `"hideFromHome": true` in their
 * JSON -- they stay on the site (category page, article page, search,
 * sitemap) but are kept off the homepage.
 */
export function getLatestArticles(count = 5, exclude = null, { home = false } = {}) {
  return getAllArticlesFlat()
    .filter((a) => !(exclude && a.category === exclude.category && a.slug === exclude.slug))
    .filter((a) => !(home && a.hideFromHome))
    .slice(0, count)
    .map((a) => withRelations(a, a.category));
}

export function getAllAuthors() {
  return authorsRegistry.authors;
}

export function getAuthor(slug) {
  return authorsRegistry.authors.find((a) => a.slug === slug) || null;
}

/** Every article written by a given author, across all categories. */
export function getArticlesByAuthor(authorSlug) {
  return getAllArticlesFlat().filter((a) => a.author === authorSlug);
}

/** Attaches resolved author + category label onto an article for display. */
export function withRelations(article, categorySlug) {
  if (!article) return null;
  const categoryInfo = getCategory(categorySlug || article.category);
  return {
    ...article,
    category: categorySlug || article.category,
    authorInfo: authorsRegistry.authors[0],
    categoryInfo,
  };
}

/** Resolves {category, slug} refs (sidebar lists, relatedPicks) to full articles. */
export function resolveRefs(refs) {
  return refs
    .map((ref) => {
      const article = getArticleBySlug(ref.category, ref.slug);
      return article ? withRelations(article, ref.category) : null;
    })
    .filter(Boolean);
}

const DAY_MS = 24 * 60 * 60 * 1000;

/**
 * Date-driven "Trending" / "Most read" lists. There are no page-view counts
 * in the data, so both use the same date rule as everything else: only
 * stories published within `windowDays` of the NEWEST story on the site are
 * considered (so a new article enters automatically and old ones age out),
 * and within that window the ones readers commented on most come first
 * (ties -> newest first). If the window holds fewer than `count` stories,
 * the list is topped up with the next-newest ones.
 *
 * To make either list purely "newest first" instead, set its window to 0.
 */
function getRecentlyPopularArticles(count, windowDays, { home = false } = {}) {
  const all = getAllArticlesFlat().filter((a) => !(home && a.hideFromHome)); // newest first
  if (all.length === 0) return [];
  const cutoff = publishedAt(all[0]) - windowDays * DAY_MS;
  const inWindow = all.filter((a) => publishedAt(a) >= cutoff);
  const ranked = [...inWindow].sort(
    (a, b) => (b.commentCount || 0) - (a.commentCount || 0) || publishedAt(b) - publishedAt(a)
  );
  const rest = all.filter((a) => !inWindow.includes(a));
  return [...ranked, ...rest].slice(0, count).map((a) => withRelations(a, a.category));
}

export function getTrendingArticles(count = 5, opts) {
  return getRecentlyPopularArticles(count, 7, opts);
}

export function getMostReadArticles(count = 6, opts) {
  return getRecentlyPopularArticles(count, 30, opts);
}

/**
 * Right-rail lists. All three are computed from the articles' dates, so
 * they update by themselves when you add stories -- nothing is hand-picked
 * any more.
 */
export function getSidebarResolved({ exclude = null, home = false } = {}) {
  return {
    latest: getLatestArticles(5, exclude, { home }),
    trending: getTrendingArticles(5, { home }),
    mostRead: getMostReadArticles(6, { home }),
  };
}

/** Resolves an article's relatedPicks (same-category slug strings) to full articles. */
export function getRelatedPicks(article, categorySlug) {
  if (!article?.relatedPicks?.length) return [];
  return article.relatedPicks
    .map((slug) => getArticleBySlug(categorySlug, slug))
    .filter(Boolean)
    .map((a) => withRelations(a, categorySlug));
}
