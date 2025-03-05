"use client";

import type React from "react";
import { useEffect, useRef, useState } from "react";
import { Button } from "@/components/ui/button";
import { Slider } from "@/components/ui/slider";
import { useHotkeys } from "react-hotkeys-hook";

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuPortal,
  DropdownMenuSub,
  DropdownMenuSubContent,
  DropdownMenuSubTrigger,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Check,
  Maximize,
  Minimize2,
  MonitorPlay,
  Pause,
  PictureInPicture,
  Play,
  Settings,
  SkipBack,
  SkipForward,
  Subtitles,
  Volume1,
  Volume2,
  VolumeX,
} from "lucide-react";
import { cn } from "@/lib/utils";
import type { Video } from "@/types/api-types";
import { updateWeeklyProgress } from "@/app/utils/weekly-progress";
import { Spinner } from "@/app/components/spinner";

interface VideoPlayerProps {
  video: Video;
  onTimeUpdate?: (time: number) => void;
  onTheaterModeChange?: (isTheaterMode: boolean) => void;
  transcription: Array<{ start: string; end: string; text: string }>;
}

const PLAYBACK_SPEEDS = [0.25, 0.5, 0.75, 1, 1.25, 1.5, 1.75, 2];
const baseURL = process.env.NEXT_PUBLIC_API_URL;

export function VideoPlayer({
  video,
  onTimeUpdate,
  onTheaterModeChange,
  transcription,
}: VideoPlayerProps) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const controlsTimeoutRef = useRef<NodeJS.Timeout>();
  const hudTimeoutRef = useRef<NodeJS.Timeout>();
  const progressBarRef = useRef<HTMLDivElement>(null);
  const lastUpdateTimeRef = useRef<number>(video.last_watched_time || 0);
  const lastThrottleCallRef = useRef<number>(0);
  const THROTTLE_INTERVAL = 5;

  const [isPlaying, setIsPlaying] = useState(false);
  const [volume, setVolume] = useState(1);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [showControls, setShowControls] = useState(true);
  const [isTheaterMode, setIsTheaterMode] = useState(false);
  const [previousVolume, setPreviousVolume] = useState(1);
  const [isLoaded, setIsLoaded] = useState(false);
  const [hudAction, setHudAction] = useState<{
    icon: React.ReactNode;
    text: string;
  } | null>(null);
  const [playbackSpeed, setPlaybackSpeed] = useState(1);
  const [isDragging, setIsDragging] = useState(false);
  const [showTranscription, setShowTranscription] = useState(false);
  const [currentTranscription, setCurrentTranscription] = useState<string>("");

  const isVideoFocused = () => {
    const activeElement = document.activeElement;
    return (
      activeElement === videoRef.current ||
      activeElement === containerRef.current
    );
  };

  useHotkeys(
    "space",
    (e) => {
      if (isVideoFocused()) {
        e.preventDefault();
        togglePlay();
        setShowControls(true);
      }
    },
    {
      ignoreEventWhen: (e: KeyboardEvent) =>
        !(containerRef.current?.contains(e.target as Node) ?? false),
      enableOnFormTags: false,
    },
    [isPlaying, isVideoFocused],
  );

  useHotkeys(
    "m",
    () => {
      if (isVideoFocused()) {
        toggleMute();
        setShowControls(true);
      }
    },
    {
      ignoreEventWhen: (e: KeyboardEvent) =>
        !(containerRef.current?.contains(e.target as Node) ?? false),
      enableOnFormTags: false,
    },
    [volume, isVideoFocused],
  );

  useHotkeys(
    "f",
    () => {
      if (isVideoFocused()) {
        toggleFullscreen();
        setShowControls(true);
      }
    },
    {
      ignoreEventWhen: (e: KeyboardEvent) =>
        !(containerRef.current?.contains(e.target as Node) ?? false),
      enableOnFormTags: false,
    },
    [isFullscreen, isVideoFocused],
  );

  useHotkeys(
    "left",
    () => {
      if (isVideoFocused()) {
        seek(currentTime - 10);
        showHudAction(<SkipBack className="h-8 w-8" />, "Rewind 10 seconds");
        setShowControls(true);
      }
    },
    {
      ignoreEventWhen: (e: KeyboardEvent) =>
        !(containerRef.current?.contains(e.target as Node) ?? false),
      enableOnFormTags: false,
    },
    [currentTime, isVideoFocused],
  );

  useHotkeys(
    "right",
    () => {
      if (isVideoFocused()) {
        seek(currentTime + 10);
        showHudAction(
          <SkipForward className="h-8 w-8" />,
          "Forward 10 seconds",
        );
        setShowControls(true);
      }
    },
    {
      ignoreEventWhen: (e: KeyboardEvent) =>
        !(containerRef.current?.contains(e.target as Node) ?? false),
      enableOnFormTags: false,
    },
    [currentTime, isVideoFocused],
  );

  useHotkeys(
    "up",
    (e) => {
      if (isVideoFocused()) {
        e.preventDefault();
        handleVolumeChange([Math.min(volume + 0.1, 1)]);
        showHudAction(<Volume2 className="h-8 w-8" />, "Volume Up");
        setShowControls(true);
      }
    },
    {
      ignoreEventWhen: (e: KeyboardEvent) =>
        !(containerRef.current?.contains(e.target as Node) ?? false),
      enableOnFormTags: false,
    },
    [volume, isVideoFocused],
  );

  useHotkeys(
    "down",
    (e) => {
      if (isVideoFocused()) {
        e.preventDefault();
        handleVolumeChange([Math.max(volume - 0.1, 0)]);
        showHudAction(<Volume1 className="h-8 w-8" />, "Volume Down");
        setShowControls(true);
      }
    },
    {
      ignoreEventWhen: (e: KeyboardEvent) =>
        !(containerRef.current?.contains(e.target as Node) ?? false),
      enableOnFormTags: false,
    },
    [volume, isVideoFocused],
  );

  useEffect(() => {
    const videoElement = videoRef.current;
    if (!videoElement) return;

    const handleLoadedMetadata = () => {
      setDuration(videoElement.duration);
    };
    const handleLoadedData = () => {
      setIsLoaded(true);
    };
    const handlePlay = () => setIsPlaying(true);
    const handlePause = () => setIsPlaying(false);
    const handleFullscreenChange = () =>
      setIsFullscreen(document.fullscreenElement !== null);
    const handleCanPlay = () => {
      setIsLoaded(true);
    };

    videoElement.addEventListener("loadedmetadata", handleLoadedMetadata);
    videoElement.addEventListener("loadeddata", handleLoadedData);
    videoElement.addEventListener("canplay", handleCanPlay);
    videoElement.addEventListener("play", handlePlay);
    videoElement.addEventListener("pause", handlePause);
    document.addEventListener("fullscreenchange", handleFullscreenChange);

    if (videoElement.readyState >= 3) {
      setIsLoaded(true);
    }
    handleLoadedMetadata();
    handleLoadedData();

    return () => {
      videoElement.removeEventListener("loadedmetadata", handleLoadedMetadata);
      videoElement.removeEventListener("loadeddata", handleLoadedData);
      videoElement.removeEventListener("canplay", handleCanPlay);
      videoElement.removeEventListener("play", handlePlay);
      videoElement.removeEventListener("pause", handlePause);
      document.removeEventListener("fullscreenchange", handleFullscreenChange);
    };
  }, []);

  // Set initial video time
  useEffect(() => {
    if (videoRef.current && video.last_watched_time > 0) {
      videoRef.current.currentTime = video.last_watched_time;
      lastUpdateTimeRef.current = video.last_watched_time;
      lastThrottleCallRef.current = video.last_watched_time;
    }
  }, [video.last_watched_time]);

  // Controls visibility
  useEffect(() => {
    const handleMouseMove = () => {
      setShowControls(true);
      if (controlsTimeoutRef.current) {
        clearTimeout(controlsTimeoutRef.current);
      }
      if (isPlaying) {
        controlsTimeoutRef.current = setTimeout(() => {
          setShowControls(false);
        }, 2000);
      }
    };

    const handleMouseLeave = () => {
      if (isPlaying) {
        setShowControls(false);
      }
    };

    const container = containerRef.current;
    if (container) {
      container.addEventListener("mousemove", handleMouseMove);
      container.addEventListener("mouseleave", handleMouseLeave);
    }

    return () => {
      if (container) {
        container.removeEventListener("mousemove", handleMouseMove);
        container.removeEventListener("mouseleave", handleMouseLeave);
      }
      if (controlsTimeoutRef.current) {
        clearTimeout(controlsTimeoutRef.current);
      }
    };
  }, [isPlaying]);

  // Playback speed
  useEffect(() => {
    if (videoRef.current) {
      videoRef.current.playbackRate = playbackSpeed;
    }
  }, [playbackSpeed]);

  const togglePlay = () => {
    if (videoRef.current) {
      if (isPlaying) {
        videoRef.current.pause();
        showHudAction(<Pause className="h-8 w-8" />, "Pause");
      } else {
        videoRef.current.play().catch((error) => {
          console.error("Error playing video:", error);
        });
        showHudAction(<Play className="h-8 w-8" />, "Play");
      }
    }
  };

  const handleVolumeChange = (value: number[]) => {
    const newVolume = value[0];
    if (videoRef.current) {
      videoRef.current.volume = newVolume;
    }
    setVolume(newVolume);
  };

  const toggleMute = () => {
    if (videoRef.current) {
      if (volume > 0) {
        setPreviousVolume(volume);
        handleVolumeChange([0]);
        showHudAction(<VolumeX className="h-8 w-8" />, "Mute");
      } else {
        handleVolumeChange([previousVolume]);
        showHudAction(<Volume2 className="h-8 w-8" />, "Unmute");
      }
    }
  };

  const seek = (time: number) => {
    if (videoRef.current) {
      const newTime = Math.max(
        0,
        Math.min(time, videoRef.current.duration || 0),
      );
      videoRef.current.currentTime = newTime;
      setCurrentTime(newTime);
    }
  };

  const toggleFullscreen = () => {
    if (!document.fullscreenElement) {
      containerRef.current?.requestFullscreen();
      showHudAction(<Maximize className="h-8 w-8" />, "Enter Fullscreen");
    } else {
      document.exitFullscreen();
      showHudAction(<Minimize2 className="h-8 w-8" />, "Exit Fullscreen");
    }
  };

  const toggleTheaterMode = () => {
    const newTheaterMode = !isTheaterMode;
    setIsTheaterMode(newTheaterMode);
    onTheaterModeChange?.(newTheaterMode);
    showHudAction(
      <MonitorPlay className="h-8 w-8" />,
      newTheaterMode ? "Enter Theater Mode" : "Exit Theater Mode",
    );
  };

  const togglePictureInPicture = async () => {
    try {
      if (document.pictureInPictureElement) {
        await document.exitPictureInPicture();
        showHudAction(
          <PictureInPicture className="h-8 w-8" />,
          "Exit Picture-in-Picture",
        );
      } else if (videoRef.current) {
        await videoRef.current.requestPictureInPicture();
        showHudAction(
          <PictureInPicture className="h-8 w-8" />,
          "Enter Picture-in-Picture",
        );
      }
    } catch (error) {
      console.error("PiP failed:", error);
    }
  };

  const formatTime = (time: number) => {
    const hours = Math.floor(time / 3600);
    const minutes = Math.floor((time % 3600) / 60);
    const seconds = Math.floor(time % 60);

    if (hours > 0) {
      return `${hours}:${minutes.toString().padStart(2, "0")}:${seconds.toString().padStart(2, "0")}`;
    }
    return `${minutes}:${seconds.toString().padStart(2, "0")}`;
  };

  const showHudAction = (icon: React.ReactNode, text: string) => {
    setHudAction({ icon, text });
    if (hudTimeoutRef.current) {
      clearTimeout(hudTimeoutRef.current);
    }
    hudTimeoutRef.current = setTimeout(() => {
      setHudAction(null);
    }, 1000);
  };

  const handleProgressBarMouseDown = (e: React.MouseEvent) => {
    if (!progressBarRef.current || !videoRef.current) return;

    const rect = progressBarRef.current.getBoundingClientRect();
    const pos = (e.clientX - rect.left) / rect.width;
    const newTime = pos * (videoRef.current.duration || 0);
    seek(newTime);
    setIsDragging(true);
  };

  // Progress bar drag handling
  useEffect(() => {
    const handleMouseUp = () => setIsDragging(false);
    const handleMouseMove = (e: MouseEvent) => {
      if (isDragging && progressBarRef.current && videoRef.current) {
        const rect = progressBarRef.current.getBoundingClientRect();
        const pos = Math.max(
          0,
          Math.min(1, (e.clientX - rect.left) / rect.width),
        );
        const newTime = pos * (videoRef.current.duration || 0);
        seek(newTime);
      }
    };

    document.addEventListener("mousemove", handleMouseMove);
    document.addEventListener("mouseup", handleMouseUp);

    return () => {
      document.removeEventListener("mousemove", handleMouseMove);
      document.removeEventListener("mouseup", handleMouseUp);
    };
  }, [isDragging, seek]);

  const handleTimeUpdate = () => {
    const time = videoRef.current?.currentTime || 0;
    setCurrentTime(time);

    // Always update the parent component with the current time for transcription highlighting
    onTimeUpdate?.(Math.floor(time));

    // Update current transcription
    if (transcription) {
      updateCurrentTranscription(time);
    }

    // Throttle weekly progress updates to avoid too many API calls
    if (time - lastThrottleCallRef.current >= THROTTLE_INTERVAL) {
      const delta = time - lastUpdateTimeRef.current;
      // Only update if there's at least a 0.5-second increase
      if (delta >= 0.5) {
        // Round the delta to the nearest whole number
        updateWeeklyProgress({
          videoId: video.uuid,
          timeSpent: Math.round(delta),
        });
      }
      lastThrottleCallRef.current = time;
    }

    if (
      videoRef.current &&
      videoRef.current.currentTime >= videoRef.current.duration
    ) {
      const delta = time - lastUpdateTimeRef.current;
      if (delta >= 0.5) {
        updateWeeklyProgress({
          videoId: video.uuid,
          timeSpent: Math.round(delta),
        });
      }
    }
  };

  const handleSeeked = () => {
    if (videoRef.current) {
      const time = videoRef.current.currentTime || 0;
      onTimeUpdate?.(Math.floor(time));
      lastUpdateTimeRef.current = time;
    }
  };

  const VolumeIcon = volume === 0 ? VolumeX : volume < 0.5 ? Volume1 : Volume2;
  const videoUrl = `/video/stream/${video.uuid}`;

  useEffect(() => {
    if (showControls) {
      const timer = setTimeout(() => {
        setShowControls(false);
      }, 3000); // Hide controls after 3 seconds

      return () => clearTimeout(timer);
    }
  }, [showControls]);

  const toggleTranscription = (e: React.MouseEvent) => {
    e.stopPropagation();
    setShowTranscription(!showTranscription);
    showHudAction(
      <Subtitles className="h-8 w-8" />,
      showTranscription ? "Hide Transcription" : "Show Transcription",
    );
  };

  const updateCurrentTranscription = (time: number) => {
    if (!transcription || !Array.isArray(transcription)) return;

    const currentSegment = transcription.find((segment) => {
      const startTime = timeToSeconds(segment.start);
      const endTime = timeToSeconds(segment.end);
      return time >= startTime && time <= endTime;
    });

    if (currentSegment) {
      setCurrentTranscription(currentSegment.text);
    } else {
      setCurrentTranscription("");
    }
  };

  const timeToSeconds = (timeString: string) => {
    const [hours, minutes, seconds] = timeString.split(":").map((part) => {
      if (part.includes(",")) {
        return Number.parseFloat(part.replace(",", "."));
      }
      return Number.parseInt(part, 10);
    });
    return hours * 3600 + minutes * 60 + seconds;
  };

  return (
    <div
      ref={containerRef}
      className={cn(
        "relative group bg-black",
        isTheaterMode ? "h-[85vh]" : "h-auto",
      )}
      onClick={togglePlay}
      tabIndex={-1} // Make the container focusable
    >
      {!video ? (
        <div className="absolute inset-0 flex items-center justify-center">
          <Spinner className="h-12 w-12" />
        </div>
      ) : (
        <video
          ref={videoRef}
          className="w-full h-full cursor-pointer"
          poster={video.preview_image_url}
          preload="metadata"
          playsInline
          onTimeUpdate={handleTimeUpdate}
          onSeeked={handleSeeked}
          tabIndex={0} // Add this line to make the video focusable
        >
          <source src={`${baseURL}${videoUrl}`} type="video/mp4" />
          Your browser does not support the video tag.
        </video>
      )}

      {/* Transcription Overlay */}
      {showTranscription && currentTranscription && (
        <div className="absolute bottom-20 left-0 right-0 px-6 py-3 bg-black/80 text-white text-center z-10 transition-opacity duration-300 animate-fade-in">
          <p className="text-lg font-medium">{currentTranscription}</p>
        </div>
      )}

      {/* Video Controls */}
      <div
        className={cn(
          "absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/90 to-transparent px-2 md:px-4 transition-opacity duration-300 z-20",
          showControls ? "opacity-100" : "opacity-0",
          "pointer-events-auto",
        )}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Progress Bar */}
        <div
          ref={progressBarRef}
          className="h-1.5 mb-2 relative group/progress cursor-pointer"
          onMouseDown={handleProgressBarMouseDown}
        >
          <div
            className="absolute inset-y-0 left-0 bg-primary"
            style={{ width: `${(currentTime / (duration || 1)) * 100}%` }}
          >
            <div className="absolute right-0 top-1/2 -translate-y-1/2 w-3 h-3 bg-primary rounded-full transform scale-0 group-hover/progress:scale-100 transition-transform" />
          </div>
          <div className="absolute inset-0 bg-white/30" />
        </div>

        {/* Controls */}
        <div className="flex flex-wrap items-center justify-between gap-2 pb-3">
          {/* Left section */}
          <div className="flex items-center gap-2 flex-wrap sm:flex-nowrap">
            <Button
              variant="ghost"
              size="icon"
              className="h-8 w-8 text-white hover:bg-white/20"
              onClick={(e) => {
                e.stopPropagation();
                togglePlay();
              }}
            >
              {isPlaying ? (
                <Pause className="h-5 w-5" />
              ) : (
                <Play className="h-5 w-5" />
              )}
            </Button>

            <Button
              variant="ghost"
              size="icon"
              className="h-8 w-8 text-white hover:bg-white/20"
              onClick={(e) => {
                e.stopPropagation();
                seek(currentTime - 10);
                showHudAction(
                  <SkipBack className="h-8 w-8" />,
                  "Rewind 10 seconds",
                );
              }}
            >
              <SkipBack className="h-5 w-5" />
            </Button>

            <Button
              variant="ghost"
              size="icon"
              className="h-8 w-8 text-white hover:bg-white/20"
              onClick={(e) => {
                e.stopPropagation();
                seek(currentTime + 10);
                showHudAction(
                  <SkipForward className="h-8 w-8" />,
                  "Forward 10 seconds",
                );
              }}
            >
              <SkipForward className="h-5 w-5" />
            </Button>

            <Button
              variant="ghost"
              size="icon"
              className="h-8 w-8 text-white hover:bg-white/20"
              onClick={(e) => {
                e.stopPropagation();
                toggleMute();
              }}
            >
              <VolumeIcon className="h-5 w-5" />
            </Button>

            <Slider
              value={[volume]}
              max={1}
              step={0.01}
              className="w-16 sm:w-24"
              onValueChange={(value) => {
                handleVolumeChange(value);
                showHudAction(
                  <Volume2 className="h-8 w-8" />,
                  `Volume ${Math.round(value[0] * 100)}%`,
                );
              }}
              onClick={(e) => e.stopPropagation()}
            />

            <span className="text-xs sm:text-sm text-white/90 min-w-[50px] sm:min-w-[85px]">
              {video
                ? `${formatTime(currentTime)} / ${formatTime(duration)}`
                : "Loading..."}
            </span>
          </div>

          {/* Right section */}
          <div className="flex items-center gap-2 flex-wrap sm:flex-nowrap">
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-8 w-8 text-white hover:bg-white/20"
                  onClick={(e) => e.stopPropagation()}
                >
                  <Settings className="h-5 w-5" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent
                className="w-56 bg-black/90 text-white border-none"
                onClick={(e) => e.stopPropagation()}
              >
                <DropdownMenuSub>
                  <DropdownMenuSubTrigger className="cursor-pointer">
                    Playback Speed
                  </DropdownMenuSubTrigger>
                  <DropdownMenuPortal>
                    <DropdownMenuSubContent className="bg-black/90 text-white border-none">
                      {PLAYBACK_SPEEDS.map((speed) => (
                        <DropdownMenuItem
                          key={speed}
                          className="cursor-pointer flex items-center justify-between"
                          onClick={() => {
                            setPlaybackSpeed(speed);
                            showHudAction(
                              <Settings className="h-8 w-8" />,
                              `${speed}x`,
                            );
                          }}
                        >
                          {speed === 1 ? "Normal" : `${speed}x`}
                          {playbackSpeed === speed && (
                            <Check className="h-4 w-4" />
                          )}
                        </DropdownMenuItem>
                      ))}
                    </DropdownMenuSubContent>
                  </DropdownMenuPortal>
                </DropdownMenuSub>
                <DropdownMenuItem>Quality</DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>

            <Button
              variant="ghost"
              size="icon"
              className="h-8 w-8 text-white hover:bg-white/20"
              onClick={(e) => {
                e.stopPropagation();
                toggleTranscription(e);
              }}
            >
              <Subtitles
                className={cn("h-5 w-5", showTranscription && "text-primary")}
              />
            </Button>

            <Button
              variant="ghost"
              size="icon"
              className="h-8 w-8 text-white hover:bg-white/20"
              onClick={(e) => {
                e.stopPropagation();
                toggleTheaterMode();
              }}
            >
              <MonitorPlay className="h-5 w-5" />
            </Button>

            <Button
              variant="ghost"
              size="icon"
              className="h-8 w-8 text-white hover:bg-white/20"
              onClick={(e) => {
                e.stopPropagation();
                togglePictureInPicture();
              }}
            >
              <PictureInPicture className="h-5 w-5" />
            </Button>

            <Button
              variant="ghost"
              size="icon"
              className="h-8 w-8 text-white hover:bg-white/20"
              onClick={(e) => {
                e.stopPropagation();
                toggleFullscreen();
              }}
            >
              {isFullscreen ? (
                <Minimize2 className="h-5 w-5" />
              ) : (
                <Maximize className="h-5 w-5" />
              )}
            </Button>
          </div>
        </div>
      </div>

      {/* Center Play Button (only show when not playing and video is loaded) */}
      {!isPlaying && isLoaded && (
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
          <Button
            variant="ghost"
            size="icon"
            className="h-16 w-16 rounded-full bg-black/60 hover:bg-black/80 text-white pointer-events-auto"
            onClick={togglePlay}
          >
            <Play className="h-8 w-8" />
          </Button>
        </div>
      )}

      {/* Loading State */}
      {!isLoaded && (
        <div className="absolute inset-0 flex items-center justify-center">
          <Spinner />
        </div>
      )}

      {/* HUD Action */}
      {hudAction && (
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 bg-black/60 text-white p-4 rounded-lg flex flex-col items-center">
          {hudAction.icon}
          <span className="mt-2">{hudAction.text}</span>
        </div>
      )}
    </div>
  );
}
