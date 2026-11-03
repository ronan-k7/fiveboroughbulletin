import {
  StaticPageShell,
  PageIntro,
  PageBody,
  PageSection,
  PageList,
  PageFooter,
  InfoCard,
  TextLink,
} from "@/components/StaticPage";
import { getContactEmails, getStaticPageMetadata } from "@/lib/staticPages";

export const metadata = getStaticPageMetadata("contact");

export default function ContactPage() {
  const email = getContactEmails();

  const channels = [
    {
      id: "editorial",
      title: "Editorial and general",
      text: "Story tips, questions about a story, press materials and general feedback.",
      address: email.editorial,
    },
    {
      id: "corrections",
      title: "Corrections",
      text: "Think a story contains a mistake? Send the story address, the statement you believe is wrong and, if you can, a source for the correct information. Material factual errors are corrected in the story itself.",
      address: email.corrections,
    },
    {
      id: "legal",
      title: "Legal, permissions and privacy",
      text: "Reuse and republication requests, complaints about a story, formal notices and privacy requests.",
      address: email.legal,
      href: "/legal",
      hrefLabel: "Legal information",
    },
  ];

  return (
    <StaticPageShell slug="contact">
      <PageIntro slug="contact" eyebrow="Five Borough Bulletin" title="Get in touch">
        A story tip, a question about a story, a permission request or a legal matter: choose the address that fits and
        your message will reach the right person.
      </PageIntro>

      <PageBody>
        <div className="mt-12 grid gap-4 md:grid-cols-3">
          {channels.map((channel) => (
            <div key={channel.id} id={channel.id} className="scroll-mt-24">
              <InfoCard title={channel.title}>
                <p className="mt-2 text-sm leading-6 text-ink-soft">{channel.text}</p>
                <a
                  href={`mailto:${channel.address}`}
                  className="mt-4 break-all text-sm font-extrabold text-brand-teal hover:underline"
                >
                  {channel.address}
                </a>
                {channel.href && (
                  <p className="mt-2 text-sm">
                    <TextLink href={channel.href}>{channel.hrefLabel}</TextLink>
                  </p>
                )}
              </InfoCard>
            </div>
          ))}
        </div>

        <PageSection number="01" label="Writing in" title="Help us help you" first>
          <p>A short, specific message gets the fastest and most useful response. Where it applies, please include:</p>
          <PageList>
            <li>The address of the story you are writing about.</li>
            <li>
              What you would like to happen: a correction, a response added, a change or removal, or permission to
              republish.
            </li>
            <li>Any documents or links that support what you are telling us.</li>
            <li>How we can reach you if we need to ask a follow-up question.</li>
          </PageList>
        </PageSection>

        <PageSection number="02" label="Sensitive material" title="A note on safety">
          <p>
            Ordinary email is not a secure channel. Please do not send anything that could put you or someone else at
            risk if it were read by a third party.
          </p>
        </PageSection>

        <PageSection number="03" label="What to expect" title="Replies and advice">
          <p>
            We read the messages sent to these addresses, but we cannot promise a personal reply to every one, and we do
            not give legal, financial or medical advice by email. How we handle the details you send is described in
            the <TextLink href="/privacy-policy">Privacy Policy</TextLink>.
          </p>
        </PageSection>

        <PageFooter current="contact" />
      </PageBody>
    </StaticPageShell>
  );
}
