"use client";

import React, { useCallback, useState } from "react";
import { useDropzone } from "react-dropzone";
import { z } from "zod";
import { useForm } from "react-hook-form";
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
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { CheckCircle, File, Upload, X } from "lucide-react";
import { toast } from "sonner";

const MAX_FILE_SIZE = 100 * 1024 * 1024; // 100MB

// Video form schema with custom file validation
const videoSchema = z
  .object({
    file: z
      .any()
      .refine(
        (file) => !file || (file instanceof Blob && file.size <= MAX_FILE_SIZE),
        `Max file size is 100MB.`,
      )
      .optional(),
    link: z.string().url().optional(),
  })
  .refine((data) => data.file || data.link, {
    message: "Either a file or a link must be provided",
  });

type VideoFormData = z.infer<typeof videoSchema>;

export default function VideoUploadPage() {
  const [uploadProgress, setUploadProgress] = useState(0);
  const [isUploading, setIsUploading] = useState(false);
  const [uploadComplete, setUploadComplete] = useState(false);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);

  const {
    register,
    handleSubmit,
    setValue,
    resetField,
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
        setUploadComplete(false); // Reset upload status if a new file is added
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
    resetField("file"); // Clear file field only
    setUploadComplete(false); // Reset upload status when file is removed
  };

  const onSubmit = async (data: VideoFormData) => {
    setIsUploading(true);
    setUploadProgress(0);
    setUploadComplete(false);

    // Simulating file upload with progress
    for (let i = 0; i <= 100; i += 10) {
      await new Promise((resolve) => setTimeout(resolve, 500));
      setUploadProgress(i);
    }

    // Here you would typically handle the actual file upload or process the video link
    console.log("Submitted data:", data);

    setIsUploading(false);
    setUploadComplete(true);
    toast.success(
      "Your video has been successfully uploaded and is being processed.",
    );

    // Reset the form and internal state after successful upload
    reset();
    setSelectedFile(null);
  };

  return (
    <div className="container mx-auto px-4 py-16 bg-background text-foreground">
      <Card className="max-w-2xl mx-auto">
        <CardHeader>
          <CardTitle className="text-3xl font-bold text-center">
            Upload Your Video 🎥
          </CardTitle>
          <CardDescription className="text-center">
            Drag and drop your video file or provide a link to get started with
            Leasy's AI-powered summarization.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Tabs defaultValue="upload">
            <TabsList className="grid w-full grid-cols-2 mb-6">
              <TabsTrigger value="upload">File Upload</TabsTrigger>
              <TabsTrigger value="link">Video Link</TabsTrigger>
            </TabsList>
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
              <TabsContent value="upload">
                <div
                  {...getRootProps()}
                  className={`border-2 border-dashed rounded-lg p-10 text-center cursor-pointer transition-colors ${
                    isDragActive
                      ? "border-primary bg-primary/10"
                      : "border-muted-foreground"
                  }`}
                >
                  <input {...getInputProps()} />
                  {selectedFile ? (
                    <div className="flex items-center justify-center space-x-2">
                      <File className="h-8 w-8 text-primary" />
                      <span className="font-medium">{selectedFile.name}</span>
                      <Button
                        type="button"
                        variant="ghost"
                        size="icon"
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
                      <Upload className="mx-auto h-12 w-12 text-muted-foreground mb-4" />
                      {isDragActive ? (
                        <p>Drop the video here ...</p>
                      ) : (
                        <p>
                          Drag 'n' drop your video here, or click to select a
                          file
                        </p>
                      )}
                    </>
                  )}
                </div>
                {errors.file && (
                  <p className="text-destructive text-sm">
                    {errors.file?.message}
                  </p>
                )}
              </TabsContent>
              <TabsContent value="link">
                <div className="space-y-2">
                  <Label htmlFor="videoLink">Video Link</Label>
                  <Input
                    id="videoLink"
                    type="url"
                    placeholder="https://example.com/your-video"
                    {...register("link")}
                  />
                  {errors.link && (
                    <p className="text-destructive text-sm">
                      {errors.link?.message}
                    </p>
                  )}
                </div>
              </TabsContent>
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
                  <span>Upload complete!</span>
                </div>
              )}
              <Button type="submit" className="w-full" disabled={isUploading}>
                {isUploading ? "Uploading..." : "Start Processing"}
              </Button>
            </form>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  );
}
