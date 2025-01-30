"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { ArrowRight, Play } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Sparkle } from "@/app/components/home/decorations";

interface HeroSectionProps {
  onWatchDemo: () => void;
}

export function HeroSection({ onWatchDemo }: HeroSectionProps) {
  return (
    <section className="relative pt-20 pb-32">
      <div className="container px-4 mx-auto">
        <motion.div
          className="max-w-3xl mx-auto text-center"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
        >
          {/* Sparkles near the heading */}
          <motion.div
            initial={{ scale: 0.5, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ delay: 0.2, duration: 0.5 }}
            className="mb-6 relative"
          >
            <Sparkle className="text-primary/60 -top-8 left-1/4" />
            <Sparkle className="text-secondary/60 top-0 right-1/4" />
          </motion.div>

          <h1 className="text-4xl md:text-6xl font-bold mb-6 bg-clip-text text-transparent bg-gradient-to-r from-primary to-primary/80">
            Create course material with AI <br /> in seconds
          </h1>
          <p className="text-xl text-muted-foreground mb-8">
            Transform your video content into transcriptions, summaries,
            quizzes, and more with Leasy.
          </p>

          <motion.div
            className="flex flex-col sm:flex-row justify-center gap-4"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4, duration: 0.5 }}
          >
            <Button
              asChild
              size="lg"
              className="bg-primary text-primary-foreground"
            >
              <Link href="/signup">
                Get Started Free <ArrowRight className="ml-2" />
              </Link>
            </Button>
            <Button variant="outline" size="lg" onClick={onWatchDemo}>
              Watch Demo <Play className="ml-2" size={18} />
            </Button>
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
}
