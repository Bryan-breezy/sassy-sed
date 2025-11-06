import { cookies } from 'next/headers'

type Product ={
  id: string
  name: string
  image: string
  brand: string
  category: string
  subcategory?: string
  sizes: string[]
  concerns: string[]
  featured?: boolean
}
export default async function getProduct(id: string): Promise<Product | null> {
  try {
    const baseUrl = process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'
    const res = await fetch(`${baseUrl}/api/products/${id}`, { next: { revalidate: 3600 } })
    if (!res.ok) return null
    return res.json()
  } catch (error) {
    console.error('Failed to fetch product:', error)
    return null
  }
}