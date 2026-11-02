"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import siteConfig from "@/data/siteConfig.json";

export default function MainNav({ className = "" }) {
  const pathname = usePathname();

  return (
    <nav className={className} aria-label="Main navigation">
      <ul className="no-scrollbar flex items-center justify-center gap-4 overflow-x-auto md:gap-5 lg:gap-8">
        {siteConfig.mainNav.map((item) => {
          const isActive = pathname === item.href || pathname?.startsWith(`${item.href}/`);
          return (
            <li key={item.href}>
              <Link
                href={item.href}
                aria-current={isActive ? "page" : undefined}
                className={`block border-b-[3px] py-3 text-[13px] font-semibold uppercase tracking-wide transition-colors ${
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
    </nav>
  );
}
