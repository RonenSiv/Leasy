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
import { EmptyState } from "../empty-state";
import { VideoCard } from "@/app/components/video-card";
import { useLectures } from "@/hooks/use-lectures";

export function VideosContent() {
  // We do client states for search, page, etc.
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);

  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [sortField, setSortField] = useState<"date" | "name" | "progress">(
    "date",
  );
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("desc");

  return (
    <div className="container mx-auto px-4">
      <h1 className="text-3xl font-bold mb-6">Browse Videos</h1>

      {/* Search & Sort (always rendered) */}
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
          <Select
            value={sortField}
            onValueChange={(val) => {
              setSortField(val as any);
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
              setSortOrder(val as any);
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

      {/* Suspense around only the "video grid" area */}
      <Suspense
        fallback={
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[...Array(6)].map((_, i) => (
              <VideoCardSkeleton key={i} />
            ))}
          </div>
        }
      >
        {/* Only render the grid if mounted */}
        {mounted && (
          <VideoGrid
            page={currentPage}
            search={searchTerm}
            sortField={sortField}
            sortOrder={sortOrder}
            onPageChange={setCurrentPage}
          />
        )}
      </Suspense>
    </div>
  );
}

/**
 * A sub-component that calls our SWR hook in suspense mode.
 * This is the portion that "suspends" and shows fallback while loading.
 */
function VideoGrid({
  page,
  search,
  sortField,
  sortOrder,
  onPageChange,
}: {
  page: number;
  search: string;
  sortField: "date" | "name" | "progress";
  sortOrder: "asc" | "desc";
  onPageChange: (p: number) => void;
}) {
  // We pass suspense: true so SWR "throws" a promise if data isn't cached yet
  const { data } = useLectures(
    { page, search, sortField, sortOrder },
    { suspense: true }, // <--- Key
  );

  // If there's no data at all (very unlikely if fallbackData or anything else),
  // you could do an error boundary or check for errors in the hook.

  // We'll assume we have data
  if (!data) return null;

  const { dashboard, videos } = data.data;
  const totalPages = dashboard.num_of_pages || 1;

  if (videos.length === 0) {
    return <EmptyState />;
  }

  return (
    <>
      <motion.div
        className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5 }}
      >
        {videos.map((video: any) => (
          <VideoCard
            key={video.uuid}
            lectureId={video.uuid}
            title={video.title}
            description={video.description}
            video={video.video}
            computedProgress={video.video.progress_percentages}
          />
        ))}
      </motion.div>

      {totalPages > 1 && (
        <Pagination
          currentPage={page}
          totalPages={totalPages}
          onPageChange={onPageChange}
        />
      )}
    </>
  );
}
