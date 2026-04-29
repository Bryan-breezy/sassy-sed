'use client'

import { useState, useEffect } from "react"
import Link from "next/link"
import Image from "next/image"
import { 
  Card, 
  CardHeader, 
  CardTitle, 
  CardDescription, 
} from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Skeleton } from "@/components/ui/skeleton"
import { CategoryCardSkeleton } from "@/components/CategoryCardSkeleton"
import { supabase } from '@/lib/supabase-client'
import { getAllProducts as getProducts } from '@/lib/data'
import { ArrowRight, Sparkles } from "lucide-react"

const bucketName = process.env.NEXT_PUBLIC_BUCKET_NAME || "uploads"

const getImageUrl = (imagePath: string) => {
  const { data } = supabase.storage.from(bucketName).getPublicUrl(imagePath)
  return data.publicUrl
}

interface Category {
  name: string;
  description: string;
  productCount: number;
  subcategories: string[];
  image: string;
  href: string;
}

function CategoryCard({ 
  category, 
  imageUrl 
}: { 
  category: Category
  imageUrl: string 
}) {
  const [isLoaded, setIsLoaded] = useState(false)

  return (
    <Card className="group hover:shadow-2xl transition-all duration-500 border-stone-100 bg-white rounded-[2.5rem] overflow-hidden flex flex-col h-full hover:-translate-y-2">
      <Link href={category.href} className="flex flex-col h-full">
        <div className="relative aspect-[4/3] bg-stone-50 overflow-hidden p-8">
          {!isLoaded && (
            <Skeleton className="absolute inset-0 z-10 w-full h-full rounded-none" />
          )}
          <Image
            src={imageUrl || category.image || "/placeholder.svg"}
            alt={category.name}
            fill
            className={`object-contain transition-all duration-700 group-hover:scale-110 ${
              isLoaded ? "opacity-100" : "opacity-0"
            }`}
            onLoad={() => setIsLoaded(true)}
          />
        </div>

        <CardHeader className="p-8 space-y-4 flex-1">
          <div className="space-y-2">
            <CardTitle className="text-2xl font-serif font-medium text-stone-900 group-hover:text-emerald-800 transition-colors">
              {category.name}
            </CardTitle>
            <CardDescription className="text-stone-500 font-light line-clamp-2 leading-relaxed">
              {category.description || `Explore our premium selection of ${category.name} products, carefully crafted for your natural beauty routine.`}
            </CardDescription>
          </div>

          <div className="flex flex-wrap gap-2 pt-2">
            {category.subcategories.slice(0, 3).map((sub: string, subIndex: number) => (
              <Badge 
                key={subIndex}
                variant="secondary"
                className="bg-stone-50 text-stone-600 border-stone-100 hover:bg-emerald-50 hover:text-emerald-700 transition-colors px-3 py-1 rounded-lg text-[10px] font-bold uppercase tracking-wider"
              >
                {sub}
              </Badge>
            ))}
          </div>

          <div className="pt-6 mt-auto border-t border-stone-50 flex items-center justify-between">
            <span className="text-sm font-medium text-stone-900 group-hover:text-emerald-700 transition-colors flex items-center gap-2">
              Explore Collection
              <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
            </span>
          </div>
        </CardHeader>
      </Link>
    </Card>
  )
}

export default function CategoriesPage() {
  const [categories, setCategories] = useState<Category[]>([])
  const [isLoading, setIsLoading] = useState(true)

  const categoryImages: Record<string, string> = {
    "Sedoso": getImageUrl("1758704519280-0.webp"),
    "Dr Mehos": getImageUrl("1758704507883-png.webp"),
    "Saa": getImageUrl("1758704514259-saa__1_.webp"),
  }

  useEffect(() => {
    const fetchData = async () => {
      try {
        const allProducts = await getProducts()
        
        const generatedCategories = allProducts.reduce((acc, product) => {
          let categoryEntry = acc.find(cat => cat.name === product.brand)

          if (!categoryEntry) {
            categoryEntry = {
              name: product.brand,
              description: "", 
              productCount: 0,
              subcategories: [],
              image: product.image,
              href: `/categories/${product.brand}`
            }
            acc.push(categoryEntry)
          }
          categoryEntry.productCount += 1
          if (product.category && !categoryEntry.subcategories.includes(product.category)) {
            categoryEntry.subcategories.push(product.category)
          }
          return acc
        }, [] as Category[])

        setCategories(generatedCategories)
      } catch (error) {
        console.error('Error fetching products:', error)
      } finally {
        setIsLoading(false)
      }
    }

    fetchData()
  }, [])

  if (isLoading) {
    return (
      <div className="min-h-screen bg-[#FDFCFB] py-20">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16 space-y-4">
            <Skeleton className="h-12 w-64 mx-auto rounded-full" />
            <Skeleton className="h-6 w-96 mx-auto rounded-full" />
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-12">
            {Array.from({ length: 3 }).map((_, i) => (
              <CategoryCardSkeleton key={i} />
            ))}
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-[#FDFCFB]">
      <section className="py-20 px-4">
        <div className="container mx-auto">
          <div className="text-center mb-16 space-y-4">
            <h2 className="text-emerald-700 font-bold tracking-[0.2em] uppercase text-sm">Our Collections</h2>
            <h1 className="text-4xl md:text-6xl font-serif font-medium text-stone-900">
              Browse by Brand
            </h1>
            <p className="text-lg text-stone-500 font-light max-w-xl mx-auto">
              Discover our carefully curated selection of premium natural cosmetics, 
              handcrafted with pure ingredients for your beauty routine.
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-12">
            {categories.map((category, index) => (
              <CategoryCard 
                key={index}
                category={category}
                imageUrl={categoryImages[category.name] || category.image}
              />
            ))}
          </div>
        </div>
      </section>
    </div>    
  )
}
