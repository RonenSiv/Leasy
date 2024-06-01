import { Card } from "@/app/components/Cards/Card";
import { LinkSubmission } from "@/app/components/LinkSubmission";
import React from "react";
import UploadForm from "@/app/components/Forms/UploadForm";

export default function Upload() {
  return (
    <Card
      title="Upload Video"
      className="justify-content-center text-center w-screen"
      titleColor={"text-[#2CA15D] dark:text-[#41e084]"}
    >
      <Card bgColor="bg-[#EFFFF6] dark:bg-[#212b3a]">
        <UploadForm />
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
