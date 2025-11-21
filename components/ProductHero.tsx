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
  autoSwitchInterval = 7000
}) => {

  const [currentIndex, setCurrentIndex] = useState(0);
  const [isImageLoaded, setIsImageLoaded] = useState(false);

  const [typedName, setTypedName] = useState('');
  const [typedDesc, setTypedDesc] = useState('');
  const [showCursor, setShowCursor] = useState(true);
  const [isTypingName, setIsTypingName] = useState(true);

  const product = products[currentIndex];

  // Reset on product change
  useEffect(() => {
    setIsImageLoaded(false);
    setTypedName('');
    setTypedDesc('');
    setShowCursor(true);
    setIsTypingName(true);
  }, [currentIndex]);

  // cursor blink
  useEffect(() => {
    const blink = setInterval(() => setShowCursor(v => !v), 500);
    return () => clearInterval(blink);
  }, []);

  // typing animation — FIXED (no duplicate intervals)
  useEffect(() => {
    if (!isImageLoaded || !product) return;

    const nameText = product.name || '';
    const descText = product.description || '';

    let timeoutId: NodeJS.Timeout;

    const typeName = (index: number) => {
      if (index < nameText.length) {
        setTypedName(prev => prev + nameText[index]);
        timeoutId = setTimeout(() => typeName(index + 1), 80);
      } else {
        setIsTypingName(false);
        timeoutId = setTimeout(() => typeDesc(0), 120);
      }
    };

    const typeDesc = (index: number) => {
      if (index < descText.length) {
        setTypedDesc(prev => prev + descText[index]);
        timeoutId = setTimeout(() => typeDesc(index + 1), 25);
      }
    };

    timeoutId = setTimeout(() => typeName(0), 200);

    return () => clearTimeout(timeoutId);
  }, [isImageLoaded, product]);

  // Auto switch
  useEffect(() => {
    if (products.length <= 1) return;

    const interval = setInterval(() => {
      setCurrentIndex(i => i === products.length - 1 ? 0 : i + 1);
    }, autoSwitchInterval);

    return () => clearInterval(interval);
  }, [products.length, autoSwitchInterval]);

  const nextProduct = () =>
    setCurrentIndex(i => i === products.length - 1 ? 0 : i + 1);

  const prevProduct = () =>
    setCurrentIndex(i => i === 0 ? products.length - 1 : i - 1);

  if (!products?.length) {
    return <div className="min-h-screen flex items-center justify-center">No products</div>;
  }

  return (
    <section className={`relative min-h-screen flex items-center ${backgroundColor} p-8 overflow-hidden`}>
      {/* Background Title */}
      <div className={`absolute inset-0 flex items-center justify-center pointer-events-none z-0 opacity-10 ${textColor}`}>
        <h1 className="text-8xl md:text-9xl lg:text-[12rem] font-extralight uppercase tracking-widest">
          {title}
        </h1>
      </div>

      <div className="container mx-auto max-w-7xl relative z-10">
        <div className="grid lg:grid-cols-2 gap-16 items-center">

          {/* Image */}
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

          {/* Text */}
          <div className="space-y-10 text-center lg:text-left">
            
            {/* Name */}
            <h2 className="text-5xl md:text-6xl lg:text-7xl font-bold leading-tight">
              {typedName}
              {isTypingName && showCursor && (
                <span className="inline-block w-1 h-14 bg-current ml-1 animate-pulse" />
              )}
            </h2>

            {/* Brand */}
            {product.brand && (
              <p className="text-lg uppercase tracking-widest text-gray-600">
                {product.brand}
                {product.subcategory && ` — ${product.subcategory}`}
              </p>
            )}

            {/* Description */}
            <p className="text-lg md:text-xl lg:text-2xl leading-relaxed text-gray-700 max-w-3xl">
              {typedDesc}
              {!isTypingName &&
                typedDesc.length < (product.description?.length || 0) &&
                showCursor && (
                  <span className="inline-block w-1 h-8 bg-gray-700 ml-1 animate-pulse" />
                )
              }
            </p>

            {/* CTA */}
            <div className="pt-8">
              <Link
                href={`/products/id/${product.id}`}
                className="inline-block bg-black text-white px-10 py-5 rounded-full text-lg font-semibold uppercase tracking-wider hover:bg-gray-800 transition-all shadow-2xl hover:shadow-3xl"
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
              className="absolute left-8 top-1/2 -translate-y-1/2 p-5 bg-white/90 rounded-full shadow-2xl hover:scale-110 transition z-20"
            >
              <ChevronLeft className="w-10 h-10" />
            </button>

            <button
              onClick={nextProduct}
              className="absolute right-8 top-1/2 -translate-y-1/2 p-5 bg-white/90 rounded-full shadow-2xl hover:scale-110 transition z-20"
            >
              <ChevronRight className="w-10 h-10" />
            </button>

            <div className="absolute bottom-12 left-1/2 -translate-x-1/2 flex gap-4">
              {products.map((_, i) => (
                <button
                  key={i}
                  onClick={() => setCurrentIndex(i)}
                  className={`${i === currentIndex ? 'w-16 h-3 bg-black' : 'w-3 h-3 bg-gray-400'} rounded-full transition-all`}
                />
              ))}
            </div>
          </>
        )}
      </div>
    </section>
  );
};
