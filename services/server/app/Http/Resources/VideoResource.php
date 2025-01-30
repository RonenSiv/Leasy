<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;
use Illuminate\Support\Facades\Auth;

class VideoResource extends JsonResource
{
    /**
     * Transform the resource into an array.
     *
     * @return array<string, mixed>
     */
    public function toArray(Request $request): array
    {
        return [
            'uuid' => $this->uuid,
            'video_url' => $this->video_url,
            'preview_image_url' => $this->preview_image_url,
            'last_watched_time' => $this->videoUserProgresses()->where('user_id', Auth::id())->value('last_watched_time'),
            'progress' => $this->videoUserProgresses()->where('user_id', Auth::id())->value('progress'),
            'video_duration' => $this->video_duration,
        ];
    }
}
