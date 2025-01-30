"use client";

import { useEffect, useState } from "react";
import { useSettings } from "@/context/settings-context";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { ChevronRight, Search } from "lucide-react";
import { cn } from "@/lib/utils";
import { marked } from "marked";

const docSections = [
  {
    id: "getting-started",
    title: "Getting Started",
    icon: "🚀",
    subsections: [
      {
        id: "introduction",
        title: "Introduction",
        content: `
# Welcome to Leasy

Leasy is an innovative platform designed to enhance your learning experience through advanced video content tools. This guide will help you get started with our platform.

## Quick Start

1. **Create an Account**
 - Click the "Sign Up" button in the top right
 - Fill in your details
 - Verify your email

2. **Upload Your First Video**
 - Navigate to the dashboard
 - Click "Upload"
 - Select your video file
 - Add title and description

3. **Explore Features**
 - AI-powered transcription
 - Smart summaries
 - Interactive quizzes
 - Chatbot assistance

## Key Features

- **Video Enhancement**: Improve quality automatically
- **Transcription**: Get accurate text versions
- **Summaries**: AI-generated key points
- **Quizzes**: Test understanding
- **Chat Support**: Get instant help
        `,
      },
      {
        id: "installation",
        title: "Installation",
        content: `
# Installation Guide

## System Requirements

- Modern web browser (Chrome, Firefox, Safari)
- Stable internet connection
- Minimum 2MB/s upload speed

## Supported Formats

- Video: MP4, MOV, AVI, WMV
- Audio: MP3, WAV
- Maximum file size: 2GB

## Getting Help

If you need assistance:

1. Check our FAQ section
2. Contact support
3. Join our community forum
        `,
      },
    ],
  },
  {
    id: "features",
    title: "Features",
    icon: "⚡",
    subsections: [
      {
        id: "video-upload",
        title: "Video Upload",
        content: `
# Video Upload Guide

## Preparing Your Video

Before uploading, ensure your video:
- Is in a supported format
- Doesn't exceed size limits
- Has clear audio

## Upload Process

1. **Select File**
 - Click "Upload" or drag & drop
 - Choose your video file

2. **Add Details**
 - Title
 - Description
 - Tags
 - Visibility settings

3. **Processing**
 - Wait for upload to complete
 - Allow AI processing
 - Review generated content

## Best Practices

- Use descriptive titles
- Add detailed descriptions
- Include relevant tags
- Check video quality
        `,
      },
      {
        id: "ai-features",
        title: "AI Features",
        content: `
# AI Features

## Transcription

Our AI transcription:
- Supports multiple languages
- Has 95%+ accuracy
- Includes speaker detection
- Provides timestamps

## Smart Summaries

AI-generated summaries:
- Key points extraction
- Chapter markers
- Important quotes
- Topic breakdown

## Quiz Generation

Automatic quiz creation:
- Multiple choice questions
- True/false statements
- Fill in the blanks
- Concept checking
        `,
      },
    ],
  },
];

export default function DocumentationPage() {
  const { reduceMotion } = useSettings();
  const [searchTerm, setSearchTerm] = useState("");
  const [activeSection, setActiveSection] = useState("getting-started");
  const [activeSubsection, setActiveSubsection] = useState("introduction");
  const [filteredSections, setFilteredSections] = useState(docSections);

  const currentSection = filteredSections.find((s) => s.id === activeSection);
  const currentSubsection = currentSection?.subsections.find(
    (s) => s.id === activeSubsection,
  );

  useEffect(() => {
    if (searchTerm) {
      const filtered = docSections
        .map((section) => ({
          ...section,
          subsections: section.subsections.filter(
            (subsection) =>
              subsection.title
                .toLowerCase()
                .includes(searchTerm.toLowerCase()) ||
              subsection.content
                .toLowerCase()
                .includes(searchTerm.toLowerCase()),
          ),
        }))
        .filter((section) => section.subsections.length > 0);
      setFilteredSections(filtered);
    } else {
      setFilteredSections(docSections);
    }
  }, [searchTerm]);

  return (
    <div className="min-h-[calc(100vh-4rem)] flex">
      {/* Sidebar */}
      <div className="w-64 border-r bg-muted/50 p-4 hidden md:block">
        <div className="mb-4">
          <div className="relative">
            <Search className="absolute left-2 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              type="search"
              placeholder="Search..."
              className="pl-8"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
        </div>
        <ScrollArea className="h-[calc(100vh-8rem)]">
          <div className="space-y-4">
            {filteredSections.map((section) => (
              <div key={section.id} className="space-y-2">
                <button
                  onClick={() => {
                    setActiveSection(section.id);
                    setActiveSubsection(section.subsections[0].id);
                  }}
                  className={cn(
                    "flex items-center w-full rounded-lg px-2 py-1.5 text-sm font-medium",
                    activeSection === section.id
                      ? "bg-primary text-primary-foreground"
                      : "text-muted-foreground hover:bg-muted",
                  )}
                >
                  <span className="mr-2">{section.icon}</span>
                  {section.title}
                </button>
                {activeSection === section.id && (
                  <div className="ml-4 space-y-1">
                    {section.subsections.map((subsection) => (
                      <button
                        key={subsection.id}
                        onClick={() => setActiveSubsection(subsection.id)}
                        className={cn(
                          "flex items-center w-full rounded-lg px-2 py-1.5 text-sm",
                          activeSubsection === subsection.id
                            ? "text-primary font-medium"
                            : "text-muted-foreground hover:text-foreground",
                        )}
                      >
                        <ChevronRight className="mr-1 h-4 w-4" />
                        {subsection.title}
                      </button>
                    ))}
                  </div>
                )}
              </div>
            ))}
          </div>
        </ScrollArea>
      </div>

      {/* Main content */}
      <div className="flex-1 overflow-auto">
        <ScrollArea className="h-[calc(100vh-4rem)]">
          <div className="max-w-3xl mx-auto px-8 py-12">
            <div className="prose dark:prose-invert max-w-none">
              {currentSubsection && (
                <div
                  dangerouslySetInnerHTML={{
                    __html: marked(currentSubsection.content),
                  }}
                />
              )}
            </div>
          </div>
        </ScrollArea>
      </div>
    </div>
  );
}
