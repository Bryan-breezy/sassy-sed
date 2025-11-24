"use client"

import { useEffect, useState } from "react"
import Image from "next/image"
import { Trash2, Download, Copy, Check } from "lucide-react"
import { MediaFile } from "@/types"

export default function MediaLibrary() {
  const [media, setMedia] = useState<MediaFile[]>([])
  const [loading, setLoading] = useState(true)
  const [uploading, setUploading] = useState(false)
  const [deleting, setDeleting] = useState<string | null>(null)
  const [error, setError] = useState<string | null>(null)
  const [file, setFile] = useState<File | null>(null)
  const [copiedUrl, setCopiedUrl] = useState<string | null>(null)
  
  // --- Fetch Media Files ---
  const fetchMedia = async () => {
    try {
      setLoading(true)
      const res = await fetch("/api/admin/media")
      if (!res.ok) throw new Error(`Failed to load media: ${res.status}`)
      const data = await res.json()

      if (!Array.isArray(data)) throw new Error("Invalid response format")
      const validMedia = data.filter((item) => item?.name && item?.url)

      setMedia(validMedia)
      setError(null)
    } catch (err: any) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  // --- Upload Media ---
  const handleUpload = async () => {
    if (!file) {
      alert("Please select a file to upload.")
      return
    }

    const formData = new FormData()
    formData.append("file", file)

    try {
      setUploading(true);
      const res = await fetch("/api/admin/media", {
        method: "POST",
        body: formData,
      })

      if (!res.ok) {
        const msg = await res.text()
        throw new Error(msg || "Failed to upload file")
      }

      setFile(null)
      await fetchMedia()
    } catch (err: any) {
      alert(`Upload failed: ${err.message}`)
    } finally {
      setUploading(false)
    }
  }

  // --- Delete Media ---
  const handleDelete = async (fileName: string) => {
    if (!confirm(`Delete "${fileName}" permanently?`)) return

    try {
      setDeleting(fileName)
      const res = await fetch("/api/admin/media", {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name: fileName }),
      })

      if (!res.ok) {
        const msg = await res.text()
        throw new Error(msg || "Failed to delete file")
      }

      setMedia((prev) => prev.filter((f) => f.name !== fileName))
    } catch (err: any) {
      alert(`Delete failed: ${err.message}`)
    } finally {
      setDeleting(null)
    }
  }

  // --- Copy URL to Clipboard ---
  const handleCopyUrl = async (url: string) => {
    try {
      await navigator.clipboard.writeText(url)
      setCopiedUrl(url)
      setTimeout(() => setCopiedUrl(null), 2000) // Reset after 2 seconds
    } catch (err) {
      // Fallback for older browsers
      const textArea = document.createElement("textarea")
      textArea.value = url
      document.body.appendChild(textArea)
      textArea.select()
      document.execCommand("copy")
      document.body.removeChild(textArea)
      setCopiedUrl(url)
      setTimeout(() => setCopiedUrl(null), 2000)
    }
  }

  // --- Download File ---
  const handleDownload = async (file: MediaFile) => {
    try {
      const response = await fetch(file.url)
      const blob = await response.blob()
      const blobUrl = window.URL.createObjectURL(blob)
      
      const link = document.createElement("a")
      link.href = blobUrl
      link.download = file.name
      document.body.appendChild(link)
      link.click()
      document.body.removeChild(link)
      
      // Clean up the blob URL
      window.URL.revokeObjectURL(blobUrl)
    } catch (err) {
      alert("Failed to download file")
    }
  }

  // --- Copy Markdown/HTML ---
  const handleCopyMarkdown = (file: MediaFile) => {
    const markdown = `![${file.name}](${file.url})`
    handleCopyUrl(markdown)
  }

  const handleCopyHTML = (file: MediaFile) => {
    const html = `<img src="${file.url}" alt="${file.name}" />`
    handleCopyUrl(html)
  }

  useEffect(() => {
    fetchMedia()
  }, [])

  // --- Loading State ---
  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <p className="text-gray-500 text-lg">Loading media...</p>
      </div>
    );
  }

  // --- Error State ---
  if (error) {
    return (
      <div className="text-center text-red-500">
        <p>Error: {error}</p>
        <button
          onClick={fetchMedia}
          className="mt-3 px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition"
        >
          Retry
        </button>
      </div>
    )
  }

  return (
    <div className="p-6">
      <h2 className="text-2xl font-semibold mb-6 text-gray-800">Media Library</h2>

      <UploadSection
        file={file}
        setFile={setFile}
        uploading={uploading}
        onUpload={handleUpload}
      />

      {media.length === 0 ? (
        <div className="flex flex-col items-center justify-center h-64">
          <p className="text-gray-500 text-lg">No media files found.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 mt-6">
          {media.map((file) => (
            <MediaCard
              key={file.id}
              file={file}
              deleting={deleting}
              copiedUrl={copiedUrl}
              onDelete={handleDelete}
              onDownload={handleDownload}
              onCopyUrl={handleCopyUrl}
              onCopyMarkdown={handleCopyMarkdown}
              onCopyHTML={handleCopyHTML}
            />
          ))}
        </div>
      )}
    </div>
  )
}

// --- Media Card Component ---
function MediaCard({
  file,
  deleting,
  copiedUrl,
  onDelete,
  onDownload,
  onCopyUrl,
  onCopyMarkdown,
  onCopyHTML,
}: {
  file: MediaFile
  deleting: string | null
  copiedUrl: string | null
  onDelete: (fileName: string) => void
  onDownload: (file: MediaFile) => void
  onCopyUrl: (url: string) => void
  onCopyMarkdown: (file: MediaFile) => void
  onCopyHTML: (file: MediaFile) => void
}) {
  const [showActions, setShowActions] = useState(false)

  return (
    <div
      className="relative rounded-lg shadow-md bg-white hover:shadow-lg transition duration-200 overflow-hidden"
      onMouseEnter={() => setShowActions(true)}
      onMouseLeave={() => setShowActions(false)}
    >
      <div className="relative w-full h-48 bg-gray-100">
        <Image
          src={file.url}
          alt={file.name}
          fill
          className="object-cover"
          onError={(e) =>
            (e.currentTarget.src =
              "https://via.placeholder.com/300x200?text=No+Preview")
          }
        />
        
        {/* Action Overlay */}
        {showActions && (
          <div className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center space-x-2 transition-opacity">
            <button
              onClick={() => onDownload(file)}
              className="p-2 bg-white rounded-full hover:bg-gray-100 transition"
              title="Download"
            >
              <Download size={16} className="text-gray-700" />
            </button>
            
            <button
              onClick={() => onCopyUrl(file.url)}
              className="p-2 bg-white rounded-full hover:bg-gray-100 transition"
              title="Copy URL"
            >
              {copiedUrl === file.url ? (
                <Check size={16} className="text-green-600" />
              ) : (
                <Copy size={16} className="text-gray-700" />
              )}
            </button>
          </div>
        )}
      </div>

      <div className="p-3">
        <h3 className="font-medium text-gray-800 truncate">{file.name}</h3>
        <p className="text-sm text-gray-500">
          {(file.size / 1024).toFixed(2)} KB
        </p>
        <p className="text-xs text-gray-400 mt-1">
          {new Date(file.createdAt).toLocaleDateString()}
        </p>
        
        {/* Quick Copy Buttons */}
        <div className="flex flex-wrap gap-1 mt-2">
          <button
            onClick={() => onCopyUrl(file.url)}
            className="text-xs px-2 py-1 bg-gray-100 hover:bg-gray-200 rounded transition"
          >
            {copiedUrl === file.url ? "✓ URL" : "Copy URL"}
          </button>
          <button
            onClick={() => onCopyMarkdown(file)}
            className="text-xs px-2 py-1 bg-gray-100 hover:bg-gray-200 rounded transition"
          >
            {copiedUrl === `![${file.name}](${file.url})` ? "✓ MD" : "MD"}
          </button>
          <button
            onClick={() => onCopyHTML(file)}
            className="text-xs px-2 py-1 bg-gray-100 hover:bg-gray-200 rounded transition"
          >
            {copiedUrl === `<img src="${file.url}" alt="${file.name}" />` ? "✓ HTML" : "HTML"}
          </button>
        </div>
      </div>

      {/* Delete Button */}
      <button
        onClick={() => onDelete(file.name)}
        disabled={deleting === file.name}
        className={`absolute top-2 right-2 p-2 rounded-full ${
          deleting === file.name
            ? "bg-gray-300"
            : "bg-red-500 hover:bg-red-600"
        }`}
        title="Delete file"
      >
        <Trash2
          size={16}
          className={`text-white ${
            deleting === file.name ? "opacity-50" : ""
          }`}
        />
      </button>
    </div>
  )
}

// --- Upload Section ---
function UploadSection({
  file,
  setFile,
  uploading,
  onUpload,
}: {
  file: File | null;
  setFile: (f: File | null) => void;
  uploading: boolean;
  onUpload: () => void;
}) {
  return (
    <div className="mb-6 bg-white shadow p-4 rounded-md flex flex-col sm:flex-row items-center gap-4">
      <input
        type="file"
        onChange={(e) => setFile(e.target.files?.[0] || null)}
        className="border border-gray-300 rounded-md p-2 w-full sm:w-auto"
      />
      <button
        onClick={onUpload}
        disabled={!file || uploading}
        className={`px-4 py-2 rounded-md text-white ${
          uploading
            ? "bg-gray-400 cursor-not-allowed"
            : "bg-green-600 hover:bg-green-700"
        }`}
      >
        {uploading ? "Uploading..." : "Upload"}
      </button>
      {file && !uploading && (
        <p className="text-sm text-gray-500 truncate w-full sm:w-auto">
          Selected: {file.name}
        </p>
      )}
    </div>
  )
}
