"use client";

import React from "react";
import { File, FileText, XCircle } from "lucide-react";
import { SiGoogledocs } from "react-icons/si";
import { FaFilePdf } from "react-icons/fa6";

interface UploadedFile {
  name: string;
  content: string;
}

interface FileUploadProps {
  uploadedFiles: UploadedFile[];
  removeFile: (index: number) => void;
}

export default function FileUpload({
  uploadedFiles,
  removeFile,
}: FileUploadProps) {
  const getFileIcon = (fileName: string) => {
    const extension = fileName.split(".").pop()?.toLowerCase();
    switch (extension) {
      case "txt":
        return <FileText className="h-6 w-6 text-blue-500" />;
      case "pdf":
        return <FaFilePdf className="h-6 w-6 text-red-500" />;
      case "doc":
      case "docx":
        return <SiGoogledocs className="h-6 w-6 text-blue-700" />;
      default:
        return <File className="h-6 w-6" />;
    }
  };

  const truncateFileName = (name: string, maxLength: number) => {
    if (name.length <= maxLength) return name;
    return name.slice(0, maxLength - 3) + "...";
  };

  return (
    <div className="mt-4 border-t pt-2">
      <h4 className="text-sm font-semibold mb-2">Attached Files:</h4>
      <div className="flex space-x-2 overflow-x-auto">
        {uploadedFiles.map((file, index) => (
          <div
            key={index}
            className="flex-shrink-0 w-24 h-24 bg-gray-100 dark:bg-gray-700 p-2 rounded relative group"
          >
            <div className="flex flex-col items-center justify-center h-full">
              {getFileIcon(file.name)}
              <span
                className="text-xs text-center mt-1 truncate"
                style={{ maxWidth: "100%" }}
              >
                {truncateFileName(file.name, 15)}
              </span>
            </div>
            <button
              className="absolute top-0 right-0 m-1 text-gray-500 hover:text-secondary-foreground"
              onClick={() => removeFile(index)}
            >
              <XCircle className="h-4 w-4" />
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}
