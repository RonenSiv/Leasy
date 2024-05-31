export const VideoComponent = async ({
  fileName,
  handleVideoError,
}: {
  fileName: string;
  handleVideoError: (e: React.SyntheticEvent<HTMLVideoElement, Event>) => void;
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
  const { data } = await getVideoUrl(fileName);
  const { url, captionsUrl } = data;

  return (
    <video
      controls
      preload="none"
      aria-label="Video player"
      className="w-full h-full"
      onError={(e) => handleVideoError(e)}
    >
      <source src={url} type="video/mp4" />
      <track src={captionsUrl} kind="subtitles" srcLang="en" label="English" />
      Your browser does not support the video tag.
    </video>
  );
};
