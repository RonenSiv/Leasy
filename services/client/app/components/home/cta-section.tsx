"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";

export function CTASection() {
  return (
    <section className="py-32 relative">
      <div className="absolute w-[400px] h-[400px] bg-primary/30 bottom-0 right-0 rounded-full blur-3xl" />
      <div className="container px-4 mx-auto text-center">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="max-w-2xl mx-auto"
        >
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            Ready to ace that test?
          </h2>
          <p className="text-xl text-muted-foreground mb-8">
            Join thousands of students and educators already using Leasy to
            enhance their learning experience.
          </p>
          <Button
            asChild
            size="lg"
            className="bg-primary text-primary-foreground"
          >
            <Link href="/signup">
              Get Started Free <ArrowRight className="ml-2" />
            </Link>
          </Button>
        </motion.div>
      </div>
    </section>
  );
}
