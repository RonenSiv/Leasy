<?php

namespace App\Services;

use App\Models\Video;

use App\Enums\GptPropmtsEnum;
use App\Enums\HttpStatusEnum;
use App\Enums\WhisperFailedEnum;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Facades\Log;

use GuzzleHttp\Client;

class GptService
{
    protected $client;
    public function __construct()
    {
        $this->client = new Client([
            'base_uri' => config('app.openai_base_uri'),
        ]);
    }

    public function getTranscription(Video $video): mixed
    {
        try {
            return 'transcription';

            if (is_null($video)) {
                return HttpStatusEnum::NOT_FOUND;
            }
            $output = null;
            if (Storage::disk(config('filesystems.storage_service'))->exists($video->video_name)) {
                $audioName = $video->audio_name;
                ini_set('max_execution_time', config('app.max_execution_time'));
                $audioPath = storage_path("app/public/{$audioName}");

                $command = config('app.transcription_from_whisper_python_script') . ' ' . $audioPath . ' ' . config('app.openai_api_key');
                $output = shell_exec($command);

                if ($output == "error" || is_null($output)) {
                    Log::error('Error in transcription python script');
                    return null;
                }
            }
            Log::alert($output);
            return $output;
        } catch (\Exception $e) {
            Log::error($e->getMessage());
            return HttpStatusEnum::ERROR;
        }
    }

    public function getSummary(string|null $transcription)
    {
        try {
            return 'summary';

            if ($transcription == WhisperFailedEnum::TRANSCRIPTION_FAILED->value) {
                return WhisperFailedEnum::SUMMARY_FAILED->value;
            }
            $prompt = GptPropmtsEnum::GET_SUMMARY_PROMPT->value . $transcription;

            $summary = $this->getGptResponse($prompt);

            Log::alert($summary);
            return $summary;
        } catch (\Exception $e) {
            Log::error($e->getMessage());
            return HttpStatusEnum::ERROR;
        }
    }

    public function generateQuiz(string|null $summary)
    {
        try {
            return 'quiz';

            if ($summary == WhisperFailedEnum::SUMMARY_FAILED->value) {
                return WhisperFailedEnum::QUIZ_FAILED->value;
            }
            $prompt = GptPropmtsEnum::GENERATE_QUIZ_PROMPT->value . $summary;
            $quiz = $this->getGptResponse($prompt);
            Log::alert($quiz);
            return $quiz;
        } catch (\Exception $e) {
            Log::error($e->getMessage());
            return HttpStatusEnum::ERROR;
        }
    }

    public function getChatResponse(string $message, array $chatHistory)
    {
        try {
            return 'chat response';

            return $this->getGptResponse(GptPropmtsEnum::GET_CHAT_RESPONSE_PROMPT->value . $message, $chatHistory);
        } catch (\Exception $e) {
            Log::error($e->getMessage());
            return HttpStatusEnum::ERROR;
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
            return HttpStatusEnum::ERROR;
        }
    }
}
