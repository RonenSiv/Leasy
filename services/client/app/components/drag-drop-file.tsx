"use client";

import { useCallback, useState } from "react";
import { useDropzone } from "react-dropzone";
import { Upload } from "lucide-react";

interface DragDropFileProps {
  onFileSelect: (file: File) => void;
}

export function DragDropFile({ onFileSelect }: DragDropFileProps) {
  const [isDragging, setIsDragging] = useState(false);

  const onDrop = useCallback(
    (acceptedFiles: File[]) => {
      if (acceptedFiles.length > 0) {
        const videoFile = acceptedFiles[0];
        if (videoFile.type.startsWith("video/")) {
          onFileSelect(videoFile);
        }
      }
    },
    [onFileSelect],
  );

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      "video/*": [".mp4", ".mov", ".avi", ".mkv"],
    },
    multiple: false,
    onDragEnter: () => setIsDragging(true),
    onDragLeave: () => setIsDragging(false),
    onDropAccepted: () => setIsDragging(false),
  });

  return (
    <div
      {...getRootProps()}
      className={`
        border-2 border-dashed rounded-lg p-8 text-center cursor-pointer
        transition-colors duration-200 ease-in-out
        ${isDragActive || isDragging ? "border-primary bg-primary/10" : "border-border"}
        hover:border-primary hover:bg-primary/5
      `}
    >
      <input {...getInputProps()} />
      <Upload className="w-12 h-12 mx-auto mb-4 text-muted-foreground" />
      <p className="text-lg font-medium mb-2">Drag and drop your video here</p>
      <p className="text-sm text-muted-foreground">or click to select a file</p>
      <p className="text-xs text-muted-foreground mt-2">
        Supported formats: MP4, MOV, AVI, MKV
      </p>
    </div>
  );
}
