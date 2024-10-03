"use client";

import React, { useCallback, useState } from "react";
import { useDropzone } from "react-dropzone";
import { z } from "zod";
import { Controller, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
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
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { CheckCircle, File as FileIcon, Link, Upload, X } from "lucide-react";
import { toast } from "sonner";

const MAX_FILE_SIZE = 100 * 1024 * 1024; // 100MB

const videoSchema = z
  .object({
    uploadType: z.enum(["file", "link"]),
    file: z.any().optional(),
    link: z.string().url().optional(),
  })
  .refine(
    (data) => {
      if (data.uploadType === "file") {
        return data.file instanceof File && data.file?.size <= MAX_FILE_SIZE;
      } else {
        return typeof data.link === "string" && data.link.length > 0;
      }
    },
    {
      message: "Please provide either a valid file (max 100MB) or a valid link",
      path: ["uploadType"],
    },
  );

type VideoFormData = z.infer<typeof videoSchema>;

export default function VideoUploadPage() {
  const [uploadProgress, setUploadProgress] = useState(0);
  const [isUploading, setIsUploading] = useState(false);
  const [uploadComplete, setUploadComplete] = useState(false);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);

  const {
    register,
    handleSubmit,
    control,
    setValue,
    watch,
    reset,
    formState: { errors },
  } = useForm<VideoFormData>({
    resolver: zodResolver(videoSchema),
    defaultValues: {
      uploadType: "file",
    },
  });

  const uploadType = watch("uploadType");

  const onDrop = useCallback(
    (acceptedFiles: File[]) => {
      if (acceptedFiles[0]) {
        setSelectedFile(acceptedFiles[0]);
        setValue("file", acceptedFiles[0]);
        setValue("uploadType", "file");
        setValue("link", undefined);
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
    setValue("file", undefined);
    setUploadComplete(false);
  };

  const onSubmit = async (data: VideoFormData) => {
    setIsUploading(true);
    setUploadProgress(0);
    setUploadComplete(false);

    for (let i = 0; i <= 100; i += 10) {
      await new Promise((resolve) => setTimeout(resolve, 500));
      setUploadProgress(i);
    }

    console.log("Submitted data:", data);

    setIsUploading(false);
    setUploadComplete(true);
    toast.success(
      "Your video has been successfully uploaded and is being processed.",
    );

    reset();
    setSelectedFile(null);
  };

  return (
    <div className="md:container mx-auto md:px-4 py-8 sm:py-16 bg-background text-foreground">
      <Card className="max-w-2xl mx-auto">
        <CardHeader>
          <CardTitle className="text-2xl sm:text-3xl font-bold text-center">
            Upload Your Video 🎥
          </CardTitle>
          <CardDescription className="text-center text-sm sm:text-base">
            Choose a video file or provide a link to get started with Leasy's
            AI-powered summarization.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
            <Controller
              name="uploadType"
              control={control}
              render={({ field }) => (
                <RadioGroup
                  onValueChange={(value) => {
                    field.onChange(value);
                    if (value === "file") {
                      setValue("link", undefined);
                    } else {
                      setValue("file", undefined);
                      setSelectedFile(null);
                    }
                  }}
                  defaultValue={field.value}
                  className="grid md:grid-cols-2 md:gap-4 grid-cols-1 gap-2"
                >
                  <div>
                    <RadioGroupItem
                      value="file"
                      id="file"
                      className="peer sr-only"
                    />
                    <Label
                      htmlFor="file"
                      className="hover:cursor-pointer flex flex-col items-center justify-between rounded-md border-2 border-muted bg-popover md:p-4 p-2 hover:bg-accent hover:text-accent-foreground peer-data-[state=checked]:border-primary [&:has([data-state=checked])]:border-primary"
                    >
                      <Upload className="mb-3 h-6 w-6" />
                      File Upload
                    </Label>
                  </div>
                  <div>
                    <RadioGroupItem
                      value="link"
                      id="link"
                      className="peer sr-only"
                    />
                    <Label
                      htmlFor="link"
                      className="hover:cursor-pointer flex flex-col items-center justify-between rounded-md border-2 border-muted bg-popover md:p-4 p-2 hover:bg-accent hover:text-accent-foreground peer-data-[state=checked]:border-primary [&:has([data-state=checked])]:border-primary"
                    >
                      <Link className="mb-3 h-6 w-6" />
                      Video Link
                    </Label>
                  </div>
                </RadioGroup>
              )}
            />

            {uploadType === "file" && (
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
            )}

            {uploadType === "link" && (
              <div className="space-y-2">
                <Label htmlFor="videoLink" className="text-sm sm:text-base">
                  Video Link
                </Label>
                <Input
                  id="videoLink"
                  type="url"
                  placeholder="https://example.com/your-video"
                  {...register("link")}
                  className="text-sm sm:text-base"
                />
              </div>
            )}

            {errors.uploadType && (
              <p className="text-destructive text-sm mt-2">
                {errors.uploadType.message}
              </p>
            )}

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
              disabled={isUploading}
            >
              {isUploading ? "Uploading..." : "Start Processing"}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
