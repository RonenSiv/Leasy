import Image from "next/image";
import React from "react";

export const Hero = () => {
  return (
    <div className="flex flex-col items-center bg-white border border-gray-200 rounded-lg shadow md:flex-row px-16 md:min-w-[600px]">
      <div className="flex flex-col justify-between p-4 leading-normal gap-10">
        <div>
          <h2 className="mb-2 lg:text-4xl md:text-2xl max-sm:text-3xl font-bold tracking-tight text-[#41EC8B] max-w-md">
            Summarizing your classes with ease
          </h2>
          <p className="lg:font mb-3 md:text-sm lg:text-[18px] max-w-md font-bold text-gray-900 md:pt-5">
            Let Leasy summarize your video lectures to save yourself hours of
            study time
          </p>
        </div>
        <button
          type="button"
          className="focus:outline-none text-white bg-[#39CF78] hover:bg-[#2ba964] focus:ring-none font-medium rounded-lg text-sm px-5 py-2.5 mb-2 self-start"
        >
          Try it now for free
        </button>
      </div>
      <Image
        src="/main.png"
        width="0"
        height="0"
        className="w-[30vw] max-sm:w-[50vw] h-auto"
        alt="main picture"
        unoptimized
      />
    </div>
  );
};
