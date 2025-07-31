import { Button } from "@/src/components/ui/button";
import { ArrowLeft } from "lucide-react";
import Link from "next/link";

export default function NotFound() {
  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center">
      <div className="text-center">
        <h1 className="text-4xl font-bold text-gray-900 mb-4">404</h1>
        <h2 className="text-xl text-gray-600 mb-8">Post not found</h2>
        <p className="text-gray-500 mb-8">
          The post you're looking for doesn't exist or you don't have permission to view it.
        </p>
        <Link href="/feed">
          <Button className="flex items-center space-x-2">
            <ArrowLeft className="w-4 h-4" />
            <span>Back to Feed</span>
          </Button>
        </Link>
      </div>
    </div>
  );
}