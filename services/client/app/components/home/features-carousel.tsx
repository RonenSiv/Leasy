"use client";

import { motion } from "framer-motion";
import { Card, CardContent } from "@/components/ui/card";
import { BotMessageSquare, Brain, FileQuestion, FileText } from "lucide-react";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";
import { Button } from "@/components/ui/button";

const TranscriptionComponent = () => (
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

const SummaryComponent = () => (
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

const ChatComponent = () => (
  <Card>
    <CardContent className="p-0 flex-1">
      <div className="flex flex-col">
        <div className="p-4">
          <div className="space-y-4">
            <div className={`flex justify-end`}>
              <div
                className={`max-w-[80%] rounded-lg px-4 py-2 flex items-center bg-primary text-primary-foreground`}
              >
                Can you explain the concept of neural networks?
              </div>
            </div>
            <div className={`flex justify-start`}>
              <div
                className={`max-w-[80%] rounded-lg px-4 py-2 flex items-center bg-muted`}
              >
                A neural network is a computing system inspired by biological
                neurons...
              </div>
            </div>
          </div>
        </div>
      </div>
    </CardContent>
  </Card>
);

const QuizComponent = () => (
  <Card>
    <CardContent className="p-0 flex-1">
      <div className="space-y-4 animate-fade-in">
        <div className="bg-muted p-4 rounded-lg">
          <p className="text-sm font-medium mb-4">
            What is the capital of France?
          </p>
          <div className="grid grid-cols-1 gap-2">
            <Button
              variant="outline"
              className="justify-start hover:bg-primary/50"
            >
              Paris
            </Button>
            <Button
              variant="outline"
              className="justify-start hover:bg-primary/50"
            >
              London
            </Button>
            <Button
              variant="outline"
              className="justify-start hover:bg-primary/50"
            >
              Rome
            </Button>
            <Button
              variant="outline"
              className="justify-start hover:bg-primary/50"
            >
              Berlin
            </Button>
          </div>
        </div>
      </div>
    </CardContent>
  </Card>
);

const features = [
  {
    id: "transcription",
    title: "Smart Transcription",
    description:
      "Get accurate, timestamped transcriptions of your video content.",
    icon: <FileText className="h-6 w-6" />,
    component: <TranscriptionComponent />,
  },
  {
    id: "summary",
    title: "AI-Powered Summaries",
    description: "Generate concise summaries that capture key concepts.",
    icon: <Brain className="h-6 w-6" />,
    component: <SummaryComponent />,
  },
  {
    id: "chatbot",
    title: "Interactive Chatbot",
    description:
      "Receive instant, contextually relevant answers about your content.",
    icon: <BotMessageSquare className="h-6 w-6" />,
    component: <ChatComponent />,
  },
  {
    id: "quizlet",
    title: "Quizlet Integration",
    description: "Create engaging quizzes to test understanding.",
    icon: <FileQuestion className="h-6 w-6" />,
    component: <QuizComponent />,
  },
];

export function FeaturesCarousel() {
  return (
    <section className="py-32 bg-muted/50 relative">
      {/* Optional decorative element */}
      <div className="absolute w-[500px] h-[500px] bg-primary/10 top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 rounded-full blur-3xl" />

      <div className="container mx-auto px-4 relative z-10">
        <h2 className="text-3xl font-bold mb-8 text-center">
          Explore Our Features
        </h2>
        <Carousel>
          <CarouselContent>
            {features.map((feature) => (
              <CarouselItem key={feature.id} className="p-2">
                <FeatureItem {...feature} />
              </CarouselItem>
            ))}
          </CarouselContent>
          <CarouselPrevious />
          <CarouselNext />
        </Carousel>
      </div>
    </section>
  );
}

export function FeatureItem({
  id,
  title,
  description,
  icon,
  component,
}: {
  id: string;
  title: string;
  description: string;
  icon: React.ReactNode;
  component: React.ReactNode;
}) {
  return (
    <section className="bg-muted/50 relative h-[400px] flex items-center justify-center rounded-lg p-8">
      <div className="absolute w-[400px] h-[400px] bg-secondary/20 bottom-0 right-0 rounded-full blur-3xl" />
      <div className="container px-4 mx-auto">
        <div className="grid md:grid-cols-2 gap-12 items-center">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5 }}
            className={"justify-self-center"}
          >
            <div className="flex items-center mb-8">
              <div className={"bg-primary/10 p-4 rounded-full"}>{icon}</div>
              <div className={"bg-primary/10 py-2 px-6 rounded-full"}>
                <h2 className="text-3xl font-bold">{title}</h2>
              </div>
            </div>
            <p className="text-xl text-muted-foreground mb-8">{description}</p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.2, duration: 0.5 }}
            className={"justify-self-center"}
          >
            {component}
          </motion.div>
        </div>
      </div>
    </section>
  );
}
