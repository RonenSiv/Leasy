"use server";

import { api } from "@/app/api/server-api";
import { Lecture } from "@/types";

export async function fetchAllVideos(): Promise<{
  videos: Lecture[];
  totalVideos: number;
}> {
  const firstPageResponse = await api.lecture.getLectures(1);
  const firstPageData = firstPageResponse?.data;
  const pageSize = 6;
  const totalVideos = firstPageData?.dashboard.total_videos || 0;
  const totalPages = Math.ceil(totalVideos / pageSize);
  let allVideos = firstPageData?.videos || [];

  if (totalPages > 1) {
    const otherPagePromises = [];
    for (let page = 2; page <= totalPages; page++) {
      otherPagePromises.push(api.lecture.getLectures(page));
    }
    const otherPagesResults = await Promise.all(otherPagePromises);
    otherPagesResults.forEach((res) => {
      allVideos = allVideos.concat(res.data.videos || []);
    });
  }
  return { videos: allVideos, totalVideos };
}
