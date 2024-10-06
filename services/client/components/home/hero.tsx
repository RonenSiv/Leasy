"use client";
import React from "react";
import Link from "next/link";
import { FaArrowRightLong } from "react-icons/fa6";
import {
  containerVariants,
  letterVariants,
  splitTextToLetters,
} from "@/lib/utils/animationUtils";
import { motion } from "framer-motion";
import { buttonVariants } from "@/components/ui/button";
import { useClient } from "@/providers/client-provider";

export const Hero = () => {
  const { isLogged } = useClient();
  const subHeaderLetters = splitTextToLetters("with ease.");
  return (
    <section
      className={"z-0 w-full flex items-center justify-start flex-1 h-full"}
    >
      <div className="absolute inset-0 z-0 bg-[url('/people-collection-collage.jpg')] bg-contain h-screen">
        <div className="absolute inset-0 bg-gradient-to-r dark:from-gray-900 dark:to-green-950 from-gray-500 to-green-500 opacity-90"></div>
      </div>
      <div className="relative z-10 flex">
        <div className="mr-auto max-sm:flex max-sm:flex-col max-sm:items-center max-sm:justify-center">
          <h1 className="mb-4 text-4xl font-extrabold text-gray-900 dark:text-white md:text-5xl">
            <span className="text-transparent bg-clip-text bg-gradient-to-r to-[#34D399] from-[#41EC8B]">
              Summarizing your classes
            </span>{" "}
            <motion.div
              variants={containerVariants}
              initial="hidden"
              animate="visible"
            >
              {subHeaderLetters.map((letter: string, index: number) => (
                <motion.span key={index} variants={letterVariants}>
                  {letter}
                </motion.span>
              ))}
            </motion.div>
          </h1>
          <p className="max-sm:text-center mb-6 font-light lg:mb-8 md:text-lg lg:text-xl">
            Let Leasy{" "}
            <span className="underline underline-offset-4 decoration-4 decoration-blue-400 dark:decoration-blue-600">
              summarize
            </span>{" "}
            your video lectures to save yourself hours of study time
          </p>
          <div className="flex gap-4">
            <Link
              href={isLogged ? "/dashboard" : "/authentication"}
              className={`${buttonVariants({ variant: "default" })} rounded-2xl px-6 py-6`}
            >
              Get started
              <FaArrowRightLong className="w-5 h-5 ml-2 -mr-1 font-bold" />
            </Link>
            <Link
              href="/about"
              className={`${buttonVariants({ variant: "secondary" })} rounded-2xl px-6 py-6`}
            >
              Learn more
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
};
