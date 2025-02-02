"use client";

import React, { Suspense, useMemo, useState } from "react";
import { useSuspenseQuery } from "@tanstack/react-query";
import { ErrorBoundary } from "react-error-boundary";
import { motion } from "framer-motion";
import Link from "next/link";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { ChevronLeft, ChevronRight, Play } from "lucide-react";
import { useClient } from "@/hooks/use-client";
import { Card, CardContent, CardTitle } from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { EmptyState } from "../components/empty-state";

const baseUrl = process.env.NEXT_PUBLIC_SERVER_URL;

// Helper to format seconds into "mm:ss"
function formatDuration(seconds: any): string {
  const secs = Number(seconds);
  if (isNaN(secs)) return "0:00";
  const mins = Math.floor(secs / 60);
  const secsRem = Math.floor(secs % 60);
  return `${mins}:${secsRem < 10 ? "0" : ""}${secsRem}`;
}

// VideoCard component using shadcn Card and styled similar to YouTube
function VideoCard({
  lectureId,
  title,
  description,
  video,
  computedProgress,
}: {
  lectureId: string;
  title: string;
  description: string;
  video: {
    uuid: string;
    preview_image_url: string;
    created_at: string;
    video_duration: number;
  };
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
            {/* YouTube-style progress bar overlaid at the bottom of the thumbnail */}
            <div className="absolute bottom-0 left-0 right-0">
              <div className="h-1 bg-gray-300">
                <div
                  className="h-full bg-red-600"
                  style={{ width: `${computedProgress}%` }}
                ></div>
              </div>
            </div>
            {/* Video duration box at the bottom right */}
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

// Helper function to fetch all pages and combine videos
async function fetchAllVideos(client: ReturnType<typeof useClient>) {
  const firstPageResponse = await client.getLectures({ page: 1 });
  const firstPageData = firstPageResponse?.data;
  const pageSize = 6;
  const totalVideos = firstPageData?.dashboard.total_videos || 0;
  const totalPages = Math.ceil(totalVideos / pageSize);
  let allVideos = firstPageData?.videos || [];

  if (totalPages > 1) {
    const otherPagePromises = [];
    for (let page = 2; page <= totalPages; page++) {
      otherPagePromises.push(client.getLectures({ page }));
    }
    const otherPagesResults = await Promise.all(otherPagePromises);
    otherPagesResults.forEach((res) => {
      allVideos = allVideos.concat(res.data.videos || []);
    });
  }
  return { videos: allVideos, totalVideos };
}

// Fallback skeleton for video cards grid only
function VideoCardsSkeleton() {
  const ITEMS_PER_PAGE = 6;
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {Array.from({ length: ITEMS_PER_PAGE }).map((_, idx) => (
        <div key={idx} className="h-48 bg-gray-300 rounded animate-pulse" />
      ))}
    </div>
  );
}

// Error fallback UI component
function ErrorFallback({
  error,
  resetErrorBoundary,
}: {
  error: Error;
  resetErrorBoundary: () => void;
}) {
  return (
    <div role="alert" className="p-4 bg-red-100 text-red-800">
      <p>Error loading videos: {error.message}</p>
      <Button onClick={resetErrorBoundary} className="mt-2">
        Try again
      </Button>
    </div>
  );
}

// Pagination component using shadcn Button styles
function Pagination({
  currentPage,
  totalPages,
  onPageChange,
}: {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
}) {
  const windowSize = 3;
  let startPage = Math.max(1, currentPage - 1);
  if (startPage > totalPages - windowSize + 1) {
    startPage = Math.max(1, totalPages - windowSize + 1);
  }
  const pages: number[] = [];
  for (let i = 0; i < windowSize && startPage + i <= totalPages; i++) {
    pages.push(startPage + i);
  }

  return (
    <div className="flex items-center justify-center mt-8 gap-2">
      <Button
        variant="outline"
        onClick={() => onPageChange(Math.max(currentPage - 1, 1))}
        disabled={currentPage === 1}
      >
        <ChevronLeft className="mr-1 h-4 w-4" /> Prev
      </Button>
      {currentPage > 2 && totalPages > windowSize && (
        <>
          <Button variant="outline" onClick={() => onPageChange(1)}>
            1
          </Button>
          {startPage > 2 && <span className="px-2">...</span>}
        </>
      )}
      {pages.map((page) => (
        <Button
          key={page}
          variant="outline"
          onClick={() => onPageChange(page)}
          className={`px-3 py-1 ${
            page === currentPage
              ? "bg-primary text-primary-foreground shadow hover:bg-primary/90"
              : "bg-secondary text-primary-foreground shadow hover:bg-primary/50"
          }`}
        >
          {page}
        </Button>
      ))}
      {startPage + windowSize - 1 < totalPages && totalPages > windowSize && (
        <>
          {startPage + windowSize < totalPages && (
            <span className="px-2">...</span>
          )}
          <Button variant="outline" onClick={() => onPageChange(totalPages)}>
            {totalPages}
          </Button>
        </>
      )}
      <Button
        variant="outline"
        onClick={() => onPageChange(Math.min(currentPage + 1, totalPages))}
        disabled={currentPage === totalPages}
      >
        Next <ChevronRight className="ml-1 h-4 w-4" />
      </Button>
    </div>
  );
}

// Main video content component
function VideosContent() {
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [sortField, setSortField] = useState("date"); // "date" | "name" | "progress"
  const [sortOrder, setSortOrder] = useState("desc"); // "asc" | "desc"
  const client = useClient();
  const itemsPerPage = 6;

  // Fetch all videos from the library (across all pages)
  const { data } = useSuspenseQuery({
    queryKey: ["allLectures"],
    queryFn: async () => {
      if (!client?.getLectures) {
        throw new Error(
          "Not authenticated or getLectures function is not available",
        );
      }
      return fetchAllVideos(client);
    },
  });
  const allVideos = data.videos;

  // Filter videos client-side based on the search term.
  const filteredVideos = useMemo(() => {
    if (!searchTerm) return allVideos;
    return allVideos.filter((video) =>
      video.title.toLowerCase().includes(searchTerm.toLowerCase()),
    );
  }, [searchTerm, allVideos]);

  // Sorting the filtered videos and computing progress percentages if needed
  const sortedVideos = useMemo(() => {
    const videosWithProgress = filteredVideos.map((video) => {
      let progress = video.video.progress_percentages;
      if (progress === undefined || progress === null) {
        if (video.video.last_watched_time && video.video.video_duration) {
          progress =
            (video.video.last_watched_time / video.video.video_duration) * 100;
        } else {
          progress = 0;
        }
      }
      return { ...video, computedProgress: progress };
    });

    return videosWithProgress.sort((a, b) => {
      let compare = 0;
      if (sortField === "date") {
        const dateA = new Date(a.video.created_at);
        const dateB = new Date(b.video.created_at);
        compare = dateA.getTime() - dateB.getTime();
      } else if (sortField === "name") {
        compare = a.title.localeCompare(b.title);
      } else if (sortField === "progress") {
        compare = a.computedProgress - b.computedProgress;
      }
      return sortOrder === "asc" ? compare : -compare;
    });
  }, [filteredVideos, sortField, sortOrder]);

  // Client-side pagination of the sorted list.
  const totalPages = Math.ceil(sortedVideos.length / itemsPerPage);
  const safeCurrentPage = Math.min(currentPage, totalPages || 1);
  const paginatedVideos = useMemo(() => {
    const startIdx = (safeCurrentPage - 1) * itemsPerPage;
    return sortedVideos.slice(startIdx, startIdx + itemsPerPage);
  }, [safeCurrentPage, sortedVideos, itemsPerPage]);

  return (
    <div className="container mx-auto px-4">
      <h1 className="text-3xl font-bold mb-6">Browse Videos</h1>
      <div className="flex flex-col md:flex-row md:items-center md:space-x-4 mb-6">
        <Input
          type="text"
          placeholder="Search videos..."
          value={searchTerm}
          onChange={(e) => {
            setSearchTerm(e.target.value);
            setCurrentPage(1);
          }}
          className="mb-4 md:mb-0"
        />
        <div className="flex space-x-4">
          <Select value={sortField} onValueChange={setSortField}>
            <SelectTrigger className="w-[150px]">
              <SelectValue placeholder="Sort By" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="date">Date</SelectItem>
              <SelectItem value="name">Name</SelectItem>
              <SelectItem value="progress">Progress</SelectItem>
            </SelectContent>
          </Select>
          <Select value={sortOrder} onValueChange={setSortOrder}>
            <SelectTrigger className="w-[150px]">
              <SelectValue placeholder="Order" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="asc">Ascending</SelectItem>
              <SelectItem value="desc">Descending</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>
      {sortedVideos.length === 0 ? (
        <EmptyState />
      ) : (
        <>
          <Suspense fallback={<VideoCardsSkeleton />}>
            <motion.div
              className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.5 }}
            >
              {paginatedVideos.map((video) => (
                <VideoCard
                  key={video.video.uuid}
                  lectureId={video.uuid}
                  title={video.title}
                  description={video.description}
                  video={video.video}
                  computedProgress={video.computedProgress}
                />
              ))}
            </motion.div>
          </Suspense>
          <Pagination
            currentPage={safeCurrentPage}
            totalPages={totalPages}
            onPageChange={setCurrentPage}
          />
        </>
      )}
    </div>
  );
}

export default function BrowsePage() {
  return (
    <ErrorBoundary FallbackComponent={ErrorFallback}>
      <Suspense fallback={<VideoCardsSkeleton />}>
        <VideosContent />
      </Suspense>
    </ErrorBoundary>
  );
}
