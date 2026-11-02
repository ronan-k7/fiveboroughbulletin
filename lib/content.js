import categoriesRegistry from "@/data/categories.json";
import authorsRegistry from "@/data/authors.json";
import siteData from "@/data/site.json";

// Per-category article files, loaded eagerly (small dataset). Keyed by
// category slug so lookups stay O(1) without a build step.
import us from "@/data/categories/us.json";
import business from "@/data/categories/business.json";
import finance from "@/data/categories/finance.json";
import world from "@/data/categories/world.json";
import legal from "@/data/categories/legal.json";
import dolcefita from "@/data/categories/dolcefita.json";
import welfare from "@/data/categories/welfare.json";
import culture from "@/data/categories/culture.json";
import gastropoli from "@/data/categories/gastropoli.json";
import indux from "@/data/categories/indux.json";

const CATEGORY_ARTICLES = {
  us,
  business,
  finance,
  world,
  legal,
  dolcefita,
  welfare,
  culture,
  gastropoli,
  indux,
};

export function getAllCategories() {
  return categoriesRegistry.categories;
}

export function getCategory(slug) {
  return categoriesRegistry.categories.find((c) => c.slug === slug) || null;
}

export function getArticlesByCategory(categorySlug) {
  const file = CATEGORY_ARTICLES[categorySlug];
  return file ? file.articles : [];
}

export function getArticleBySlug(categorySlug, slug) {
  const articles = getArticlesByCategory(categorySlug);
  return articles.find((a) => a.slug === slug) || null;
}

/** Every article across every category, each tagged with its category slug. */
export function getAllArticlesFlat() {
  return Object.entries(CATEGORY_ARTICLES).flatMap(([categorySlug, file]) =>
    file.articles.map((a) => ({ ...a, category: categorySlug }))
  );
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
    authorInfo: authorsRegistry.authors.find((a) => a.slug === article.author) || null,
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

export function getSidebarResolved() {
  return {
    latest: resolveRefs(siteData.sidebar.latest),
    trending: resolveRefs(siteData.sidebar.trending),
    mostRead: resolveRefs(siteData.sidebar.mostRead),
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
