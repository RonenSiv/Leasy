<?php

namespace App\Services;

use ProtoneMedia\LaravelFFMpeg\Support\FFMpeg;

use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Str;

use App\Models\VideoUserProgress;
use App\Models\Video;
use Illuminate\Support\Facades\Auth;

class VideoService
{
    public function storeVideo($video)
    {
        // try{

        // } catch(\Exception $e) {
        //     if (Storage::disk(config('filesystems.storage_service'))->exists($newVideo->video_name)) {
        //         Storage::disk(config('filesystems.storage_service'))->delete($newVideo->video_name);
        //     }
        // }
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
    }
}
