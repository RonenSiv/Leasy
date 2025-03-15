"use client";

import React, { useState } from "react";
import { motion } from "framer-motion";
import { useSettings } from "@/context/settings-context";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
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
import { Mail, MessageSquare, Phone } from "lucide-react";

export default function SupportPage() {
  const { reduceMotion } = useSettings();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log("Support form submitted:", { name, email, message });
    setName("");
    setEmail("");
    setMessage("");
  };

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
        <h1 className="text-4xl font-bold mb-4">Support</h1>
        <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
          Need help? We&apos;re here to assist you. Check out our FAQs or get in
          touch with us.
        </p>
      </motion.div>

      <motion.div
        className="grid md:grid-cols-2 gap-8"
        variants={reduceMotion ? {} : containerVariants}
        initial="hidden"
        animate="visible"
      >
        <motion.div variants={reduceMotion ? {} : itemVariants}>
          <Card>
            <CardHeader>
              <CardTitle>Frequently Asked Questions</CardTitle>
              <CardDescription>
                Find quick answers to common questions
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Accordion type="single" collapsible>
                <AccordionItem value="item-1">
                  <AccordionTrigger>How do I upload a video?</AccordionTrigger>
                  <AccordionContent>
                    To upload a video, go to your dashboard and click on the
                    &quot;Upload&quot; button. Follow the prompts to select and
                    upload your video file.
                  </AccordionContent>
                </AccordionItem>
                <AccordionItem value="item-2">
                  <AccordionTrigger>
                    What video formats are supported?
                  </AccordionTrigger>
                  <AccordionContent>
                    Leasy supports most common video formats, including MP4,
                    AVI, MOV, and WMV. For best results, we recommend using MP4
                    with H.264 encoding.
                  </AccordionContent>
                </AccordionItem>
                <AccordionItem value="item-3">
                  <AccordionTrigger>
                    How long does video processing take?
                  </AccordionTrigger>
                  <AccordionContent>
                    Video processing time depends on the length and quality of
                    your video. Most videos are processed within 10-30 minutes,
                    but larger files may take longer.
                  </AccordionContent>
                </AccordionItem>
              </Accordion>
            </CardContent>
          </Card>
        </motion.div>

        <motion.div variants={reduceMotion ? {} : itemVariants}>
          <Card>
            <CardHeader>
              <CardTitle>Contact Us</CardTitle>
              <CardDescription>
                Get in touch with our support team
              </CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label
                    htmlFor="name"
                    className="block text-sm font-medium text-gray-700"
                  >
                    Name
                  </label>
                  <Input
                    type="text"
                    id="name"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    required
                  />
                </div>
                <div>
                  <label
                    htmlFor="email"
                    className="block text-sm font-medium text-gray-700"
                  >
                    Email
                  </label>
                  <Input
                    type="email"
                    id="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                  />
                </div>
                <div>
                  <label
                    htmlFor="message"
                    className="block text-sm font-medium text-gray-700"
                  >
                    Message
                  </label>
                  <Textarea
                    id="message"
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    required
                    rows={4}
                  />
                </div>
                <Button type="submit">Send Message</Button>
              </form>
            </CardContent>
          </Card>
        </motion.div>
      </motion.div>

      <motion.div
        className="mt-16 text-center"
        initial={reduceMotion ? {} : { opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.5 }}
      >
        <h2 className="text-2xl font-bold mb-4">Other Ways to Reach Us</h2>
        <div className="flex justify-center space-x-8">
          <div className="flex items-center">
            <Mail className="mr-2" />
            <span>support@leasy.com</span>
          </div>
          <div className="flex items-center">
            <Phone className="mr-2" />
            <span>+1 (555) 123-4567</span>
          </div>
          <div className="flex items-center">
            <MessageSquare className="mr-2" />
            <span>Live Chat (9am-5pm EST)</span>
          </div>
        </div>
      </motion.div>
    </div>
  );
}
