import { Suspense } from "react";
import { DashboardClient } from "./dashboard-client";
import { DashboardSkeleton } from "./skeleton";
import { getLectures } from "@/lib/api-server";

export const dynamic = "force-dynamic";

export default async function DashboardPage() {
  const initialData = await getLectures({
    page: 1,
    sortBy: "created_at",
    sortDirection: "desc",
  });

  return (
    <Suspense fallback={<DashboardSkeleton />}>
      <DashboardClient initialData={initialData} />
    </Suspense>
  );
}
