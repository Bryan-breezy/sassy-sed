'use client'

import Image from "next/image"
import { Download, Sparkles } from "lucide-react"
import { Button } from "@/components/ui/button"
import { supabase } from '@/lib/supabase-client'

export function HeroSection() {
  const { data: heroImageData } = supabase.storage
    .from("uploads")
    .getPublicUrl("1757065218649-whatsapp_image_2025_09_05_at_12.16.08_pm.jpeg")

  const heroImageUrl = heroImageData?.publicUrl || "/placeholder.svg"

  return (
    <section className={`
      w-full bg-[#FDFCFB] overflow-hidden
      /* ROOM FOR THE HEADER */
      pt-20 lg:pt-24 
    `}>
      <div className="flex flex-col lg:flex-row min-h-[calc(100vh-80px)] lg:min-h-[calc(100vh-96px)]">
        
        <div className="relative w-full h-[60vh] lg:h-auto lg:w-1/2 flex items-center justify-center bg-[#FDFCFB] p-4 md:p-8 lg:p-12">
          
          {/* THE SQUIRCLE FRAME */}
          <div className={`
            relative w-full h-full overflow-hidden shadow-2xl
            /* DISTINCT SHAPE: Subtle squircle corners */
            rounded-[3rem] md:rounded-[4rem]
            /* Border adds sophistication */
            border-2 border-stone-100
            bg-stone-100 group
          `}>
            <Image
              src={heroImageUrl}
              alt="Sassy Products Kenya"
              fill
              priority
              className="transition-transform duration-1000 group-hover:scale-105 
                object-contain p-6
                lg:object-cover lg:p-0"
              sizes="(max-width: 1024px) 100vw, 50vw"
            />
            
            <div className="absolute top-4 left-4 z-20">
              <div className="flex items-center gap-2 bg-white/90 backdrop-blur-md px-4 py-2 rounded-full shadow-lg">
                <Sparkles className="w-3 h-3 text-emerald-600" />
                <span className="text-[10px] font-bold text-stone-800 uppercase tracking-tight">
                  Premium Quality
                </span>
              </div>
            </div>
          </div>
        </div>     
    
        {/* TEXT CONTENT SECTION (Bottom on Mobile) */}
        <div className="flex flex-col items-center justify-center text-center px-6 py-10 lg:py-0 lg:px-20 lg:w-1/2 relative">
          <div className="absolute top-0 right-0 w-64 h-64 bg-emerald-50 rounded-full blur-3xl opacity-40 -mr-32 -mt-32" />

          <div className="relative z-10 max-w-2xl">
            <p className="font-bold text-emerald-700 text-xs mb-3 tracking-[0.2em] uppercase">
              Proudly Kenyan
            </p>
            
            <h1 className="text-4xl sm:text-5xl lg:text-7xl xl:text-8xl font-serif font-medium text-stone-900 mb-6 leading-[1.1]">
              Natural and <br />
              <span className="text-emerald-800 italic">Skin-Safe</span> <br />
              Cosmetics
            </h1>
            
            <p className="text-sm sm:text-base lg:text-lg text-stone-600 mb-8 leading-relaxed font-light max-w-md mx-auto">
              Discover the power of nature with our locally-sourced cosmetics. 
              Made in Kenya with love, for a healthy glow.
            </p>

            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button 
                asChild 
                size="lg" 
                className="bg-stone-900 text-white hover:bg-emerald-900 px-8 py-6 text-base rounded-full transition-all shadow-xl"
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
            
            <div className="mt-12 flex items-center justify-center gap-6 border-t border-stone-100 pt-6">
              <StatItem value="100%" label="Natural" />
              <div className="w-px h-6 bg-stone-200" />
              <StatItem value="Local" label="Sourced" />
              <div className="w-px h-6 bg-stone-200" />
              <StatItem value="Skin" label="Safe" />
            </div>
          </div>
        </div>

      </div>
    </section>
  )
}

function StatItem({ value, label }: { value: string; label: string }) {
  return (
    <div>
      <p className="text-lg font-serif font-bold text-stone-800">{value}</p>
      <p className="text-[9px] uppercase tracking-widest text-stone-500">{label}</p>
    </div>
  )
}
