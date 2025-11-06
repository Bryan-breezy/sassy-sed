'use client'

import { useState, useEffect } from 'react'
import Link from "next/link"
import Image from "next/image"

import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { ProductActions } from "@/components/admin/product-actions"
import { Plus, Search } from "lucide-react"
import { Product, CurrentUser } from '@/types'

export default function ProductsPage(){
  const [Products, setProducts ] = useState<Product[]>([])
  const [loading, setLoading] = useState<boolean>(true)
  const [searchTerm, setSearchTerm] = useState<string>('')
  const [currentUser, setCurrentUser] = useState<CurrentUser | null>(null)

  useEffect(() => {
    const fetchProducts = async () => {
      setLoading(true)

      try {
        const query = new URLSearchParams({ search: searchTerm })
        const response = await fetch(`/api/products?${query.toString()}`, { cache: 'no-store' })

        if (response.ok) {
          const data = await response.json()
          setProducts(data)
        } else {
          console.error('Failed to fetch products')
          setProducts([])
        }
      } catch (error) {
        console.error('Error fetching products:', error)
        setProducts([])
      } finally {
        setLoading(false)
      }
    }

    const debounceTimer = setTimeout(() => {
      fetchProducts()
    }, 300) 

    return () => clearTimeout(debounceTimer)

  }, [searchTerm])

  useEffect(() => {
    const fetchSession = async () => {
      const sessionRes = await fetch('/api/auth/me')

      if (sessionRes.ok) {
        const data = await sessionRes.json()
        setCurrentUser(data.user)
      }
    }
    fetchSession()
  }, [])
  console.log("current user in products page:", currentUser)

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl lg:text-3xl font-bold">Products</h1>
        </div>
            { currentUser?.role === 'ADMIN' && 
                <Button asChild>
                  <Link href="/admin/products/new">
                    <Plus className="h-4 w-4 mr-2" />
                    Add Product
                  </Link>
                </Button>
            } 
          </div>

        <Card>
          <CardContent className="p-4">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                <Input 
                  placeholder="Search by name, brand, category..."
                  className="pl-10"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
            </div>
          </CardContent>
        </Card>

          {loading ? (
            <p>Loading products...</p>
          ) : (
            <div className="space-y-4">
              {Products.length > 0 ? (
                Products.map((product) => (
                  <Card key={product.id}>
                    <CardContent className="p-4">
                      <div className="flex items-center gap-4">
                        <Image 
                          src= {product.image || "/placeholder.svg"} 
                          alt={product.name} 
                          width={60} 
                          height={60} 
                          className="object-cover rounded-lg" 
                        />

                        <div className='flex-1'>
                          <h3 className="font-semibold">{product.name}</h3>
                          <p className="text-sm text-gray-500">
                            {product.category} - {product.subcategory}
                          </p>
                        </div>

                        <ProductActions 
                          productId={product.id}
                          currentUser={currentUser} 
                        />
                      </div>
                    </CardContent>
                  </Card>
                ))
              ) :  (
                <p>No products found.</p>
              )}
            </div>
          )}
    </div>
    )
  }

            