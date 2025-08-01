"use server";

import { createClient } from "@/src/lib/supabase/server";
import { redirect } from "next/navigation";

export async function deleteUserAccountAction(): Promise<{
  success: boolean;
  error: string | null;
}> {
  try {
    const supabase = await createClient();

    const {
      data: { user },
      error: authError,
    } = await supabase.auth.getUser();

    if (authError || !user) {
      return { success: false, error: "Authentication required" };
    }

    // TODO: implement user account deletion via admin API using service role key
    // First delete all user's posts
    const { error: postsError } = await supabase
      .from("posts")
      .delete()
      .eq("user_id", user.id);

    if (postsError) {
      console.error("Failed to delete user posts:", postsError);
      return { success: false, error: "Failed to delete user data" };
    }

    // Sign out the user before deleting the account
    await supabase.auth.signOut();

    return { success: true, error: null };
  } catch (error) {
    console.error("Server error during account deletion:", error);
    return { success: false, error: "An unexpected error occurred" };
  }
}

export async function deleteUserAccountAndRedirect() {
  const result = await deleteUserAccountAction();

  if (result.success) {
    redirect("/");
  }

  return result;
}
