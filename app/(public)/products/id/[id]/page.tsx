'use client'

import { useState, useEffect, useRef } from "react"
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

interface RGBColor {
  r: number
  g: number
  b: number
}

// Use the existing Product type but make all fields required with defaults
type ProductWithColor = {
  id: string
  name: string
  brand: string
  category: string
  subcategory: string
  description: string
  image: string
  sizes: string[]
  concerns: string[]
  dominantColor?: RGBColor
  textColorClass?: string
}

// --- The Main Page Component ---
export default function ProductDetailPage({ params }: Props) {
  const [product, setProduct] = useState<ProductWithColor | null>(null)
  const [allProducts, setAllProducts] = useState<ProductWithColor[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [bgColor, setBgColor] = useState("rgb(255, 255, 255)")
  const [textColor, setTextColor] = useState("text-gray-900")
  const [mutedTextColor, setMutedTextColor] = useState("text-gray-600")
  const colorThiefRef = useRef<any>(null)
  const mainImageRef = useRef<HTMLImageElement>(null)

  useEffect(() => {
    const loadData = async () => {
      try {
        const { id } = await params
        const [productData, allProductsData] = await Promise.all([
          getProductById(id),
          getAllProducts()
        ])

        if (!productData) {
          notFound()
          return
        }

        // Transform the product data to match ProductWithColor type with safe defaults
        const transformedProduct: ProductWithColor = {
          id: productData.id,
          name: productData.name || "Unnamed Product",
          brand: productData.brand || "Unknown Brand",
          category: productData.category || "Uncategorized",
          subcategory: productData.subcategory || "",
          description: productData.description || "",
          image: productData.image || "/placeholder.svg",
          sizes: productData.sizes || [],
          concerns: productData.concerns || [],
        }

        // Transform all products similarly
        const transformedAllProducts: ProductWithColor[] = allProductsData.map(p => ({
          id: p.id,
          name: p.name || "Unnamed Product",
          brand: p.brand || "Unknown Brand",
          category: p.category || "Uncategorized",
          subcategory: p.subcategory || "",
          description: p.description || "",
          image: p.image || "/placeholder.svg",
          sizes: p.sizes || [],
          concerns: p.concerns || [],
        }))

        setProduct(transformedProduct)
        setAllProducts(transformedAllProducts)
      } catch (error) {
        console.error('Error loading product data:', error)
      } finally {
        setIsLoading(false)
      }
    }

    loadData()
  }, [params])

  // Dynamically import ColorThief only on client side
  useEffect(() => {
    const loadColorThief = async () => {
      try {
        const ColorThief = (await import('colorthief')).default
        colorThiefRef.current = new ColorThief()
        
        // If main image is already loaded, extract color immediately
        if (mainImageRef.current?.complete) {
          extractColorFromImage(mainImageRef.current)
        }
      } catch (error) {
        console.warn('ColorThief failed to load, using fallback colors')
      }
    }
    loadColorThief()
  }, [])

  // Extract color from main product image
  const extractColorFromImage = (img: HTMLImageElement) => {
    if (!colorThiefRef.current) return

    try {
      const color = colorThiefRef.current.getColor(img) as [number, number, number]
      const dominantColor = {
        r: color[0],
        g: color[1],
        b: color[2]
      }

      // Calculate text color based on brightness
      const brightness = (dominantColor.r * 299 + dominantColor.g * 587 + dominantColor.b * 114) / 1000
      const newTextColor = brightness > 180 ? 'text-gray-900' : 'text-white'
      const newMutedTextColor = brightness > 180 ? 'text-gray-600' : 'text-gray-300'

      setBgColor(`rgb(${dominantColor.r}, ${dominantColor.g}, ${dominantColor.b})`)
      setTextColor(newTextColor)
      setMutedTextColor(newMutedTextColor)
    } catch (error) {
      console.warn('Failed to extract color from product image:', error)
    }
  }

  // Handle main product image load
  const handleMainImageLoad = (e: React.SyntheticEvent<HTMLImageElement>) => {
    const img = e.target as HTMLImageElement
    if (img.complete && colorThiefRef.current) {
      extractColorFromImage(img)
    }
  }

  // Custom ProductImageGallery that accepts onImageLoad prop
  const CustomProductImageGallery = ({ image, productName }: { image: string; productName: string }) => {
    return (
      <div className="space-y-4">
        <div className="relative aspect-square bg-gray-100 rounded-lg overflow-hidden">
          <Image
            ref={mainImageRef}
            src={image}
            alt={productName}
            fill
            className="object-contain"
            onLoad={handleMainImageLoad}
            crossOrigin="anonymous"
          />
        </div>
      </div>
    )
  }

  if (isLoading) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-xl font-semibold text-gray-600">Loading product...</h2>
        </div>
      </div>
    )
  }

  if (!product) {
    notFound()
  }

  // related products = same category as current product
  const relatedProducts = allProducts
    .filter((p) => p.category === product.category && p.id !== product.id)
    .slice(0, 4)

  return (
    <div 
      className="min-h-screen transition-all duration-1000"
      style={{ backgroundColor: bgColor }}
    >
      <main className="container mx-auto px-4 py-8">
        <Link 
          href="/products" 
          className={`inline-flex items-center mb-6 hover:opacity-80 transition-opacity ${
            textColor === 'text-white' ? 'text-gray-200' : 'text-green-600'
          }`}
        >
          <ChevronLeft className="w-4 h-4 mr-1" />
          Back to All Products
        </Link>

        <div className="grid lg:grid-cols-2 gap-12">
          {/* Use our custom image gallery that supports onImageLoad */}
          <CustomProductImageGallery
            image={product.image}
            productName={product.name}
          />

          <div className="space-y-6">
            <p className={`text-sm font-medium ${
              textColor === 'text-white' ? 'text-gray-300' : 'text-green-600'
            }`}>
              {product.brand}
            </p>
            <h1 className={`text-3xl md:text-4xl font-bold ${textColor}`}>
              {product.name}
            </h1>
            {product.subcategory && (
              <p className={`text-lg ${mutedTextColor}`}>
                {product.subcategory}
              </p>
            )}

            {product.sizes.length > 0 && (
              <div className="pt-4 border-t border-gray-300">
                <h3 className={`font-semibold mb-3 text-lg ${textColor}`}>Available In</h3>
                <div className="flex flex-wrap gap-2">
                  {product.sizes.map((size) => (
                    <Badge 
                      key={size} 
                      variant="outline" 
                      className={`text-base py-1 px-3 ${
                        textColor === 'text-white' 
                          ? 'border-gray-400 text-gray-200' 
                          : 'border-gray-300 text-gray-700'
                      }`}
                    >
                      {size}
                    </Badge>
                  ))}
                </div>
              </div>
            )}

            {product.description && (
              <div className="mt-6 pt-6 border-t border-gray-300">
                <h2 className={`text-lg font-bold ${textColor}`}>Description</h2>
                <div className={`prose prose-lg mt-4 ${mutedTextColor}`}>
                  {product.description}
                </div>
              </div>
            )}

            {product.concerns && product.concerns.length > 0 && (
              <div className="pt-4">
                <h3 className={`font-semibold mb-3 text-lg ${textColor}`}>Benefits</h3>
                <div className="flex flex-wrap gap-2">
                  {product.concerns.map((concern) => (
                    <Badge 
                      key={concern} 
                      variant="secondary" 
                      className={`text-base py-1 px-3 ${
                        textColor === 'text-white' 
                          ? 'bg-gray-600 text-white' 
                          : 'bg-gray-200 text-gray-700'
                      }`}
                    >
                      {concern}
                    </Badge>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>

        {/* --- Related Products Section --- */}
        {relatedProducts.length > 0 && (
          <div className="mt-16 pt-12 border-t border-gray-300">
            <h2 className={`text-2xl font-bold mb-8 ${textColor}`}>
              You Might Also Like
            </h2>
            
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
                      <Card className="group hover:shadow-lg transition-shadow h-full bg-white/90 backdrop-blur-sm">
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
                            <CardTitle className="text-base line-clamp-2 text-gray-900">{p.name}</CardTitle>
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
                  <Card key={p.id} className="group hover:shadow-lg transition-shadow bg-white/90 backdrop-blur-sm">
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
                        <CardTitle className="text-base line-clamp-2 text-gray-900">{p.name}</CardTitle>
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
