import Link from "next/link"
import Image from "next/image"
import { 
  Card, 
  CardHeader, 
  CardTitle, 
  CardDescription, 
} from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { supabase } from '@/lib/supabase-client'
import { getAllProducts as getProducts } from '@/lib/data'

const bucketName = process.env.NEXT_PUBLIC_BUCKET_NAME || "uploads"

// Helper function to get image URL
const getImageUrl = (imagePath: string) => {
  const { data } = supabase.storage.from(bucketName).getPublicUrl(imagePath)
  return data.publicUrl
}

// --- The Main Page Component ---
export default async function CategoriesPage() {
  const allProducts = await getProducts()

  // --- Dynamic Category Generation Logic ---
  const categories = allProducts.reduce((acc, product) => {
    let categoryEntry = acc.find(cat => cat.name === product.brand)

    if (!categoryEntry) {
      categoryEntry = {
        name: product.brand,
        description: "", 
        productCount: 0,
        subcategories: new Set<string>(),
        image: product.image,
        href: `/categories/${product.brand}`
      }
      acc.push(categoryEntry)
    }
    categoryEntry.productCount += 1
    if (product.category) {
      categoryEntry.subcategories.add(product.category)
    }
    return acc
  }, [] as Array<{
    name: string;
    description: string;
    productCount: number;
    subcategories: Set<string>;
    image: string;
    href: string;
  }>).map(cat => ({
    ...cat,
    subcategories: Array.from(cat.subcategories)
  }))

  const categoryImages: Record<string, string> = {
    "Sedoso": getImageUrl("1758704519280-0.webp"),
    "Dr. Mehos": getImageUrl("1758704507883-png.webp"),
    "Saa": getImageUrl("1758704514259-saa__1_.webp"),
  }

  return (
    <div className="min-h-screen bg-white">

      {/* Categories Grid */}
      <section className="py-8 px-4 bg-white">
        <div className="container mx-auto">
<div className="text-center mb-8 lg:mb-10 px-4">
  <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold text-gray-900 mb-2 sm:mb-3">
    Our Product Categories
  </h1>
  <p className="text-base sm:text-lg text-gray-600 max-w-md mx-auto">
    Handcrafted with care, designed for you.
  </p>
</div>
          <div className="grid md:grid-cols-3 lg:grid-cols-3 gap-8">
            {categories.map((category, index) => (
              <Card 
                key={index} 
                className="group hover:shadow-xl transition-all duration-300 cursor-pointer" 
                style={{ backgroundColor: "#e6f9ee", borderColor: "#b3e6cc" }}
              >
                <Link href={category.href}>
                  <div className="relative overflow-hidden rounded-t-lg">
                    <Image
                      src={categoryImages[category.name] || category.image || "/placeholder.svg"}
                      alt={category.name}
                      width={800}
                      height={800}
                      className="w-full h-64 object-contain group-hover:scale-105 transition-transform duration-300"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-lime-700/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                    </div>
                  </div>

                    <CardHeader>
                      <div className="flex items-center justify-between mb-2">
                        <CardTitle className="text-xl group-hover:text-[#006d3c] transition-colors">
                          {category.name}
                        </CardTitle>

                        <Badge 
                          variant="secondary" 
                          className="text-xs"
                          style={{ backgroundColor: "#cceedd", color: "#006d3c", borderColor: "#b3e6cc" }}
                        >
                          {category.productCount} Products
                        </Badge>
                      </div>

                      <CardDescription className="mb-4" style={{ color: "#008000" }} >
                        <div className="flex flex-wrap gap-2"></div>
                            {category.description}
                      </CardDescription>

                      <div className="flex flex-wrap gap-2">
                        { category.subcategories.slice(0, 3).map(( sub, subIndex ) => (
                          <Badge 
                            key={subIndex}
                            variant="outline"
                            className="text-xs"
                            style={{ backgroundColor: "#008000", color: "#f6faf8ff" }}
                          >
                            {sub}
                          </Badge>
                        ))}
                        + {category.subcategories.length > 3 && (
                          <Badge 
                            variant="outline"
                            className="text-xs"
                            style={{ backgroundColor: "#008000", color: "#f1f5f3ff" }}
                          >
                            {category.subcategories.length - 3} more
                          </Badge>
                        )}
                      </div>
                    </CardHeader>
                  </Link>
              </Card>
            ))}
          </div>
        </div>
      </section>

    </div>    
  )
}
