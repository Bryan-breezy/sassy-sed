import Link from "next/link"
import { FullWidthProductGrid } from "@/components/ui/full-width-product-grid"
import { ChevronRight } from "lucide-react"

import { getFilteredProducts } from "@/lib/data"

interface BrandCategoryPageProps {
  params: Promise<{ brand: string; category: string }> 
}

// --- The Main Page Component ---
export default async function BrandCategoryPage({ params }: BrandCategoryPageProps) { 
  const { brand, category } = await params
  
  function capitalizeWords(text: string): string {
    return text
        .trim()
        .split(/[\s-]+/) // split on spaces AND hyphens
        .map(word => {
        if (word.length === 0) return word
        return word.charAt(0).toUpperCase() + word.slice(1).toLowerCase()
        })
        .join(" ")

  const brandName = capitalizeWords(brand)
  const categoryName = capitalizeWords(category)
  const products = await getFilteredProducts({ brand: brandName, category: categoryName })
  
  return (
    <div className="min-h-screen bg-gray-50">
      <main>
        <FullWidthProductGrid
          initialProducts={products}
          categoryName={`${brandName} - ${categoryName}`}
        />
      </main>
    </div>
  )
}
