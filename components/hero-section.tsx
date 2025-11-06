import Image from "next/image"
import { Download } from "lucide-react"
import { Button } from "@/components/ui/button"
import { supabase } from '@/lib/supabase-client'

const { data: heroImageData } = supabase.storage
    .from("uploads")
    .getPublicUrl("1757065218649-whatsapp_image_2025_09_05_at_12.16.08_pm.jpeg")

const heroImageUrl = heroImageData?.publicUrl || "/placeholder.svg"

export function HeroSection() {
  return (
    <section className="w-full">
      <div className="grid grid-cols-1 lg:grid-cols-2">
        {/* Left: Image */}
        <div className="
          relative 
          w-full h-[300px] 
          sm:h-[400px] 
          md:h-[500px] 
          lg:h-[700px] 
          flex items-center justify-center 
          bg-gray-100
        ">
          <div className="relative w-full h-[400px] sm:h-[500px] md:h-[600px] lg:h-[700px]">
            <Image
              src={heroImageUrl}
              alt="Sassy Products"
              fill
              priority
              className="object-cover sm:object-contain md:object-cover"
              sizes="100vw"
            />
          </div>
        </div>     
    
        {/* Right: Texts */}
        <div className="
          flex flex-col items-center justify-center text-center 
          px-6 py-12 
          lg:px-12 
          text-green-600
          bg-white/30
        ">
          <p className="font-semibold text-lg mb-4 tracking-wider text-inherit">
            PROUDLY KENYAN
          </p>
          <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold mb-8 leading-tight drop-shadow-lg">
            NATURAL AND <br />
            <span className="text-black">SKIN-SAFE</span> <br />
            COSMETICS
          </h1>
          <p className="text-base sm:text-lg md:text-xl mb-12 leading-relaxed max-w-2xl drop-shadow-md">
            Discover the power of nature with our locally-sourced, skin-safe cosmetics. 
            Made in Kenya with love, for beautiful, healthy skin that glows naturally.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button 
              asChild 
              size="lg" 
              variant="outline" 
              className="text-base h-auto py-3 px-8 bg-green-700 text-white hover:bg-white/20 hover:border-white transition-all duration-300 backdrop-blur-sm"
            >
              <a 
                href="https://sassyproducts.co.ke/wp-content/uploads/2025/05/WIP_Sedoso-Catalog-09092024_compressed.pdf" 
                target="_blank" 
                rel="noopener noreferrer"
              >
                <Download className="w-4 h-4 mr-2" /> Download Catalogue
              </a>
            </Button>
          </div>
        </div>
      </div>
    </section>
  )
}
