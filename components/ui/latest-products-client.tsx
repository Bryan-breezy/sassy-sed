"use client"

import { useState, useEffect, useCallback } from "react"
import Image from "next/image"
import Link from "next/link"
import { ChevronLeft, ChevronRight, ArrowRight } from "lucide-react"
import { Product } from "@/types"
import { Skeleton } from "@/components/ui/skeleton"
import { Button } from "@/components/ui/button"

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
  const [touchStart, setTouchStart] = useState<number | null>(null)
  const [touchEnd, setTouchEnd] = useState<number | null>(null)

  const product = products[currentIndex]

  // Navigation functions
  const nextProduct = useCallback(() => {
    setCurrentIndex((prev) => (prev === products.length - 1 ? 0 : prev + 1))
  }, [products.length])

  const prevProduct = useCallback(() => {
    setCurrentIndex((prev) => (prev === 0 ? products.length - 1 : prev - 1))
  }, [products.length])

  // Reset states when product changes
  useEffect(() => {
    setIsImageLoaded(false)
  }, [currentIndex])

  // Handle touch events
  const handleTouchStart = (e: React.TouchEvent) => setTouchStart(e.targetTouches[0].clientX)
  const handleTouchMove = (e: React.TouchEvent) => setTouchEnd(e.targetTouches[0].clientX)
  const handleTouchEnd = () => {
    if (!touchStart || !touchEnd) return
    const distance = touchStart - touchEnd
    if (Math.abs(distance) > 50) distance > 0 ? nextProduct() : prevProduct()
    setTouchStart(null); setTouchEnd(null)
  }

  if (!products?.length || !product) return null

  return (
    <section
      className="relative min-h-[70vh] flex items-center bg-stone-50 py-16 overflow-hidden"
      onTouchStart={handleTouchStart}
      onTouchMove={handleTouchMove}
      onTouchEnd={handleTouchEnd}
    >
      {/* Background Decorative Element */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full max-w-4xl aspect-square bg-emerald-100/30 rounded-full blur-[120px] pointer-events-none" />

      <div className="container mx-auto max-w-7xl relative z-10 px-4">
        <div className="flex flex-col lg:flex-row items-center gap-12 lg:gap-20">
          
          {/* Left: Product Image with elegant container */}
          <div className="w-full lg:w-1/2 flex justify-center">
            <div className="relative w-full max-w-md aspect-square">
              <div className="absolute inset-0 bg-white rounded-[3rem] shadow-2xl rotate-3 scale-95" />
              <div className="relative w-full h-full bg-white rounded-[3rem] shadow-xl overflow-hidden flex items-center justify-center p-8">
                {!isImageLoaded && (
                  <Skeleton className="absolute inset-0 z-10 w-full h-full" />
                )}
                <Image
                  src={product.image}
                  alt={product.name}
                  fill
                  sizes="(max-width: 1024px) 100vw, 50vw"
                  className={`object-contain transition-all duration-1000 ${
                    isImageLoaded ? "opacity-100 scale-100" : "opacity-0 scale-90"
                  }`}
                  onLoad={() => setIsImageLoaded(true)}
                  priority
                />
              </div>
            </div>
          </div>

          {/* Right: Product Info */}
          <div className="w-full lg:w-1/2 text-center lg:text-left space-y-6">
            <div className="space-y-2">
              <h3 className="text-emerald-700 font-bold tracking-[0.2em] uppercase text-sm">
                {title}
              </h3>
              <h2 className="text-4xl sm:text-5xl lg:text-6xl font-serif font-medium text-stone-900 leading-tight">
                {product.name}
              </h2>
            </div>

            <p className="text-lg text-stone-600 leading-relaxed font-light max-w-xl mx-auto lg:mx-0">
              {product.description || "Discover our latest addition to the natural skincare collection. Formulated with pure ingredients for visible results."}
            </p>

            <div className="flex flex-col sm:flex-row items-center gap-6 justify-center lg:justify-start pt-4">
              <Button asChild size="lg" className="rounded-full bg-stone-900 hover:bg-emerald-900 px-10 py-7 text-lg shadow-lg transition-all duration-300">
                <Link href={`/products/id/${product.id}`} className="flex items-center gap-2">
                  View Details
                  <ArrowRight className="w-5 h-5" />
                </Link>
              </Button>
              
              <div className="flex items-center gap-4">
                <button 
                  onClick={prevProduct}
                  className="w-12 h-12 rounded-full border border-stone-200 flex items-center justify-center hover:bg-white hover:shadow-md transition-all text-stone-400 hover:text-stone-900"
                >
                  <ChevronLeft className="w-6 h-6" />
                </button>
                <button 
                  onClick={nextProduct}
                  className="w-12 h-12 rounded-full border border-stone-200 flex items-center justify-center hover:bg-white hover:shadow-md transition-all text-stone-400 hover:text-stone-900"
                >
                  <ChevronRight className="w-6 h-6" />
                </button>
              </div>
            </div>

            {/* Pagination Indicators */}
            <div className="flex justify-center lg:justify-start gap-2 pt-4">
              {products.map((_, i) => (
                <button
                  key={i}
                  onClick={() => setCurrentIndex(i)}
                  className={`h-1 rounded-full transition-all duration-500 ${
                    currentIndex === i ? 'w-8 bg-emerald-600' : 'w-2 bg-stone-200'
                  }`}
                />
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
