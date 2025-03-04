// utils/weeklyProgress.ts

export interface DailyStats {
  timeSpent: number; // in seconds
  watchedVideoIds: string[];
}

export interface WeeklyProgress {
  [day: string]: DailyStats;
}

interface WeeklyData {
  [weekKey: string]: WeeklyProgress;
}

// Returns the current week key, e.g., "2025-W7"
export function getWeekKey(date = new Date()): string {
  const firstDayOfYear = new Date(date.getFullYear(), 0, 1);
  const pastDaysOfYear = (date.getTime() - firstDayOfYear.getTime()) / 86400000;
  const weekNumber = Math.ceil(
    (pastDaysOfYear + firstDayOfYear.getDay() + 1) / 7,
  );
  return `${date.getFullYear()}-W${weekNumber}`;
}

const dayNames = [
  "Sunday",
  "Monday",
  "Tuesday",
  "Wednesday",
  "Thursday",
  "Friday",
  "Saturday",
];

/**
 * Updates the weekly progress stats in localStorage.
 * @param videoId - The ID of the video being watched.
 * @param timeSpent - The amount of time (in seconds) to add to today's total.
 */
export function updateWeeklyProgress({
  videoId,
  timeSpent,
}: {
  videoId: string;
  timeSpent: number;
}) {
  // Retrieve existing data from localStorage
  const storedData = localStorage.getItem("weeklyProgress");
  const weeklyData: WeeklyData = storedData ? JSON.parse(storedData) : {};

  const now = new Date();
  const weekKey = getWeekKey(now);
  const today = dayNames[now.getDay()];

  // Initialize the week if not present
  if (!weeklyData[weekKey]) {
    weeklyData[weekKey] = {};
    dayNames.forEach((day) => {
      weeklyData[weekKey][day] = { timeSpent: 0, watchedVideoIds: [] };
    });
  }

  const todayStats = weeklyData[weekKey][today];

  // Increase the time spent (in seconds)
  todayStats.timeSpent += timeSpent;

  // Only add the videoId if it hasn't been added yet today
  if (videoId && !todayStats.watchedVideoIds?.includes(videoId)) {
    todayStats.watchedVideoIds.push(videoId);
  }

  // Save back to localStorage
  localStorage.setItem("weeklyProgress", JSON.stringify(weeklyData));
}
