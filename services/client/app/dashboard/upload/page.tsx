"use client";
import { Card } from "@/app/components/Card";
import Image from "next/image";
import UploadForm from "@/app/components/UploadForm";
import { LinkSubmission } from "@/app/components/LinkSubmission";
import { useState } from "react";

export enum UploadProcess {
  DIDNT_UPLOAD,
  UPLOAD_SUCCEED,
  UPLOAD_FAILED,
}

export default function Upload() {
  const [didUpload, setDidUpload] = useState<UploadProcess>(
    UploadProcess.DIDNT_UPLOAD,
  );
  const handleUpload = (succeed: UploadProcess) => {
    console.log(succeed);
    setDidUpload(succeed);
  };

  const showUploadProcess = () => {
    switch (didUpload) {
      case UploadProcess.DIDNT_UPLOAD:
        return null;
      case UploadProcess.UPLOAD_SUCCEED:
        return <div className="text-green-300">Upload succeed!</div>;
      case UploadProcess.UPLOAD_FAILED:
        return <div className="text-red-500">Upload failed!</div>;
    }
  };

  return (
    <Card
      title="Upload Video"
      titleColor="#2CA15D"
      className="justify-content-center text-center w-screen"
      maxWidth="5xl"
    >
      <Card className="bg-[#EFFFF6]" maxWidth="5xl">
        {showUploadProcess()}
        <div className="flex flex-col justify-items-center py-10">
          <div className="flex justify-center items-center">
            <div>
              <Image
                src={"/upload.svg"}
                alt={"upload image"}
                width="75"
                height="75"
              />
            </div>
            <div className="text-gray-400">Drag a video here or</div>
            <span className="ml-1">
              <UploadForm handleUpload={handleUpload} />
            </span>
          </div>
          <div className="flex items-center justify-center py-16">
            <hr className="w-full border-t-1 border-gray-300" />
            <span className="px-4 font-bold bg-transparent text-gray-500">
              OR
            </span>
            <hr className="w-full border-t-1 border-gray-300" />
          </div>
          <LinkSubmission />
        </div>
      </Card>
    </Card>
  );
}
