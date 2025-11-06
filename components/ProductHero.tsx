'use client'

import { useState, useEffect } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { Product } from '@/types';

interface ProductHeroProps {
  products: Product[];
  title: string;
  backgroundColor?: string;
  textColor?: string;
  autoSwitchInterval?: number;
}

export const ProductHero: React.FC<ProductHeroProps> = ({ 
  products, 
  title, 
  backgroundColor = "bg-white",
  textColor = "text-gray-900",
  autoSwitchInterval = 5000
}) => {
  const [currentIndex, setCurrentIndex] = useState<number>(0);
  const [isImageLoaded, setIsImageLoaded] = useState<boolean>(false);

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
    );
  }

  const goToProduct = (index: number): void => {
    if (index === currentIndex) return;
    setIsImageLoaded(false);
    setCurrentIndex(index);
  }

  // Error/empty state
  if (!products || products.length === 0) {
    return (
      <section className={`min-h-[60vh] flex items-center justify-center ${backgroundColor} p-8`}>
        <div className="text-center">
          <h2 className="text-2xl font-semibold text-gray-600">Error loading products</h2>
          <p className="text-gray-500 mt-2">Please refresh the page</p>
        </div>
      </section>
    )
  }

  return (
    <section className={`relative min-h-[80vh] flex items-center ${backgroundColor} p-4 sm:p-8 overflow-hidden`}>
      {/* Background Text Overlay */}
      <div className={`absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-center ${textColor} opacity-10 pointer-events-none z-0`}>
        <h1 className="text-4xl sm:text-6xl md:text-8xl lg:text-9xl font-extralight uppercase tracking-wider">
          {title}
        </h1>
      </div>

      <div className="container mx-auto max-w-7xl relative z-10">
        <div className="flex flex-col lg:flex-row items-center gap-8 sm:gap-12 lg:gap-16">
          {/* Left: Image */}
          <div className="w-full lg:w-1/2 flex justify-center lg:justify-start order-1 lg:order-1">
            <div className="relative w-full max-w-md sm:max-w-lg md:max-w-xl h-[300px] sm:h-[400px] md:h-[500px] lg:h-[600px] xl:h-[700px] overflow-hidden">
              {!isImageLoaded && (
                <div className="absolute inset-0 bg-gray-200 animate-pulse rounded-lg shadow-xl" />
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
                  rounded-lg shadow-xl transition-transform duration-500 hover:scale-105
                  ${isImageLoaded ? 'opacity-100' : 'opacity-0'}
                `}
                priority={currentIndex === 0}
              />
            </div>
          </div>

          {/* Right: Product Info */}
          <div className={`w-full lg:w-1/2 text-center lg:text-left px-2 sm:px-4 order-2 transition-opacity duration-500 ${isImageLoaded ? 'opacity-100' : 'opacity-0'}`}>
            <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-semibold text-gray-900 leading-snug sm:leading-tight mb-4">
              {product.name}
            </h2>

            {product.brand && (
              <p className="text-xs sm:text-sm uppercase text-gray-500 tracking-widest mb-4">
                {product.subcategory && ` ${product.subcategory}`}
              </p>
            )}

            {product.description && (
              <p className="text-sm sm:text-base md:text-lg text-gray-600 mb-6 sm:mb-8 leading-relaxed max-w-lg lg:max-w-none mx-auto lg:mx-0 line-clamp-4">
                {product.description}
              </p>
            )}

            <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start">
              <Link
                href={`/products/id/${product.id}`}
                className="inline-block border-2 border-black text-black font-semibold uppercase tracking-wider px-4 sm:px-6 py-2 sm:py-3 text-sm sm:text-base transition-colors duration-300 hover:bg-black hover:text-white text-center"
              >
                View Product Details
              </Link>
            </div>
          </div>
        </div>

        {/* Navigation Arrows - Only show if multiple products */}
        {products.length > 1 && (
          <>
            <div className="absolute inset-y-0 left-0 flex items-center">
              <button
                type="button"
                onClick={prevProduct}
                aria-label="Previous Product"
                className="p-2 sm:p-3 bg-white/80 hover:bg-white shadow-md rounded-full ml-2 sm:ml-4 transition-all duration-300 hover:scale-110"
              >
                <ChevronLeft className="w-5 h-5 sm:w-6 sm:h-6 text-gray-700" />
              </button>
            </div>
            <div className="absolute inset-y-0 right-0 flex items-center">
              <button
                type="button"
                onClick={nextProduct}
                aria-label="Next Product"
                className="p-2 sm:p-3 bg-white/80 hover:bg-white shadow-md rounded-full mr-2 sm:mr-4 transition-all duration-300 hover:scale-110"
              >
                <ChevronRight className="w-5 h-5 sm:w-6 sm:h-6 text-gray-700" />
              </button>
            </div>
          </>
        )}        
      </div>
    </section>
  );
};