import { useState, useCallback } from "react";
import {
  uploadMultipleImages,
  validateImageFile,
  ImageUploadOptions,
  UploadResult,
  ImageUploadError,
} from "@/src/lib/image-upload";

interface UseImageUploadState {
  uploading: boolean;
  error: string | null;
  uploadedImages: UploadResult[];
}

interface UseImageUploadReturn extends UseImageUploadState {
  uploadImages: (files: File[]) => Promise<UploadResult[]>;
  clearError: () => void;
  resetState: () => void;
}

export function useImageUpload(options: ImageUploadOptions): UseImageUploadReturn {
  const [state, setState] = useState<UseImageUploadState>({
    uploading: false,
    error: null,
    uploadedImages: [],
  });

  const uploadImages = useCallback(
    async (files: File[]): Promise<UploadResult[]> => {
      setState((prev) => ({
        ...prev,
        uploading: true,
        error: null,
      }));

      try {
        // Validate all files first
        for (const file of files) {
          await validateImageFile(file, options);
        }

        // Upload all files
        const results = await uploadMultipleImages(files, options);

        setState((prev) => ({
          ...prev,
          uploading: false,
          uploadedImages: [...prev.uploadedImages, ...results],
        }));

        return results;
      } catch (error) {
        const errorMessage =
          error instanceof ImageUploadError
            ? error.message
            : "An unexpected error occurred during upload";

        setState((prev) => ({
          ...prev,
          uploading: false,
          error: errorMessage,
        }));

        throw error;
      }
    },
    [options]
  );

  const clearError = useCallback(() => {
    setState((prev) => ({ ...prev, error: null }));
  }, []);

  const resetState = useCallback(() => {
    setState({
      uploading: false,
      error: null,
      uploadedImages: [],
    });
  }, []);

  return {
    ...state,
    uploadImages,
    clearError,
    resetState,
  };
}