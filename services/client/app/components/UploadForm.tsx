"use client";

import { ChangeEvent, useState } from "react";
import Image from "next/image";
import { UploadProcess } from "@/app/dashboard/upload/page";
import { Spinner } from "@/app/components/Spinner";
import { IoMdCloudUpload } from "react-icons/io";

export default function UploadForm({
  handleUpload,
}: {
  handleUpload: (arg: UploadProcess) => void;
}) {
  const [thumbnail, setThumbnail] = useState<string | null>(null);
  const [isUploading, setIsUploading] = useState<boolean>(false);
  const handleFileChange = async (event: ChangeEvent<HTMLInputElement>) => {
    setThumbnail(null);
    const file = event.target.files?.[0];
    if (file && file.type.startsWith("video/")) {
      await uploadFile(file);
      generateThumbnail(file);
    }
  };

  const generateThumbnail = (file: File) => {
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
      } else {
        handleUpload(UploadProcess.UPLOAD_FAILED);
      }
    } catch (error) {
      console.error("Error uploading video:", error);
      alert("Error uploading video.");
    }
  };

  return (
    <div className="flex flex-row gap-4">
      <form className="inline-flex flex-col justify-center justify-items-center gap-4">
        <label>
          <div className="flex flex-row gap-2 justify-center items-center text-[#2CA15D] hover:cursor-pointer ">
            <div className="underline">Upload a file</div>
            <IoMdCloudUpload />
          </div>
          <input
            className="hidden"
            type="file"
            name="file"
            accept="video/*"
            onChange={handleFileChange}
          />
        </label>
      </form>
      {isUploading && <Spinner />}
      {thumbnail && (
        <div>
          <Image
            src={thumbnail}
            alt="Video thumbnail"
            width={150}
            height={150}
            className="max-w-full h-auto"
          />
        </div>
      )}
    </div>
  );
}
