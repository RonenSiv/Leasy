import React, { useRef, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { useClickAway } from "react-use";
import { useClient } from "@/providers/client-provider";
import {
  AiOutlineCloudUpload,
  AiOutlineForm,
  AiOutlineRollback,
  AiOutlineSetting,
  AiOutlineUpload,
} from "react-icons/ai";
import { BiHomeSmile, BiLogIn, BiLogOut } from "react-icons/bi";
import Link from "next/link";
import Image from "next/image";
import { ClientAvatar } from "@/components/client-avatar";
import { Spinner } from "../ui/spinner";
import { RxHamburgerMenu } from "react-icons/rx";

const profileLinks = [
  {
    title: "Your uploads",
    Icon: AiOutlineCloudUpload,
    href: "/dashboard/video",
  },
  {
    title: "Upload a new video",
    Icon: AiOutlineUpload,
    href: "/dashboard/upload",
  },
];

const visitorItems = [
  [{ title: "Home", Icon: BiHomeSmile, href: "/" }],
  [{ title: "Account Settings", Icon: AiOutlineSetting, href: "/" }],

  [
    { title: "Login", Icon: BiLogIn, href: "/login" },
    { title: "Signup", Icon: AiOutlineForm, href: "/signup" },
  ],
];

const framerSidebarBackground = {
  initial: { opacity: 0 },
  animate: { opacity: 1 },
  exit: { opacity: 0, transition: { delay: 0.2 } },
  transition: { duration: 0.3 },
};

const framerSidebarPanel = {
  initial: { x: "100%" },
  animate: { x: 0 },
  exit: { x: "200%" },
  transition: { duration: 0.3 },
};

const framerText = (delay: number) => {
  return {
    initial: { opacity: 0, x: 50 },
    animate: { opacity: 1, x: 0 },
    transition: {
      delay: 0.1 + delay / 10,
    },
  };
};

const framerIcon = {
  initial: { scale: 0 },
  animate: { scale: 1 },
  transition: {
    type: "spring",
    stiffness: 260,
    damping: 20,
    delay: 0.4,
  },
};

const LoggedInContent: React.FC<{
  toggleSidebar: () => void;
}> = ({ toggleSidebar }) => {
  const { name, avatar, email, isLoading, logout } = useClient();
  const loggedInItems = [
    [{ title: "Home", Icon: BiHomeSmile, href: "/" }],
    profileLinks,
    [
      {
        title: "Account Settings",
        Icon: AiOutlineSetting,
        href: "/settings/profile",
      },
      {
        title: "Logout",
        Icon: BiLogOut,
        href: "/",
        danger: true,
        action: logout,
      },
    ],
  ];
  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-full">
        <div className="animate-spin rounded-full h-32 w-32 border-t-2 border-b-2 border-gray-900 dark:border-gray-100"></div>
      </div>
    );
  }
  return (
    <>
      <div>
        <div className="flex items-center justify-between p-5 border-b-2 border-gray-200 dark:border-gray-800">
          <span>
            <div className="flex items-center gap-4">
              <ClientAvatar width="40px" height="40px" />
              <div className="font-medium">
                <div>{name}</div>
                <div className="text-sm text-gray-500 dark:text-gray-400">
                  {email}
                </div>
              </div>
            </div>
          </span>
          <button
            onClick={toggleSidebar}
            className="p-3 border-2 border-gray-200 rounded-xl hover:bg-gray-100 hover:border-gray-300 hover:cursor-pointer duration-200 dark:border-gray-800 dark:hover:bg-gray-700"
            aria-label="close sidebar"
          >
            <AiOutlineRollback className="text-gray-800 dark:text-gray-200" />
          </button>
        </div>
        <ul>
          {loggedInItems.map((group, groupIdx) => {
            if (Array.isArray(group)) {
              return (
                <React.Fragment key={groupIdx}>
                  {group.map((item, idx) => {
                    const { title, href, Icon, danger, action } = item;
                    return (
                      <li key={title}>
                        <Link
                          onClick={() => {
                            toggleSidebar();
                            if (action) {
                              action();
                            }
                          }}
                          href={href}
                          className={`flex items-center justify-between gap-5 p-5 transition-all ${danger ? "hover:bg-red-300 dark:hover:bg-red-500" : "hover:bg-gray-100 dark:hover:bg-gray-700"} hover:cursor-pointer duration-200 `}
                        >
                          <motion.span
                            {...framerText(idx)}
                            className="text-gray-900 dark:text-gray-200"
                          >
                            {title}
                          </motion.span>
                          <motion.div {...framerIcon}>
                            <Icon className="text-2xl text-gray-800 dark:text-gray-200" />
                          </motion.div>
                        </Link>
                      </li>
                    );
                  })}
                  <hr className="border-t-2 border-gray-200 dark:border-gray-800" />
                </React.Fragment>
              );
            }
          })}
        </ul>
      </div>
    </>
  );
};

const VisitorContent: React.FC<{
  toggleSidebar: () => void;
}> = ({ toggleSidebar }) => {
  return (
    <>
      <div>
        <div className="flex items-center justify-between p-5 border-b-2 border-gray-200 dark:border-gray-800">
          <span>
            <div className="flex items-center gap-4">
              <Image
                className="w-12 h-12 rounded-full"
                src="/signup.png"
                alt="profile"
                width={100}
                height={100}
              />
              <div className="font-medium">
                <div>Hi there</div>
                <div className="text-sm text-gray-500 dark:text-gray-400">
                  <Link href="/login" onClick={toggleSidebar}>
                    Login
                  </Link>{" "}
                  or{" "}
                  <Link href="/signup" onClick={toggleSidebar}>
                    Signup
                  </Link>
                </div>
              </div>
            </div>
          </span>
          <button
            onClick={toggleSidebar}
            className="p-3 border-2 border-gray-200 rounded-xl hover:bg-gray-100 hover:border-gray-300 hover:cursor-pointer duration-200 dark:border-gray-800 dark:hover:bg-gray-700"
            aria-label="close sidebar"
          >
            <AiOutlineRollback className="text-gray-800 dark:text-gray-200" />
          </button>
        </div>
        <ul>
          {visitorItems.map((group, groupIdx) => {
            if (Array.isArray(group)) {
              return (
                <React.Fragment key={groupIdx}>
                  {group.map((item, idx) => {
                    const { title, href, Icon } = item;
                    return (
                      <li key={title}>
                        <Link
                          onClick={toggleSidebar}
                          href={href}
                          className="flex items-center justify-between gap-5 p-5 transition-all hover:bg-gray-100 hover:cursor-pointer duration-200 dark:hover:bg-gray-700"
                        >
                          <motion.span
                            {...framerText(idx)}
                            className="text-gray-900 dark:text-gray-200"
                          >
                            {title}
                          </motion.span>
                          <motion.div {...framerIcon}>
                            <Icon className="text-2xl text-gray-800 dark:text-gray-200" />
                          </motion.div>
                        </Link>
                      </li>
                    );
                  })}
                  <hr className="border-t-2 border-gray-200 dark:border-gray-800" />
                </React.Fragment>
              );
            }
          })}
        </ul>
      </div>
    </>
  );
};

export const Sidebar = () => {
  const [open, setOpen] = useState(false);
  const { isLoading, isLogged } = useClient();
  const ref = useRef(null);
  useClickAway(ref, () => setOpen(false));
  const toggleSidebar = () => setOpen((prev) => !prev);
  if (isLoading) {
    <Spinner />;
  }
  return (
    <>
      <button onClick={toggleSidebar} aria-label="toggle sidebar">
        {isLogged && <ClientAvatar width="40px" height="40px" />}
        {!isLogged && <RxHamburgerMenu className="text-3xl" />}
      </button>
      <AnimatePresence mode="wait" initial={false}>
        {open && (
          <>
            <motion.div
              {...framerSidebarBackground}
              aria-hidden="true"
              className="fixed bottom-0 left-0 right-0 top-0 z-40 bg-[rgba(0,0,0,0.1)] backdrop-blur-sm dark:bg-[rgba(0,0,0,0.4)]"
            ></motion.div>
            <motion.div
              {...framerSidebarPanel}
              className="fixed top-0 bottom-0 right-0 z-50 w-full h-screen max-w-xs border-r-2 border-gray-200 bg-white text-black dark:border-gray-800 dark:bg-gray-900 dark:text-white"
              ref={ref}
              aria-label="Sidebar"
            >
              <div className={"flex flex-col justify-start w-full h-full"}>
                {isLogged && <LoggedInContent toggleSidebar={toggleSidebar} />}
                {!isLogged && <VisitorContent toggleSidebar={toggleSidebar} />}
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  );
};
