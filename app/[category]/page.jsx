import { notFound } from "next/navigation";
import Link from "next/link";
import ArticleCard from "@/components/ArticleCard";
import SidebarWidget from "@/components/SidebarWidget";
import {
  getAllCategories,
  getCategory,
  getArticlesByCategory,
  withRelations,
  getSidebarResolved,
} from "@/lib/content";

export function generateStaticParams() {
  return getAllCategories().map((c) => ({ category: c.slug }));
}

export async function generateMetadata({ params }) {
  const { category: categorySlug } = await params;
  const category = getCategory(categorySlug);
  return { title: category ? `${category.label} - vozpópuli` : "vozpópuli" };
}

export default async function CategoryPage({ params }) {
  const { category: categorySlug } = await params;
  const category = getCategory(categorySlug);
  if (!category) notFound();

  const articles = getArticlesByCategory(category.slug).map((a) => withRelations(a, category.slug));
  const sidebar = getSidebarResolved();
  // Same rationale as the author page: a "list" card runs taller than a
  // sidebar row, so scale the "Most read" length to the article count to
  // avoid the sidebar's sticky scroll outrunning a short category feed.
  const mostReadCount = Math.min(sidebar.mostRead.length, Math.max(4, articles.length * 3));

  return (
    <div className="mx-auto w-full max-w-[1440px] px-4 py-8 sm:px-6">
      <p className="text-sm text-ink-soft">
        <Link href="/" className="hover:text-brand-teal transition-colors">
          Front page
        </Link>{" "}
        &rarr; {category.label}
      </p>

      <div className="mt-3 flex flex-wrap items-start justify-between gap-4">
        <h1 className="flex items-center gap-2 font-serif text-3xl font-black text-ink md:text-4xl">
          <span className="inline-block h-8 w-2 -skew-x-12 bg-brand-teal" aria-hidden="true" />
          {category.label.toUpperCase()}
        </h1>
        {category.trendingTags?.length > 0 && (
          <p className="text-sm text-ink-soft">
            {category.trendingTags.map((tag, idx) => (
              <span key={tag}>
                {tag}
                {idx < category.trendingTags.length - 1 && <span className="mx-2">&middot;</span>}
              </span>
            ))}
          </p>
        )}
      </div>

      {category.description && (
        <p className="mt-4 max-w-3xl border-b border-hairline pb-6 text-[15px] leading-relaxed text-ink-soft">
          {category.description}
        </p>
      )}

      <div className="mt-2 grid grid-cols-1 gap-8 lg:grid-cols-[1fr_360px]">
        <div className="divide-y divide-hairline">
          {articles.length === 0 ? (
            <p className="py-6 text-ink-soft">No articles in this category yet.</p>
          ) : (
            articles.map((a) => <ArticleCard key={a.slug} article={a} variant="list" />)
          )}
        </div>
        <SidebarWidget title="Most read" items={sidebar.mostRead.slice(0, mostReadCount)} sticky />
      </div>
    </div>
  );
}
