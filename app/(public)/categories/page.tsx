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

// Client component for individual category card with color extraction
function CategoryCard({ 
  category, 
  imageUrl 
}: { 
  category: any
  imageUrl: string 
}) {
  const extractColorFromImage = async (img: HTMLImageElement) => {
    return new Promise<{ r: number; g: number; b: number }>((resolve) => {
      const canvas = document.createElement('canvas')
      const ctx = canvas.getContext('2d')
      if (!ctx) {
        resolve({ r: 230, g: 249, b: 238 }) // Fallback green
        return
      }

      canvas.width = img.naturalWidth
      canvas.height = img.naturalHeight
      ctx.drawImage(img, 0, 0)

      // Get image data and calculate average color
      const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height)
      const data = imageData.data

      let r = 0, g = 0, b = 0
      const pixelCount = data.length / 4

      for (let i = 0; i < data.length; i += 4) {
        r += data[i]
        g += data[i + 1]
        b += data[i + 2]
      }

      resolve({
        r: Math.round(r / pixelCount),
        g: Math.round(g / pixelCount),
        b: Math.round(b / pixelCount)
      })
    })
  }

  const handleImageLoad = async (e: React.SyntheticEvent<HTMLImageElement>) => {
    const img = e.target as HTMLImageElement
    try {
      const dominantColor = await extractColorFromImage(img)
      
      // Update the card's background color
      const card = img.closest('.category-card')
      if (card) {
        (card as HTMLElement).style.backgroundColor = `rgb(${dominantColor.r}, ${dominantColor.g}, ${dominantColor.b})`
        
        // Calculate text color based on brightness
        const brightness = (dominantColor.r * 299 + dominantColor.g * 587 + dominantColor.b * 114) / 1000
        const textColor: string = brightness > 180 ? '#1f2937' : '#ffffff'
        const mutedTextColor: string = brightness > 180 ? '#6b7280' : 'rgba(255,255,255,0.8)'
        const badgeBg: string = brightness > 180 ? 'rgba(0,0,0,0.1)' : 'rgba(255,255,255,0.2)'
        const badgeBorder: string = brightness > 180 ? 'rgba(0,0,0,0.2)' : 'rgba(255,255,255,0.3)'
        
        // Update text colors
        const title = card.querySelector('.category-title')
        const description = card.querySelector('.category-description')
        const badges = card.querySelectorAll('.category-badge')
        
        if (title) (title as HTMLElement).style.color = textColor
        if (description) (description as HTMLElement).style.color = mutedTextColor
        badges.forEach(badge => {
          const badgeElement = badge as HTMLElement
          badgeElement.style.backgroundColor = badgeBg
          badgeElement.style.color = textColor
          badgeElement.style.borderColor = badgeBorder
        })
      }
    } catch (error) {
      console.warn('Failed to extract color for category:', category.name, error)
    }
  }

  return (
    <Card 
      className="category-card group hover:shadow-xl transition-all duration-300 cursor-pointer border-0"
      style={{ backgroundColor: "#e6f9ee" }} // Initial fallback color
    >
      <Link href={category.href}>
        <div className="relative overflow-hidden rounded-t-lg">
          <Image
            src={imageUrl || category.image || "/placeholder.svg"}
            alt={category.name}
            width={800}
            height={800}
            className="w-full h-64 object-contain group-hover:scale-105 transition-transform duration-300"
            onLoad={handleImageLoad}
            crossOrigin="anonymous"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
        </div>

        <CardHeader>
          <div className="flex items-center justify-between mb-2">
            <CardTitle 
              className="category-title text-xl group-hover:opacity-80 transition-colors"
              style={{ color: '#1f2937' }} // Initial fallback
            >
              {category.name}
            </CardTitle>

            <Badge 
              variant="secondary" 
              className="category-badge text-xs"
              style={{ 
                backgroundColor: 'rgba(0,0,0,0.1)', 
                color: '#1f2937',
                borderColor: 'rgba(0,0,0,0.2)'
              }}
            >
              {category.productCount} Products
            </Badge>
          </div>

          <CardDescription 
            className="category-description mb-4"
            style={{ color: '#008000' }} // Initial fallback
          >
            {category.description}
          </CardDescription>

          <div className="flex flex-wrap gap-2">
            {category.subcategories.slice(0, 3).map((sub: string, subIndex: number) => (
              <Badge 
                key={subIndex}
                variant="outline"
                className="category-badge text-xs"
                style={{ 
                  backgroundColor: 'rgba(0,128,0,0.8)', 
                  color: '#f6faf8',
                  borderColor: 'rgba(0,128,0,0.9)'
                }}
              >
                {sub}
              </Badge>
            ))}
            {category.subcategories.length > 3 && (
              <Badge 
                variant="outline"
                className="category-badge text-xs"
                style={{ 
                  backgroundColor: 'rgba(0,128,0,0.8)', 
                  color: '#f1f5f3',
                  borderColor: 'rgba(0,128,0,0.9)'
                }}
              >
                +{category.subcategories.length - 3} more
              </Badge>
            )}
          </div>
        </CardHeader>
      </Link>
    </Card>
  )
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
    "Dr Mehos": getImageUrl("1758704507883-png.webp"),
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
