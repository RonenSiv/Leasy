import { DashboardContentWrapper } from "../components/dashboard/dashboard-content-wrapper";
import { getLectures } from "@/app/actions/server-actions";

export default async function DashboardPage() {
  const serverData = await getLectures();
  return <DashboardContentWrapper fallbackData={serverData} />;
}
