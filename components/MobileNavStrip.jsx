"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import siteConfig from "@/data/siteConfig.json";

/**
 * Horizontally scrollable nav row shown under the mobile header logo,
 * matching the mobile reference screenshot (Spain / Economy / International...).
 */
export default function MobileNavStrip() {
  const pathname = usePathname();

  return (
    <div className="no-scrollbar overflow-x-auto border-t border-hairline md:hidden">
      <ul className="flex w-max min-w-full items-center gap-5 whitespace-nowrap px-4 py-2.5">
        {siteConfig.mainNav.map((item) => {
          const isActive = pathname === item.href || pathname?.startsWith(`${item.href}/`);
          return (
            <li key={item.href}>
              <Link
                href={item.href}
                aria-current={isActive ? "page" : undefined}
                className={`block border-b-2 pb-0.5 text-[12.5px] font-semibold uppercase tracking-wide transition-colors ${
                  isActive
                    ? "border-header-cyan text-header-cyan"
                    : "border-transparent text-ink hover:text-header-cyan"
                }`}
              >
                {item.label}
              </Link>
            </li>
          );
        })}
      </ul>
    </div>
  );
}
