"use client";

import type React from "react";

import { Button } from "@/src/components/ui/button";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/src/components/ui/card";
import { Input } from "@/src/components/ui/input";
import { Label } from "@/src/components/ui/label";
import { Textarea } from "@/src/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/src/components/ui/select";
import { ArrowLeft, Upload, X } from "lucide-react";
import Link from "next/link";
import { useState, useEffect } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useAuth } from "@/src/contexts/AuthContext";
import { ProtectedRoute } from "@/src/components/ProtectedRoute";
import { useImageUpload } from "@/src/hooks/useImageUpload";
import {
  usePostOperations,
  CreatePostData,
} from "@/src/hooks/usePostOperations";
import { POST_CATEGORIES } from "@/constants";

export default function CreatePostPage() {
  const [selectedImages, setSelectedImages] = useState<string[]>([]);
  const [imageFiles, setImageFiles] = useState<File[]>([]);
  const [formData, setFormData] = useState({
    title: "",
    originalLink: "",
    content: "",
    executedDate: "",
    category: "",
  });

  const router = useRouter();
  const { user, loading: authLoading } = useAuth();

  const postOperations = usePostOperations();

  const imageUpload = useImageUpload({
    userId: user?.id || "",
    bucket: "post-images",
    maxFileSize: 50 * 1024 * 1024, // 50MB
  });

  useEffect(() => {
    if (!authLoading && !user) {
      router.push("/signin");
    }
  }, [user, authLoading, router]);

  if (authLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-gray-900"></div>
      </div>
    );
  }

  if (!user) {
    return null;
  }

  const handleImageUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files;
    if (files && files[0] && user) {
      const file = files[0];

      try {
        // Clear previous image if exists (for single image mode)
        selectedImages.forEach((imageUrl) => URL.revokeObjectURL(imageUrl));

        // TODO: implement multiple image support
        const imageUrl = URL.createObjectURL(file);
        setSelectedImages([imageUrl]);
        setImageFiles([file]);
        imageUpload.clearError();
      } catch (error) {
        console.error("Error handling image upload:", error);
      }
    }
  };

  const removeImage = (index: number) => {
    // Revoke object URL to prevent memory leaks
    URL.revokeObjectURL(selectedImages[index]);
    setSelectedImages((prev) => prev.filter((_, i) => i !== index));
    setImageFiles((prev) => prev.filter((_, i) => i !== index));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!user) return;

    const createPostData: CreatePostData = {
      title: formData.title,
      originalLink: formData.originalLink,
      content: formData.content,
      executedDate: formData.executedDate,
      category: formData.category,
      userId: user.id,
    };

    await postOperations.createPostHandler(createPostData, imageFiles);

    // Reset form on success
    if (postOperations.success) {
      setFormData({
        title: "",
        originalLink: "",
        content: "",
        executedDate: "",
        category: "",
      });
      setSelectedImages([]);
      setImageFiles([]);
      imageUpload.resetState();
    }
  };

  const handleSaveAsDraft = async () => {
    if (!user) return;

    const createPostData: CreatePostData = {
      title: formData.title,
      originalLink: formData.originalLink,
      content: formData.content,
      executedDate: formData.executedDate,
      category: formData.category,
      userId: user.id,
    };

    await postOperations.saveDraftHandler(createPostData, imageFiles);
  };

  return (
    <ProtectedRoute>
      <div className="min-h-screen bg-gray-50">
        {/* Header */}
        <header className="bg-white border-b">
          <div className="container mx-auto px-4 py-4">
            <div className="flex items-center space-x-4">
              <Link href="/feed">
                <Button
                  variant="ghost"
                  size="sm"
                  className="flex items-center space-x-2"
                >
                  <ArrowLeft className="w-4 h-4" />
                  <span>Back</span>
                </Button>
              </Link>
              <h1 className="text-xl md:text-2xl font-bold text-gray-900">
                Create New Post
              </h1>
            </div>
          </div>
        </header>

        {/* Main Content */}
        <main className="container mx-auto px-4 py-8">
          <div className="max-w-2xl mx-auto">
            <Card>
              <CardHeader>
                <CardTitle>Share Your Discovery</CardTitle>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleSubmit} className="space-y-6">
                  {/* Title */}
                  <div className="space-y-2">
                    <Label htmlFor="title">Title *</Label>
                    <Input
                      id="title"
                      placeholder="Title"
                      value={formData.title}
                      onChange={(e) =>
                        setFormData((prev) => ({
                          ...prev,
                          title: e.target.value,
                        }))
                      }
                      required
                    />
                  </div>

                  {/* Original Link */}
                  <div className="space-y-2">
                    <Label htmlFor="originalLink">Original Link *</Label>
                    <Input
                      id="originalLink"
                      type="url"
                      placeholder="https://instagram.com/reel/... or https://youtube.com/watch?v=..."
                      value={formData.originalLink}
                      onChange={(e) =>
                        setFormData((prev) => ({
                          ...prev,
                          originalLink: e.target.value,
                        }))
                      }
                      required
                    />
                    <p className="text-xs text-gray-500">
                      Paste the link to the Instagram reel, YouTube video, or
                      other social media content
                    </p>
                  </div>

                  {/* Content */}
                  <div className="space-y-2">
                    <Label htmlFor="content">Your Thoughts *</Label>
                    <Textarea
                      id="content"
                      placeholder="What inspired you about this content? Share your thoughts, insights, or how it affected you..."
                      className="min-h-[120px] resize-none"
                      value={formData.content}
                      onChange={(e) =>
                        setFormData((prev) => ({
                          ...prev,
                          content: e.target.value,
                        }))
                      }
                      required
                    />
                  </div>

                  {/* Images */}
                  <div className="space-y-2">
                    <Label>Image *</Label>
                    <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center hover:border-gray-400 transition-colors">
                      <input
                        type="file"
                        accept="image/*"
                        onChange={handleImageUpload}
                        className="hidden"
                        id="image-upload"
                      />
                      <label htmlFor="image-upload" className="cursor-pointer">
                        <Upload className="w-8 h-8 mx-auto mb-2 text-gray-400" />
                        <p className="text-sm text-gray-600">
                          Click to upload an image or drag and drop
                        </p>
                        <p className="text-xs text-gray-400 mt-1">
                          PNG, JPG, GIF up to 50MB
                        </p>
                      </label>
                    </div>

                    {/* Image Preview*/}
                    {selectedImages.length > 0 && (
                      <div className="mt-4">
                        <div className="relative group inline-block">
                          <Image
                            src={selectedImages[0] || "/placeholder.svg"}
                            alt="Upload preview"
                            width={300}
                            height={200}
                            className="w-full max-w-sm h-48 object-cover rounded-lg"
                          />
                          <button
                            type="button"
                            onClick={() => removeImage(0)}
                            className="absolute top-2 right-2 bg-red-500 text-white rounded-full p-1 opacity-0 group-hover:opacity-100 transition-opacity"
                          >
                            <X className="w-4 h-4" />
                          </button>
                        </div>
                      </div>
                    )}
                  </div>

                  {/* Executed Date */}
                  <div className="space-y-2">
                    <Label htmlFor="executedDate">Executed Date *</Label>
                    <Input
                      id="executedDate"
                      type="date"
                      value={formData.executedDate}
                      onChange={(e) =>
                        setFormData((prev) => ({
                          ...prev,
                          executedDate: e.target.value,
                        }))
                      }
                      required
                    />
                  </div>

                  {/* Category */}
                  <div className="space-y-2">
                    <Label htmlFor="category">Category/Tag *</Label>
                    <Select
                      value={formData.category}
                      onValueChange={(value) =>
                        setFormData((prev) => ({ ...prev, category: value }))
                      }
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select a category" />
                      </SelectTrigger>
                      <SelectContent>
                        {POST_CATEGORIES.map((category) => (
                          <SelectItem key={category} value={category}>
                            {category}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  {/* Message Display */}
                  {(postOperations.error ||
                    postOperations.success ||
                    imageUpload.error) && (
                    <div
                      className={`p-4 rounded-lg text-sm ${
                        postOperations.error || imageUpload.error
                          ? "bg-red-50 text-red-700 border border-red-200"
                          : "bg-green-50 text-green-700 border border-green-200"
                      }`}
                    >
                      {postOperations.error ||
                        imageUpload.error ||
                        (postOperations.success &&
                          "Post created successfully!")}
                    </div>
                  )}

                  {/* Submit Button */}
                  <div className="flex flex-col sm:flex-row gap-3 pt-4">
                    <Button
                      type="submit"
                      className="flex-1"
                      disabled={postOperations.loading || imageUpload.uploading}
                    >
                      {postOperations.loading
                        ? "Publishing..."
                        : imageUpload.uploading
                          ? "Uploading..."
                          : "Publish Post"}
                    </Button>
                    <Button
                      type="button"
                      variant="outline"
                      className="flex-1 bg-transparent"
                      onClick={handleSaveAsDraft}
                      disabled={postOperations.loading}
                    >
                      Save as Draft
                    </Button>
                  </div>
                </form>
              </CardContent>
            </Card>
          </div>
        </main>
      </div>
    </ProtectedRoute>
  );
}
