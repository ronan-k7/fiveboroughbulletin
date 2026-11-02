import {
  getAllArticlesFlat,
  getAllAuthors,
  getAllCategories,
} from "@/lib/content";
import { absoluteUrl, articlePath, imageUrl, modifiedIso } from "@/lib/seo";

/**
 * /sitemap.xml, generated from the same JSON the pages are built from.
 * Add an article to any data/categories/*.json file (or a category to
 * data/categories.json) and the next build lists it automatically -- there
 * is nothing to edit here.
 *
 *  - articles marked "noindex": true are left out
 *  - categories/authors with no articles yet are left out (their pages are
 *    noindex until they have content)
 *  - lastModified = the article's `updated` date if set, otherwise its
 *    publish date/time
 */
function toDate(iso) {
  const d = iso ? new Date(iso) : null;
  return d && !Number.isNaN(d.getTime()) ? d : undefined;
}

function newest(dates) {
  const valid = dates.filter(Boolean);
  return valid.length ? new Date(Math.max(...valid.map((d) => d.getTime()))) : undefined;
}

export default function sitemap() {
  const articles = getAllArticlesFlat()
    .filter((a) => !a.noindex)
    .map((a) => ({ ...a, lastMod: toDate(modifiedIso(a)) }));

  const entries = [
    {
      url: absoluteUrl("/"),
      lastModified: newest(articles.map((a) => a.lastMod)),
      changeFrequency: "hourly",
      priority: 1,
    },
  ];

  for (const category of getAllCategories()) {
    const inCategory = articles.filter((a) => a.category === category.slug);
    if (inCategory.length === 0) continue;
    entries.push({
      url: absoluteUrl(`/${category.slug}`),
      lastModified: newest(inCategory.map((a) => a.lastMod)),
      changeFrequency: "hourly",
      priority: 0.8,
    });
  }

  for (const a of articles) {
    entries.push({
      url: absoluteUrl(articlePath(a)),
      lastModified: a.lastMod,
      changeFrequency: "monthly",
      priority: 0.7,
      ...(a.image ? { images: [imageUrl(a.image)] } : {}),
    });
  }

  for (const author of getAllAuthors()) {
    const theirs = articles.filter((a) => a.author === author.slug);
    if (theirs.length === 0) continue;
    entries.push({
      url: absoluteUrl(`/authors/${author.slug}`),
      lastModified: newest(theirs.map((a) => a.lastMod)),
      changeFrequency: "weekly",
      priority: 0.4,
    });
  }

  return entries;
}
