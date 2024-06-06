import React from "react";
import { Hero } from "@/app/components/Home/Hero";
import { About } from "@/app/components/Home/About";
import { Features } from "@/app/components/Home/Features";
import { HowItWorks } from "@/app/components/Home/HowItWorks";
import { Testimonials } from "@/app/components/Home/Testimmonial";

export default function Home() {
  return (
    <div
      className={
        "flex flex-col items-center justify-center dark:bg-gray-800 dark:text-gray-100 my-8 rounded-lg"
      }
    >
      <Hero />
      <About />
      <Features />
      <HowItWorks />
      <Testimonials />
    </div>
  );
}
