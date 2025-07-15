"use client"

import { Button } from "@/components/ui/button"
import { ArrowRight, BookOpen, Heart, Share2, ExternalLink, X } from "lucide-react"
import Link from "next/link"
import Image from "next/image"
import { useState } from "react"

export default function LandingPage() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)

  const recentPosts = [
    {
      id: 1,
      title: "Amazing Street Art in Tokyo",
      content:
        "Found this incredible mural while exploring Shibuya. The way the artist used colors to represent urban life is just mesmerizing...",
      author: "Alex Chen",
      publishedDate: "2024-01-15",
      category: "Art & Culture",
      image: "/placeholder.svg?height=200&width=300",
      likes: 24,
    },
    {
      id: 2,
      title: "Minimalist Home Setup Tour",
      content:
        "This YouTube video completely changed my perspective on living spaces. The creator shows how to achieve maximum functionality...",
      author: "Sarah Kim",
      publishedDate: "2024-01-14",
      category: "Lifestyle",
      image: "/placeholder.svg?height=200&width=300",
      likes: 42,
    },
    {
      id: 3,
      title: "Cooking Technique That Blew My Mind",
      content:
        "Never thought about using this method for pasta before! This TikTok chef's approach to creating the perfect sauce...",
      author: "Mike Rodriguez",
      publishedDate: "2024-01-13",
      category: "Food & Cooking",
      image: "/placeholder.svg?height=200&width=300",
      likes: 18,
    },
  ]

  return (
    <div className="min-h-screen bg-white">
      {/* Hero Section with Integrated Navigation */}
      <section
        className="relative min-h-screen bg-cover bg-center bg-no-repeat"
        style={{ backgroundImage: "url('/images/switzerland-countryside.jpg')" }}
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
                <Button variant="ghost" className="text-white/80 hover:text-white hover:bg-white/10">
                  Sign In
                </Button>
                <Button className="bg-white text-gray-900 hover:bg-gray-100">Sign Up</Button>
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
                <Button
                  variant="ghost"
                  className="w-full justify-start text-lg text-gray-700 hover:text-gray-900 hover:bg-gray-50"
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  Sign In
                </Button>
                <Button
                  className="w-full bg-blue-600 hover:bg-blue-700 text-lg"
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  Sign Up
                </Button>
              </div>
            </div>
          </div>
        </div>

        {/* Hero Content */}
        <div className="relative z-10 container mx-auto px-4 flex items-center justify-center min-h-screen">
          <div className="max-w-4xl mx-auto text-center text-white">
            <h1 className="text-5xl md:text-7xl font-bold mb-6 drop-shadow-lg">No More Bookmarks</h1>
            <p className="text-xl md:text-3xl mb-8 font-light drop-shadow-md">Stop saving it, start living it</p>
          </div>
        </div>
      </section>

      {/* Recent Posts Section */}
      <section className="py-16 md:py-20 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">Recent Discoveries</h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              See what others are archiving and get inspired by their discoveries
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-6xl mx-auto">
            {recentPosts.map((post) => (
              <div
                key={post.id}
                className="bg-white rounded-xl overflow-hidden shadow-sm hover:shadow-md transition-all duration-300 border border-gray-100"
              >
                {/* Image at top */}
                <div className="aspect-[4/3] overflow-hidden">
                  <Image
                    src={post.image || "/placeholder.svg"}
                    alt={post.title}
                    width={400}
                    height={300}
                    className="w-full h-full object-cover"
                  />
                </div>

                {/* Content */}
                <div className="p-6">
                  {/* Title */}
                  <h3 className="font-semibold text-lg text-gray-900 mb-3 line-clamp-2 leading-snug">{post.title}</h3>

                  {/* Date */}
                  <p className="text-sm text-gray-500 mb-4">
                    {new Date(post.publishedDate).toLocaleDateString("en-US", {
                      year: "numeric",
                      month: "long",
                      day: "numeric",
                    })}
                  </p>

                  {/* Category Badge */}
                  <div className="flex items-center justify-between">
                    <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-gray-100 text-gray-700">
                      {post.category.toLowerCase()}
                    </span>

                    {/* Like count */}
                    <div className="flex items-center space-x-1 text-gray-400">
                      <Heart className="w-4 h-4" />
                      <span className="text-sm">{post.likes}</span>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>

          <div className="text-center mt-12">
            <Link href="/feed">
              <Button variant="outline" size="lg" className="text-lg px-8 py-3 bg-transparent">
                View All Posts
                <ArrowRight className="w-5 h-5 ml-2" />
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Guide Section */}
      <section className="py-16 md:py-20 bg-white">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">How It Works</h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              Start archiving your favorite social media content in just a few simple steps
            </p>
          </div>

          <div className="max-w-6xl mx-auto">
            {/* Step 1 */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center mb-20">
              <div className="order-2 lg:order-1">
                <div className="flex items-center mb-4">
                  <div className="w-10 h-10 bg-blue-600 text-white rounded-full flex items-center justify-center font-bold text-lg mr-4">
                    1
                  </div>
                  <h3 className="text-2xl font-bold text-gray-900">Find Inspiring Content</h3>
                </div>
                <p className="text-gray-600 text-lg leading-relaxed mb-6">
                  Discover amazing Instagram reels, YouTube videos, TikToks, or any social media content that inspires
                  you. Copy the link to the content you want to save and reflect on.
                </p>
                <ul className="space-y-2 text-gray-600">
                  <li className="flex items-center">
                    <div className="w-2 h-2 bg-blue-600 rounded-full mr-3"></div>
                    Instagram reels and posts
                  </li>
                  <li className="flex items-center">
                    <div className="w-2 h-2 bg-blue-600 rounded-full mr-3"></div>
                    YouTube videos and shorts
                  </li>
                  <li className="flex items-center">
                    <div className="w-2 h-2 bg-blue-600 rounded-full mr-3"></div>
                    TikTok videos and any social content
                  </li>
                </ul>
              </div>
              <div className="order-1 lg:order-2">
                <div className="bg-gradient-to-br from-blue-50 to-indigo-100 rounded-2xl p-8 shadow-lg">
                  <Image
                    src="/placeholder.svg?height=400&width=500"
                    alt="Step 1: Finding content on social media platforms"
                    width={500}
                    height={400}
                    className="w-full h-auto rounded-lg shadow-md"
                  />
                </div>
              </div>
            </div>

            {/* Step 2 */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center mb-20">
              <div>
                <div className="bg-gradient-to-br from-green-50 to-emerald-100 rounded-2xl p-8 shadow-lg">
                  <Image
                    src="/placeholder.svg?height=400&width=500"
                    alt="Step 2: Create post form with title and link fields"
                    width={500}
                    height={400}
                    className="w-full h-auto rounded-lg shadow-md"
                  />
                </div>
              </div>
              <div>
                <div className="flex items-center mb-4">
                  <div className="w-10 h-10 bg-green-600 text-white rounded-full flex items-center justify-center font-bold text-lg mr-4">
                    2
                  </div>
                  <h3 className="text-2xl font-bold text-gray-900">Create Your Post</h3>
                </div>
                <p className="text-gray-600 text-lg leading-relaxed mb-6">
                  Click "Start Archiving" and fill out the simple form. Add a catchy title, paste the original link, and
                  share your thoughts about what inspired you.
                </p>
                <ul className="space-y-2 text-gray-600">
                  <li className="flex items-center">
                    <div className="w-2 h-2 bg-green-600 rounded-full mr-3"></div>
                    Give your post a memorable title
                  </li>
                  <li className="flex items-center">
                    <div className="w-2 h-2 bg-green-600 rounded-full mr-3"></div>
                    Paste the original social media link
                  </li>
                  <li className="flex items-center">
                    <div className="w-2 h-2 bg-green-600 rounded-full mr-3"></div>
                    Write your personal thoughts and insights
                  </li>
                </ul>
              </div>
            </div>

            {/* Step 3 */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center mb-20">
              <div className="order-2 lg:order-1">
                <div className="flex items-center mb-4">
                  <div className="w-10 h-10 bg-purple-600 text-white rounded-full flex items-center justify-center font-bold text-lg mr-4">
                    3
                  </div>
                  <h3 className="text-2xl font-bold text-gray-900">Add Details & Media</h3>
                </div>
                <p className="text-gray-600 text-lg leading-relaxed mb-6">
                  Enhance your post by uploading related images, selecting a category, and setting the published date.
                  These details help organize your personal archive.
                </p>
                <ul className="space-y-2 text-gray-600">
                  <li className="flex items-center">
                    <div className="w-2 h-2 bg-purple-600 rounded-full mr-3"></div>
                    Upload relevant images or screenshots
                  </li>
                  <li className="flex items-center">
                    <div className="w-2 h-2 bg-purple-600 rounded-full mr-3"></div>
                    Choose from 10+ categories
                  </li>
                  <li className="flex items-center">
                    <div className="w-2 h-2 bg-purple-600 rounded-full mr-3"></div>
                    Set the published date for organization
                  </li>
                </ul>
              </div>
              <div className="order-1 lg:order-2">
                <div className="bg-gradient-to-br from-purple-50 to-violet-100 rounded-2xl p-8 shadow-lg">
                  <Image
                    src="/placeholder.svg?height=400&width=500"
                    alt="Step 3: Adding images, categories, and date to the post"
                    width={500}
                    height={400}
                    className="w-full h-auto rounded-lg shadow-md"
                  />
                </div>
              </div>
            </div>

            {/* Step 4 */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
              <div>
                <div className="bg-gradient-to-br from-orange-50 to-amber-100 rounded-2xl p-8 shadow-lg">
                  <Image
                    src="/placeholder.svg?height=400&width=500"
                    alt="Step 4: Published post in the feed with engagement options"
                    width={500}
                    height={400}
                    className="w-full h-auto rounded-lg shadow-md"
                  />
                </div>
              </div>
              <div>
                <div className="flex items-center mb-4">
                  <div className="w-10 h-10 bg-orange-600 text-white rounded-full flex items-center justify-center font-bold text-lg mr-4">
                    4
                  </div>
                  <h3 className="text-2xl font-bold text-gray-900">Share & Discover</h3>
                </div>
                <p className="text-gray-600 text-lg leading-relaxed mb-6">
                  Your post is now part of your personal archive! Browse through your collection, discover what others
                  are saving, and build a community around shared inspiration.
                </p>
                <ul className="space-y-2 text-gray-600">
                  <li className="flex items-center">
                    <div className="w-2 h-2 bg-orange-600 rounded-full mr-3"></div>
                    View your personal archive anytime
                  </li>
                  <li className="flex items-center">
                    <div className="w-2 h-2 bg-orange-600 rounded-full mr-3"></div>
                    Discover posts from other users
                  </li>
                  <li className="flex items-center">
                    <div className="w-2 h-2 bg-orange-600 rounded-full mr-3"></div>
                    Like, comment, and share inspiration
                  </li>
                </ul>
              </div>
            </div>
          </div>

          {/* Call to Action */}
          <div className="text-center mt-16">
            <div className="bg-gradient-to-r from-blue-600 to-purple-600 rounded-2xl p-8 md:p-12 text-white">
              <h3 className="text-2xl md:text-3xl font-bold mb-4">Ready to Start Your Archive?</h3>
              <p className="text-lg md:text-xl mb-8 opacity-90 max-w-2xl mx-auto">
                Join thousands of users who are already building their personal collections of inspiring content
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Link href="/create">
                  <Button size="lg" className="bg-white text-blue-600 hover:bg-gray-100 text-lg px-8 py-3">
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
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-12">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div className="md:col-span-2">
              <h3 className="text-xl font-bold mb-4">No more bookmarks</h3>
              <p className="text-gray-400 mb-4 max-w-md">
                Your personal archive for social media inspiration. Save, organize, and reflect on the content that
                matters to you.
              </p>
              <div className="flex space-x-4">
                <Button variant="ghost" size="sm" className="text-gray-400 hover:text-white p-2">
                  <ExternalLink className="w-5 h-5" />
                </Button>
                <Button variant="ghost" size="sm" className="text-gray-400 hover:text-white p-2">
                  <Share2 className="w-5 h-5" />
                </Button>
              </div>
            </div>

            <div>
              <h4 className="font-semibold mb-4">Platform</h4>
              <ul className="space-y-2 text-gray-400">
                <li>
                  <Link href="/feed" className="hover:text-white transition-colors">
                    Browse Posts
                  </Link>
                </li>
                <li>
                  <Link href="/create" className="hover:text-white transition-colors">
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
            <p>&copy; 2024 No more bookmarks. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  )
}
