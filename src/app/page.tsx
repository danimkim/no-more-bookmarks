"use client";

import { Button } from "@/src/components/ui/button";
import {
  ArrowRight,
  BookOpen,
  Share2,
  ExternalLink,
  X,
  PlayCircle,
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
              <div className="space-y-6">
                <Link
                  href="#"
                  className="block text-xl font-medium text-gray-900 hover:text-blue-600 transition-colors"
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  About
                </Link>
                <Link
                  href="/feed"
                  className="block text-xl font-medium text-gray-900 hover:text-blue-600 transition-colors"
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  Browse Posts
                </Link>
                <Link
                  href="/create"
                  className="block text-xl font-medium text-gray-900 hover:text-blue-600 transition-colors"
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  Create Post
                </Link>
              </div>

              <div className="border-t pt-8 space-y-4">
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
            <div className="flex flex-col lg:flex-row gap-4 justify-center items-center">
              <Link href="/feed">
                <Button
                  variant="outline"
                  size="lg"
                  className="border-white text-white hover:bg-white hover:text-blue-600 text-lg px-8 py-3 bg-transparent"
                >
                  <BookOpen className="w-5 h-5 mr-2" />
                  Explore Posts
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Motivational Section with Carousel */}
      <section className="py-16 md:py-20 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto text-center mb-12">
            <p className="text-lg md:text-xl text-gray-600 mb-6">
              Ever saved countless posts about your dream travel destination,
              only to find yourself still dreaming?
            </p>
            <div className="relative">
              <div className="flex overflow-x-auto snap-x snap-mandatory pb-6 scrollbar-hide lg:justify-center">
                {carouselItems.map((item) => (
                  <div
                    key={item.id}
                    className="flex-shrink-0 w-72 snap-center mx-3"
                  >
                    <div className="bg-white rounded-xl overflow-hidden shadow-sm border border-gray-100">
                      <div className="aspect-[4/3] overflow-hidden">
                        <Image
                          src={item.image || "/placeholder.svg"}
                          alt={item.title}
                          width={300}
                          height={225}
                          className="w-full h-full object-cover"
                        />
                      </div>
                      <div className="p-4">
                        <h3 className="font-semibold text-base text-gray-900 mb-2 line-clamp-2">
                          {item.title}
                        </h3>
                        <p className="text-sm text-gray-600 mb-3">
                          {item.description}
                        </p>
                        <div className="flex items-center text-sm text-gray-600">
                          {item.icon}
                          <span className="ml-2">{item.type}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4 mt-12">
              Beyond Bookmarks
            </h2>
            <p className="text-lg text-gray-600">
              No more bookmarks helps you turn inspiration into action. Document
              your real-life experiences, reflect on what truly matters, and
              build a personal archive of your lived adventures.
            </p>
          </div>
        </div>
      </section>

      {/* Guide Section */}
      <section className="py-16 md:py-20 bg-white">
        {/* Call to Action */}
        <div className="text-center mt-16">
          <div className="bg-gradient-to-r from-blue-600 to-purple-600 rounded-2xl p-8 md:p-12 text-white">
            <h3 className="text-2xl md:text-3xl font-bold mb-4">
              Ready to Start Your Archive?
            </h3>
            <p className="text-lg md:text-xl mb-8 opacity-90 max-w-2xl mx-auto">
              Don’t just save ideas — act on them. Build your archive of
              progress.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link href="/create">
                <Button
                  size="lg"
                  className="bg-white text-blue-600 hover:bg-gray-100 text-lg px-8 py-3"
                >
                  Create Your First Post
                  <ArrowRight className="w-5 h-5 ml-2" />
                </Button>
              </Link>
              <Link href="/feed">
                <Button
                  variant="outline"
                  size="lg"
                  className="border-white text-white hover:bg-white hover:text-blue-600 text-lg px-8 py-3 bg-transparent"
                >
                  <BookOpen className="w-5 h-5 mr-2" />
                  Explore Examples
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-12">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div className="md:col-span-2">
              <h3 className="text-xl font-bold mb-4">No more bookmarks</h3>
              <p className="text-gray-400 mb-4 max-w-md">
                Your personal archive for social media inspiration. Save,
                organize, and reflect on the content that matters to you.
              </p>
              <div className="flex space-x-4">
                <Button
                  variant="ghost"
                  size="sm"
                  className="text-gray-400 hover:text-white p-2"
                >
                  <ExternalLink className="w-5 h-5" />
                </Button>
                <Button
                  variant="ghost"
                  size="sm"
                  className="text-gray-400 hover:text-white p-2"
                >
                  <Share2 className="w-5 h-5" />
                </Button>
              </div>
            </div>

            <div>
              <h4 className="font-semibold mb-4">Platform</h4>
              <ul className="space-y-2 text-gray-400">
                <li>
                  <Link
                    href="/feed"
                    className="hover:text-white transition-colors"
                  >
                    Browse Posts
                  </Link>
                </li>
                <li>
                  <Link
                    href="/create"
                    className="hover:text-white transition-colors"
                  >
                    Create Post
                  </Link>
                </li>
                <li>
                  <Link href="#" className="hover:text-white transition-colors">
                    Categories
                  </Link>
                </li>
                <li>
                  <Link href="#" className="hover:text-white transition-colors">
                    Search
                  </Link>
                </li>
              </ul>
            </div>

            <div>
              <h4 className="font-semibold mb-4">Support</h4>
              <ul className="space-y-2 text-gray-400">
                <li>
                  <Link href="#" className="hover:text-white transition-colors">
                    Help Center
                  </Link>
                </li>
                <li>
                  <Link href="#" className="hover:text-white transition-colors">
                    Privacy Policy
                  </Link>
                </li>
                <li>
                  <Link href="#" className="hover:text-white transition-colors">
                    Terms of Service
                  </Link>
                </li>
                <li>
                  <Link href="#" className="hover:text-white transition-colors">
                    Contact Us
                  </Link>
                </li>
              </ul>
            </div>
          </div>

          <div className="border-t border-gray-800 mt-8 pt-8 text-center text-gray-400">
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
