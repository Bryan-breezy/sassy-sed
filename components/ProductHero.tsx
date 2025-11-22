'use client'
import { useState, useEffect, useCallback, useRef } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { ChevronLeft, ChevronRight } from 'lucide-react'
import { Product } from '@/types'
import ColorThief from 'colorthief'

interface ProductHeroProps {
  products: Product[]
  title: string
}

interface RGBColor {
  r: number
  g: number
  b: number
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
  const [dominantColor, setDominantColor] = useState<RGBColor>({ r: 30, g: 30, b: 30 })
  const [isColorLoaded, setIsColorLoaded] = useState(false)
  const sectionRef = useRef<HTMLDivElement>(null)
  const colorThiefRef = useRef(new ColorThief())

  const [showMobileArrows, setShowMobileArrows] = useState(false)
  const [isSectionHovered, setIsSectionHovered] = useState(false)
  const hideArrowsTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null)

  // Safe product access with fallback
  const product = products?.[currentIndex]

  // Memoized navigation functions
  const nextProduct = useCallback(() => {
    setCurrentIndex(i => i === (products?.length ?? 1) - 1 ? 0 : i + 1)
  }, [products?.length])

  const prevProduct = useCallback(() => {
    setCurrentIndex(i => i === 0 ? (products?.length ?? 1) - 1 : i - 1)
  }, [products?.length])

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

  // Handle image load for color extraction
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

  // Handle touch events
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
      className="relative min-h-screen flex items-center p-4 sm:p-8 overflow-hidden transition-all duration-1000"
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
          src={product.image || '/placeholder-image.jpg'}
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
      
      {/* Background Title */}
      <div 
        className={`absolute inset-0 flex items-center justify-center pointer-events-none z-10 transition-all duration-1000 ${
          isColorLoaded ? 'opacity-20' : 'opacity-0'
        } ${textColorClass}`}
      >
        <h1 className="text-6xl sm:text-7xl md:text-8xl lg:text-9xl xl:text-[12rem] font-extralight uppercase tracking-widest text-center px-4">
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
        <div className="grid lg:grid-cols-2 gap-8 lg:gap-16 items-center">
          {/* Product Image */}
          <div className="flex justify-center order-1">
            <div className="relative w-full max-w-2xl aspect-square rounded-3xl overflow-hidden shadow-2xl">
              {!isImageLoaded && (
                <div 
                  className="absolute inset-0 animate-pulse rounded-3xl transition-all duration-1000"
                  style={{
                    backgroundColor: isColorLoaded 
                      ? `rgba(${dominantColor.r}, ${dominantColor.g}, ${dominantColor.b}, 0.5)`
                      : '#374151'
                  }}
                />
              )}
              <Image
                src={product.image}
                alt={product.name || 'Product image'}
                fill
                sizes="(max-width: 1024px) 100vw, 50vw"
                className={`object-contain transition-all duration-1000 ${
                  isImageLoaded ? 'opacity-100 scale-100' : 'opacity-0 scale-95'
                }`}
                onLoad={handleImageLoad}
                priority={currentIndex === 0}
                crossOrigin="anonymous" // Important for ColorThief to work with external images
              />
            </div>
          </div>

          {/* Text Content */}
          <div className={`space-y-6 lg:space-y-10 text-center lg:text-left drop-shadow-xl order-2 transition-all duration-1000 ${textColorClass}`}>
            {/* Name */}
            <h2 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold leading-tight">
              {product.name}
            </h2>

            {/* Brand and Subcategory */}
            {(product.brand || product.subcategory) && (
              <p 
                className="text-base sm:text-lg uppercase tracking-widest transition-all duration-1000"
                style={{
                  color: isColorLoaded 
                    ? `rgba(${255 - dominantColor.r}, ${255 - dominantColor.g}, ${255 - dominantColor.b}, 0.8)`
                    : '#16a34a'
                }}
              >
                {product.brand}
                {product.brand && product.subcategory && ' — '}
                {product.subcategory}
              </p>
            )}

            {/* Description */}
            {product.description && (
              <p className="text-base sm:text-lg md:text-xl lg:text-2xl leading-relaxed max-w-3xl">
                {product.description}
              </p>
            )}

            {/* CTA Button */}
            <div className="pt-4 lg:pt-8">
              <Link
                href={`/products/id/${product.id}`}
                className={`inline-block px-6 sm:px-8 lg:px-10 py-3 sm:py-4 lg:py-5 rounded-full text-base sm:text-lg font-semibold uppercase tracking-wider transition-all shadow-2xl hover:shadow-3xl transform hover:scale-105 ${
                  textColorClass === 'text-black' 
                    ? 'bg-black text-white hover:bg-gray-800' 
                    : 'bg-white text-black hover:bg-gray-200'
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
              className={`absolute left-4 top-1/2 -translate-y-1/2 p-4 rounded-full shadow-2xl hover:scale-110 transition-all z-30 backdrop-blur-sm ${
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
              className={`absolute right-4 top-1/2 -translate-y-1/2 p-4 rounded-full shadow-2xl hover:scale-110 transition-all z-30 backdrop-blur-sm ${
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
      </div>
    </section>
  )
}
