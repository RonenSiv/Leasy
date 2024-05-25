import { getCurrentSession } from "@/app/model/auth/session-management";

export interface DashboardHistoryType {
  video: string;
  date: Date;
  id: string;
}

export const getUserHistory =
  async (): Promise<DashboardHistoryType | null> => {
    const sessionData = await getCurrentSession();
    if (!sessionData) return null;
    return {
      video: "url",
      date: new Date(),
      id: "1",
    };
  };
