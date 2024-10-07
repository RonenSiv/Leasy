import React from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";

export default function ChatSkeleton() {
  return (
    <Card className="bg-white dark:bg-gray-800 h-full">
      <CardContent className="p-6 h-full">
        <div className="space-y-4 flex flex-col justify-between h-full">
          {/* Assistant Message */}
          <div>
            <div className="flex space-x-2">
              <Skeleton className="h-10 w-10 rounded-full" />
              <Skeleton className="h-16 w-[80%] rounded-lg" />
            </div>

            {/* Suggestion buttons */}
            <div className="grid grid-cols-2 gap-4 mt-4">
              <Skeleton className="h-12 rounded-md" />
              <Skeleton className="h-12 rounded-md" />
              <Skeleton className="h-12 rounded-md" />
              <Skeleton className="h-12 rounded-md" />
            </div>
          </div>
          {/* Input Field */}
          <div className={"flex flex-col space-y-4"}>
            <div className="mt-6 flex h-full items-center space-x-2">
              <Skeleton className="h-12 w-full rounded-md" />
            </div>

            {/* Settings Button */}
            <div className="mt-2 flex justify-center">
              <Skeleton className="h-4 w-1/3 px-3 rounded-full" />
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
