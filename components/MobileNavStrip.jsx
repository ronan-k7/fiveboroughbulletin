import Link from "next/link";
import siteConfig from "@/data/siteConfig.json";

/**
 * Horizontally scrollable nav row shown under the mobile header logo,
 * matching the mobile reference screenshot (Spain / Economy / International...).
 */
export default function MobileNavStrip() {
  return (
    <div className="no-scrollbar overflow-x-auto border-t border-hairline md:hidden">
      <ul className="flex items-center gap-5 whitespace-nowrap px-4 py-2.5">
        {siteConfig.mainNav.map((item) => (
          <li key={item.href}>
            <Link
              href={item.href}
              className="text-[12.5px] font-semibold uppercase tracking-wide text-ink hover:text-brand-green transition-colors"
            >
              {item.label}
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}
