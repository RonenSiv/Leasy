"use client";

import { DashboardContent } from "@/app/components/dashboard/dashboard-content";
import { useClient } from "@/hooks/use-client";

export function DashboardContentWrapper() {
  const client = useClient();

  if (client.isLoading || client.lecturesLoading) {
    throw new Promise((resolve) => {
      setTimeout(resolve, 1000);
    });
  }

  if (client.lectures) {
    client.fetchLectures?.();
  }

  if (!client.isLoading && !client.user) {
    return null;
  }

  return (
    <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-10">
      <DashboardContent />
    </div>
  );
}
