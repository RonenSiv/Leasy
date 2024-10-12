import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export const sleep = (ms: number) =>
  new Promise((resolve) => setTimeout(resolve, ms));

export const initialsToColor = (initials: string): string => {
  // Convert each character to a numeric value between 0 and 255
  const charCode1 = initials.charCodeAt(0);
  const charCode2 = initials.charCodeAt(1);

  // Normalize the character codes to the RGB range (0-255)
  const r = (charCode1 * 5) % 256;
  const g = (charCode2 * 5) % 256;
  const b = ((charCode1 + charCode2) * 3) % 256;

  // Convert RGB values to a hex color string
  return `#${((1 << 24) + (r << 16) + (g << 8) + b).toString(16).slice(1)}`;
};

export const getContrastingColor = (bgColor: string): string => {
  // Extract RGB values from hex color string
  const r = parseInt(bgColor.slice(1, 3), 16);
  const g = parseInt(bgColor.slice(1, 3), 16);
  const b = parseInt(bgColor.slice(5, 7), 16);

  // Calculate relative luminance
  const luminance = (0.299 * r + 0.587 * g + 0.114 * b) / 255;

  // Return black for light backgrounds and white for dark backgrounds
  return luminance > 0.5 ? "#000000" : "#FFFFFF";
};

export const formatTime = (seconds: number) => {
  const mins = Math.floor(seconds / 60);
  const secs = seconds % 60;
  return `${mins.toString().padStart(2, "0")}:${secs.toString().padStart(2, "0")}`;
};
