import React from "react";
import Image from "next/image";
import { CardGrid } from "@/app/components/ui/cards/CardGrid";
import Link from "next/link";

export default function Home() {
  return (
    <CardGrid
      cols={2}
      // backDrop={true}
      // backDropElement={<CardBackdropHomepage />}
    >
      <div className="flex flex-col justify-center items-center p-4 leading-normal">
        <div className="flex flex-col">
          <h2 className="mb-2 text-3xl md:text-4xl font-bold tracking-tight text-[#41EC8B] dark:text-[#34D399] max-w-md">
            Summarizing your classes with ease
          </h2>
          <p className="lg:font mb-3 md:text-[18px] max-w-md font-bold text-gray-900 dark:text-gray-300 md:pt-5">
            Let Leasy summarize your video lectures to save yourself hours of
            study time
          </p>
        </div>
        <div className="flex md:flex-row flex-col mt-14 gap-4 w-full items-center justify-center md:justify-start">
          <Link
            type="button"
            className="max-md:text-center max-md:w-1/2 max-sm:w-2/3 focus:outline-none text-white dark:text-gray-900 bg-action focus:ring-none font-medium rounded-lg text-sm px-5 py-2.5 self-center hover:bg-[#41EC8B] dark:hover:bg-[#3DDFA9] duration-200"
            href="/signup"
          >
            Try it now for free
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
          className="w-[30vw] max-sm:w-[50vw] h-auto p-8"
          alt="main picture"
          priority
        />
      </div>
    </CardGrid>
  );
}
