"use client";
import React from "react";
import { motion } from "framer-motion";

interface GradientCircleProps {
  dimensions: number;
  position: { x: string; y: string };
  duration?: number;
  reverse?: boolean;
}

export const GradientCircle: React.FC<GradientCircleProps> = ({
  dimensions,
  position,
  duration = 5,
  reverse = false,
}) => {
  const initial = {
    backgroundPosition: "0% 50%",
    left: "-50%",
    translateY: 0,
    backgroundColor: !reverse ? "#41EB88" : "#39F7D1",
  };
  const animate = {
    backgroundPosition: "100% 50%",
    left: "100%",
    translateY: [-50, 0, -50],
    backgroundColor: !reverse
      ? ["#39F7D1", "#41EB88", "#39F7D1"]
      : ["#41EB88", "#39F7D1", "#41EB88"],
  };

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
        className="rounded-full bg-gradient-to-r"
        initial={initial}
        animate={animate}
        transition={{
          ease: "easeInOut",
          duration,
          repeat: Infinity,
          repeatDelay: 0.5,
        }}
        style={{
          width: "100%",
          height: "100%",
          backgroundSize: "200% 200%",
        }}
      />
    </div>
  );
};
