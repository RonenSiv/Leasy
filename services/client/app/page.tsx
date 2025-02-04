"use client";

import { useState } from "react";
import { motion, useScroll, useTransform } from "framer-motion";
import { Circle } from "./components/home/decorations";

import { HeroSection } from "./components/home/hero-section";
import { StatsSection } from "./components/home/stats-section";
import { FeaturesSection } from "./components/home/features-section";
import { FAQSection } from "./components/home/faq-section";
import { CTASection } from "./components/home/cta-section";
import { VideoModal } from "./components/home/video-modal";
import { FeaturesCarousel } from "./components/home/features-carousel";

export default function Home() {
  const [isVideoModalOpen, setIsVideoModalOpen] = useState(false);
  const { scrollYProgress } = useScroll();
  const fadeOutOpacity = useTransform(scrollYProgress, [0, 0.2], [1, 0]);

  return (
    <div className="relative bg-gradient-to-b from-background to-primary/5 overflow-hidden">
      {/* Subtle top fade */}
      <motion.div
        className="fixed inset-0 pointer-events-none"
        style={{ opacity: fadeOutOpacity }}
      >
        <div className="absolute inset-0 bg-gradient-to-b from-primary/20 to-transparent" />
      </motion.div>

      {/* Two decorative circles in the background (like old design) */}
      <Circle className="w-[300px] h-[300px] bg-primary/20 -top-20 -left-20 blur-3xl" />
      <Circle className="w-[300px] h-[300px] bg-secondary/20 top-1/3 -right-20 blur-3xl" />

      {/* Sections (like old design) */}
      <HeroSection onWatchDemo={() => setIsVideoModalOpen(true)} />
      <StatsSection />
      {/*<PartnersSection />*/}
      <FeaturesSection />
      <FeaturesCarousel />
      <FAQSection />
      <CTASection />

      {/* Video modal (like before) */}
      <VideoModal
        isOpen={isVideoModalOpen}
        onClose={() => setIsVideoModalOpen(false)}
      />
    </div>
  );
}
