"use client";

import { motion } from "framer-motion";

export function PartnersSection() {
  return (
    <motion.div
      className="mt-16"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 1, duration: 0.5 }}
    >
      <p className="text-center text-sm text-muted-foreground mb-4">
        Works seamlessly with your favorite platforms
      </p>
      <div className="flex justify-center items-center gap-8 grayscale opacity-50">
        <motion.img
          src="/placeholder.svg"
          alt="Platform 1"
          className="h-8"
          whileHover={{ scale: 1.1, opacity: 1 }}
        />
        <motion.img
          src="/placeholder.svg"
          alt="Platform 2"
          className="h-8"
          whileHover={{ scale: 1.1, opacity: 1 }}
        />
        <motion.img
          src="/placeholder.svg"
          alt="Platform 3"
          className="h-8"
          whileHover={{ scale: 1.1, opacity: 1 }}
        />
        <motion.img
          src="/placeholder.svg"
          alt="Platform 4"
          className="h-8"
          whileHover={{ scale: 1.1, opacity: 1 }}
        />
      </div>
    </motion.div>
  );
}
