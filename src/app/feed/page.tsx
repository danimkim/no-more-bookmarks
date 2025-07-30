import { Button } from "@/src/components/ui/button";
import {
  Heart,
  MessageCircle,
  Share2,
  ExternalLink,
  Plus,
  ArrowLeft,
} from "lucide-react";
import Link from "next/link";
import { ProtectedRoute } from "@/src/components/ProtectedRoute";
import { getPosts } from "@/src/lib/posts";
import { PostImage } from "@/src/components/PostImage";

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
              <Link href="/create">
                <Button className="flex items-center space-x-2">
                  <Plus className="w-4 h-4" />
                  <span className="hidden sm:inline">Create Post</span>
                </Button>
              </Link>
            </div>
          </div>
        </header>

        {/* Main Content */}
        <main className="container mx-auto px-4 py-8">
          <div className="max-w-2xl mx-auto space-y-8">
            {/* Error State */}
            {error && (
              <div className="bg-red-50 border border-red-200 rounded-lg p-4">
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

            {/* Posts Feed */}
            {posts.map((post) => (
              <div
                key={post.id}
                className="bg-white rounded-xl overflow-hidden shadow-sm hover:shadow-md transition-all duration-300 border border-gray-100"
              >
                {/* Image */}
                {post.images && (
                  <div className="aspect-[4/3] overflow-hidden bg-gray-100">
                    <PostImage
                      src={post.images}
                      alt={post.title}
                      width={400}
                      height={300}
                      className="w-full h-full object-cover"
                    />
                  </div>
                )}

                {/* Content */}
                <div className="p-6">
                  <h3 className="font-semibold text-lg text-gray-900 mb-3 line-clamp-2 leading-snug">
                    {post.title}
                  </h3>
                  <p className="text-gray-600 text-sm line-clamp-3 mb-4 leading-relaxed">
                    {post.review}
                  </p>
                  <p className="text-sm text-gray-500 mb-4">
                    {new Date(post.executed_at).toLocaleDateString("en-US", {
                      year: "numeric",
                      month: "long",
                      day: "numeric",
                    })}
                  </p>
                  <div className="flex items-center space-x-2 p-3 bg-gray-50 rounded-lg mb-4">
                    <ExternalLink className="w-4 h-4 text-gray-500 flex-shrink-0" />
                    <a
                      href={post.bookmark_url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-sm text-blue-600 hover:underline truncate flex-1"
                    >
                      {post.bookmark_url}
                    </a>
                  </div>

                  <div className="flex items-center justify-between">
                    <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-gray-100 text-gray-700">
                      {post.category}
                    </span>
                    <div className="flex items-center space-x-4">
                      {/* <Button
                        variant="ghost"
                        size="sm"
                        className="text-gray-400 hover:text-gray-600"
                      >
                        <Heart className="w-4 h-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        className="text-gray-400 hover:text-gray-600"
                      >
                        <MessageCircle className="w-4 h-4" />
                      </Button> */}
                      <Button
                        variant="ghost"
                        size="sm"
                        className="text-gray-400 hover:text-gray-600"
                      >
                        <Share2 className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </main>
      </div>
    </ProtectedRoute>
  );
}
