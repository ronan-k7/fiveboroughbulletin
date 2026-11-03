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

export const metadata = getStaticPageMetadata("terms-and-conditions");

export default function TermsPage() {
  const email = getContactEmails();

  return (
    <StaticPageShell slug="terms-and-conditions">
      <PageIntro slug="terms-and-conditions" eyebrow="Terms" title="Terms & Conditions">
        Plain-language ground rules for using the Five Borough Bulletin website. By reading or using the site you agree
        to them.
      </PageIntro>

      <PageBody>
        <PageSection number="01" label="Using the site" title="Free to read, used responsibly" first>
          <p>
            Five Borough Bulletin is free to read. You may browse it, search it and share links to its stories. You agree
            to use it only for lawful purposes and in a way that does not harm the site or other readers.
          </p>
        </PageSection>

        <PageSection number="02" label="Conduct" title="What you may not do">
          <PageList>
            <li>Use the site for anything unlawful.</li>
            <li>Try to gain unauthorized access to the site or its hosting, or probe, disrupt or overload them.</li>
            <li>Run automated tools that degrade the site. Ordinary search-engine indexing is fine.</li>
            <li>
              Send spam, hate speech, threats, harassment or unlawful material through any contact address, form or
              other interactive feature we offer.
            </li>
            <li>
              Misrepresent who you are, or suggest that Five Borough Bulletin endorses you, your business or your views.
            </li>
            <li>Remove or alter credits, attribution or legal notices on our content.</li>
          </PageList>
        </PageSection>

        <PageSection number="03" label="Our content" title="Rights in what we publish">
          <p>
            Stories, images and design are protected by copyright and other rights. How you may quote or reuse them is
            set out on the <TextLink href="/legal#copyright">Legal page</TextLink>; these terms give you no licence
            beyond that.
          </p>
        </PageSection>

        <PageSection number="04" label="Accuracy and availability" title="No guarantees">
          <p>
            We work to keep stories accurate and up to date, and we correct errors as described on the{" "}
            <TextLink href="/contact#corrections">contact page</TextLink>. We cannot guarantee that every story is
            complete, error-free or current, or that the site will always be available. Content may be changed, moved or
            removed at any time.
          </p>
        </PageSection>

        <PageSection number="05" label="Liability" title="Limits on what we are responsible for">
          <p>
            The site and its content are provided &ldquo;as is&rdquo; and &ldquo;as available&rdquo;. To the fullest
            extent permitted by law, Five Borough Bulletin is not liable for losses arising from your use of, or reliance
            on, the site or any site it links to. Nothing in these terms limits a liability that cannot lawfully be
            limited.
          </p>
        </PageSection>

        <PageSection number="06" label="Changes" title="Updates to these terms">
          <p>
            We may update these terms from time to time. The current version is always on this page with its revision
            date below, and continuing to use the site after a change means you accept the updated terms.
          </p>
        </PageSection>

        <PageSection number="07" label="Contact" title="Questions about these terms">
          <p>
            Write to <TextLink href={`mailto:${email.editorial}`}>{email.editorial}</TextLink> or see the{" "}
            <TextLink href="/contact">contact page</TextLink>.
          </p>
        </PageSection>

        <PageFooter current="terms-and-conditions" />
      </PageBody>
    </StaticPageShell>
  );
}
