"use client";

import React, { useState } from "react";
import Image from "next/image";
import { FaRegCircleUser } from "react-icons/fa6";
import { SideMenu } from "@/app/components/SideMenu";

export const Navbar = () => {
  const [open, setOpen] = useState(false);
  const toggleDrawer = () => {
    console.log("toggleDrawer");
    setOpen((prevState) => !prevState);
  };

  return (
    <nav className="sticky w-full z-20 top-0 start-0">
      <div className="max-w-screen-xl flex flex-wrap items-center justify-between mx-auto">
        <Image
          src="/favicon.ico"
          width={150}
          height={150}
          alt="Picture leasy logo"
        />
        <div className="flex md:order-2 space-x-3 md:space-x-0 rtl:space-x-reverse hover:cursor-pointer">
          <FaRegCircleUser size="30" onClick={toggleDrawer} />
        </div>
      </div>
      <hr className="h-0.5 border-t-0 bg-neutral-100 w-[95vw] opacity-65 rounded-3xl mx-auto" />
      <SideMenu open={open} toggleMenu={toggleDrawer} />
    </nav>
  );
};
