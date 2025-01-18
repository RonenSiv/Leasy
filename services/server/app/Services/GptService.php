<?php

namespace App\Services;

use App\Enums\GptPropmtsEnum;
use App\Enums\HTTP_Status;

use GuzzleHttp\Client;

use Illuminate\Support\Facades\Log;

class GptService
{
    protected $client;
    public function __construct()
    {
        $this->client = new Client([
            'base_uri' => config('app.openai_base_uri'),
        ]);
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

    public function generateQuiz(string $summary)
    {
        try {
            $prompt = GptPropmtsEnum::GENERATE_QUIZ->value . $summary;
            return 'quiz';
            return $this->getGptResponse($prompt);
        } catch (\Exception $e) {
            Log::error($e->getMessage());
            return HTTP_Status::ERROR;
        }
    }

    public function getChatResponse(string $message)
    {
        try {
            return 'chat response';
            return $this->getGptResponse(GptPropmtsEnum::GET_CHAT_RESPONSE->value . $message);
        } catch (\Exception $e) {
            Log::error($e->getMessage());
            return HTTP_Status::ERROR;
        }
    }

    // ------------------- private Functions -------------------

    private function getGptResponse(string $prompt)
    {
        try {
            $response = $this->client->post('chat/completions', [
                'headers' => [
                    'Authorization' => 'Bearer ' . config('app.openai_api_key')
                ],
                'json' => [
                    'model' => config('app.openai_model'),
                    'messages' => [
                        ['role' => 'system', 'content' => 'You are a helpful assistant.'],
                        ['role' => 'user', 'content' => $prompt],
                    ],
                    'max_tokens' => config('app.openai_max_tokens'),
                    'temperature' => config('app.openai_temperature'),
                ],
                'verify' => false,
            ]);

            $respnseData = json_decode($response->getBody(), true);
            $answer = $respnseData['choices'][0]['message']['content'];

            return $answer;
        } catch (\Exception $e) {
            Log::error($e->getMessage());
            return HTTP_Status::ERROR;
        }
    }
}
