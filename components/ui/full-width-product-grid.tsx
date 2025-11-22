"use client"

import { useState, useMemo } from 'react'
import Link from 'next/link'
import Image from 'next/image'

// UI Components
import { Input } from "@/components/ui/input"
import { Search } from "lucide-react"
import type { Product } from '@/types'

interface RGBColor {
  r: number
  g: number
  b: number
}

interface ProductWithColor extends Product {
  dominantColor?: RGBColor
  isColorLoaded?: boolean
  textColorClass?: string
}

export function FullWidthProductGrid({ initialProducts, categoryName }: {
  initialProducts: Product[]
  categoryName: string
}) {
  const [searchTerm, setSearchTerm] = useState("")
  const [productsWithColors, setProductsWithColors] = useState<ProductWithColor[]>(
    initialProducts.map(product => ({
      ...product,
      dominantColor: { r: 248, g: 250, b: 252 }, // Default light gray
      isColorLoaded: false,
      textColorClass: 'text-gray-900'
    }))
  )

  const filteredProducts = useMemo(() => {
    if (searchTerm.trim() === '') return productsWithColors
    
    return productsWithColors.filter((product) =>
      [product.name, product.category, product.subcategory]
        .join(" ")
        .toLowerCase()
        .includes(searchTerm.toLowerCase())
    )
  }, [productsWithColors, searchTerm])

  // Calculate text color based on background brightness
  const getTextColor = (rgb: RGBColor) => {
    const brightness = (rgb.r * 299 + rgb.g * 587 + rgb.b * 114) / 1000
    return brightness > 180 ? 'text-gray-900' : 'text-white'
  }

  // Handle image load for color extraction
  const handleImageLoad = (productId: string, img: HTMLImageElement) => {
    try {
      // Simple color extraction from the image
      const canvas = document.createElement('canvas')
      const ctx = canvas.getContext('2d')
      if (!ctx) return

      canvas.width = img.naturalWidth
      canvas.height = img.naturalHeight
      ctx.drawImage(img, 0, 0)

      // Get image data and calculate average color
      const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height)
      const data = imageData.data

      let r = 0, g = 0, b = 0
      const pixelCount = data.length / 4

      for (let i = 0; i < data.length; i += 4) {
        r += data[i]
        g += data[i + 1]
        b += data[i + 2]
      }

      const dominantColor = {
        r: Math.round(r / pixelCount),
        g: Math.round(g / pixelCount),
        b: Math.round(b / pixelCount)
      }

      const textColorClass = getTextColor(dominantColor)

      setProductsWithColors(prev => 
        prev.map(product => 
          product.id === productId 
            ? { 
                ...product, 
                dominantColor, 
                isColorLoaded: true, 
                textColorClass 
              }
            : product
        )
      )
    } catch (error) {
      console.warn('Failed to extract color for product:', productId, error)
      // Keep default colors if extraction fails
    }
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <main>
        {/* Page Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">{categoryName} Products</h1>
          <p className="text-gray-600 mb-6">
            Explore our complete collection of {categoryName.toLowerCase()} products.
          </p>

          {/* Search and Sort Bar */}
          <div className="flex flex-col md:flex-row gap-4 items-center justify-between">
            <div className="relative flex-1 w-full md:max-w-md">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <Input
                placeholder={`Search in ${categoryName}...`}
                className="pl-10"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
          </div>
        </div>

        <p className="text-gray-600 mb-6">
          Showing {filteredProducts.length} of {initialProducts.length} products
        </p>

        {/* Products Grid */}
        {filteredProducts.length > 0 ? (
          <div className="grid grid-cols-1 xs:grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 sm:gap-4 md:gap-6">
            {filteredProducts.map((product) => (
              <div key={product.id} className="group cursor-pointer">
                <Link href={`/products/id/${product.id}`} className="block">
                  <div 
                    className="rounded-lg border border-gray-200 hover:border-rose-200 hover:shadow-xl transition-all duration-300 overflow-hidden"
                    style={{
                      backgroundColor: product.isColorLoaded 
                        ? `rgb(${product.dominantColor!.r}, ${product.dominantColor!.g}, ${product.dominantColor!.b})`
                        : '#f8fafc'
                    }}
                  >
                    {/* Image */}
                    <div className="relative bg-white/30 aspect-square flex items-center justify-center p-4">
                      <Image
                        src={product.image || "/placeholder.svg"}
                        alt={product.name}
                        width={200}
                        height={200}
                        className="w-full h-full object-contain group-hover:scale-105 transition-transform duration-300"
                        onLoad={(e) => handleImageLoad(product.id, e.target as HTMLImageElement)}
                        crossOrigin="anonymous"
                      />
                    </div>
                    
                    {/* Content */}
                    <div className="p-3">
                      <span 
                        className="inline-block text-xs bg-black/10 px-2 py-1 rounded mb-2 transition-colors"
                        style={{
                          color: product.isColorLoaded 
                            ? product.textColorClass === 'text-white' 
                              ? 'rgba(255,255,255,0.9)'
                              : 'rgba(0,0,0,0.7)'
                            : '#6b7280'
                        }}
                      >
                        {product.brand}
                      </span>
                      <h3 
                        className="font-medium line-clamp-2 text-sm mb-1 transition-colors group-hover:opacity-80"
                        style={{
                          color: product.isColorLoaded 
                            ? product.textColorClass === 'text-white' 
                              ? 'white'
                              : '#1f2937'
                            : '#1f2937'
                        }}
                      >
                        {product.name}
                      </h3>
                      <p 
                        className="text-xs line-clamp-1 transition-colors"
                        style={{
                          color: product.isColorLoaded 
                            ? product.textColorClass === 'text-white' 
                              ? 'rgba(255,255,255,0.8)'
                              : 'rgba(0,0,0,0.6)'
                            : '#6b7280'
                        }}
                      >
                        {product.subcategory}
                      </p>
                    </div>
                  </div>
                </Link>
              </div>
            ))}
          </div>
        ): (
          <div className="col-span-full text-center text-gray-500 py-12">
            <h3 className="text-xl font-semibold">No products found</h3>
            <p className="mt-2">No products in this category match your search term.</p>
          </div>
        )}
      </main>
    </div>
  );
}
