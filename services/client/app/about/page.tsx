"use client";

import { motion } from "framer-motion";
import Image from "next/image";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";

export default function About() {
  return (
    <main className="text-foreground bg-background">
      {/* Hero Section */}
      <section className="pt-20 pb-16 text-center container mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="max-w-3xl mx-auto"
        >
          <h1 className="text-4xl md:text-5xl font-bold mb-4">We Are Leasy</h1>
          <p className="text-xl text-muted-foreground mb-8">
            A holistic approach to AI-powered video-based learning. Enhance,
            summarize, and interact with educational videos in seconds.
          </p>
          <Button asChild size="lg" className="bg-foreground text-background">
            <Link href="/contact">Enquire</Link>
          </Button>
        </motion.div>
      </section>

      {/* Stats Section */}
      <section className="py-12 bg-muted/10">
        <div className="container mx-auto px-4 flex flex-col md:flex-row justify-center items-center gap-8 md:gap-12 text-center">
          <StatItem label="Videos Enhanced" value="2800+" />
          <StatItem label="Global Users" value="140k" />
          <StatItem label="AI Summaries" value="25k" />
          <StatItem label="Active Quizzes" value="9k+" />
        </div>
      </section>

      {/* Feature Image */}
      <section className="relative">
        <div className="h-[400px] w-full overflow-hidden">
          {/* Replace with your own large image */}
          <Image
            src="/placeholder-team.jpg"
            alt="Leasy team in action"
            fill
            style={{ objectFit: "cover" }}
            priority
          />
        </div>
      </section>

      {/* About / CTA Text */}
      <section className="pt-16 pb-8 container mx-auto px-4 text-center">
        <h2 className="text-2xl md:text-3xl font-semibold mb-6">
          Learning Happens Faster with AI
        </h2>
        <p className="max-w-4xl mx-auto text-lg text-muted-foreground mb-8 leading-relaxed">
          At Leasy, we believe in harnessing cutting-edge AI to simplify your
          learning workflow. Upload a video and let our engine handle enhanced
          audio and visuals, precise transcriptions, concise summaries, quizlet
          creation, and even an interactive chatbot. Make learning accessible,
          efficient, and fun.
        </p>
        <Button asChild className="bg-foreground text-background">
          <Link href="/team">Meet Our Team</Link>
        </Button>
      </section>

      <Separator className="my-16" />

      {/* What’s Different Section */}
      <section className="pb-16 container mx-auto px-4">
        <h3 className="text-3xl font-bold mb-8 text-center">
          What’s Different When You Use Leasy?
        </h3>
        <div className="grid md:grid-cols-2 gap-8 leading-relaxed text-muted-foreground">
          <div>
            <h4 className="font-semibold text-lg mb-2 text-foreground">
              AI-Driven Simplicity
            </h4>
            <p>
              Our platform uses powerful AI so you don’t have to navigate
              multiple tools. Just upload your video, and Leasy automatically
              generates everything you need for better comprehension: enhanced
              media, transcripts, summaries, quizlets, and more.
            </p>
            <p className="mt-4">
              We blend cutting-edge technologies with an intuitive interface,
              meaning less friction and more focus on learning.
            </p>
          </div>
          <div>
            <h4 className="font-semibold text-lg mb-2 text-foreground">
              Engaging &amp; Effective
            </h4>
            <p>
              Unlike traditional passive video-watching, Leasy creates an
              interactive learning environment. Summaries make skimming fast,
              quizzes reinforce retention, and our AI chatbot answers questions
              in real-time.
            </p>
            <p className="mt-4">
              Enjoy quick feedback loops, reduce study time, and see better
              outcomes—all in one platform.
            </p>
          </div>
        </div>
      </section>

      {/* Our Process Section */}
      <section className="bg-muted/10 py-16">
        <div className="container mx-auto px-4 text-center">
          <h3 className="text-3xl font-bold mb-6">Our Process</h3>
          <p className="text-muted-foreground max-w-xl mx-auto mb-10">
            Think of Leasy as your personal incubator of learning. We take your
            video content and transform it into an interactive, AI-driven
            experience.
          </p>

          <div className="grid md:grid-cols-4 gap-8">
            <ProcessItem
              title="1. Upload"
              subtitle="Select your video in any common format. Our system automatically starts analyzing it."
            />
            <ProcessItem
              title="2. Enhance & Transcribe"
              subtitle="Cleaner video and audio, plus an accurate transcript for easy reference."
            />
            <ProcessItem
              title="3. Summarize & Quiz"
              subtitle="Leasy generates concise overviews and interactive quizlets from your video content."
            />
            <ProcessItem
              title="4. Chat & Explore"
              subtitle="Ask questions in real-time. Our AI bot references the transcript so you never miss a detail."
            />
          </div>

          <div className="mt-10">
            <Button asChild className="bg-foreground text-background">
              <Link href="/learn-more">Learn More</Link>
            </Button>
          </div>
        </div>
      </section>
    </main>
  );
}

// Small Reusable Components

function StatItem({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <div className="text-4xl font-bold text-foreground mb-2">{value}</div>
      <div className="text-muted-foreground text-sm uppercase tracking-wider">
        {label}
      </div>
    </div>
  );
}

function ProcessItem({ title, subtitle }: { title: string; subtitle: string }) {
  return (
    <div className="p-4 text-center bg-background shadow-sm rounded-md border hover:shadow-md transition-shadow">
      <div className="text-lg font-semibold text-foreground mb-1">{title}</div>
      <div className="text-sm text-muted-foreground leading-relaxed">
        {subtitle}
      </div>
    </div>
  );
}
