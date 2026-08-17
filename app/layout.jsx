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

export const metadata = {
  title: "vozpópuli",
  description: "El valor de ser libres y fiables",
  icons: {
    icon: "/favicon.ico",
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
