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
import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { ArrowLeft } from "lucide-react";
import { signUpAction, resendConfirmationAction } from "@/src/lib/auth/actions";

export default function SignUpPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [emailSent, setEmailSent] = useState(false);
  const [message, setMessage] = useState("");
  const [isError, setIsError] = useState(false);
  const [isPending, startTransition] = useTransition();

  const router = useRouter();

  const handleSignUp = async (e: React.FormEvent) => {
    e.preventDefault();
    setMessage("");
    setIsError(false);

    // Client-side validation
    if (password !== confirmPassword) {
      setMessage("Passwords do not match!");
      setIsError(true);
      return;
    }

    if (password.length < 6) {
      setMessage("Password must be at least 6 characters long.");
      setIsError(true);
      return;
    }

    startTransition(async () => {
      const formData = new FormData();
      formData.append('email', email);
      formData.append('password', password);
      formData.append('confirmPassword', confirmPassword);

      const result = await signUpAction(formData);
      
      setMessage(result.message);
      setIsError(!result.success);
      
      if (result.success && result.requiresConfirmation) {
        setEmailSent(true);
      }
    });
  };

  const handleResendEmail = async () => {
    setMessage("");
    setIsError(false);

    startTransition(async () => {
      const formData = new FormData();
      formData.append('email', email);

      const result = await resendConfirmationAction(formData);
      
      setMessage(result.message);
      setIsError(!result.success);
    });
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
                  disabled={isPending}
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
                  disabled={isPending}
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
                  disabled={isPending}
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
              <Button type="submit" className="w-full" disabled={isPending}>
                {isPending ? "Creating Account..." : "Sign Up"}
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
                disabled={isPending}
              >
                {isPending ? "Resending..." : "Resend Email"}
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
