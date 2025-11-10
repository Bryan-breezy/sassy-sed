'use client'

import Link from 'next/link'
import { Card, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { OurBrandsProps, BrandCategory } from '@/types'
import { supabase } from '@/lib/supabase-client'

const bucketName = process.env.NEXT_PUBLIC_BUCKET_NAME || "uploads"

// Helper function to get image URL
const getImageUrl = (imagePath: string) => {
  const { data } = supabase.storage.from(bucketName).getPublicUrl(imagePath)
  return data.publicUrl
}

const defaultBrands: BrandCategory[] = [
  {
    name: "Sedoso",
    image: getImageUrl("1758704519280-0.webp"),
    href: "/categories/sedoso",
    description: "Premium hair care for all hair types"
  },
  {
    name: "Dr Mehos",                                            
    image: getImageUrl("1758704507883-png.webp"),
    href: "/categories/Dr Mehos", 
    description: "Clinical skincare solutions"
  },
  {
    name: "Saa",
    image: getImageUrl("1758704514259-saa__1_.webp"),
    href: "/categories/saa",
    description: "Natural and organic beauty products"
  }
]

// BrandGrid component to handle the brand cards display
interface BrandGridProps {
  brands: BrandCategory[]
  cardBackgroundColor?: string
}

function BrandGrid({ brands, cardBackgroundColor = "bg-white" }: BrandGridProps) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
      {brands.map((brand, index) => (
        <Link key={index} href={brand.href} className="block group">
          <Card className={`h-full transition-all duration-300 hover:shadow-lg border-0 ${cardBackgroundColor} group-hover:scale-105`}>
            <div className="aspect-square relative overflow-hidden">
              <img 
                src={brand.image} 
                alt={brand.name}
                className="w-full h-full object-contain transition-transform duration-300 group-hover:scale-110"
                onError={(e) => {
                  // Fallback if image fails to load
                  const target = e.target as HTMLImageElement
                  target.src = '/images/placeholder-brand.jpg'
                }}
              />
            </div>
            <CardHeader className="p-6">
              <CardTitle className="text-xl font-bold text-gray-900 mb-2">
                {brand.name}
              </CardTitle>
              <CardDescription className="text-gray-600 text-base">
                {brand.description}
              </CardDescription>
            </CardHeader>
          </Card>
        </Link>
      ))}
    </div>
  )
}

export default function OurBrands({
  brands = defaultBrands,
  title = "Our Brands",
  description = "From skincare to hair care essentials, discover our complete range of skin-safe cosmetics.",
  backgroundColor = "bg-gray-50",
  showExploreButton = true,
  exploreButtonText = "Explore All Brands",
  exploreButtonHref = "/categories",
  cardBackgroundColor = "bg-white",
  buttonBackgroundColor = "bg-green-600",
  buttonTextColor = "text-white"
}: OurBrandsProps) {
  return (
    <section className={`py-20 px-4 ${backgroundColor}`}>
      <div className="container mx-auto max-w-6xl">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-extrabold text-gray-900 mb-6">
            {title}
          </h2>
          <p className="text-lg md:text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
            {description}
          </p>
        </div>

        <BrandGrid 
          brands={brands} 
          cardBackgroundColor={cardBackgroundColor}
        />

        {showExploreButton && (
          <div className="text-center mt-16">
            <Link
              href={exploreButtonHref}
              className={`inline-block py-4 px-10 text-lg font-semibold ${buttonTextColor} ${buttonBackgroundColor} rounded-full hover:opacity-90 transition-all duration-300 shadow-lg hover:shadow-xl transform hover:-translate-y-1`}
            >
              {exploreButtonText}
            </Link>
          </div>
        )}
      </div>
    </section>
  )
}
