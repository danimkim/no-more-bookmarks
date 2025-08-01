import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/src/lib/supabase/server";
import { generateSignedImageUrl } from "@/src/lib/signed-url-generator";
import { uploadImage } from "@/src/lib/image-upload";

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const supabase = await createClient();

    const {
      data: { user },
      error: authError,
    } = await supabase.auth.getUser();

    if (authError || !user) {
      return NextResponse.json(
        { success: false, error: "Authentication required" },
        { status: 401 }
      );
    }

    const { data: post, error } = await supabase
      .from("posts")
      .select("*")
      .eq("id", id)
      .eq("user_id", user.id)
      .single();

    if (error) {
      console.error("Failed to fetch post:", error);
      if (error.code === "PGRST116") {
        return NextResponse.json(
          { success: false, error: "Post not found" },
          { status: 404 }
        );
      }
      return NextResponse.json(
        { success: false, error: "Failed to fetch post" },
        { status: 500 }
      );
    }

    // Generate signed URL for image
    post.images = await generateSignedImageUrl(supabase, post.images);

    return NextResponse.json({
      success: true,
      data: post,
    });
  } catch (error) {
    console.error("API error:", error);
    return NextResponse.json(
      { success: false, error: "An unexpected error occurred" },
      { status: 500 }
    );
  }
}

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const supabase = await createClient();

    const {
      data: { user },
      error: authError,
    } = await supabase.auth.getUser();

    if (authError || !user) {
      return NextResponse.json(
        { success: false, error: "Authentication required" },
        { status: 401 }
      );
    }

    // Verify post exists and belongs to user
    const { data: existingPost, error: fetchError } = await supabase
      .from("posts")
      .select("*")
      .eq("id", id)
      .eq("user_id", user.id)
      .single();

    if (fetchError || !existingPost) {
      return NextResponse.json(
        { success: false, error: "Post not found" },
        { status: 404 }
      );
    }

    const formData = await request.formData();
    const title = formData.get("title") as string;
    const originalLink = formData.get("originalLink") as string;
    const content = formData.get("content") as string;
    const executedDate = formData.get("executedDate") as string;
    const category = formData.get("category") as string;
    const image = formData.get("image") as File | null;

    if (!title || !originalLink || !content || !executedDate || !category) {
      return NextResponse.json(
        { success: false, error: "Missing required fields" },
        { status: 400 }
      );
    }

    let imageUrl = existingPost.images; // Keep existing image by default

    // Handle image upload if new image provided
    if (image && image.size > 0) {
      try {
        const uploadResult = await uploadImage(image, {
          userId: user.id,
          bucket: "post-images",
        });
        imageUrl = uploadResult.fileName;
      } catch (uploadError) {
        console.error("Image upload error:", uploadError);
        return NextResponse.json(
          { success: false, error: "Image upload failed" },
          { status: 500 }
        );
      }
    }

    // Update post
    const { data, error } = await supabase
      .from("posts")
      .update({
        title,
        bookmark_url: originalLink,
        review: content,
        executed_at: executedDate,
        category,
        images: imageUrl,
        updated_at: new Date().toISOString(),
      })
      .eq("id", id)
      .eq("user_id", user.id)
      .select()
      .single();

    if (error) {
      console.error("Failed to update post:", error);
      return NextResponse.json(
        { success: false, error: "Failed to update post" },
        { status: 500 }
      );
    }

    return NextResponse.json({
      success: true,
      data,
    });
  } catch (error) {
    console.error("API error:", error);
    return NextResponse.json(
      { success: false, error: "An unexpected error occurred" },
      { status: 500 }
    );
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const supabase = await createClient();

    const {
      data: { user },
      error: authError,
    } = await supabase.auth.getUser();

    if (authError || !user) {
      return NextResponse.json(
        { success: false, error: "Authentication required" },
        { status: 401 }
      );
    }

    // Verify post exists and belongs to user
    const { data: existingPost, error: fetchError } = await supabase
      .from("posts")
      .select("*")
      .eq("id", id)
      .eq("user_id", user.id)
      .single();

    if (fetchError || !existingPost) {
      return NextResponse.json(
        { success: false, error: "Post not found" },
        { status: 404 }
      );
    }

    // Delete the post
    const { error: deleteError } = await supabase
      .from("posts")
      .delete()
      .eq("id", id)
      .eq("user_id", user.id);

    if (deleteError) {
      console.error("Failed to delete post:", deleteError);
      return NextResponse.json(
        { success: false, error: "Failed to delete post" },
        { status: 500 }
      );
    }

    // Optionally delete associated image from storage
    if (existingPost.images) {
      try {
        const { error: storageError } = await supabase.storage
          .from("post-images")
          .remove([existingPost.images]);

        if (storageError) {
          console.warn("Failed to delete image from storage:", storageError);
          // Don't fail the request if image deletion fails
        }
      } catch (storageError) {
        console.warn("Error deleting image from storage:", storageError);
      }
    }

    return NextResponse.json({
      success: true,
      message: "Post deleted successfully",
    });
  } catch (error) {
    console.error("API delete error:", error);
    return NextResponse.json(
      { success: false, error: "An unexpected error occurred" },
      { status: 500 }
    );
  }
}
