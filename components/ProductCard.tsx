"use client"

import Link from 'next/link'
import Image from 'next/image'
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Product } from '@/types'

interface ProductCardProps {
  product: Product
  index: number
  visibleSizes: number
}

export function ProductCard({ product, index, visibleSizes }: ProductCardProps) {
  return (
    <Card className="group bg-white rounded-xl sm:rounded-2xl shadow-sm hover:shadow-2xl hover:-translate-y-2 transition-all duration-500 flex flex-col h-full border border-gray-100/80">
      <Link href={`/products/id/${product.id}`} className="flex flex-col h-full">
        {/* Image Container */}
        <div className="relative w-full aspect-square overflow-hidden rounded-t-xl sm:rounded-t-2xl bg-gradient-to-br from-gray-50 to-gray-100/50">
          <Image
            src={product.image || "/placeholder.svg"}
            alt={product.name}
            fill
            className="object-contain p-2 sm:p-3 group-hover:scale-110 transition-transform duration-500 ease-out"
            priority={index < 8}
            sizes="(max-width: 640px) 50vw, (max-width: 768px) 33vw, (max-width: 1024px) 25vw, 20vw"
          />
          
          {/* Hover Quick Actions - Hidden on mobile */}
          <div className="hidden sm:flex absolute top-3 right-3 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
            <button 
              className="bg-white/90 backdrop-blur-sm rounded-full p-2 shadow-lg hover:bg-white hover:scale-110 transition-all duration-200"
              onClick={(e) => {
                e.preventDefault();
                // Add to wishlist logic
              }}
            >
            </button>
          </div>

        </div>

        {/* Content Area */}
        <CardHeader className="flex-grow p-3 sm:p-4 md:p-5 pb-0">
          {/* Brand Name - Hidden on mobile */}
          <p className="hidden sm:block text-xs sm:text-sm text-green-600 mb-1 font-semibold line-clamp-1 tracking-wide">
            {product.brand}
          </p>
          
          {/* Product Name with proper ellipsis */}
          <CardTitle className="text-sm sm:text-base md:text-lg line-clamp-2 group-hover:text-green-700 transition-colors leading-tight font-bold text-gray-900 min-h-[2.5rem] sm:min-h-[3rem]">
            {product.name}
          </CardTitle>
        </CardHeader>

        <CardContent className="p-3 sm:p-4 md:p-5 pt-2 sm:pt-3">
          {/* Sizes - Hidden on mobile */}
          <div className="hidden sm:flex flex-wrap gap-1 mb-3 sm:mb-4">
            {product.sizes.slice(0, visibleSizes).map((size) => (
              <Badge 
                key={size} 
                variant="outline" 
                className="text-xs px-2 py-1 border-gray-200 bg-white/80 hover:bg-gray-50 transition-colors"
              >
                {size}
              </Badge>
            ))}
            {product.sizes.length > visibleSizes && (
              <Badge 
                variant="secondary" 
                className="text-xs px-2 py-1 bg-gray-100 text-gray-600 hover:bg-gray-200"
              >
                +{product.sizes.length - visibleSizes}
              </Badge>
            )}
          </div>

          {/* Category & Brand - Hidden on mobile */}
          <div className="hidden sm:flex items-center justify-between pt-2 sm:pt-3 border-t border-gray-100">
            <div className="flex flex-col">
              <Badge 
                variant="secondary" 
                className="text-xs px-2 py-1 bg-blue-50 text-blue-700 hover:bg-blue-100 border-0 max-w-[120px] truncate mb-1"
              >
                {product.category}
              </Badge>
              <Badge 
                variant="outline" 
                className="text-xs px-2 py-1 border-gray-200 max-w-[120px] truncate"
              >
                {product.brand}
              </Badge>
            </div>
            
            {/* Stock indicator - Hidden on mobile */}
            <div className="text-right">
              <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse mb-1 mx-auto"></div>
              <span className="text-xs text-gray-500 font-medium">In Stock</span>
            </div>
          </div>

          {/* Mobile-only simplified info */}
          <div className="sm:hidden flex items-center justify-between pt-2">
            <div className="flex flex-col flex-1 min-w-0">
              {/* Brand name for mobile - compact */}
              <p className="text-xs text-green-600 font-medium truncate mb-1">
                {product.brand}
              </p>
              {/* Price or category for mobile */}
              <p className="text-xs text-gray-500 truncate">
                {product.category}
              </p>
            </div>
            {/* Mobile stock indicator */}
            <div className="w-1.5 h-1.5 bg-green-500 rounded-full animate-pulse ml-2 flex-shrink-0"></div>
          </div>
        </CardContent>
      </Link>
    </Card>
  )
}