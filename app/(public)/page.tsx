export const dynamic = "force-dynamic"

//components
import { HeroSection } from '@/components/hero-section'
import LatestProductsSection from "@/components/ui/latestProductsSection"
import FeaturedProducts from '@/components/FeaturedProductsSection'
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
        <FeaturedProducts />       

        {/* Why Choose Us */}
         <WhyChooseUs />

        {/* Brands Section */}
        <OurBrands/>
      </main>
    </div>
  )
}
