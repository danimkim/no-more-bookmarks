"use client";

import Image from "next/image";
import { useState } from "react";

interface PostImageProps {
  src: string;
  alt: string;
  width: number;
  height: number;
  className?: string;
}

export function PostImage({ src, alt, width, height, className }: PostImageProps) {
  const [error, setError] = useState(false);

  return (
    <Image
      src={error ? "/placeholder.svg?height=300&width=400" : src}
      alt={alt}
      width={width}
      height={height}
      className={className}
      onError={() => setError(true)}
    />
  );
}