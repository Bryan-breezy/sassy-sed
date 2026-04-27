// app/layout.tsx
//
// With a sticky header, the header stays in document flow so every page
// automatically starts below it. No padding-top, no CSS variables,
// no PageOffset component, no ResizeObserver — none of it needed.

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
      <body className="bg-[#F5F2ED] antialiased">
        <Header />
        <main>
          {children}
        </main>
      </body>
    </html>
  )
}
