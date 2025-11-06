"use client"

import { Button } from "@/components/ui/button"

interface PaginationProps {
  currentPage: number
  totalPages: number
  onPageChange: (page: number) => void
  onPrevious: () => void
  onNext: () => void
}

export function Pagination({ 
  currentPage, 
  totalPages, 
  onPageChange, 
  onPrevious, 
  onNext 
}: PaginationProps) {
  if (totalPages <= 1) return null

  const pageNumbers = Array.from({ length: totalPages }, (_, i) => i + 1)

  return (
    <div className="flex flex-col sm:flex-row items-center justify-between gap-4 mt-6">
      <Button
        onClick={onPrevious}
        disabled={currentPage === 1}
        variant="outline"
        className="px-4 py-2 border-green-200 text-green-700 disabled:opacity-50 disabled:cursor-not-allowed hover:bg-green-50 transition-colors"
      >
        Previous
      </Button>
      <div className="flex gap-2">
        {pageNumbers.map((number) => (
          <Button
            key={number}
            onClick={() => onPageChange(number)}
            variant={currentPage === number ? "default" : "outline"}
            className={`px-3 py-1 ${
              currentPage === number
                ? 'bg-green-600 text-white hover:bg-green-700'
                : 'border-green-200 text-green-700 hover:bg-green-50'
            } transition-colors`}
          >
            {number}
          </Button>
        ))}
      </div>
      <Button
        onClick={onNext}
        disabled={currentPage === totalPages}
        variant="outline"
        className="px-4 py-2 border-green-200 text-green-700 disabled:opacity-50 disabled:cursor-not-allowed hover:bg-green-50 transition-colors"
      >
        Next
      </Button>
    </div>
  )
}
