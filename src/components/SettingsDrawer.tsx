"use client";

import { useState } from "react";
import { Button } from "@/src/components/ui/button";
import { LogOut, Trash2, X } from "lucide-react";
import { deleteUserAccountAction } from "@/src/lib/actions";
import { useRouter } from "next/navigation";
import { createClient } from "@/src/lib/supabase/client";

export function SettingsDrawer() {
  const [isOpen, setIsOpen] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [isSigningOut, setIsSigningOut] = useState(false);
  const router = useRouter();

  const handleSignOut = async () => {
    setIsSigningOut(true);
    try {
      const supabase = createClient();
      await supabase.auth.signOut();
      router.push("/");
    } catch (error) {
      console.error("Sign out error:", error);
      alert("An error occurred while signing out.");
    } finally {
      setIsSigningOut(false);
      setIsOpen(false);
    }
  };

  const handleDeleteAccount = async () => {
    if (
      !window.confirm(
        "Are you sure you want to delete your account? This action cannot be undone."
      )
    ) {
      return;
    }

    if (
      !window.confirm(
        "All your posts and data will be permanently deleted. Do you want to continue?"
      )
    ) {
      return;
    }

    setIsDeleting(true);

    try {
      const result = await deleteUserAccountAction();

      if (result.success) {
        alert("Account deleted successfully.");
        router.push("/");
      } else {
        alert(`Account deletion failed: ${result.error}`);
      }
    } catch (error) {
      console.error("Delete account error:", error);
      alert("An error occurred while deleting account.");
    } finally {
      setIsDeleting(false);
      setIsOpen(false);
    }
  };

  return (
    <>
      {/* Settings Button */}
      <Button
        size="sm"
        variant="outline"
        onClick={() => setIsOpen(true)}
        className="flex items-center space-x-1"
      >
        <LogOut className="w-4 h-4" />
        <span className="hidden sm:inline">Settings</span>
      </Button>

      {/* Drawer Overlay */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 z-50"
          onClick={() => setIsOpen(false)}
        />
      )}

      {/* Drawer */}
      <div
        className={`fixed right-0 top-0 h-full w-80 bg-white shadow-lg transform transition-transform duration-300 z-50 ${
          isOpen ? "translate-x-0" : "translate-x-full"
        }`}
      >
        <div className="p-6">
          {/* Header */}
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-lg font-semibold">Settings</h2>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setIsOpen(false)}
              className="p-1"
            >
              <X className="w-4 h-4" />
            </Button>
          </div>

          {/* Menu Items */}
          <div className="space-y-2">
            <Button
              variant="ghost"
              onClick={handleSignOut}
              disabled={isSigningOut}
              className="w-full justify-start flex items-center space-x-3 p-3 h-auto"
            >
              <LogOut className="w-5 h-5 text-gray-600" />
              <span className="text-left">
                {isSigningOut ? "Signing out..." : "Sign out"}
              </span>
            </Button>

            <Button
              variant="ghost"
              onClick={handleDeleteAccount}
              disabled={isDeleting}
              className="w-full justify-start flex items-center space-x-3 p-3 h-auto text-red-600 hover:text-red-700 hover:bg-red-50"
            >
              <Trash2 className="w-5 h-5" />
              <span className="text-left">
                {isDeleting ? "Deleting..." : "Delete account"}
              </span>
            </Button>
          </div>
        </div>
      </div>
    </>
  );
}
