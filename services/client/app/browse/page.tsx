"use client";

import { SetStateAction, useEffect, useState } from "react";
import { motion } from "framer-motion";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { VideoCard } from "../components/video-card";
import { useClient } from "@/hooks/use-client";
import { VideoPreviewResource } from "@/types";

const ITEMS_PER_PAGE = 6;

export default function BrowsePage() {
  const client = useClient();
  const [videos, setVideos] = useState<VideoPreviewResource[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  useEffect(() => {
    const videos = client.lectures?.videos;
    console.log(videos);
    const filteredVideos = videos?.filter(
      (video) =>
        video.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        video.description?.toLowerCase().includes(searchTerm.toLowerCase()),
    );

    if (!filteredVideos) return;

    setVideos(filteredVideos);
    setTotalPages(Math.ceil(filteredVideos?.length / ITEMS_PER_PAGE));
    setCurrentPage(1);
  }, [searchTerm, client.lecturesLoading]);

  const paginatedVideos = videos.slice(
    (currentPage - 1) * ITEMS_PER_PAGE,
    currentPage * ITEMS_PER_PAGE,
  );

  if (client.isLoading || client.lecturesLoading) {
    return <div>Loading...</div>;
  }

  return (
    <div className="container mx-auto px-4">
      <h1 className="text-3xl font-bold mb-6">Browse Videos</h1>
      <Input
        type="text"
        placeholder="Search videos..."
        value={searchTerm}
        onChange={(e: { target: { value: SetStateAction<string> } }) =>
          setSearchTerm(e.target.value)
        }
        className="mb-6"
      />
      <motion.div
        className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5 }}
      >
        {paginatedVideos.map((video) => (
          <VideoCard key={video.video.uuid} {...video} />
        ))}
      </motion.div>
      <div className="flex justify-center items-center mt-8 space-x-2">
        <Button
          variant="outline"
          onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
          disabled={currentPage === 1}
        >
          <ChevronLeft className="h-4 w-4 mr-2" /> Previous
        </Button>
        <div className="flex items-center space-x-2">
          <Input
            type="number"
            min={1}
            max={totalPages}
            value={currentPage}
            onChange={(e: { target: { value: string } }) => {
              const page = Number.parseInt(e.target.value);
              if (page >= 1 && page <= totalPages) {
                setCurrentPage(page);
              }
            }}
            className="w-16 text-center"
          />
          <span className="text-sm text-muted-foreground">of {totalPages}</span>
        </div>
        <Button
          variant="outline"
          onClick={() =>
            setCurrentPage((prev) => Math.min(prev + 1, totalPages))
          }
          disabled={currentPage === totalPages}
        >
          Next <ChevronRight className="h-4 w-4 ml-2" />
        </Button>
      </div>
    </div>
  );
}
