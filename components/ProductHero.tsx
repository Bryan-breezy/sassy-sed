'use client'
import { useState, useEffect } from 'react'
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

  const [typedName, setTypedName] = useState('')
  const [typedDesc, setTypedDesc] = useState('')
  const [showCursor, setShowCursor] = useState(true)
  const [isTypingName, setIsTypingName] = useState(true)

  const product = products[currentIndex]

  // Reset typing on product change
  useEffect(() => {
    setIsImageLoaded(false)
    setTypedName('')
    setTypedDesc('')
    setShowCursor(true)
    setIsTypingName(true)
  }, [currentIndex])

  // Cursor blink
  useEffect(() => {
    const blink = setInterval(() => setShowCursor(v => !v), 500)
    return () => clearInterval(blink)
  }, [])

  // Typing animation
  useEffect(() => {
    if (!isImageLoaded || !product) return

    const nameText = product.name || ''
    const descText = product.description || ''

    let timeoutId: NodeJS.Timeout

    const typeName = (index: number) => {
      if (index < nameText.length) {
        setTypedName(prev => prev + nameText[index])
        timeoutId = setTimeout(() => typeName(index + 1), 80)
      } else {
        setIsTypingName(false)
        timeoutId = setTimeout(() => typeDesc(0), 120)
      }
    }

    const typeDesc = (index: number) => {
      if (index < descText.length) {
        setTypedDesc(prev => prev + descText[index])
        timeoutId = setTimeout(() => typeDesc(index + 1), 25)
      }
    }

    timeoutId = setTimeout(() => typeName(0), 200)

    return () => clearTimeout(timeoutId)
  }, [isImageLoaded, product])

  const nextProduct = () =>
    setCurrentIndex(i => i === products.length - 1 ? 0 : i + 1)

  const prevProduct = () =>
    setCurrentIndex(i => i === 0 ? products.length - 1 : i - 1)

  if (!products?.length) {
    return <div className="min-h-screen flex items-center justify-center">No products</div>
  }

  return (
    <section className="relative min-h-screen flex items-center p-8 overflow-hidden text-white">
      <div className="absolute inset-0 -z-10">
        <Image
          src={product.image}
          alt="background"
          fill
          priority
          className="object-cover blur-2xl scale-110 opacity-30"
        />
      </div>

      {/* Soft gradient overlay for readability */}
       <div className="absolute inset-0 bg-black/60 -z-10" />

      {/* Background Title */}
      <div className="absolute inset-0 flex items-center justify-center pointer-events-none z-0 opacity-10 text-white">
        <h1 className="text-8xl md:text-9xl lg:text-[12rem] font-extralight uppercase tracking-widest">
          {title}
        </h1>
      </div>

      <div className="container mx-auto max-w-7xl relative z-10">
        <div className="grid lg:grid-cols-2 gap-16 items-center">

          {/* Product Image */}
          <div className="flex justify-center">
            <div className="relative w-full max-w-2xl aspect-square rounded-3xl overflow-hidden shadow-2xl">
              {!isImageLoaded && (
                <div className="absolute inset-0 bg-gray-200 animate-pulse rounded-3xl" />
              )}

              <Image
                src={product.image}
                alt={product.name}
                fill
                sizes="(max-width: 1024px) 100vw, 50vw"
                className={`object-contain transition-all duration-1000 ${isImageLoaded ? 'opacity-100' : 'opacity-0'}`}
                onLoad={() => setIsImageLoaded(true)}
                priority={currentIndex === 0}
              />
            </div>
          </div>

          {/* Text Content */}
          <div className="space-y-10 text-center lg:text-left text-white drop-shadow-xl">

            {/* Name */}
            <h2 className="text-5xl md:text-6xl lg:text-7xl font-bold leading-tight">
              {typedName}
              {isTypingName && showCursor && (
                <span className="inline-block w-1 h-14 bg-white ml-1 animate-pulse" />
              )}
            </h2>

            {/* Brand */}
            {product.brand && (
              <p className="text-lg uppercase tracking-widest text-gray-200">
                {product.brand}
                {product.subcategory && ` — ${product.subcategory}`}
              </p>
            )}

            {/* Description */}
            <p className="text-lg md:text-xl lg:text-2xl leading-relaxed text-gray-100 max-w-3xl">
              {typedDesc}
              {!isTypingName &&
                typedDesc.length < (product.description?.length || 0) &&
                showCursor && (
                  <span className="inline-block w-1 h-8 bg-white ml-1 animate-pulse" />
                )
              }
            </p>

            {/* CTA */}
            <div className="pt-8">
              <Link
                href={`/products/id/${product.id}`}
                className="inline-block bg-white text-black px-10 py-5 rounded-full text-lg font-semibold uppercase tracking-wider hover:bg-gray-200 transition-all shadow-2xl hover:shadow-3xl"
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
              className="absolute left-8 top-1/2 -translate-y-1/2 p-5 bg-white/80 rounded-full shadow-2xl hover:scale-110 transition z-20"
            >
              <ChevronLeft className="w-10 h-10 text-black" />
            </button>

            <button
              onClick={nextProduct}
              className="absolute right-8 top-1/2 -translate-y-1/2 p-5 bg-white/80 rounded-full shadow-2xl hover:scale-110 transition z-20"
            >
              <ChevronRight className="w-10 h-10 text-black" />
            </button>

          </>
        )}
      </div>
    </section>
  );
};
