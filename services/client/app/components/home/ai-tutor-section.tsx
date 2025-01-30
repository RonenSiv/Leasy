"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { MessageSquare } from "lucide-react";

export function AITutorSection() {
  return (
    <section className="py-32 bg-muted/50 relative">
      {/* Decorative circle */}
      <div className="absolute w-[400px] h-[400px] bg-secondary/20 bottom-0 right-0 rounded-full blur-3xl" />
      <div className="container px-4 mx-auto">
        <div className="grid md:grid-cols-2 gap-12 items-center">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5 }}
          >
            <h2 className="text-3xl font-bold mb-4">
              Be Prepared with AI Tutor
            </h2>
            <p className="text-xl text-muted-foreground mb-8">
              Get instant answers to your questions and deepen your
              understanding with our AI-powered tutor. It’s like having a
              personal mentor at your side.
            </p>
            <Button asChild size="lg">
              <Link href="/signup">Try AI Tutor Now</Link>
            </Button>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.2, duration: 0.5 }}
          >
            <Card className="bg-card/50 backdrop-blur border-2 border-primary/20">
              <div className="p-6 space-y-4">
                <div className="flex gap-4 items-start">
                  <div className="bg-primary/10 p-4 rounded-full">
                    <MessageSquare className="h-6 w-6 text-primary" />
                  </div>
                  <div className="flex-1 space-y-2">
                    <p className="font-medium">
                      Ask any question about your content
                    </p>
                    <p className="text-sm text-muted-foreground">
                      Get instant, accurate answers based on your video material
                    </p>
                  </div>
                </div>
                <div className="bg-muted p-4 rounded-lg">
                  <p className="text-sm font-medium">
                    Example conversation with AI Tutor:
                  </p>
                  <div className="mt-3 space-y-3 text-sm">
                    <div className="flex gap-2">
                      <div className="flex-shrink-0 h-8 w-8 rounded-full bg-primary/20" />
                      <div className="flex-1 bg-background rounded-lg p-3">
                        Can you explain the concept of neural networks?
                      </div>
                    </div>
                    <div className="flex gap-2 justify-end">
                      <div className="flex-1 bg-primary text-primary-foreground rounded-lg p-3">
                        A neural network is a computing system inspired by
                        biological neurons...
                      </div>
                      <div className="flex-shrink-0 h-8 w-8 rounded-full bg-primary" />
                    </div>
                  </div>
                </div>
              </div>
            </Card>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
