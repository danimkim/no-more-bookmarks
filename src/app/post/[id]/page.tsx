"use client";

import { Button } from "@/src/components/ui/button";
import { ArrowLeft, ExternalLink, Calendar, Tag, Share } from "lucide-react";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ProtectedRoute } from "@/src/components/ProtectedRoute";
import { PostImage } from "@/src/components/PostImage";
import { useEffect, useState } from "react";
import { Post } from "@/src/lib/posts";

interface PostPageProps {
  params: Promise<{
    id: string;
  }>;
}

export default function PostPage({ params }: PostPageProps) {
  const [post, setPost] = useState<Post | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchPost() {
      try {
        const resolvedParams = await params;
        const response = await fetch(`/api/posts/${resolvedParams.id}`);
        const result = await response.json();

        if (!response.ok || !result.success) {
          setError(result.error || "Post not found");
        } else {
          setPost(result.data);
        }
      } catch (err) {
        setError("Failed to load post");
      } finally {
        setLoading(false);
      }
    }

    fetchPost();
  }, [params]);

  if (loading) {
    return (
      <ProtectedRoute>
        <div className="min-h-screen bg-gray-50 flex items-center justify-center">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
            <p className="text-gray-600">Loading post...</p>
          </div>
        </div>
      </ProtectedRoute>
    );
  }

  if (error || !post) {
    notFound();
  }

  return (
    <ProtectedRoute>
      <div className="min-h-screen bg-gray-50">
        {/* Header */}
        <header className="bg-white border-b sticky top-0 z-50">
          <div className="container mx-auto px-4 py-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-4">
                <Link href="/feed">
                  <Button
                    variant="ghost"
                    size="sm"
                    className="flex items-center space-x-2"
                  >
                    <ArrowLeft className="w-4 h-4" />
                    <span className="hidden sm:inline">Back to Feed</span>
                  </Button>
                </Link>
              </div>
            </div>
          </div>
        </header>

        {/* Main Content */}
        <main className="container mx-auto px-4 py-8 max-w-3xl">
          <article className="bg-white rounded-lg border shadow-sm overflow-hidden">
            {/* Post Header */}
            <div className="p-6 md:p-8 pb-4">
              {/* Title */}
              <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4 leading-tight">
                {post.title}
              </h1>

              {/* Meta Information */}
              <div className="flex flex-wrap items-center gap-6 text-sm text-gray-600 mb-6">
                <div className="flex items-center space-x-2">
                  <Calendar className="w-4 h-4" />
                  <span>{new Date(post.created_at).toLocaleDateString()}</span>
                </div>

                {post.executed_at && (
                  <div className="flex items-center space-x-2">
                    <Calendar className="w-4 h-4" />
                    <span>
                      Executed {new Date(post.executed_at).toLocaleDateString()}
                    </span>
                  </div>
                )}

                <div className="flex items-center space-x-2">
                  <Tag className="w-4 h-4" />
                  <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-blue-100 text-blue-800">
                    {post.category}
                  </span>
                </div>
              </div>

              {/* Original Content (Bookmark URL) */}
              {post.bookmark_url && (
                <div className="mb-6 p-4 bg-gray-50 rounded-lg border-l-4 border-gray-500">
                  <div className="flex items-start space-x-2">
                    <ExternalLink className="w-5 h-5 text-gray-500 mt-0.5 flex-shrink-0" />
                    <div>
                      <p className="text-sm font-medium text-gray-700 mb-1">
                        Inspired by:
                      </p>
                      <a
                        href={post.bookmark_url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-blue-600 hover:text-blue-800 hover:underline break-all text-sm"
                      >
                        {post.bookmark_url}
                      </a>
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Post Image */}
            {post.images && (
              <div className="relative aspect-video md:aspect-[4/3] bg-gray-100 mx-6 md:mx-8 mb-6 rounded-lg overflow-hidden">
                <PostImage
                  src={post.images}
                  alt={post.title}
                  width={800}
                  height={600}
                  className="w-full h-full object-cover"
                />
              </div>
            )}

            {/* Review Content */}
            <div className="px-6 md:px-8 pb-6">
              {post.review && (
                <div className="prose prose-lg prose-gray max-w-none">
                  <div className="text-gray-700 leading-relaxed whitespace-pre-wrap text-lg">
                    {post.review}
                  </div>
                </div>
              )}

              {/* Share Button */}
              <div className="flex justify-end mt-8 pt-6 border-t border-gray-100">
                <Button
                  variant="outline"
                  size="sm"
                  className="flex items-center space-x-2 text-gray-600 hover:text-gray-900"
                  onClick={() => {
                    if (navigator.share) {
                      navigator.share({
                        title: post.title,
                        url: window.location.href,
                      });
                    } else {
                      navigator.clipboard.writeText(window.location.href);
                    }
                  }}
                >
                  <Share className="w-4 h-4" />
                  <span>Share</span>
                </Button>
              </div>
            </div>
          </article>
        </main>
      </div>
    </ProtectedRoute>
  );
}
