"use client";

import { motion } from "framer-motion";
import { stats } from "@/lib/home-data";

export function StatsSection() {
  return (
    <motion.div
      className="mt-24"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.6, duration: 0.5 }}
    >
      <div className="container px-4 mx-auto">
        <div className="grid md:grid-cols-3 gap-8">
          {stats.map((stat, i) => (
            <motion.div
              key={stat.label}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.8 + i * 0.1, duration: 0.5 }}
              className="flex items-center justify-center text-center md:text-left"
            >
              <stat.icon className="w-6 h-6 text-primary mr-3" />
              <div>
                <div className="text-2xl font-bold">{stat.value}</div>
                <div className="text-muted-foreground">{stat.label}</div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </motion.div>
  );
}
