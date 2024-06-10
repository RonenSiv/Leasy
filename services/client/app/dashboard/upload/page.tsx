import React from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import DropZone from "@/app/components/DropZone";
import { LinkSubmission } from "@/components/Forms/LinkSubmission";

export default function Upload() {
  return (
    <section className="flex flex-col items-center justify-center w-full h-full flex-1">
      <Card className="w-full h-full">
        <CardHeader>
          <CardTitle
            className={"text-[#2CA15D] dark:text-[#41e084] text-center"}
          >
            Upload Video
          </CardTitle>
          <CardDescription className={"text-center"}>
            <span>Upload your video to get started</span>
          </CardDescription>
        </CardHeader>
        <CardContent>
          <DropZone />
          <div className="flex items-center justify-center py-16 w-full">
            <hr className="w-full border-t-1 border-gray-300 dark:border-gray-600" />
            <span className="px-4 font-bold bg-transparent text-gray-500 dark:text-gray-400">
              OR
            </span>
            <hr className="w-full border-t-1 border-gray-300 dark:border-gray-600" />
          </div>
          <div className="w-full">
            <LinkSubmission />
          </div>
        </CardContent>
        <CardFooter className="flex justify-between"></CardFooter>
      </Card>
    </section>
  );
}
