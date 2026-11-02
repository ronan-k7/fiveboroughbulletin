/**
 * Renders one schema.org JSON-LD block. Server component, no client JS.
 * "<" is escaped so article text can never close the <script> tag early.
 */
export default function JsonLd({ data }) {
  if (!data) return null;
  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(data).replace(/</g, "\\u003c") }}
    />
  );
}
