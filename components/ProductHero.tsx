'use client'

import { useState, useEffect, useCallback } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { ChevronLeft, ChevronRight, ArrowRight, Sparkles } from 'lucide-react'
import { Product } from '@/types'
import { Button } from '@/components/ui/button'

interface ProductHeroProps {
  products: Product[]
  title: string
}

export const ProductHero: React.FC<ProductHeroProps> = ({
  products,
  title,
}) => {
  const [currentIndex, setCurrentIndex] = useState(0)
  const [isImageLoaded, setIsImageLoaded] = useState(false)
  const [touchStart, setTouchStart] = useState<number | null>(null)
  const [touchEnd, setTouchEnd] = useState<number | null>(null)

  // Safe product access with fallback
  const product = products?.[currentIndex]

  // Navigation functions
  const nextProduct = useCallback(() => {
    setCurrentIndex(i => i === (products?.length ?? 1) - 1 ? 0 : i + 1)
  }, [products?.length])

  const prevProduct = useCallback(() => {
    setCurrentIndex(i => i === 0 ? (products?.length ?? 1) - 1 : i - 1)
  }, [products?.length])

  // Reset image loaded state when product changes
  useEffect(() => {
    setIsImageLoaded(false)
  }, [currentIndex])

  // Auto-advance
  useEffect(() => {
    const timer = setInterval(nextProduct, 6000)
    return () => clearInterval(timer)
  }, [nextProduct])

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
      className="relative min-h-[80vh] lg:min-h-screen flex items-center bg-[#F9F8F6] overflow-hidden"
      onTouchStart={handleTouchStart}
      onTouchMove={handleTouchMove}
      onTouchEnd={handleTouchEnd}
    >
      {/* Decorative Elements */}
      <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-emerald-50 rounded-full blur-[120px] -mr-64 -mt-64 opacity-60" />
      <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-stone-100 rounded-full blur-[120px] -ml-64 -mb-64 opacity-60" />

      {/* Large Background Text */}
      <div className="absolute inset-0 flex items-center justify-center pointer-events-none select-none overflow-hidden">
        <h1 className="text-[15vw] font-serif font-bold text-stone-200/40 uppercase tracking-tighter whitespace-nowrap transition-all duration-1000">
          {title}
        </h1>
      </div>

      <div className="container mx-auto max-w-7xl relative z-10 px-4 py-12 lg:py-24">
        <div className="grid lg:grid-cols-2 gap-12 lg:gap-24 items-center">
          
          {/* Product Image Section */}
          <div className="flex justify-center order-1 lg:order-2">
            <div className="relative w-full max-w-lg aspect-square group">
              {/* Sophisticated Glow behind product */}
              <div className="absolute inset-0 bg-emerald-200/20 rounded-full blur-3xl scale-90 group-hover:scale-110 transition-transform duration-1000" />
              
              <div className="relative w-full h-full flex items-center justify-center">
                <Image
                  src={product.image}
                  alt={product.name}
                  fill
                  sizes="(max-width: 1024px) 100vw, 50vw"
                  className={`object-contain transition-all duration-1000 ease-out drop-shadow-2xl ${
                    isImageLoaded ? 'opacity-100 scale-100 rotate-0' : 'opacity-0 scale-90 rotate-6'
                  }`}
                  onLoad={() => setIsImageLoaded(true)}
                  priority
                />
              </div>

              {/* Product Badge */}
              <div className="absolute -top-4 -right-4 bg-white shadow-xl rounded-2xl p-4 border border-stone-100 animate-bounce-slow">
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 bg-emerald-100 rounded-full flex items-center justify-center">
                    <Sparkles className="w-4 h-4 text-emerald-600" />
                  </div>
                  <div>
                    <p className="text-[10px] uppercase tracking-widest text-stone-500 font-bold">Category</p>
                    <p className="text-sm font-serif font-bold text-stone-800">{product.subcategory || 'Premium'}</p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Text Content Section */}
          <div className="space-y-8 text-center lg:text-left order-2 lg:order-1">
            <div className="space-y-4">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-50 border border-emerald-100">
                <span className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse" />
                <span className="text-xs font-bold text-emerald-700 uppercase tracking-wider">{product.brand || 'Sassy Sed'}</span>
              </div>
              
              <h2 className="text-5xl sm:text-6xl lg:text-8xl font-serif font-medium text-stone-900 leading-[1.1]">
                {product.name}
              </h2>
              
              <p className="text-lg sm:text-xl text-stone-600 max-w-xl mx-auto lg:mx-0 leading-relaxed font-light">
                {product.description || "Experience the finest natural cosmetics, locally sourced and carefully crafted for your skin's health and beauty."}
              </p>
            </div>

            <div className="flex flex-col sm:flex-row items-center gap-6 justify-center lg:justify-start">
              <Button asChild size="lg" className="rounded-full bg-stone-900 hover:bg-emerald-900 px-10 py-7 text-lg shadow-xl hover:-translate-y-1 transition-all duration-300">
                <Link href={`/products/id/${product.id}`} className="flex items-center gap-2">
                  Explore Product
                  <ArrowRight className="w-5 h-5" />
                </Link>
              </Button>
              
              <Link href="/products" className="text-stone-500 hover:text-emerald-700 font-medium transition-colors border-b border-transparent hover:border-emerald-700 pb-1">
                View Collection
              </Link>
            </div>

            {/* Navigation Controls */}
            <div className="flex items-center justify-center lg:justify-start gap-8 pt-8">
              <div className="flex items-center gap-4">
                <button 
                  onClick={prevProduct}
                  className="w-12 h-12 rounded-full border border-stone-200 flex items-center justify-center hover:bg-white hover:shadow-lg transition-all text-stone-400 hover:text-stone-900"
                >
                  <ChevronLeft className="w-6 h-6" />
                </button>
                <button 
                  onClick={nextProduct}
                  className="w-12 h-12 rounded-full border border-stone-200 flex items-center justify-center hover:bg-white hover:shadow-lg transition-all text-stone-400 hover:text-stone-900"
                >
                  <ChevronRight className="w-6 h-6" />
                </button>
              </div>
              <div className="flex gap-2">
                {products.map((_, i) => (
                  <button
                    key={i}
                    onClick={() => setCurrentIndex(i)}
                    className={`h-1.5 rounded-full transition-all duration-500 ${
                      currentIndex === i ? 'w-8 bg-emerald-600' : 'w-2 bg-stone-200'
                    }`}
                  />
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
