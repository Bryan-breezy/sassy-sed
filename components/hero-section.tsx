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
    <section className="w-full overflow-hidden">
      <div className="grid grid-cols-1 lg:grid-cols-2 min-h-[600px] lg:min-h-[800px]">
        {/* Left: Image Section with sophisticated overlay */}
        <div className="relative w-full h-[400px] lg:h-auto bg-stone-100 overflow-hidden group">
          <Image
            src={heroImageUrl}
            alt="Sassy Products"
            fill
            priority
            className="object-cover transition-transform duration-1000 group-hover:scale-105"
            sizes="(max-width: 1024px) 100vw, 50vw"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-stone-900/20 to-transparent" />
          <div className="absolute bottom-8 left-8">
            <div className="flex items-center gap-2 bg-white/90 backdrop-blur-md px-4 py-2 rounded-full shadow-lg">
              <Sparkles className="w-4 h-4 text-emerald-600" />
              <span className="text-sm font-medium text-stone-800">Premium Quality</span>
            </div>
          </div>
        </div>     
    
        {/* Right: Text Content with refined typography and colors */}
        <div className="flex flex-col items-center justify-center text-center px-6 py-16 lg:px-20 bg-[#FDFCFB] relative">
          {/* Subtle background decorative element */}
          <div className="absolute top-0 right-0 w-64 h-64 bg-emerald-50 rounded-full blur-3xl opacity-50 -mr-32 -mt-32" />
          <div className="absolute bottom-0 left-0 w-64 h-64 bg-amber-50 rounded-full blur-3xl opacity-50 -ml-32 -mb-32" />

          <div className="relative z-10 max-w-2xl">
            <p className="font-bold text-emerald-700 text-sm mb-6 tracking-[0.2em] uppercase">
              Proudly Kenyan
            </p>
            
            <h1 className="text-5xl sm:text-6xl lg:text-8xl font-serif font-medium text-stone-900 mb-8 leading-[1.1]">
              Natural and <br />
              <span className="text-emerald-800 italic">Skin-Safe</span> <br />
              Cosmetics
            </h1>
            
            <p className="text-lg sm:text-xl text-stone-600 mb-12 leading-relaxed font-light">
              Discover the power of nature with our locally-sourced, skin-safe cosmetics. 
              Made in Kenya with love, for beautiful, healthy skin that glows naturally.
            </p>

            <div className="flex flex-col sm:flex-row gap-6 justify-center">
              <Button 
                asChild 
                size="lg" 
                className="bg-stone-900 text-white hover:bg-emerald-900 px-10 py-7 text-lg rounded-full transition-all duration-300 shadow-xl hover:shadow-emerald-900/20 hover:-translate-y-1"
              >
                <a 
                  href="https://sassyproducts.co.ke/wp-content/uploads/2025/05/WIP_Sedoso-Catalog-09092024_compressed.pdf" 
                  target="_blank" 
                  rel="noopener noreferrer"
                >
                  <Download className="w-5 h-5 mr-3" /> Download Catalogue
                </a>
              </Button>
            </div>
            
            <div className="mt-16 flex items-center justify-center gap-8 border-t border-stone-100 pt-8">
              <div className="text-center">
                <p className="text-2xl font-serif font-bold text-stone-800">100%</p>
                <p className="text-xs uppercase tracking-widest text-stone-500">Natural</p>
              </div>
              <div className="w-px h-8 bg-stone-200" />
              <div className="text-center">
                <p className="text-2xl font-serif font-bold text-stone-800">Local</p>
                <p className="text-xs uppercase tracking-widest text-stone-500">Sourced</p>
              </div>
              <div className="w-px h-8 bg-stone-200" />
              <div className="text-center">
                <p className="text-2xl font-serif font-bold text-stone-800">Skin</p>
                <p className="text-xs uppercase tracking-widest text-stone-500">Friendly</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
