import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/src/lib/supabase/server";
import { generateSignedImageUrl } from "@/src/lib/signed-url-generator";

export async function POST(request: NextRequest) {
  try {
    const supabase = await createClient();

    // Get current user
    const { data: { user }, error: authError } = await supabase.auth.getUser();
    
    if (authError || !user) {
      return NextResponse.json(
        { success: false, error: "Authentication required" },
        { status: 401 }
      );
    }

    const formData = await request.formData();
    
    // Extract form data
    const title = formData.get("title") as string;
    const originalLink = formData.get("originalLink") as string;
    const content = formData.get("content") as string;
    const executedDate = formData.get("executedDate") as string;
    const category = formData.get("category") as string;
    const imageFile = formData.get("image") as File;

    // Validate required fields
    const errors: string[] = [];
    
    if (!title?.trim()) errors.push("Title is required");
    if (title && title.length > 200) errors.push("Title must be less than 200 characters");
    
    if (!originalLink?.trim()) {
      errors.push("Original link is required");
    } else {
      try {
        new URL(originalLink);
      } catch {
        errors.push("Please enter a valid URL");
      }
    }
    
    if (!content?.trim()) errors.push("Your thoughts are required");
    if (content && content.length > 2000) errors.push("Content must be less than 2000 characters");
    
    if (!executedDate) {
      errors.push("Executed date is required");
    } else {
      const selectedDate = new Date(executedDate);
      const today = new Date();
      if (selectedDate > today) {
        errors.push("Executed date cannot be in the future");
      }
    }
    
    if (!category) errors.push("Category is required");
    if (!imageFile) errors.push("Image is required");

    if (errors.length > 0) {
      return NextResponse.json(
        { success: false, error: errors.join(", ") },
        { status: 400 }
      );
    }

    // Upload image using server-side Supabase client
    let imageUrl: string | null = null;
    if (imageFile) {
      try {
        // Validate image file
        if (imageFile.size > 50 * 1024 * 1024) { // 50MB
          return NextResponse.json(
            { success: false, error: "File size too large. Maximum size is 50MB." },
            { status: 400 }
          );
        }

        const allowedTypes = ["image/jpeg", "image/jpg", "image/png", "image/gif", "image/webp"];
        if (!allowedTypes.includes(imageFile.type)) {
          return NextResponse.json(
            { success: false, error: "Invalid file type. Allowed types: JPEG, PNG, GIF, WebP" },
            { status: 400 }
          );
        }

        // Sanitize filename
        function sanitizeFileName(fileName: string): string {
          const lastDotIndex = fileName.lastIndexOf('.');
          const name = lastDotIndex > 0 ? fileName.substring(0, lastDotIndex) : fileName;
          const extension = lastDotIndex > 0 ? fileName.substring(lastDotIndex) : '';
          const sanitizedName = name.replace(/[^a-zA-Z0-9._-]/g, '_');
          const cleanName = sanitizedName.replace(/^[._-]+|[._-]+$/g, '');
          return cleanName + extension;
        }

        // Generate unique filename
        const timestamp = Date.now();
        const randomSuffix = Math.random().toString(36).substring(2, 8);
        const sanitizedOriginalName = sanitizeFileName(imageFile.name);
        const fileName = `${user.id}/${timestamp}_${randomSuffix}_${sanitizedOriginalName}`;

        // Upload to Supabase Storage using server client
        const { error: uploadError } = await supabase.storage
          .from("post-images")
          .upload(fileName, imageFile, {
            cacheControl: '3600',
            upsert: false
          });

        if (uploadError) {
          console.error("Image upload error:", uploadError);
          return NextResponse.json(
            { success: false, error: `Failed to upload image: ${uploadError.message}` },
            { status: 500 }
          );
        }

        // Get public URL
        const { data: { publicUrl } } = supabase.storage
          .from("post-images")
          .getPublicUrl(fileName);

        imageUrl = publicUrl;
      } catch (error) {
        console.error("Image upload error:", error);
        return NextResponse.json(
          { success: false, error: "Failed to upload image" },
          { status: 500 }
        );
      }
    }

    // Insert post into database
    const { data: createdPost, error } = await supabase
      .from("posts")
      .insert({
        user_id: user.id,
        title: title.trim(),
        bookmark_url: originalLink.trim(),
        executed_at: executedDate,
        review: content.trim(),
        images: imageUrl,
        category: category,
        is_public: false,
      })
      .select()
      .single();

    if (error) {
      console.error("Database insert error:", error);
      return NextResponse.json(
        { success: false, error: `Failed to create post: ${error.message}` },
        { status: 500 }
      );
    }

    return NextResponse.json({
      success: true,
      data: createdPost
    });

  } catch (error) {
    console.error("API error:", error);
    return NextResponse.json(
      { success: false, error: "An unexpected error occurred" },
      { status: 500 }
    );
  }
}

export async function GET() {
  try {
    const supabase = await createClient();

    // Get current user
    const { data: { user }, error: authError } = await supabase.auth.getUser();
    
    if (authError || !user) {
      return NextResponse.json(
        { success: false, error: "Authentication required" },
        { status: 401 }
      );
    }

    // Fetch user's posts
    const { data: posts, error } = await supabase
      .from("posts")
      .select("*")
      .eq("user_id", user.id)
      .order("created_at", { ascending: false });

    if (error) {
      console.error("Failed to fetch posts:", error);
      return NextResponse.json(
        { success: false, error: "Failed to fetch posts" },
        { status: 500 }
      );
    }

    const postsWithSignedUrls = await Promise.all(
      (posts || []).map(async (post) => ({
        ...post,
        images: await generateSignedImageUrl(supabase, post.images),
      }))
    );

    return NextResponse.json({
      success: true,
      data: postsWithSignedUrls,
    });

  } catch (error) {
    console.error("API error:", error);
    return NextResponse.json(
      { success: false, error: "An unexpected error occurred" },
      { status: 500 }
    );
  }
}