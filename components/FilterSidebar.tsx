"use client"

import { CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Checkbox } from "@/components/ui/checkbox"
import { Label } from "@/components/ui/label"
import { CategoryFilter } from "@/types"

interface FilterSidebarProps {
  categories: CategoryFilter[]
  selectedCategories: string[]
  setSelectedCategories: React.Dispatch<React.SetStateAction<string[]>>
}

export function FilterSidebar({ 
  categories, 
  selectedCategories, 
  setSelectedCategories 
}: FilterSidebarProps) {
  return (
    <CardContent className="space-y-6">
      <div className="flex items-center justify-between">
        <h3 className="font-semibold text-green-800">Categories</h3>
        <Button 
          variant="ghost" 
          size="sm" 
          className="text-green-600 hover:bg-green-50" 
          onClick={() => setSelectedCategories([])}
        >
          Clear
        </Button>
      </div>
      <div className="space-y-2">
        {categories.map((category) => (
          <div key={category.name} className="flex items-center justify-between">
            <Label 
              htmlFor={`cat-${category.name}`} 
              className="flex items-center space-x-2 cursor-pointer"
            >
              <Checkbox
                id={`cat-${category.name}`}
                className="border-green-300"
                checked={selectedCategories.includes(category.name)}
                onCheckedChange={(checked) => {
                  setSelectedCategories((prev) =>
                    checked ? [...prev, category.name] : prev.filter((c) => c !== category.name)
                  )
                }}
              />
              <span className="text-sm">{category.name}</span>
            </Label>
            <span className="text-xs text-gray-500">({category.count})</span>
          </div>
        ))}
      </div>
    </CardContent>
  )
}
