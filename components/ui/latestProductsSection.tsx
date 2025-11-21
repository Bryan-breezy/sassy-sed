import { getAllProducts } from "@/lib/data"
import { LatestProductsClient } from "./latest-products-client"
import { LatestProductsSectionProps } from "@/types"

export default async function LatestProductsSection({
  title = "Latest Products",
  textColor = "text-green-600"
}: LatestProductsSectionProps) {
  try {
    const allProducts = await getAllProducts()
    
    if (!Array.isArray(allProducts)) {
      console.error("getAllProducts() did not return an array:", allProducts)
      return (
        <section className={`min-h-[60vh] flex items-center justify-center ${backgroundColor} p-8`}>
          <div className="text-center">
            <h2 className="text-2xl font-semibold text-gray-600">Unable to load products</h2>
            <p className="text-gray-500 mt-2">Please try again later</p>
          </div>
        </section>
      )
    }

    const latestProducts = allProducts.filter(p => p.brand === "Dr Mehos")

    const productsWithUrls = latestProducts.map(product => ({
      ...product,
      imageUrl: product.image
    }))

    if (productsWithUrls.length === 0) {
      return (
        <section className={`min-h-[60vh] flex items-center justify-center ${backgroundColor} p-8`}>
          <div className="text-center">
            <h2 className="text-2xl font-semibold text-gray-600">No latest products available</h2>
            <p className="text-gray-500 mt-2">Check back later for new arrivals</p>
          </div>
        </section>
      )
    }

    // Pass processed data to client component
    return (
      <LatestProductsClient
        products={productsWithUrls}
        title={title}
        backgroundColor={backgroundColor}
        textColor={textColor}
      />
    )

  } catch (error) {
    console.error("Error in LatestProductsSection:", error)
    return (
      <section className={`min-h-[60vh] flex items-center justify-center ${backgroundColor} p-8`}>
        <div className="text-center">
          <h2 className="text-2xl font-semibold text-gray-600">Error loading products</h2>
          <p className="text-gray-500 mt-2">Please refresh the page</p>
        </div>
      </section>
    )
  }
}
