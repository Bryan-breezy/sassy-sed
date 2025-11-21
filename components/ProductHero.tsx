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
  const [displayedText, setDisplayedText] = useState<string>(''); // For typing effect

  const product = products[currentIndex];

  // Reset displayed text when product changes
  useEffect(() => {
    setDisplayedText('');
    setIsImageLoaded(false);
  }, [currentIndex]);

  // Letter-by-letter typing animation
  useEffect(() => {
    if (!product?.name || !isImageLoaded) return;

    let currentText = '';
    const textToType = product.name;
    let index = 0;

    const timer = setInterval(() => {
      currentText += textToType[index];
      setDisplayedText(currentText);
      index++;

      if (index >= textToType.length) {
        clearInterval(timer);
      }
    }, 60); // Adjust speed: lower = faster

    return () => clearInterval(timer);
  }, [product?.name, isImageLoaded]);

  // Auto-switch
  useEffect(() => {
    if (products.length <= 1) return;
    const interval = setInterval(() => {
      nextProduct();
    }, autoSwitchInterval);
    return () => clearInterval(interval);
  }, [products.length, autoSwitchInterval, currentIndex]);

  const nextProduct = () => {
    if (products.length <= 1) return;
    setCurrentIndex(prev => prev === products.length - 1 ? 0 : prev + 1);
  };

  const prevProduct = () => {
    if (products.length <= 1) return;
    setCurrentIndex(prev => prev === 0 ? products.length - 1 : prev - 1);
  };

  const goToProduct = (index: number) => {
    if (index === currentIndex) return;
    setCurrentIndex(index);
  };

  if (!products || products.length === 0) {
    return (
      <section className={`min-h-[60vh] flex items-center justify-center ${backgroundColor} p-8`}>
        <div className="text-center">
          <h2 className="text-2xl font-semibold text-gray-600">Error loading products</h2>
          <p className="text-gray-500 mt-2">Please refresh the page</p>
        </div>
      </section>
    );
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
          <div className="w-full lg:w-1/2 flex justify-center lg:justify-start">
            <div className="relative w-full max-w-md sm:max-w-lg md:max-w-xl h-[300px] sm:h-[400px] md:h-[500px] lg:h-[600px] xl:h-[700px] overflow-hidden rounded-lg shadow-2xl">
              {!isImageLoaded && (
                <div className="absolute inset-0 bg-gray-200 animate-pulse rounded-lg" />
              )}
              <Image
                src={product.image}
                alt={product.name}
                fill
                onLoad={() => setIsImageLoaded(true)}
                onError={() => setIsImageLoaded(true)}
                sizes="(max-width: 1024px) 100vw, 50vw"
                className={`object-contain object-center transition-all duration-700 ${
                  isImageLoaded ? 'opacity-100 scale-100' : 'opacity-0 scale-95'
                } hover:scale-105`}
                priority={currentIndex === 0}
              />
            </div>
          </div>

          {/* Right: Product Info */}
          <div className={`w-full lg:w-1/2 text-center lg:text-left px-2 sm:px-4 transition-opacity duration-700 ${
            isImageLoaded ? 'opacity-100' : 'opacity-0'
          }`}>
            {/* Typing Animation for Name */}
            <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-semibold text-gray-900 leading-snug sm:leading-tight mb-4 min-h-[3em] flex items-center">
              <span className="inline-block">
                {displayedText}
                {/* Blinking cursor */}
                {displayedText.length < (product.name?.length || 0) && (
                  <span className="inline-block w-1 h-10 bg-gray-900 ml-1 animate-pulse" />
                )}
              </span>
            </h2>

            {product.brand && (
              <p className="text-xs sm:text-sm uppercase text-gray-500 tracking-widest mb-4 opacity-0 animate-fade-in animation-delay-1000">
                {product.brand}
                {product.subcategory && ` — ${product.subcategory}`}
              </p>
            )}

            {product.description && (
              <p className="text-sm sm:text-base md:text-lg text-gray-600 mb-6 sm:mb-8 leading-relaxed max-w-lg lg:max-w-none mx-auto lg:mx-0 line-clamp-4 opacity-0 animate-fade-in animation-delay-1500">
                {product.description}
              </p>
            )}

            <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start opacity-0 animate-fade-in animation-delay-2000">
              <Link
                href={`/products/id/${product.id}`}
                className="inline-block border-2 border-black text-black font-semibold uppercase tracking-wider px-6 py-3 text-sm sm:text-base transition-all hover:bg-black hover:text-white text-center rounded-lg shadow-lg hover:shadow-xl"
              >
                View Product Details
              </Link>
            </div>
          </div>
        </div>

        {/* Navigation */}
        {products.length > 1 && (
          <>
            <button
              onClick={prevProduct}
              className="absolute left-4 top-1/2 -translate-y-1/2 p-3 bg-white/80 hover:bg-white rounded-full shadow-lg transition-all hover:scale-110 z-20"
            >
              <ChevronLeft className="w-6 h-6" />
            </button>
            <button
              onClick={nextProduct}
              className="absolute right-4 top-1/2 -translate-y-1/2 p-3 bg-white/80 hover:bg-white rounded-full shadow-lg transition-all hover:scale-110 z-20"
            >
              <ChevronRight className="w-6 h-6" />
            </button>

            {/* Mobile Dots */}
            <div className="flex justify-center gap-2 mt-8 lg:hidden">
              {products.map((_, i) => (
                <button
                  key={i}
                  onClick={() => goToProduct(i)}
                  className={`w-2 h-2 rounded-full transition-all ${
                    i === currentIndex ? 'bg-gray-900 w-8' : 'bg-gray-400'
                  }`}
                />
              ))}
            </div>
          </>
        )}
      </div>
    </section>
  );
};
