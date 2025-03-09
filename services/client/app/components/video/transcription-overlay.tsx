"use client";

import { cn } from "@/lib/utils";

interface TranscriptionOverlayProps {
  text: string;
  isVisible: boolean;
  position?: "top" | "bottom" | "middle";
  showControls?: boolean;
}

export function TranscriptionOverlay({
  text,
  isVisible,
  position = "bottom",
  showControls = true,
}: TranscriptionOverlayProps) {
  if (!isVisible || !text) return null;

  // Position classes - adjust bottom position based on controls visibility
  const positionClasses = {
    top: "top-4",
    middle: "top-1/2 -translate-y-1/2",
    bottom: showControls ? "bottom-20" : "bottom-4", // Move to bottom of video when controls are hidden
  };

  return (
    <div
      className={cn(
        "absolute left-0 right-0 mx-auto px-4 py-2 z-10 transition-all duration-300 max-w-[90%] w-fit",
        positionClasses[position],
        isVisible ? "opacity-100" : "opacity-0",
      )}
      style={{
        backgroundColor: "rgba(0, 0, 0, 0.8)",
        backdropFilter: "blur(2px)",
        border: "1px solid rgba(255, 255, 255, 0.1)",
        borderRadius: "4px",
        boxShadow: "0 4px 6px rgba(0, 0, 0, 0.1)",
        textShadow: "0 1px 2px rgba(0, 0, 0, 0.5)",
      }}
      onClick={(e) => e.stopPropagation()} // Prevent video play/pause when clicking overlay
    >
      <p className="text-lg font-medium text-white text-center">{text}</p>
    </div>
  );
}
