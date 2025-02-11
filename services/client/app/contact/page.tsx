"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { useSettings } from "@/context/settings-context";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import {
  Clock,
  Facebook,
  Globe,
  Linkedin,
  Loader2,
  Mail,
  MapPin,
  Phone,
  Twitter,
} from "lucide-react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import api from "@/lib/api";
import toast from "react-hot-toast";

const formSchema = z.object({
  sender_full_name: z.string().min(2, {
    message: "Name must be at least 2 characters.",
  }),
  sender_mail_address: z.string().email({
    message: "Please enter a valid email address.",
  }),
  mail_subject: z.string().min(5, {
    message: "Subject must be at least 5 characters.",
  }),
  mail_content: z.string().min(10, {
    message: "Message must be at least 10 characters.",
  }),
});

export default function Contact() {
  const { reduceMotion } = useSettings();
  const [isLoading, setIsLoading] = useState(false);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      sender_full_name: "",
      sender_mail_address: "",
      mail_subject: "",
      mail_content: "",
    },
  });

  async function onSubmit(values: z.infer<typeof formSchema>) {
    setIsLoading(true);
    const response = api
      .post("/mail/support", {
        ...values,
      })
      .then((res: any) => {
        if (res.status === 200) {
          form.reset();
        }
      })
      .catch((error: any) => {})
      .finally(() => {
        setIsLoading(false);
      });

    await toast.promise(response, {
      loading: "Sending message...",
      success: "Message sent successfully",
      error: "Failed to send message",
    });
  }

  return (
    <div className="container mx-auto px-4 py-16">
      <motion.div
        className="text-center mb-16"
        initial={reduceMotion ? {} : { opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <h1 className="text-4xl font-bold mb-4">Contact Us</h1>
        <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
          We&apos;re here to help. Reach out to us with any questions or
          concerns.
        </p>
      </motion.div>

      <div className="grid md:grid-cols-2 gap-8">
        <Card>
          <CardHeader>
            <CardTitle>Send us a message</CardTitle>
          </CardHeader>
          <CardContent>
            <Form {...form}>
              <form
                onSubmit={form.handleSubmit(onSubmit)}
                className="space-y-6"
              >
                <FormField
                  control={form.control}
                  name="sender_full_name"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Name</FormLabel>
                      <FormControl>
                        <Input placeholder="John Doe" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="sender_mail_address"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Email</FormLabel>
                      <FormControl>
                        <Input placeholder="john@example.com" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="mail_subject"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Subject</FormLabel>
                      <FormControl>
                        <Input placeholder="How can we help?" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="mail_content"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Message</FormLabel>
                      <FormControl>
                        <Textarea
                          placeholder="Tell us more about your inquiry..."
                          className="min-h-[120px]"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <Button type="submit" className="w-full" disabled={isLoading}>
                  {isLoading ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Sending...
                    </>
                  ) : (
                    "Send Message"
                  )}
                </Button>
              </form>
            </Form>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Contact Information</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center space-x-2">
              <Mail className="text-primary" />
              <span>support@leasy.com</span>
            </div>
            <div className="flex items-center space-x-2">
              <Phone className="text-primary" />
              <span>+1 (555) 123-4567</span>
            </div>
            <div className="flex items-center space-x-2">
              <MapPin className="text-primary" />
              <span>123 Leasy Street, San Francisco, CA 94105</span>
            </div>
            <div className="flex items-center space-x-2">
              <Clock className="text-primary" />
              <span>Monday - Friday: 9:00 AM - 5:00 PM (PST)</span>
            </div>
            <div className="flex items-center space-x-2">
              <Globe className="text-primary" />
              <a
                href="https://www.leasy.com"
                className="text-primary hover:underline"
              >
                www.leasy.com
              </a>
            </div>
            <div className="flex items-center space-x-4 mt-4">
              <a
                href="https://www.facebook.com/leasy"
                target="_blank"
                rel="noopener noreferrer"
              >
                <Facebook className="text-primary hover:text-primary/80" />
              </a>
              <a
                href="https://www.twitter.com/leasy"
                target="_blank"
                rel="noopener noreferrer"
              >
                <Twitter className="text-primary hover:text-primary/80" />
              </a>
              <a
                href="https://www.linkedin.com/company/leasy"
                target="_blank"
                rel="noopener noreferrer"
              >
                <Linkedin className="text-primary hover:text-primary/80" />
              </a>
            </div>
            <div className="mt-6">
              <h3 className="text-lg font-semibold mb-2">Our Location</h3>
              <div className="aspect-video w-full">
                <iframe
                  src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3153.0977709532707!2d-122.39901368468215!3d37.78992797975504!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x8085807ded297e89%3A0x9eb37a7ff790e3a8!2s123%20Mission%20St%2C%20San%20Francisco%2C%20CA%2094105!5e0!3m2!1sen!2sus!4v1645564756244!5m2!1sen!2sus"
                  width="100%"
                  height="100%"
                  style={{ border: 0 }}
                  allowFullScreen
                  loading="lazy"
                  referrerPolicy="no-referrer-when-downgrade"
                ></iframe>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
