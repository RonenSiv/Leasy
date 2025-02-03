"use client";

import React, { useEffect, useMemo, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { motion } from "framer-motion";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { ChevronLeft, ChevronRight } from "lucide-react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { EmptyState } from "../empty-state";
import { VideoCard } from "@/app/components/browse/video-card";
import { VideoCardSkeleton } from "@/app/components/browse/video-card-skeleton";
import { Lecture } from "@/types";

interface PaginationProps {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
}

function Pagination({
  currentPage,
  totalPages,
  onPageChange,
}: PaginationProps) {
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

interface VideosContentProps {
  initialData: {
    videos: Lecture[];
    totalVideos: number;
  };
}

export function VideosContent({ initialData }: VideosContentProps) {
  const [isMounted, setIsMounted] = useState(false);
  useEffect(() => {
    setIsMounted(true);
  }, []);

  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [sortField, setSortField] = useState("date"); // "date" | "name" | "progress"
  const [sortOrder, setSortOrder] = useState("desc"); // "asc" | "desc"
  const itemsPerPage = 6;

  const { data = initialData } = useQuery({
    queryKey: ["allLectures"],
    queryFn: () => Promise.resolve(initialData),
    initialData: initialData,
  });

  const allVideos = data.videos;

  // Filter videos client-side based on the search term
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

  // Client-side pagination of the sorted list
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
      {isMounted ? (
        sortedVideos.length === 0 ? (
          <EmptyState />
        ) : (
          <>
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
            <Pagination
              currentPage={safeCurrentPage}
              totalPages={totalPages}
              onPageChange={setCurrentPage}
            />
          </>
        )
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {Array.from({ length: itemsPerPage }).map((_, i) => (
            <VideoCardSkeleton key={i} />
          ))}
        </div>
      )}
    </div>
  );
}
