"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { Card, CardContent, CardTitle } from "@/components/ui/card";
import { Play } from "lucide-react";
import React from "react";
import { Video } from "@/types";

const baseUrl = process.env.NEXT_PUBLIC_SERVER_URL;

function formatDuration(seconds: any): string {
  const secs = Number(seconds);
  if (isNaN(secs)) return "0:00";
  const mins = Math.floor(secs / 60);
  const secsRem = Math.floor(secs % 60);
  return `${mins}:${secsRem < 10 ? "0" : ""}${secsRem}`;
}

export function VideoCard({
  lectureId,
  title,
  description,
  video,
  computedProgress,
}: {
  lectureId: string;
  title: string;
  description: string;
  video: Video;
  computedProgress: number;
}) {
  return (
    <Link href={`/video/${lectureId}`}>
      <motion.div whileHover={{ scale: 1.05 }} className="cursor-pointer">
        <Card className="group overflow-hidden">
          <div className="relative">
            <img
              src={`${baseUrl}${video.preview_image_url}`}
              alt={title}
              className="w-full h-48 object-cover"
            />
            {/* Play icon appears on hover */}
            <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
              <Play className="w-12 h-12 text-white" />
            </div>
            {/* YouTube-style progress bar */}
            <div className="absolute bottom-0 left-0 right-0">
              <div className="h-1 bg-gray-300">
                <div
                  className="h-full bg-red-600"
                  style={{ width: `${computedProgress}%` }}
                ></div>
              </div>
            </div>
            {/* Video duration */}
            <div className="absolute bottom-1 right-1 bg-black bg-opacity-75 px-1 py-0.5 text-xs text-white rounded">
              {formatDuration(video.video_duration)}
            </div>
          </div>
          <CardContent className="p-2">
            <CardTitle className="text-sm font-semibold line-clamp-2">
              {title}
            </CardTitle>
            <p className="text-xs text-gray-500 line-clamp-2">{description}</p>
            <p className="text-xs text-gray-400">
              {new Date(video.created_at).toLocaleDateString()}
            </p>
          </CardContent>
        </Card>
      </motion.div>
    </Link>
  );
}
