import { BrandCategory } from '@/types'
import { BrandCard } from '@/components/BrandCard'

interface BrandGridProps {
  brands: BrandCategory[]
  brandImages: Record<string, string>
}

export function BrandGrid({ brands, brandImages }: BrandGridProps) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-8">
      {brands.map(brand => (
        <BrandCard key={brand.name} brand={brand} brandImages={brandImages} />
      ))}
    </div>
  )
}
