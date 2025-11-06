"use client"

import { useState, useEffect, useMemo } from "react"
import { Card } from "@/components/ui/card"
import { FilterSidebar } from "./FilterSidebar"
import { ProductCard } from "./ProductCard"
import { Pagination } from "./Pagination"
import { SearchHeader } from "./SearchHeader"
import { Product } from "@/types"

interface ProductGridWithFiltersProps {
  initialProducts: Product[]
  initialCategory?: string
  initialBrand?: string
}

export function ProductGridWithFilters({
  initialProducts,
  initialCategory,
  initialBrand,
}: ProductGridWithFiltersProps) {
  const [allProducts, setAllProducts] = useState<Product[]>(initialProducts)
  const [searchTerm, setSearchTerm] = useState("")
  const [selectedCategories, setSelectedCategories] = useState<string[]>(
    initialCategory ? [initialCategory] : []
  )
  const [visibleSizes, setVisibleSizes] = useState(3)
  const [currentPage, setCurrentPage] = useState(1)
  const productsPerPage = 20

  useEffect(() => {
  // whenever search term changes, reset to first page
  setCurrentPage(1)
}, [searchTerm])
  
  // Responsive and adaptive screen
  useEffect(() => {
    const updateSizes = () => {
      const width = window.innerWidth
      if (width < 640) setVisibleSizes(2) // mobile
      else if (width < 1024) setVisibleSizes(3) // tablet
      else setVisibleSizes(4) // desktop
    }
    
    updateSizes()
    window.addEventListener("resize", updateSizes)
    return () => window.removeEventListener("resize", updateSizes)
  }, [])

  // Sync state if products or category change
  useEffect(() => {
    setAllProducts(initialProducts)
    setSelectedCategories(initialCategory ? [initialCategory] : [])
  }, [initialProducts, initialCategory])

  // brand/category filters
  const categories = useMemo(() => { // cache number of products per brand/categories
    const categoryCounts: { [key: string]: number } = {}
    
    initialProducts.forEach((p) => {
      categoryCounts[p.brand] = (categoryCounts[p.brand] || 0) + 1 // if brand not in categpryCounts -> 0
    })
    return Object.entries(categoryCounts) // { "Sedoso" : 20, "saa": 10, ... } -> [["sedoso",20],["saa",10],...]
      .map(([name, count]) => ({ // [name, count] -> ["Sedoso",20]
        name,
        count,
    })) // [{ name: "Sedoso", count: 20}, ...]
  }, [initialProducts])

  const filteredProducts = useMemo(() => { // cache searched product
    return allProducts.filter((product) => {
      const matchesSearch =
        searchTerm.trim() === "" || [product.name, product.subcategory, product.brand]
          .join(" ")
          .toLowerCase()
          .includes(searchTerm.toLowerCase())

      const matchesCategory =
        selectedCategories.length === 0 ||
        selectedCategories.includes(product.brand)

      return matchesSearch && matchesCategory
    })
  }, [allProducts, searchTerm, selectedCategories])

  // Pagination logic
  const indexOfLastProduct = currentPage * productsPerPage // eg 1 * 20 = 20th product
  const indexOfFirstProduct = indexOfLastProduct - productsPerPage // eg 20 - 20 = 0 index / 1st product
  const currentProducts = filteredProducts.slice(
    indexOfFirstProduct,
    indexOfLastProduct
  )
  const totalPages = Math.ceil(filteredProducts.length / productsPerPage)

  // previous page
  const handlePrevious = () => {
    setCurrentPage((prev) => Math.max(prev - 1, 1))
  }

  //next page
  const handleNext = () => {
    setCurrentPage((prev) => Math.min(prev + 1, totalPages))
  }
  
  const handlePageClick = (pageNumber: number) => {
    setCurrentPage(pageNumber)
  }

  return (
    <div className="container mx-auto px-2 sm:px-4 py-8">
      <div className="lg:grid lg:grid-cols-4 lg:gap-8">
        {/* Sidebar (Desktop Only) */}
        <aside className="hidden lg:block lg:col-span-1">
          <Card className="sticky top-28">
            <FilterSidebar
              categories={categories}
              selectedCategories={selectedCategories}
              setSelectedCategories={setSelectedCategories}
            />
          </Card>
        </aside>

        {/* Main Content */}
        <main className="lg:col-span-3">
          <SearchHeader
            searchTerm={searchTerm}
            onSearchChange={setSearchTerm}
            categories={categories}
            selectedCategories={selectedCategories}
            setSelectedCategories={setSelectedCategories}
            initialBrand={initialBrand}
            initialCategory={initialCategory}
            filteredProductsCount={filteredProducts.length}
            allProductsCount={allProducts.length}
          />

          {filteredProducts.length > 0 ? (
            <>
              {/* Responsive Grid */}
              <div
                className={`grid grid-cols-2 sm:grid-cols-3 md:grid-cols-${visibleSizes} lg:grid-cols-${visibleSizes} xl:grid-cols-${visibleSizes} gap-2 sm:gap-3 md:gap-4`}
              >
                {currentProducts.map((product, index) => (
                  <ProductCard
                    key={product.id}
                    product={product}
                    index={index}
                    visibleSizes={visibleSizes}
                  />
                ))}
              </div>

              <Pagination
                currentPage={currentPage}
                totalPages={totalPages}
                onPageChange={handlePageClick}
                onPrevious={handlePrevious}
                onNext={handleNext}
              />
            </>
          ) : (
            <div className="col-span-full text-center text-gray-500 py-8 sm:py-12 md:py-16 px-4">
              <h3 className="text-xl sm:text-2xl font-semibold">
                No Products Found
              </h3>
              <p className="mt-2 text-sm sm:text-base">
                Try adjusting your search or clearing the filters.
              </p>
            </div>
          )}
        </main>
      </div>
    </div>
  )
}
