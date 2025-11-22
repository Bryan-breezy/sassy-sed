"use client"

import { useState, useEffect, useRef, useCallback } from "react"
import Image from "next/image"
import Link from "next/link"
import { ChevronLeft, ChevronRight } from "lucide-react"
import { Product } from "@/types"
import ColorThief from "colorthief"

interface LatestProductsClientProps {
  products: (Product & { imageUrl: string })[]
  title?: string
}

interface RGBColor {
  r: number
  g: number
  b: number
}

export function LatestProductsClient({
  products,
  title = "Latest Products",
}: LatestProductsClientProps) {
  const [currentIndex, setCurrentIndex] = useState(0)
  const [isImageLoaded, setIsImageLoaded] = useState(false)
  const [touchStart, setTouchStart] = useState<number | null>(null)
  const [touchEnd, setTouchEnd] = useState<number | null>(null)
  const [showSwipeHint, setShowSwipeHint] = useState(true)
  const [dominantColor, setDominantColor] = useState<RGBColor>({ r: 30, g: 30, b: 30 })
  const [isColorLoaded, setIsColorLoaded] = useState(false)
  const [showMobileArrows, setShowMobileArrows] = useState(false)
  const [isSectionHovered, setIsSectionHovered] = useState(false)
  
  const sectionRef = useRef<HTMLDivElement>(null)
  const colorThiefRef = useRef(new ColorThief())
  const hideArrowsTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null)

  const product = products[currentIndex]

  // Memoized navigation functions
  const nextProduct = useCallback(() => {
    setCurrentIndex((prev) => (prev === products.length - 1 ? 0 : prev + 1))
  }, [products.length])

  const prevProduct = useCallback(() => {
    setCurrentIndex((prev) => (prev === 0 ? products.length - 1 : prev - 1))
  }, [products.length])

  const goToProduct = (index: number) => {
    setCurrentIndex(index)
  }

  // Extract dominant color from product image
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
      setDominantColor({ r: 30, g: 30, b: 30 })
      setIsColorLoaded(true)
    }
  }, [])

  // Handle image load for color extraction and display
  const handleImageLoad = useCallback((e: React.SyntheticEvent<HTMLImageElement>) => {
    const img = e.target as HTMLImageElement
    if (img.complete) {
      extractDominantColor(img)
      setIsImageLoaded(true)
    }
  }, [extractDominantColor])

  // Reset states when product changes
  useEffect(() => {
    setIsImageLoaded(false)
    setIsColorLoaded(false)
  }, [currentIndex])

  // Show mobile arrows temporarily on interaction
  const showArrowsTemporarily = useCallback(() => {
    setShowMobileArrows(true)
    
    // Clear existing timeout
    if (hideArrowsTimeoutRef.current) {
      clearTimeout(hideArrowsTimeoutRef.current)
    }
    
    // Hide arrows after 2 seconds of inactivity
    hideArrowsTimeoutRef.current = setTimeout(() => {
      setShowMobileArrows(false)
    }, 2000)
  }, [])

  // Handle touch events for swipe gestures
  const handleTouchStart = (e: React.TouchEvent) => {
    setTouchStart(e.targetTouches[0].clientX)
    setShowSwipeHint(false)
    showArrowsTemporarily()
  }

  const handleTouchMove = (e: React.TouchEvent) => {
    if (!touchStart) return
    setTouchEnd(e.targetTouches[0].clientX)
  }

  const handleTouchEnd = () => {
    if (!touchStart || !touchEnd) return

    const distance = touchStart - touchEnd
    const minSwipeDistance = 50

    if (Math.abs(distance) < minSwipeDistance) return

    if (distance > minSwipeDistance) {
      nextProduct()
    } else {
      prevProduct()
    }

    setTouchStart(null)
    setTouchEnd(null)
  }

  // Handle mouse enter/leave for desktop hover
  const handleMouseEnter = () => {
    setIsSectionHovered(true)
  }

  const handleMouseLeave = () => {
    setIsSectionHovered(false)
  }

  // Handle click anywhere in section to show arrows
  const handleSectionClick = () => {
    showArrowsTemporarily()
  }

  // Hide swipe hint after first interaction or timeout
  useEffect(() => {
    const timer = setTimeout(() => {
      setShowSwipeHint(false)
    }, 3000)

    return () => clearTimeout(timer)
  }, [])

  // Cleanup timeouts on unmount
  useEffect(() => {
    return () => {
      if (hideArrowsTimeoutRef.current) {
        clearTimeout(hideArrowsTimeoutRef.current)
      }
    }
  }, [])

  // Calculate text color based on background brightness
  const getTextColor = useCallback((rgb: RGBColor) => {
    const brightness = (rgb.r * 299 + rgb.g * 587 + rgb.b * 114) / 1000
    return brightness > 128 ? 'text-black' : 'text-white'
  }, [])

  // Calculate overlay opacity based on color brightness
  const getOverlayOpacity = useCallback((rgb: RGBColor) => {
    const brightness = (rgb.r * 299 + rgb.g * 587 + rgb.b * 114) / 1000
    return brightness > 180 ? 0.1 : brightness > 100 ? 0.05 : 0.15
  }, [])

  const textColorClass = getTextColor(dominantColor)
  const overlayOpacity = getOverlayOpacity(dominantColor)

  // Early return for empty products
  if (!products?.length) {
    return (
      <div className="min-h-[80vh] flex items-center justify-center bg-gray-100">
        <p className="text-xl text-gray-600">No products available</p>
      </div>
    )
  }

  if (!product) {
    return (
      <div className="min-h-[80vh] flex items-center justify-center bg-gray-100">
        <p className="text-xl text-gray-600">Product not found</p>
      </div>
    )
  }

  return (
    <section
      ref={sectionRef}
      className="relative min-h-[80vh] flex items-center p-4 sm:p-8 overflow-hidden transition-all duration-1000"
      style={{
        backgroundColor: isColorLoaded 
          ? `rgb(${dominantColor.r}, ${dominantColor.g}, ${dominantColor.b})`
          : '#1f2937'
      }}
      onTouchStart={handleTouchStart}
      onTouchMove={handleTouchMove}
      onTouchEnd={handleTouchEnd}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      onClick={handleSectionClick}
    >
      {/* Background Overlay for better text readability */}
      <div 
        className="absolute inset-0 -z-10 transition-all duration-1000"
        style={{
          backgroundColor: `rgba(0, 0, 0, ${overlayOpacity})`
        }}
      />
      
      {/* Background Image with Blur */}
      <div className="absolute inset-0 -z-20">
        <Image
          src={product.image}
          alt="background"
          fill
          priority={currentIndex === 0}
          className="object-cover blur-2xl scale-110 transition-all duration-1000"
          style={{
            opacity: isColorLoaded ? 0.3 : 0
          }}
          onLoad={handleImageLoad}
        />
      </div>

      {/* Huge background title */}
      <div 
        className={`absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-center pointer-events-none z-0 transition-all duration-1000 ${
          isColorLoaded ? 'opacity-20' : 'opacity-0'
        } ${textColorClass}`}
      >
        <h1 className="text-6xl sm:text-8xl md:text-9xl lg:text-[12rem] font-extralight uppercase tracking-wider">
          {title}
        </h1>
      </div>

      {/* Swipe Hint Animation - Mobile Only */}
      {showSwipeHint && products.length > 1 && (
        <div className="lg:hidden absolute inset-0 z-30 pointer-events-none">
          <div className="absolute left-4 top-1/2 -translate-y-1/2 animate-bounce">
            <div className={`bg-black/50 rounded-full p-3 backdrop-blur-sm ${textColorClass}`}>
              <ChevronLeft className="w-6 h-6" />
            </div>
          </div>
          <div className="absolute right-4 top-1/2 -translate-y-1/2 animate-bounce" style={{ animationDelay: '0.5s' }}>
            <div className={`bg-black/50 rounded-full p-3 backdrop-blur-sm ${textColorClass}`}>
              <ChevronRight className="w-6 h-6" />
            </div>
          </div>
          <div className={`absolute bottom-20 left-1/2 -translate-x-1/2 bg-black/50 px-4 py-2 rounded-full backdrop-blur-sm text-sm ${textColorClass}`}>
            Swipe to navigate
          </div>
        </div>
      )}

      <div className="container mx-auto max-w-7xl relative z-20">
        <div className="flex flex-col lg:flex-row items-center gap-12 lg:gap-20">
          {/* Left: Product Image */}
          <div className="w-full lg:w-1/2 flex justify-center">
            <div className="relative w-full max-w-lg h-[400px] sm:h-[500px] lg:h-[650px] overflow-hidden rounded-2xl shadow-2xl">
              {/* Skeleton while loading */}
              {!isImageLoaded && (
                <div 
                  className="absolute inset-0 backdrop-blur-sm animate-pulse rounded-2xl transition-all duration-1000"
                  style={{
                    backgroundColor: isColorLoaded 
                      ? `rgba(${dominantColor.r}, ${dominantColor.g}, ${dominantColor.b}, 0.5)`
                      : '#374151'
                  }}
                />
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
                onLoad={handleImageLoad}
                crossOrigin="anonymous"
              />
            </div>
          </div>

          {/* Right: Product Info */}
          <div
            className={`w-full lg:w-1/2 text-center lg:text-left transition-all duration-700 ${
              isImageLoaded ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"
            } ${textColorClass}`}
          >
            <h2 className="text-4xl sm:text-5xl lg:text-6xl font-bold drop-shadow-2xl mb-4">
              {product.name}
            </h2>

            {product.brand && (
              <p 
                className="text-lg uppercase tracking-widest mb-6 transition-all duration-1000"
                style={{
                  color: isColorLoaded 
                    ? `rgba(${255 - dominantColor.r}, ${255 - dominantColor.g}, ${255 - dominantColor.b}, 0.8)`
                    : '#ffffff'
                }}
              >
                {product.brand}
                {product.subcategory && ` — ${product.subcategory}`}
              </p>
            )}

            {product.description && (
              <p className="text-lg lg:text-xl leading-relaxed max-w-2xl mx-auto lg:mx-0 mb-10">
                {product.description}
              </p>
            )}

            <div className="flex flex-col sm:flex-row gap-6 justify-center lg:justify-start">
              <Link
                href={`/products/id/${product.id}`}
                className={`inline-block font-semibold uppercase tracking-wider px-8 py-4 rounded-full transition-all duration-300 shadow-xl hover:shadow-2xl transform hover:scale-105 ${
                  textColorClass === 'text-black' 
                    ? 'bg-black text-white hover:bg-gray-800 border-2 border-black' 
                    : 'bg-white text-black hover:bg-gray-200 border-2 border-white'
                }`}
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
              className={`absolute left-4 sm:left-8 top-1/2 -translate-y-1/2 p-4 rounded-full shadow-2xl hover:scale-110 transition-all z-30 backdrop-blur-sm ${
                isSectionHovered ? 'opacity-100' : 'opacity-0'
              } ${
                textColorClass === 'text-black' 
                  ? 'bg-black/90 text-white hover:bg-black' 
                  : 'bg-white/90 text-black hover:bg-white'
              }`}
              aria-label="Previous product"
            >
              <ChevronLeft className="w-8 h-8" />
            </button>
            <button
              onClick={nextProduct}
              className={`absolute right-4 sm:right-8 top-1/2 -translate-y-1/2 p-4 rounded-full shadow-2xl hover:scale-110 transition-all z-30 backdrop-blur-sm ${
                isSectionHovered ? 'opacity-100' : 'opacity-0'
              } ${
                textColorClass === 'text-black' 
                  ? 'bg-black/90 text-white hover:bg-black' 
                  : 'bg-white/90 text-black hover:bg-white'
              }`}
              aria-label="Next product"
            >
              <ChevronRight className="w-8 h-8" />
            </button>
          </div>
        )}

        {/* Mobile Navigation Arrows */}
        {products.length > 1 && (
          <div className={`lg:hidden absolute top-1/2 -translate-y-1/2 w-full flex justify-between z-30 pointer-events-none transition-opacity duration-300 ${
            showMobileArrows ? 'opacity-100' : 'opacity-0'
          }`}>
            <button
              onClick={(e) => {
                e.stopPropagation()
                prevProduct()
                showArrowsTemporarily()
              }}
              className={`p-4 rounded-full shadow-2xl hover:scale-110 transition-all pointer-events-auto ml-4 backdrop-blur-sm ${
                textColorClass === 'text-black' 
                  ? 'bg-black/50 text-white hover:bg-black/70' 
                  : 'bg-white/50 text-black hover:bg-white/70'
              }`}
              aria-label="Previous product"
            >
              <ChevronLeft className="w-6 h-6" />
            </button>
            <button
              onClick={(e) => {
                e.stopPropagation()
                nextProduct()
                showArrowsTemporarily()
              }}
              className={`p-4 rounded-full shadow-2xl hover:scale-110 transition-all pointer-events-auto mr-4 backdrop-blur-sm ${
                textColorClass === 'text-black' 
                  ? 'bg-black/50 text-white hover:bg-black/70' 
                  : 'bg-white/50 text-black hover:bg-white/70'
              }`}
              aria-label="Next product"
            >
              <ChevronRight className="w-6 h-6" />
            </button>
          </div>
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
                    ? `${textColorClass === 'text-black' ? 'bg-black' : 'bg-white'} w-10`
                    : `${textColorClass === 'text-black' ? 'bg-black/50' : 'bg-white/50'}`
                }`}
              />
            ))}
          </div>
        )}
      </div>
    </section>
  )
}
