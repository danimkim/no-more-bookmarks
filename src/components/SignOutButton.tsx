"use client";

import { useAuth } from "@/src/contexts/AuthContext";
import { Button } from "@/src/components/ui/button";

export function SignOutButton() {
  const { signOut, user } = useAuth();

  if (!user) return null;

  return (
    <Button onClick={signOut} variant="outline">
      Sign Out
    </Button>
  );
}