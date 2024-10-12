"use client";

import React from "react";
import { SettingsProvider, useSettings } from "@/providers/settings-provider";
import { Skeleton } from "@/components/ui/skeleton";

function LoadingWrapper({ children }: { children: React.ReactNode }) {
  const { isLoading } = useSettings();

  if (isLoading) {
    return (
      <div className="space-y-4 p-4">
        <Skeleton className="h-8 w-[250px]" />
        <div className="flex space-x-4">
          <Skeleton className="h-[600px] w-[200px]" />
          <div className="flex-1 space-y-4">
            <Skeleton className="h-12 w-full" />
            <Skeleton className="h-8 w-3/4" />
            <Skeleton className="h-8 w-1/2" />
            <Skeleton className="h-32 w-full" />
            <Skeleton className="h-8 w-3/4" />
            <Skeleton className="h-8 w-1/2" />
            <Skeleton className="h-24 w-full" />
          </div>
        </div>
      </div>
    );
  }

  return <>{children}</>;
}

export default function Layout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <SettingsProvider>
      <div className="flex flex-row flex-1 w-full min-h-screen bg-background py-8">
        <div className="flex-1">
          <LoadingWrapper>{children}</LoadingWrapper>
        </div>
      </div>
    </SettingsProvider>
  );
}
