import { supabase } from './supabase-client'

const BUCKET_NAME = 'uploads'

export async function uploadImage(file: File, path?: string): Promise<{ url: string; key: string }> {
  const fileExt = file.name.split('.').pop()
  const fileName = path || `${Date.now()}-${Math.random().toString(36).substring(7)}.${fileExt}`
  
  const { data, error } = await supabase.storage
    .from(BUCKET_NAME)
    .upload(fileName, file, {
      cacheControl: '3600',
      upsert: false
    })

  if (error) {
    throw new Error(`Upload failed: ${error.message}`)
  }

  const { data: { publicUrl } } = supabase.storage
    .from(BUCKET_NAME)
    .getPublicUrl(data.path);

  return {
    url: publicUrl,
    key: data.path
  }
}

/**
 * Delete an image from Supabase Storage
 * @param key - The file key/path in storage
 */
export async function deleteImage(key: string): Promise<void> {
  const { error } = await supabase.storage
    .from(BUCKET_NAME)
    .remove([key]);

  if (error) {
    throw new Error(`Delete failed: ${error.message}`);
  }
}

/**
 * Get public URL for an image
 * @param key - The file key/path in storage
 */
export function getImageUrl(key: string): string {
  const { data: { publicUrl } } = supabase.storage
    .from(BUCKET_NAME)
    .getPublicUrl(key);
  
  return publicUrl;
}

/**
 * Update an image (delete old, upload new)
 * @param oldKey - The old file key to delete
 * @param newFile - The new file to upload
 */
export async function updateImage(oldKey: string, newFile: File): Promise<{ url: string; key: string }> {
  // Delete old image
  if (oldKey) {
    await deleteImage(oldKey);
  }
  
  // Upload new image
  return await uploadImage(newFile);
}
