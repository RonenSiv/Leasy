"use client";

import React, { useEffect, useState } from "react";
import Image from "next/image";
import { Sidebar } from "@/app/components/SideMenu";
import { usePathname, useRouter } from "next/navigation";
import { useTheme } from "next-themes";
import { IoIosMoon } from "react-icons/io";
import { IoSunny } from "react-icons/io5";

export const Navbar = () => {
  const [open, setOpen] = useState(false);
  const pathname = usePathname();
  const router = useRouter();
  const { theme, setTheme } = useTheme();

  useEffect(() => {
    if (open) {
      setOpen((prevState) => false);
    }
  }, [pathname]);

  return (
    <nav className="sticky w-full z-20 top-0 start-0">
      <div className="max-w-screen-xl flex flex-wrap items-center justify-between mx-auto bg-transparent">
        <Image
          src="/favicon.ico"
          width={150}
          height={150}
          alt="Picture leasy logo"
          className="hover:cursor-pointer"
          onClick={() => router.push("/")}
        />
        <div className="flex md:order-2 space-x-3 md:space-x-0 rtl:space-x-reverse">
          <button
            className="dark:bg-gray-800 bg-gray-50 dark:hover:bg-gray-600 hover:bg-gray-300 transition-all duration-100 dark:text-white text-gray-800 px-4 py-2 rounded-lg mr-4"
            onClick={() =>
              theme === "dark" ? setTheme("light") : setTheme("dark")
            }
          >
            {theme === "dark" ? (
              <IoIosMoon className="text-gray-800 dark:text-gray-200 text-xl" />
            ) : (
              <IoSunny className="text-gray-800 dark:text-gray-200 text-xl" />
            )}
          </button>
          <Sidebar />
        </div>
      </div>
      <hr className="h-0.5 border-t-0 dark:bg-neutral-100 bg-neutral-700 w-[95vw] opacity-65 rounded-3xl mx-auto" />
    </nav>
  );
};
