import Link from "next/link"
import { FullWidthProductGrid } from "@/components/ui/full-width-product-grid"
import { ChevronRight } from "lucide-react"

import { getFilteredProducts } from "@/lib/data"

// FIX 1: Correct the interface to expect a plain object, not a Promise.
interface BrandCategoryPageProps {
  params: { brand: string; category: string } 
}

// --- The Main Page Component ---
// FIX 2: Destructure params directly without awaiting.
export default async function BrandCategoryPage({ params }: BrandCategoryPageProps) { 
  const { brand, category } = params
  
  function capitalizeWords(text: string): string {
    return text
      .trim()
      .split(/\s+/) // split on any space
      .map(word => {
        if (word.length === 0) return word
        return word.charAt(0).toUpperCase() + word.slice(1).toLowerCase()
      })
      .join(" ")
  }

  const brandName = capitalizeWords(brand)
  const categoryName = capitalizeWords(category)
  const products = await getFilteredProducts({ brand: brandName, category: categoryName })
  
  return (
    <div className="min-h-screen bg-gray-50">
      <main>
        {/* Breadcrumb Navigation */}
        <div className="bg-white border-b">
          <div className="container mx-auto px-4 py-3">
            <nav className="text-sm text-gray-600 flex items-center space-x-2 flex-wrap">
              <Link href="/" className="hover:text-green-600">Home</Link>
              <ChevronRight className="h-4 w-4 text-gray-400" />
              <Link href="/products" className="hover:text-green-600">Products</Link>
              <ChevronRight className="h-4 w-4 text-gray-400" />
              {/* FIX 3: Link uses the raw slug parameter 'brand' */}
              <Link href={`/categories/${brand}`} className="hover:text-green-600">{brandName}</Link>
              <ChevronRight className="h-4 w-4 text-gray-400" />
              <span className="text-gray-900 font-medium">{categoryName}</span>
            </nav>
          </div>
        </div>
        <FullWidthProductGrid
          initialProducts={products}
          categoryName={`${brandName} - ${categoryName}`}
        />
      </main>
    </div>
  )
}