import React from "react";
import Image from "next/image";
import { CardGrid } from "@/app/components/CardGrid";
import Link from "next/link";

export default function Home() {
  return (
    <CardGrid cols={2}>
      <div className="flex flex-col justify-center p-4 leading-normal">
        <div>
          <h2 className="mb-2 lg:text-4xl md:text-2xl max-sm:text-3xl font-bold tracking-tight text-[#41EC8B] max-w-md">
            Summarizing your classes with ease
          </h2>
          <p className="lg:font mb-3 md:text-sm lg:text-[18px] max-w-md font-bold text-gray-900 md:pt-5">
            Let Leasy summarize your video lectures to save yourself hours of
            study time
          </p>
        </div>
        <Link
          type="button"
          className="focus:outline-none text-white bg-[#39CF78] hover:bg-[#2ba964] focus:ring-none font-medium rounded-lg text-sm px-5 py-2.5 mt-14 self-start"
          href="/signup"
        >
          Try it now for free
        </Link>
      </div>
      <Image
        src="/main.png"
        width="1800"
        height="1800"
        className="w-[30vw] max-sm:w-[50vw] h-auto"
        alt="main picture"
        priority
      />
    </CardGrid>
  );
}
