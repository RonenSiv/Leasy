"use client";

import { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { DragDropFile } from "../drag-drop-file";
import { UploadProgress } from "../upload/upload-progress";
import { useSettings } from "@/context/settings-context";
import { useClient } from "@/hooks/use-client";
import Image from "next/image";
import { api } from "@/app/api";
import toast from "react-hot-toast";

export function UploadForm() {
  const [file, setFile] = useState<File | null>(null);
  const [thumbnail, setThumbnail] = useState<string | null>(null);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [uploading, setUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const abortControllerRef = useRef<AbortController | null>(null);
  const router = useRouter();
  const client = useClient();
  const { reduceMotion } = useSettings();

  useEffect(() => {
    if (!client.user) {
      toast.error("You must be logged in to upload a video");
      router.push("/login");
    }
  }, [client.user, router]);

  const handleFileSelect = (selectedFile: File) => {
    setFile(selectedFile);
    setTitle(selectedFile.name.replace(/\.[^/.]+$/, ""));
    setDescription(
      `This is a video about ${selectedFile.name.replace(/\.[^/.]+$/, "")}. It was uploaded on ${new Date().toLocaleDateString()}.`,
    );

    const reader = new FileReader();
    reader.onload = (e) => {
      const video = document.createElement("video");
      video.preload = "metadata";
      video.onloadedmetadata = () => {
        video.currentTime = 1; // Set to 1 second to avoid black frame
      };
      video.oncanplay = () => {
        const canvas = document.createElement("canvas");
        canvas.width = video.videoWidth;
        canvas.height = video.videoHeight;
        canvas
          .getContext("2d")
          ?.drawImage(video, 0, 0, canvas.width, canvas.height);
        setThumbnail(canvas.toDataURL());
      };
      video.src = e.target?.result as string;
    };
    reader.readAsDataURL(selectedFile);
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    console.log(file, client.user?.uuid);
    if (!file || !client.user?.uuid) {
      toast.error("Please select a file to upload");
      return;
    }

    setUploading(true);
    setUploadProgress(0);
    abortControllerRef.current = new AbortController();

    const formData = new FormData();
    formData.append("video", file);
    formData.append("title", title);
    formData.append("description", description);
    if (thumbnail) {
      const thumbnailBlob = await fetch(thumbnail).then((r) => r.blob());
      formData.append("thumbnail", thumbnailBlob, "thumbnail.jpg");
    }

    try {
      const response = await api.lecture.createLecture(formData, {
        onUploadProgress: (progressEvent) => {
          if (progressEvent.total) {
            const percentCompleted = Math.round(
              (progressEvent.loaded * 100) / progressEvent.total,
            );
            setUploadProgress(percentCompleted);
          }
        },
      });

      await client.fetchLectures?.();

      toast.success("Video uploaded successfully");
      router.push(`/video/${response.data.uuid}`);
    } catch (error) {
      console.error("Upload error:", error);
      toast.error("Failed to upload video. Please try again");
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
        initial={reduceMotion ? {} : { opacity: 0, y: 20 }}
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
                  layout="fill"
                  objectFit="cover"
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
              <p className="text-sm text-muted-foreground">
                Selected file: {file.name}
              </p>
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
