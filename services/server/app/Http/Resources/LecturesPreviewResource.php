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
        return [
            'uuid' => $this->uuid,
            'title' => $this->title,
            'description' => $this->description,
            'video' => [
                'uuid' => $this->video->uuid,
                'preview_image_url' => $this->video->preview_image_url,
                'last_watched_time' => $this->video->videoUserProgresses->first()->last_watched_time,
            ]
        ];
    }
}
