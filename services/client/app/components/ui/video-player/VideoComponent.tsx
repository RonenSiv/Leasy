import React from "react";

export const VideoComponent = async ({
  fileName,
  handleVideoError,
}: {
  fileName?: { url: string; captionsUrl: string };
  handleVideoError?: (e: React.SyntheticEvent<HTMLVideoElement, Event>) => void;
}) => {
  const getVideoUrl = async (fileName: string) => {
    await new Promise((resolve) => setTimeout(resolve, 1000));
    // TODO: Implement this function to fetch the video URL and captions URL
    return {
      data: {
        url: "https://example.com/video.mp4",
        captionsUrl: "https://example.com/captions.vtt",
      },
    };
  };
  // const { url, captionsUrl } = fileName;

  return (
    <video className="w-full h-full" controls onError={handleVideoError}>
      <source
        src={`https://www.w3schools.com/html/mov_bbb.mp4`}
        type="video/mp4"
      />
      Your browser does not support the video tag.
    </video>
  );
};
