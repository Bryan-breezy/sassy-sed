"use client"

import { useState, useMemo } from 'react'
import Link from 'next/link'
import Image from 'next/image'

// UI Components
import { Input } from "@/components/ui/input"
import { Search } from "lucide-react"
import type { Product } from '@/types'

export function FullWidthProductGrid({ initialProducts, categoryName }: {
  initialProducts: Product[]
  categoryName: string
}) {
  const [searchTerm, setSearchTerm] = useState("")
  const filteredProducts = useMemo(() => {
    if (searchTerm.trim() === '') return initialProducts
    
    return initialProducts.filter((product) =>
      [product.name, product.category, product.subcategory]
        .join(" ")
        .toLowerCase()
        .includes(searchTerm.toLowerCase())
    )
  }, [initialProducts, searchTerm])

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
                  <div className="bg-white rounded-lg border border-gray-200 hover:border-rose-200 hover:shadow-md transition-all duration-300 overflow-hidden">
                    {/* Image */}
                    <div className="relative bg-gray-50 aspect-square flex items-center justify-center p-4">
                      <Image
                        src={product.image || "/placeholder.svg"}
                        alt={product.name}
                        width={200}
                        height={200}
                        className="w-full h-full object-contain group-hover:scale-105 transition-transform duration-300"
                      />
                    </div>
                    
                    {/* Content */}
                    <div className="p-3">
                      <span className="inline-block text-xs text-gray-500 bg-gray-100 px-2 py-1 rounded mb-2">
                        {product.brand}
                      </span>
                      <h3 className="font-medium text-gray-900 line-clamp-2 text-sm mb-1 group-hover:text-rose-600 transition-colors">
                        {product.name}
                      </h3>
                      <p className="text-xs text-gray-600 line-clamp-1">
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
