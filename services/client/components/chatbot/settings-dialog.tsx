"use client";

import React from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";

interface SettingsDialogProps {
  isDialogOpen: boolean;
  setIsDialogOpen: (open: boolean) => void;
  knowledge: string;
  setKnowledge: (knowledge: string) => void;
  aiPersona: string;
  setAiPersona: (persona: string) => void;
  isSettingsChanged: boolean;
  setIsSettingsChanged: (changed: boolean) => void;
  saveSettings: () => void;
  resetSettings: () => void;
}

export default function SettingsDialog({
  isDialogOpen,
  setIsDialogOpen,
  knowledge,
  setKnowledge,
  aiPersona,
  setAiPersona,
  isSettingsChanged,
  setIsSettingsChanged,
  saveSettings,
  resetSettings,
}: SettingsDialogProps) {
  return (
    <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
      <DialogTrigger asChild>
        <Button
          variant="link"
          className="text-sm text-blue-500 dark:text-blue-400 font-semibold hover:underline"
        >
          AI Tutor settings and information
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>AI Tutor Settings</DialogTitle>
          <DialogDescription>
            Configure the AI Tutor's knowledge and persona.
          </DialogDescription>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="knowledge" className="text-right">
              Knowledge
            </Label>
            <Textarea
              id="knowledge"
              value={knowledge}
              onChange={(e) => {
                setKnowledge(e.target.value);
                setIsSettingsChanged(true);
              }}
              className="col-span-3"
            />
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="persona" className="text-right">
              AI Persona
            </Label>
            <Textarea
              id="persona"
              value={aiPersona}
              onChange={(e) => {
                setAiPersona(e.target.value);
                setIsSettingsChanged(true);
              }}
              className="col-span-3"
            />
          </div>
        </div>
        <div className="flex justify-between">
          <Button onClick={resetSettings} variant="outline">
            Reset to Default
          </Button>
          <Button onClick={saveSettings} disabled={!isSettingsChanged}>
            Save Changes
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
