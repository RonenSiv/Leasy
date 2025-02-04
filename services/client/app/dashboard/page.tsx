import { DashboardContentWrapper } from "../components/dashboard/dashboard-content-wrapper";
import { getLectures } from "@/app/actions/server-actions";
import { LecturesPreviewResource } from "@/types";

export default async function DashboardPage() {
  const serverData = await getLectures();
  return (
    <DashboardContentWrapper
      fallbackData={serverData.data as unknown as LecturesPreviewResource}
    />
  );
}
