import Header from "./Header";
import Footer from "./Footer";
import { getLatestArticles } from "@/lib/content";

/**
 * Shared site chrome (header + footer) used by the app/ root layout so
 * every route gets the same header/footer without repeating markup.
 *
 * The 4 newest stories (by date/time, across all categories) are picked
 * here on the server and handed to the header's "Latest" bar as plain
 * data, so the article JSON never has to ship to the browser for it.
 */
export default function SiteChrome({ children }) {
  // A few extra are fetched so the bar can still show 4 on the homepage,
  // where articles flagged "hideFromHome" are skipped (see LatestNewsBar).
  const latestHeadlines = getLatestArticles(6).map((a) => ({
    title: a.title,
    href: `/${a.category}/${a.slug}`,
    hideFromHome: Boolean(a.hideFromHome),
  }));

  return (
    <>
      <Header latestHeadlines={latestHeadlines} />
      <main className="flex flex-1 flex-col">{children}</main>
      <Footer />
    </>
  );
}
