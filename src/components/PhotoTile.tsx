"use client";

import { PostImage } from "@/src/components/PostImage";
import Link from "next/link";

interface PhotoTileProps {
  imageUrl: string;
  title: string;
  category: string;
  postId: number;
}

export function PhotoTile({ imageUrl, title, category, postId }: PhotoTileProps) {
  return (
    <Link href={`/post/${postId}`}>
      <div className="group relative aspect-square overflow-hidden bg-gray-100 cursor-pointer">
        <PostImage
          src={imageUrl}
          alt={title}
          width={300}
          height={300}
          className="w-full h-full object-cover transition-transform duration-200 group-hover:scale-105"
        />
        
        {/* Overlay on hover */}
        <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-30 transition-all duration-200 flex items-center justify-center">
          <div className="opacity-0 group-hover:opacity-100 transition-opacity duration-200 text-center text-white p-4">
            <h3 className="font-medium text-sm line-clamp-2 mb-2">{title}</h3>
            <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-white/20 text-white border border-white/30">
              {category}
            </span>
          </div>
        </div>
      </div>
    </Link>
  );
}