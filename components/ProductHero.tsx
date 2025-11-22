'use client'
import { useState, useEffect, useCallback, useRef } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { ChevronLeft, ChevronRight } from 'lucide-react'
import { Product } from '@/types'

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
  const [showSwipeHint, setShowSwipeHint] = useState(true)
  const sectionRef = useRef<HTMLDivElement>(null)

  const [isTouching, setIsTouching] = useState(false)
  const [isScrolling, setIsScrolling] = useState(false)
  const [hideArrowsTimeout, setHideArrowsTimeout] = useState(null)

  // Safe product access with fallback
  const product = products?.[currentIndex]

  // Memoized navigation functions
  const nextProduct = useCallback(() => {
    setCurrentIndex(i => i === (products?.length ?? 1) - 1 ? 0 : i + 1)
  }, [products?.length])

  const prevProduct = useCallback(() => {
    setCurrentIndex(i => i === 0 ? (products?.length ?? 1) - 1 : i - 1)
  }, [products?.length])

  // Reset image loaded state on product change
  useEffect(() => {
    setIsImageLoaded(false)
  }, [currentIndex])

  // Hide swipe hint after first interaction or timeout
  useEffect(() => {
    const timer = setTimeout(() => {
      setShowSwipeHint(false)
    }, 3000)

    return () => clearTimeout(timer)
  }, [])

  // Touch handlers for swipe gestures
  const handleTouchStart = (e: React.TouchEvent) => {
    setIsTouching(true)
    setTouchStart(e.targetTouches[0].clientX)
    setShowSwipeHint(false)

    if (hideArrowsTimeout) {
      clearTimeout(hideArrowsTimeout);
    }
  }

  const handleTouchMove = (e: React.TouchEvent) => {
    setTouchEnd(e.targetTouches[0].clientX)
  }

  const handleTouchEnd = () => {
    setTouchStart(null)
    setTouchEnd(null)

    const timeoutId = window.setTimeout(() => {
      setIsTouching(false)
    }, 2000)
    setHideArrowsTimeout(timeoutId)
  }

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolling(true)
      
      // Clear any existing timeout
      if (hideArrowsTimeout) {
        window.clearTimeout(hideArrowsTimeout)
      }
      
      // Set timeout to hide arrows after 2 seconds
      const timeoutId = setTimeout(() => {
        setIsScrolling(false)
      }, 2000)
      setHideArrowsTimeout(timeoutId)
    }
    
    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  // Early return for empty products
  if (!products?.length) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-100">
        <p className="text-xl text-gray-600">No products available</p>
      </div>
    )
  }

  if (!product) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-100">
        <p className="text-xl text-gray-600">Product not found</p>
      </div>
    )
  }

  return (
    <section 
      ref={sectionRef}
      className="relative min-h-screen flex items-center p-4 sm:p-8 overflow-hidden"
      onTouchStart={handleTouchStart}
      onTouchMove={handleTouchMove}
      onTouchEnd={handleTouchEnd}
    >
      {/* Background Image */}
      <div className="absolute inset-0 -z-20">
        <Image
          src={product.image || '/placeholder-image.jpg'}
          alt="background"
          fill
          priority={currentIndex === 0}
          className="object-cover blur-2xl scale-110 brightness-50"
          onLoad={() => setIsImageLoaded(true)}
        />
      </div>
      
      {/* Background Title */}
      <div className="absolute inset-0 flex items-center justify-center pointer-events-none z-10 opacity-10">
        <h1 className="text-6xl sm:text-7xl md:text-8xl lg:text-9xl xl:text-[12rem] font-extralight uppercase tracking-widest text-black text-center px-4">
          {title}
        </h1>
      </div>

      {/* Swipe Hint Animation - Mobile Only */}
      {showSwipeHint && products.length > 1 && (
        <div className="lg:hidden absolute inset-0 z-30 pointer-events-none">
          <div className="absolute left-4 top-1/2 -translate-y-1/2 animate-bounce">
            <div className="bg-black/50 rounded-full p-3 backdrop-blur-sm">
              <ChevronLeft className="w-6 h-6 text-white" />
            </div>
          </div>
          <div className="absolute right-4 top-1/2 -translate-y-1/2 animate-bounce" style={{ animationDelay: '0.5s' }}>
            <div className="bg-black/50 rounded-full p-3 backdrop-blur-sm">
              <ChevronRight className="w-6 h-6 text-white" />
            </div>
          </div>
          <div className="absolute bottom-20 left-1/2 -translate-x-1/2 bg-black/50 text-white px-4 py-2 rounded-full backdrop-blur-sm text-sm">
            Swipe to navigate
          </div>
        </div>
      )}

      <div className="container mx-auto max-w-7xl relative z-20">
        <div className="grid lg:grid-cols-2 gap-8 lg:gap-16 items-center">
          {/* Product Image */}
          <div className="flex justify-center order-1">
            <div className="relative w-full max-w-2xl aspect-square rounded-3xl overflow-hidden shadow-2xl">
              {!isImageLoaded && (
                <div className="absolute inset-0 bg-gray-800 animate-pulse rounded-3xl" />
              )}
              <Image
                src={product.image}
                alt={product.name || 'Product image'}
                fill
                sizes="(max-width: 1024px) 100vw, 50vw"
                className={`object-contain transition-all duration-1000 ${
                  isImageLoaded ? 'opacity-100' : 'opacity-0'
                }`}
                onLoad={() => setIsImageLoaded(true)}
                priority={currentIndex === 0}
              />
            </div>
          </div>

          {/* Text Content */}
          <div className="space-y-6 lg:space-y-10 text-center lg:text-left text-stone-400 drop-shadow-xl order-2">
            {/* Name */}
            <h2 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold leading-tight">
              {product.name}
            </h2>

            {/* Brand and Subcategory */}
            {(product.brand || product.subcategory) && (
              <p className="text-base sm:text-lg uppercase tracking-widest text-green-600">
                {product.brand}
                {product.brand && product.subcategory && ' — '}
                {product.subcategory}
              </p>
            )}

            {/* Description */}
            {product.description && (
              <p className="text-base sm:text-lg md:text-xl lg:text-2xl leading-relaxed text-stone-400 max-w-3xl">
                {product.description}
              </p>
            )}

            {/* CTA Button */}
            <div className="pt-4 lg:pt-8">
              <Link
                href={`/products/id/${product.id}`}
                className="inline-block bg-white text-black px-6 sm:px-8 lg:px-10 py-3 sm:py-4 lg:py-5 rounded-full text-base sm:text-lg font-semibold uppercase tracking-wider hover:bg-gray-200 transition-all shadow-2xl hover:shadow-3xl transform hover:scale-105"
              >
                View Product Details
              </Link>
            </div>
          </div>
        </div>

        {/* Desktop Navigation Arrows */}
        {products.length > 1 && (
          <div className="hidden lg:block">
            <button
              onClick={prevProduct}
              className="absolute left-4 top-1/2 -translate-y-1/2 p-4 bg-white/90 hover:bg-white rounded-full shadow-2xl hover:scale-110 transition-all z-30 backdrop-blur-sm"
              aria-label="Previous product"
            >
              <ChevronLeft className="w-8 h-8 text-black" />
            </button>
        
            <button
              onClick={nextProduct}
              className="absolute right-4 top-1/2 -translate-y-1/2 p-4 bg-white/90 hover:bg-white rounded-full shadow-2xl hover:scale-110 transition-all z-30 backdrop-blur-sm"
              aria-label="Next product"
            >
              <ChevronRight className="w-8 h-8 text-black" />
            </button>
          </div>
        )}

        {/* Mobile Indicator Dots */}
        {products.length > 1 && (isTouching || isScrolling) && (
          <div className="lg:hidden absolute top-1/2 -translate-y-1/2 w-full flex justify-between z-30 pointer-events-none">
            <button
              onClick={prevProduct}
              className="p-4 bg-black/50 rounded-full shadow-2xl hover:scale-110 transition-all pointer-events-auto ml-4"
              aria-label="Previous product"
            >
              <ChevronLeft className="w-6 h-6 text-white" />
            </button>
            <button
              onClick={nextProduct}
              className="p-4 bg-black/50 rounded-full shadow-2xl hover:scale-110 transition-all pointer-events-auto mr-4"
              aria-label="Next product"
            >
              <ChevronRight className="w-6 h-6 text-white" />
            </button>
          </div>
        )}
      </div>
    </section>
  )
}
