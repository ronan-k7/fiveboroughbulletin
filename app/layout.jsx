// Self-hosted fonts (bundled via @fontsource, no external network calls at build/runtime)
import "@fontsource/inter/400.css";
import "@fontsource/inter/500.css";
import "@fontsource/inter/600.css";
import "@fontsource/inter/700.css";
import "@fontsource/inter/800.css";
import "@fontsource/bitter/400.css";
import "@fontsource/bitter/500.css";
import "@fontsource/bitter/600.css";
import "@fontsource/bitter/700.css";
import "@fontsource/bitter/800.css";
import "@fontsource/bitter/900.css";
import "@fontsource/bitter/400-italic.css";
import "@fontsource/bitter/500-italic.css";
import "@fontsource/bitter/600-italic.css";
import "@fontsource/bitter/700-italic.css";

import "./globals.css";
import SiteChrome from "@/components/SiteChrome";
import siteConfig from "@/data/siteConfig.json";

const SITE_URL = siteConfig.url || "https://www.vozpopuli.com";

export const metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default: "vozpópuli",
    template: "%s - vozpópuli",
  },
  description:
    "vozpópuli — U.S., Business, Finance and World news, plus Legal, Culture, Welfare and lifestyle coverage. El valor de ser libres y fiables.",
  keywords: [
    "vozpópuli",
    "U.S. news",
    "business news",
    "finance news",
    "world news",
    "breaking news",
  ],
  applicationName: "vozpópuli",
  authors: [{ name: "vozpópuli" }],
  icons: {
    icon: "/favicon.ico",
  },
  openGraph: {
    type: "website",
    siteName: "vozpópuli",
    title: "vozpópuli",
    description:
      "U.S., Business, Finance and World news, plus Legal, Culture, Welfare and lifestyle coverage.",
    url: SITE_URL,
    locale: "en_US",
  },
  twitter: {
    card: "summary_large_image",
    title: "vozpópuli",
    description:
      "U.S., Business, Finance and World news, plus Legal, Culture, Welfare and lifestyle coverage.",
  },
  robots: {
    index: true,
    follow: true,
  },
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className="antialiased bg-white text-neutral-900">
        <SiteChrome>{children}</SiteChrome>
      </body>
    </html>
  );
}
