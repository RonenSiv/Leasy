"use client";

import { useTransition } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { LectureCard } from "@/app/components/lectures/lecture-card";
import { LectureCardSkeleton } from "@/app/components/lectures/lecture-card-skeleton";
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
import { EmptyState } from "@/app/components/empty-state";
import { Upload } from "lucide-react";
import type { LectureResponse } from "@/types/api-types";
import { useLectures } from "@/hooks/use-lectures";

interface BrowseClientProps {
  initialData: LectureResponse;
}

export function BrowseClient({ initialData }: BrowseClientProps) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [isPending, startTransition] = useTransition();

  const currentPage = parseInt(searchParams.get("page") || "1");
  const currentSearch = searchParams.get("search") || "";
  const currentSort = searchParams.get("sort") || "created_at";
  const currentDirection = searchParams.get("direction") || "desc";

  const { lectures, dashboard, isLoading } = useLectures({
    page: currentPage,
    searchByTitle: currentSearch,
    sortBy: currentSort,
    sortDirection: currentDirection,
    fallbackData: initialData,
  });

  const updateUrl = (updates: Record<string, string>) => {
    const params = new URLSearchParams(searchParams);
    Object.entries(updates).forEach(([key, value]) => {
      if (value) {
        params.set(key, value);
      } else {
        params.delete(key);
      }
    });

    startTransition(() => {
      router.push(`/browse?${params.toString()}`);
    });
  };

  const handleSearch = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const search = formData.get("search") as string;
    updateUrl({ search, page: "1" });
  };

  if (isLoading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-6">
        {Array(6)
          .fill(0)
          .map((_, index) => (
            <LectureCardSkeleton key={index} />
          ))}
      </div>
    );
  }

  return (
    <div className="container mx-auto py-8 min-h-screen flex flex-col">
      <h1 className="text-3xl font-bold mb-6">Browse All Videos</h1>

      <div className="flex flex-col md:flex-row gap-4 mb-6">
        <form onSubmit={handleSearch} className="flex gap-2 flex-grow">
          <Input
            type="search"
            name="search"
            placeholder="Search videos..."
            defaultValue={currentSearch}
            className="flex-grow"
          />
          <Button type="submit" disabled={isPending}>
            Search
          </Button>
        </form>

        <div className="flex gap-2">
          <Select
            value={currentSort}
            onValueChange={(value) => updateUrl({ sort: value, page: "1" })}
          >
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
            value={currentDirection}
            onValueChange={(value) =>
              updateUrl({ direction: value, page: "1" })
            }
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

      {lectures?.length ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-6">
          {lectures.map((lecture) => (
            <LectureCard key={lecture.uuid} lecture={lecture} />
          ))}
        </div>
      ) : (
        <div className="flex items-center justify-center h-[50vh]">
          <EmptyState
            title={currentSearch ? "No videos found" : "No videos available"}
            description={
              currentSearch
                ? "Try adjusting your search or upload a new video."
                : "You can upload a video to get started."
            }
            primaryAction={{
              label: currentSearch ? "Clear Search" : "Upload a Video",
              href: currentSearch ? "/browse" : "/upload",
            }}
            secondaryAction={
              currentSearch
                ? {
                    label: "Upload a Video",
                    href: "/upload",
                  }
                : undefined
            }
            icon={<Upload className="w-10 h-10 text-primary" />}
          />
        </div>
      )}

      {dashboard && dashboard.num_of_pages > 1 && (
        <div className="mt-auto pt-6">
          <Pagination>
            <PaginationContent>
              <PaginationItem>
                <PaginationPrevious
                  onClick={() =>
                    updateUrl({
                      page: Math.max(currentPage - 1, 1).toString(),
                    })
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
                    onClick={() => updateUrl({ page: page.toString() })}
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
                    updateUrl({
                      page: Math.min(
                        currentPage + 1,
                        dashboard.num_of_pages,
                      ).toString(),
                    })
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
