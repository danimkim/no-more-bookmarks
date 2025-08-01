import { useState, useCallback } from "react";
import { useRouter } from "next/navigation";

export interface CreatePostData {
  title: string;
  originalLink: string;
  content: string;
  executedDate: string;
  category: string;
  userId: string;
}

export interface UpdatePostData {
  id: string;
  title: string;
  originalLink: string;
  content: string;
  executedDate: string;
  category: string;
}

interface UsePostOperationsState {
  loading: boolean;
  error: string | null;
  success: boolean;
}

interface UsePostOperationsReturn extends UsePostOperationsState {
  createPostHandler: (postData: CreatePostData, imageFiles: File[]) => Promise<void>;
  saveDraftHandler: (postData: CreatePostData, imageFiles: File[]) => Promise<void>;
  updatePostHandler: (postData: UpdatePostData, imageFiles: File[]) => Promise<void>;
  deletePostHandler: (postId: string) => Promise<void>;
  clearError: () => void;
  resetState: () => void;
}

export function usePostOperations(): UsePostOperationsReturn {
  const [state, setState] = useState<UsePostOperationsState>({
    loading: false,
    error: null,
    success: false,
  });

  const router = useRouter();

  const createPostHandler = useCallback(
    async (postData: CreatePostData, imageFiles: File[]) => {
      setState(prev => ({
        ...prev,
        loading: true,
        error: null,
        success: false,
      }));

      try {
        const formData = new FormData();
        formData.append("title", postData.title);
        formData.append("originalLink", postData.originalLink);
        formData.append("content", postData.content);
        formData.append("executedDate", postData.executedDate);
        formData.append("category", postData.category);
        
        if (imageFiles.length > 0) {
          formData.append("image", imageFiles[0]);
        }

        const response = await fetch("/api/posts", {
          method: "POST",
          body: formData,
        });

        const result = await response.json();

        if (result.success) {
          setState(prev => ({
            ...prev,
            loading: false,
            success: true,
          }));

          // Redirect to feed after success
          setTimeout(() => {
            router.push("/feed");
          }, 2000);
        } else {
          setState(prev => ({
            ...prev,
            loading: false,
            error: result.error || "Failed to create post",
          }));
        }
      } catch (error) {
        console.error("Create post handler error:", error);
        setState(prev => ({
          ...prev,
          loading: false,
          error: error instanceof Error ? error.message : "An unexpected error occurred",
        }));
      }
    },
    [router]
  );

  const saveDraftHandler = useCallback(
    async (postData: CreatePostData, imageFiles: File[]) => {
      setState(prev => ({
        ...prev,
        loading: true,
        error: null,
        success: false,
      }));

      try {
        const formData = new FormData();
        formData.append("title", postData.title);
        formData.append("originalLink", postData.originalLink);
        formData.append("content", postData.content);
        formData.append("executedDate", postData.executedDate);
        formData.append("category", postData.category);
        
        if (imageFiles.length > 0) {
          formData.append("image", imageFiles[0]);
        }

        const response = await fetch("/api/posts/draft", {
          method: "POST",
          body: formData,
        });

        const result = await response.json();

        if (result.success) {
          setState(prev => ({
            ...prev,
            loading: false,
            success: true,
          }));
        } else {
          setState(prev => ({
            ...prev,
            loading: false,
            error: result.error || "Failed to save draft",
          }));
        }
      } catch (error) {
        console.error("Save draft handler error:", error);
        setState(prev => ({
          ...prev,
          loading: false,
          error: error instanceof Error ? error.message : "An unexpected error occurred",
        }));
      }
    },
    []
  );

  const clearError = useCallback(() => {
    setState(prev => ({ ...prev, error: null }));
  }, []);

  const updatePostHandler = useCallback(
    async (postData: UpdatePostData, imageFiles: File[]) => {
      setState(prev => ({
        ...prev,
        loading: true,
        error: null,
        success: false,
      }));

      try {
        const formData = new FormData();
        formData.append("title", postData.title);
        formData.append("originalLink", postData.originalLink);
        formData.append("content", postData.content);
        formData.append("executedDate", postData.executedDate);
        formData.append("category", postData.category);
        
        if (imageFiles.length > 0) {
          formData.append("image", imageFiles[0]);
        }

        const response = await fetch(`/api/posts/${postData.id}`, {
          method: "PUT",
          body: formData,
        });

        const result = await response.json();

        if (result.success) {
          setState(prev => ({
            ...prev,
            loading: false,
            success: true,
          }));

          // Redirect to post view after success
          setTimeout(() => {
            router.push(`/post/${postData.id}`);
          }, 2000);
        } else {
          setState(prev => ({
            ...prev,
            loading: false,
            error: result.error || "Failed to update post",
          }));
        }
      } catch (error) {
        console.error("Update post handler error:", error);
        setState(prev => ({
          ...prev,
          loading: false,
          error: error instanceof Error ? error.message : "An unexpected error occurred",
        }));
      }
    },
    [router]
  );

  const deletePostHandler = useCallback(
    async (postId: string) => {
      setState(prev => ({
        ...prev,
        loading: true,
        error: null,
        success: false,
      }));

      try {
        const response = await fetch(`/api/posts/${postId}`, {
          method: "DELETE",
        });

        const result = await response.json();

        if (result.success) {
          setState(prev => ({
            ...prev,
            loading: false,
            success: true,
          }));

          // Redirect to feed after successful deletion
          setTimeout(() => {
            router.push("/feed");
          }, 1500);
        } else {
          setState(prev => ({
            ...prev,
            loading: false,
            error: result.error || "Failed to delete post",
          }));
        }
      } catch (error) {
        console.error("Delete post handler error:", error);
        setState(prev => ({
          ...prev,
          loading: false,
          error: error instanceof Error ? error.message : "An unexpected error occurred",
        }));
      }
    },
    [router]
  );

  const resetState = useCallback(() => {
    setState({
      loading: false,
      error: null,
      success: false,
    });
  }, []);

  return {
    ...state,
    createPostHandler,
    saveDraftHandler,
    updatePostHandler,
    deletePostHandler,
    clearError,
    resetState,
  };
}