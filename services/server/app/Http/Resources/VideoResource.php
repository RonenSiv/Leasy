<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

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
            'video_path' => $this->video_path,
            'video_name' => $this->video_name,
            'video_mime_type' => $this->video_mime_type,
            'preview_image_path' => $this->video_path,
            'preview_image_name' => $this->video_name,
            'preview_image_mime_type' => $this->video_mime_type,
        ];
    }
}
