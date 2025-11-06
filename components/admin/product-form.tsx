"use client"

import { useState, FormEvent } from 'react'
import { useRouter } from 'next/navigation'
import Image from 'next/image'

import { MediaPickerModel } from "@/components/admin/media-pickler-modal"

// UI Components
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Checkbox } from '@/components/ui/checkbox'
import { Loader2 } from 'lucide-react'
import { Product } from '@/types'

interface ProductFormProps {
  product: Product | null
}

export function ProductForm({ product }: ProductFormProps) {
  const router = useRouter();
  const isEditMode = !!product?.id

  const [formData, setFormData] = useState({
    name: product?.name || "",
    brand: product?.brand || "",
    category: product?.category || "",
    subcategory: product?.subcategory || "",
    image: product?.image || "",
    sizes: (product?.sizes || []).join(', '),
    concerns: (product?.concerns || []).join(', '),
    description: product?.description || "",
    featured: product?.featured || false,
  })
  
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }))
  }

  const handleImageSelect = (url: string) => {
    setFormData(prev => ({ ...prev, image: url }))
  }

  const handleFeaturedChange = (checked: boolean | 'indeterminate') => {
    setFormData(prev => ({...prev, featured:checked === true}))
  }

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    setError(null)

    // Convert comma-separated strings back into arrays for the API
    const payload = {
      ...formData,
      sizes: formData.sizes.split(',').map(s => s.trim()).filter(Boolean),
      concerns: formData.concerns.split(',').map(c => c.trim()).filter(Boolean),
      featured: formData.featured
    }

    const endpoint = isEditMode ? `/api/products/${product.id}` : '/api/products'
    const method = isEditMode ? 'PATCH' : 'POST'

    try {
      const response = await fetch(endpoint, { 
        cache: "no-store",
        method: method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      })

      if (response.ok) {
        router.push('/admin/products')
        router.refresh()
      } else {
        const data = await response.json()
        setError(data.error || 'An error occurred.')
      }
    } catch (err) {
      setError('An unexpected error occurred.')
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <>
      <MediaPickerModel
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSelect={handleImageSelect}
      />

      <Card>
        <CardHeader>
          <CardTitle>{isEditMode ? `Updating ${product.name}` : 'New Product Details'}</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="name">Product Name</Label>
                <Input 
                  id="name" 
                  name="name" 
                  value={formData.name} 
                  onChange={handleChange} 
                  required 
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="brand">Brand</Label>
                <Input 
                  id="brand" 
                  name="brand" 
                  value={formData.brand} 
                  placeholder='Sedoso, Saa, Dr. Mehos'
                  onChange={handleChange} 
                  required 
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="category">Category</Label>
                <Input 
                  id="category" 
                  name="category" 
                  value={formData.category} 
                  onChange={handleChange} 
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="subcategory">Sub-Category</Label>
                <Input 
                  id="subcategory" 
                  name="subcategory" 
                  value={formData.subcategory} 
                  onChange={handleChange} 
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="description">Product Description</Label>
                <Textarea
                  id="description"
                  name="description"
                  value={formData.description}
                  onChange={(e) => setFormData(prev => ({...prev, description: e.target.value}))}
                  placeholder='Brief product description of the product...'
                  rows={8}
                />
              </div>
            </div>
            
            <div className="space-y-2">
              <Label>Image</Label>
              <div className="flex items-center gap-4 p-4 border rounded-md">
                <div className="relative w-24 h-24 border rounded-md overflow-hidden bg-gray-50 flex-shrink-0">
                  {formData.image ? (
                    <Image src={formData.image} alt="Main image preview" fill className="object-cover" />
                  ) : (
                    <div className="flex items-center justify-center h-full text-xs text-gray-500">No Image</div>
                  )}
                </div>
                <div className="flex-grow space-y-2">
                  <p className="text-xs text-gray-500">
                    Click the button to select an image from the library. The URL will be populated automatically.
                  </p>
                  <Input 
                    name="image" 
                    value={formData.image} 
                    onChange={handleChange}
                    required
                  />
                  <Button type="button" variant="outline" onClick={() => setIsModalOpen(true)}>
                    Select from Media Library
                  </Button>
                </div>
              </div>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="sizes">Sizes</Label>
              <Input 
                id="sizes" 
                name="sizes" 
                value={formData.sizes} 
                onChange={handleChange} 
                placeholder="sizes separated by commas eg 200ml,400ml,..." 
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="concerns">Concerns (comma-separated)</Label>
              <Input 
                id="concerns" 
                name="concerns" 
                value={formData.concerns} 
                onChange={handleChange} 
                placeholder="e.g., Dryness, Dullness" 
              />
            </div>

            <div className="flex items-center space-x-2 pt-2">
              <Checkbox
                id="featured"
                checked={formData.featured}
                onCheckedChange={handleFeaturedChange}
              />
              <Label htmlFor="featured">Feature this product on the homepage</Label>
            </div>
            
            {error && <p className="text-sm text-red-600">{error}</p>}
            <div className="flex gap-2 pt-2">
              <Button type="submit" disabled={isLoading}>
                {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                {isEditMode ? 'Save Changes' : 'Create Product'}
              </Button>
              <Button type="button" variant="outline" onClick={() => router.back()}>
                Cancel
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </>
  )
}