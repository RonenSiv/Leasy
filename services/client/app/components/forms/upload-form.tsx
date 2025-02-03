"use client";

import React, { useEffect, useRef, useState } from "react";
import axios from "axios";
import { motion } from "framer-motion";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";

import { useUser } from "@/hooks/use-user"; // optional if you have a user hook
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { DragDropFile } from "../drag-drop-file";
import { UploadProgress } from "../upload/upload-progress";
import Image from "next/image";

/** Optional skeleton for loading states */
function UploadFormSkeleton() {
  return (
    <div className="p-4 border border-dashed rounded-md space-y-2">
      <div className="h-4 w-1/2 bg-gray-200" />
      <div className="h-4 w-1/3 bg-gray-200" />
      <div className="h-4 w-full bg-gray-200" />
    </div>
  );
}

export function UploadForm() {
  // If you have a user hook that ensures they're logged in:
  const { user, isLoading, isError } = useUser();
  const router = useRouter();

  const [file, setFile] = useState<File | null>(null);
  const [thumbnail, setThumbnail] = useState<string | null>(null);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [uploading, setUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);

  const abortControllerRef = useRef<AbortController | null>(null);

  // Avoid hydration mismatch
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);

  // 1) If user is still loading or not mounted => skeleton
  if (!mounted || isLoading) {
    return <UploadFormSkeleton />;
  }

  // 2) If user fetching error or no user => redirect
  if (isError || !user) {
    toast.error("You must be logged in to upload");
    router.push("/login");
    return null;
  }

  // Called when file is dropped or selected
  const handleFileSelect = (selectedFile: File) => {
    setFile(selectedFile);
    setTitle(selectedFile.name.replace(/\.[^/.]+$/, ""));
    setDescription(
      `This is a video about ${selectedFile.name.replace(/\.[^/.]+$/, "")}.`,
    );

    // Optionally generate a thumbnail
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

  // Handle the actual upload
  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (!file) {
      toast.error("No file selected");
      return;
    }

    setUploading(true);
    setUploadProgress(0);
    abortControllerRef.current = new AbortController();

    try {
      // Build FormData
      const formData = new FormData();
      formData.append("video", file);
      formData.append("title", title);
      formData.append("description", description);

      if (thumbnail) {
        const thumbBlob = await fetch(thumbnail).then((r) => r.blob());
        formData.append("thumbnail", thumbBlob, "thumbnail.jpg");
      }

      // Send to our Next.js route, which proxies to the real backend
      // reading the HttpOnly cookie server-side.
      const res = await axios.post("/api/upload", formData, {
        onUploadProgress: (progressEvent) => {
          // Because Next buffers, this may only update once near 100%
          if (progressEvent.total) {
            const percent = Math.round(
              (progressEvent.loaded * 100) / progressEvent.total,
            );
            setUploadProgress(percent);
          }
        },
        signal: abortControllerRef.current.signal,
      });

      // Suppose the backend returns { uuid: ... }
      toast.success("Uploaded successfully");
      console.log(res.data);
      router.push(`/video/${res.data.data.uuid}`);
    } catch (err) {
      console.error("Upload error:", err);
      toast.error("Upload failed");
    } finally {
      setUploading(false);
      setUploadProgress(0);
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
                  src={thumbnail}
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

      <UploadProgress
        open={uploading}
        progress={uploadProgress}
        onCancel={handleCancelUpload}
      />
    </>
  );
}
