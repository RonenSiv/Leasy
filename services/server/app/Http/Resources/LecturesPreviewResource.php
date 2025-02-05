<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class LecturesPreviewResource extends JsonResource
{
    /**
     * Transform the resource into an array.
     *
     * @return array<string, mixed>
     */
    public function toArray(Request $request): array
    {
        $lastTimeWatched = $this->video->videoUserProgresses->first()->last_watched_time;
        $progressPercentages = round(($lastTimeWatched / $this->video->video_duration) * 100);

        return [
            'uuid' => $this->uuid,
            'title' => $this->title,
            'description' => $this->description,
            'video' => [
                'uuid' => $this->video->uuid,
                'preview_image_url' => $this->video->preview_image_url,
                'last_watched_time' => $lastTimeWatched,
                'video_duration' => $this->video->video_duration,
                'progress_percentages' => $progressPercentages,
                'is_completed' => $progressPercentages == 100,
                'created_at' => $this->video->created_at->format('d/m/Y'),
            ],
            'is_favorite' => $this->is_favorite
        ];
    }
}
