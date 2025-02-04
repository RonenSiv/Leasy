interface ChatResource {
  uuid: string;
  title: string;
}

interface VideoResource {
  uuid: string;
  video_url: string;
  preview_image_url: string;
  last_watched_time: number | null;
  progress: number | null;
  video_duration: number;
}

interface QuizResource {
  uuid: string;
  title: string;
  score: number;
}

interface MessageResource {
  sender: string;
  message: string;
  sent_at: string;
}

interface QuestionResource {
  question_uuid: string;
  question_text: string;
  options: {
    option_index: number;
    option_text: string;
  }[];
}

export interface LectureResource {
  uuid: string;
  title: string;
  description: string;
  user: string;
  video: VideoResource;
  transcription: string;
  summary: string;
  quiz: QuizResource;
  chat: ChatResource;
}

export interface LecturesPreviewResource {
  dashboard: DashboardResource;
  videos: VideoPreviewResource[];
}

export interface DashboardResource {
  total_videos: number;
  overall_progress: number;
  completed_videos: number;
  incomplete_videos: number;
  num_of_pages: number;
}

export interface VideoPreviewResource {
  uuid: string;
  title: string;
  description: string;
  video: {
    uuid: string;
    preview_image_url: string;
    last_watched_time: number;
    video_duration: number;
    progress_percentages: number;
    is_completed: boolean;
    created_at: string;
  };
}

export interface User {
  uuid: string;
  full_name: string;
  email: string;
  phone_number: string;
  lectures: Lecture[];
  videoUserProgress: VideoUserProgress[];
}

type VideoUserProgress = {
  video_id: string;
  user_id: string;
  last_watched_time: number;
  progress: number;
};

export interface Video {
  uuid: string;
  preview_image_url: string;
  last_watched_time: number;
  video_duration: number;
  progress_percentages: number;
  is_completed: boolean;
  created_at: string;
}

export interface Lecture {
  uuid: string;
  title: string;
  description: string;
  user_id: string;
  video_id: string;
  chat_id: string;
  quiz_id: string;
  transcription: string;
  summary: string;
  user: User;
  video: Video;
  chat: Chat;
  quiz: Quiz;
}

export type Chat = {
  uuid: string;
  title: string;
  messages: Message[];
  lectures: Lecture[];
};

export type Message = {
  chat_id: string;
  sender: string;
  message: string;
};

export type Quiz = {
  uuid: string;
  title: string;
  score: number;
  questions: Question[];
  lecture: Lecture[];
};

export type Question = {
  uuid: string;
  quiz_id: string;
  question_text: string;
  questionOptions: QuestionOption[];
};

export type QuestionOption = {
  question_id: string;
  option_index: number;
  option_text: string;
  is_correct: boolean;
};

export interface CreateLectureResponse {
  data: {
    uuid: string;
  };
}

export interface CreateLectureResponse {
  data: {
    uuid: string;
  };
}
