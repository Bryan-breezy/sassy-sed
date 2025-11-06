"use client"

import { useEffect, useState } from "react"
import { ProductCardSkeleton } from "@/components/ProductCardSkeleton"
import { Product } from '@/types'
import { ProductCard } from '@/components/ProductCard'

interface ProductGridProps {
  featuredProducts?: Product[]
  fetchUrl?: string 
}

export function ProductGrid({ featuredProducts = [], fetchUrl }: ProductGridProps) {
  const [products, setProducts] = useState<Product[]>(featuredProducts)
  const [loading, setLoading] = useState(!featuredProducts.length)

  useEffect(() => {
    if (fetchUrl && !featuredProducts.length) {
      const fetchProducts = async () => {
        try {
          setLoading(true)
          const res = await fetch(fetchUrl)
          const data = await res.json()
          setProducts(data)
        } catch (error) {
          console.error("❌ Error loading products:", error)
        } finally {
          setLoading(false)
        }
      }
      fetchProducts()
    }
  }, [fetchUrl, featuredProducts])

  if (loading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-3 gap-4 sm:gap-6 lg:gap-8">
        {Array.from({ length: 9 }).map((_, index) => (
          <ProductCardSkeleton key={index} />
        ))}
      </div>
    )
  }

  if (!products.length) {
    return <p className="text-gray-500 text-center py-8">No products available.</p>
  }

  return (
<div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-4 gap-3 sm:gap-4 md:gap-5 lg:gap-6">
  {products.map((product, index) => (
    <ProductCard
      key={product.id}
      product={product}
      index={index}
      visibleSizes={3}
    />
  ))}
</div>
  )
}
