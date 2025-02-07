"use client";

import React, { Suspense, useEffect, useState } from "react";
import { motion } from "framer-motion";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Pagination } from "./pagination";
import { VideoCardSkeleton } from "@/app/components/browse/video-card-skeleton";
import { useLectures } from "@/hooks/use-lectures";
import { EmptyState } from "../empty-state";
import type { Lecture } from "@/types/api-types";
import { VideoCard } from "@/app/components/video-card";

export function VideosContent() {
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);

  const [searchTerm, setSearchTerm] = useState("");
  const [debouncedSearchTerm, setDebouncedSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [sortField, setSortField] = useState<"date" | "name" | "progress">(
    "date",
  );
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("desc");
  const [totalPages, setTotalPages] = useState(1);

  // Debounce the search term: update after 300ms delay
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearchTerm(searchTerm);
      setCurrentPage(1);
    }, 300);
    return () => clearTimeout(timer);
  }, [searchTerm]);

  return (
    <div className="container mx-auto px-4">
      <h1 className="text-3xl font-bold mb-6">Browse Videos</h1>

      {/* Search + sort controls */}
      <div className="flex flex-col md:flex-row md:items-center md:space-x-4 mb-6">
        <Input
          type="text"
          placeholder="Search videos..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="mb-4 md:mb-0"
        />
        <div className="flex space-x-4">
          <Select
            value={sortField}
            onValueChange={(val) => {
              setSortField(val as "date" | "name" | "progress");
              setCurrentPage(1);
            }}
          >
            <SelectTrigger className="w-[150px]">
              <SelectValue placeholder="Sort By" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="date">Date</SelectItem>
              <SelectItem value="name">Name</SelectItem>
              <SelectItem value="progress">Progress</SelectItem>
            </SelectContent>
          </Select>

          <Select
            value={sortOrder}
            onValueChange={(val) => {
              setSortOrder(val as "asc" | "desc");
              setCurrentPage(1);
            }}
          >
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

      {/* Videos grid wrapped in Suspense */}
      <Suspense
        fallback={
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-6">
            {[...Array(6)].map((_, i) => (
              <VideoCardSkeleton key={i} />
            ))}
          </div>
        }
      >
        {mounted && (
          <VideoGrid
            page={currentPage}
            search={debouncedSearchTerm}
            sortField={sortField}
            sortOrder={sortOrder}
            onUpdateTotalPages={setTotalPages}
          />
        )}
      </Suspense>

      {/* Pagination controls */}
      {totalPages > 1 && (
        <Pagination
          currentPage={currentPage}
          totalPages={totalPages}
          onPageChange={(p) => setCurrentPage(p)}
        />
      )}
    </div>
  );
}

interface VideoGridProps {
  page: number;
  search: string;
  sortField: "date" | "name" | "progress";
  sortOrder: "asc" | "desc";
  onUpdateTotalPages: (tp: number) => void;
}

function VideoGrid({
  page,
  search,
  sortField,
  sortOrder,
  onUpdateTotalPages,
}: VideoGridProps) {
  const { lectures, dashboard } = useLectures({
    page,
    onlyFavorites: false,
    searchByTitle: search,
    sortBy: sortField,
    sortDirection: sortOrder,
  });

  const totalPages = dashboard?.num_of_pages || 1;
  useEffect(() => {
    onUpdateTotalPages(totalPages);
  }, [totalPages, onUpdateTotalPages]);

  if (lectures.length === 0) {
    return <EmptyState />;
  }

  return (
    <motion.div
      className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-6"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
    >
      {lectures.map((lecture: Lecture) => (
        <VideoCard
          key={lecture.uuid}
          lectureId={lecture.uuid}
          title={lecture.title}
          description={lecture.description}
          video={lecture.video}
          computedProgress={lecture.video.progress_percentages}
        />
      ))}
    </motion.div>
  );
}
