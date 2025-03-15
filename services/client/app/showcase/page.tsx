"use client";

import { memo, useState } from "react";
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
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Brain, FileText, MessageSquare, Sparkles, Zap } from "lucide-react";
import { cn } from "@/lib/utils";
import { VideoChat } from "@/app/components/video/video-chat";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Quizlet } from "@/app/components/quizlet/quizlet";

const SAMPLE_VIDEO_URL = "https://www.w3schools.com/html/mov_bbb.mp4";

// eslint-disable-next-line react/display-name
const SharedVideoPlayer = memo(() => (
  <video
    className="w-full"
    src={SAMPLE_VIDEO_URL}
    loop
    autoPlay
    muted
    playsInline
  />
));

// For transcription and summary, we now only supply the details part.
const transcriptionDetails = (
  <div className="space-y-4 p-6 bg-muted rounded-lg">
    <div className="flex items-start space-x-4">
      <div className="min-w-[60px] text-sm text-muted-foreground">00:00</div>
      <div className="flex-1 text-sm">Welcome to the demo video.</div>
    </div>
    <div className="flex items-start space-x-4">
      <div className="min-w-[60px] text-sm text-muted-foreground">00:05</div>
      <div className="flex-1 text-sm">
        Here we demonstrate a quick overview of our transcription feature.
      </div>
    </div>
    <div className="flex items-start space-x-4">
      <div className="min-w-[60px] text-sm text-muted-foreground">00:10</div>
      <div className="flex-1 text-sm">
        Enjoy the seamless conversion from video to text.
      </div>
    </div>
  </div>
);

const summaryDetails = (
  <div className="space-y-6 p-6 bg-muted rounded-lg">
    <div className="space-y-2">
      <h3 className="text-lg font-semibold">Summary</h3>
      <p className="text-sm text-muted-foreground">
        The video demonstrates a short clip where our AI-powered tools
        automatically convert spoken content into text, making it easily
        accessible and reviewable. This summary captures the core points for a
        quick overview.
      </p>
    </div>
  </div>
);

// Mock quiz questions for the showcase
const mockQuizQuestions = [
  {
    question_uuid: "q1",
    question_text:
      "How does Leasy enhance the learning experience compared to traditional video platforms?",
    options: [
      {
        option_index: 0,
        option_text: "By providing longer videos",
      },
      {
        option_index: 1,
        option_text:
          "Through AI-powered features like transcription, summarization, and quizzes",
      },
      {
        option_index: 2,
        option_text: "By offering more video content",
      },
      {
        option_index: 3,
        option_text: "Through social media integration",
      },
    ],
  },
  {
    question_uuid: "q2",
    question_text:
      "What unique feature does Leasy offer to help users understand video content better?",
    options: [
      {
        option_index: 0,
        option_text: "Background music",
      },
      {
        option_index: 1,
        option_text: "Subtitles in multiple languages",
      },
      {
        option_index: 2,
        option_text:
          "An AI-powered chatbot for asking questions about the video",
      },
      {
        option_index: 3,
        option_text: "Virtual reality experiences",
      },
    ],
  },
  {
    question_uuid: "q3",
    question_text: "How does Leasy's summarization feature benefit learners?",
    options: [
      {
        option_index: 0,
        option_text: "It provides longer video content",
      },
      {
        option_index: 1,
        option_text: "It offers concise overviews of key points from the video",
      },
      {
        option_index: 2,
        option_text: "It translates the video into different languages",
      },
      {
        option_index: 3,
        option_text: "It adds background music to the video",
      },
    ],
  },
];

// Mock summary for quiz generation
const mockSummary =
  "This video discusses Leasy's AI-powered learning platform which enhances video-based learning through automatic transcription, summarization, interactive chatbots, and smart quizzes.";

// For the other features, we keep the same component definitions.
const features = [
  {
    id: "transcription",
    title: "Automatic Transcription",
    description: "Watch and see the transcription in real-time.",
    details:
      "Below is a short demo video. The transcript (hardcoded for this demo) appears underneath the video.",
    icon: <FileText className="w-6 h-6" />,
    // We'll now use the shared video plus details rendered conditionally in the parent.
    component: transcriptionDetails,
  },
  {
    id: "summary",
    title: "AI-Powered Summary",
    description: "Get a quick summary of the video content.",
    details:
      "This feature processes the video and provides a concise summary of the key points.",
    icon: <Brain className="w-6 h-6" />,
    component: summaryDetails,
  },
  {
    id: "chatbot",
    title: "Interactive Chatbot",
    description:
      "Engage with an AI chatbot to answer questions about your content.",
    details:
      "Our AI-powered chatbot allows learners to ask questions and receive instant, contextually relevant answers about the video content.",
    icon: <MessageSquare className="w-6 h-6" />,
    component: <VideoChat chatUuid={"123"} showCase={true} summary={""} />,
  },
  {
    id: "quizlet",
    title: "Smart Quizzes",
    description: "Automatically generate quizzes from your video content.",
    details:
      "Our system automatically generates quizzes based on the video content, helping reinforce learning and assess understanding.",
    icon: <Zap className="w-6 h-6" />,
    component: (
      <ScrollArea className="h-[400px] w-full border p-4">
        <Quizlet
          quizId="showcase-123"
          questions={mockQuizQuestions}
          onNewQuestions={() => console.log("New questions requested")}
          summary={mockSummary}
          showcase={true} // Enable showcase mode
        />
      </ScrollArea>
    ),
  },
];

export default function FeatureShowcasePage() {
  const { reduceMotion } = useSettings();
  const [activeFeature, setActiveFeature] = useState(features[0]);

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.1 },
    },
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
        {/* Left side: Accordion list */}
        <motion.div
          className="lg:col-span-2 space-y-4"
          variants={reduceMotion ? {} : containerVariants}
          initial="hidden"
          animate="visible"
        >
          <Accordion
            type="single"
            collapsible
            value={activeFeature.id}
            onValueChange={(value) => {
              const feature = features.find((f) => f.id === value);
              if (feature) setActiveFeature(feature);
            }}
          >
            {features.map((feature) => (
              <AccordionItem
                key={feature.id}
                value={feature.id}
                className="border-0 mb-2"
              >
                <Card
                  className={cn(
                    "cursor-pointer transition-colors hover:bg-muted/50",
                    activeFeature.id === feature.id && "bg-primary/20",
                  )}
                >
                  <CardHeader>
                    <AccordionTrigger
                      disableChevron
                      className="hover:no-underline flex items-center justify-between w-full"
                    >
                      <div className="flex items-center space-x-4">
                        <div className="p-2 rounded-lg bg-primary/10 text-primary">
                          {feature.icon}
                        </div>
                        <div className="text-left">
                          <CardTitle>{feature.title}</CardTitle>
                          <CardDescription>
                            {feature.description}
                          </CardDescription>
                        </div>
                      </div>
                    </AccordionTrigger>
                  </CardHeader>
                </Card>
                <AccordionContent>
                  <p className="p-4 text-sm text-muted-foreground">
                    {feature.details}
                  </p>
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </motion.div>

        {/* Right side: Active feature content */}
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
              {/* For transcription and summary, render the shared video once and animate only the details */}
              {activeFeature.id === "transcription" ||
              activeFeature.id === "summary" ? (
                <>
                  <SharedVideoPlayer />
                  <AnimatePresence mode="wait">
                    <motion.div
                      key={activeFeature.id}
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0 }}
                    >
                      {activeFeature.component}
                    </motion.div>
                  </AnimatePresence>
                </>
              ) : (
                <AnimatePresence mode="wait">
                  <motion.div
                    key={activeFeature.id}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                  >
                    {activeFeature.component}
                  </motion.div>
                </AnimatePresence>
              )}
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
