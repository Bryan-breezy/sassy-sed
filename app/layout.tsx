import type { Metadata } from "next"
import { Header } from "@/components/ui/header"
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
              (function() {
                function sync() {
                  var el = document.getElementById('site-header');
                  if (el) document.documentElement.style.setProperty('--header-h', el.offsetHeight + 'px');
                }
                document.addEventListener('DOMContentLoaded', function() {
                  sync();
                  var el = document.getElementById('site-header');
                  if (el) new ResizeObserver(sync).observe(el);
                });
              })();
            `,
          }}
        />
        <style dangerouslySetInnerHTML={{
          __html: `
            /* Fallback: h-10 (40px) + py-2.5 top & bottom (20px) = 60px */
            :root { --header-h: 60px; }
          `
        }} />
      </head>
      <body className="bg-[#F5F2ED] antialiased">
        <Header />
        <main>
          {children}
        </main>
      </body>
    </html>
  )
}
