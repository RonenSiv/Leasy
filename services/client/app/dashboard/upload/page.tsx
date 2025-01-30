"use client";

import React, { useCallback, useState } from "react";
import { useDropzone } from "react-dropzone";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Label } from "@/components/ui/label";
import { CheckCircle, FileIcon, Upload, X } from "lucide-react";
import { toast } from "sonner";
import { lectureService } from "@/services/video-service";

const MAX_FILE_SIZE = 100 * 1024 * 1024; // 100MB

const videoSchema = z.object({
  file: z.instanceof(File).refine((file) => file.size <= MAX_FILE_SIZE, {
    message: "File size must be less than 100MB",
  }),
  title: z.string().min(1, "Title is required"),
  description: z.string().min(1, "Description is required"),
});

type VideoFormData = z.infer<typeof videoSchema>;

export default function VideoUploadPage() {
  const router = useRouter();
  const [uploadProgress, setUploadProgress] = useState(0);
  const [isUploading, setIsUploading] = useState(false);
  const [uploadComplete, setUploadComplete] = useState(false);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    reset,
    formState: { errors },
  } = useForm<VideoFormData>({
    resolver: zodResolver(videoSchema),
  });

  const onDrop = useCallback(
    (acceptedFiles: File[]) => {
      if (acceptedFiles[0]) {
        setSelectedFile(acceptedFiles[0]);
        setValue("file", acceptedFiles[0]);
        setUploadComplete(false);
      }
    },
    [setValue],
  );

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: { "video/*": [] },
    multiple: false,
  });

  const removeFile = () => {
    setSelectedFile(null);
    // @ts-ignore - setValue accepts undefined as a valid value
    setValue("file", undefined);
    setUploadComplete(false);
  };

  const onSubmit = async (data: VideoFormData) => {
    setIsUploading(true);
    setUploadProgress(0);
    setUploadComplete(false);

    try {
      await lectureService.createLecture(
        data.file,
        data.title,
        data.description,
        (progressEvent) => {
          const percentCompleted = Math.round(
            (progressEvent.loaded * 100) / progressEvent.total,
          );
          setUploadProgress(percentCompleted);
        },
      );
      setUploadComplete(true);
      toast.success(
        "Your video has been successfully uploaded and is being processed.",
      );
      router.push("/dashboard/video");
      reset();
      setSelectedFile(null);
    } catch (error: any) {
      toast.error(error.message || "Failed to upload video. Please try again.");
      console.error("Upload error:", error);
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <div className="md:container mx-auto md:px-4 py-8 sm:py-16 bg-background text-foreground">
      <Card className="max-w-2xl mx-auto">
        <CardHeader>
          <CardTitle className="text-2xl sm:text-3xl font-bold text-center">
            Upload Your Video 🎥
          </CardTitle>
          <CardDescription className="text-center text-sm sm:text-base">
            Upload a video file to get started with Leasy's AI-powered
            summarization.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
            <div
              {...getRootProps()}
              className={`border-2 border-dashed rounded-lg p-6 sm:p-20 text-center cursor-pointer transition-colors ${
                isDragActive
                  ? "border-primary bg-primary/10"
                  : "border-muted-foreground"
              }`}
            >
              <input {...getInputProps()} />
              {selectedFile ? (
                <div className="flex items-center justify-center space-x-2">
                  <FileIcon className="h-6 w-6 sm:h-8 sm:w-8 text-primary" />
                  <span className="font-medium text-sm sm:text-base truncate max-w-[200px]">
                    {selectedFile.name}
                  </span>
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    onClick={(e) => {
                      e.stopPropagation();
                      removeFile();
                    }}
                  >
                    <X className="h-4 w-4" />
                  </Button>
                </div>
              ) : (
                <>
                  <Upload className="mx-auto h-8 w-8 sm:h-12 sm:w-12 text-muted-foreground mb-2 sm:mb-4" />
                  <p className="text-sm sm:text-base">
                    {isDragActive
                      ? "Drop the video here ..."
                      : "Drag and drop your video here, or click to browse"}
                  </p>
                </>
              )}
            </div>
            {errors.file && (
              <p className="text-destructive text-sm mt-2">
                {errors.file.message}
              </p>
            )}

            <div className="space-y-2">
              <Label htmlFor="title" className="text-sm sm:text-base">
                Title
              </Label>
              <Input
                id="title"
                type="text"
                {...register("title")}
                className="text-sm sm:text-base"
              />
              {errors.title && (
                <p className="text-destructive text-sm mt-2">
                  {errors.title.message}
                </p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="description" className="text-sm sm:text-base">
                Description
              </Label>
              <Input
                id="description"
                type="text"
                {...register("description")}
                className="text-sm sm:text-base"
              />
              {errors.description && (
                <p className="text-destructive text-sm mt-2">
                  {errors.description.message}
                </p>
              )}
            </div>

            {isUploading && (
              <div className="space-y-2">
                <Progress value={uploadProgress} className="w-full" />
                <p className="text-sm text-center">
                  {uploadProgress}% uploaded
                </p>
              </div>
            )}

            {uploadComplete && (
              <div className="flex items-center justify-center text-primary space-x-2">
                <CheckCircle className="h-5 w-5" />
                <span className="text-sm sm:text-base">Upload complete!</span>
              </div>
            )}

            <Button
              type="submit"
              className="w-full text-sm sm:text-base"
              disabled={isUploading || !selectedFile}
            >
              {isUploading ? "Uploading..." : "Start Processing"}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
