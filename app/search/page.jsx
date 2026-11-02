import Link from "next/link";
import ArticleCard from "@/components/ArticleCard";
import SidebarWidget from "@/components/SidebarWidget";
import { getAllArticlesFlat, getSidebarResolved, withRelations } from "@/lib/content";

function matchesQuery(article, q) {
  const haystack = [article.title, article.excerpt, article.subCategoryLabel, ...(article.keywords || [])]
    .join(" ")
    .toLowerCase();
  return haystack.includes(q);
}

export async function generateMetadata({ searchParams }) {
  const { q } = await searchParams;
  const query = (q || "").trim();
  return {
    title: query ? `Search results for "${query}"` : "Search",
    // Internal search results are thin/duplicate pages: crawlable links, but not indexed.
    robots: { index: false, follow: true },
  };
}

export default async function SearchPage({ searchParams }) {
  const { q } = await searchParams;
  const query = (q || "").trim();
  const qLower = query.toLowerCase();

  const results = query
    ? getAllArticlesFlat()
        .filter((a) => matchesQuery(a, qLower))
        .map((a) => withRelations(a, a.category))
    : [];

  const sidebar = getSidebarResolved();
  // Same rationale as the category/author pages: scale "Most read" length
  // to the result count so the sidebar's sticky scroll doesn't outrun a
  // short results list.
  const mostReadCount = Math.min(sidebar.mostRead.length, Math.max(4, results.length * 3));

  return (
    <div className="mx-auto w-full max-w-[1440px] px-4 py-8 sm:px-6">
      <p className="text-sm text-ink-soft">
        <Link href="/" className="hover:text-brand-teal transition-colors">
          Home
        </Link>{" "}
        &rarr; Search
      </p>

      <h1 className="mt-3 flex items-center gap-2 font-serif text-3xl font-black text-ink md:text-4xl">
        <span className="inline-block h-8 w-2 -skew-x-12 bg-brand-teal" aria-hidden="true" />
        {query ? `Results for “${query}”` : "Search"}
      </h1>

      <p className="mt-4 border-b border-hairline pb-6 text-[15px] leading-relaxed text-ink-soft">
        {query
          ? `${results.length} article${results.length === 1 ? "" : "s"} found.`
          : "Use the search icon in the header to look for articles, authors and topics."}
      </p>

      <div className="mt-2 grid grid-cols-1 gap-8 lg:grid-cols-[1fr_360px]">
        <div className="divide-y divide-hairline">
          {query && results.length === 0 && (
            <p className="py-6 text-ink-soft">No articles matched “{query}”. Try a different search term.</p>
          )}
          {results.map((a) => (
            <ArticleCard key={`${a.category}-${a.slug}`} article={a} variant="list" />
          ))}
        </div>
        <SidebarWidget title="Most read" items={sidebar.mostRead.slice(0, mostReadCount)} sticky />
      </div>
    </div>
  );
}
