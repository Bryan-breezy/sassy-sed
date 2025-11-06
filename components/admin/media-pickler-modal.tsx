"use client"

import { useState, useEffect } from "react"
import Image from "next/image"
import { Button } from "@/components/ui/button"
import { X, CheckCircle2 } from "lucide-react"
import type { MediaFile } from "@/types"

interface MediaPickerModalProps {
    isOpen: boolean
    onClose: () => void
    onSelect: (url: string) => void
}

export function MediaPickerModel({ isOpen, onClose, onSelect }: MediaPickerModalProps) {
  const [mediaFiles, setMediaFiles] = useState<MediaFile[]>([])
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    if (isOpen && mediaFiles.length === 0) {
      setLoading(true)
      const fetchMedia = async () => {
        try {
            const response = await fetch('/api/admin/media', { cache: 'no-store' })
            if (response.ok) {
                setMediaFiles(await response.json())
            }
        } catch (error){
            console.error("Failed to fetch media files", error)
        } finally { setLoading(false) }
    }
        fetchMedia()
        }
  }, [isOpen, mediaFiles.length])

  const handleImageSet = (url: string) => {
    onSelect(url)
    onClose()
  }

  if (!isOpen) return null

  return (
    // Full screen overlay
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 bg-opacity-50">
      // Modal container
      <div className="bg-white rounded-lg shadow-lg w-11/12 md:w-3/4 lg:w-1/2 max-h-[80vh] overflow-y-auto">
        //Modal Header
        <div className="flex justify-between items-center p-4 border-b">
          <h2 className="text-lg font-semibold">Select an Image</h2>
          <Button variant="ghost" onClick={onClose} size="icon">
            <X className="h-4 w-4" size={20} />
          </Button>
        </div>
        // Modal Body
        <div className="p-4 overflow-y-auto">
          {loading? (
            <p>Loading...</p>
        ): (
            <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 lg:grid-cols-6 gap-4">
                {mediaFiles.map((file) => (
                    <button 
                        key={file.id} 
                        className="relative aspect-square rounded-md overflow-hidden group focus:outline-none focuss:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                        onClick={() => handleImageSet(file.url)}
                    >
                        <Image
                            src={file.url}
                            alt={file.name}
                            layout="fill"
                            objectFit="cover"
                            className="transform group-hover:scale-105 transition-transform duration-200"
                        />
                        <span className="sr-only">{file.name}</span>
                        <div className="absolute inset-0 bg-black bg-opacity-25 opacity-0 group-hover:opacity-100 transition-opacity duration-200 flex items-center justify-center">
                            <CheckCircle2 className="text-white h-8 w-8" />
                        </div>
                    </button>
                    ))}
            </div>
        )}
        </div>
        </div>
        </div>
  )
}

          