"use client";

import { User, Settings, BarChart3, Plus } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";

export function BottomNavbar() {
  const pathname = usePathname();

  const handleComingSoon = (feature: string) => {
    alert(`${feature} page coming soon!`);
  };

  return (
    <nav className="md:hidden fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 z-50">
      <div className="flex items-center justify-around py-2">
        <button
          onClick={() => handleComingSoon("Dashboard")}
          className="flex flex-col items-center py-2 px-3"
        >
          <BarChart3 className="w-6 h-6 text-gray-600" />
          <span className="text-xs text-gray-600 mt-1">Dashboard</span>
        </button>

        <Link href="/feed" className="flex flex-col items-center py-2 px-3">
          <User
            className={`w-6 h-6 ${
              pathname === "/feed" ? "text-black" : "text-gray-600"
            }`}
          />
          <span
            className={`text-xs mt-1 ${
              pathname === "/feed"
                ? "text-black font-semibold"
                : "text-gray-600"
            }`}
          >
            Profile
          </span>
        </Link>

        <Link href="/create" className="flex flex-col items-center py-2 px-3">
          <div className="w-6 h-6 bg-black rounded-md flex items-center justify-center">
            <Plus className="w-5 h-5 text-white" />
          </div>
          <span className="text-xs text-gray-600 mt-1">Create</span>
        </Link>

        <button
          onClick={() => handleComingSoon("Settings")}
          className="flex flex-col items-center py-2 px-3"
        >
          <Settings className="w-6 h-6 text-gray-600" />
          <span className="text-xs text-gray-600 mt-1">Settings</span>
        </button>
      </div>
    </nav>
  );
}
