"use client";

import React, { useEffect, useState } from "react";
import { Slider } from "@/components/ui/slider";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea"; // Assume you have a Textarea component
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { AIPersona } from "@/constants/content";

// Mocked AI settings for initial state
const initialAISettings = {
  model: "GPT-4",
  temperature: 0.7, // Creativity level
  tokenLimit: 4096, // Max token limit
  aiPersona: AIPersona, // Initial AI prompt
};

export function AISettings() {
  const [aiSettings, setAISettings] = useState(initialAISettings);
  const [initialSettings] = useState(initialAISettings);
  const [isSaveDisabled, setIsSaveDisabled] = useState(true);

  // Check if there are any changes to enable/disable the save button
  useEffect(() => {
    const settingsChanged =
      aiSettings.model !== initialSettings.model ||
      aiSettings.temperature !== initialSettings.temperature ||
      aiSettings.tokenLimit !== initialSettings.tokenLimit ||
      aiSettings.aiPersona !== initialSettings.aiPersona;

    setIsSaveDisabled(!settingsChanged);
  }, [aiSettings, initialSettings]);

  // Handle slider change for temperature
  const handleTemperatureChange = (value: number[]) => {
    setAISettings((prev) => ({
      ...prev,
      temperature: value[0],
    }));
  };

  // Handle input change for token limit
  const handleTokenLimitChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const tokenValue = Number(e.target.value);
    setAISettings((prev) => ({
      ...prev,
      tokenLimit: tokenValue > 0 ? tokenValue : prev.tokenLimit,
    }));
  };

  // Handle model selection change
  const handleModelChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setAISettings((prev) => ({
      ...prev,
      model: e.target.value,
    }));
  };

  // Handle prompt change
  const handlePromptChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setAISettings((prev) => ({
      ...prev,
      aiPrompt: e.target.value,
    }));
  };

  // Handle save settings
  const handleSaveSettings = () => {
    // Save logic (could be an API call)
    toast.success("AI Settings saved successfully!");
  };

  return (
    <div className="chart-wrapper mx-auto flex max-w-6xl flex-col gap-6 p-6">
      <h2 className="text-2xl font-semibold">AI Settings</h2>

      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
        {/* AI Model Selection */}
        <Card className="lg:max-w-md">
          <CardHeader className="space-y-0 pb-2">
            <CardDescription>Select AI Model</CardDescription>
            <CardTitle className="text-4xl tabular-nums">
              {aiSettings.model}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <Label>Select Model</Label>
            <select
              value={aiSettings.model}
              onChange={handleModelChange}
              className="w-full mt-2 px-3 py-2 border rounded-md focus:outline-none"
            >
              <option value="GPT-4">GPT-4</option>
              <option value="GPT-3.5">GPT-3.5</option>
              <option value="Custom-Model">Custom Model</option>
            </select>
          </CardContent>
          <CardFooter className="flex-col items-start gap-1">
            <CardDescription>
              Select the AI model you want to use for the assistant.
            </CardDescription>
          </CardFooter>
        </Card>

        {/* Temperature Control */}
        <Card className="lg:max-w-md">
          <CardHeader className="space-y-0 pb-2">
            <CardDescription>Creativity Level (Temperature)</CardDescription>
            <CardTitle className="text-4xl tabular-nums">
              {aiSettings.temperature.toFixed(1)}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <Label>Temperature</Label>
            <Slider
              value={[aiSettings.temperature]}
              onValueChange={handleTemperatureChange}
              max={1}
              step={0.1}
              className="mt-4"
            />
          </CardContent>
          <CardFooter className="flex-col items-start gap-1">
            <CardDescription>
              Adjust the model's creativity level. A lower value makes the
              output more deterministic, while a higher value increases
              randomness and creativity.
            </CardDescription>
          </CardFooter>
        </Card>

        {/* Token Limit */}
        <Card className="lg:max-w-md">
          <CardHeader className="space-y-0 pb-2">
            <CardDescription>Max Token Limit</CardDescription>
            <CardTitle className="text-4xl tabular-nums">
              {aiSettings.tokenLimit}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <Label>Max Tokens</Label>
            <Input
              type="number"
              value={aiSettings.tokenLimit}
              onChange={handleTokenLimitChange}
              className="mt-2"
            />
          </CardContent>
          <CardFooter className="flex-col items-start gap-1">
            <CardDescription>
              Set the maximum token limit for the AI model's responses. A higher
              value allows for longer responses but can consume more resources.
            </CardDescription>
          </CardFooter>
        </Card>

        {/* AI Prompt Section */}
        <Card className="lg:max-w-md">
          <CardHeader className="space-y-0 pb-2">
            <CardDescription>AI Persona (Prompt)</CardDescription>
            <CardTitle className="text-4xl tabular-nums">AI Prompt</CardTitle>
          </CardHeader>
          <CardContent>
            <Label>Edit AI Persona Prompt</Label>
            <Textarea
              value={aiSettings.aiPersona}
              onChange={handlePromptChange}
              placeholder="Enter the AI prompt, e.g., 'You are a helpful assistant.'"
              className="mt-2"
              rows={4}
              style={{
                maxHeight: "200px",
              }}
            />
          </CardContent>
          <CardFooter className="flex-col items-start gap-1">
            <CardDescription>
              This prompt defines how the AI behaves. Customize it to set the
              persona or instructions for the AI.
            </CardDescription>
          </CardFooter>
        </Card>
      </div>

      <Button
        onClick={handleSaveSettings}
        className="mt-4"
        disabled={isSaveDisabled}
      >
        Save Settings
      </Button>
    </div>
  );
}
