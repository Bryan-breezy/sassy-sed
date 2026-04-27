import type { Metadata } from "next"
import { Header } from "@/components/ui/header"
import { Footer } from "@/components/ui/footer"
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
        <Footer />
      </body>
    </html>
  )
}
