"use server";

import { createServerClient } from "@supabase/ssr";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";

export interface AuthResult {
  success: boolean;
  message: string;
  requiresConfirmation?: boolean;
}

export async function signUpAction(formData: FormData): Promise<AuthResult> {
  const email = formData.get("email") as string;
  const password = formData.get("password") as string;
  const confirmPassword = formData.get("confirmPassword") as string;

  // Validation
  if (!email || !password || !confirmPassword) {
    return {
      success: false,
      message: "All fields are required",
    };
  }

  if (password !== confirmPassword) {
    return {
      success: false,
      message: "Passwords do not match!",
    };
  }

  if (password.length < 6) {
    return {
      success: false,
      message: "Password must be at least 6 characters long.",
    };
  }

  try {
    const cookieStore = await cookies();
    const supabase = createServerClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
      {
        cookies: {
          getAll() {
            return cookieStore.getAll();
          },
          setAll(cookiesToSet) {
            cookiesToSet.forEach(({ name, value, options }) => {
              cookieStore.set(name, value, options);
            });
          },
        },
      }
    );

    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        emailRedirectTo: `${process.env.NEXT_PUBLIC_SITE_URL}/signin`,
      },
    });

    if (error) {
      console.error("Signup error:", error);
      return {
        success: false,
        message: error.message,
      };
    }

    // Check for existing user: if identities array is empty, user already exists
    if (
      data.user &&
      data.user.identities &&
      data.user.identities.length === 0
    ) {
      return {
        success: false,
        message:
          "This email has already been signed up. Please try signing in instead.",
      };
    }

    // Additional check: if user was created a long time ago (more than 1 minute)
    if (data.user && data.user.created_at) {
      const createdAt = new Date(data.user.created_at);
      const now = new Date();
      const diffMinutes = (now.getTime() - createdAt.getTime()) / (1000 * 60);

      if (diffMinutes > 1) {
        return {
          success: false,
          message:
            "This email has already been signed up. Please try signing in instead.",
        };
      }
    }

    return {
      success: true,
      message:
        "A confirmation link has been sent to your email address. Please check your inbox and click the link to verify your account!",
      requiresConfirmation: true,
    };
  } catch (error: any) {
    console.error("Unexpected signup error:", error);
    return {
      success: false,
      message:
        error.message || "An unexpected error occurred. Please try again.",
    };
  }
}

export async function resendConfirmationAction(
  formData: FormData
): Promise<AuthResult> {
  const email = formData.get("email") as string;

  if (!email) {
    return {
      success: false,
      message: "Email is required",
    };
  }

  try {
    const cookieStore = await cookies();
    const supabase = createServerClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
      {
        cookies: {
          getAll() {
            return cookieStore.getAll();
          },
          setAll(cookiesToSet) {
            cookiesToSet.forEach(({ name, value, options }) => {
              cookieStore.set(name, value, options);
            });
          },
        },
      }
    );

    const { error } = await supabase.auth.resend({
      type: "signup",
      email,
      options: {
        emailRedirectTo: `${process.env.NEXT_PUBLIC_SITE_URL}/auth/confirm`,
      },
    });

    if (error) {
      return {
        success: false,
        message: error.message,
      };
    }

    return {
      success: true,
      message: "Confirmation email re-sent! Please check your inbox.",
    };
  } catch (error: any) {
    return {
      success: false,
      message:
        error.message ||
        "An unexpected error occurred during resend. Please try again.",
    };
  }
}
