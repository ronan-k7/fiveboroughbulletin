import siteConfig from "@/data/siteConfig.json";
import { minutesOfDay } from "@/lib/content";
import { bodyPlainText, firstParagraph } from "@/lib/richText";

/**
 * Central SEO helpers: every page's <head> metadata and JSON-LD comes from
 * here, driven by data/siteConfig.json, data/categories.json,
 * data/authors.json and the article JSON files -- so nothing needs to be
 * touched in code when you add articles or categories.
 *
 * ARTICLE FIELDS (data/categories/*.json)
 *   Required (already used site-wide): slug, title, excerpt, date ("YYYY-MM-DD"),
 *     time ("14:20 ET" or "2:20 PM ET"), image (file in /public/images),
 *     keywords [], content [], subCategoryLabel
 *   Optional SEO overrides -- leave out and sensible defaults are used:
 *     seoTitle        <title>/social title instead of `title`
 *     seoDescription  meta description instead of `excerpt` (first paragraph if no excerpt)
 *     imageAlt        alt text / social image alt (falls back to imageCaption, then title)
 *     updated         "YYYY-MM-DD" last-modified date (falls back to date)
 *     updatedTime     "16:05 ET" (optional, with `updated`)
 *     noindex         true to keep one article out of search results + sitemap
 *     layout          "centered" renders the centre-aligned feature page (components/CenteredArticle.jsx)
 *     dateline        "Washington" -- shown in the byline of the centered layout
 *     imagePosition   CSS object-position for the photo ("42% 28%") -- keeps faces in frame on every crop
 *     sources         [{ publisher, label, url }] -- listed as "Sources" + emitted as schema.org citation
 *     hideFromHome    true to keep the article off the homepage only (it stays everywhere else)
 *   Body (`content`) items are strings with optional [link](url), **bold**, *italic*; or blocks:
 *     { type: "pullquote", text, cite, href }
 *     { type: "stats", eyebrow, items: [{ value, label }], text }
 *
 * CATEGORY FIELDS (data/categories.json): slug, label, description (required);
 *   optional seoTitle, keywords [].
 * AUTHOR FIELDS (data/authors.json): optional type ("Organization" | "Person").
 */

export const SITE_URL = (siteConfig.url || "https://www.fiveboroughbulletin.com").replace(/\/+$/, "");
export const SITE_NAME = siteConfig.siteName;
export const SITE_TITLE = siteConfig.title || `${SITE_NAME} | News`;
export const SITE_DESCRIPTION = siteConfig.description || "";
export const SITE_KEYWORDS = siteConfig.keywords || [];
export const LOCALE = siteConfig.locale || "en_US";
export const LANGUAGE = siteConfig.language || "en-US";
export const DEFAULT_OG_IMAGE = siteConfig.ogImage || "/images/og-default.jpg";
export const LOGO_PATH = siteConfig.logo || "/icon-512.png";

export function absoluteUrl(path = "/") {
  if (/^https?:\/\//i.test(path)) return path;
  return `${SITE_URL}${path.startsWith("/") ? path : `/${path}`}`;
}

/** Trims to `max` characters on a word boundary, adding an ellipsis only when something was cut. */
export function clip(text, max = 160) {
  const t = String(text || "").replace(/\s+/g, " ").trim();
  if (t.length <= max) return t;
  const cut = t.slice(0, max - 1);
  const lastSpace = cut.lastIndexOf(" ");
  return `${(lastSpace > max * 0.6 ? cut.slice(0, lastSpace) : cut).replace(/[\s,;:.\-–—]+$/, "")}…`;
}

// ---------------------------------------------------------------- dates

function etOffset(isoDay) {
  const d = new Date(`${isoDay}T12:00:00Z`);
  if (Number.isNaN(d.getTime())) return "-05:00";
  const label =
    new Intl.DateTimeFormat("en-US", { timeZone: "America/New_York", timeZoneName: "longOffset" })
      .formatToParts(d)
      .find((p) => p.type === "timeZoneName")?.value || "GMT-05:00";
  const m = /GMT([+-]\d{2}):?(\d{2})?/.exec(label);
  return m ? `${m[1]}:${m[2] || "00"}` : "-05:00";
}

/**
 * "2026-08-31" + "2:20 PM ET" -> "2026-08-31T14:20:00-04:00" (handles
 * daylight saving). Returns the plain date when there is no time, and
 * undefined when the date is missing/invalid.
 */
export function toIsoET(date, time) {
  if (!date || Number.isNaN(Date.parse(date))) return undefined;
  const day = /^\d{4}-\d{2}-\d{2}$/.test(date) ? date : new Date(date).toISOString().slice(0, 10);
  if (!time) return day;
  const mins = minutesOfDay(time);
  const hh = String(Math.floor(mins / 60)).padStart(2, "0");
  const mm = String(mins % 60).padStart(2, "0");
  return `${day}T${hh}:${mm}:00${etOffset(day)}`;
}

export const publishedIso = (a) => toIsoET(a.date, a.time);
export const modifiedIso = (a) => (a.updated ? toIsoET(a.updated, a.updatedTime) : publishedIso(a));

// ---------------------------------------------------------------- images

export const imageUrl = (file) => absoluteUrl(file ? `/images/${file}` : DEFAULT_OG_IMAGE);
export const articlePath = (a) => `/${a.category}/${a.slug}`;
export const articleDescription = (a) =>
  clip(a.seoDescription || a.excerpt || firstParagraph(a.content) || SITE_DESCRIPTION, 160);
export const articleImageAlt = (a) => a.imageAlt || a.imageCaption || a.title;

// ---------------------------------------------------------------- <head> metadata

/**
 * Builds a complete Next.js metadata object (title, description, canonical,
 * Open Graph, Twitter card, robots). Open Graph/Twitter are fully specified
 * here because a page-level `openGraph` replaces the layout's rather than
 * merging with it.
 */
export function buildPageMetadata({
  title,
  absoluteTitle = false,
  description,
  path,
  imageFile,
  imageAlt,
  keywords,
  type = "website",
  noindex = false,
  openGraph = {},
}) {
  const url = absoluteUrl(path);
  const image = imageUrl(imageFile);
  const alt = imageAlt || title;
  const ogTitle = absoluteTitle ? title : `${title} | ${SITE_NAME}`;

  return {
    title: absoluteTitle ? { absolute: title } : title,
    description,
    ...(keywords?.length ? { keywords } : {}),
    alternates: { canonical: url },
    openGraph: {
      type,
      siteName: SITE_NAME,
      locale: LOCALE,
      url,
      title: ogTitle,
      description,
      images: [{ url: image, alt }],
      ...openGraph,
    },
    twitter: {
      card: "summary_large_image",
      title: ogTitle,
      description,
      images: [{ url: image, alt }],
    },
    ...(noindex ? { robots: { index: false, follow: true, googleBot: { index: false, follow: true } } } : {}),
  };
}

export function articleMetadata(article, author) {
  return buildPageMetadata({
    title: article.seoTitle || article.title,
    description: articleDescription(article),
    path: articlePath(article),
    imageFile: article.image,
    imageAlt: articleImageAlt(article),
    keywords: article.keywords,
    type: "article",
    noindex: Boolean(article.noindex),
    openGraph: {
      publishedTime: publishedIso(article),
      modifiedTime: modifiedIso(article),
      authors: author ? [absoluteUrl(`/authors/${author.slug}`)] : undefined,
      section: article.categoryInfo?.label || article.subCategoryLabel,
      tags: article.keywords,
    },
  });
}

export function categoryMetadata(category, articleCount) {
  return buildPageMetadata({
    title: category.seoTitle || `${category.label} News`,
    description: clip(category.description || `${category.label} news from ${SITE_NAME}.`, 160),
    path: `/${category.slug}`,
    keywords: category.keywords,
    // An empty category is a thin page: keep it out of search until it has stories.
    noindex: articleCount === 0,
  });
}

export function authorMetadata(author, articleCount) {
  const description = clip(author.bio || `${author.name} at ${SITE_NAME}.`, 160);
  return buildPageMetadata({
    title: author.name,
    description,
    path: `/authors/${author.slug}`,
    imageFile: author.image,
    imageAlt: author.name,
    type: "profile",
    noindex: articleCount === 0,
  });
}

// ---------------------------------------------------------------- JSON-LD (schema.org)

const ORG_ID = `${SITE_URL}/#organization`;
const SITE_ID = `${SITE_URL}/#website`;

export const graph = (...nodes) => ({ "@context": "https://schema.org", "@graph": nodes.filter(Boolean) });

export function organizationNode() {
  return {
    "@type": "NewsMediaOrganization",
    "@id": ORG_ID,
    name: SITE_NAME,
    url: absoluteUrl("/"),
    description: SITE_DESCRIPTION,
    logo: { "@type": "ImageObject", url: absoluteUrl(LOGO_PATH), width: 512, height: 512 },
  };
}

export function websiteNode() {
  return {
    "@type": "WebSite",
    "@id": SITE_ID,
    url: absoluteUrl("/"),
    name: SITE_NAME,
    description: SITE_DESCRIPTION,
    inLanguage: LANGUAGE,
    publisher: { "@id": ORG_ID },
    potentialAction: {
      "@type": "SearchAction",
      target: { "@type": "EntryPoint", urlTemplate: `${SITE_URL}/search?q={search_term_string}` },
      "query-input": "required name=search_term_string",
    },
  };
}

/** items: [{ name, path }] in order, starting with Home. */
export function breadcrumbNode(items) {
  return {
    "@type": "BreadcrumbList",
    itemListElement: items.map((it, i) => ({
      "@type": "ListItem",
      position: i + 1,
      name: it.name,
      item: absoluteUrl(it.path),
    })),
  };
}

export function itemListNode(articles) {
  return {
    "@type": "ItemList",
    itemListElement: articles.map((a, i) => ({
      "@type": "ListItem",
      position: i + 1,
      url: absoluteUrl(articlePath(a)),
      name: a.title,
    })),
  };
}

export function collectionPageNode({ path, name, description, articles = [] }) {
  return {
    "@type": "CollectionPage",
    "@id": `${absoluteUrl(path)}#webpage`,
    url: absoluteUrl(path),
    name,
    description,
    inLanguage: LANGUAGE,
    isPartOf: { "@id": SITE_ID },
    publisher: { "@id": ORG_ID },
    mainEntity: itemListNode(articles),
  };
}

export function authorRef(author) {
  if (!author) return { "@id": ORG_ID };
  return {
    "@type": author.type || "Person",
    name: author.name,
    url: absoluteUrl(`/authors/${author.slug}`),
  };
}

export function newsArticleNode(article, author) {
  const url = absoluteUrl(articlePath(article));
  const words = bodyPlainText(article.content).join(" ").split(/\s+/).filter(Boolean).length;
  return {
    "@type": "NewsArticle",
    "@id": `${url}#article`,
    mainEntityOfPage: { "@type": "WebPage", "@id": url },
    url,
    headline: clip(article.seoTitle || article.title, 110),
    description: articleDescription(article),
    image: [imageUrl(article.image)],
    datePublished: publishedIso(article),
    dateModified: modifiedIso(article),
    author: authorRef(author),
    publisher: { "@id": ORG_ID },
    isPartOf: { "@id": SITE_ID },
    articleSection: article.categoryInfo?.label || article.subCategoryLabel,
    keywords: article.keywords?.length ? article.keywords.join(", ") : undefined,
    wordCount: words || undefined,
    inLanguage: LANGUAGE,
    isAccessibleForFree: true,
    // Outbound sources the story cites (articles that list `sources`).
    citation: article.sources?.length
      ? article.sources.map((src) => ({ "@type": "CreativeWork", name: src.label, url: src.url, publisher: src.publisher }))
      : undefined,
    // Lets assistants/search read the headline and standfirst aloud.
    speakable: article.layout === "centered"
      ? { "@type": "SpeakableSpecification", cssSelector: ["[data-speakable]"] }
      : undefined,
  };
}
