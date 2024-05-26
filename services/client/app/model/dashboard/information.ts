export interface DashboardHistoryType {
  video: string;
  date: Date;
  id: string;
}

export const getUserHistory =
  async (): Promise<DashboardHistoryType | null> => {
    return {
      video: "url",
      date: new Date(),
      id: "1",
    };
  };
