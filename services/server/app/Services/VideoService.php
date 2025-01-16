<?php

namespace App\Services;

use ProtoneMedia\LaravelFFMpeg\Support\FFMpeg;

use App\Enums\HTTP_Status;

use App\Models\VideoUserProgress;
use App\Models\Video;

use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Str;

class VideoService
{
    public function storeVideo($video)
    {
        $newVideo = null;
        try {
            $videoExtension = $video->getClientOriginalExtension();
            $videoName = uniqid() . '_' . Str::random(10) . '.' . $videoExtension;
            $videoPath = config('filesystems.storage_path') . "/" . $videoName;
            $videoUrl = "storage/" . $videoName;
            $VideoMimeType = $video->getClientMimeType();
            Storage::disk(config('filesystems.storage_service'))->put($videoName, file_get_contents($video));

            $previewImageName = uniqid() . '_' . Str::random(10) . '.jpg';
            $previewImagePath = config('filesystems.storage_path') . "/" . $previewImageName;
            $previewImageUrl = "storage/" . $previewImageName;
            $previewImageMimeType = 'image/jpeg';
            FFMpeg::fromDisk(config('filesystems.storage_service'))
                ->open($videoName)
                ->getFrameFromSeconds(10)
                ->export()
                ->toDisk(config('filesystems.storage_service'))
                ->save($previewImageName);

            $newVideo = Video::create([
                'uuid' => Str::uuid(),
                'video_path' => $videoPath,
                'video_url' => $videoUrl,
                'video_name' => $videoName,
                'video_mime_type' => $VideoMimeType,
                'preview_image_path' => $previewImagePath,
                'preview_image_url' => $previewImageUrl,
                'preview_image_name' => $previewImageName,
                'preview_image_mime_type' => $previewImageMimeType,
            ]);

            VideoUserProgress::create([
                'user_id' => Auth::id(),
                'video_id' => $newVideo->id,
            ]);

            return $newVideo;
        } catch (\Exception $e) {
            Log::error($e->getMessage());
            if (Storage::disk(config('filesystems.storage_service'))->exists($videoName)) {
                Storage::disk(config('filesystems.storage_service'))->delete($videoName);
            }
            return HTTP_Status::ERROR;
        }
    }

    public function updateLastWatchedTime(string $uuid, int $lastWatchedTime)
    {
        try {
            $videoId = Video::where('uuid', $uuid)->value('id');

            if (is_null($videoId)) {
                return HTTP_Status::NOT_FOUND;
            }

            VideoUserProgress::where('video_id', $videoId)
                ->where('user_id', Auth::id())
                ->update([
                    'last_watched_time' => $lastWatchedTime
                ]);

            return HTTP_Status::OK;
        } catch (\Exception $e) {
            Log::error($e->getMessage());
            return HTTP_Status::ERROR;
        }
    }
}
