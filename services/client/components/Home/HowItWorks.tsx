"use client";
import { motion, useAnimation } from "framer-motion";
import React, { useEffect } from "react";
import { useInView } from "react-intersection-observer";

const transition = { duration: 4, ease: "easeInOut" };

export const HowItWorks = () => {
  const controls = useAnimation();
  const [ref, inView] = useInView({ triggerOnce: false, threshold: 0.1 });

  useEffect(() => {
    if (inView) {
      controls.start({ pathLength: 1 });
    } else {
      controls.start({ pathLength: 0 });
    }
  }, [controls, inView]);

  return (
    <section
      ref={ref}
      className="relative py-10 sm:py-16 lg:py-24 bg-gray-50 dark:bg-[#202E3A] w-full"
    >
      <div className="px-4 mx-auto max-w-7xl sm:px-6 lg:px-8">
        <div className="max-w-2xl mx-auto text-center">
          <h2 className="text-4xl dark:text-white text-gray-800 font-extrabold mx-auto md:text-6xl lg:text-5xl">
            How does it work?
          </h2>
          <p className="max-w-2xl mx-auto mt-4 text-base text-gray-400 leading-relaxed md:text-2xl">
            Our site is designed to be user-friendly and intuitive. Here's how
            you can get started
          </p>
        </div>
        <div className="relative mt-12 lg:mt-20">
          <div className="absolute inset-x-0 hidden xl:px-44 top-2 md:block md:px-20 lg:px-28">
            <svg
              width="875"
              height="48"
              viewBox="0 0 875 48"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <motion.path
                d="M2 29C20.2154 33.6961 38.9915 35.1324 57.6111 37.5555C80.2065 40.496 102.791 43.3231 125.556 44.5555C163.184 46.5927 201.26 45 238.944 45C312.75 45 385.368 30.7371 458.278 20.6666C495.231 15.5627 532.399 11.6429 569.278 6.11109C589.515 3.07551 609.767 2.09927 630.222 1.99998C655.606 1.87676 681.208 1.11809 706.556 2.44442C739.552 4.17096 772.539 6.75565 805.222 11.5C828 14.8064 850.34 20.2233 873 24"
                stroke="#D4D4D8"
                strokeWidth="3"
                strokeLinecap="round"
                strokeDasharray="1 50"
                initial={{ pathLength: 0 }}
                animate={controls}
                transition={transition}
              />
            </svg>
          </div>
          <div className="relative grid grid-cols-1 text-center gap-y-12 md:grid-cols-3 gap-x-12">
            <div>
              <div className="flex items-center justify-center w-16 h-16 mx-auto bg-white border-2 border-gray-200 rounded-full shadow">
                <span className="text-xl font-semibold text-gray-700">1</span>
              </div>
              <h3 className="mt-6 text-xl dark:text-white text-gray-800 font-semibold leading-tight md:mt-10">
                Create your account
              </h3>
              <p className="mt-4 text-base text-gray-400 md:text-lg">
                Sign up and start using our app right away
              </p>
            </div>
            <div>
              <div className="flex items-center justify-center w-16 h-16 mx-auto bg-white border-2 border-gray-200 rounded-full shadow">
                <span className="text-xl font-semibold text-gray-700">2</span>
              </div>
              <h3 className="mt-6 text-xl dark:text-white text-gray-800 font-semibold leading-tight md:mt-10">
                Upload the videos you want to watch
              </h3>
              <p className="mt-4 text-base text-gray-400 md:text-lg">
                Leasy supports a wide range of video formats and resolutions
              </p>
            </div>
            <div>
              <div className="flex items-center justify-center w-16 h-16 mx-auto bg-white border-2 border-gray-200 rounded-full shadow">
                <span className="text-xl font-semibold text-gray-700">3</span>
              </div>
              <h3 className="mt-6 text-xl dark:text-white text-gray-800 font-semibold leading-tight md:mt-10">
                Start learning
              </h3>
              <p className="mt-4 text-base text-gray-400 md:text-lg">
                Dive into the various tools and functionalities our app offers
                and start learning
              </p>
            </div>
          </div>
        </div>
      </div>
      <div
        className="absolute inset-0 m-auto max-w-xs h-[357px] blur-[118px] sm:max-w-md md:max-w-lg"
        style={{
          background:
            "radial-gradient(1.89deg, rgba(34, 78, 95, 0.4) -1000%, rgba(191, 227, 205, 0.26) 1500.74%, rgba(34, 140, 165, 0.41) 56.49%, rgba(28, 47, 99, 0.11) 1150.91%)",
        }}
      ></div>
    </section>
  );
};
