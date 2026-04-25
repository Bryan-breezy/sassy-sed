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
    <section className="w-full bg-[#FDFCFB] overflow-hidden">
      {/* flex-col: Image Top, Text Bottom (Mobile)
          lg:flex-row: Side-by-side (Desktop)
      */}
      <div className="flex flex-col lg:flex-row min-h-screen">
        
        {/*  IMAGE SECTION (Appears first on mobile) */}
        <div className="relative w-full h-[50vh] lg:h-auto lg:w-1/2 bg-stone-100 overflow-hidden group">
          <Image
            src={heroImageUrl}
            alt="Sassy Products Kenya"
            fill
            priority
            className="transition-transform duration-1000 group-hover:scale-105 
              /* object-contain ensures the full image is visible on mobile */
              object-contain p-6 
              /* object-cover makes it look premium and full-bleed on desktop */
              lg:object-cover lg:p-0"
            sizes="(max-width: 1024px) 100vw, 50vw"
          />
          
          {/* Decorative Badge */}
          <div className="absolute bottom-4 left-4 z-20">
            <div className="flex items-center gap-2 bg-white/90 backdrop-blur-md px-4 py-2 rounded-full shadow-lg">
              <Sparkles className="w-3 h-3 text-emerald-600" />
              <span className="text-[10px] md:text-xs font-bold text-stone-800 uppercase tracking-tight">
                Premium Quality
              </span>
            </div>
          </div>
        </div>     
    
        {/*  TEXT CONTENT SECTION (Appears second on mobile) */}
        <div className="flex flex-col items-center justify-center text-center px-6 py-12 lg:py-0 lg:px-20 lg:w-1/2 relative">
          {/* Background decoration */}
          <div className="absolute top-0 right-0 w-64 h-64 bg-emerald-50 rounded-full blur-3xl opacity-40 -mr-32 -mt-32" />

          <div className="relative z-10 max-w-2xl">
            <p className="font-bold text-emerald-700 text-xs mb-4 tracking-[0.2em] uppercase">
              Proudly Kenyan
            </p>
            
            <h1 className="text-4xl sm:text-6xl lg:text-7xl xl:text-8xl font-serif font-medium text-stone-900 mb-6 leading-[1.1]">
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
                className="bg-stone-900 text-white hover:bg-emerald-900 px-8 py-6 text-base rounded-full transition-all shadow-lg"
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
            
            {/* Stats bar */}
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
