import React from "react";
import { Hero } from "@/components/Home/hero";

export default function Home() {
  return (
    <div
      className={
        "flex flex-col items-center justify-center text-foreground my-8 rounded-lg w-full bg-ghost"
      }
    >
      <Hero />
    </div>
  );
}
