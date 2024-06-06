"use client";
import React from "react";
import Link from "next/link";
import { FaArrowRightLong } from "react-icons/fa6";
import Image from "next/image";
import {
  containerVariants,
  letterVariants,
  splitTextToLetters,
} from "@/app/lib/utils/animationUtils";
import { motion } from "framer-motion";

export const Hero = () => {
  const subHeaderLetters = splitTextToLetters("with ease.");

  return (
    <section className="bg-white dark:bg-gray-800">
      <div className="grid max-w-screen-xl px-4 py-8 mx-auto lg:gap-8 xl:gap-0 lg:py-16 lg:grid-cols-12">
        <div className="mr-auto place-self-center lg:col-span-7">
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
          <p className="max-w-2xl mb-6 font-light text-gray-500 lg:mb-8 md:text-lg lg:text-xl dark:text-gray-400">
            Let Leasy{" "}
            <span className="underline underline-offset-4 decoration-4 decoration-blue-400 dark:decoration-blue-600">
              summarize
            </span>{" "}
            your video lectures to save yourself hours of study time
          </p>
          <Link
            href="/signup"
            className="inline-flex items-center justify-center px-5 py-3 mr-3 text-base font-medium text-center text-white rounded-lg bg-primary-700 hover:bg-primary-800 focus:ring-4 focus:ring-primary-300 dark:focus:ring-primary-900 bg-action hover:opacity-90"
          >
            Get started
            <FaArrowRightLong className="w-5 h-5 ml-2 -mr-1 font-bold" />
          </Link>
          <a
            href="#about"
            className="inline-flex items-center justify-center px-5 py-3 text-base font-medium text-center text-gray-900 border border-gray-300 rounded-lg hover:bg-gray-100 focus:ring-4 focus:ring-gray-100 dark:text-white dark:border-gray-700 dark:hover:bg-gray-700 dark:focus:ring-gray-800 scroll-smooth"
          >
            Learn more
          </a>
        </div>
        <div className="hidden lg:mt-0 lg:col-span-5 lg:flex">
          <Image
            src="/main.png"
            width="1800"
            height="1800"
            className="min-w-[300px] w-[30vw] max-sm:w-[50vw] h-auto p-8"
            alt="main picture"
            priority
          />
        </div>
      </div>
    </section>
    // <section>
    //   <CardGrid
    //     cols={2}
    //     className={
    //       "py-2 mb-auto mt-8 border-0 rounded-none dark:shadow-none shadow-none"
    //     }
    //     stretchHorizontal={true}
    //   >
    //     <div className="flex flex-col justify-center items-center p-4 leading-normal">
    //       <div className="flex flex-col">
    //         <h1 className="mb-4 text-4xl font-extrabold text-gray-900 dark:text-white md:text-5xl">
    //           <span className="text-transparent bg-clip-text bg-gradient-to-r to-[#34D399] from-[#41EC8B]">
    //             Summarizing your classes
    //           </span>{" "}
    //           <div> with ease.</div>
    //         </h1>
    //         <p className="text-lg font-normal text-gray-500 lg:text-xl dark:text-gray-400 max-w-xl">
    //           Let Leasy{" "}
    //           <span className="underline underline-offset-4 decoration-4 decoration-blue-400 dark:decoration-blue-600">
    //             summarize
    //           </span>{" "}
    //           your video lectures to save yourself hours of study time
    //         </p>
    //       </div>
    //       <div className="flex md:flex-row flex-col mt-14 gap-4 w-full items-center justify-center md:justify-start">
    //         <Link
    //           type="button"
    //           className="max-md:text-center max-md:w-1/2 max-sm:w-2/3 focus:outline-none text-white dark:text-gray-900 bg-action focus:ring-none font-medium rounded-lg text-sm px-5 py-2.5 self-center hover:bg-[#41EC8B] dark:hover:bg-[#3DDFA9] duration-200"
    //           href="/signup"
    //         >
    //           Get Started
    //         </Link>
    //         <Link
    //           type="button"
    //           className="max-md:hidden focus:outline-none focus:ring-none text-blue-700 dark:text-blue-600 bg-blue-200 hover:bg-[#3b82f6] dark:hover:bg-[#3b92f6] dark:hover:text-gray-50 hover:text-gray-50 rounded-lg text-sm px-5 py-2.5 self-center duration-200"
    //           href="/login"
    //         >
    //           Already have an account? Log in
    //         </Link>
    //         <div className="hidden max-md:flex flex-row items-center w-full gap-1 justify-center">
    //           <p>Already have an account?</p>
    //           <Link
    //             type="button"
    //             className="text-blue-600 dark:text-blue-200 hover:text-blue-700 dark:hover:text-blue-300 duration-200"
    //             href="/login"
    //           >
    //             Log in
    //           </Link>
    //         </div>
    //       </div>
    //     </div>
    //     <div className="flex max-md:justify-center max-md:items-center">
    //       <Image
    //         src="/main.png"
    //         width="1800"
    //         height="1800"
    //         className="min-w-[300px] w-[30vw] max-sm:w-[50vw] h-auto p-8"
    //         alt="main picture"
    //         priority
    //       />
    //     </div>
    //   </CardGrid>
    // </section>
  );
};
