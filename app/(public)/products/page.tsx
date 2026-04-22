'use client'

import { useState, useEffect } from "react"
import { getAllProducts } from "@/lib/data"
import { ProductGridWithFilters } from "@/components/product-grid-with-filters"
import { Product } from "@/types"

export default function ProductsPage() {
  const [products, setProducts] = useState<Product[]>([])
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const allProducts = await getAllProducts()
        setProducts(allProducts)
      } catch (error) {
        console.error("Error fetching products:", error)
      } finally {
        setIsLoading(false)
      }
    }
    fetchProducts()
  }, [])

  return (
    <ProductGridWithFilters initialProducts={products} isLoading={isLoading} />
  )
}
