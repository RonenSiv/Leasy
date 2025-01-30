"use client";

import { motion } from "framer-motion";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

export function FAQSection() {
  return (
    <section className="py-32 relative">
      {/* Decorative circle */}
      <div className="absolute w-[300px] h-[300px] bg-primary/20 top-0 left-0 rounded-full blur-3xl" />

      <div className="container px-4 mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="max-w-3xl mx-auto"
        >
          <h2 className="text-3xl font-bold text-center mb-12">
            Common Questions
          </h2>
          <Accordion type="single" collapsible className="w-full">
            <AccordionItem value="item-1">
              <AccordionTrigger>What is Leasy?</AccordionTrigger>
              <AccordionContent>
                Leasy is an AI-powered platform that transforms your videos into
                fully interactive learning experiences: enhanced video,
                transcripts, summaries, quizzes, and more.
              </AccordionContent>
            </AccordionItem>
            <AccordionItem value="item-2">
              <AccordionTrigger>How does it work?</AccordionTrigger>
              <AccordionContent>
                Upload your educational video. Our AI processes it to enhance
                audio/video, produce a transcript, summarize the content, and
                create quizzes instantly.
              </AccordionContent>
            </AccordionItem>
            <AccordionItem value="item-3">
              <AccordionTrigger>
                What video formats are supported?
              </AccordionTrigger>
              <AccordionContent>
                We support major video formats like MP4, MOV, AVI, and WMV. The
                maximum file size is 2GB per video.
              </AccordionContent>
            </AccordionItem>
            <AccordionItem value="item-4">
              <AccordionTrigger>Is there a free trial?</AccordionTrigger>
              <AccordionContent>
                Yes! You can try Leasy for free with our basic plan, which
                includes up to 3 video uploads and essential features.
              </AccordionContent>
            </AccordionItem>
          </Accordion>
        </motion.div>
      </div>
    </section>
  );
}
