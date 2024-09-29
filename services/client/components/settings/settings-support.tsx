"use client";

import React, { useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { toast } from "sonner";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";

const faqItems = [
  {
    question: "How can I reset my password?",
    answer:
      "To reset your password, go to the login page and click on 'Forgot Password'. Follow the instructions in the email to reset your password.",
  },
  {
    question: "How do I update my account information?",
    answer:
      "You can update your account information from the Account Settings section in your profile.",
  },
  {
    question: "Where can I find the documentation?",
    answer:
      "You can access the full documentation by visiting our documentation page.",
  },
  {
    question: "How do I contact support?",
    answer:
      "You can contact support via the contact form on the Help & Support page.",
  },
  {
    question: "What is the response time for support requests?",
    answer: "We aim to respond to all support requests within 24 hours.",
  },
  {
    question: "Can I delete my account?",
    answer:
      "Yes, you can request account deletion by contacting our support team.",
  },
  {
    question: "What payment methods are supported?",
    answer: "We support all major credit cards, PayPal, and bank transfers.",
  },
  {
    question: "Is there a mobile app available?",
    answer:
      "Yes, you can download our mobile app from the App Store and Google Play.",
  },
  {
    question: "Can I export my data?",
    answer:
      "Yes, you can export your data in the Account Settings under Data Management.",
  },
  {
    question: "How do I cancel my subscription?",
    answer:
      "You can cancel your subscription from the Billing section in your profile.",
  },
];

const itemsPerPage = 4;

export function HelpAndSupport() {
  const [form, setForm] = useState({ name: "", email: "", message: "" });
  const [faqSearch, setFaqSearch] = useState("");
  const [currentPage, setCurrentPage] = useState(1);

  const filteredFaqs = faqItems.filter((item) =>
    item.question.toLowerCase().includes(faqSearch.toLowerCase()),
  );

  const totalPages = Math.ceil(filteredFaqs.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const currentFaqs = filteredFaqs.slice(startIndex, startIndex + itemsPerPage);

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
  ) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (form.name && form.email && form.message) {
      toast.success("Your message has been sent!");
      setForm({ name: "", email: "", message: "" });
    } else {
      toast.error("Please fill out all fields.");
    }
  };

  // Handle pagination controls
  const handlePreviousPage = () =>
    setCurrentPage((prev) => Math.max(prev - 1, 1));
  const handleNextPage = () =>
    setCurrentPage((prev) => Math.min(prev + 1, totalPages));

  return (
    <div className="mx-auto max-w-6xl p-6 w-full">
      <h2 className="text-2xl font-semibold mb-6">Help & Support</h2>

      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 w-full">
        {/* FAQ Section */}
        <Card>
          <CardHeader>
            <CardTitle>Frequently Asked Questions</CardTitle>
            <CardDescription>Find answers to common questions</CardDescription>
          </CardHeader>
          <CardContent>
            <Input
              type="text"
              placeholder="Search FAQs..."
              value={faqSearch}
              onChange={(e) => setFaqSearch(e.target.value)}
              className="mb-4"
            />
            <div className="space-y-4">
              {currentFaqs.length ? (
                currentFaqs.map((faq, index) => (
                  <div key={index}>
                    <h4 className="font-semibold">{faq.question}</h4>
                    <p className={"text-muted-foreground"}>{faq.answer}</p>
                  </div>
                ))
              ) : (
                <p>No FAQs match your search.</p>
              )}
            </div>

            {/* Pagination Controls */}
            {filteredFaqs.length > itemsPerPage && (
              <div className="mt-6 flex justify-between items-center">
                <Button
                  onClick={handlePreviousPage}
                  disabled={currentPage === 1}
                >
                  Previous
                </Button>
                <p className="text-sm">
                  Page {currentPage} of {totalPages}
                </p>
                <Button
                  onClick={handleNextPage}
                  disabled={currentPage === totalPages}
                >
                  Next
                </Button>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Contact Support Form */}
        <Card>
          <CardHeader>
            <CardTitle>Contact Support</CardTitle>
            <CardDescription>Submit a request for assistance</CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit}>
              <div className="mb-4">
                <Label>Name</Label>
                <Input
                  type="text"
                  name="name"
                  placeholder="Your Name"
                  value={form.name}
                  onChange={handleInputChange}
                />
              </div>
              <div className="mb-4">
                <Label>Email</Label>
                <Input
                  type="email"
                  name="email"
                  placeholder="Your Email"
                  value={form.email}
                  onChange={handleInputChange}
                />
              </div>
              <div className="mb-4">
                <Label>Message</Label>
                <Textarea
                  name="message"
                  placeholder="Your Message"
                  value={form.message}
                  onChange={handleInputChange}
                  rows={4}
                />
              </div>
              <Button type="submit" className="mt-4">
                Send Message
              </Button>
            </form>
          </CardContent>
        </Card>
      </div>

      <Separator className="my-6" />

      {/* Additional Support Links */}
      <Card>
        <CardHeader>
          <CardTitle>More Support Options</CardTitle>
          <CardDescription>
            Explore additional resources for help
          </CardDescription>
        </CardHeader>
        <CardContent>
          <ul className="list-disc pl-6 space-y-2">
            <li>
              Visit our{" "}
              <a
                href="https://docs.example.com"
                target="_blank"
                rel="noopener noreferrer"
                className="underline text-blue-600"
              >
                Documentation
              </a>{" "}
              for in-depth guides and tutorials.
            </li>
            <li>
              Contact us at{" "}
              <a
                href="mailto:support@example.com"
                className="underline text-blue-600"
              >
                support@example.com
              </a>{" "}
              for any technical issues or questions.
            </li>
            <li>
              Check out our{" "}
              <a
                href="https://community.example.com"
                target="_blank"
                rel="noopener noreferrer"
                className="underline text-blue-600"
              >
                Community Forum
              </a>{" "}
              to get help from other users.
            </li>
          </ul>
        </CardContent>
      </Card>
    </div>
  );
}
