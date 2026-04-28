export const dynamic = "force-dynamic"

//components
import { HeroSection } from '@/components/hero-section'
import LatestProductsSection from "@/components/ui/latestProductsSection"
import FeaturedProductsSection from '@/components/FeaturedProductsSection'
import WhyChooseUs from '@/components/WhyChooseUs'
import OurBrands from '@/components/OurBrands'

export default async function HomePage() {
  return (
    <div className="min-h-screen bg-white">
      <main>
        {/* HERO SECTION */}
        <HeroSection />

        {/* Latest Products */}
       <LatestProductsSection />

        {/* Featured Products */}
        <FeaturedProductsSection />    
        
        {/* Brands Section */}
        <OurBrands/>
        
        {/* Why Choose Us */}
         <WhyChooseUs />
      </main>
    </div>
  )
}
