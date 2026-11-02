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
  const latestHeadlines = getLatestArticles(4).map((a) => ({
    title: a.title,
    href: `/${a.category}/${a.slug}`,
  }));

  return (
    <>
      <Header latestHeadlines={latestHeadlines} />
      <main className="flex flex-1 flex-col">{children}</main>
      <Footer />
    </>
  );
}
