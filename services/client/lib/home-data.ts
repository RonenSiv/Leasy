import { Clock, Star, Users } from "lucide-react";

export const stats = [
  { icon: Star, label: "Active Users", value: "10,000+" },
  { icon: Users, label: "Hours Saved", value: "50,000+" },
  { icon: Clock, label: "Satisfaction Rate", value: "98%" },
];

export const faqItems = [
  {
    id: "item-1",
    question: "What is StudyFetch?",
    answer:
      "StudyFetch is an AI-powered platform that transforms educational videos or docs into comprehensive learning materials.",
  },
  {
    id: "item-2",
    question: "How does it work?",
    answer:
      "Upload your lecture slides, PDFs, or videos, and StudyFetch AI automatically generates the best study resources.",
  },
  {
    id: "item-3",
    question: "What formats are supported?",
    answer:
      "Most common file types: video, PDF, PPT, etc. The max file size is 2GB per upload.",
  },
  {
    id: "item-4",
    question: "Is there a free plan?",
    answer:
      "Absolutely! You can try StudyFetch for free with our basic plan, which includes up to 3 uploads.",
  },
];
