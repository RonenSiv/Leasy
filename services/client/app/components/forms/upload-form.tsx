"use client";

import type React from "react";
import { useEffect, useRef, useState } from "react";
import { motion } from "framer-motion";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";
import Image from "next/image";
import { useLectures } from "@/hooks/use-lectures";
import api from "@/lib/api";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import type { UploadProgress as UploadProgressType } from "@/types/components";
import { DragDropFile } from "../drag-drop-file";
import { UploadProgress, type UploadStatus } from "../upload/upload-progress";

function UploadFormSkeleton() {
  return (
    <div className="p-4 border border-dashed rounded-md space-y-2">
      <div className="h-4 w-1/2 bg-gray-200" />
      <div className="h-4 w-1/3 bg-gray-200" />
      <div className="h-4 w-full bg-gray-200" />
    </div>
  );
}

export function VideoUpload() {
  const router = useRouter();
  const { mutate } = useLectures({});

  const [file, setFile] = useState<File | null>(null);
  const [thumbnail, setThumbnail] = useState<string | null>(null);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [uploading, setUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState<UploadProgressType>({
    loaded: 0,
    total: 0,
    percentage: 0,
  });

  const [uploadStatus, setUploadStatus] = useState<UploadStatus>({
    phase: "preparing",
    message: "Preparing your file for upload",
    progress: 0,
  });

  const abortControllerRef = useRef<AbortController | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const slowIncrementIntervalRef = useRef<NodeJS.Timeout | null>(null);
  const processingStageRef = useRef<number>(0);

  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);

  if (!mounted) {
    return <UploadFormSkeleton />;
  }

  const handleFileSelect = (selectedFile: File) => {
    if (selectedFile.type !== "video/mp4") {
      toast.error("Please select a valid .mp4 file");
      if (fileInputRef.current) {
        fileInputRef.current.value = "";
      }
      return;
    }

    setFile(selectedFile);
    setTitle(selectedFile.name.replace(/\.[^/.]+$/, ""));
    setDescription(
      `This is a video about ${selectedFile.name.replace(/\.[^/.]+$/, "")}.`,
    );

    const reader = new FileReader();
    reader.onload = (e) => {
      const video = document.createElement("video");
      video.preload = "metadata";
      video.onloadedmetadata = () => {
        video.currentTime = 1;
      };
      video.oncanplay = () => {
        const canvas = document.createElement("canvas");
        canvas.width = video.videoWidth;
        canvas.height = video.videoHeight;
        canvas.getContext("2d")?.drawImage(video, 0, 0);
        setThumbnail(canvas.toDataURL());
      };
      video.src = e.target?.result as string;
    };
    reader.readAsDataURL(selectedFile);
  };

  const simulateProcessingStages = () => {
    if (slowIncrementIntervalRef.current) {
      clearInterval(slowIncrementIntervalRef.current);
    }

    processingStageRef.current = 0;
    const stages = [
      { phase: "processing", message: "Processing video file", progress: 60 },
      {
        phase: "transcribing",
        message: "Generating transcription",
        progress: 75,
      },
      { phase: "analyzing", message: "Analyzing video content", progress: 85 },
      {
        phase: "finalizing",
        message: "Finalizing and saving your video",
        progress: 95,
      },
    ];

    let baseDelay = 1500; // Start with 1.5 seconds between stages

    const advanceStage = () => {
      if (processingStageRef.current < stages.length) {
        const stage = stages[processingStageRef.current];
        setUploadStatus({
          phase: stage.phase as any,
          message: stage.message,
          progress: stage.progress,
        });
        setUploadProgress((prev) => ({ ...prev, percentage: stage.progress }));
        processingStageRef.current++;

        baseDelay += 500;

        setTimeout(advanceStage, baseDelay);
      }
    };

    setTimeout(advanceStage, 1000);
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (!file || !title || !description) {
      toast.error("Please fill in all fields and select a video file");
      return;
    }

    setUploading(true);
    setUploadProgress({ loaded: 0, total: 0, percentage: 0 });
    setUploadStatus({
      phase: "preparing",
      message: "Preparing your file for upload",
      progress: 0,
    });
    abortControllerRef.current = new AbortController();

    const formData = new FormData();
    formData.append("title", title);
    formData.append("description", description);
    formData.append("video", file);

    if (thumbnail) {
      const thumbBlob = await fetch(thumbnail).then((r) => r.blob());
      formData.append("thumbnail", thumbBlob, "thumbnail.jpg");
    }

    try {
      setUploadStatus({
        phase: "uploading",
        message: "Starting upload to server",
        progress: 0,
      });

      const response = await api.post("/lecture", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
        onUploadProgress: (progressEvent) => {
          const total = progressEvent.total || 0;
          const loaded = progressEvent.loaded || 0;
          const computedPercentage = Math.round((loaded * 100) / total);

          // Cap upload percentage at 50% - the rest will be for processing
          const cappedPercentage = Math.min(computedPercentage, 50);

          // Update upload status messages based on progress
          let uploadMessage = "Uploading video file";
          if (computedPercentage < 10) {
            uploadMessage = "Starting upload to server";
          } else if (computedPercentage < 25) {
            uploadMessage = "Uploading video data";
          } else if (computedPercentage < 40) {
            uploadMessage = "Uploading video content";
          } else {
            uploadMessage = "Finalizing upload";
          }

          // Update both the detailed status and the legacy progress
          setUploadStatus({
            phase: "uploading",
            message: uploadMessage,
            progress: cappedPercentage,
          });

          setUploadProgress({
            loaded,
            total,
            percentage: cappedPercentage,
          });

          // When upload reaches 50%, start simulating processing stages
          if (computedPercentage >= 50 && processingStageRef.current === 0) {
            simulateProcessingStages();
          }
        },
        signal: abortControllerRef.current.signal,
      });

      // Clear any intervals and set progress to 100%
      if (slowIncrementIntervalRef.current) {
        clearInterval(slowIncrementIntervalRef.current);
        slowIncrementIntervalRef.current = null;
      }

      // Set final status
      setUploadStatus({
        phase: "finalizing",
        message: "Upload complete! Redirecting...",
        progress: 100,
      });
      setUploadProgress((prev) => ({ ...prev, percentage: 100 }));

      // Reset form fields
      setTitle("");
      setDescription("");
      setFile(null);
      setThumbnail(null);
      if (fileInputRef.current) {
        fileInputRef.current.value = "";
      }
      await mutate();
      toast.success(response.data.message);

      // Short delay before redirect to show completion message
      setTimeout(() => {
        router.push(`/video/${response.data.data.uuid}`);
      }, 1000);
    } catch (error) {
      console.error("Upload failed:", error);
      toast.error("Failed to upload video. Please try again.");
    } finally {
      setUploading(false);
      setUploadProgress({ loaded: 0, total: 0, percentage: 0 });
      setUploadStatus({
        phase: "preparing",
        message: "Preparing your file for upload",
        progress: 0,
      });
    }
  };

  const handleCancelUpload = () => {
    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
    }

    if (slowIncrementIntervalRef.current) {
      clearInterval(slowIncrementIntervalRef.current);
      slowIncrementIntervalRef.current = null;
    }
  };

  return (
    <>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-4">
            <Label>Video File</Label>
            {thumbnail ? (
              <div className="relative w-full h-40">
                <Image
                  src={thumbnail || "/placeholder.svg"}
                  alt="Video thumbnail"
                  fill
                  style={{ objectFit: "cover" }}
                  className="rounded-md"
                />
                <Button
                  type="button"
                  variant="secondary"
                  size="sm"
                  className="absolute top-2 right-2"
                  onClick={() => {
                    setFile(null);
                    setThumbnail(null);
                    if (fileInputRef.current) {
                      fileInputRef.current.value = "";
                    }
                  }}
                >
                  Change
                </Button>
              </div>
            ) : (
              <DragDropFile onFileSelect={handleFileSelect} />
            )}
            {file && (
              <p className="text-sm text-muted-foreground">{file.name}</p>
            )}
          </div>

          <div>
            <Label htmlFor="title">Title</Label>
            <Input
              type="text"
              id="title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              required
            />
          </div>

          <div>
            <Label htmlFor="description">Description</Label>
            <Input
              type="text"
              id="description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              required
            />
          </div>

          <Button
            type="submit"
            disabled={!file || uploading}
            className="w-full"
          >
            {uploading ? "Uploading..." : "Upload Video"}
          </Button>
        </form>
      </motion.div>

      {/* Pass the detailed upload status to the UploadProgress component */}
      <UploadProgress
        open={uploading}
        status={uploadStatus}
        onCancel={handleCancelUpload}
      />
    </>
  );
}
