import Link from "next/link";
import { StaticPageShell, PageIntro, PageBody, PageSection, PageFooter, TextLink } from "@/components/StaticPage";
import { getStaticPageMetadata } from "@/lib/staticPages";
import { getAllCategories } from "@/lib/content";

export const metadata = getStaticPageMetadata("about");

const pillars = [
  [
    "The country and the world",
    "U.S., world and politics coverage that explains what happened, who is affected and what comes next, in plain language.",
  ],
  [
    "Business and money",
    "Companies, deals, markets and the economy, explained without pretending that one story is personal financial advice.",
  ],
  [
    "Accountability and community",
    "Investigations, Puerto Rico, technology and sports: the stories that shape everyday life across the five boroughs and beyond.",
  ],
];

export default function AboutPage() {
  const categories = getAllCategories();
  return (
    <StaticPageShell slug="about">
      <PageIntro slug="about" eyebrow="Five Borough Bulletin" title="Independent news, clearly explained.">
        Five Borough Bulletin is an independent news site covering the U.S., business, finance, the world, politics,
        investigations, Puerto Rico, technology and sports. We aim to tell readers what is happening, show what the
        reporting rests on and be plain about what is still uncertain.
      </PageIntro>

      <PageBody>
        <div className="mt-12 grid gap-px overflow-hidden rounded-xl border border-hairline bg-hairline md:grid-cols-3">
          {pillars.map(([title, text]) => (
            <section key={title} className="bg-white p-6 sm:p-7">
              <h2 className="font-serif text-xl font-bold text-ink sm:text-2xl">{title}</h2>
              <p className="mt-3 text-sm leading-7 text-ink-soft">{text}</p>
            </section>
          ))}
        </div>

        <PageSection number="01" label="What readers can expect" title="Show the workings" first>
          <p>
            Every story shows when it was published and who published it. Where a story rests on filings, official
            statements, datasets or other outlets&apos; reporting, those sources are listed at the end so you can open
            them yourself. Photographs carry a credit where one applies.
          </p>
          <p>
            We try to separate what is documented from what is interpretation or forecast, and to say so when a
            development is still unfolding. If we get something wrong, we want to hear about it:{" "}
            <TextLink href="/contact#corrections">here is how to reach us</TextLink>.
          </p>
        </PageSection>

        <PageSection number="02" label="Coverage" title="What we cover">
          <p>The site is organized into sections, all published under the same newsroom byline.</p>
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

        <PageSection number="03" label="Learn more" title="How the site works">
          <p>
            Meet the newsroom on the <TextLink href="/our-team">Our Team</TextLink> page, see how to read our sources in{" "}
            <TextLink href="/source-methodology">Source Methodology</TextLink>, or read how people named in a story can
            respond in <TextLink href="/right-of-reply-policy">Right of Reply</TextLink>.
          </p>
        </PageSection>

        <PageFooter current="about" />
      </PageBody>
    </StaticPageShell>
  );
}
