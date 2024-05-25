import { getUserHistory } from "@/app/model/dashboard/information";
import { redirect } from "next/navigation";

export default async function Dashboard() {
  const userHistory = await getUserHistory();

  if (userHistory) {
    redirect("dashboard/upload");
  }
}
