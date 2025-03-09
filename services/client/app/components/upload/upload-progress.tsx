"use client";

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { useEffect, useRef, useState } from "react";
import { motion } from "framer-motion";
import { useSettings } from "@/context/settings-context";
import { Button } from "@/components/ui/button";
import { Loader2 } from "lucide-react";

// Define a more detailed status type
export type UploadStatus = {
  phase:
    | "preparing"
    | "uploading"
    | "processing"
    | "transcribing"
    | "analyzing"
    | "finalizing";
  message: string;
  progress: number;
};

interface UploadProgressProps {
  open: boolean;
  status: UploadStatus;
  onCancel: () => void;
}

export function UploadProgress({
  open,
  status,
  onCancel,
}: UploadProgressProps) {
  const { reduceMotion } = useSettings();
  const [showWarning, setShowWarning] = useState(false);
  const [elapsedTime, setElapsedTime] = useState(0);
  const startTimeRef = useRef<number | null>(null);
  const timerRef = useRef<NodeJS.Timeout | null>(null);

  // Start/stop timer based on dialog open state
  useEffect(() => {
    if (open && !startTimeRef.current) {
      startTimeRef.current = Date.now();

      // Start the timer to update elapsed time
      timerRef.current = setInterval(() => {
        if (startTimeRef.current) {
          const elapsed = Math.floor(
            (Date.now() - startTimeRef.current) / 1000,
          );
          setElapsedTime(elapsed);
        }
      }, 1000);
    } else if (!open) {
      // Reset timer when dialog closes
      setShowWarning(false);
      setElapsedTime(0);
      startTimeRef.current = null;

      if (timerRef.current) {
        clearInterval(timerRef.current);
        timerRef.current = null;
      }
    }

    return () => {
      if (timerRef.current) {
        clearInterval(timerRef.current);
      }
    };
  }, [open]);

  // Format time for display (MM:SS)
  const formatTime = (seconds: number): string => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, "0")}`;
  };

  // Calculate and format estimated time remaining
  const getTimeEstimate = (): string => {
    if (status.progress <= 0 || elapsedTime <= 0) return "";

    // Calculate estimated total time based on current progress and elapsed time
    const estimatedTotalTime = (elapsedTime / status.progress) * 100;
    const estimatedRemaining = Math.max(
      0,
      Math.floor(estimatedTotalTime - elapsedTime),
    );

    if (estimatedRemaining < 10) return "Almost done";
    if (estimatedRemaining > 300) return "This may take a while";

    return `Est. ${formatTime(estimatedRemaining)} remaining`;
  };

  const handleCancel = () => {
    onCancel();
    setShowWarning(false);
  };

  useEffect(() => {
    const handleBeforeUnload = (e: BeforeUnloadEvent) => {
      if (open) {
        e.preventDefault();
        e.returnValue = "";
      }
    };

    window.addEventListener("beforeunload", handleBeforeUnload);
    return () => window.removeEventListener("beforeunload", handleBeforeUnload);
  }, [open]);

  const timeEstimate = elapsedTime > 5 ? getTimeEstimate() : "";

  // Get dialog title based on current phase
  const getDialogTitle = () => {
    switch (status.phase) {
      case "preparing":
        return "Preparing";
      case "uploading":
        return "Uploading";
      case "processing":
      case "analyzing":
      case "transcribing":
        return "Processing";
      case "finalizing":
        return "Finalizing";
      default:
        return "Uploading";
    }
  };

  // Get dialog description based on current phase
  const getDialogDescription = () => {
    switch (status.phase) {
      case "preparing":
        return "Preparing your file for upload";
      case "uploading":
        return "Uploading your file to our servers";
      case "processing":
        return "Processing your video file";
      case "transcribing":
        return "Generating transcription for your video";
      case "analyzing":
        return "Analyzing video content";
      case "finalizing":
        return "Finalizing and saving your video";
      default:
        return "Please wait while we process your file";
    }
  };

  return (
    <>
      <Dialog open={open} onOpenChange={() => setShowWarning(true)}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>{getDialogTitle()}</DialogTitle>
            <DialogDescription>{getDialogDescription()}</DialogDescription>
          </DialogHeader>
          <div className="mt-4 space-y-4">
            <motion.div
              initial={reduceMotion ? { opacity: 1 } : { opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.5 }}
              className="space-y-4"
            >
              <div className="flex justify-center">
                <Loader2 className="h-8 w-8 animate-spin text-primary" />
              </div>
              <div className="space-y-1 text-center">
                <p className="text-sm font-medium text-muted-foreground">
                  {status.message}
                </p>
                {timeEstimate && (
                  <p className="text-xs text-muted-foreground">
                    {timeEstimate}
                  </p>
                )}
                {elapsedTime > 0 && (
                  <p className="text-xs text-muted-foreground/70">
                    Elapsed: {formatTime(elapsedTime)}
                  </p>
                )}
              </div>
            </motion.div>
            <p className="text-sm text-center text-muted-foreground">
              Supports video and audio files
            </p>
          </div>
        </DialogContent>
      </Dialog>

      {showWarning && (
        <Dialog open={showWarning} onOpenChange={setShowWarning}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Cancel Upload?</DialogTitle>
              <DialogDescription>
                Are you sure you want to cancel the upload? The process will be
                lost.
              </DialogDescription>
            </DialogHeader>
            <div className="flex justify-end space-x-2">
              <Button variant="outline" onClick={() => setShowWarning(false)}>
                Continue Upload
              </Button>
              <Button variant="destructive" onClick={handleCancel}>
                Cancel Upload
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      )}
    </>
  );
}
