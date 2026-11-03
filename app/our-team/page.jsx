import Link from "next/link";
import ImagePlaceholder from "@/components/ImagePlaceholder";
import { StaticPageShell, PageIntro, PageBody, PageSection, PageFooter, TextLink } from "@/components/StaticPage";
import { getAllAuthors, getAllCategories, getArticlesByAuthor } from "@/lib/content";
import { getContactEmails, getStaticPageMetadata } from "@/lib/staticPages";

export const metadata = getStaticPageMetadata("our-team");

export default function OurTeamPage() {
  const email = getContactEmails();
  const authors = getAllAuthors();
  const categories = getAllCategories();

  return (
    <StaticPageShell slug="our-team">
      <PageIntro slug="our-team" eyebrow="About the site" title="The team behind the byline">
        Five Borough Bulletin publishes under one shared newsroom byline. Stories are not credited to individual
        writers, and we do not publish staff profiles.
      </PageIntro>

      <PageBody>
        {authors.map((author) => {
          const count = getArticlesByAuthor(author.slug).length;
          return (
            <article
              key={author.slug}
              className="mt-12 flex flex-col gap-5 rounded-xl border border-hairline bg-neutral-50 p-5 sm:flex-row sm:items-center sm:p-7"
            >
              <ImagePlaceholder
                className="h-[88px] w-[88px] shrink-0 rounded-full"
                rounded="rounded-full"
                label=""
                alt=""
                src={author.image}
              />
              <div>
                <h2 className="font-serif text-2xl font-black text-ink">{author.name}</h2>
                {author.role && (
                  <p className="mt-1 text-[11px] font-extrabold uppercase tracking-[0.18em] text-brand-teal">
                    {author.role}
                  </p>
                )}
                <p className="mt-3 text-sm leading-6 text-ink-soft">{author.bio}</p>
                <Link
                  href={`/authors/${author.slug}`}
                  className="mt-4 inline-flex text-sm font-extrabold text-brand-teal hover:underline"
                >
                  {count > 0 ? `Read all ${count} stories →` : "View the author page →"}
                </Link>
              </div>
            </article>
          );
        })}

        <PageSection number="01" label="The byline" title="One name, the whole newsroom" first>
          <p>
            Every story is published as <strong className="text-ink">FiveBoroughBulletin Staff</strong>: the newsroom as
            a whole, rather than one person. The byline stands for the team&apos;s responsibility for what is
            published, not for a single writer&apos;s authorship.
          </p>
          <p>
            Because individual writers are not credited, there are no individual profiles to read. Questions,
            corrections and concerns go to the team through the <TextLink href="/contact">contact page</TextLink>.
          </p>
          <p>
            To see how to judge what a story is built on, read <TextLink href="/source-methodology">Source Methodology</TextLink>.
          </p>
        </PageSection>

        <PageSection number="02" label="Coverage" title="What the team covers">
          <p>The site is organized into sections, and every one is published under the same shared byline.</p>
          <ul className="divide-y divide-hairline overflow-hidden rounded-xl border border-hairline">
            {categories.map((category) => (
              <li key={category.slug}>
                <Link
                  href={`/${category.slug}`}
                  className="group flex flex-col gap-1 bg-white px-5 py-4 transition-colors hover:bg-neutral-50 sm:flex-row sm:items-baseline sm:gap-6"
                >
                  <span className="font-serif text-lg font-black text-ink transition-colors group-hover:text-brand-teal sm:w-36 sm:shrink-0">
                    {category.label}
                  </span>
                  <span className="text-sm leading-6 text-ink-soft">{category.description}</span>
                </Link>
              </li>
            ))}
          </ul>
        </PageSection>

        <PageSection number="03" label="Reaching the team" title="Get in touch">
          <p>
            Write to <TextLink href={`mailto:${email.editorial}`}>{email.editorial}</TextLink> for story tips and general
            questions. If you are named in a story and want to respond, see{" "}
            <TextLink href="/right-of-reply-policy">Right of Reply</TextLink>.
          </p>
        </PageSection>

        <PageFooter current="our-team" />
      </PageBody>
    </StaticPageShell>
  );
}
