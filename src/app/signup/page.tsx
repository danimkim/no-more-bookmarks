"use client";

import type React from "react";

import { Button } from "@/src/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/src/components/ui/card";
import { Input } from "@/src/components/ui/input";
import { Label } from "@/src/components/ui/label";
import Link from "next/link";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { ArrowLeft } from "lucide-react";
import { createClient } from "@/src/lib/supabase/client";

export default function SignUpPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [emailSent, setEmailSent] = useState(false);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [isError, setIsError] = useState(false);

  const router = useRouter();

  const handleSignUp = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setMessage("");
    setIsError(false);

    if (formData.password !== formData.confirmPassword) {
      alert("Passwords do not match!");

    if (password !== confirmPassword) {
      setMessage("Passwords do not match!");
      setIsError(true);
      setLoading(false);
      return;
    }

    if (password.length < 6) {
      setMessage("Password must be at least 6 characters long.");
      setIsError(true);
      setLoading(false);
      return;
    }

    try {
      const supabase = createClient();

      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          emailRedirectTo: `${window.location.origin}/auth/confirm`,
        },
      });

    // TODO: Redirect to feed page
  };

  const router = useRouter();

      if (error) {
        console.error("Signup error:", error);
        throw error;
      }

      // Check for existing user: if identities array is empty, user already exists
      // This is the most reliable way to detect existing users in Supabase
      if (
        data.user &&
        data.user.identities &&
        data.user.identities.length === 0
      ) {
        setMessage(
          "(1) This email has already been signed up. Please try signing in instead."
        );
        setIsError(true);
        setLoading(false);
        return;
      }

      // Additional check: if user was created a long time ago (more than 1 minute)
      // and we just got it back, it's likely an existing user
      if (data.user && data.user.created_at) {
        const createdAt = new Date(data.user.created_at);
        const now = new Date();
        const diffMinutes = (now.getTime() - createdAt.getTime()) / (1000 * 60);

        if (diffMinutes > 1) {
          setMessage(
            "(2) This email has already been signed up. Please try signing in instead."
          );
          setIsError(true);
          setLoading(false);
          return;
        }
      }

      setEmailSent(true);
      setMessage(
        "A confirmation link has been sent to your email address. Please check your inbox and click the link to verify your account!"
      );
      setIsError(false);
    } catch (error: any) {
      setEmailSent(false);
      setMessage(
        error.message || "An unexpected error occurred. Please try again."
      );
      setIsError(true);
    } finally {
      setLoading(false);
    }
  };

  const handleResendEmail = async () => {
    setLoading(true);
    setMessage("");
    setIsError(false);

    try {
      const supabase = createClient();
      const { error } = await supabase.auth.resend({
        type: "signup",
        email,
        options: {
          emailRedirectTo: `${window.location.origin}/auth/confirm`,
        },
      });

      if (error) {
        throw error;
      }

      setMessage("Confirmation email re-sent! Please check your inbox.");
      setIsError(false);
    } catch (error: any) {
      setMessage(
        error.message ||
          "An unexpected error occurred during resend. Please try again."
      );
      setIsError(true);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-50 px-4 py-12 sm:px-6 lg:px-8">
      <Button
        variant="ghost"
        size="sm"
        onClick={() => router.back()}
        className="absolute top-4 left-4 flex items-center space-x-2 text-gray-600 hover:text-gray-900"
      >
        <ArrowLeft className="w-4 h-4" />
        <span>Back</span>
      </Button>
      <Card className="w-full max-w-md">
        <CardHeader className="space-y-1 text-center">
          <CardTitle className="text-3xl font-bold">Sign Up</CardTitle>
          <CardDescription>
            {emailSent
              ? "Check your email for a confirmation link."
              : "Create your account by entering your email and password."}
          </CardDescription>
        </CardHeader>
        <CardContent>
          {!emailSent ? (
            <form onSubmit={handleSignUp} className="space-y-6">
              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="m@example.com"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  disabled={loading}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="password">Password</Label>
                <Input
                  id="password"
                  type="password"
                  placeholder="Enter your password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  disabled={loading}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="confirmPassword">Confirm Password</Label>
                <Input
                  id="confirmPassword"
                  type="password"
                  placeholder="Confirm your password"
                  required
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  disabled={loading}
                />
              </div>
              {message && !emailSent && (
                <p
                  className={`text-sm text-center ${
                    isError ? "text-red-600" : "text-green-600"
                  }`}
                >
                  {message}
                </p>
              )}
              <Button type="submit" className="w-full" disabled={loading}>
                {loading ? "Creating Account..." : "Sign Up"}
              </Button>
            </form>
          ) : (
            <div className="space-y-6 text-center">
              <p
                className={`text-sm ${
                  isError ? "text-red-600" : "text-green-600"
                }`}
              >
                {message}
              </p>
              <p className="text-sm text-gray-600">
                Didn't receive the email? Check your spam folder or try
                resending.
              </p>
              <Button
                onClick={handleResendEmail}
                className="w-full"
                disabled={loading}
              >
                {loading ? "Resending..." : "Resend Email"}
              </Button>
            </div>
          )}

          <div className="mt-6 text-center text-sm text-gray-600">
            Already have an account?{" "}
            <Link
              href="/signin"
              className="font-medium text-blue-600 hover:underline"
            >
              Sign In
            </Link>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
