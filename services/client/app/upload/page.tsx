"use client";

import { useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/context/auth-context";
import { motion } from "framer-motion";
import toast from "react-hot-toast";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { DragDropFile } from "../components/drag-drop-file";
import { UploadProgress } from "../components/upload/upload-progress";
import { useSettings } from "@/context/settings-context";

export default function Upload() {
  const [file, setFile] = useState<File | null>(null);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [uploading, setUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const abortControllerRef = useRef<AbortController | null>(null);
  const router = useRouter();
  const { user } = useAuth();
  const { reduceMotion } = useSettings();

  const handleFileSelect = (selectedFile: File) => {
    setFile(selectedFile);
    // Set default title to file name without extension
    setTitle(selectedFile.name.replace(/\.[^/.]+$/, ""));
    // Generate a default description
    setDescription(
      `This is a video about ${selectedFile.name.replace(/\.[^/.]+$/, "")}. It was uploaded on ${new Date().toLocaleDateString()}.`,
    );
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!file || !user) return;

    setUploading(true);
    setUploadProgress(0);
    abortControllerRef.current = new AbortController();

    const formData = new FormData();
    formData.append("video", file);
    formData.append("title", title);
    formData.append("description", description);

    try {
      // Simulate upload progress
      const interval = setInterval(() => {
        setUploadProgress((prev) => {
          if (prev >= 100) {
            clearInterval(interval);
            return 100;
          }
          return prev + 1;
        });
      }, 100);

      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/api/lecture`,
        {
          method: "POST",
          body: formData,
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
          signal: abortControllerRef.current.signal,
        },
      );

      clearInterval(interval);

      if (!response.ok) {
        throw new Error("Upload failed");
      }

      const data = await response.json();
      toast.success("Video uploaded successfully!");
      router.push(`/dashboard?videoId=${data.uuid}`);
    } catch (error) {
      if (error instanceof Error) {
        if (error.name === "AbortError") {
          toast.error("Upload cancelled");
        } else {
          console.error("Error uploading video:", error);
          toast.error("Failed to upload video. Please try again.");
        }
      }
    } finally {
      setUploading(false);
      setUploadProgress(0);
      abortControllerRef.current = null;
    }
  };

  const handleCancelUpload = () => {
    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
    }
  };

  if (!user) {
    router.push("/login");
    return null;
  }

  return (
    <>
      <motion.div
        className="max-w-2xl mx-auto mt-10 px-4"
        initial={reduceMotion ? {} : { opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <Card>
          <CardHeader>
            <CardTitle className="text-3xl font-bold">Upload a Video</CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="space-y-4">
                <Label>Video File</Label>
                <DragDropFile onFileSelect={handleFileSelect} />
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
          </CardContent>
        </Card>
      </motion.div>

      <UploadProgress
        open={uploading}
        progress={uploadProgress}
        onCancel={handleCancelUpload}
      />
    </>
  );
}
