"use client";

import React, { useState } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { Mail, MapPin, Phone } from "lucide-react";
import { ClientImage } from "@/components/ClientImage";
import { z } from "zod";

const messageSchema = z.object({
  name: z.string().min(1, "Name is required"),
  email: z.string().email("Invalid email address"),
  subject: z.string().min(1, "Subject is required"),
  message: z.string().min(10, "Message must be at least 10 characters"),
});

type MessageFormValues = z.infer<typeof messageSchema>;

export default function ContactPage() {
  const [formValues, setFormValues] = useState<MessageFormValues>({
    name: "",
    email: "",
    subject: "",
    message: "",
  });
  const [formErrors, setFormErrors] = useState<Partial<MessageFormValues>>({});

  const handleChange =
    (field: keyof MessageFormValues) =>
    (event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
      setFormValues((prev) => ({
        ...prev,
        [field]: event.target.value,
      }));
    };

  const handleSubmit = (event: React.FormEvent) => {
    event.preventDefault();

    try {
      messageSchema.parse(formValues);
      setFormErrors({});

      console.log("Form submitted successfully", formValues);
    } catch (error) {
      if (error instanceof z.ZodError) {
        const formattedErrors = error.flatten().fieldErrors;
        setFormErrors(formattedErrors as Partial<MessageFormValues>);
      }
    }
  };

  return (
    <div className="container mx-auto px-4 py-16 bg-background text-foreground">
      <div className="flex flwx-row items-center justify-center space-x-8 mb-12">
        <h1 className="text-4xl font-bold text-center text-primary">
          Get in Touch
        </h1>
        <ClientImage
          src="/main.png"
          alt="Contact Us"
          width={100}
          height={100}
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
        <Card>
          <CardHeader>
            <CardTitle>Send Us a Message 💌</CardTitle>
            <CardDescription>
              We'd love to hear from you! Fill out the form below and we'll get
              back to you as soon as possible.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="space-y-2">
                <Label htmlFor="name">Name</Label>
                <Input
                  id="name"
                  placeholder="Your Name"
                  value={formValues.name}
                  onChange={handleChange("name")}
                  className={formErrors.name ? "border-red-500" : ""}
                  required
                />
                {formErrors.name && (
                  <p className="text-red-500 text-sm">{formErrors.name}</p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="your@email.com"
                  value={formValues.email}
                  onChange={handleChange("email")}
                  className={formErrors.email ? "border-red-500" : ""}
                  required
                />
                {formErrors.email && (
                  <p className="text-red-500 text-sm">{formErrors.email}</p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="subject">Subject</Label>
                <Select
                  onValueChange={(value) =>
                    setFormValues((prev) => ({ ...prev, subject: value }))
                  }
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select a subject" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="general">General Inquiry</SelectItem>
                    <SelectItem value="support">Technical Support</SelectItem>
                    <SelectItem value="feedback">Feedback</SelectItem>
                    <SelectItem value="partnership">Partnership</SelectItem>
                  </SelectContent>
                </Select>
                {formErrors.subject && (
                  <p className="text-red-500 text-sm">{formErrors.subject}</p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="message">Message</Label>
                <Textarea
                  id="message"
                  placeholder="Your message here..."
                  value={formValues.message}
                  onChange={handleChange("message")}
                  className={formErrors.message ? "border-red-500" : ""}
                  required
                />
                {formErrors.message && (
                  <p className="text-red-500 text-sm">{formErrors.message}</p>
                )}
              </div>

              <Button type="submit" className="w-full">
                Send Message 🚀
              </Button>
            </form>
          </CardContent>
        </Card>

        <div className="space-y-8">
          <Card>
            <CardHeader>
              <CardTitle>Contact Information 📇</CardTitle>
              <CardDescription>
                Here are the ways you can reach us directly:
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center space-x-4">
                <MapPin className="text-primary" />
                <span>123 Learning Lane, Education City, 12345, Israel</span>
              </div>
              <div className="flex items-center space-x-4">
                <Mail className="text-primary" />
                <a href="mailto:contact@leasy.com" className="hover:underline">
                  contact@leasy.com
                </a>
              </div>
              <div className="flex items-center space-x-4">
                <Phone className="text-primary" />
                <span>+1 (234) 567-8900</span>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Frequently Asked Questions 🤔</CardTitle>
              <CardDescription>
                Quick answers to common questions:
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <h3 className="font-semibold">How does Leasy work?</h3>
                <p className="text-sm text-muted-foreground">
                  Leasy uses AI to summarize lecture videos and create
                  interactive quizzes, making learning more efficient and
                  engaging.
                </p>
              </div>
              <div>
                <h3 className="font-semibold">Is Leasy free for students?</h3>
                <p className="text-sm text-muted-foreground">
                  We offer a free tier for students with basic features. Premium
                  features are available through paid subscriptions.
                </p>
              </div>
              <div>
                <h3 className="font-semibold">
                  Can I use Leasy for my online course?
                </h3>
                <p className="text-sm text-muted-foreground">
                  Leasy is designed to work with various online learning
                  platforms and video formats.
                </p>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
