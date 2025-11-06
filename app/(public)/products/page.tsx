import {getAllProducts} from "@/lib/data"
import { ProductGridWithFilters } from "@/components/product-grid-with-filters"

export default async function ProductsPage() {
  const allProducts = await getAllProducts()

  return (

    <ProductGridWithFilters initialProducts={allProducts} />
  )
}
