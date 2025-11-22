'use client'

import { useState, useRef, useCallback } from "react"
import Image from "next/image"
import { Download } from "lucide-react"
import { Button } from "@/components/ui/button"
import { supabase } from '@/lib/supabase-client'
import ColorThief from "colorthief"

const { data: heroImageData } = supabase.storage
    .from("uploads")
    .getPublicUrl("1757065218649-whatsapp_image_2025_09_05_at_12.16.08_pm.jpeg")

const heroImageUrl = heroImageData?.publicUrl || "/placeholder.svg"

interface RGBColor {
  r: number
  g: number
  b: number
}

export function HeroSection() {
  const [dominantColor, setDominantColor] = useState<RGBColor>({ r: 255, g: 255, b: 255 })
  const [isColorLoaded, setIsColorLoaded] = useState(false)
  const colorThiefRef = useRef(new ColorThief())

  // Extract dominant color from hero image
  const extractDominantColor = useCallback((img: HTMLImageElement) => {
    try {
      const color = colorThiefRef.current.getColor(img) as [number, number, number]
      setDominantColor({
        r: color[0],
        g: color[1],
        b: color[2]
      })
      setIsColorLoaded(true)
    } catch (error) {
      console.warn('Failed to extract color, using fallback:', error)
      setDominantColor({ r: 255, g: 255, b: 255 }) // Fallback to white
      setIsColorLoaded(true)
    }
  }, [])

  // Handle image load for color extraction
  const handleImageLoad = useCallback((e: React.SyntheticEvent<HTMLImageElement>) => {
    const img = e.target as HTMLImageElement
    if (img.complete) {
      extractDominantColor(img)
    }
  }, [extractDominantColor])

  // Calculate text color based on background brightness
  const getTextColor = useCallback((rgb: RGBColor) => {
    const brightness = (rgb.r * 299 + rgb.g * 587 + rgb.b * 114) / 1000
    return brightness > 128 ? 'text-black' : 'text-white'
  }, [])

  const textColorClass = getTextColor(dominantColor)

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
              onLoad={handleImageLoad}
              crossOrigin="anonymous"
            />
          </div>
        </div>     
    
        {/* Right: Texts with dynamic background */}
        <div 
          className="
            flex flex-col items-center justify-center text-center 
            px-6 py-12 
            lg:px-12 
            transition-all duration-1000
          "
          style={{
            backgroundColor: isColorLoaded 
              ? `rgb(${dominantColor.r}, ${dominantColor.g}, ${dominantColor.b})`
              : '#ffffff'
          }}
        >
          <p className={`font-semibold text-lg mb-4 tracking-wider transition-all duration-1000 ${textColorClass}`}>
            PROUDLY KENYAN
          </p>
          <h1 className={`text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold mb-8 leading-tight drop-shadow-lg transition-all duration-1000 ${textColorClass}`}>
            NATURAL AND <br />
            <span className={textColorClass === 'text-black' ? 'text-gray-800' : 'text-gray-200'}>SKIN-SAFE</span> <br />
            COSMETICS
          </h1>
          <p className={`text-base sm:text-lg md:text-xl mb-12 leading-relaxed max-w-2xl drop-shadow-md transition-all duration-1000 ${textColorClass}`}>
            Discover the power of nature with our locally-sourced, skin-safe cosmetics. 
            Made in Kenya with love, for beautiful, healthy skin that glows naturally.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button 
              asChild 
              size="lg" 
              variant="outline" 
              className={`text-base h-auto py-3 px-8 transition-all duration-300 backdrop-blur-sm ${
                textColorClass === 'text-black' 
                  ? 'bg-black text-white hover:bg-gray-800 border-black' 
                  : 'bg-white text-black hover:bg-gray-200 border-white'
              }`}
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
