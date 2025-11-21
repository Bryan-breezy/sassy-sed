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
  autoSwitchInterval = 6000
}) => {
  const [currentIndex, setCurrentIndex] = useState<number>(0);
  const [isImageLoaded, setIsImageLoaded] = useState<boolean>(false);

  // Typing state
  const [typedName, setTypedName] = useState<string>('');
  const [typedDesc, setTypedDesc] = useState<string>('');
  const [isTypingName, setIsTypingName] = useState<boolean>(true);

  const product = products[currentIndex];

  // Reset everything when product changes
  useEffect(() => {
    setIsImageLoaded(false);
    setTypedName('');
    setTypedDesc('');
    setIsTypingName(true);
  }, [currentIndex]);

  // Start typing animation when image loads
  useEffect(() => {
    if (!isImageLoaded || !product) return;

    let nameIndex = 0;
    let descIndex = 0;
    const nameText = product.name || '';
    const descText = product.description || '';

    // Type the name first
    const nameTimer = setInterval(() => {
      if (nameIndex < nameText.length) {
        setTypedName(prev => prev + nameText[nameIndex]);
        nameIndex++;
      } else {
        clearInterval(nameTimer);
        setIsTypingName(false);

        // Then start typing the description
        const descTimer = setInterval(() => {
          if (descIndex < descText.length) {
            setTypedDesc(prev => prev + descText[descIndex]);
            descIndex++;
          } else {
            clearInterval(descTimer);
          }
        }, 30); // Description types faster

        return () => clearInterval(descTimer);
      }
    }, 70); // Name typing speed

    return () => clearInterval(nameTimer);
  }, [isImageLoaded, product]);

  // Auto-switch
  useEffect(() => {
    if (products.length <= 1) return;
    const interval = setInterval(nextProduct, autoSwitchInterval);
    return () => clearInterval(interval);
  }, [products.length, autoSwitchInterval, currentIndex]);

  const nextProduct = () => setCurrentIndex(prev => prev === products.length - 1 ? 0 : prev + 1);
  const prevProduct = () => setCurrentIndex(prev => prev === 0 ? products.length - 1 : prev - 1);
  const goToProduct = (i: number) => { if (i !== currentIndex) setCurrentIndex(i); };

  if (!products?.length) {
    return (
      <section className={`min-h-[60vh] flex items-center justify-center ${backgroundColor} p-8`}>
        <p className="text-2xl text-gray-500">No products found</p>
      </section>
    );
  }

  return (
    <section className={`relative min-h-[80vh] flex items-center ${backgroundColor} p-4 sm:p-8 overflow-hidden`}>
      {/* Background Title */}
      <div className={`absolute inset-0 flex items-center justify-center pointer-events-none z-0 opacity-10 ${textColor}`}>
        <h1 className="text-6xl sm:text-8xl lg:text-9xl font-extralight uppercase tracking-widest">
          {title}
        </h1>
      </div>

      <div className="container mx-auto max-w-7xl relative z-10">
        <div className="flex flex-col lg:flex-row items-center gap-12 lg:gap-20">

          {/* Image */}
          <div className="w-full lg:w-1/2 flex justify-center">
            <div className="relative w-full max-w-2xl h-[500px] lg:h-[700px] rounded-2xl overflow-hidden shadow-2xl">
              {!isImageLoaded && <div className="absolute inset-0 bg-gray-200 animate-pulse rounded-2xl" />}
              <Image
                src={product.image}
                alt={product.name}
                fill
                sizes="(max-width: 1024px) 100vw, 50vw"
                className={`object-contain transition-all duration-1000 ${isImageLoaded ? 'opacity-100 scale-100' : 'opacity-0 scale-95'} hover:scale-105`}
                priority={currentIndex === 0}
                onLoad={() => setIsImageLoaded(true)}
              />
            </div>
          </div>

          {/* Text Content */}
          <div className="w-full lg:w-1/2 text-center lg:text-left space-y-8">
            {/* Product Name with typing + cursor */}
            <h2 className="text-4xl sm:text-5xl lg:text-6xl font-bold leading-tight">
              <span className="inline-block">
                {typedName}
                {isTypingName && (
                  <span className="inline-block w-1 h-12 bg-gray-900 ml-1 animate-pulse align-middle" />
                )}
              </span>
            </h2>

            {/* Brand + Subcategory */}
            {product.brand && (
              <p className="text-sm uppercase tracking-widest text-gray-600">
                {product.brand}
                {product.subcategory && ` — ${product.subcategory}`}
              </p>
            )}

            {/* Description with typing */}
            <p className="text-lg lg:text-xl text-gray-700 leading-relaxed max-w-2xl">
              <span>
                {typedDesc}
                {!isTypingName && typedDesc.length < (product.description?.length || 0) && (
                  <span className="inline-block w-0.5 h-7 bg-gray-700 ml-0.5 animate-pulse align-middle" />
                )}
              </span>
            </p>

            {/* CTA */}
            <div className="pt-6">
              <Link
                href={`/products/id/${product.id}`}
                className="inline-block bg-black text-white px-8 py-4 rounded-full font-semibold uppercase tracking-wider hover:bg-gray-800 transition shadow-xl"
              >
                View Product Details
              </Link>
            </div>
          </div>
        </div>

        {/* Navigation */}
        {products.length > 1 && (
          <>
            <button onClick={prevProduct} className="absolute left-6 top-1/2 -translate-y-1/2 p-4 bg-white/90 rounded-full shadow-lg hover:scale-110 transition z-20">
              <ChevronLeft className="w-8 h-8" />
            </button>
            <button onClick={nextProduct} className="absolute right-6 top-1/2 -translate-y-1/2 p-4 bg-white/90 rounded-full shadow-lg hover:scale-110 transition z-20">
              <ChevronRight className="w-8 h-8" />
            </button>

            <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex gap-3">
              {products.map((_, i) => (
                <button
                  key={i}
                  onClick={() => goToProduct(i)}
                  className={`w-3 h-3 rounded-full transition-all ${i === currentIndex ? 'bg-black w-12' : 'bg-gray-400'}`}
                />
              ))}
            </div>
          </>
        )}
      </div>
    </section>
  );
};
