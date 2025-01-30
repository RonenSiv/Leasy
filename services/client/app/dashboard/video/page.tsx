"use client";

import React, { useEffect, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import {
  ArrowDownAZ,
  ArrowUpAZ,
  BarChart2,
  Calendar,
  CheckCircle,
  CirclePlus,
  Play,
  Search,
  XCircle,
} from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { toast } from "sonner";
import { Progress } from "@/components/ui/progress";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { ClientImage } from "@/components/client-image";
import Link from "next/link";
import {
  DashboardData,
  Lecture,
  lectureService,
} from "@/services/video-service";

export default function MyVideosPage() {
  const [dashboard, setDashboard] = useState<DashboardData | null>(null);
  const [videos, setVideos] = useState<Lecture[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [hoveredVideo, setHoveredVideo] = useState<string | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [sortBy, setSortBy] = useState("date");
  const [searchTerm, setSearchTerm] = useState("");

  const videosPerPage = 6;

  useEffect(() => {
    const fetchVideos = async () => {
      setIsLoading(true);
      try {
        const lectures = await lectureService.getLectures();
        setVideos(lectures?.videos || []);
        setDashboard(lectures?.dashboard || null);
      } catch (error) {
        console.error("Error fetching videos:", error);
        toast.error("Failed to load videos. Please try again later.");
      } finally {
        setIsLoading(false);
      }
    };

    fetchVideos();
  }, []);

  const handlePlay = (videoTitle: string) => {
    console.log(`Playing video ${videoTitle}`);
    toast.info(`Preparing to play '${videoTitle}'`);
  };

  const handleMouseEnter = (videoId: string) => {
    setHoveredVideo(videoId);
  };

  const handleMouseLeave = () => {
    setHoveredVideo(null);
  };

  const handleSort = (value: string) => {
    setSortBy(value);
    let sortedVideos = [...videos];
    switch (value) {
      case "date":
        sortedVideos.sort(
          (a, b) =>
            new Date(b.video.created_at).getTime() -
            new Date(a.video.created_at).getTime(),
        );
        break;
      case "progress":
        sortedVideos.sort(
          (a, b) => b.video.progress_percentages - a.video.progress_percentages,
        );
        break;
      case "a-z":
        sortedVideos.sort((a, b) => a.title.localeCompare(b.title));
        break;
      case "z-a":
        sortedVideos.sort((a, b) => b.title.localeCompare(a.title));
        break;
      default:
        break;
    }
    setVideos(sortedVideos);
    setCurrentPage(1);
  };

  const handleSearch = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(event.target.value);
    setCurrentPage(1);
  };

  const filteredVideos = videos.filter((video) =>
    video.title.toLowerCase().includes(searchTerm.toLowerCase()),
  );

  const totalPages = Math.ceil(filteredVideos.length / videosPerPage);

  const indexOfLastVideo = currentPage * videosPerPage;
  const indexOfFirstVideo = indexOfLastVideo - videosPerPage;
  const currentVideos = filteredVideos.slice(
    indexOfFirstVideo,
    indexOfLastVideo,
  );

  const paginate = (pageNumber: number) => {
    if (pageNumber < 1 || pageNumber > totalPages) return;
    setCurrentPage(pageNumber);
  };

  const totalVideos = videos.length;
  const completedVideos = videos.filter(
    ({ video }) => video.is_completed,
  ).length;
  const incompleteVideos = totalVideos - completedVideos;
  const overallProgress = totalVideos
    ? Math.round(
        videos.reduce((acc, { video }) => acc + video.progress_percentages, 0) /
          totalVideos,
      )
    : 0;

  return (
    <div className="min-h-screen bg-gradient-to-br from-[hsl(180,9.09%,97.84%)] to-[hsl(180,9.09%,97.84%)] dark:from-[hsl(215,27.91%,16.86%)] dark:to-[hsl(215,27.91%,16.86%)] w-full">
      <div className="container mx-auto px-4 py-8 max-w-6xl">
        {/* Header Section */}
        <div className="flex flex-col sm:flex-row items-center sm:justify-between mb-8 space-y-4 sm:space-y-0">
          <div className="flex items-center gap-4">
            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-primary">
              My Learning Journey
            </h1>
            <ClientImage
              src="/quiz.png"
              alt="Profile"
              className="h-16 w-16 sm:h-24 sm:w-24 rounded-full object-cover"
            />
          </div>
          <Link href={`/dashboard/upload`} passHref>
            <Button
              variant="secondary"
              size="default"
              className="w-full sm:w-auto flex items-center justify-center"
            >
              <div className="flex items-center gap-2">
                <CirclePlus />
                Add Video
              </div>
            </Button>
          </Link>
        </div>

        {/* Statistics Section */}
        <div className="mb-6 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="shadow rounded-lg flex items-center p-4 bg-white dark:bg-gray-800">
            <CheckCircle className="h-8 w-8 text-green-500 mr-4 flex-shrink-0" />
            <div>
              <p className="text-sm text-gray-500 dark:text-gray-400">
                Completed Videos
              </p>
              <p className="text-xl font-bold text-primary">
                {completedVideos} / {totalVideos}
              </p>
            </div>
          </div>
          <div className="shadow rounded-lg flex items-center p-4 bg-white dark:bg-gray-800">
            <XCircle className="h-8 w-8 text-red-500 mr-4 flex-shrink-0" />
            <div>
              <p className="text-sm text-gray-500 dark:text-gray-400">
                Incomplete Videos
              </p>
              <p className="text-xl font-bold text-primary">
                {incompleteVideos}
              </p>
            </div>
          </div>
          <div className="shadow rounded-lg flex items-center p-4 bg-white dark:bg-gray-800">
            <BarChart2 className="h-8 w-8 text-blue-500 mr-4 flex-shrink-0" />
            <div>
              <p className="text-sm text-gray-500 dark:text-gray-400">
                Overall Progress
              </p>
              <p className="text-xl font-bold text-primary">
                {overallProgress}%
              </p>
            </div>
          </div>
          <div className="shadow rounded-lg flex items-center p-4 bg-white dark:bg-gray-800">
            <Calendar className="h-8 w-8 text-purple-500 mr-4 flex-shrink-0" />
            <div>
              <p className="text-sm text-gray-500 dark:text-gray-400">
                Total Videos
              </p>
              <p className="text-xl font-bold text-primary">{totalVideos}</p>
            </div>
          </div>
        </div>

        {/* Search and Sort Section */}
        <div className="mb-6 flex flex-col sm:flex-row justify-between items-center gap-4">
          {/* Search Input */}
          <div className="relative w-full sm:w-64">
            <Input
              type="text"
              placeholder="Search videos..."
              value={searchTerm}
              onChange={handleSearch}
              className="pl-10 w-full"
            />
            <Search
              className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"
              size={18}
            />
          </div>

          {/* Sort By Select with Descriptive Labels and Icons */}
          <div className="flex items-center space-x-2 w-full sm:w-auto">
            <label
              htmlFor="sortBy"
              className="text-sm font-medium text-gray-700 dark:text-gray-300"
            >
              Sort by:
            </label>
            <Select onValueChange={handleSort} defaultValue={sortBy}>
              <SelectTrigger className="w-full sm:w-48">
                <SelectValue placeholder="Select" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="date" className="flex items-center">
                  <Calendar className="h-4 w-4 mr-2 text-gray-500" />
                  <span>Date</span>
                </SelectItem>
                <SelectItem value="progress" className="flex items-center">
                  <BarChart2 className="h-4 w-4 mr-2 text-gray-500" />
                  Progress
                </SelectItem>
                <SelectItem value="a-z" className="flex items-center">
                  <ArrowDownAZ className="h-4 w-4 mr-2 text-gray-500" />
                  Title: A-Z
                </SelectItem>
                <SelectItem value="z-a" className="flex items-center">
                  <ArrowUpAZ className="h-4 w-4 mr-2 text-gray-500" />
                  Title: Z-A
                </SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        {/* Content Section */}
        {isLoading ? (
          /* Loading Skeletons */
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {[...Array(videosPerPage)].map((_, index) => (
              <Card key={index} className="overflow-hidden">
                <CardContent className="p-0">
                  <Skeleton className="h-48 w-full" />
                  <div className="p-4">
                    <Skeleton className="h-6 w-3/4 mb-2" />
                    <Skeleton className="h-4 w-1/2" />
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        ) : filteredVideos.length === 0 ? (
          /* No Videos Found Message */
          <div className="text-center mt-16">
            <p className="text-2xl text-gray-600 dark:text-gray-300">
              No videos found.
            </p>
            <p className="text-gray-500 dark:text-gray-400 mt-4">
              Try adjusting your search or filter to find what you're looking
              for.
            </p>
          </div>
        ) : (
          /* Video Grid and Pagination */
          <>
            <AnimatePresence>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {currentVideos.map((videoData) => (
                  <motion.div
                    key={videoData.video.uuid}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -20 }}
                    transition={{ duration: 0.3 }}
                    onMouseEnter={() => handleMouseEnter(videoData.video.uuid)}
                    onMouseLeave={handleMouseLeave}
                  >
                    <Card className="overflow-hidden hover:shadow-lg transition-all duration-300 transform hover:-translate-y-1 bg-white dark:bg-gray-800">
                      <CardContent className="p-0">
                        <div className="relative group">
                          <ClientImage
                            src={videoData.video.preview_image_url}
                            alt={videoData.title}
                            className="w-full h-48 object-cover transition-transform duration-300 group-hover:scale-105"
                          />
                          <div className="absolute inset-0 bg-black bg-opacity-50 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
                            <Button
                              variant="secondary"
                              size="icon"
                              className="rounded-full transform scale-0 group-hover:scale-100 transition-transform duration-300"
                              onClick={() => handlePlay(videoData.title)}
                            >
                              <Play className="h-6 w-6 text-white" />
                            </Button>
                          </div>
                          <div className="absolute bottom-2 right-2 bg-black bg-opacity-75 text-white px-2 py-1 rounded text-sm">
                            FIX DURATION
                          </div>
                          {videoData.video.is_completed && (
                            <div className="absolute top-2 left-2 bg-green-500 text-white px-2 py-1 rounded-full text-xs flex items-center">
                              <CheckCircle className="h-3 w-3 mr-1" />
                              Completed
                            </div>
                          )}
                        </div>
                        <div className="p-4">
                          <h2 className="text-lg font-semibold mb-2 text-primary line-clamp-2">
                            {videoData.title}
                          </h2>
                          <div className="flex items-center justify-between text-sm text-gray-500 dark:text-gray-400 mb-2">
                            <div className="flex items-center">
                              <Calendar className="h-4 w-4 mr-1" />
                              {new Date(
                                videoData.video.created_at,
                              ).toLocaleDateString()}
                            </div>
                            <div className="flex items-center">
                              {videoData.video.is_completed ? (
                                <CheckCircle className="h-4 w-4 text-green-500 mr-1" />
                              ) : (
                                <XCircle className="h-4 w-4 text-red-500 mr-1" />
                              )}
                              {videoData.video.is_completed
                                ? "Completed"
                                : "Incomplete"}
                            </div>
                          </div>
                          <div className="relative pt-1">
                            <div className="flex mb-2 items-center justify-between">
                              <div>
                                <span className="text-xs font-semibold inline-block py-1 px-2 uppercase rounded-full text-primary bg-primary-foreground">
                                  Progress
                                </span>
                              </div>
                              <div className="text-right">
                                <span className="text-xs font-semibold inline-block text-primary">
                                  {videoData.video.progress_percentages}%
                                </span>
                              </div>
                            </div>
                            <Progress
                              value={videoData.video.progress_percentages}
                              className="w-full"
                            />
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  </motion.div>
                ))}
              </div>
            </AnimatePresence>
            {/* Pagination */}
            {totalPages > 1 && (
              <div className="flex flex-col sm:flex-row items-center justify-between mt-8">
                <div className="text-sm text-gray-600 dark:text-gray-400 mb-4 sm:mb-0">
                  Page {currentPage} of {totalPages}
                </div>
                <div className="flex space-x-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => paginate(currentPage - 1)}
                    disabled={currentPage === 1}
                  >
                    Previous
                  </Button>
                  {Array.from({ length: totalPages }).map((_, index) => (
                    <Button
                      key={index}
                      variant={
                        currentPage === index + 1 ? "default" : "outline"
                      }
                      size="sm"
                      onClick={() => paginate(index + 1)}
                    >
                      {index + 1}
                    </Button>
                  ))}
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => paginate(currentPage + 1)}
                    disabled={currentPage === totalPages}
                  >
                    Next
                  </Button>
                </div>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}
