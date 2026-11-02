import Link from "next/link";
import ImagePlaceholder from "./ImagePlaceholder";

/**
 * "You might be interested in" block embedded inside an article body,
 * matching the reference detail-page video: a short green-underlined
 * heading followed by 1-2 image-left / headline-right rows.
 */
export default function RelatedPicks({ items }) {
  if (!items || items.length === 0) return null;

  return (
    <div className="my-8">
      <h2 className="border-b-2 border-brand-teal pb-2 text-sm font-bold uppercase tracking-wide text-ink">
        You might be interested in
      </h2>
      <div className="mt-4 divide-y divide-hairline">
        {items.map((item) => (
          <Link
            key={`${item.category}-${item.slug}`}
            href={`/${item.category}/${item.slug}`}
            className="flex items-center gap-4 py-4 first:pt-0 group"
          >
            <ImagePlaceholder className="h-20 w-28 shrink-0" src={item.image} position={item.imagePosition} />
            <h3 className="font-serif text-lg font-bold leading-snug text-ink group-hover:underline decoration-2 underline-offset-2">
              {item.title}
            </h3>
          </Link>
        ))}
      </div>
    </div>
  );
}
