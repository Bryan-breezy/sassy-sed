'use client'

import { useState, useEffect, useRef } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { ChevronLeft, ChevronRight } from 'lucide-react'
import { Product } from '@/types'
import ColorThief from 'colorthief'

interface ProductHeroProps {
  products: Product[]
  title: string
  autoSwitchInterval?: number
}

export const ProductHero: React.FC<ProductHeroProps> = ({ 
  products, 
  title, 
  autoSwitchInterval = 5000
}) => {
  const [currentIndex, setCurrentIndex] = useState<number>(0)
  const [isImageLoaded, setIsImageLoaded] = useState<boolean>(false)
  // Default to a dark neutral color before extraction
  const [bgColor, setBgColor] = useState<string>("rgb(30, 30, 30)")
  
  const imgRef = useRef<HTMLImageElement>(null)
  const product = products[currentIndex]

  // Auto-switch functionality
  useEffect(() => {
    if (products.length <= 1) return;

    const interval = setInterval(() => {
      nextProduct();
    }, autoSwitchInterval);

    return () => clearInterval(interval);
  }, [products.length, autoSwitchInterval, currentIndex]);

  const nextProduct = (): void => {
    if (products.length <= 1) return

    setIsImageLoaded(false);
    setCurrentIndex((prev: number) => 
      prev === products.length - 1 ? 0 : prev + 1
    )
  }

  const prevProduct = (): void => {
    if (products.length <= 1) return

    setIsImageLoaded(false);
    setCurrentIndex((prev: number) => 
      prev === 0 ? products.length - 1 : prev - 1
    )
  }

  const goToProduct = (index: number): void => {
    if (index === currentIndex) return
    setIsImageLoaded(false)
    setCurrentIndex(index)
  }

  // Color Extraction Logic
  const handleColorExtraction = () => {
    const colorThief = new ColorThief()
    const img = imgRef.current

    if (img) {
      try {
        const result = colorThief.getColor(img)
        setBgColor(`rgb(${result[0]}, ${result[1]}, ${result[2]})`)
      } catch (error) {
        console.error("Error extracting color:", error)
      }
    }
  }

  // Error/empty state
  if (!products || products.length === 0) {
    return (
      <section className="min-h-[60vh] flex items-center justify-center bg-gray-100 p-8">
        <div className="text-center">
          <h2 className="text-2xl font-semibold text-gray-600">Error loading products</h2>
          <p className="text-gray-500 mt-2">Please refresh the page</p>
        </div>
      </section>
    )
  }

  return (
    <section 
      className="relative min-h-[80vh] flex items-center p-4 sm:p-8 overflow-hidden transition-colors duration-1000 ease-out"
      style={{ backgroundColor: bgColor }}
    >
      {/* HIDDEN Image for Color Extraction */}
      <img
        ref={imgRef}
        src={product.image}
        alt="analysis"
        className="hidden"
        crossOrigin="anonymous"
        onLoad={handleColorExtraction}
      />

      {/* Overlay: Ensures text is readable if the extracted color is too bright */}
      <div className="absolute inset-0 bg-black/20 pointer-events-none z-0" />

      {/* Background Text Overlay */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-center opacity-10 pointer-events-none z-0">
        <h1 className="text-4xl sm:text-6xl md:text-8xl lg:text-9xl font-extralight uppercase tracking-wider text-white">
          {title}
        </h1>
      </div>

      <div className="container mx-auto max-w-7xl relative z-10">
        <div className="flex flex-col lg:flex-row items-center gap-8 sm:gap-12 lg:gap-16">
          
          {/* Left: Image */}
          <div className="w-full lg:w-1/2 flex justify-center lg:justify-start order-1 lg:order-1">
            <div className="relative w-full max-w-md sm:max-w-lg md:max-w-xl h-[300px] sm:h-[400px] md:h-[500px] lg:h-[600px] xl:h-[700px] overflow-hidden">
              {!isImageLoaded && (
                <div className="absolute inset-0 bg-white/20 backdrop-blur-sm animate-pulse rounded-lg shadow-xl" />
              )}

              <Image
                src={product.image}
                alt={product.name}
                fill
                onLoad={() => setIsImageLoaded(true)}
                onError={(e) => {
                  console.error(`Failed to load image for product: ${product.name}`)
                  setIsImageLoaded(true)
                }}
                sizes="(max-width: 1024px) 100vw, 50vw"
                className={`
                  object-contain object-center 
                  rounded-lg drop-shadow-2xl transition-all duration-700 hover:scale-105
                  ${isImageLoaded ? 'opacity-100 scale-100' : 'opacity-0 scale-95'}
                `}
                priority={currentIndex === 0}
              />
            </div>
          </div>

          {/* Right: Product Info */}
          <div className={`w-full lg:w-1/2 text-center lg:text-left px-2 sm:px-4 order-2 transition-all duration-500 ${isImageLoaded ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}`}>
            <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold text-white leading-snug sm:leading-tight mb-4 drop-shadow-md">
              {product.name}
            </h2>

            {product.brand && (
              <p className="text-xs sm:text-sm uppercase text-white/80 tracking-widest mb-4">
                {product.brand}
                {product.subcategory && ` — ${product.subcategory}`}
              </p>
            )}

            {product.description && (
              <p className="text-sm sm:text-base md:text-lg text-white/90 mb-6 sm:mb-8 leading-relaxed max-w-lg lg:max-w-none mx-auto lg:mx-0 line-clamp-4">
                {product.description}
              </p>
            )}

            <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start">
              <Link
                href={`/products/id/${product.id}`}
                className="inline-block border-2 border-white text-white font-semibold uppercase tracking-wider px-6 py-3 text-sm sm:text-base rounded-full transition-all duration-300 hover:bg-white hover:text-black hover:scale-105 text-center shadow-lg"
              >
                View Product Details
              </Link>
            </div>
          </div>
        </div>

        {/* Navigation Arrows - Only show if multiple products */}
        {products.length > 1 && (
          <>
            <div className="absolute inset-y-0 left-0 flex items-center z-20">
              <button
                type="button"
                onClick={prevProduct}
                aria-label="Previous Product"
                className="p-2 sm:p-3 bg-white/10 backdrop-blur-md hover:bg-white/30 border border-white/20 shadow-md rounded-full ml-2 sm:ml-4 transition-all duration-300 hover:scale-110 group"
              >
                <ChevronLeft className="w-5 h-5 sm:w-6 sm:h-6 text-white" />
              </button>
            </div>
            <div className="absolute inset-y-0 right-0 flex items-center z-20">
              <button
                type="button"
                onClick={nextProduct}
                aria-label="Next Product"
                className="p-2 sm:p-3 bg-white/10 backdrop-blur-md hover:bg-white/30 border border-white/20 shadow-md rounded-full mr-2 sm:mr-4 transition-all duration-300 hover:scale-110 group"
              >
                <ChevronRight className="w-5 h-5 sm:w-6 sm:h-6 text-white" />
              </button>
            </div>
          </>
        )}        
      </div>
    </section>
  )
}
