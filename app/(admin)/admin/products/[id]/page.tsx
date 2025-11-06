import { ProductForm } from "@/components/admin/product-form"
import { notFound } from "next/navigation"
import { getProductById } from "@/lib/data"

export default async function EditProductPage({ params }: { 
  params: Promise<{ id: string }> 
}) {
  const { id } = await params
  const product = await getProductById(id)

  if (!product) {
    notFound()
  }

  return (
    <div className="space-y-6">
      <ProductForm product={product} />
    </div>
  )
}
