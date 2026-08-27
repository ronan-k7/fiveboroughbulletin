"use client";

import { useEffect } from "react";
import Link from "next/link";
import siteConfig from "@/data/siteConfig.json";
import SocialIcons from "./SocialIcons";

/**
 * Off-canvas navigation drawer, opened from the hamburger button.
 * Renders at all breakpoints (desktop included) — the hamburger is the
 * only way to reach the full nav list on desktop since the top nav row
 * only shows top-level items.
 */
export default function MobileNavDrawer({ open, onClose }) {
  // Lock body scroll while the drawer is open
  useEffect(() => {
    if (open) {
      const prev = document.body.style.overflow;
      document.body.style.overflow = "hidden";
      return () => {
        document.body.style.overflow = prev;
      };
    }
  }, [open]);

  // Close on Escape
  useEffect(() => {
    if (!open) return;
    const onKey = (e) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open, onClose]);

  return (
    <>
      {/* Backdrop */}
      <div
        className={`fixed inset-0 z-40 bg-black/40 transition-opacity duration-300 ${
          open ? "opacity-100 pointer-events-auto" : "opacity-0 pointer-events-none"
        }`}
        onClick={onClose}
        aria-hidden="true"
      />

      {/* Drawer panel */}
      <div
        className={`fixed inset-y-0 left-0 z-50 w-[84%] max-w-sm transform bg-white shadow-2xl transition-transform duration-300 ease-out ${
          open ? "translate-x-0" : "-translate-x-full"
        }`}
        role="dialog"
        aria-modal="true"
        aria-label="Site navigation"
      >
        <div className="flex h-full flex-col overflow-y-auto">
          <div className="flex items-center justify-between border-b border-hairline px-5 py-4">
            <span className="font-serif text-2xl font-black text-ink">
              {siteConfig.siteName}
            </span>
            <button
              type="button"
              onClick={onClose}
              aria-label="Close menu"
              className="flex h-9 w-9 items-center justify-center rounded-full text-ink hover:bg-neutral-100 transition-colors"
            >
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M6 6l12 12M18 6L6 18" strokeLinecap="round" />
              </svg>
            </button>
          </div>

          <nav className="flex-1 px-2 py-3" aria-label="Site navigation">
            <ul>
              {siteConfig.mainNav.map((item, idx) => (
                <li key={item.href}>
                  <Link
                    href={item.href}
                    onClick={onClose}
                    className="flex items-center justify-between px-4 py-3.5 text-[15px] font-semibold uppercase tracking-wide text-ink hover:bg-neutral-50 hover:text-brand-teal transition-colors"
                  >
                    {item.label}
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="opacity-40">
                      <path d="M9 6l6 6-6 6" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                  </Link>
                  {idx < siteConfig.mainNav.length - 1 && (
                    <div className="mx-4 border-b border-hairline" />
                  )}
                </li>
              ))}
            </ul>
          </nav>

          <div className="border-t border-hairline px-5 py-5">
            <Link
              href="/subscribe"
              onClick={onClose}
              className="block w-full rounded border border-ink py-2.5 text-center text-sm font-semibold uppercase tracking-wide text-ink hover:bg-ink hover:text-white transition-colors"
            >
              Subscribe
            </Link>
            <SocialIcons links={siteConfig.footer.socialLinks} className="mt-5 justify-center" />
          </div>
        </div>
      </div>
    </>
  );
}
