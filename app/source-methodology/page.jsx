import {
  StaticPageShell,
  PageIntro,
  PageBody,
  PageSection,
  PageList,
  PageFooter,
  TextLink,
} from "@/components/StaticPage";
import { getContactEmails, getStaticPageMetadata } from "@/lib/staticPages";

export const metadata = getStaticPageMetadata("source-methodology");

export default function SourceMethodologyPage() {
  return (
    <StaticPageShell slug="source-methodology">
      <PageIntro slug="source-methodology" eyebrow="About the site" title="How to read our sources">
        Many stories end with a <em>Sources &amp; further reading</em> block. This page explains what is in it, so you
        can judge a story by what it is built on.
      </PageIntro>

      <PageBody>
        <PageSection number="01" label="What you will see" title="Around every story" first>
          <p>Each story is presented with the same set of signals:</p>
          <PageList>
            <li>
              <strong className="text-ink">The byline row</strong> shows the newsroom byline, the date and the time the
              story was published.
            </li>
            <li>
              <strong className="text-ink">The standfirst</strong>, near the top, gives a one-or-two-sentence summary of
              what the story establishes.
            </li>
            <li>
              <strong className="text-ink">Sources &amp; further reading</strong>, at the end, lists the documents,
              statements and reports the story draws on.
            </li>
            <li>
              <strong className="text-ink">Photo credits</strong> appear under images where one applies, so you can tell
              a news photograph from a file or supplied image.
            </li>
          </PageList>
        </PageSection>

        <PageSection number="02" label="Source entries" title="Reading a source">
          <p>Each entry in the source list has two parts:</p>
          <PageList>
            <li>
              <strong className="text-ink">Publisher:</strong> the organization that produced the document, dataset or
              report.
            </li>
            <li>
              <strong className="text-ink">Label:</strong> the specific item, so you can tell a court filing from a
              press release from a news report.
            </li>
          </PageList>
          <p>
            Entries open the original website in a new tab. Pages can change or move after we link to them, so compare
            a source&apos;s own date with the date on our story.
          </p>
        </PageSection>

        <PageSection number="03" label="Primary and secondary" title="What we lean on">
          <p>
            Where we can, we point to primary records first: filings, court orders, official statements, public data and
            transcripts. When a story relies on another outlet&apos;s reporting, we say so and link to it rather than
            presenting it as our own.
          </p>
          <p>
            We try to attribute consequential claims to a named organization or person, and to distinguish what is
            documented from interpretation, projection or opinion.
          </p>
        </PageSection>

        <PageSection number="04" label="Limits" title="What a source list does and does not show">
          <p>
            A source list shows what a story draws on. It does not prove that every statement in the story is correct,
            and the depth of sourcing differs between a short news item and a longer analysis or profile.
          </p>
          <p>
            The most useful habit is to open the sources, compare their dates with the story&apos;s own, and weigh a
            story by what it cites. Where details matter for a decision, treat our story as a starting point and check
            the primary documents.
          </p>
        </PageSection>

        <PageSection number="05" label="If something is off" title="Where to take a concern">
          <PageList>
            <li>
              A factual mistake: write to the corrections address on the{" "}
              <TextLink href="/contact#corrections">contact page</TextLink>.
            </li>
            <li>
              You are named in a story and want your response considered:{" "}
              <TextLink href="/right-of-reply-policy">Right of Reply</TextLink>.
            </li>
            <li>
              A rights, privacy or legal concern: <TextLink href="/legal#complaints">Legal</TextLink>.
            </li>
          </PageList>
        </PageSection>

        <PageFooter current="source-methodology" />
      </PageBody>
    </StaticPageShell>
  );
}
