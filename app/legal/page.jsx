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

export const metadata = getStaticPageMetadata("legal");

export default function LegalPage() {
  const email = getContactEmails();

  return (
    <StaticPageShell slug="legal">
      <PageIntro slug="legal" eyebrow="Legal" title="Legal information">
        The practical legal notes for reading, quoting and raising a concern about Five Borough Bulletin.
      </PageIntro>

      <PageBody>
        <PageSection number="01" label="Informational use" title="Information, not advice" first>
          <p>
            Everything published on Five Borough Bulletin is general news, information and commentary. Nothing here is
            legal, financial, investment, tax or medical advice, and no story is a recommendation to buy, sell or do
            anything in particular.
          </p>
          <p>
            Stories reflect what was known on the date shown. Circumstances change, so check a story&apos;s date and the
            documents it links to before relying on it for a decision that matters to you.
          </p>
        </PageSection>

        <PageSection id="copyright" number="02" label="Copyright" title="Quoting and reuse">
          <p>
            Unless a credit says otherwise, the text, layout and original material on this site belong to Five Borough
            Bulletin. Third-party photographs, logos and quoted material remain the property of their owners and carry
            the credit shown beside them.
          </p>
          <PageList>
            <li>You may quote short excerpts with clear attribution and a link back to the original story.</li>
            <li>Republishing a full story, a substantial part of one, or any image needs written permission.</li>
            <li>
              For permission or syndication, write to <TextLink href={`mailto:${email.legal}`}>{email.legal}</TextLink>.
            </li>
          </PageList>
        </PageSection>

        <PageSection id="complaints" number="03" label="Complaints" title="Raising a concern about a story">
          <p>
            If you are named in a story, or believe a story is inaccurate, unfair, infringes your rights or intrudes on
            your privacy, please tell us. Write to <TextLink href={`mailto:${email.legal}`}>{email.legal}</TextLink>, or
            to <TextLink href={`mailto:${email.corrections}`}>{email.corrections}</TextLink> for a plain factual error,
            and include:
          </p>
          <PageList>
            <li>The address of the story and the specific passage you are concerned about.</li>
            <li>Why you believe it is wrong, unfair or unlawful, and how you are connected to the matter.</li>
            <li>Any documents or links that support your account.</li>
          </PageList>
          <p>
            We will review the complaint and tell you what we decided. Where it leads to a change, the story is updated
            and, for a material error, corrected in the story itself. If you simply want to respond to a story, see{" "}
            <TextLink href="/right-of-reply-policy">Right of Reply</TextLink>.
          </p>
        </PageSection>

        <PageSection id="third-party-links" number="04" label="Third-party links" title="Links to other sites">
          <p>
            Stories link to filings, documents and other websites for context. Those sites have their own owners, terms
            and privacy practices. A link is not an endorsement, and we are not responsible for another site&apos;s
            content or for changes made after we linked to it.
          </p>
        </PageSection>

        <PageSection number="05" label="Formal notices" title="Legal notices and demands">
          <p>
            Send legal notices, copyright takedown requests and formal demands to{" "}
            <TextLink href={`mailto:${email.legal}`}>{email.legal}</TextLink>. Please give your full name and contact
            details, the exact address of each page concerned and the legal basis for your request.
          </p>
          <p>
            Email is not a guarantee of formal service. If a different address is required for legal process, tell us
            and we will let you know where to send it.
          </p>
        </PageSection>

        <PageFooter current="legal" />
      </PageBody>
    </StaticPageShell>
  );
}
