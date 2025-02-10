"use client";

import React, { useEffect, useRef, useState } from "react";
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
import { UploadProgress } from "../upload/upload-progress";

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
  // New state for status text below the percentage
  const [uploadStatus, setUploadStatus] = useState("Uploading video");

  const abortControllerRef = useRef<AbortController | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  // Ref to store the slow increment interval
  const slowIncrementIntervalRef = useRef<NodeJS.Timeout | null>(null);

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

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (!file || !title || !description) {
      toast.error("Please fill in all fields and select a video file");
      return;
    }

    setUploading(true);
    setUploadProgress({ loaded: 0, total: 0, percentage: 0 });
    setUploadStatus("Uploading video");
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
      const response = await api.post("/lecture", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
        onUploadProgress: (progressEvent) => {
          const total = progressEvent.total || 0;
          const loaded = progressEvent.loaded || 0;
          let computedPercentage = Math.round((loaded * 100) / total);

          // If not fully uploaded yet, update normally
          if (computedPercentage < 100) {
            // Clear any existing slow increment interval if new progress comes in
            if (slowIncrementIntervalRef.current) {
              clearInterval(slowIncrementIntervalRef.current);
              slowIncrementIntervalRef.current = null;
            }
            setUploadStatus("Uploading video");
            setUploadProgress({
              loaded,
              total,
              percentage: computedPercentage,
            });
          } else {
            // When upload is done client-side, switch to "Processing video"
            setUploadStatus("Processing video");
            // Start a slow increment if not already started
            let timeout = 500;
            if (!slowIncrementIntervalRef.current) {
              slowIncrementIntervalRef.current = setInterval(() => {
                timeout += 50;
                setUploadProgress((prev) => {
                  let newPerc = prev.percentage + 1;
                  if (newPerc >= 98) {
                    newPerc = 98;
                    if (slowIncrementIntervalRef.current) {
                      clearInterval(slowIncrementIntervalRef.current);
                      slowIncrementIntervalRef.current = null;
                    }
                  }
                  return { ...prev, percentage: newPerc };
                });
              }, timeout);
            }
          }
        },
        signal: abortControllerRef.current.signal,
      });

      // Clear slow increment (if still running) and force progress to 100%
      if (slowIncrementIntervalRef.current) {
        clearInterval(slowIncrementIntervalRef.current);
        slowIncrementIntervalRef.current = null;
      }
      setUploadProgress((prev) => ({ ...prev, percentage: 100 }));
      // Update status text to indicate processing is done
      setUploadStatus("Processing video");

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
      router.push(`/video/${response.data.data.uuid}`);
    } catch (error) {
      console.error("Upload failed:", error);
      toast.error("Failed to upload video. Please try again.");
    } finally {
      setUploading(false);
      setUploadProgress({ loaded: 0, total: 0, percentage: 0 });
      setUploadStatus("Uploading video");
    }
  };

  const handleCancelUpload = () => {
    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
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

      {/* Pass both the progress percentage and status text to your UploadProgress component */}
      <UploadProgress
        open={uploading}
        progress={uploadProgress.percentage}
        status={uploadStatus}
        onCancel={handleCancelUpload}
      />
    </>
  );
}
