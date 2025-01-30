"use client";

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Progress } from "@/components/ui/progress";
import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { useSettings } from "@/context/settings-context";
import { Button } from "@/components/ui/button";

interface UploadProgressProps {
  open: boolean;
  progress: number;
  onCancel: () => void;
}

export function UploadProgress({
  open,
  progress,
  onCancel,
}: UploadProgressProps) {
  const { reduceMotion } = useSettings();
  const [showWarning, setShowWarning] = useState(false);

  useEffect(() => {
    if (!open) {
      setShowWarning(false);
    }
  }, [open]);

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

  return (
    <>
      <Dialog open={open} onOpenChange={() => setShowWarning(true)}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Processing</DialogTitle>
            <DialogDescription>
              Please wait while we process your file
            </DialogDescription>
          </DialogHeader>
          <div className="mt-4 space-y-4">
            <motion.div
              initial={reduceMotion ? { opacity: 1 } : { opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.5 }}
              className="space-y-2"
            >
              <Progress value={progress} className="h-2" />
              <p className="text-sm text-center text-muted-foreground">
                {Math.round(progress)}% complete
              </p>
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
