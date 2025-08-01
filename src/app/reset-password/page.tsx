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

export default function ResetPasswordPage() {
  const [email, setEmail] = useState("");
  const [emailSent, setEmailSent] = useState(false);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [isError, setIsError] = useState(false);

  const router = useRouter();

  const handleSendResetEmail = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setMessage("");
    setIsError(false);

    try {
      const supabase = createClient();
      const { error } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: `${window.location.origin}/reset-password/confirm`,
      });

      if (error) {
        throw error;
      }

      setEmailSent(true);
      setMessage(
        "A password reset link has been sent to your email address. Please check your inbox!"
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
      const { error } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: `${window.location.origin}/reset-password/confirm`,
      });

      if (error) {
        throw error;
      }

      setMessage("Password reset email re-sent! Please check your inbox.");
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
          <CardTitle className="text-3xl font-bold">Reset Password</CardTitle>
          <CardDescription>
            {emailSent
              ? "Check your email for a password reset link."
              : "Enter your email address to receive a password reset link."}
          </CardDescription>
        </CardHeader>
        <CardContent>
          {!emailSent ? (
            <form onSubmit={handleSendResetEmail} className="space-y-6">
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
              <Button type="submit" className="w-full" disabled={loading}>
                {loading ? "Sending..." : "Send Reset Link"}
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
            Remember your password?{" "}
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