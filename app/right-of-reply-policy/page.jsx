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

export const metadata = getStaticPageMetadata("right-of-reply-policy");

export default function RightOfReplyPage() {
  const email = getContactEmails();

  return (
    <StaticPageShell slug="right-of-reply-policy">
      <PageIntro slug="right-of-reply-policy" eyebrow="About the site" title="Right of reply">
        If a story names you, your company or your organization, you can ask for your response to be considered. This
        page explains how to ask and what happens next.
      </PageIntro>

      <PageBody>
        <PageSection number="01" label="Who can ask" title="Anyone a story names" first>
          <p>
            A person, company or organization named in a Five Borough Bulletin story, or someone authorized to speak
            for them, can ask for a response to be considered after publication.
          </p>
        </PageSection>

        <PageSection number="02" label="How to ask" title="What to send us">
          <p>
            Email <TextLink href={`mailto:${email.editorial}`}>{email.editorial}</TextLink> with:
          </p>
          <PageList>
            <li>The address of the story and the passage you are responding to.</li>
            <li>Your response, in your own words. We may ask you to shorten it.</li>
            <li>Who you are and, if you write for an organization, your authority to respond on its behalf.</li>
            <li>Any documents or links that support your response.</li>
          </PageList>
          <p>
            We may ask you to confirm your identity first, so that nobody can respond falsely in someone else&apos;s
            name.
          </p>
        </PageSection>

        <PageSection number="03" label="What happens next" title="How we handle a response">
          <p>We read each request and tell you what we decided. Depending on what you send, we may:</p>
          <PageList>
            <li>Add your response to the story, clearly labeled as a response, attributed and dated.</li>
            <li>
              Update the story if your response shows that something in it is wrong, and correct it as described on
              the <TextLink href="/contact#corrections">contact page</TextLink>.
            </li>
            <li>Link to a statement you have published yourself.</li>
            <li>
              Decline, and say why, for example if the response is abusive, cannot be verified, is unrelated to the
              story, or makes serious claims about someone else.
            </li>
          </PageList>
          <p>
            We decide what appears on our site, so a request does not guarantee that a response is published, or
            published in full. When a story rests on a public record or another outlet&apos;s reporting, a response to
            our story does not change that underlying source, and the story continues to point to it.
          </p>
        </PageSection>

        <PageSection number="04" label="Other routes" title="If your concern is legal">
          <p>
            A response is not the same as a legal complaint. If you believe a story is unlawful, infringes your rights
            or intrudes on your privacy, use the complaints route on the{" "}
            <TextLink href="/legal#complaints">Legal page</TextLink>. For a plain factual error, write to the
            corrections address on the <TextLink href="/contact#corrections">contact page</TextLink>.
          </p>
        </PageSection>

        <PageFooter current="right-of-reply-policy" />
      </PageBody>
    </StaticPageShell>
  );
}
