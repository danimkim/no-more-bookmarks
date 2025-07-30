import { createClient } from "@/src/lib/supabase/server";

export interface Post {
  id: number;
  title: string;
  bookmark_url: string;
  review: string;
  executed_at: string;
  category: string;
  images: string | null;
  created_at: string;
  user_id: string;
  is_public: boolean;
}

export async function getPosts(): Promise<{ posts: Post[]; error: string | null }> {
  try {
    const supabase = await createClient();

    // Get current user
    const { data: { user }, error: authError } = await supabase.auth.getUser();
    
    if (authError || !user) {
      return { posts: [], error: "Authentication required" };
    }

    // Fetch user's posts
    const { data: posts, error } = await supabase
      .from("posts")
      .select("*")
      .eq("user_id", user.id)
      .order("created_at", { ascending: false });

    if (error) {
      console.error("Failed to fetch posts:", error);
      return { posts: [], error: "Failed to fetch posts" };
    }

    // Generate signed URLs for private images
    const postsWithSignedUrls = await Promise.all(
      (posts || []).map(async (post) => {
        if (post.images) {
          try {
            let fileName = post.images;
            
            // If it's a full URL, extract the filename from the path
            if (post.images.startsWith('http')) {
              const url = new URL(post.images);
              // Extract everything after '/storage/v1/object/public/post-images/'
              const pathMatch = url.pathname.match(/\/storage\/v1\/object\/public\/post-images\/(.+)$/);
              if (pathMatch) {
                fileName = pathMatch[1];
              } else {
                // Fallback: get the last part of the path
                const pathParts = url.pathname.split('/');
                fileName = pathParts[pathParts.length - 1];
              }
            }
            
            // Generate signed URL for private bucket
            const { data: signedUrl, error: signError } = await supabase.storage
              .from("post-images")
              .createSignedUrl(fileName, 3600); // 1 hour expiry
            
            if (!signError && signedUrl) {
              return { ...post, images: signedUrl.signedUrl };
            } else {
              console.error("Failed to generate signed URL:", signError);
              return { ...post, images: null }; // Remove broken image reference
            }
          } catch (urlError) {
            // If URL parsing fails, remove image reference
            console.warn("Failed to parse image URL:", urlError);
            return { ...post, images: null };
          }
        }
        return post;
      })
    );

    return { posts: postsWithSignedUrls, error: null };
  } catch (error) {
    console.error("Server error:", error);
    return { posts: [], error: "An unexpected error occurred" };
  }
}