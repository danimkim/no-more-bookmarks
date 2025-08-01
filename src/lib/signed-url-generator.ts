import { SupabaseClient } from "@supabase/supabase-js";

export async function generateSignedImageUrl(
  supabase: SupabaseClient,
  imageUrl: string | null,
  expiresIn: number = 3600
): Promise<string | null> {
  if (!imageUrl) {
    return null;
  }

  try {
    let fileName = imageUrl;
    
    // If it's a full URL, extract the filename from the path
    if (imageUrl.startsWith('http')) {
      const url = new URL(imageUrl);
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
      .createSignedUrl(fileName, expiresIn);
    
    if (!signError && signedUrl) {
      return signedUrl.signedUrl;
    } else {
      console.error("Failed to generate signed URL:", signError);
      return null;
    }
  } catch (urlError) {
    // If URL parsing fails, return null
    console.warn("Failed to parse image URL:", urlError);
    return null;
  }
}