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
            'title' => $this->title,
            'description' => $this->description,
            'user' => $this->user->full_name,
            'video' => new VideoResource($this->video),
            'transcription' => $this->transcription,
            'summary' => $this->summary,
            'quiz' => new QuizResource($this->quiz),
            'chat' => new ChatResource($this->chat),
        ];
    }
}
