<?php

namespace App\services;

use App\Enums\HTTP_Status;
use App\Models\UserHasVideo;
use App\Models\Video;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Str;


class VideoService
{
    public function store($video): HTTP_Status|string
    {
        try {
            DB::beginTransaction();
            $extension = $video->getClientOriginalExtension();
            $randomFileName = uniqid() . '_' . Str::random(10) . '.' . $extension;
            Storage::disk(config('filesystems.storage_service'))->put($randomFileName, file_get_contents($video));

            $mimeType = $video->getClientMimeType();

            $newVideo = Video::create([
                'uuid' => Str::uuid(),
                'video_path' => config('filesystems.storage_path') . "/" . $randomFileName,
                'video_name' => $randomFileName,
                'video_mime_type' => $mimeType,
            ]);

            UserHasVideo::create([
                'user_id' => Auth::id(),
                'video_id' => $newVideo->id,
            ]);

            DB::commit();

            return $newVideo->uuid;
        } catch (\Exception $e) {
            DB::rollBack();
            Log::error($e->getMessage());
            return HTTP_Status::ERROR;
        }
    }
}
