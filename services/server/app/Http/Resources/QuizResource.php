<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class QuizResource extends JsonResource
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
            'questions' => $this->questions->map(function ($question) {
                return [
                    'question_text' => $question->question_text,
                    'options' => $question->questionOptions->map(function ($option) {
                        return [
                            'option_text' => $option->option_text,
                            'is_correct' => $option->is_correct,
                        ];
                    }),
                ];
            }),
        ];
    }
}
