"use client";
import React, { FormEvent, useState } from "react";

export const LinkSubmission = () => {
  const [videoUrl, setVideoUrl] = useState("");
  const [message, setMessage] = useState("");

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    console.log(videoUrl);
    try {
      const response = await fetch("/api/upload-video", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ videoUrl }),
      });

      if (!response.ok) {
        throw new Error("Failed to upload the video");
      }

      const data = await response.json();
      setMessage(data?.message || data?.error || "Unknown error occurred");
    } catch (error: any) {
      setMessage(
        error?.message || "An error occurred while uploading the video",
      );
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <div className="flex flex-col gap-4">
        <div className="flex flex-row">
          <input
            type="text"
            placeholder="Enter video URL"
            value={videoUrl}
            onChange={(e) => setVideoUrl(e.target.value)}
            className="border border-gray-300 dark:border-gray-500 rounded-3xl px-6 py-2 mr-4 flex-1 outline-none bg-white dark:bg-gray-600 text-gray-900 dark:text-gray-100"
          />
          <button
            type="submit"
            className="bg-white bg-action border border-green-300 dark:border-green-700 text-white dark:text-gray-900 px-6 py-2 rounded-3xl hover:bg-green-800 dark:hover:bg-green-500 hover:cursor-pointer"
          >
            Upload
          </button>
        </div>
        {message && (
          <div className="text-red-500 dark:text-red-400">{message}</div>
        )}
      </div>
    </form>
  );
};
