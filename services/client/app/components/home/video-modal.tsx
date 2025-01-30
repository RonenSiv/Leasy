"use client";

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

interface VideoModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function VideoModal({ isOpen, onClose }: VideoModalProps) {
  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-3xl">
        <DialogHeader>
          <DialogTitle>Leasy Demo</DialogTitle>
          <DialogDescription>
            A quick preview of how Leasy can transform your learning.
          </DialogDescription>
        </DialogHeader>
        {/* Replace with your actual embedded video or image */}
        <div className="aspect-video w-full rounded-md overflow-hidden">
          <iframe
            title="Leasy Demo Video"
            src="https://www.youtube.com/embed/VIDEO_ID"
            allowFullScreen
            className="h-full w-full"
          />
        </div>
      </DialogContent>
    </Dialog>
  );
}
