"use client"

import { useState, useMemo } from 'react'
import Link from 'next/link'
import Image from 'next/image'

// UI Components
import { Input } from "@/components/ui/input"
import { Search, ArrowUpRight } from "lucide-react"
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
    <div className="bg-stone-50/50 min-h-screen">
      <div className="container mx-auto px-4 py-12 lg:py-20">
        <main>
          {/* Page Header */}
          <div className="mb-12 text-center lg:text-left">
            <div className="flex flex-col lg:flex-row lg:items-end lg:justify-between gap-8">
              <div className="space-y-4">
                <h1 className="text-4xl lg:text-6xl font-serif font-medium text-stone-900">{categoryName}</h1>
                <p className="text-lg text-stone-600 max-w-xl font-light">
                  Explore our complete collection of {categoryName.toLowerCase()} products, 
                  crafted with natural ingredients for your daily care.
                </p>
              </div>

              {/* Search Bar */}
              <div className="relative w-full lg:max-w-md group">
                <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-stone-400 w-5 h-5 transition-colors group-focus-within:text-emerald-600" />
                <Input
                  placeholder={`Search in ${categoryName}...`}
                  className="pl-12 py-6 bg-white border-stone-200 rounded-2xl shadow-sm focus:ring-emerald-500/20 focus:border-emerald-500 transition-all"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
            </div>
          </div>

          <div className="flex items-center gap-4 mb-8">
            <div className="h-px flex-1 bg-stone-200" />
            <p className="text-sm font-medium text-stone-500 uppercase tracking-widest">
              {filteredProducts.length} Products Found
            </p>
            <div className="h-px flex-1 bg-stone-200" />
          </div>

          {/* Products Grid */}
          {filteredProducts.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
              {filteredProducts.map((product) => (
                <Link key={product.id} href={`/products/id/${product.id}`} className="group">
                  <div className="bg-white rounded-[2rem] border border-stone-100 p-6 transition-all duration-500 hover:shadow-2xl hover:shadow-stone-200/50 hover:-translate-y-2 flex flex-col h-full">
                    {/* Image Container */}
                    <div className="relative aspect-square mb-6 bg-stone-50 rounded-[1.5rem] overflow-hidden flex items-center justify-center p-8">
                      <Image
                        src={product.image || "/placeholder.svg"}
                        alt={product.name}
                        width={300}
                        height={300}
                        className="w-full h-full object-contain transition-transform duration-700 group-hover:scale-110"
                      />
                      <div className="absolute top-4 right-4 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                        <div className="bg-white/90 backdrop-blur-sm p-2 rounded-full shadow-lg">
                          <ArrowUpRight className="w-5 h-5 text-emerald-600" />
                        </div>
                      </div>
                    </div>
                    
                    {/* Content */}
                    <div className="space-y-3 flex-1">
                      <div className="flex items-center gap-2">
                        <span className="text-[10px] font-bold uppercase tracking-[0.2em] text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full">
                          {product.brand}
                        </span>
                      </div>
                      <h3 className="font-serif text-xl text-stone-900 group-hover:text-emerald-800 transition-colors line-clamp-2">
                        {product.name}
                      </h3>
                      <p className="text-sm text-stone-500 font-light line-clamp-1">
                        {product.subcategory}
                      </p>
                    </div>

                    <div className="pt-6 mt-auto border-t border-stone-50">
                      <span className="text-sm font-medium text-stone-900 group-hover:text-emerald-700 transition-colors flex items-center gap-2">
                        View Details
                        <div className="h-px w-4 bg-stone-300 group-hover:w-8 group-hover:bg-emerald-600 transition-all duration-300" />
                      </span>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          ): (
            <div className="text-center py-24 bg-white rounded-[3rem] border border-stone-100">
              <div className="max-w-md mx-auto space-y-4">
                <div className="w-20 h-20 bg-stone-50 rounded-full flex items-center justify-center mx-auto mb-6">
                  <Search className="w-10 h-10 text-stone-300" />
                </div>
                <h3 className="text-2xl font-serif text-stone-900">No products found</h3>
                <p className="text-stone-500 font-light">
                  We couldn't find any products matching "{searchTerm}". 
                  Try checking your spelling or using different keywords.
                </p>
                <button 
                  onClick={() => setSearchTerm("")}
                  className="text-emerald-700 font-medium hover:underline pt-4"
                >
                  Clear search and view all
                </button>
              </div>
            </div>
          )}
        </main>
      </div>
    </div>
  );
}
