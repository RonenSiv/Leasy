<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class QuestionResource extends JsonResource
{
    /**
     * Transform the resource into an array.
     *
     * @return array<string, mixed>
     */
    public function toArray(Request $request): array
    {
        return [
            'question_uuid' => $this->uuid,
            'question_text' => $this->question_text,
            'options' => $this->questionOptions->map(function ($option) {
                return [
                    'option_index' => $option->option_index,
                    'option_text' => $option->option_text,
                ];
            }),
            'is_answered' => $this->is_answered,
        ];
    }
}
