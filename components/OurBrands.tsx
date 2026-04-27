'use client'

import Link from 'next/link'
import Image from 'next/image'
import { ArrowRight } from 'lucide-react'
import { supabase } from '@/lib/supabase-client'
import { Playfair_Display } from 'next/font/google'

const playfair = Playfair_Display({
  subsets: ['latin'],
  weight: ['400', '500', '600'],
  display: 'swap',
})

const bucketName = process.env.NEXT_PUBLIC_BUCKET_NAME || 'uploads'

const getImageUrl = (imagePath: string) => {
  const { data } = supabase.storage.from(bucketName).getPublicUrl(imagePath)
  return data.publicUrl
}

interface BrandCategory {
  name: string
  image: string
  href: string
  description: string
}

interface OurBrandsProps {
  brands?: BrandCategory[]
  title?: string
  description?: string
  showExploreButton?: boolean
  exploreButtonText?: string
  exploreButtonHref?: string
}

const defaultBrands: BrandCategory[] = [
  {
    name: 'Sedoso',
    image: getImageUrl('1758704519280-0.webp'),
    href: '/categories/sedoso',
    description: 'Premium hair care for all hair types',
  },
  {
    name: 'Dr Mehos',
    image: getImageUrl('1758704507883-png.webp'),
    href: '/categories/Dr Mehos',
    description: 'Clinical skincare solutions',
  },
  {
    name: 'Saa',
    image: getImageUrl('1758704514259-saa__1_.webp'),
    href: '/categories/saa',
    description: 'Natural and organic beauty products',
  },
]

export default function OurBrandsSection({
  brands = defaultBrands,
  title = 'Our Brands',
  description = 'From skincare to hair care essentials, discover our complete range of skin-safe cosmetics.',
  showExploreButton = true,
  exploreButtonText = 'Explore All Brands',
  exploreButtonHref = '/categories',
}: OurBrandsProps) {
  return (
    <section className="bg-[#F5F2ED] py-20 lg:py-28 px-5 sm:px-8">
      <div className="mx-auto max-w-7xl">

        {/* ── Section header ── */}
        <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-6 mb-14">
          <div>
            <div className="flex items-center gap-3 mb-4">
              <span className="inline-block w-5 h-[1.5px] bg-emerald-700" />
              <p className="text-[10px] font-semibold tracking-[0.22em] text-emerald-700 uppercase">
                Our Portfolio
              </p>
            </div>
            <h2 className={`${playfair.className} text-4xl sm:text-5xl font-medium text-stone-900 leading-[1.05]`}>
              {title}
            </h2>
          </div>

          {/* Desktop inline CTA */}
          {showExploreButton && (
            <Link
              href={exploreButtonHref}
              className="hidden sm:flex items-center gap-2 text-sm font-medium text-stone-500 hover:text-emerald-700 transition-colors duration-200 group pb-1"
            >
              {exploreButtonText}
              <ArrowRight className="w-3.5 h-3.5 transition-transform duration-200 group-hover:translate-x-0.5" />
            </Link>
          )}
        </div>

        {/* ── Description ── */}
        <p className="text-stone-500 text-base leading-relaxed max-w-lg mb-12">
          {description}
        </p>

        {/* ── Brand cards ── */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
          {brands.map((brand, i) => (
            <BrandCard key={brand.name} brand={brand} index={i} playfairClass={playfair.className} />
          ))}
        </div>

        {/* ── Mobile CTA ── */}
        {showExploreButton && (
          <div className="sm:hidden mt-10 text-center">
            <Link
              href={exploreButtonHref}
              className="inline-flex items-center gap-2.5 px-7 py-3.5 rounded-full text-sm font-semibold text-white bg-stone-900 hover:bg-emerald-900 transition-colors duration-300 shadow-lg shadow-stone-900/10"
            >
              {exploreButtonText}
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>
        )}

      </div>
    </section>
  )
}

function BrandCard({
  brand,
  index,
  playfairClass,
}: {
  brand: BrandCategory
  index: number
  playfairClass: string
}) {
  const delays = ['0ms', '80ms', '160ms']

  return (
    <Link
      href={brand.href}
      className="group block"
      style={{ animationDelay: delays[index] }}
    >
      <div className="rounded-2xl overflow-hidden border border-stone-200/80 bg-stone-50 hover:border-emerald-200 hover:shadow-xl hover:shadow-stone-200/60 transition-all duration-500">

        {/* Image */}
        <div className="relative aspect-square overflow-hidden bg-stone-100">
          <Image
            src={brand.image}
            alt={brand.name}
            fill
            className="object-contain p-6 transition-transform duration-700 ease-out group-hover:scale-105"
            onError={(e) => {
              const t = e.target as HTMLImageElement
              t.src = '/images/placeholder-brand.jpg'
            }}
          />
          {/* Subtle overlay on hover */}
          <div className="absolute inset-0 bg-emerald-900/0 group-hover:bg-emerald-900/5 transition-colors duration-500" />
        </div>

        {/* Card body */}
        <div className="p-5 border-t border-stone-200/80 group-hover:border-emerald-100 transition-colors duration-300">
          <div className="flex items-start justify-between gap-2">
            <div>
              <h3 className={`${playfairClass} text-lg font-medium text-stone-900 mb-1`}>
                {brand.name}
              </h3>
              <p className="text-stone-500 text-xs leading-relaxed">
                {brand.description}
              </p>
            </div>
            {/* Arrow — slides in on hover */}
            <div className="shrink-0 mt-0.5 w-6 h-6 rounded-full border border-stone-200 flex items-center justify-center group-hover:border-emerald-400 group-hover:bg-emerald-50 transition-all duration-300">
              <ArrowRight className="w-3 h-3 text-stone-400 group-hover:text-emerald-600 transition-colors duration-300" />
            </div>
          </div>
        </div>

      </div>
    </Link>
  )
}'use client'

import Link from 'next/link'
import Image from 'next/image'
import { ArrowRight } from 'lucide-react'
import { supabase } from '@/lib/supabase-client'
import { Playfair_Display } from 'next/font/google'

// ─────────────────────────────────────────────────────────────────────────────
// FIXES:
// 1. Removed all prop-driven colour overrides — design system colours hardcoded.
// 2. Replaced <img> with Next.js <Image> for optimisation & lazy loading.
// 3. Removed double-scale bug — card had group-hover:scale-105 AND inner image
//    had group-hover:scale-110, causing a jarring double zoom. Removed card scale,
//    kept subtle image scale only.
// 4. Removed border-0 Card override — replaced with clean custom card markup,
//    no shadcn Card dependency needed here.
// 5. Prop-explosion removed — buttonBackgroundColor, buttonTextColor,
//    cardBackgroundColor etc. stripped out. One consistent style.
// 6. Font loaded via next/font instead of styled-jsx (Server Component safe).
// 7. Layout: asymmetric header (title left, CTA right) matching FeaturedProducts.
// ─────────────────────────────────────────────────────────────────────────────

const playfair = Playfair_Display({
  subsets: ['latin'],
  weight: ['400', '500', '600'],
  display: 'swap',
})

const bucketName = process.env.NEXT_PUBLIC_BUCKET_NAME || 'uploads'

const getImageUrl = (imagePath: string) => {
  const { data } = supabase.storage.from(bucketName).getPublicUrl(imagePath)
  return data.publicUrl
}

interface BrandCategory {
  name: string
  image: string
  href: string
  description: string
}

interface OurBrandsProps {
  brands?: BrandCategory[]
  title?: string
  description?: string
  showExploreButton?: boolean
  exploreButtonText?: string
  exploreButtonHref?: string
}

const defaultBrands: BrandCategory[] = [
  {
    name: 'Sedoso',
    image: getImageUrl('1758704519280-0.webp'),
    href: '/categories/sedoso',
    description: 'Premium hair care for all hair types',
  },
  {
    name: 'Dr Mehos',
    image: getImageUrl('1758704507883-png.webp'),
    href: '/categories/Dr Mehos',
    description: 'Clinical skincare solutions',
  },
  {
    name: 'Saa',
    image: getImageUrl('1758704514259-saa__1_.webp'),
    href: '/categories/saa',
    description: 'Natural and organic beauty products',
  },
]

export default function OurBrandsSection({
  brands = defaultBrands,
  title = 'Our Brands',
  description = 'From skincare to hair care essentials, discover our complete range of skin-safe cosmetics.',
  showExploreButton = true,
  exploreButtonText = 'Explore All Brands',
  exploreButtonHref = '/categories',
}: OurBrandsProps) {
  return (
    <section className="bg-[#F5F2ED] py-20 lg:py-28 px-5 sm:px-8">
      <div className="mx-auto max-w-7xl">

        {/* ── Section header ── */}
        <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-6 mb-14">
          <div>
            <div className="flex items-center gap-3 mb-4">
              <span className="inline-block w-5 h-[1.5px] bg-emerald-700" />
              <p className="text-[10px] font-semibold tracking-[0.22em] text-emerald-700 uppercase">
                Our Portfolio
              </p>
            </div>
            <h2 className={`${playfair.className} text-4xl sm:text-5xl font-medium text-stone-900 leading-[1.05]`}>
              {title}
            </h2>
          </div>

          {/* Desktop inline CTA */}
          {showExploreButton && (
            <Link
              href={exploreButtonHref}
              className="hidden sm:flex items-center gap-2 text-sm font-medium text-stone-500 hover:text-emerald-700 transition-colors duration-200 group pb-1"
            >
              {exploreButtonText}
              <ArrowRight className="w-3.5 h-3.5 transition-transform duration-200 group-hover:translate-x-0.5" />
            </Link>
          )}
        </div>

        {/* ── Description ── */}
        <p className="text-stone-500 text-base leading-relaxed max-w-lg mb-12">
          {description}
        </p>

        {/* ── Brand cards ── */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
          {brands.map((brand, i) => (
            <BrandCard key={brand.name} brand={brand} index={i} playfairClass={playfair.className} />
          ))}
        </div>

        {/* ── Mobile CTA ── */}
        {showExploreButton && (
          <div className="sm:hidden mt-10 text-center">
            <Link
              href={exploreButtonHref}
              className="inline-flex items-center gap-2.5 px-7 py-3.5 rounded-full text-sm font-semibold text-white bg-stone-900 hover:bg-emerald-900 transition-colors duration-300 shadow-lg shadow-stone-900/10"
            >
              {exploreButtonText}
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>
        )}

      </div>
    </section>
  )
}

function BrandCard({
  brand,
  index,
  playfairClass,
}: {
  brand: BrandCategory
  index: number
  playfairClass: string
}) {
  const delays = ['0ms', '80ms', '160ms']

  return (
    <Link
      href={brand.href}
      className="group block"
      style={{ animationDelay: delays[index] }}
    >
      <div className="rounded-2xl overflow-hidden border border-stone-200/80 bg-stone-50 hover:border-emerald-200 hover:shadow-xl hover:shadow-stone-200/60 transition-all duration-500">

        {/* Image */}
        <div className="relative aspect-square overflow-hidden bg-stone-100">
          <Image
            src={brand.image}
            alt={brand.name}
            fill
            className="object-contain p-6 transition-transform duration-700 ease-out group-hover:scale-105"
            onError={(e) => {
              const t = e.target as HTMLImageElement
              t.src = '/images/placeholder-brand.jpg'
            }}
          />
          {/* Subtle overlay on hover */}
          <div className="absolute inset-0 bg-emerald-900/0 group-hover:bg-emerald-900/5 transition-colors duration-500" />
        </div>

        {/* Card body */}
        <div className="p-5 border-t border-stone-200/80 group-hover:border-emerald-100 transition-colors duration-300">
          <div className="flex items-start justify-between gap-2">
            <div>
              <h3 className={`${playfairClass} text-lg font-medium text-stone-900 mb-1`}>
                {brand.name}
              </h3>
              <p className="text-stone-500 text-xs leading-relaxed">
                {brand.description}
              </p>
            </div>
            {/* Arrow — slides in on hover */}
            <div className="shrink-0 mt-0.5 w-6 h-6 rounded-full border border-stone-200 flex items-center justify-center group-hover:border-emerald-400 group-hover:bg-emerald-50 transition-all duration-300">
              <ArrowRight className="w-3 h-3 text-stone-400 group-hover:text-emerald-600 transition-colors duration-300" />
            </div>
          </div>
        </div>

      </div>
    </Link>
  )
}
