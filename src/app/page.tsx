"use client";

import { Button } from "@/src/components/ui/button";
import {
  ArrowRight,
  BookOpen,
  Share2,
  X,
  PlayCircle,
  Zap,
  Heart,
  Clock,
} from "lucide-react";
import Instagram from "@/public/instagram.svg";
import Youtube from "@/public/youtube.svg";
import Link from "next/link";
import Image from "next/image";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/src/contexts/AuthContext";
import { SignOutButton } from "@/src/components/SignOutButton";

export default function LandingPage() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const { user, loading } = useAuth();
  const router = useRouter();

  const features = [
    {
      icon: <Zap className="w-6 h-6 text-blue-600" />,
      title: "Instant Capture",
      description:
        "Save any social media content with just a link. No more losing track of inspiring posts.",
    },
    {
      icon: <Heart className="w-6 h-6 text-red-600" />,
      title: "Personal Reflection",
      description:
        "Add your thoughts and insights to create meaningful connections with saved content.",
    },
    {
      icon: <BookOpen className="w-6 h-6 text-green-600" />,
      title: "Organized Archive",
      description:
        "Categorize and search through your collection effortlessly. Your inspiration, organized.",
    },
    {
      icon: <Clock className="w-6 h-6 text-purple-600" />,
      title: "Never Lose Content",
      description:
        "No more scrolling endlessly to find that one post. Everything is saved and searchable.",
    },
  ];

  useEffect(() => {
    if (!loading && user) {
      router.push("/feed");
    }
  }, [user, loading, router]);

  const carouselItems = [
    {
      id: 1,
      image: "/images/instagram-bookmarked.png",
      title: "Instagram Post Saved",
      description: "Bookmark inspiring posts to revisit later.",
      type: "Instagram",
      icon: <Image src={Instagram} alt="Instagram" className="w-4 h-4" />,
    },
    {
      id: 2,
      image: "/images/youtube-save-later.png",
      title: "YouTube Video Saved",
      description: "Add videos to 'Watch Later' and never miss out.",
      type: "YouTube",
      icon: <Image src={Youtube} alt="Youtube" className="w-5 h-5" />,
    },
    {
      id: 3,
      image: "/images/tiktok-favorited.png",
      title: "TikTok Favorited",
      description: "Keep your favorite TikToks in one place.",
      type: "TikTok",
      icon: <PlayCircle className="w-4 h-4" />,
    },
  ];

  return (
    <div className="min-h-screen bg-white">
      {/* Hero Section with Integrated Navigation */}
      <section
        className="relative min-h-screen bg-cover bg-center bg-no-repeat"
        style={{
          backgroundImage: "url('/images/switzerland-countryside.jpg')",
        }}
      >
        {/* Overlay for better text readability */}
        <div className="absolute inset-0 bg-black/40"></div>

        {/* Navigation Bar - Overlaid on Hero */}
        <nav className="absolute top-0 left-0 right-0 z-50">
          <div className="container mx-auto px-4 py-6">
            <div className="flex items-center justify-between">
              <div className="flex items-center"></div>

              {/* Desktop Navigation */}
              <div className="hidden md:flex items-center space-x-3">
                {user ? (
                  <>
                    <Button
                      asChild
                      variant="ghost"
                      className="text-white/80 hover:text-white hover:bg-white/10"
                    >
                      <Link href="/feed">Feed</Link>
                    </Button>
                    <Button
                      asChild
                      variant="ghost"
                      className="text-white/80 hover:text-white hover:bg-white/10"
                    >
                      <Link href="/create">Create</Link>
                    </Button>
                    <SignOutButton />
                  </>
                ) : (
                  <>
                    <Button
                      asChild
                      variant="ghost"
                      className="text-white/80 hover:text-white hover:bg-white/10"
                    >
                      <Link href="/signin">Sign In</Link>
                    </Button>
                    <Button
                      asChild
                      className="bg-white text-gray-900 hover:bg-gray-100"
                    >
                      <Link href="/signup">Sign Up</Link>
                    </Button>
                  </>
                )}
              </div>

              {/* Mobile Hamburger Button */}
              <div className="md:hidden">
                <button
                  onClick={() => setIsMobileMenuOpen(true)}
                  className="p-2 text-white hover:bg-white/10 rounded-md transition-colors"
                  aria-label="Open menu"
                >
                  <div className="w-6 h-6 flex flex-col justify-center items-center space-y-1">
                    <div className="w-6 h-0.5 bg-white"></div>
                    <div className="w-6 h-0.5 bg-white"></div>
                    <div className="w-6 h-0.5 bg-white"></div>
                  </div>
                </button>
              </div>
            </div>
          </div>
        </nav>

        {/* Mobile Drawer Overlay */}
        {isMobileMenuOpen && (
          <div
            className="fixed inset-0 bg-black/60 z-50 md:hidden backdrop-blur-sm"
            onClick={() => setIsMobileMenuOpen(false)}
          />
        )}

        {/* Mobile Drawer */}
        <div
          className={`fixed top-0 right-0 h-full w-80 bg-white shadow-2xl transform transition-transform duration-300 ease-in-out z-50 md:hidden ${
            isMobileMenuOpen ? "translate-x-0" : "translate-x-full"
          }`}
        >
          <div className="p-6 h-full flex flex-col">
            {/* Close Button */}
            <div className="flex justify-end mb-8">
              <button
                onClick={() => setIsMobileMenuOpen(false)}
                className="p-2 text-gray-500 hover:text-gray-700 hover:bg-gray-100 rounded-md transition-colors"
                aria-label="Close menu"
              >
                <X className="w-6 h-6" />
              </button>
            </div>

            {/* Menu Items */}
            <div className="flex-1 space-y-8">
              {user ? (
                <SignOutButton />
              ) : (
                <>
                  <Button
                    asChild
                    variant="ghost"
                    className="w-full justify-start text-lg text-gray-700 hover:text-gray-900 hover:bg-gray-50"
                    onClick={() => setIsMobileMenuOpen(false)}
                  >
                    <Link href="/signin">Sign In</Link>
                  </Button>
                  <Button
                    asChild
                    className="w-full bg-blue-600 hover:bg-blue-700 text-lg"
                    onClick={() => setIsMobileMenuOpen(false)}
                  >
                    <Link href="/signup">Sign Up</Link>
                  </Button>
                </>
              )}
            </div>
          </div>
        </div>

        {/* Hero Content */}
        <div className="relative z-10 container mx-auto px-4 flex items-center justify-center min-h-screen">
          <div className="max-w-4xl mx-auto text-center text-white">
            <h1 className="text-5xl md:text-7xl font-bold mb-6 drop-shadow-lg">
              No More Bookmarks
            </h1>
            <p className="text-xl md:text-3xl mb-8 font-light drop-shadow-md">
              Stop saving it, start living it
            </p>
          </div>
        </div>
      </section>

      {/* Features & Benefits Section */}
      <section className="py-32 bg-white">
        <div className="container mx-auto px-4">
          {/* Main Value Proposition */}
          <div className="text-center mb-32">
            <h2 className="text-3xl md:text-5xl font-bold text-gray-900 mb-6">
              Turn Inspiration Into Action
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto mb-8">
              Stop letting great content disappear into the void of endless
              bookmarks. Create a meaningful archive where every saved post
              becomes a stepping stone to your next adventure.
            </p>
            <Link href="/signup">
              <Button size="lg" className="text-lg px-8 py-4">
                Start Your Archive Free
                <ArrowRight className="w-5 h-5 ml-2" />
              </Button>
            </Link>
          </div>

          {/* Features Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-16">
            {features.map((feature, index) => (
              <div
                key={index}
                className="text-center p-6 rounded-xl bg-gray-50 hover:bg-gray-100 transition-colors"
              >
                <div className="flex justify-center mb-4">{feature.icon}</div>
                <h3 className="text-lg font-semibold text-gray-900 mb-3">
                  {feature.title}
                </h3>
                <p className="text-gray-600 text-sm leading-relaxed">
                  {feature.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Call to Action Section */}
      <section className="py-20 bg-gradient-to-r from-blue-600 to-purple-600">
        <div className="container mx-auto px-4 text-center">
          <div className="max-w-3xl mx-auto text-white">
            <h2 className="text-3xl md:text-4xl font-bold mb-6">
              Ready to Transform Your Digital Inspiration?
            </h2>
            <p className="text-xl mb-8 opacity-90">
              Don't let another great idea stay buried in your bookmarks.
              Transform from a content saver into an experience maker. Begin
              your change today.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link href="/signup">
                <Button
                  size="lg"
                  className="bg-white text-blue-600 hover:bg-gray-100 text-lg px-8 py-4"
                >
                  Get Started Free
                  <ArrowRight className="w-5 h-5 ml-2" />
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Simple Footer */}
      <footer className="bg-gray-900 text-white py-12">
        <div className="container mx-auto px-4">
          <div className="flex flex-col md:flex-row items-center justify-between">
            <div className="mb-6 md:mb-0">
              <h3 className="text-xl font-bold mb-2">No more bookmarks</h3>
              <p className="text-gray-400">
                Your personal archive for digital inspiration
              </p>
            </div>

            <div className="flex flex-col sm:flex-row items-center space-y-4 sm:space-y-0 sm:space-x-8">
              <div className="flex space-x-6 text-sm">
                <Link
                  href="#"
                  className="text-gray-400 hover:text-white transition-colors"
                >
                  Privacy
                </Link>
                <Link
                  href="#"
                  className="text-gray-400 hover:text-white transition-colors"
                >
                  Terms
                </Link>
                <Link
                  href="#"
                  className="text-gray-400 hover:text-white transition-colors"
                >
                  Support
                </Link>
              </div>
              <div className="flex space-x-4">
                <Button
                  variant="ghost"
                  size="sm"
                  className="text-gray-400 hover:text-white p-2"
                >
                  <Share2 className="w-4 h-4" />
                </Button>
              </div>
            </div>
          </div>

          <div className="border-t border-gray-800 mt-8 pt-8 text-center text-gray-400 text-sm">
            <p>
              &copy; {new Date().getFullYear()} No more bookmarks. All rights
              reserved.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}
