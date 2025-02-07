<?php

namespace App\Services;

use ProtoneMedia\LaravelFFMpeg\Support\FFMpeg;

use App\Enums\HttpStatusEnum;

use App\Models\VideoUserProgress;
use App\Models\Video;

use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Str;

class VideoService
{
    public function storeVideo($video): Video|HttpStatusEnum
    {
        $newVideo = null;
        try {

            DB::beginTransaction();

            $videoExtension = $video->getClientOriginalExtension();
            $videoName = uniqid() . '_' . Str::random(10) . '.' . $videoExtension;
            $videoPath = config('filesystems.storage_path') . "/" . $videoName;
            $videoUrl = "storage/" . $videoName;
            $videoMimeType = $video->getClientMimeType();
            Storage::disk(config('filesystems.storage_service'))->put($videoName, file_get_contents($video));

            $videoDuration = FFMpeg::fromDisk(config('filesystems.storage_service'))
                ->open($videoName)
                ->getDurationInSeconds();

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

            $audioName = uniqid() . '_' . Str::random(10) . '.wav';
            $audioPath = config('filesystems.storage_path') . "/" . $audioName;
            $audioUrl = "storage/" . $audioName;
            $audioMimeType = 'audio/mpeg';
            FFMpeg::fromDisk(config('filesystems.storage_service'))
                ->open($videoName)
                ->export()
                ->toDisk(config('filesystems.storage_service'))
                ->inFormat(new \FFMpeg\Format\Audio\Wav())
                ->save($audioName);

            $newVideo = Video::create([
                'uuid' => Str::uuid(),

                'video_path' => $videoPath,
                'video_url' => $videoUrl,
                'video_name' => $videoName,
                'video_mime_type' => $videoMimeType,
                'video_duration' => $videoDuration,

                'audio_path' => $audioPath,
                'audio_url' => $audioUrl,
                'audio_name' => $audioName,
                'audio_mime_type' => $audioMimeType,

                'preview_image_path' => $previewImagePath,
                'preview_image_url' => $previewImageUrl,
                'preview_image_name' => $previewImageName,
                'preview_image_mime_type' => $previewImageMimeType,
            ]);

            VideoUserProgress::create([
                'user_id' => Auth::id(),
                'video_id' => $newVideo->id,
            ]);

            DB::commit();

            return $newVideo;
        } catch (\Exception $e) {
            DB::rollBack();
            Log::error($e->getMessage());
            if (Storage::disk(config('filesystems.storage_service'))->exists($videoName)) {
                Storage::disk(config('filesystems.storage_service'))->delete($videoName);
            }
            return HttpStatusEnum::ERROR;
        }
    }

    public function updateLastWatchedTime(string $uuid, int $lastWatchedTime): HttpStatusEnum
    {
        try {
            $video = Video::with('videoUserProgresses')
                ->where('uuid', $uuid)
                ->first();

            if (is_null($video)) {
                return HttpStatusEnum::NOT_FOUND;
            }

            $progress = (int)round(($lastWatchedTime / $video->video_duration) * 100);

            VideoUserProgress::where('video_id', $video->id)
                ->where('user_id', Auth::id())
                ->update([
                    'last_watched_time' => $lastWatchedTime,
                    'progress' => $progress,
                ]);

            return HttpStatusEnum::OK;
        } catch (\Exception $e) {
            Log::error($e->getMessage());
            return HttpStatusEnum::ERROR;
        }
    }

    public function fixAudio(string $uuid): HttpStatusEnum
    {
        try {
            $video = Video::where('uuid', $uuid)->first();

            if (is_null($video)) {
                return HttpStatusEnum::NOT_FOUND;
            }

            if (Storage::disk(config('filesystems.storage_service'))->exists($video->video_name)) {
                $videoPath = $video->video_path;
                $command = config('app.fix_audio_python_script') . ' ' . $videoPath;
                $output = shell_exec($command);

                if ($output == "ok") {
                    return HttpStatusEnum::OK;
                }
            }

            Log::error('Error in Python script');
            return HttpStatusEnum::ERROR;
        } catch (\Exception $e) {
            Log::error($e->getMessage());
            return HttpStatusEnum::ERROR;
        }
    }

    public function streamVideo(string $uuid)
    {
        try {
            $videoName = Video::where('uuid', $uuid)->value('video_name');

            if (is_null($videoName)) {
                return HttpStatusEnum::NOT_FOUND;
            }

            $storagePath = storage_path(config('filesystems.storage_path') . '/' . $videoName);

            return $storagePath;
        } catch (\Exception $e) {
            Log::error($e->getMessage());
            return HttpStatusEnum::ERROR;
        }
    }
}
