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
import { toast } from "sonner";
import { z } from "zod";
import { Label } from "@/components/ui/label";

const feedbackSchema = z.object({
  name: z
    .string()
    .min(2, { message: "Name must be at least 2 characters long." }),
  email: z.string().email({ message: "Invalid email address." }),
  category: z.string().nonempty({ message: "Category is required." }),
  message: z
    .string()
    .min(10, { message: "Feedback must be at least 10 characters long." }),
});

export function Feedback() {
  const [form, setForm] = useState({
    name: "",
    email: "",
    category: "",
    message: "",
  });

  const [errors, setErrors] = useState<{ [key: string]: string }>({});

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
  ) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleCategoryChange = (value: string) => {
    setForm({ ...form, category: value });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    try {
      feedbackSchema.parse(form);

      toast.success("Thank you for your feedback! 🎉");
      setForm({ name: "", email: "", category: "", message: "" });
      setErrors({});
    } catch (err: any) {
      const validationErrors: { [key: string]: string } = {};
      err.errors.forEach((error: any) => {
        validationErrors[error.path[0]] = error.message;
      });
      setErrors(validationErrors);
      toast.error("Please correct the errors before submitting.");
    }
  };

  return (
    <div className="mx-auto max-w-7xl p-6 space-y-8">
      <h2 className="text-4xl font-bold text-center mb-6 text-primary">
        We Value Your Feedback ✨
      </h2>

      <Card className="w-full bg-card text-card-foreground border border-border shadow-md rounded-lg">
        <CardHeader className="p-4 rounded-t-lg">
          <CardTitle className="text-3xl font-bold">
            Submit Your Feedback 💬
          </CardTitle>
          <CardDescription className="text-lg">
            Your thoughts help us improve! Please fill out the form below.
          </CardDescription>
        </CardHeader>
        <CardContent className="p-6 space-y-4">
          <form onSubmit={handleSubmit}>
            {/* Name Input */}
            <div className="mb-4">
              <Label className="block text-sm font-semibold text-muted-foreground">
                Name
              </Label>
              <Input
                type="text"
                name="name"
                placeholder="Your Name"
                value={form.name}
                onChange={handleInputChange}
                className={`w-full mt-1 ${errors.name && "border-destructive"}`}
                required
              />
              {errors.name && (
                <p className="text-destructive text-sm mt-1">{errors.name}</p>
              )}
            </div>

            {/* Email Input */}
            <div className="mb-4">
              <Label className="block text-sm font-semibold text-muted-foreground">
                Email
              </Label>
              <Input
                type="email"
                name="email"
                placeholder="Your Email"
                value={form.email}
                onChange={handleInputChange}
                className={`w-full mt-1 ${errors.email && "border-destructive"}`}
                required
              />
              {errors.email && (
                <p className="text-destructive text-sm mt-1">{errors.email}</p>
              )}
            </div>

            {/* Category Select */}
            <div className="mb-4">
              <Label className="block text-sm font-semibold text-muted-foreground">
                Category
              </Label>
              <Select
                onValueChange={handleCategoryChange}
                value={form.category}
                required
              >
                <SelectTrigger className="w-full mt-1 border border-border rounded-md focus:ring-primary">
                  <SelectValue placeholder="Select a category" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="bug">🐞 Bug Report</SelectItem>
                  <SelectItem value="feature">🚀 Feature Request</SelectItem>
                  <SelectItem value="feedback">💬 General Feedback</SelectItem>
                </SelectContent>
              </Select>
              {errors.category && (
                <p className="text-destructive text-sm mt-1">
                  {errors.category}
                </p>
              )}
            </div>

            {/* Message Textarea */}
            <div className="mb-4">
              <Label className="block text-sm font-semibold text-muted-foreground">
                Message
              </Label>
              <Textarea
                name="message"
                placeholder="Write your feedback here..."
                value={form.message}
                onChange={handleInputChange}
                rows={4}
                className={`w-full mt-1 ${errors.message && "border-destructive"}`}
                required
              />
              {errors.message && (
                <p className="text-destructive text-sm mt-1">
                  {errors.message}
                </p>
              )}
            </div>

            {/* Submit Button */}
            <Button type="submit" className="mt-4 w-full">
              Submit Feedback
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
