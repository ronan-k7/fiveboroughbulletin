import Header from "./Header";
import Footer from "./Footer";

/**
 * Shared site chrome (header + footer) used by the app/ root layout so
 * every route gets the same header/footer without repeating markup.
 */
export default function SiteChrome({ children }) {
  return (
    <>
      <Header />
      <main className="flex flex-1 flex-col">{children}</main>
      <Footer />
    </>
  );
}
