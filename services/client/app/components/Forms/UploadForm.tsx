"use client";

import React, { ChangeEvent, useState } from "react";
import Image from "next/image";
import { UploadProcess } from "@/app/constants/enums";
import { Spinner } from "@/app/components/Spinner";

const UploadTemplate = () => {
  return (
    <>
      <div>
        <Image
          src={"/upload.svg"}
          alt={"upload image"}
          width="75"
          height="75"
        />
      </div>
      <p className="mb-2 text-sm text-gray-500 dark:text-gray-400">
        <span className="font-semibold">Click to upload</span> or drag and drop
      </p>
      <p className="text-xs text-gray-500 dark:text-gray-400">
        MP3, MP4 or WebM only, 100MB max
      </p>
    </>
  );
};

export default function UploadForm() {
  const [thumbnail, setThumbnail] = useState<string | null>(null);
  const [isUploading, setIsUploading] = useState<boolean>(false);
  const [didUpload, setDidUpload] = useState<any>(UploadProcess.DIDNT_UPLOAD);

  const handleUpload = (succeed: number) => {
    setDidUpload(succeed);
  };

  const handleFileChange = async (event: ChangeEvent<HTMLInputElement>) => {
    setThumbnail(null);
    const file = event.target.files?.[0];
    if (file && file.type.startsWith("video/")) {
      await uploadFile(file);
    }
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

  const generateThumbnail = async (file: File) => {
    const videoElement = document.createElement("video");
    const canvasElement = document.createElement("canvas");
    const context = canvasElement.getContext("2d");

    videoElement.src = URL.createObjectURL(file);
    videoElement.currentTime = 1;

    videoElement.onloadeddata = () => {
      canvasElement.width = videoElement.videoWidth;
      canvasElement.height = videoElement.videoHeight;
      context?.drawImage(
        videoElement,
        0,
        0,
        canvasElement.width,
        canvasElement.height,
      );
      setThumbnail(canvasElement.toDataURL());
    };
  };

  const uploadFile = async (file: File) => {
    try {
      setIsUploading(true);
      const response = await fetch("/api/upload", {
        method: "POST",
        body: file,
      });
      setIsUploading(false);
      if (response.ok) {
        handleUpload(UploadProcess.UPLOAD_SUCCEED);
        await generateThumbnail(file);
        return true;
      } else {
        handleUpload(UploadProcess.UPLOAD_FAILED);
        return false;
      }
    } catch (error) {
      console.error("Error uploading video:", error);
      alert("Error uploading video.");
    }
  };

  if (isUploading) {
    return (
      <div className="flex justify-center items-center h-52">
        <Spinner />
      </div>
    );
  }

  return (
    <>
      {showUploadProcess()}
      <span className="ml-1">
        <div className="flex justify-center items-center">
          <label
            htmlFor="dropzone-file"
            className="flex flex-col items-center justify-center w-full h-52 border-2 border-gray-300 dark:border-gray-400 border-dashed rounded-lg cursor-pointer bg-gray-50 dark:bg-gray-600"
          >
            <div className="flex flex-col items-center justify-center pt-5 pb-6">
              {thumbnail ? (
                <div>
                  <Image
                    src={thumbnail}
                    alt="Video thumbnail"
                    width={100}
                    height={100}
                    sizes={"50px"}
                    className="max-w-1/2 h-auto"
                  />
                </div>
              ) : (
                <UploadTemplate />
              )}
            </div>
            <input
              id="dropzone-file"
              type="file"
              name="file"
              accept="video/*"
              className="hidden"
              onChange={handleFileChange}
            />
          </label>
        </div>
      </span>
    </>
  );
}
