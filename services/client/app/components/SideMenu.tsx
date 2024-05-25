"use client";
import { AnimatePresence, motion } from "framer-motion";
import Image from "next/image";
import React from "react";
import Link from "next/link";
import { routesLinks } from "@/app/routes/routes";

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
            className="fixed top-0 right-0 h-full bg-white z-50"
          >
            <div className="flex justify-center p-4">
              <Image
                src={"/signup.png"}
                alt={"auth picture"}
                width={1600}
                height={1600}
                className="w-[10vw] max-sm:w-[50vw] h-auto"
              />
            </div>
            <div className="flex flex-col justify-start items-center h-full">
              <motion.div
                className="justify-self-start  container flex flex-col items-center justify-start gap-3 mx-auto"
                initial="closed"
                animate="open"
                exit="closed"
                variants={sideVariants}
              >
                {routesLinks.map(({ name, to, id, icon }) => (
                  <Link
                    key={id}
                    href={to}
                    className="hover:cursor-pointer transition-transform duration-200 ease-in-out hover:scale-110 flex flex-row items-center gap-2 w-1/2"
                  >
                    {
                      // @ts-ignore
                      icon()
                    }{" "}
                    {name}
                  </Link>
                ))}
              </motion.div>
              <motion.div className="flex-1 flex flex-col items-center justify-center">
                <motion.button
                  type="submit"
                  className="text-white bg-[#2CA15D] hover:bg-[#1F7D45] font-medium rounded-lg text-sm w-full px-5 py-2.5 text-center"
                  initial="closedButton"
                  animate="openButton"
                  exit="closedButton"
                  variants={sideVariants}
                >
                  Sign up
                </motion.button>
              </motion.div>
            </div>
          </motion.aside>
        </>
      )}
    </AnimatePresence>
  );
};
