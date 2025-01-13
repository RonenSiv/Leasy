<?php

namespace App\Services;

class GptService
{
    public function getChatResponse()
    {
        return 'chat response';
    }

    public function getQuizQuestions()
    {
        return 'quiz';
    }

    public function getTranscription()
    {
        return 'transcription';
    }

    public function getSummary()
    {
        return 'summary';
    }

    public function getLectureTitle(string $summary)
    {
        return 'lecture title';
    }
}
