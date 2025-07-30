import { createClient } from "@/src/lib/supabase/client";

export interface ImageUploadOptions {
  bucket?: string;
  maxFileSize?: number; // in bytes
  allowedTypes?: string[];
  userId: string;
}

export interface UploadResult {
  url: string;
  fileName: string;
}

export class ImageUploadError extends Error {
  constructor(message: string, public code?: string) {
    super(message);
    this.name = "ImageUploadError";
  }
}

const DEFAULT_OPTIONS: Partial<ImageUploadOptions> = {
  bucket: "post-images",
  maxFileSize: 50 * 1024 * 1024, // 50MB
  allowedTypes: ["image/jpeg", "image/jpg", "image/png", "image/gif", "image/webp"],
};

export async function validateImageFile(
  file: File,
  options: ImageUploadOptions
): Promise<void> {
  const { maxFileSize, allowedTypes } = { ...DEFAULT_OPTIONS, ...options };

  if (file.size > maxFileSize!) {
    throw new ImageUploadError(
      `File size too large. Maximum size is ${Math.round(maxFileSize! / 1024 / 1024)}MB.`,
      "FILE_TOO_LARGE"
    );
  }

  if (!allowedTypes!.includes(file.type)) {
    throw new ImageUploadError(
      `Invalid file type. Allowed types: ${allowedTypes!.join(", ")}`,
      "INVALID_FILE_TYPE"
    );
  }
}

export async function uploadImage(
  file: File,
  options: ImageUploadOptions
): Promise<UploadResult> {
  const supabase = createClient();
  const { bucket, userId } = { ...DEFAULT_OPTIONS, ...options };

  // Validate file
  await validateImageFile(file, options);

  // Generate unique filename
  const timestamp = Date.now();
  const randomSuffix = Math.random().toString(36).substring(2, 8);
  const fileName = `${userId}/${timestamp}_${randomSuffix}_${file.name}`;

  // Upload to Supabase Storage
  const { error: uploadError } = await supabase.storage
    .from(bucket!)
    .upload(fileName, file);

  if (uploadError) {
    throw new ImageUploadError(
      `Failed to upload image: ${uploadError.message}`,
      "UPLOAD_FAILED"
    );
  }

  // Get public URL
  const {
    data: { publicUrl },
  } = supabase.storage.from(bucket!).getPublicUrl(fileName);

  return {
    url: publicUrl,
    fileName,
  };
}

export async function uploadMultipleImages(
  files: File[],
  options: ImageUploadOptions
): Promise<UploadResult[]> {
  const uploadPromises = files.map((file) => uploadImage(file, options));
  return Promise.all(uploadPromises);
}

export async function deleteImage(
  fileName: string,
  bucket: string = "post-images"
): Promise<void> {
  const supabase = createClient();

  const { error } = await supabase.storage.from(bucket).remove([fileName]);

  if (error) {
    throw new ImageUploadError(
      `Failed to delete image: ${error.message}`,
      "DELETE_FAILED"
    );
  }
}