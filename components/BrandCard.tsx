import Link from 'next/link'
import Image from 'next/image'
import { Card, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { BrandCategory } from '@/types'

interface BrandCardProps {
  brand: BrandCategory
  brandImages: Record<string, string>
}

export function BrandCard({ brand, brandImages }: BrandCardProps) {
  const imageSrc = brandImages[brand.name] || brand.image

  return (
    <Card className="group transition-all duration-300 cursor-pointer overflow-hidden rounded-lg shadow-lg hover:shadow-2xl hover:-translate-y-2 bg-white flex flex-col">
      <Link href={brand.href} className="flex flex-col h-full">
        <div className="relative w-full h-80 bg-gray-100 overflow-hidden">
          <Image
            src={imageSrc}
            alt={brand.name}
            fill
            style={{ objectFit: "contain" }}
            className="p-4 transition-transform duration-300 group-hover:scale-105"
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
          />
        </div>
        <CardHeader className="flex-grow p-6">
          <CardTitle className="text-2xl font-bold text-gray-900">
            {brand.name}
          </CardTitle>
          <CardDescription className="text-gray-600 mt-2">
            {brand.description}
          </CardDescription>
        </CardHeader>
      </Link>
    </Card>
  )
}
