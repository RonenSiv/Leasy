"use client";

import { motion } from "framer-motion";
import { Card } from "@/components/ui/card";
import { Brain, FileText, MessageSquare, Zap } from "lucide-react";

function FeatureItem({
  icon,
  title,
  description,
}: {
  icon: React.ReactNode;
  title: string;
  description: string;
}) {
  return (
    <motion.div
      className="flex gap-4 items-start"
      whileHover={{ x: 10 }}
      transition={{ duration: 0.2 }}
    >
      <div className="bg-primary/10 p-4 rounded-full">{icon}</div>
      <div>
        <h3 className="font-semibold mb-1">{title}</h3>
        <p className="text-muted-foreground">{description}</p>
      </div>
    </motion.div>
  );
}

export function FeaturesSection() {
  return (
    <section className="py-32 relative">
      {/* Decorative circle in the background */}
      <div className="absolute w-[500px] h-[500px] bg-primary/10 top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 rounded-full blur-3xl" />

      <div className="container px-4 mx-auto">
        <div className="max-w-3xl mx-auto mb-16 text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <h2 className="text-3xl font-bold mb-4">
              Your course material. Entire study set in 1 click.
            </h2>
            <p className="text-xl text-muted-foreground">
              Automatically generate comprehensive study materials from your
              video content.
            </p>
          </motion.div>
        </div>

        <div className="grid md:grid-cols-2 gap-8 items-center">
          {/* Left side: image card */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5 }}
          >
            <Card className="relative overflow-hidden border-2 border-primary/20">
              <div className="absolute inset-0 bg-gradient-to-br from-primary/10 to-transparent" />
              <div className="relative p-6">
                <img
                  src="/placeholder.svg"
                  alt="AI Analysis Demo"
                  className="rounded-lg shadow-lg"
                />
              </div>
            </Card>
          </motion.div>

          {/* Right side: features bullets */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.2, duration: 0.5 }}
          >
            <div className="space-y-6">
              <FeatureItem
                icon={<FileText className="h-6 w-6" />}
                title="Smart Transcription"
                description="Get accurate, timestamped transcriptions of your video content"
              />
              <FeatureItem
                icon={<Brain className="h-6 w-6" />}
                title="AI-Powered Summaries"
                description="Generate concise summaries that capture key concepts"
              />
              <FeatureItem
                icon={<MessageSquare className="h-6 w-6" />}
                title="Interactive Quizzes"
                description="Create engaging quizzes to test understanding"
              />
              <FeatureItem
                icon={<Zap className="h-6 w-6" />}
                title="Flashcards"
                description="Auto-generate flashcards for effective revision"
              />
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
