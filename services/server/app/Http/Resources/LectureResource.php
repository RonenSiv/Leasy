<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class LectureResource extends JsonResource
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
            'user' => $this->user->full_name,
            'video' => [
                'uuid' => $this->video->uuid,
                'video_path' => $this->video->video_path,
                'video_name' => $this->video->video_name,
                'video_mime_type' => $this->video->video_mime_type,
            ],
            'transcription' => $this->transcription,
            'summary' => $this->summary,
            'quiz' => new QuizResource($this->quiz),
            'chat' => new ChatResource($this->chat),
        ];
    }
}
