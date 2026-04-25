import type { Metadata } from "next"
import { Header } from "@/components/header"
import "./globals.css"

export const metadata: Metadata = {
  title: "Sassy Products Kenya",
  description: "Natural and Skin-Safe Cosmetics. Proudly Kenyan.",
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <head>
        <script
          dangerouslySetInnerHTML={{
            __html: `
              (function () {
                function setHeaderHeight() {
                  var h = document.getElementById('site-header');
                  if (h) {
                    document.documentElement.style.setProperty('--header-h', h.offsetHeight + 'px');
                  }
                }
                // Run once immediately (header may not exist yet on first paint,
                // so we also run after DOMContentLoaded and on resize).
                document.addEventListener('DOMContentLoaded', function () {
                  setHeaderHeight();
                  var ro = new ResizeObserver(setHeaderHeight);
                  var h = document.getElementById('site-header');
                  if (h) ro.observe(h);
                });
              })();
            `,
          }}
        />
        <style dangerouslySetInnerHTML={{
          __html: `
            :root { --header-h: 80px; }   /* safe fallback — matches unscrolled height */

            /*
              All direct children of <main> start below the header automatically.
              No per-page padding needed.
            */
            main {
              padding-top: var(--header-h);
            }

            /*
              OPT-OUT: Any section that should sit BEHIND the header
              (e.g. a full-bleed hero with a transparent nav) adds this class.
              It pulls itself back up by the header height using a negative margin.
            */
            main > .behind-header {
              margin-top: calc(-1 * var(--header-h));
            }
          `
        }} />
      </head>
      <body className="bg-[#F5F2ED] antialiased">
        {/* id="site-header" is what the ResizeObserver targets */}
        <Header />
        <main>
          {children}
        </main>
      </body>
    </html>
  )
}
