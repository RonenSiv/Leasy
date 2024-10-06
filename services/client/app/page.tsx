import React from "react";
import { Hero } from "@/components/home/hero";

export default function Home() {
  return (
    <div
      className={
        "flex flex-col items-center justify-center text-foreground my-8 rounded-lg w-full bg-ghost h-full overflow-y-hidden"
      }
    >
      <Hero />
    </div>
  );
}
