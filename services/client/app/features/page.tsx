"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { useSettings } from "@/context/settings-context";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import Link from "next/link";
import {
  ArrowRight,
  Brain,
  FileText,
  MessageSquare,
  Pause,
  Play,
  Video,
  Wand2,
  Zap,
} from "lucide-react";

const features = [
  {
    id: "video-upload",
    icon: <Video className="w-10 h-10 text-primary" />,
    title: "Video Upload",
    description:
      "Easily upload and manage your educational videos in various formats.",
    showcase: {
      video: "/video-upload-demo.mp4",
      fallback: "/placeholder.svg?height=400&width=600",
      content: (
        <div className="space-y-4 p-6">
          <h3 className="text-lg font-semibold">Upload Process</h3>
          <ol className="list-decimal list-inside space-y-2">
            <li>Select or drag & drop your video file</li>
            <li>Add title, description, and tags</li>
            <li>Choose visibility settings</li>
            <li>Click upload and wait for processing</li>
          </ol>
          <p className="text-sm text-muted-foreground">
            Our system supports various video formats and automatically
            optimizes your content for the best viewing experience.
          </p>
        </div>
      ),
    },
  },
  {
    id: "video-enhancement",
    icon: <Wand2 className="w-10 h-10 text-primary" />,
    title: "Video Enhancement",
    description:
      "Automatically enhance video and audio quality for better learning experience.",
    showcase: {
      video: "/video-enhancement-demo.mp4",
      fallback: "/placeholder.svg?height=400&width=600",
      content: (
        <div className="space-y-4 p-6">
          <h3 className="text-lg font-semibold">Enhancement Features</h3>
          <ul className="list-disc list-inside space-y-2">
            <li>Automatic color correction</li>
            <li>Audio noise reduction</li>
            <li>Video stabilization</li>
            <li>Resolution upscaling</li>
          </ul>
          <p className="text-sm text-muted-foreground">
            Our AI-powered enhancement tools ensure your videos look and sound
            professional, regardless of the original quality.
          </p>
        </div>
      ),
    },
  },
  {
    id: "transcription",
    icon: <FileText className="w-10 h-10 text-primary" />,
    title: "Transcription",
    description: "Get accurate transcriptions for all your video content.",
    showcase: {
      video: "/transcription-demo.mp4",
      fallback: "/placeholder.svg?height=400&width=600",
      content: (
        <div className="space-y-4 p-6">
          <h3 className="text-lg font-semibold">Transcription Features</h3>
          <ul className="list-disc list-inside space-y-2">
            <li>Multi-language support</li>
            <li>Speaker identification</li>
            <li>Timestamp synchronization</li>
            <li>Editable transcript</li>
          </ul>
          <p className="text-sm text-muted-foreground">
            Our advanced AI transcription service provides highly accurate
            results, making your content more accessible and searchable.
          </p>
        </div>
      ),
    },
  },
  {
    id: "ai-summary",
    icon: <Brain className="w-10 h-10 text-primary" />,
    title: "AI-Powered Summary",
    description: "Generate concise summaries of your videos using advanced AI.",
    showcase: {
      video: "/ai-summary-demo.mp4",
      fallback: "/placeholder.svg?height=400&width=600",
      content: (
        <div className="space-y-4 p-6">
          <h3 className="text-lg font-semibold">Summary Features</h3>
          <ul className="list-disc list-inside space-y-2">
            <li>Key points extraction</li>
            <li>Customizable summary length</li>
            <li>Topic-based summarization</li>
            <li>Multi-format output (text, bullet points, mind maps)</li>
          </ul>
          <p className="text-sm text-muted-foreground">
            Our AI summarization tool helps learners quickly grasp the main
            concepts of your videos, enhancing comprehension and retention.
          </p>
        </div>
      ),
    },
  },
  {
    id: "interactive-chatbot",
    icon: <MessageSquare className="w-10 h-10 text-primary" />,
    title: "Interactive Chatbot",
    description:
      "Engage with an AI chatbot to answer questions about your content.",
    showcase: {
      video: "/chatbot-demo.mp4",
      fallback: "/placeholder.svg?height=400&width=600",
      content: (
        <div className="space-y-4 p-6">
          <h3 className="text-lg font-semibold">Chatbot Capabilities</h3>
          <ul className="list-disc list-inside space-y-2">
            <li>Natural language understanding</li>
            <li>Context-aware responses</li>
            <li>Multi-turn conversations</li>
            <li>Integration with video content</li>
          </ul>
          <p className="text-sm text-muted-foreground">
            Our AI chatbot provides instant, personalized support to learners,
            answering questions and clarifying concepts from your videos.
          </p>
        </div>
      ),
    },
  },
  {
    id: "quizlet-generation",
    icon: <Zap className="w-10 h-10 text-primary" />,
    title: "Quizlet Generation",
    description:
      "Automatically create quizzes based on your video content for better retention.",
    showcase: {
      video: "/quizlet-demo.mp4",
      fallback: "/placeholder.svg?height=400&width=600",
      content: (
        <div className="space-y-4 p-6">
          <h3 className="text-lg font-semibold">Quiz Features</h3>
          <ul className="list-disc list-inside space-y-2">
            <li>Multiple choice questions</li>
            <li>True/false statements</li>
            <li>Fill-in-the-blanks</li>
            <li>Matching exercises</li>
          </ul>
          <p className="text-sm text-muted-foreground">
            Our AI-generated quizzes help reinforce learning and provide
            immediate feedback, improving knowledge retention and engagement.
          </p>
        </div>
      ),
    },
  },
];

export default function FeaturesPage() {
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
        <h1 className="text-4xl font-bold mb-4">Leasy Features</h1>
        <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
          Discover how Leasy can revolutionize your learning experience with our
          cutting-edge features.
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
                className={`cursor-pointer transition-colors hover:bg-muted/50 ${
                  activeFeature.id === feature.id ? "border-primary" : ""
                }`}
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
              <Tabs defaultValue="demo" className="w-full">
                <TabsList className="grid w-full grid-cols-2">
                  <TabsTrigger value="demo">Demo</TabsTrigger>
                  <TabsTrigger value="details">Details</TabsTrigger>
                </TabsList>
                <TabsContent value="demo">
                  <div className="relative">
                    <img
                      src={
                        activeFeature.showcase.fallback || "/placeholder.svg"
                      }
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
                </TabsContent>
                <TabsContent value="details">
                  {activeFeature.showcase.content}
                </TabsContent>
              </Tabs>
            </CardContent>
          </Card>
        </motion.div>
      </div>

      <motion.div
        className="text-center mt-16"
        initial={reduceMotion ? {} : { opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.5 }}
      >
        <Button asChild size="lg">
          <Link href="/signup">
            Get Started <ArrowRight className="ml-2" />
          </Link>
        </Button>
      </motion.div>
    </div>
  );
}
