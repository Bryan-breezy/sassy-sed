'use client';

import { useState, useRef } from 'react';
import SupabaseImage from './SupabaseImage';

interface ImageUploadProps {
  currentImageUrl?: string | null;
  currentImageKey?: string | null;
  productId?: string;
  onUploadSuccess?: (url: string, key: string) => void;
  onDeleteSuccess?: () => void;
}

export default function ImageUpload({
  currentImageUrl,
  currentImageKey,
  productId,
  onUploadSuccess,
  onDeleteSuccess,
}: ImageUploadProps) {
  const [imageUrl, setImageUrl] = useState(currentImageUrl);
  const [imageKey, setImageKey] = useState(currentImageKey);
  const [isUploading, setIsUploading] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Validate file type
    if (!file.type.startsWith('image/')) {
      alert('Please upload an image file');
      return;
    }

    // Validate file size (max 5MB)
    if (file.size > 5 * 1024 * 1024) {
      alert('Image must be less than 5MB');
      return;
    }

    setIsUploading(true);

    try {
      const formData = new FormData();
      formData.append('file', file);
      if (productId) formData.append('productId', productId);

      const response = await fetch('/api/upload', {
        method: 'POST',
        body: formData,
      });

      if (!response.ok) throw new Error('Upload failed');

      const data = await response.json();
      setImageUrl(data.url);
      setImageKey(data.key);
      
      if (onUploadSuccess) {
        onUploadSuccess(data.url, data.key);
      }
    } catch (error) {
      console.error('Upload error:', error);
      alert('Failed to upload image');
    } finally {
      setIsUploading(false);
    }
  };

  const handleDelete = async () => {
    if (!imageKey) return;
    
    if (!confirm('Are you sure you want to delete this image?')) return;

    setIsDeleting(true);

    try {
      const params = new URLSearchParams({ key: imageKey });
      if (productId) params.append('productId', productId);

      const response = await fetch(`/api/upload?${params}`, {
        method: 'DELETE',
      });

      if (!response.ok) throw new Error('Delete failed');

      setImageUrl(null);
      setImageKey(null);
      
      if (onDeleteSuccess) {
        onDeleteSuccess();
      }
    } catch (error) {
      console.error('Delete error:', error);
      alert('Failed to delete image');
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <div className="space-y-4">
      {imageUrl ? (
        <div className="space-y-2">
          <SupabaseImage
            src={imageUrl}
            alt="Product image"
            width={400}
            height={400}
            className="rounded-lg"
          />
          <div className="flex gap-2">
            <button
              onClick={() => fileInputRef.current?.click()}
              disabled={isUploading}
              className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 disabled:opacity-50"
            >
              {isUploading ? 'Uploading...' : 'Change Image'}
            </button>
            <button
              onClick={handleDelete}
              disabled={isDeleting}
              className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700 disabled:opacity-50"
            >
              {isDeleting ? 'Deleting...' : 'Delete'}
            </button>
          </div>
        </div>
      ) : (
        <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center">
          <button
            onClick={() => fileInputRef.current?.click()}
            disabled={isUploading}
            className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50"
          >
            {isUploading ? 'Uploading...' : 'Upload Image'}
          </button>
          <p className="mt-2 text-sm text-gray-500">
            PNG, JPG, WEBP up to 5MB
          </p>
        </div>
      )}

      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        onChange={handleFileChange}
        className="hidden"
      />
    </div>
  );
}
