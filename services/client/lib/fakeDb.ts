interface User {
  id: string;
  name: string;
  email: string;
  password: string;
}

interface Video {
  id: string;
  title: string;
  description: string;
  video_url: string;
  thumbnail: string;
  transcription?: string;
  summary?: string;
  user_id: string;
  created_at: string;
}

const users: User[] = [
  {
    id: "1",
    name: "John Doe",
    email: "john@example.com",
    password: "password123",
  },
  {
    id: "2",
    name: "Jane Smith",
    email: "jane@example.com",
    password: "password456",
  },
  {
    id: "3",
    name: "Default User",
    email: "default@example.com",
    password: "defaultpass",
  },
];

const videos: Video[] = [
  {
    id: "1",
    title: "Introduction to React Hooks",
    description:
      "Learn the basics of React Hooks and how to use them in your applications",
    video_url: "https://example.com/sample-video.mp4",
    thumbnail: "/placeholder.svg?height=200&width=300",
    transcription:
      "Today we're going to learn about React Hooks. Hooks are a feature introduced in React 16.8 that allow you to use state and other React features without writing a class component...",
    summary:
      "This video covers the fundamentals of React Hooks, including useState, useEffect, and custom hooks. It provides practical examples and best practices for using hooks in React applications.",
    user_id: "1",
    created_at: new Date().toISOString(),
  },
  {
    id: "2",
    title: "Advanced TypeScript Patterns",
    description: "Deep dive into advanced TypeScript patterns and techniques",
    video_url: "https://example.com/sample-video-2.mp4",
    thumbnail: "/placeholder.svg?height=200&width=300",
    transcription:
      "In this advanced TypeScript tutorial, we'll explore complex patterns like mapped types, conditional types, and template literal types...",
    summary:
      "An in-depth look at advanced TypeScript patterns, including type manipulation, generics, and practical examples of complex type definitions.",
    user_id: "2",
    created_at: new Date().toISOString(),
  },
];

export const fakeDb = {
  users,
  findUserByEmail: (email: string) =>
    users.find((user) => user.email === email),
  addUser: (user: Omit<User, "id">) => {
    const newUser = { ...user, id: (users.length + 1).toString() };
    users.push(newUser);
    return newUser;
  },
  getAllVideos: () => videos,
  getVideoById: (id: string) => videos.find((video) => video.id === id),
  getUserVideos: (userId: string) =>
    videos.filter((video) => video.user_id === userId),
  addVideo: (video: Omit<Video, "id" | "created_at">) => {
    const newVideo = {
      ...video,
      id: (videos.length + 1).toString(),
      created_at: new Date().toISOString(),
    };
    videos.push(newVideo);
    return newVideo;
  },
};
