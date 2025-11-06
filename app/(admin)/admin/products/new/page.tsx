import { ProductForm } from "@/components/admin/product-form"
import type { Product } from "@/types"

export default function NewProductPage() {
  const defaultProduct: Product = {
    id: '', 
    name: '',
    brand: '',
    category: '',
    subcategory: '',
    sizes: [],
    concerns: [],
    image: '',
    createdAt: '',
    description: '',
    featured: false
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl lg:text-3xl font-bold text-gray-900">Add New Product</h1>
      </div>
      
      <ProductForm product={defaultProduct} />
    </div>
  )
}
