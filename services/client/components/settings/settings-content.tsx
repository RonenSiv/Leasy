"use client";

import { useSettings } from "@/providers/settings-provider";
import { Skeleton } from "@/components/ui/skeleton";
import React from "react";

export const SettingsContent = () => {
  const { contentOfSelectedOption, isLoading } = useSettings();

  if (isLoading) {
    return (
      <div className="flex flex-1 w-full h-full px-4 space-y-4">
        <Skeleton className="w-full h-12" />
        <Skeleton className="w-3/4 h-8" />
        <Skeleton className="w-1/2 h-8" />
        <Skeleton className="w-full h-32" />
        <Skeleton className="w-3/4 h-8" />
        <Skeleton className="w-1/2 h-8" />
        <Skeleton className="w-full h-24" />
      </div>
    );
  }

  return (
    <div className="flex flex-1 w-full h-full px-4">
      {contentOfSelectedOption() || <div>Work in progress</div>}
    </div>
  );
};
