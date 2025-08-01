"use client";

import { useAuth } from "@/src/contexts/AuthContext";
import { Button } from "@/src/components/ui/button";
import { LogOut } from "lucide-react";

export function SignOutButton() {
  const { signOut, user } = useAuth();

  if (!user) return null;

  return (
    <Button onClick={signOut} variant="outline">
      <LogOut />
    </Button>
  );
}
