import { Header } from "@/components/ui/header"
import { Footer } from "@/components/ui/footer"
import MobileBottomNav from '@/components/MobileBottomNav'

export default function PublicLayout({
children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      <Header />
      
      <main>
        {children}
        < MobileBottomNav />
      </main>
      
      <Footer />
    </>
  )
}
