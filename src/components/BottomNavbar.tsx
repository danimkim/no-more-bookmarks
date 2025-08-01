"use client";

import { Home, User, Settings, BarChart3 } from "lucide-react";
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
        <Link href="/" className="flex flex-col items-center py-2 px-3">
          <Home
            className={`w-6 h-6 ${
              pathname === "/" ? "text-black" : "text-gray-600"
            }`}
          />
          <span
            className={`text-xs mt-1 ${
              pathname === "/" ? "text-black font-semibold" : "text-gray-600"
            }`}
          >
            Home
          </span>
        </Link>

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

        <button
          onClick={() => handleComingSoon("Dashboard")}
          className="flex flex-col items-center py-2 px-3"
        >
          <BarChart3 className="w-6 h-6 text-gray-600" />
          <span className="text-xs text-gray-600 mt-1">Dashboard</span>
        </button>

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
