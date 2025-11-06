import Link from "next/link"
import Image from "next/image"
import { notFound } from "next/navigation"

import { getProductById, getAllProducts } from "@/lib/data"

import { BackToTopButton } from "@/components/ui/back-to-top-button"
import { ProductImageGallery } from "@/components/product-image-gallery"

import { Card, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { ChevronLeft } from "lucide-react"

interface Props {
  params: Promise<{id: string}>
}

// --- The Main Page Component ---
export default async function ProductDetailPage({ params }: Props) {
  const { id } = await params
  const [product, allProducts] = await Promise.all([
    getProductById(id),
    getAllProducts()
  ])

  if (!product) {
    notFound()
  }

  // related products = same category as current product
  const relatedProducts = allProducts
    .filter((p) => p.category === product.category && p.id !== product.id)
    .slice(0, 4)

  return (
    <div className="min-h-screen bg-white">
      <main className="container mx-auto px-4 py-8">
        <Link href="/products" className="inline-flex items-center text-green-600 hover:text-green-700 mb-6">
          <ChevronLeft className="w-4 h-4 mr-1" />
          Back to All Products
        </Link>

        <div className="grid lg:grid-cols-2 gap-12">
          <ProductImageGallery
            image={product.image}
            productName={product.name}
          />

          <div className="space-y-6">
            <p className="text-sm font-medium text-green-600">{product.brand}</p>
            <h1 className="text-3xl md:text-4xl font-bold text-gray-900">{product.name}</h1>
            {product.subcategory && (
              <p className="text-lg text-gray-600">{product.subcategory}</p>
            )}

            <div className="pt-4 border-t">
              <h3 className="font-semibold mb-3 text-lg">Available In</h3>
              <div className="flex flex-wrap gap-2">
                {product.sizes.map((size) => (
                  <Badge key={size} variant="outline" className="text-base py-1 px-3">
                    {size}
                  </Badge>
                ))}
              </div>
            </div>

            {product.description && (
              <div className="mt-6 pt-6 border-t">
                <h2 className="text-lg font-bold text-gray-900">Description</h2>
                <div className="prose prose-lg text-gray-700 mt-4">
                  {product.description}
                </div>
              </div>
            )}

             {/* <div className="pt-4">
              <h3 className="font-semibold mb-3 text-lg">Benefits</h3>
              <div className="flex flex-wrap gap-2">
                {product.concerns.map((concern) => (
                  <Badge key={concern} variant="secondary" className="text-base py-1 px-3">
                    {concern}
                  </Badge>
                ))}
              </div>
            </div> */}
          </div>
        </div>

        {/* --- Related Products Section --- */}
{relatedProducts.length > 0 && (
  <div className="mt-16 pt-12 border-t">
    <h2 className="text-2xl font-bold text-gray-900 mb-8">You Might Also Like</h2>
    
    {/* Mobile Slider / Desktop Grid */}
    <div className="relative">
      {/* Mobile Slider */}
      <div className="lg:hidden">
        <div className="flex overflow-x-auto pb-4 -mx-4 px-4 snap-x snap-mandatory scrollbar-hide">
          {relatedProducts.map((p) => (
            <div 
              key={p.id} 
              className="flex-none w-[280px] sm:w-[300px] mr-6 snap-start last:mr-0"
            >
              <Card className="group hover:shadow-lg transition-shadow h-full">
                <Link href={`/products/id/${p.id}`}>
                  <div className="relative aspect-square bg-gray-100 rounded-t-lg overflow-hidden">
                    <Image 
                      src={p.image || "/placeholder.svg"} 
                      alt={p.name} 
                      fill 
                      className="object-contain p-4 group-hover:scale-105 transition-transform" 
                    />
                  </div>
                  <CardHeader className="p-4">
                    <p className="text-sm text-green-600 font-medium">{p.brand}</p>
                    <CardTitle className="text-base line-clamp-2">{p.name}</CardTitle>
                  </CardHeader>
                </Link>
              </Card>
            </div>
          ))}
        </div>
      </div>

      {/* Desktop Grid */}
      <div className="hidden lg:grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {relatedProducts.map((p) => (
          <Card key={p.id} className="group hover:shadow-lg transition-shadow">
            <Link href={`/products/id/${p.id}`}>
              <div className="relative aspect-square bg-gray-100 rounded-t-lg overflow-hidden">
                <Image 
                  src={p.image || "/placeholder.svg"} 
                  alt={p.name} 
                  fill 
                  className="object-contain p-4 group-hover:scale-105 transition-transform" 
                />
              </div>
              <CardHeader className="p-4">
                <p className="text-sm text-green-600 font-medium">{p.brand}</p>
                <CardTitle className="text-base line-clamp-2">{p.name}</CardTitle>
              </CardHeader>
            </Link>
          </Card>
        ))}
      </div>
    </div>
  </div>
)}
      </main>
      
      <BackToTopButton />
    </div>
  )
}
