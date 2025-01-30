"use client";

import { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { useSettings } from "@/context/settings-context";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Brain,
  FileText,
  MessageSquare,
  Pause,
  Play,
  Sparkles,
  Zap,
} from "lucide-react";
import { cn } from "@/lib/utils";

const features = [
  {
    id: "transcription",
    title: "Automatic Transcription",
    description: "Convert your video content into accurate, searchable text.",
    icon: <FileText className="w-6 h-6" />,
    demo: {
      video: "/transcription-demo.mp4",
      fallback: "/placeholder.svg?height=400&width=600",
      content: (
        <div className="space-y-4 p-6">
          <div className="flex items-start space-x-4 animate-fade-in">
            <div className="min-w-[60px] text-sm text-muted-foreground">
              00:00
            </div>
            <div className="flex-1">
              <p className="text-sm">
                Welcome to our comprehensive guide on machine learning
                fundamentals.
              </p>
            </div>
          </div>
          <div className="flex items-start space-x-4 animate-fade-in [--animation-delay:200ms]">
            <div className="min-w-[60px] text-sm text-muted-foreground">
              00:15
            </div>
            <div className="flex-1">
              <p className="text-sm">
                Today, we'll explore the core concepts that form the foundation
                of AI.
              </p>
            </div>
          </div>
          <div className="flex items-start space-x-4 animate-fade-in [--animation-delay:400ms]">
            <div className="min-w-[60px] text-sm text-muted-foreground">
              00:30
            </div>
            <div className="flex-1">
              <p className="text-sm">
                Let's begin by understanding what machine learning actually
                means.
              </p>
            </div>
          </div>
        </div>
      ),
    },
  },
  {
    id: "summary",
    title: "AI-Powered Summary",
    description: "Get concise summaries of your video content.",
    icon: <Brain className="w-6 h-6" />,
    demo: {
      video: "/summary-demo.mp4",
      fallback: "/placeholder.svg?height=400&width=600",
      content: (
        <div className="space-y-6 p-6">
          <div className="space-y-2 animate-fade-in">
            <h3 className="text-lg font-semibold">Key Points</h3>
            <ul className="list-disc list-inside space-y-2 text-sm">
              <li>Introduction to machine learning concepts</li>
              <li>Overview of supervised and unsupervised learning</li>
              <li>Real-world applications and examples</li>
              <li>Best practices and common pitfalls</li>
            </ul>
          </div>
          <div className="space-y-2 animate-fade-in [--animation-delay:200ms]">
            <h3 className="text-lg font-semibold">Main Takeaways</h3>
            <p className="text-sm text-muted-foreground">
              This comprehensive guide covers the fundamentals of machine
              learning, explaining key concepts through practical examples. The
              video emphasizes the importance of data quality and model
              selection in successful ML projects.
            </p>
          </div>
        </div>
      ),
    },
  },
  {
    id: "chatbot",
    title: "Interactive Chatbot",
    description:
      "Engage with an AI chatbot to answer questions about your content.",
    icon: <MessageSquare className="w-6 h-6" />,
    demo: {
      video: "/chatbot-demo.mp4",
      fallback: "/placeholder.svg?height=400&width=600",
      content: (
        <div className="flex flex-col space-y-4 p-6">
          <div className="self-start max-w-[75%] animate-fade-in">
            <div className="bg-muted rounded-lg p-3">
              <p className="text-sm">
                What are the main types of machine learning?
              </p>
            </div>
          </div>
          <div className="self-end max-w-[75%] animate-fade-in [--animation-delay:500ms]">
            <div className="bg-primary text-primary-foreground rounded-lg p-3">
              <p className="text-sm">
                There are three main types of machine learning: 1. Supervised
                Learning 2. Unsupervised Learning 3. Reinforcement Learning
                Would you like me to explain each type in detail?
              </p>
            </div>
          </div>
          <div className="self-start max-w-[75%] animate-fade-in [--animation-delay:1000ms]">
            <div className="bg-muted rounded-lg p-3">
              <p className="text-sm">
                Yes, please explain supervised learning.
              </p>
            </div>
          </div>
          <div className="self-end max-w-[75%] animate-fade-in [--animation-delay:1500ms]">
            <div className="bg-primary text-primary-foreground rounded-lg p-3">
              <p className="text-sm">
                Supervised learning is a type of machine learning where the
                model learns from labeled data. It's like learning with a
                teacher who provides the correct answers. The model learns to
                map inputs to known outputs, making it great for tasks like
                classification and regression.
              </p>
            </div>
          </div>
        </div>
      ),
    },
  },
  {
    id: "quizlet",
    title: "Smart Quizzes",
    description: "Automatically generate quizzes from your video content.",
    icon: <Zap className="w-6 h-6" />,
    demo: {
      video: "/quizlet-demo.mp4",
      fallback: "/placeholder.svg?height=400&width=600",
      content: (
        <div className="space-y-6 p-6">
          <div className="space-y-8">
            <div className="space-y-4 animate-fade-in">
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-semibold">Question 1 of 5</h3>
                <span className="text-sm text-muted-foreground">
                  Score: 2/5
                </span>
              </div>
              <div className="bg-muted p-4 rounded-lg">
                <p className="text-sm font-medium mb-4">
                  What is the main advantage of supervised learning?
                </p>
                <div className="grid grid-cols-1 gap-2">
                  <Button variant="outline" className="justify-start">
                    A. No labeled data required
                  </Button>
                  <Button
                    variant="outline"
                    className="justify-start bg-destructive/10 border-destructive/20"
                  >
                    B. Faster training process
                  </Button>
                  <Button
                    variant="outline"
                    className="justify-start bg-primary/10 border-primary"
                  >
                    C. Clear feedback on model performance
                  </Button>
                  <Button variant="outline" className="justify-start">
                    D. Reduced computational resources
                  </Button>
                </div>
              </div>
            </div>

            <div className="space-y-4 animate-fade-in [--animation-delay:400ms]">
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-semibold">Question 2 of 5</h3>
              </div>
              <div className="bg-muted p-4 rounded-lg">
                <p className="text-sm font-medium mb-4">
                  Which of these is NOT a type of machine learning?
                </p>
                <div className="grid grid-cols-1 gap-2">
                  <Button variant="outline" className="justify-start">
                    A. Supervised Learning
                  </Button>
                  <Button variant="outline" className="justify-start">
                    B. Unsupervised Learning
                  </Button>
                  <Button variant="outline" className="justify-start">
                    C. Reinforcement Learning
                  </Button>
                  <Button variant="outline" className="justify-start">
                    D. Directional Learning
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </div>
      ),
    },
  },
];

export default function FeatureShowcasePage() {
  const { reduceMotion } = useSettings();
  const [activeFeature, setActiveFeature] = useState(features[0]);
  const [isPlaying, setIsPlaying] = useState(false);

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 },
  };

  return (
    <div className="container mx-auto px-4 py-16">
      <motion.div
        className="text-center mb-16"
        initial={reduceMotion ? {} : { opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <h1 className="text-4xl font-bold mb-4">Experience the Power of AI</h1>
        <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
          See how Leasy's AI-powered features transform your learning
          experience.
        </p>
      </motion.div>

      <div className="grid lg:grid-cols-5 gap-8">
        <motion.div
          className="lg:col-span-2 space-y-4"
          variants={reduceMotion ? {} : containerVariants}
          initial="hidden"
          animate="visible"
        >
          {features.map((feature) => (
            <motion.div
              key={feature.id}
              variants={reduceMotion ? {} : itemVariants}
            >
              <Card
                className={cn(
                  "cursor-pointer transition-colors hover:bg-muted/50",
                  activeFeature.id === feature.id && "border-primary",
                )}
                onClick={() => setActiveFeature(feature)}
              >
                <CardHeader>
                  <div className="flex items-center space-x-4">
                    <div className="p-2 rounded-lg bg-primary/10 text-primary">
                      {feature.icon}
                    </div>
                    <div>
                      <CardTitle>{feature.title}</CardTitle>
                      <CardDescription>{feature.description}</CardDescription>
                    </div>
                  </div>
                </CardHeader>
              </Card>
            </motion.div>
          ))}
        </motion.div>

        <motion.div
          className="lg:col-span-3"
          variants={reduceMotion ? {} : containerVariants}
          initial="hidden"
          animate="visible"
        >
          <Card>
            <CardHeader>
              <CardTitle>{activeFeature.title}</CardTitle>
              <CardDescription>{activeFeature.description}</CardDescription>
            </CardHeader>
            <CardContent className="p-0">
              <div className="relative">
                <img
                  src={activeFeature.demo.fallback || "/placeholder.svg"}
                  alt={`${activeFeature.title} demo`}
                  className="w-full h-[300px] object-cover"
                />
                <Button
                  size="icon"
                  variant="secondary"
                  className="absolute bottom-4 right-4"
                  onClick={() => setIsPlaying(!isPlaying)}
                >
                  {isPlaying ? (
                    <Pause className="h-4 w-4" />
                  ) : (
                    <Play className="h-4 w-4" />
                  )}
                </Button>
              </div>
              <AnimatePresence mode="wait">
                <motion.div
                  key={activeFeature.id}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                >
                  {activeFeature.demo.content}
                </motion.div>
              </AnimatePresence>
            </CardContent>
          </Card>
        </motion.div>
      </div>

      <motion.div
        className="mt-16 text-center"
        initial={reduceMotion ? {} : { opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.5 }}
      >
        <h2 className="text-2xl font-bold mb-4">
          Ready to transform your learning experience?
        </h2>
        <Button asChild size="lg">
          <a href="/signup">
            Get Started <Sparkles className="ml-2" />
          </a>
        </Button>
      </motion.div>
    </div>
  );
}
