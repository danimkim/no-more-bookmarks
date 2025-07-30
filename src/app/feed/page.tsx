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
import Image from "next/image";
import { ProtectedRoute } from "@/src/components/ProtectedRoute";

export default function FeedPage() {
  const posts = [
    {
      id: 1,
      title: "Amazing Street Art in Tokyo",
      content:
        "Found this incredible mural while exploring Shibuya. The way the artist used colors to represent urban life is just mesmerizing. This Instagram reel really captured the essence of modern Japanese street culture.",
      originalLink: "https://instagram.com/reel/example1",
      author: "Alex Chen",
      executedDate: "2024-01-15",
      category: "Art & Culture",
      image: "/placeholder.svg?height=300&width=400",
      likes: 24,
      comments: 8,
    },
    {
      id: 2,
      title: "Minimalist Home Setup Tour",
      content:
        "This YouTube video completely changed my perspective on living spaces. The creator shows how to achieve maximum functionality with minimal items. Definitely implementing some of these ideas in my own space.",
      originalLink: "https://youtube.com/watch?v=example2",
      author: "Sarah Kim",
      executedDate: "2024-01-14",
      category: "Lifestyle",
      image: "/placeholder.svg?height=300&width=400",
      likes: 42,
      comments: 15,
    },
    {
      id: 3,
      title: "Cooking Technique That Blew My Mind",
      content:
        "Never thought about using this method for pasta before! This TikTok chef's approach to creating the perfect sauce consistency is genius. Tried it last night and the results were incredible.",
      originalLink: "https://tiktok.com/@chef/video/example3",
      author: "Mike Rodriguez",
      executedDate: "2024-01-13",
      category: "Food & Cooking",
      likes: 18,
      comments: 5,
    },
    {
      id: 4,
      title: "Incredible Time-lapse Photography",
      content:
        "This photographer's approach to capturing city life through time-lapse is absolutely stunning. The way they show the flow of people and traffic creates such a beautiful narrative about urban rhythm.",
      originalLink: "https://instagram.com/reel/example4",
      author: "Emma Wilson",
      executedDate: "2024-01-12",
      category: "Photography",
      image: "/placeholder.svg?height=300&width=400",
      likes: 67,
      comments: 12,
    },
    {
      id: 5,
      title: "Revolutionary Workout Routine",
      content:
        "Found this fitness influencer who completely changed my understanding of home workouts. No equipment needed, just 15 minutes a day. The results after just two weeks are incredible!",
      originalLink: "https://youtube.com/watch?v=example5",
      author: "David Park",
      executedDate: "2024-01-11",
      category: "Fitness",
      image: "/placeholder.svg?height=300&width=400",
      likes: 89,
      comments: 23,
    },
  ];

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
            {/* Posts Feed */}
            {posts.map((post) => (
              <div
                key={post.id}
                className="bg-white rounded-xl overflow-hidden shadow-sm hover:shadow-md transition-all duration-300 border border-gray-100"
              >
                {/* Image at top */}
                {post.image && (
                  <div className="aspect-[4/3] overflow-hidden">
                    <Image
                      src={post.image || "/placeholder.svg"}
                      alt={post.title}
                      width={400}
                      height={300}
                      className="w-full h-full object-cover"
                    />
                  </div>
                )}

                {/* Content */}
                <div className="p-6">
                  {/* Title */}
                  <h3 className="font-semibold text-lg text-gray-900 mb-3 line-clamp-2 leading-snug">
                    {post.title}
                  </h3>

                  {/* Content preview */}
                  <p className="text-gray-600 text-sm line-clamp-3 mb-4 leading-relaxed">
                    {post.content}
                  </p>

                  {/* Date */}
                  <p className="text-sm text-gray-500 mb-4">
                    {new Date(post.executedDate).toLocaleDateString("en-US", {
                      year: "numeric",
                      month: "long",
                      day: "numeric",
                    })}
                  </p>

                  {/* Original Link */}
                  <div className="flex items-center space-x-2 p-3 bg-gray-50 rounded-lg mb-4">
                    <ExternalLink className="w-4 h-4 text-gray-500 flex-shrink-0" />
                    <a
                      href={post.originalLink}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-sm text-blue-600 hover:underline truncate flex-1"
                    >
                      {post.originalLink}
                    </a>
                  </div>

                  {/* Bottom row with category and interactions */}
                  <div className="flex items-center justify-between">
                    <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-gray-100 text-gray-700">
                      {post.category.toLowerCase()}
                    </span>

                    <div className="flex items-center space-x-4">
                      <div className="flex items-center space-x-1 text-gray-400">
                        <Heart className="w-4 h-4" />
                        <span className="text-sm">{post.likes}</span>
                      </div>
                      <div className="flex items-center space-x-1 text-gray-400">
                        <MessageCircle className="w-4 h-4" />
                        <span className="text-sm">{post.comments}</span>
                      </div>
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
