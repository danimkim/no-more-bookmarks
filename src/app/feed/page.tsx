import { Button } from "@/src/components/ui/button";
import {
  Plus,
  ArrowLeft,
} from "lucide-react";
import Link from "next/link";
import { ProtectedRoute } from "@/src/components/ProtectedRoute";
import { getPosts } from "@/src/lib/posts";
import { PhotoTile } from "@/src/components/PhotoTile";
import { SignOutButton } from "@/src/components/SignOutButton";

export default async function FeedPage() {
  const { posts, error } = await getPosts();

  return (
    <ProtectedRoute>
      <div className="min-h-screen bg-gray-50">
        {/* Header */}
        <header className="bg-white border-b sticky top-0 z-50">
          <div className="container mx-auto px-4 py-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-4">
                <Link href="/">
                  <Button
                    variant="ghost"
                    size="sm"
                    className="flex items-center space-x-2"
                  >
                    <ArrowLeft className="w-4 h-4" />
                    <span className="hidden sm:inline">Home</span>
                  </Button>
                </Link>
                <h1 className="text-xl md:text-2xl font-bold text-gray-900">
                  Feed
                </h1>
              </div>
              <div className="flex items-center space-x-2">
                <Link href="/create">
                  <Button className="flex items-center space-x-2">
                    <Plus className="w-4 h-4" />
                    <span className="hidden sm:inline">Create Post</span>
                  </Button>
                </Link>
                <SignOutButton />
              </div>
            </div>
          </div>
        </header>

        {/* Main Content */}
        <main className="container mx-auto px-4 py-8">
          {/* Error State */}
          {error && (
            <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-8">
              <p className="text-red-600 text-sm">{error}</p>
            </div>
          )}

          {/* Empty State */}
          {!error && posts.length === 0 && (
            <div className="text-center py-8">
              <p className="text-gray-500 mb-4">No posts yet.</p>
              <Link href="/create">
                <Button>Create your first post</Button>
              </Link>
            </div>
          )}

          {/* Posts Grid */}
          {posts.length > 0 && (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-1 md:gap-2">
              {posts.map((post) => (
                post.images && (
                  <PhotoTile
                    key={post.id}
                    imageUrl={post.images}
                    title={post.title}
                    category={post.category}
                    postId={post.id}
                  />
                )
              ))}
            </div>
          )}
        </main>
      </div>
    </ProtectedRoute>
  );
}
