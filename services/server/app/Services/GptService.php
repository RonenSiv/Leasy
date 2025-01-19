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

    public function getSummary(string $transcription)
    {
        try {
            return 'summary';
            $prompt = GptPropmtsEnum::GET_SUMMARY_PROMPT->value . $transcription;
            return $this->getGptResponse($prompt);
        } catch (\Exception $e) {
            Log::error($e->getMessage());
            return HTTP_Status::ERROR;
        }
    }

    public function generateQuiz(string $summary)
    {
        try {
            return 'quiz';
            $prompt = GptPropmtsEnum::GENERATE_QUIZ_PROMPT->value . $summary;
            return $this->getGptResponse($prompt);
        } catch (\Exception $e) {
            Log::error($e->getMessage());
            return HTTP_Status::ERROR;
        }
    }

    public function getChatResponse(string $message, array $chatHistory)
    {
        try {
            return 'chat response';
            return $this->getGptResponse(GptPropmtsEnum::GET_CHAT_RESPONSE_PROMPT->value . $message, $chatHistory);
        } catch (\Exception $e) {
            Log::error($e->getMessage());
            return HTTP_Status::ERROR;
        }
    }

    // ------------------- private Functions -------------------

    private function getGptResponse(string $prompt, array $chatHistory = [])
    {
        try {
            $messages = [
                ['role' => 'system', 'content' => 'You are a helpful assistant.'],
            ];

            if (!empty($chatHistory)) {
                foreach ($chatHistory as $message) {
                    $messages[] = [
                        'role' => $message['role'],
                        'content' => $message['content'],
                    ];
                }
            }

            $messages[] = [
                'role' => 'user',
                'content' => $prompt,
            ];

            $response = $this->client->post('chat/completions', [
                'headers' => [
                    'Authorization' => 'Bearer ' . config('app.openai_api_key')
                ],
                'json' => [
                    'model' => config('app.openai_model'),
                    'messages' => $messages,
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
