"use client"

import React from 'react'
import Image from 'next/image'

interface ProductImageGalleryProps {
  image: string
  productName: string
}

export const ProductImageGallery: React.FC<ProductImageGalleryProps> = ({
  image,
  productName
}) => {
  // Ensure image exists, is not an empty string
  const displayImage = image && image.trim() !== "" ? image : "/placeholder.svg"

  return (
    <div className="space-y-4">
      <div className="overflow-hidden rounded-lg border bg-gray-50 flex justify-center items-center aspect-square">
        <div className="relative w-full h-80">
          <Image
            src={displayImage}
            alt={`${productName} image`}
            fill
            className="object-contain p-4"
            sizes="(max-width: 768px) 100vw, 50vw"
            priority
          />
        </div>
      </div>
    </div>
  )
}
