"use client";
import React, { useEffect, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";

const placeHolders = [
  {
    image: "https://source.unsplash.com/random/100x100?1",
    quote: "Lorem ipsum dolor sit amet consectetur adipisicing elit.",
    author: "John Doe",
  },
  {
    image: "https://source.unsplash.com/random/100x100?2",
    quote: "Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.",
    author: "Jane Smith",
  },
  {
    image: "https://source.unsplash.com/random/100x100?3",
    quote:
      "Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris.",
    author: "Robert Brown",
  },
  {
    image: "https://source.unsplash.com/random/100x100?4",
    quote:
      "Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur.",
    author: "Emily Davis",
  },
];

const Testimonial = ({
  image,
  quote,
  author,
}: {
  image: string;
  quote: string;
  author: string;
}) => {
  return (
    <div className="flex flex-col items-center space-y-4">
      <svg
        className="h-12 mx-auto mb-3 text-gray-100 dark:text-gray-600"
        viewBox="0 0 24 27"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <path
          d="M14.017 18L14.017 10.609C14.017 4.905 17.748 1.039 23 0L23.995 2.151C21.563 3.068 20 5.789 20 8H24V18H14.017ZM0 18V10.609C0 4.905 3.748 1.038 9 0L9.996 2.151C7.563 3.068 6 5.789 6 8H9.983L9.983 18L0 18Z"
          fill="currentColor"
        />
      </svg>
      <blockquote className="max-w-lg text-lg italic font-medium text-center">
        {quote}
      </blockquote>
      <div className="flex gap-2 items-center text-center dark:text-gray-600">
        <img
          src={image}
          alt=""
          className="w-10 h-10 rounded-full dark:bg-gray-500"
        />
        <div className="flex items-center divide-x-2 divide-gray-500 dark:divide-gray-700">
          <div className="pr-3 font-medium text-gray-100 dark:text-gray-700">
            {author}
          </div>
          <div className="pl-3 text-sm font-light text-gray-200 dark:text-gray-400">
            @username
          </div>
        </div>
      </div>
    </div>
  );
};

export const Testimonials = () => {
  const [current, setCurrent] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrent((prev) => (prev === placeHolders.length - 1 ? 0 : prev + 1));
    }, 5000);

    return () => clearInterval(interval);
  }, []);

  const handleClick = (index: React.SetStateAction<number>) => {
    setCurrent(index);
  };

  return (
    <section className="p-6 bg-white dark:bg-gray-800 w-full">
      <div className="container max-w-3xl mx-auto">
        <div className="flex flex-col items-center w-full p-6 space-y-8 rounded-md lg:h-full lg:p-8 bg-action text-gray-50 dark:bg-white  dark:text-gray-800">
          <AnimatePresence mode={"wait"}>
            <motion.div
              key={current}
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              transition={{ duration: 0.5 }}
            >
              <Testimonial {...placeHolders[current]} />
            </motion.div>
          </AnimatePresence>
          <div className="flex space-x-2">
            {placeHolders.map((_, index) => (
              <button
                key={index}
                type="button"
                aria-label={`Testimony ${index + 1}`}
                className={`w-2 h-2 rounded-full ${current === index ? "bg-gray-900" : "dark:bg-gray-400 bg-gray-300"}`}
                onClick={() => handleClick(index)}
              ></button>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};
