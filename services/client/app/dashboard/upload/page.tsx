"use client";
import { Card } from "@/app/components/Card";
import { LinkSubmission } from "@/app/components/LinkSubmission";
import React, { useState } from "react";
import { UploadProcess } from "@/app/constants/enums";
import UploadForm from "@/app/components/UploadForm";

export default function Upload() {
  const [didUpload, setDidUpload] = useState<any>(UploadProcess.DIDNT_UPLOAD);

  const handleUpload = (succeed: number) => {
    console.log(succeed);
    setDidUpload(succeed);
  };

  const showUploadProcess = () => {
    switch (didUpload) {
      case UploadProcess.DIDNT_UPLOAD:
        return null;
      case UploadProcess.UPLOAD_SUCCEED:
        return (
          <div className="text-green-300 dark:text-green-500">
            Upload succeed!
          </div>
        );
      case UploadProcess.UPLOAD_FAILED:
        return (
          <div className="text-red-500 dark:text-red-700">Upload failed!</div>
        );
      default:
        return null;
    }
  };

  return (
    <Card
      title="Upload Video"
      titleColor={["#2CA15D", "#41e084"]}
      className="justify-content-center text-center w-screen dark:text-white"
    >
      <Card bgColor={["#EFFFF6", "#212b3a"]}>
        {showUploadProcess()}
        <span className="ml-1">
          <UploadForm handleUpload={handleUpload} />
        </span>
        <div className="flex items-center justify-center py-16">
          <hr className="w-full border-t-1 border-gray-300 dark:border-gray-600" />
          <span className="px-4 font-bold bg-transparent text-gray-500 dark:text-gray-400">
            OR
          </span>
          <hr className="w-full border-t-1 border-gray-300 dark:border-gray-600" />
        </div>
        <LinkSubmission />
      </Card>
    </Card>
  );
}
