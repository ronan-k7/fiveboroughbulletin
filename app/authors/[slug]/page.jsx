import { notFound } from "next/navigation";
import ArticleCard from "@/components/ArticleCard";
import SidebarWidget from "@/components/SidebarWidget";
import ImagePlaceholder from "@/components/ImagePlaceholder";
import {
  getAllAuthors,
  getAuthor,
  getArticlesByAuthor,
  withRelations,
  getSidebarResolved,
} from "@/lib/content";

export function generateStaticParams() {
  return getAllAuthors().map((a) => ({ slug: a.slug }));
}

export async function generateMetadata({ params }) {
  const { slug } = await params;
  const author = getAuthor(slug);
  return { title: author ? `${author.name} - vozpópuli` : "vozpópuli" };
}

function XIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
      <path d="M18.9 2H22l-7.6 8.7L23.3 22H16.6l-5.2-6.8L5.4 22H2.3l8.1-9.3L1.4 2h6.9l4.7 6.2L18.9 2Zm-1.2 18.2h1.7L7.4 3.7H5.6l12.1 16.5Z" />
    </svg>
  );
}

function MailIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" aria-hidden="true">
      <rect x="3" y="5" width="18" height="14" rx="2" />
      <path d="m3 7 9 6 9-6" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

export default async function AuthorPage({ params }) {
  const { slug } = await params;
  const author = getAuthor(slug);
  if (!author) notFound();

  const articles = getArticlesByAuthor(author.slug);
  const sidebar = getSidebarResolved();
  // Each "list" card (image + headline + excerpt) runs noticeably taller
  // than a "Most read" row, so a short article list paired with the full
  // 10-item sidebar leaves a gap once the sidebar's sticky scroll runs out
  // ahead of it. Scale the sidebar length to roughly match instead.
  const mostReadCount = Math.min(sidebar.mostRead.length, Math.max(4, articles.length * 3));

  return (
    <div className="mx-auto w-full max-w-[1440px] px-4 py-8 sm:px-6">
      <div className="flex flex-col gap-4 border-b border-hairline pb-6 sm:flex-row sm:items-center">
        <ImagePlaceholder className="h-24 w-24 shrink-0 rounded-full" rounded="rounded-full" label="" />
        <div>
          <h1 className="font-serif text-2xl font-black text-ink md:text-3xl">{author.name}</h1>
          {author.role && <p className="mt-0.5 text-sm text-ink-soft">{author.role}</p>}
          <div className="mt-2 flex items-center gap-4 text-sm text-ink-soft">
            {author.social?.x && (
              <a
                href={author.social.x}
                target="_blank"
                rel="noreferrer"
                aria-label={`${author.name} on X`}
                className="flex items-center gap-1.5 hover:text-brand-teal transition-colors"
              >
                <XIcon />
              </a>
            )}
            {author.email && (
              <a
                href={`mailto:${author.email}`}
                className="flex items-center gap-1.5 hover:text-brand-teal transition-colors"
              >
                <MailIcon />
                {author.email}
              </a>
            )}
          </div>
        </div>
      </div>

      {author.bio && (
        <p className="mt-6 max-w-3xl text-[15px] leading-relaxed text-ink-soft">{author.bio}</p>
      )}

      <h2 className="mt-8 flex items-center gap-2 font-sans text-sm font-bold uppercase tracking-wide text-ink">
        <span className="inline-block h-4 w-1.5 -skew-x-12 bg-brand-teal" aria-hidden="true" />
        Published articles
      </h2>

      <div className="mt-2 grid grid-cols-1 gap-8 lg:grid-cols-[1fr_360px]">
        <div className="divide-y divide-hairline">
          {articles.length === 0 ? (
            <p className="py-6 text-ink-soft">No articles from this author yet.</p>
          ) : (
            articles.map((a) => <ArticleCard key={a.slug} article={withRelations(a, a.category)} variant="list" />)
          )}
        </div>
        <SidebarWidget title="Most read" items={sidebar.mostRead.slice(0, mostReadCount)} sticky />
      </div>
    </div>
  );
}
