import { SITE_URL } from "@/lib/seo";

/**
 * /robots.txt. Everything public is crawlable; internal search results and
 * the JSON API are not (they're thin/duplicate and not meant for the index).
 * The sitemap line points crawlers at app/sitemap.js, which regenerates
 * itself from the article JSON on every build.
 */
export default function robots() {
  return {
    rules: [{ userAgent: "*", allow: "/", disallow: ["/search", "/api/"] }],
    sitemap: `${SITE_URL}/sitemap.xml`,
  };
}
