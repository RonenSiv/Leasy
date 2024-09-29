"use client";
import React, { useState } from "react";
import { cn } from "@/lib/utils/utils";

interface ImageProps extends React.ImgHTMLAttributes<HTMLImageElement> {
  fallbackSrc?: string;
}

export function ClientImage({
  src,
  alt,
  fallbackSrc = "/placeholder.png",
  className,
  ...props
}: ImageProps) {
  const [error, setError] = useState(false);

  const handleError = () => {
    setError(true);
  };

  return (
    <img
      src={error ? fallbackSrc : src}
      alt={alt}
      onError={handleError}
      className={cn("object-cover", className)}
      {...props}
    />
  );
}
