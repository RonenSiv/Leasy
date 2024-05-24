import React from "react";
import Image from "next/image";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faUserCircle } from "@fortawesome/free-solid-svg-icons";

export const Navbar = () => {
  return (
    <nav className="sticky w-full z-20 top-0 start-0">
      <div className="max-w-screen-xl flex flex-wrap items-center justify-between mx-auto">
        <Image
          src="/favicon.ico"
          width={150}
          height={150}
          alt="Picture leasy logo"
        />
        <div className="flex md:order-2 space-x-3 md:space-x-0 rtl:space-x-reverse">
          <FontAwesomeIcon
            icon={faUserCircle}
            className="fas fa-check"
            size="2x"
          />
        </div>
      </div>
      <hr className="h-0.5 border-t-0 bg-neutral-100 w-[95vw] opacity-65 rounded-3xl mx-auto" />
    </nav>
  );
};
