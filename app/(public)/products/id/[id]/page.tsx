'use client'

import { useState, useEffect } from "react"
import Link from "next/link"
import Image from "next/image"
import { notFound } from "next/navigation"

import { getProductById, getAllProducts } from "@/lib/data"

import { BackToTopButton } from "@/components/ui/back-to-top-button"
import { ProductDetailSkeleton } from "@/components/ProductDetailSkeleton"

import { Card, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Skeleton } from "@/components/ui/skeleton"
import { ChevronLeft, Sparkles, CheckCircle2, ShieldCheck, Truck, ArrowRight } from "lucide-react"

interface Props {
  params: Promise<{id: string}>
}

type ProductWithColor = {
  id: string
  name: string
  brand: string
  category: string
  subcategory: string
  description: string
  image: string
  sizes: string[]
  concerns: string[]
}

function RelatedProductCard({ p }: { p: ProductWithColor }) {
  const [isLoaded, setIsLoaded] = useState(false)
  return (
    <Card className="group hover:shadow-2xl transition-all duration-500 h-full bg-white border-stone-100 rounded-[2rem] overflow-hidden hover:-translate-y-2">
      <Link href={`/products/id/${p.id}`}>
        <div className="relative aspect-square bg-stone-50 overflow-hidden p-6">
          {!isLoaded && (
            <Skeleton className="absolute inset-0 z-10 w-full h-full" />
          )}
          <Image 
            src={p.image || "/placeholder.svg"} 
            alt={p.name} 
            fill 
            className={`object-contain p-4 group-hover:scale-110 transition-all duration-700 ${
              isLoaded ? 'opacity-100' : 'opacity-0'
            }`} 
            onLoad={() => setIsLoaded(true)}
          />
        </div>
        <CardHeader className="p-6">
          <p className="text-[10px] font-bold uppercase tracking-widest text-emerald-700 mb-2">{p.brand}</p>
          <CardTitle className="text-lg font-serif line-clamp-2 text-stone-900 group-hover:text-emerald-800 transition-colors">{p.name}</CardTitle>
        </CardHeader>
      </Link>
    </Card>
  )
}

export default function ProductDetailPage({ params }: Props) {
  const [product, setProduct] = useState<ProductWithColor | null>(null)
  const [allProducts, setAllProducts] = useState<ProductWithColor[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [isMainImageLoaded, setIsMainImageLoaded] = useState(false)

  useEffect(() => {
    const loadData = async () => {
      try {
        const { id } = await params
        const [productData, allProductsData] = await Promise.all([
          getProductById(id),
          getAllProducts()
        ])

        if (!productData) {
          notFound()
          return
        }

        const transformedProduct: ProductWithColor = {
          id: productData.id,
          name: productData.name || "Unnamed Product",
          brand: productData.brand || "Unknown Brand",
          category: productData.category || "Uncategorized",
          subcategory: productData.subcategory || "",
          description: productData.description || "",
          image: productData.image || "/placeholder.svg",
          sizes: productData.sizes || [],
          concerns: productData.concerns || [],
        }

        const transformedAllProducts: ProductWithColor[] = allProductsData.map(p => ({
          id: p.id,
          name: p.name || "Unnamed Product",
          brand: p.brand || "Unknown Brand",
          category: p.category || "Uncategorized",
          subcategory: p.subcategory || "",
          description: p.description || "",
          image: p.image || "/placeholder.svg",
          sizes: p.sizes || [],
          concerns: p.concerns || [],
        }))

        setProduct(transformedProduct)
        setAllProducts(transformedAllProducts)
      } catch (error) {
        console.error('Error loading product data:', error)
      } finally {
        setIsLoading(false)
      }
    }

    loadData()
  }, [params])

  if (isLoading) return <ProductDetailSkeleton />
  if (!product) notFound()

  const relatedProducts = allProducts
    .filter((p) => p.category === product.category && p.id !== product.id)
    .slice(0, 4)

  return (
    <div className="min-h-screen bg-[#FDFCFB]">
      <main className="container mx-auto px-4 py-12 lg:py-20">
        <Link 
          href="/products" 
          className="inline-flex items-center mb-12 text-stone-500 hover:text-emerald-700 transition-colors font-medium group"
        >
          <div className="w-8 h-8 rounded-full border border-stone-200 flex items-center justify-center mr-3 group-hover:border-emerald-200 group-hover:bg-emerald-50 transition-all">
            <ChevronLeft className="w-4 h-4" />
          </div>
          Back to Collection
        </Link>

        <div className="grid lg:grid-cols-2 gap-16 lg:gap-24 items-start">
          {/* Image Section */}
          <div className="relative aspect-square bg-white rounded-[3rem] shadow-2xl shadow-stone-200/50 border border-stone-100 p-12 lg:p-20 overflow-hidden group">
            <div className="absolute inset-0 bg-gradient-to-br from-stone-50 to-transparent opacity-50" />
            {!isMainImageLoaded && (
              <Skeleton className="absolute inset-0 z-10 w-full h-full" />
            )}
            <Image
              src={product.image}
              alt={product.name}
              fill
              className={`object-contain p-8 transition-all duration-1000 ease-out group-hover:scale-110 ${
                isMainImageLoaded ? 'opacity-100 scale-100' : 'opacity-0 scale-90'
              }`}
              onLoad={() => setIsMainImageLoaded(true)}
              priority
            />
          </div>

          {/* Info Section */}
          <div className="space-y-10">
            <div className="space-y-4">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-50 border border-emerald-100">
                <span className="w-2 h-2 bg-emerald-500 rounded-full" />
                <span className="text-xs font-bold text-emerald-700 uppercase tracking-wider">{product.brand}</span>
              </div>
              <h1 className="text-4xl md:text-6xl font-serif font-medium text-stone-900 leading-tight">
                {product.name}
              </h1>
              {product.subcategory && (
                <p className="text-xl text-stone-500 font-light italic">
                  {product.subcategory}
                </p>
              )}
            </div>

            {/* Features Grid */}
            <div className="grid grid-cols-3 gap-4 py-8 border-y border-stone-100">
              <div className="flex flex-col items-center text-center space-y-2">
                <ShieldCheck className="w-6 h-6 text-emerald-600" />
                <span className="text-[10px] uppercase tracking-widest text-stone-500 font-bold">Skin Safe</span>
              </div>
              <div className="flex flex-col items-center text-center space-y-2">
                <CheckCircle2 className="w-6 h-6 text-emerald-600" />
                <span className="text-[10px] uppercase tracking-widest text-stone-500 font-bold">Tested</span>
              </div>
              <div className="flex flex-col items-center text-center space-y-2">
                <Truck className="w-6 h-6 text-emerald-600" />
                <span className="text-[10px] uppercase tracking-widest text-stone-500 font-bold">Fast Delivery</span>
              </div>
            </div>

            {product.description && (
              <div className="space-y-4">
                <h2 className="text-sm font-bold uppercase tracking-widest text-stone-900">About the product</h2>
                <p className="text-lg text-stone-600 leading-relaxed font-light">
                  {product.description}
                </p>
              </div>
            )}

            {product.sizes.length > 0 && (
              <div className="space-y-4">
                <h2 className="text-sm font-bold uppercase tracking-widest text-stone-900">Available Sizes</h2>
                <div className="flex flex-wrap gap-3">
                  {product.sizes.map((size) => (
                    <Badge 
                      key={size} 
                      variant="outline" 
                      className="text-base py-2 px-6 rounded-xl border-stone-200 text-stone-700 bg-white hover:border-emerald-300 hover:bg-emerald-50 transition-all cursor-default"
                    >
                      {size}
                    </Badge>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Related Products Section */}
        {relatedProducts.length > 0 && (
          <div className="mt-32">
            <div className="flex items-end justify-between mb-12">
              <div className="space-y-4">
                <h2 className="text-emerald-700 font-bold tracking-[0.2em] uppercase text-sm">Discover More</h2>
                <h3 className="text-3xl md:text-5xl font-serif font-medium text-stone-900">You Might Also Like</h3>
              </div>
              <Link href="/products" className="hidden sm:flex items-center gap-2 text-stone-500 hover:text-emerald-700 transition-colors font-medium">
                View All Collection
                <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
              {relatedProducts.map((p) => (
                <RelatedProductCard key={p.id} p={p} />
              ))}
            </div>
          </div>
        )}
      </main>
      
      <BackToTopButton />
    </div>
  )
}
