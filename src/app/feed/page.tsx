import { Button } from "@/src/components/ui/button";
import { Plus } from "lucide-react";
import Link from "next/link";
import Image from "next/image";
import { ProtectedRoute } from "@/src/components/ProtectedRoute";
import { getPosts, getUserProfile } from "@/src/lib/posts";
import { PhotoTile } from "@/src/components/PhotoTile";
import { BottomNavbar } from "@/src/components/BottomNavbar";
import { SettingsDrawer } from "@/src/components/SettingsDrawer";

export default async function FeedPage() {
  const { posts, error } = await getPosts();
  const { profile, error: profileError } = await getUserProfile();

  return (
    <ProtectedRoute>
      <div className="min-h-screen bg-white">
        {/* Header */}
        <header className="bg-white border-b sticky top-0 z-50">
          <div className="max-w-4xl mx-auto px-4 py-3">
            <div className="flex items-center justify-between">
              <span>No More Bookmarks</span>
              <SettingsDrawer />
            </div>
          </div>
        </header>

        {/* Main Content */}
        <main className="max-w-4xl mx-auto px-4 pb-20 md:pb-0 relative">
          {/* Profile Section */}
          <div className="py-8">
            <div className="flex flex-col md:flex-row items-center md:items-start space-y-6 md:space-y-0 md:space-x-8">
              {/* Avatar */}
              <div className="flex-shrink-0">
                <div className="w-32 h-32 md:w-40 md:h-40 rounded-full overflow-hidden border-2 border-gray-200">
                  {profile?.avatar_url ? (
                    <Image
                      src={profile.avatar_url}
                      alt={profile.username || "User"}
                      width={160}
                      height={160}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <div className="w-full h-full bg-gray-100 flex items-center justify-center">
                      <h1 className="text-4xl md:text-5xl text-gray-400 font-semibold">
                        {(profile?.username || "U").charAt(0).toUpperCase()}
                      </h1>
                    </div>
                  )}
                </div>
              </div>

              {/* Profile Info */}
              <div className="flex-1 text-center md:text-left">
                <div className="mb-4">
                  <h2 className="text-2xl font-light mb-2">
                    {profile?.username || "User"}
                  </h2>
                  <div className="flex justify-center md:justify-start space-x-8 text-sm">
                    <span>
                      <strong>{profile?.postCount || 0}</strong> posts
                    </span>
                  </div>
                </div>

                {profile?.full_name && (
                  <div className="mb-2">
                    <span className="font-semibold text-sm">
                      {profile.full_name}
                    </span>
                  </div>
                )}

                <div className="flex justify-center md:justify-start space-x-2 mt-4">
                  <Button variant="outline" size="sm">
                    Edit profile
                  </Button>
                </div>
              </div>
            </div>
          </div>
          {/* Error States */}
          {(error || profileError) && (
            <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-8">
              <p className="text-red-600 text-sm">{error || profileError}</p>
            </div>
          )}

          {/* Posts Section */}
          <div className="border-t">
            <div className="py-4">
              <div className="flex justify-center">
                <div className="flex items-center space-x-1 text-xs font-semibold text-gray-500 uppercase tracking-wide"></div>
              </div>
            </div>

            {/* Empty State */}
            {!error && posts.length === 0 && (
              <div className="text-center py-12">
                <div className="mb-4">
                  <div className="w-16 h-16 mx-auto border-2 border-black rounded-full flex items-center justify-center">
                    <Plus className="w-8 h-8" />
                  </div>
                </div>
                <h3 className="text-2xl font-light mb-2">Share Photos</h3>
                <p className="text-gray-500 mb-4">
                  When you share photos, they will appear on your profile.
                </p>
                <Link href="/create">
                  <Button
                    variant="link"
                    className="text-blue-500 font-semibold"
                  >
                    Share your first photo
                  </Button>
                </Link>
              </div>
            )}

            {/* Posts Grid */}
            {posts.length > 0 && (
              <div className="grid grid-cols-3 gap-1">
                {posts.map(
                  (post) =>
                    post.images && (
                      <PhotoTile
                        key={post.id}
                        imageUrl={post.images}
                        title={post.title}
                        category={post.category}
                        postId={post.id}
                      />
                    )
                )}
              </div>
            )}
          </div>
        </main>

        <BottomNavbar />

        {/* Floating Action Button - Medium screens and up */}
        <div className="hidden md:block fixed inset-0 pointer-events-none z-50">
          <div className="max-w-4xl mx-auto px-4 h-full relative">
            <Link href="/create" className="pointer-events-auto">
              <Button
                size="icon"
                className="absolute bottom-8 right-0 h-14 w-14 rounded-full shadow-lg hover:shadow-xl transition-shadow"
              >
                <Plus className="h-6 w-6" />
              </Button>
            </Link>
          </div>
        </div>
      </div>
    </ProtectedRoute>
  );
}
