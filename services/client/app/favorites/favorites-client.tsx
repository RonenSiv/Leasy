"use client";

import { useEffect, useRef, useState } from "react";
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
import { BookOpen } from "lucide-react";
import { LectureCardSkeleton } from "../components/lectures/lecture-card-skeleton";
import { LectureCard } from "../components/lectures/lecture-card";
import { EmptyState } from "../components/empty-state";
import type { LectureResponse } from "@/types/api-types";

interface FavoritesClientProps {
  initialData: LectureResponse;
}

export function FavoritesClient({ initialData }: FavoritesClientProps) {
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [sortBy, setSortBy] = useState("created_at");
  const [sortDirection, setSortDirection] = useState("desc");
  const [allLectures, setAllLectures] = useState(
    initialData.data.lectures || [],
  );
  const [hasMore, setHasMore] = useState(true);
  const [isLoadingMore, setIsLoadingMore] = useState(false);

  const observerTarget = useRef<HTMLDivElement>(null);

  const { lectures, isLoading, isError, mutate } = useLectures({
    page: currentPage,
    onlyFavorites: true,
    searchByTitle: searchTerm,
    sortBy,
    sortDirection,
    fallbackData: initialData,
  });

  useEffect(() => {
    if (lectures) {
      if (currentPage === 1) {
        setAllLectures(lectures);
      } else {
        setAllLectures((prev) => [...prev, ...lectures]);
      }
      setHasMore(lectures.length > 0);
      setIsLoadingMore(false);
    }
  }, [lectures, currentPage]);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting && hasMore && !isLoadingMore) {
          setIsLoadingMore(true);
          setCurrentPage((prev) => prev + 1);
        }
      },
      { threshold: 1.0 },
    );

    if (observerTarget.current) {
      observer.observe(observerTarget.current);
    }

    return () => observer.disconnect();
  }, [hasMore, isLoadingMore]);

  const handleSearch = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setCurrentPage(1);
    setAllLectures([]);
  };

  const handleSortChange = (field: string) => {
    setSortBy(field);
    setCurrentPage(1);
    setAllLectures([]);
  };

  const handleSortDirectionChange = (direction: string) => {
    setSortDirection(direction);
    setCurrentPage(1);
    setAllLectures([]);
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
        {isLoading && currentPage === 1 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-6">
            {Array(6)
              .fill(0)
              .map((_, index) => (
                <LectureCardSkeleton key={index} />
              ))}
          </div>
        ) : allLectures.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-6">
            {allLectures.map((lecture) => (
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

        {/* Infinite scroll observer */}
        {hasMore && (
          <div
            ref={observerTarget}
            className="w-full h-20 flex items-center justify-center"
          >
            {isLoadingMore && <LectureCardSkeleton />}
          </div>
        )}
      </div>
    </div>
  );
}
