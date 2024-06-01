import React, { useState } from "react";
import { CgTranscript } from "react-icons/cg";
import { MdSummarize } from "react-icons/md";
import { FaBrain } from "react-icons/fa6";
import { AnimatePresence, motion } from "framer-motion";
import { IconType } from "react-icons";

enum Tab {
  NONE = -1,
  TRANSCRIPT,
  SUMMARY,
  TEST,
}

const tabContent = [
  { title: "Transcription", icon: CgTranscript },
  { title: "Summary", icon: MdSummarize },
  { title: "Test yourself", icon: FaBrain },
];

const verticalTabVariants = {
  closed: { x: 0, opacity: 0 },
  hover: { x: 20, scale: 1.1 },
};

const AnimatedTab = ({
  tab,
  offset,
  setCurrentTab,
  currentTabHover,
  setCurrentTabHover,
}: {
  tab: { title: string; icon: IconType };
  offset: number;
  setCurrentTab: (index: number) => void;
  currentTabHover: Tab | null;
  setCurrentTabHover: (index: number) => void;
}) => {
  return (
    <motion.div
      whileHover="hover"
      initial={{ x: 0, opacity: 0 }}
      animate={{ x: 0, opacity: 1 }}
      onClick={() => setCurrentTab(offset)}
      onHoverStart={() => setCurrentTabHover(offset)}
      onHoverEnd={() => setCurrentTabHover(Tab.NONE)}
      className={`absolute ${top} -left-12 flex z-50 bg-gray-50 dark:bg-gray-800 dark:text-gray-200 text-gray-800 rounded-lg w-full cursor-pointer hover:text-gray-800 hover:bg-gray-300 dark:hover:bg-gray-500 dark:hover:text-gray-300`}
      style={{ top: `${offset * 5}rem` }}
    >
      {currentTabHover === offset && (
        <motion.div
          className="p-6 bg-gray-50 text-medium bg-inherit rounded-lg"
          initial={{ x: 0, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          style={{ minWidth: "max-content", scale: 1.1 }}
        >
          {tab.title}
        </motion.div>
      )}
      <motion.div
        className="p-6 bg-gray-50 text-medium bg-inherit rounded-lg"
        variants={verticalTabVariants}
        transition={{ duration: 0.2 }}
      >
        <tab.icon className="inline-block w-6 h-6" />
      </motion.div>
    </motion.div>
  );
};

export const StudyCardTabs = ({
  vertical = false,
  absolute = false,
}: {
  vertical?: boolean;
  absolute?: boolean;
}) => {
  const [currentTab, setCurrentTab] = useState(Tab.NONE);
  const [currentTabHover, setCurrentTabHover] = useState<Tab | null>(null);
  return (
    <>
      {!vertical && (
        <div className="w-full h-full p-4 flex flex-col gap-4">
          <ul className="flex flex-wrap text-sm font-medium text-center border-b border-gray-700 dark:text-gray-800">
            {tabContent.map((tab, index) => (
              <li
                className={`me-2 cursor-pointer items-center hover:text-gray-600 hover:bg-gray-50 dark:hover:bg-gray-800 dark:hover:text-gray-300 rounded-t-lg ${
                  currentTab === index || (currentTab === -1 && index === 0)
                    ? "text-gray-800 bg-gray-50 dark:bg-gray-800 dark:text-gray-200"
                    : ""
                }`}
                key={index}
                onClick={() => setCurrentTab(index)}
              >
                <h5 className="flex items-center gap-2 text-xl font-extrabold  p-4">
                  <tab.icon className="inline-block w-6 h-6 mr-2" />
                  {tab.title}
                </h5>
              </li>
            ))}
          </ul>
          <div className="flex flex-col gap-4 p-8 h-full z-1 overflow-y-auto rounded-lg text-justify dark:text-gray-200 dark:text-opacity-80 text-gray-800 text-opacity-80 bg-gray-50 dark:bg-gray-800">
            <div>
              Lorem ipsum dolor sit amet, consectetur adipisicing elit. A
              blanditiis eos magnam tempora tenetur. Accusamus aperiam at
              doloremque enim, eum illo illum laboriosam nisi nulla obcaecati
              quasi, quia, reprehenderit veniam!
            </div>
            <div>
              Eius fuga placeat provident quibusdam quo? Consequuntur dolore
              dolorem dolorum excepturi facilis in officiis quia quibusdam ullam
              voluptate. Alias architecto dicta dolorum harum iste libero quis
              quos repellat ullam voluptatibus.
            </div>
          </div>
        </div>
      )}
      {vertical && (
        <div
          className={`relative flex flex-col gap-4 ${absolute ? "relative top-0 z-[200] max-w-sm" : ""}`}
        >
          {currentTab !== Tab.NONE && (
            <>
              <ul className="flex-column space-y space-y-4 text-sm font-medium text-gray-700 dark:text-gray-400 md:me-4 mb-4 md:mb-0">
                {tabContent.map((tab, index) => (
                  <li
                    className={`cursor-pointer items-center hover:text-gray-800 hover:bg-gray-50 dark:hover:bg-gray-800 dark:hover:text-gray-300 rounded-lg ${
                      currentTab === index
                        ? "text-gray-800 bg-gray-50 dark:bg-gray-800 dark:text-gray-200"
                        : ""
                    }`}
                    key={index}
                    onClick={() => {
                      if (currentTab === index) setCurrentTab(Tab.NONE);
                      else setCurrentTab(index);
                    }}
                  >
                    <h5 className="flex items-center gap-0 text-xl font-extrabold p-2">
                      <tab.icon className="inline-block w-6 h-6 mr-2" />
                      {tab.title}
                    </h5>
                  </li>
                ))}
              </ul>
              <div className="p-6 bg-gray-50 text-medium text-gray-800 dark:text-gray-400 dark:bg-gray-800 rounded-lg w-full overflow-y-auto scrollbar-thin scrollbar-thumb-gray-300 scrollbar-track-white dark:scrollbar-thumb-gray-700 dark:scrollbar-track-gray-800">
                <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-2">
                  Profile Tab
                </h3>
                <p className="mb-2">
                  This is some placeholder content the Profile tabs associated
                  content, clicking another tab will toggle the visibility of
                  this one for the next.
                </p>
                <p>
                  The tab JavaScript swaps classes to control the content
                  visibility and styling.
                </p>
              </div>
            </>
          )}
          {currentTab === -1 && (
            <AnimatePresence>
              <motion.div
                className={`relative flex flex-col gap-4 max-xs:ms-2 w-full bg-transparent rounded-lg`}
              >
                {tabContent.map((tab, index) => (
                  <AnimatedTab
                    key={index}
                    tab={tab}
                    offset={index}
                    setCurrentTab={setCurrentTab}
                    currentTabHover={currentTabHover}
                    setCurrentTabHover={setCurrentTabHover}
                  />
                ))}
              </motion.div>
            </AnimatePresence>
          )}
        </div>
      )}
    </>
  );
};
