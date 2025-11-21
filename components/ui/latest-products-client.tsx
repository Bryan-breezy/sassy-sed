"use client"

import { useState, useEffect, useRef } from "react"
import Image from "next/image"
import Link from "next/link"
import { ChevronLeft, ChevronRight } from "lucide-react"
import { Product } from "@/types"

import ColorThief from "colorthief"

interface LatestProductsClientProps {
  products: (Product & { imageUrl: string })[]
  title?: string
}

export function LatestProductsClient({
  products,
  title = "Latest Products",
}: LatestProductsClientProps) {
  const [currentIndex, setCurrentIndex] = useState(0)
  const [isImageLoaded, setIsImageLoaded] = useState(false)
  // Default color while loading (dark gray)
  const [bgColor, setBgColor] = useState("rgb(30, 30, 30)")
  
  // Ref for the hidden image used for color extraction
  const colorImgRef = useRef<HTMLImageElement>(null)

  const product = products[currentIndex]

  // Reset loading states when product changes
  useEffect(() => {
    setIsImageLoaded(false)
  }, [currentIndex])

  const prevProduct = () => {
    setCurrentIndex((prev) => (prev === 0 ? products.length - 1 : prev - 1))
  }

  const nextProduct = () => {
    setCurrentIndex((prev) => (prev === products.length - 1 ? 0 : prev + 1))
  }

  const goToProduct = (index: number) => {
    setCurrentIndex(index)
  }

  // This function runs when the HIDDEN image loads
  const handleColorExtraction = () => {
    const colorThief = new ColorThief()
    const img = colorImgRef.current

    if (img) {
      try {
        // extract palette
        const result = colorThief.getColor(img)
        // Set color state
        setBgColor(`rgb(${result[0]}, ${result[1]}, ${result[2]})`)
      } catch (error) {
        console.error("Could not extract color", error)
        // Fallback if extraction fails (e.g. CORS issue)
        setBgColor("rgb(30, 30, 30)") 
      }
    }
  }

  return (
    <section
      className="relative min-h-[80vh] flex items-center p-4 sm:p-8 overflow-hidden transition-colors duration-1000 ease-out"
      style={{
        backgroundColor: bgColor, 
      }}
    >
      <img 
        ref={colorImgRef}
        src={product.image}
        alt="analysis"
        className="hidden"
        crossOrigin="anonymous"
        onLoad={handleColorExtraction}
      />
      <div className="absolute inset-0 bg-black/30 pointer-events-none z-10" />

      {/* Huge background title */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-center opacity-10 pointer-events-none z-0">
        <h1 className="text-6xl sm:text-8xl md:text-9xl lg:text-[12rem] font-extralight uppercase tracking-wider text-white">
          {title}
        </h1>
      </div>

      <div className="container mx-auto max-w-7xl relative z-20">
        <div className="flex flex-col lg:flex-row items-center gap-12 lg:gap-20">
          {/* Left: Product Image */}
          <div className="w-full lg:w-1/2 flex justify-center">
            <div className="relative w-full max-w-lg h-[400px] sm:h-[500px] lg:h-[650px] overflow-hidden rounded-2xl shadow-2xl">
              {/* Skeleton while loading */}
              {!isImageLoaded && (
                <div className="absolute inset-0 bg-white/30 backdrop-blur-sm animate-pulse rounded-2xl" />
              )}

              <Image
                src={product.image}
                alt={product.name}
                fill
                sizes="(max-width: 1024px) 100vw, 50vw"
                className={`object-contain object-center transition-all duration-700 ${
                  isImageLoaded
                    ? "opacity-100 scale-100"
                    : "opacity-0 scale-95"
                } hover:scale-105`}
                priority={currentIndex === 0}
                onLoad={() => setIsImageLoaded(true)}
              />
            </div>
          </div>

          {/* Right: Product Info */}
          <div
            className={`w-full lg:w-1/2 text-center lg:text-left transition-all duration-700 ${
              isImageLoaded ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"
            }`}
          >
            <h2 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-white drop-shadow-2xl mb-4">
              {product.name}
            </h2>

            {product.brand && (
              <p className="text-lg uppercase tracking-widest text-white/80 mb-6">
                {product.brand}
                {product.subcategory && ` — ${product.subcategory}`}
              </p>
            )}

            {product.description && (
              <p className="text-lg lg:text-xl text-white/90 mb-10 leading-relaxed max-w-2xl mx-auto lg:mx-0">
                {product.description}
              </p>
            )}

            <div className="flex flex-col sm:flex-row gap-6 justify-center lg:justify-start">
              <Link
                href={`/products/id/${product.id}`}
                className="inline-block bg-white/20 backdrop-blur-md border-2 border-white/50 text-white font-semibold uppercase tracking-wider px-8 py-4 rounded-full hover:bg-white hover:text-black transition-all duration-300 shadow-xl"
              >
                View Product Details
              </Link>
            </div>
          </div>
        </div>

        {/* Navigation Arrows */}
        {products.length > 1 && (
          <>
            <button
              onClick={prevProduct}
              aria-label="Previous product"
              className="absolute left-4 sm:left-8 top-1/2 -translate-y-1/2 p-4 bg-white/20 backdrop-blur-md rounded-full hover:bg-white/40 transition-all z-30"
            >
              <ChevronLeft className="w-8 h-8 text-white" />
            </button>
            <button
              onClick={nextProduct}
              aria-label="Next product"
              className="absolute right-4 sm:right-8 top-1/2 -translate-y-1/2 p-4 bg-white/20 backdrop-blur-md rounded-full hover:bg-white/40 transition-all z-30"
            >
              <ChevronRight className="w-8 h-8 text-white" />
            </button>
          </>
        )}

        {/* Mobile Dots */}
        {products.length > 1 && (
          <div className="flex justify-center gap-3 mt-12 lg:hidden">
            {products.map((_, i) => (
              <button
                key={i}
                onClick={() => goToProduct(i)}
                className={`w-3 h-3 rounded-full transition-all ${
                  i === currentIndex
                    ? "bg-white w-10"
                    : "bg-white/50"
                }`}
              />
            ))}
          </div>
        )}
      </div>
    </section>
  )
}
