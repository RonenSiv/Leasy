<?php

namespace App\Services;

use App\Enums\HTTP_Status;

use Illuminate\Support\Facades\Log;

class GptService
{
    public function getChatResponse()
    {
        try {
            return 'chat response';
        } catch (\Exception $e) {
            Log::error($e->getMessage());
            return HTTP_Status::ERROR;
        }
    }

    public function getQuizQuestions()
    {
        try {
            return 'quiz';
        } catch (\Exception $e) {
            Log::error($e->getMessage());
            return HTTP_Status::ERROR;
        }
    }

    public function getTranscription()
    {
        try {
            return 'transcription';
        } catch (\Exception $e) {
            Log::error($e->getMessage());
            return HTTP_Status::ERROR;
        }
    }

    public function getSummary()
    {
        try {
            return 'summary';
        } catch (\Exception $e) {
            Log::error($e->getMessage());
            return HTTP_Status::ERROR;
        }
    }

    public function getLectureTitle(string $summary)
    {
        try {
            return 'lecture title';
        } catch (\Exception $e) {
            Log::error($e->getMessage());
            return HTTP_Status::ERROR;
        }
    }

    public function getLectureDescription(string $summary)
    {
        try {
            return 'lecture description';
        } catch (\Exception $e) {
            Log::error($e->getMessage());
            return HTTP_Status::ERROR;
        }
    }
}
