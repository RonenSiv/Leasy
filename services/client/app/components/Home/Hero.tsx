import Link from "next/link";
import Image from "next/image";
import { CardGrid } from "@/app/components/ui/cards/CardGrid";
import React from "react";

export const Hero = () => {
  return (
    <section>
      <CardGrid
        cols={2}
        className={
          "py-2 mb-auto mt-8 border-0 rounded-none dark:shadow-none shadow-none"
        }
        stretchHorizontal={true}
      >
        <div className="flex flex-col justify-center items-center p-4 leading-normal">
          <div className="flex flex-col">
            <h1 className="mb-4 text-4xl font-extrabold text-gray-900 dark:text-white md:text-5xl">
              <span className="text-transparent bg-clip-text bg-gradient-to-r to-[#34D399] from-[#41EC8B]">
                Summarizing your classes
              </span>{" "}
              <div> with ease.</div>
            </h1>
            <p className="text-lg font-normal text-gray-500 lg:text-xl dark:text-gray-400 max-w-xl">
              Let Leasy{" "}
              <span className="underline underline-offset-4 decoration-4 decoration-blue-400 dark:decoration-blue-600">
                summarize
              </span>{" "}
              your video lectures to save yourself hours of study time
            </p>
          </div>
          <div className="flex md:flex-row flex-col mt-14 gap-4 w-full items-center justify-center md:justify-start">
            <Link
              type="button"
              className="max-md:text-center max-md:w-1/2 max-sm:w-2/3 focus:outline-none text-white dark:text-gray-900 bg-action focus:ring-none font-medium rounded-lg text-sm px-5 py-2.5 self-center hover:bg-[#41EC8B] dark:hover:bg-[#3DDFA9] duration-200"
              href="/signup"
            >
              Get Started
            </Link>
            <Link
              type="button"
              className="max-md:hidden focus:outline-none focus:ring-none text-blue-700 dark:text-blue-600 bg-blue-200 hover:bg-[#3b82f6] dark:hover:bg-[#3b92f6] dark:hover:text-gray-50 hover:text-gray-50 rounded-lg text-sm px-5 py-2.5 self-center duration-200"
              href="/login"
            >
              Already have an account? Log in
            </Link>
            <div className="hidden max-md:flex flex-row items-center w-full gap-1 justify-center">
              <p>Already have an account?</p>
              <Link
                type="button"
                className="text-blue-600 dark:text-blue-200 hover:text-blue-700 dark:hover:text-blue-300 duration-200"
                href="/login"
              >
                Log in
              </Link>
            </div>
          </div>
        </div>
        <div className="flex max-md:justify-center max-md:items-center">
          <Image
            src="/main.png"
            width="1800"
            height="1800"
            className="min-w-[300px] w-[30vw] max-sm:w-[50vw] h-auto p-8"
            alt="main picture"
            priority
          />
        </div>
      </CardGrid>
    </section>
  );
};
