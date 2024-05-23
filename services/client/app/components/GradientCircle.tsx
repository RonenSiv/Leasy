"use client";
import React from "react";
import { motion } from "framer-motion";

interface GradientCircleProps {
  dimensions: number;
  position: { x: string; y: string };
  duration?: number;
  reverse?: true;
}

const GradientCircle: React.FC<GradientCircleProps> = ({
  dimensions,
  position,
  duration = 5,
  reverse = false,
}) => {
  const initial = !reverse
    ? { backgroundPosition: "0% 50%", left: "-50%" }
    : { backgroundPosition: "100% 50%", left: "100%" };
  const animate = !reverse
    ? { backgroundPosition: "100% 50%", left: "100%" }
    : { backgroundPosition: "0% 50%", left: "-50%" };

  return (
    <div
      className="fixed"
      style={{
        left: position.x,
        top: position.y,
        width: dimensions,
        height: dimensions,
      }}
    >
      <motion.div
        className="rounded-full bg-gradient-to-r from-[#41EB88] to-[#39F7D1]"
        initial={initial}
        animate={animate}
        transition={{ ease: "linear", duration, loop: Infinity }}
        style={{ width: "100%", height: "100%", backgroundSize: "200% 200%" }}
      />
    </div>
  );
};

export default GradientCircle;
