"use client";

import type React from "react";
import { useState } from "react";
import { useLectures } from "@/hooks/use-lectures";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";
import { BookOpen } from "lucide-react";
import { LectureCardSkeleton } from "../components/lectures/lecture-card-skeleton";
import { LectureCard } from "../components/lectures/lecture-card";
import { EmptyState } from "../components/empty-state";

export default function FavoritesPage() {
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [sortBy, setSortBy] = useState("created_at");
  const [sortDirection, setSortDirection] = useState("desc");

  const { lectures, dashboard, isLoading, isError } = useLectures({
    page: currentPage,
    onlyFavorites: true,
    searchByTitle: searchTerm,
    sortBy,
    sortDirection,
  });

  const handleSearch = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setCurrentPage(1);
  };

  const handleSortChange = (field: string) => {
    setSortBy(field);
    setCurrentPage(1); // Reset to first page on sort change
  };

  const handleSortDirectionChange = (direction: string) => {
    setSortDirection(direction);
    setCurrentPage(1); // Reset to first page on sort direction change
  };

  if (isError) return <div>Error loading favorites</div>;

  return (
    <div className="container mx-auto py-8 min-h-screen flex flex-col">
      <h1 className="text-3xl font-bold mb-6">My Favorite Videos</h1>

      <div className="flex flex-col md:flex-row gap-4 mb-6">
        <form onSubmit={handleSearch} className="flex gap-2 flex-grow">
          <Input
            type="text"
            placeholder="Search favorites..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="flex-grow"
          />
          <Button type="submit">Search</Button>
        </form>
        <div className="flex gap-2">
          <Select value={sortBy} onValueChange={handleSortChange}>
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Sort by" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="created_at">Date Added</SelectItem>
              <SelectItem value="title">Title</SelectItem>
              <SelectItem value="video_duration">Duration</SelectItem>
            </SelectContent>
          </Select>
          <Select
            value={sortDirection}
            onValueChange={handleSortDirectionChange}
          >
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Sort direction" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="asc">Ascending</SelectItem>
              <SelectItem value="desc">Descending</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      <div className="flex-grow">
        {isLoading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-6">
            {Array(6)
              .fill(0)
              .map((_, index) => (
                <LectureCardSkeleton key={index} />
              ))}
          </div>
        ) : lectures?.length ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-6">
            {lectures.map((lecture) => (
              <LectureCard key={lecture.uuid} lecture={lecture} />
            ))}
          </div>
        ) : (
          <div className="flex items-center justify-center h-[50vh]">
            <EmptyState
              title="No favorite videos yet"
              description="Start exploring and add videos to your favorites!"
              primaryAction={{
                label: "Browse Videos",
                href: "/browse",
              }}
              secondaryAction={{
                label: "Upload a Video",
                href: "/upload",
              }}
              icon={<BookOpen className="w-10 h-10 text-primary" />}
            />
          </div>
        )}
      </div>

      {dashboard && dashboard.num_of_pages > 1 && (
        <div className="mt-auto pt-6">
          <Pagination>
            <PaginationContent>
              <PaginationItem>
                <PaginationPrevious
                  onClick={() =>
                    setCurrentPage((prev) => Math.max(prev - 1, 1))
                  }
                  className="cursor-pointer"
                />
              </PaginationItem>
              {Array.from(
                { length: dashboard.num_of_pages },
                (_, i) => i + 1,
              ).map((page) => (
                <PaginationItem key={page}>
                  <PaginationLink
                    onClick={() => setCurrentPage(page)}
                    isActive={currentPage === page}
                    className="cursor-pointer"
                  >
                    {page}
                  </PaginationLink>
                </PaginationItem>
              ))}
              <PaginationItem>
                <PaginationNext
                  onClick={() =>
                    setCurrentPage((prev) =>
                      Math.min(prev + 1, dashboard.num_of_pages),
                    )
                  }
                  className="cursor-pointer"
                />
              </PaginationItem>
            </PaginationContent>
          </Pagination>
        </div>
      )}
    </div>
  );
}
