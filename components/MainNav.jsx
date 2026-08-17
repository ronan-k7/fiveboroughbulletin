import Link from "next/link";
import siteConfig from "@/data/siteConfig.json";

export default function MainNav({ className = "" }) {
  return (
    <nav className={className} aria-label="Main navigation">
      <ul className="flex items-center justify-center gap-6 lg:gap-8">
        {siteConfig.mainNav.map((item) => (
          <li key={item.href}>
            <Link
              href={item.href}
              className="block py-3 text-[13px] font-semibold uppercase tracking-wide text-ink hover:text-brand-green transition-colors"
            >
              {item.label}
            </Link>
          </li>
        ))}
      </ul>
    </nav>
  );
}
