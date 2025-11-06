"use client"

import { useEffect, useState } from "react"
import Image from "next/image"
import { Trash2 } from "lucide-react"
import { MediaFile } from "@/types"

export default function MediaLibrary() {
  const [media, setMedia] = useState<MediaFile[]>([])
  const [loading, setLoading] = useState(true)
  const [uploading, setUploading] = useState(false)
  const [deleting, setDeleting] = useState<string | null>(null)
  const [error, setError] = useState<string | null>(null)
  const [file, setFile] = useState<File | null>(null)
  
  // --- Fetch Media Files ---
  const fetchMedia = async () => {
    try {
      setLoading(true);
      const res = await fetch("/api/admin/media")
      if (!res.ok) throw new Error(`Failed to load media: ${res.status}`)
      const data = await res.json()

      if (!Array.isArray(data)) throw new Error("Invalid response format")
      const validMedia = data.filter((item) => item?.name && item?.url)

      setMedia(validMedia)
      setError(null)
    } catch (err: any) {
      console.error("❌ Error fetching media:", err)
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
      console.error("❌ Upload error:", err)
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
      console.error("❌ Delete error:", err)
      alert(`Delete failed: ${err.message}`)
    } finally {
      setDeleting(null)
    }
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
            <div
              key={file.id}
              className="relative rounded-lg shadow-md bg-white hover:shadow-lg transition duration-200 overflow-hidden"
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
              </div>

              <div className="p-3">
                <h3 className="font-medium text-gray-800 truncate">{file.name}</h3>
                <p className="text-sm text-gray-500">
                  {(file.size / 1024).toFixed(2)} KB
                </p>
                <p className="text-xs text-gray-400 mt-1">
                  {new Date(file.createdAt).toLocaleDateString()}
                </p>
              </div>

              <button
                onClick={() => handleDelete(file.name)}
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
          ))}
        </div>
      )}
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
  );
}
