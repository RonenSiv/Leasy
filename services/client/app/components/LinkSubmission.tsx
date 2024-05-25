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
            className="border border-gray-300 rounded-3xl px-6 py-2 mr-4 flex-1 outline-none"
          />
          <button
            type="submit"
            className="bg-white border border-gray-300 text-[#2CA15D] px-6 py-2 rounded-3xl"
          >
            Upload
          </button>
        </div>
        {message && <div className="text-red-500">{message}</div>}
      </div>
    </form>
  );
};
