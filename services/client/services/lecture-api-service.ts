import axios from "axios";

const API_URL =
  process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:8000/api";

export interface Video {
  uuid: string;
  preview_image_url: string;
  last_watched_time: number;
  progress_percentages: number;
  is_completed: boolean;
  created_at: string;
}

export interface Lecture {
  uuid: string;
  title: string;
  description: string;
  video: Video;
}

export interface DashboardData {
  total_videos: number;
  overall_progress: number;
  incomplete_videos: number;
  completed_videos: number;
}

export interface GetLecturesResponse {
  dashboard: DashboardData;
  videos: Lecture[];
}

class LectureService {
  async getLectures(
    page: number = 1,
    sortBy: "date" | "name" = "date",
    sortDirection: "asc" | "desc" = "asc",
  ): Promise<GetLecturesResponse> {
    const response = await axios.get(`${API_URL}/lecture`, {
      params: { page, sort_by: sortBy, sort_direction: sortDirection },
      withCredentials: true,
    });
    return response.data.data; // your API returns .data with "dashboard" + "videos"
  }

  async getLectureById(uuid: string): Promise<Lecture> {
    const response = await axios.get(`${API_URL}/lecture/${uuid}`, {
      withCredentials: true,
    });
    return response.data; // adjust if your API is shaped differently
  }

  async createLecture(
    video: File,
    title: string,
    description: string,
    onUploadProgress?: (progressEvent: any) => void,
  ): Promise<void> {
    const formData = new FormData();
    formData.append("video", video);
    formData.append("title", title);
    formData.append("description", description);

    await axios.post(`${API_URL}/lecture`, formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
      withCredentials: true,
      onUploadProgress,
    });
  }
}

export const lectureService = new LectureService();
