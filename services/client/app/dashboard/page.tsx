import { Suspense } from "react";
import { DashboardSkeleton } from "./skeleton";
import { DashboardContentWrapper } from "../components/dashboard/dashboard-content-wrapper";

export default function Dashboard() {
  return (
    <Suspense fallback={<DashboardSkeleton />}>
      <DashboardContentWrapper />
    </Suspense>
  );
}
