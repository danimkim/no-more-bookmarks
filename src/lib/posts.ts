import { createClient } from "@/src/lib/supabase/server";
import { generateSignedImageUrl } from "@/src/lib/signed-url-generator";

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

export async function getPostById(
  id: string
): Promise<{ post: Post | null; error: string | null }> {
  try {
    const supabase = await createClient();

    const {
      data: { user },
      error: authError,
    } = await supabase.auth.getUser();

    if (authError || !user) {
      return { post: null, error: "Authentication required" };
    }

    const { data: post, error } = await supabase
      .from("posts")
      .select("*")
      .eq("id", id)
      .eq("user_id", user.id)
      .single();

    if (error) {
      console.error("Failed to fetch post:", error);
      return { post: null, error: "Post not found" };
    }

    post.images = await generateSignedImageUrl(supabase, post.images);

    return { post, error: null };
  } catch (error) {
    console.error("Server error:", error);
    return { post: null, error: "An unexpected error occurred" };
  }
}

export async function getPosts(): Promise<{
  posts: Post[];
  error: string | null;
}> {
  try {
    const supabase = await createClient();

    const {
      data: { user },
      error: authError,
    } = await supabase.auth.getUser();

    if (authError || !user) {
      return { posts: [], error: "Authentication required" };
    }

    const { data: posts, error } = await supabase
      .from("posts")
      .select("*")
      .eq("user_id", user.id)
      .order("created_at", { ascending: false });

    if (error) {
      console.error("Failed to fetch posts:", error);
      return { posts: [], error: "Failed to fetch posts" };
    }

    const postsWithSignedUrls = await Promise.all(
      (posts || []).map(async (post) => ({
        ...post,
        images: await generateSignedImageUrl(supabase, post.images),
      }))
    );

    return { posts: postsWithSignedUrls, error: null };
  } catch (error) {
    console.error("Server error:", error);
    return { posts: [], error: "An unexpected error occurred" };
  }
}
