"use client";
import { HTMLAttributes } from "react";
import { cn } from "@/lib/utils";

// Decorative star-like sparkle
export function Sparkle({ className, ...props }: HTMLAttributes<SVGElement>) {
  return (
    <svg
      width="16"
      height="16"
      viewBox="0 0 16 16"
      fill="none"
      className={cn("absolute", className)}
      {...props}
    >
      <path
        d="M8 0L9.59375 6.40625L16 8L9.59375 9.59375L8 16L6.40625 9.59375L0 8L6.40625 6.40625L8 0Z"
        fill="currentColor"
      />
    </svg>
  );
}

// Blurry circle
export function Circle({
  className,
  ...props
}: HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      className={cn(
        "absolute rounded-full mix-blend-multiply opacity-70",
        className,
      )}
      {...props}
    />
  );
}
