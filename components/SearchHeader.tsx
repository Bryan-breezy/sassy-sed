"use client"

import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet"
import { FilterSidebar } from "./FilterSidebar"
import { Search, Filter } from "lucide-react"
import { CategoryFilter } from "@/types"

interface SearchHeaderProps {
  searchTerm: string
  onSearchChange: (value: string) => void
  categories: CategoryFilter[]
  selectedCategories: string[]
  setSelectedCategories: React.Dispatch<React.SetStateAction<string[]>>
  initialBrand?: string
  initialCategory?: string
  filteredProductsCount: number
  allProductsCount: number
}

export function SearchHeader({
  searchTerm,
  onSearchChange,
  categories,
  selectedCategories,
  setSelectedCategories,
  initialBrand,
  initialCategory,
  filteredProductsCount,
  allProductsCount
}: SearchHeaderProps) {
  return (
    <div className="mb-8">
      <h1 className="sm:text-2xl md:text-3xl lg:text-4xl xl:text-4xl font-bold text-gray-900 mb-2">
        {initialBrand ? `${initialBrand} - ` : ''}{initialCategory || 'All Products'}
      </h1>
      <p className="text-base md:text-xl lg:text-3xl xl:text-4xl text-gray-600 mb-2">
        Discover our complete range of natural cosmetics.
      </p>
      <div className="flex flex-col sm:flex-row gap-4 items-center">
        <div className="relative flex-grow w-full">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
          <Input
            placeholder="Search products by name, brand..."
            className="pl-10 border-green-200 focus:border-green-400 w-full"
            value={searchTerm}
            onChange={(e) => onSearchChange(e.target.value)}
          />
        </div>
        <div className="flex flex-col sm:flex-row gap-2 sm:gap-3 w-full">
          <Sheet>
            <SheetTrigger asChild>
              <Button 
                variant="outline" 
                className="lg:hidden w-full sm:w-auto justify-center border-green-200 hover:bg-green-50"
                size="sm"
              >
                <Filter className="w-4 h-4 mr-2" />
                <span className="text-sm">Filters</span>
              </Button>
            </SheetTrigger>
            <SheetContent side="left" className="w-[300px] sm:w-[350px]">
              <SheetHeader className="pb-4">
                <SheetTitle className="text-lg font-semibold">Filter Products</SheetTitle>
              </SheetHeader>
              <div className="py-2 overflow-y-auto max-h-[calc(100vh-120px)]">
                <FilterSidebar 
                  categories={categories} 
                  selectedCategories={selectedCategories} 
                  setSelectedCategories={setSelectedCategories} 
                />
              </div>
            </SheetContent>
          </Sheet>
        </div>
      </div>
      <p className="text-gray-600 mb-6 mt-4">
        Showing {filteredProductsCount} of {allProductsCount} products
      </p>
    </div>
  )
}
