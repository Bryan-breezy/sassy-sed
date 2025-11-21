import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Product } from '@/types'
import { ProductGrid } from '@/components/ProductGrid'
import { ProductHero } from '@/components/ProductHero'
import getAllProducts from "@/lib/getAllProducts"
import { ArrowRight } from 'lucide-react'

export default async function FeaturedProducts() {
  let featuredProducts: Product[] = []
  let allProducts: Product[] = []

  try {
    const productsData = await getAllProducts()
    
    if (!Array.isArray(productsData)) {
      console.error("getAllProducts() did not return an array:", productsData)
      featuredProducts = []
      allProducts = []
    } else {
      allProducts = productsData
      featuredProducts = allProducts.filter(p => p.featured).slice(0, 4)
    }
  } catch (err) {
    console.error("Error fetching products:", err)
    featuredProducts = []
    allProducts = []
  }

  const heroProducts = allProducts.filter(p => p.featured).slice(0, 4)

  return (
    <div className="min-h-screen bg-gradient-to-b from-white to-gray-50/30">
      
      {/* Auto-switching Product Hero Section */}
      {heroProducts.length > 0 && (
        <ProductHero 
          products={heroProducts}
          title="Featured"
          autoSwitchInterval={5000}
        />
      )}

      {/* Featured Products Section */}
      <section className="py-16 lg:py-24 bg-white">
        <div className="container mx-auto px-4 max-w-7xl">
          {/* Section Header */}
          <div className="text-center mb-12 lg:mb-16 px-4">
            <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold text-gray-900 mb-3 sm:mb-4">
              Featured{' '}
              <span className="bg-gradient-to-r from-green-600 to-emerald-600 bg-clip-text text-transparent">
                Products
              </span>
            </h2>
            <p className="text-base sm:text-lg text-gray-600 max-w-xl mx-auto leading-relaxed">
              Handpicked favorites that our customers love.
            </p>
          </div>

          {/* Product Grid */}
          <div className="mb-16">
            <ProductGrid featuredProducts={featuredProducts} />
          </div>

          {/* CTA Section */}
          <div className="text-center">
            <div className="bg-gradient-to-r from-gray-50 to-white rounded-3xl p-8 lg:p-12 border border-gray-100 shadow-sm max-w-4xl mx-auto">
              <h3 className="text-2xl lg:text-3xl font-bold text-gray-900 mb-4">
                Ready to Explore More?
              </h3>
              <p className="text-gray-600 mb-8 max-w-2xl mx-auto text-lg">
                Discover our complete collection of premium products designed to elevate your experience.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
                <Button 
                  asChild 
                  size="lg"
                  className="bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 text-white px-8 py-3 text-base font-semibold rounded-full shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105"
                >
                  <Link href="/products" className="flex items-center gap-2">
                    Explore All Products
                    <ArrowRight className="w-5 h-5" />
                  </Link>
                </Button>
                
                <Button 
                  asChild 
                  variant="outline"
                  size="lg"
                  className="border-2 border-gray-300 text-gray-700 hover:bg-gray-50 hover:border-gray-400 px-8 py-3 text-base font-medium rounded-full transition-all duration-300"
                >
                  <Link href="/categories">
                    Browse Categories
                  </Link>
                </Button>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}
