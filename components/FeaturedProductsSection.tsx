'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { Product } from '@/types'
import { ProductGrid } from '@/components/ProductGrid'
import { getAllProducts } from "@/lib/data"
import { ArrowRight } from 'lucide-react'

function cn(...classes: (string | false | undefined | null)[]) {
  return classes.filter(Boolean).join(' ')
}

export default function FeaturedProductsSection() {
  const [featuredProducts, setFeaturedProducts] = useState<Product[]>([])
  const [isLoading, setIsLoading]               = useState(true)

  useEffect(() => {
    const fetchData = async () => {
      try {
        const allProducts = await getAllProducts()
        setFeaturedProducts(allProducts.filter(p => p.featured).slice(0, 4))
      } catch (err) {
        console.error("Error fetching products:", err)
      } finally {
        setIsLoading(false)
      }
    }
    fetchData()
  }, [])

  return (
    <section className="bg-[#F5F2ED] py-20 lg:py-28">
      <div className="mx-auto max-w-7xl px-5 sm:px-8">

        {/* ── Section header ── */}
        <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-6 mb-14">
          <div>
            {/* Eyebrow */}
            <div className="flex items-center gap-3 mb-4">
              <span className="inline-block w-5 h-[1.5px] bg-emerald-700" />
              <p className="text-[10px] font-semibold tracking-[0.22em] text-emerald-700 uppercase">
                Our Selection
              </p>
            </div>
            <h2 className="font-serif text-4xl sm:text-5xl font-medium text-stone-900 leading-[1.05]">
              Featured <br className="hidden sm:block" />
              <em className="not-italic text-emerald-800">Products</em>
            </h2>
          </div>

          {/* Desktop — inline CTA */}
          <Link
            href="/products"
            className="hidden sm:flex items-center gap-2 text-sm font-medium text-stone-500 hover:text-emerald-700 transition-colors duration-200 group pb-1"
          >
            View all products
            <ArrowRight className="w-3.5 h-3.5 transition-transform duration-200 group-hover:translate-x-0.5" />
          </Link>
        </div>

        {/* ── Product grid or skeletons ── */}
        {isLoading ? (
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
            {[...Array(4)].map((_, i) => (
              <div key={i} className="rounded-2xl overflow-hidden bg-stone-100 animate-pulse">
                <div className="aspect-square bg-stone-200" />
                <div className="p-4 space-y-2">
                  <div className="h-3 w-2/3 bg-stone-200 rounded" />
                  <div className="h-3 w-1/3 bg-stone-200 rounded" />
                </div>
              </div>
            ))}
          </div>
        ) : featuredProducts.length > 0 ? (
          <ProductGrid featuredProducts={featuredProducts} isLoading={false} />
        ) : (
          <div className="text-center py-20 text-stone-400 text-sm">
            No featured products found.
          </div>
        )}

        {/* ── Bottom CTA strip ── */}
        <div className="mt-16 pt-10 border-t border-stone-200/70 flex flex-col sm:flex-row items-center justify-between gap-6">
          <p className="text-stone-500 text-sm max-w-sm text-center sm:text-left leading-relaxed">
            Discover our complete range of natural, skin-safe cosmetics — proudly made in Kenya.
          </p>
          <div className="flex items-center gap-3">
            <Link
              href="/products"
              className="flex items-center gap-2.5 px-6 py-3 rounded-full text-sm font-semibold text-white bg-stone-900 hover:bg-emerald-900 transition-colors duration-300 shadow-lg shadow-stone-900/10"
            >
              Explore All Products
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
            <Link
              href="/wholesale"
              className="flex items-center justify-center px-6 py-3 rounded-full text-sm font-semibold text-stone-700 border border-stone-200 hover:border-emerald-300 hover:text-emerald-800 transition-colors duration-300"
            >
              Wholesale
            </Link>
          </div>
        </div>

      </div>

      <style jsx>{`
        @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,400;0,500;1,400&display=swap');
        .font-serif { font-family: 'Playfair Display', Georgia, serif; }
      `}</style>
    </section>
  )
}
