"use client";
import { FaBook, FaChalkboardTeacher, FaVideo } from "react-icons/fa";
import {
  MdLaptopChromebook,
  MdOutlineMenuBook,
  MdPersonalVideo,
} from "react-icons/md";
import { GiTeacher } from "react-icons/gi";
import { PiStudentFill } from "react-icons/pi";
import { FaSchool } from "react-icons/fa6";
import { TbSchool } from "react-icons/tb";
import React from "react";
import { motion } from "framer-motion";

const iconVariants = {
  initial: {
    y: -200,
    opacity: 0,
    rotate: 0,
  },
  animate: {
    y: "100%",
    opacity: [0, 0.5, 0],
    rotate: 360,
    transition: {
      duration: 10,
      ease: "easeOut",
    },
    repeat: Infinity,
  },
};

const getRandomPosition = () => {
  return {
    top: `${50 + Math.floor(Math.random() * 20)}%`,
    left: `${10 + Math.floor(Math.random() * 80)}%`,
  };
};

export const CardBackdropHomepage = () => {
  return (
    <div style={{ position: "relative", width: "100%", height: "100%" }}>
      <motion.div
        variants={iconVariants}
        initial="initial"
        animate="animate"
        style={{
          ...getRandomPosition(),
          position: "absolute",
        }}
      >
        <FaBook className={"text-[#41EC8B] dark:text-[#34D399] text-3xl"} />
      </motion.div>
      <motion.div
        variants={iconVariants}
        initial="initial"
        animate="animate"
        style={{
          ...getRandomPosition(),
          position: "absolute",
        }}
      >
        <MdLaptopChromebook
          className={"text-[#41EC8B] dark:text-[#34D399] text-3xl"}
        />
      </motion.div>
      <motion.div
        variants={iconVariants}
        initial="initial"
        animate="animate"
        style={{
          ...getRandomPosition(),
          position: "absolute",
        }}
      >
        <MdOutlineMenuBook
          className={"text-[#41EC8B] dark:text-[#34D399] text-3xl"}
        />
      </motion.div>
      <motion.div
        variants={iconVariants}
        initial="initial"
        animate="animate"
        style={{
          ...getRandomPosition(),
          position: "absolute",
        }}
      >
        <MdPersonalVideo
          className={"text-[#41EC8B] dark:text-[#34D399] text-3xl"}
        />
      </motion.div>
      <motion.div
        variants={iconVariants}
        initial="initial"
        animate="animate"
        style={{
          ...getRandomPosition(),
          position: "absolute",
        }}
      >
        <FaVideo className={"text-[#41EC8B] dark:text-[#34D399] text-3xl"} />
      </motion.div>
      <motion.div
        variants={iconVariants}
        initial="initial"
        animate="animate"
        style={{
          ...getRandomPosition(),
          position: "absolute",
        }}
      >
        <FaChalkboardTeacher
          className={"text-[#41EC8B] dark:text-[#34D399] text-3xl"}
        />
      </motion.div>
      <motion.div
        variants={iconVariants}
        initial="initial"
        animate="animate"
        style={{
          ...getRandomPosition(),
          position: "absolute",
        }}
      >
        <GiTeacher className={"text-[#41EC8B] dark:text-[#34D399] text-3xl"} />
      </motion.div>
      <motion.div
        variants={iconVariants}
        initial="initial"
        animate="animate"
        style={{
          ...getRandomPosition(),
          position: "absolute",
        }}
      >
        <PiStudentFill
          className={"text-[#41EC8B] dark:text-[#34D399] text-3xl"}
        />
      </motion.div>
      <motion.div
        variants={iconVariants}
        initial="initial"
        animate="animate"
        style={{
          ...getRandomPosition(),
          position: "absolute",
        }}
      >
        <FaSchool className={"text-[#41EC8B] dark:text-[#34D399] text-3xl"} />
      </motion.div>
      <motion.div
        variants={iconVariants}
        initial="initial"
        animate="animate"
        style={{
          ...getRandomPosition(),
          position: "absolute",
        }}
      >
        <TbSchool className={"text-[#41EC8B] dark:text-[#34D399] text-3xl"} />
      </motion.div>
    </div>
  );
};
