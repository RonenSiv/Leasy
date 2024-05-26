"use client";
import { AnimatePresence, motion } from "framer-motion";
import Image from "next/image";
import React from "react";
import Link from "next/link";
import { routesLinks } from "@/app/routes/routes";
import { getBrowserClient } from "@/app/model/auth/client.browser";
import { useRouter } from "next/navigation";
import { FaRegCircleUser } from "react-icons/fa6";

const sideVariants = {
  closed: {
    transition: { duration: 0 },
  },
  open: {
    transition: {
      staggerChildren: 0.08,
      staggerDirection: 1,
    },
  },
  openButton: {
    opacity: 1,
    transition: { duration: 0.2 },
  },
  closedButton: {
    opacity: 0,
    transition: { duration: 0.1 },
  },
};

export const SideMenu = ({
  open,
  toggleMenu,
}: {
  open: boolean;
  toggleMenu: () => void;
}) => {
  const client = getBrowserClient();
  const router = useRouter();

  const handleLoginLogout = async () => {
    if (client.loggedIn()) {
      client.logout();
      router.push("/login");
    } else {
      router.push("/login");
    }
  };
  return (
    <AnimatePresence>
      {open && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 0.5 }}
            exit={{ opacity: 0 }}
            className="fixed top-0 left-0 w-full h-full bg-black z-40"
            onClick={toggleMenu}
          />
          <motion.aside
            initial={{ width: 0 }}
            animate={{
              width: 300,
            }}
            exit={{
              width: 0,
              transition: { delay: 0, duration: 0.3 },
            }}
            className="fixed top-0 right-0 h-full bg-white z-50 px-8"
          >
            <div className="flex flex-col justify-center p-4">
              <Image
                src={"/signup.png"}
                alt={"auth picture"}
                width={1600}
                height={1600}
                className="w-[10vw] max-sm:w-[50vw] h-auto"
              />
              <motion.h1
                className="mb-4 text-3xl font-extrabold text-gray-900 md:text-5xl lg:text-4xl text-center"
                initial="closed"
                animate="open"
                exit="closed"
                variants={sideVariants}
              >
                <motion.span
                  className="text-transparent bg-clip-text bg-gradient-to-r to-[#39F6CD] from-[#41EB88]"
                  initial="closed"
                  animate="open"
                  exit="closed"
                  variants={sideVariants}
                >
                  Leasy
                </motion.span>{" "}
                Learning Made Easy
              </motion.h1>
            </div>
            {client.loggedIn() ? (
              <div className="flex flex-col justify-start items-center h-full">
                <motion.div
                  className="justify-self-start  container flex flex-col items-start justify-start gap-3 mx-auto"
                  initial="closed"
                  animate="open"
                  exit="closed"
                  variants={sideVariants}
                >
                  {routesLinks.map(({ name, to, id, icon }) => (
                    <Link
                      key={id}
                      href={to}
                      className="inline-flex items-center justify-center p-5 text-base font-medium text-gray-700 rounded-lg bg-[#41EB88] hover:text-gray-900 hover:bg-[#39F6CD]"
                    >
                      <div className="flex flex-row items-center gap-4 w-full">
                        {
                          // @ts-ignore
                          icon()
                        }{" "}
                        <span className="w-full">{name}</span>
                      </div>
                      <svg
                        className="w-4 h-4 ms-2 rtl:rotate-180"
                        aria-hidden="true"
                        xmlns="http://www.w3.org/2000/svg"
                        fill="none"
                        viewBox="0 0 14 10"
                      >
                        <path
                          stroke="currentColor"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth="2"
                          d="M1 5h12m0 0L9 1m4 4L9 9"
                        />
                      </svg>
                    </Link>
                  ))}
                  <motion.button
                    type="submit"
                    className="inline-flex items-center justify-center p-5 text-base font-medium text-gray-700 rounded-lg bg-[#2DC4A4] hover:bg-[#1E967D] hover:text-gray-900"
                    initial="closedButton"
                    animate="openButton"
                    exit="closedButton"
                    variants={sideVariants}
                    onClick={handleLoginLogout}
                  >
                    <div className="flex flex-row items-center gap-4 w-full">
                      <FaRegCircleUser size="20" />
                      {client.loggedIn() ? "Logout" : "Login"}
                    </div>
                    <svg
                      className="w-4 h-4 ms-2 rtl:rotate-180"
                      aria-hidden="true"
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 14 10"
                    >
                      <path
                        stroke="currentColor"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="2"
                        d="M1 5h12m0 0L9 1m4 4L9 9"
                      />
                    </svg>
                  </motion.button>
                </motion.div>
              </div>
            ) : (
              <motion.div
                className="flex flex-col justify-start items-start h-full gap-4"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
              >
                <motion.p
                  className="text-lg font-normal text-gray-500 lg:text-lg  text-center"
                  initial="closed"
                  animate="open"
                  exit="closed"
                  variants={sideVariants}
                >
                  Leasy is a platform that makes learning easy and fun. With
                  Leasy, you can learn anything you want, anytime you want.
                </motion.p>
                <motion.p
                  className="text-lg font-normal text-gray-500 lg:text-sm  text-center"
                  initial="closed"
                  animate="open"
                  exit="closed"
                  variants={sideVariants}
                >
                  Looking to learn something new? Sign up now and start learning
                </motion.p>
                <motion.button
                  type="submit"
                  className="text-white bg-[#2DC4A4] hover:bg-[#1E967D] font-medium rounded-lg text-sm w-full px-5 py-2.5 text-center"
                  initial="closedButton"
                  animate="openButton"
                  exit="closedButton"
                  variants={sideVariants}
                  onClick={() => {
                    toggleMenu();
                    router.push("/login");
                  }}
                >
                  Login
                </motion.button>
                <motion.button
                  type="submit"
                  className="text-white bg-[#1E965A] hover:bg-[#0F693C] font-medium rounded-lg text-sm w-full px-5 py-2.5 text-center"
                  initial="closedButton"
                  animate="openButton"
                  exit="closedButton"
                  variants={sideVariants}
                  onClick={() => {
                    toggleMenu();
                    router.push("/signup");
                  }}
                >
                  Sign Up
                </motion.button>
              </motion.div>
            )}
          </motion.aside>
        </>
      )}
    </AnimatePresence>
  );
};
