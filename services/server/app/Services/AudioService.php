<?php

namespace App\Services;

use App\Enums\HTTP_Status;

use App\Models\Video;

use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Facades\Log;

class AudioService
{
    public function fixAudio(string $videoUuid)
    {
        try {
            $video = Video::where('uuid', $videoUuid)->first();

            if (is_null($video)) {
                return HTTP_Status::NOT_FOUND;
            }

            if (Storage::disk(config('filesystems.storage_service'))->exists($video->video_name)) {
                $videoPath = $video->video_path;
                $command = escapeshellcmd("python3 /path/to/your/script.py $videoPath");
                $output = shell_exec($command);

                if ($output == 'ok') {
                    return HTTP_Status::OK;
                }
            }

            Log::error('Error in Pyhton script');
            return HTTP_Status::ERROR;
        } catch (\Exception $e) {
            Log::error($e->getMessage());
            return HTTP_Status::ERROR;
        }
    }
}
