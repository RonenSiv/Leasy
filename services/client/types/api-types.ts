export interface User {
  email: string;
  full_name: string;
}

export interface LoginCredentials {
  email: string;
  password: string;
}

export interface RegisterCredentials extends LoginCredentials {
  full_name: string;
}

export interface Video {
  uuid: string;
  preview_image_url: string;
  last_watched_time: number;
  video_duration: number;
  progress_percentages: number;
  is_completed: boolean;
  created_at: string;
  video_url: string;
}

export interface Lecture {
  uuid: string;
  title: string;
  description: string;
  video: Video;
  is_favorite: number;
}

export interface LectureResponse {
  data: {
    dashboard: {
      total_lectures: number;
      overall_progress: number;
      completed_lectures: number;
      incomplete_lectures: number;
      num_of_pages: number;
    };
    lectures: Lecture[];
  };
}

export interface QuizQuestion {
  question_uuid: string;
  question_text: string;
  options: {
    option_index: number;
    option_text: string;
  }[];
}
