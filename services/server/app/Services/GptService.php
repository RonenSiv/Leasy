<?php

namespace App\Services;

use App\Models\Video;

use App\Enums\WhisperFailedEnum;
use App\Enums\JsonSchemesEnum;
use App\Enums\GptPropmtsEnum;
use App\Enums\HttpStatusEnum;
use App\Enums\DemoDataEnum;

use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Facades\Log;

use GuzzleHttp\Client;

class GptService
{
    public function getTranscription(Video $video): mixed
    {
        try {
            // return DemoDataEnum::DEMO_TRANSCRIPTION;

            $output = null;
            if (Storage::disk(config('filesystems.storage_service'))->exists($video->video_name)) {
                $audioName = $video->audio_name;
                ini_set('max_execution_time', config('app.max_execution_time'));
                $audioPath = storage_path("app/public/{$audioName}");

                $command = config('app.transcription_from_whisper_python_script') . ' ' . $audioPath . ' ' . config('app.openai_api_key');
                $output = shell_exec($command);

                if ($output == "error" || is_null($output)) {
                    Log::error('Error in transcription python script');
                    return HttpStatusEnum::ERROR;
                }
            }

            // Log::alert('Transcription: ' . $output);

            return $output;
        } catch (\Exception $e) {
            Log::error('GptService - getTranscription - ' . $e->getMessage());
            return HttpStatusEnum::ERROR;
        }
    }

    public function getSummary(string $transcription)
    {
        try {
            // return 'summary';

            $summary = $this->getGptResponse(GptPropmtsEnum::GET_SUMMARY_PROMPT->value . $transcription);

            // Log::alert('SUMMARY: ' . $summary);

            return $summary;
        } catch (\Exception $e) {
            Log::error('GptService - getSummary - ' . $e->getMessage());
            return HttpStatusEnum::ERROR;
        }
    }

    public function getMindMapJson(string $summary)
    {
        try {
            // return json_encode(self::DEMO_MIND_MAP);

            $mindMap = $this->getGptResponse(
                GptPropmtsEnum::GET_MIND_MAP->value . $summary,
                [],
                JsonSchemesEnum::MIND_MAP_JSON_SCHEMA_OPENAI,
                'generate_mind_map'
            );

            Log::alert('MIND MAP');
            Log::alert($mindMap);

            return json_encode($mindMap['mind_map'], JSON_UNESCAPED_UNICODE | JSON_PRETTY_PRINT);
        } catch (\Exception $e) {
            Log::error('GptService - getMindMapJson - ' . $e->getMessage());
            return HttpStatusEnum::ERROR;
        }
    }

    public function generateQuiz(string|null $summary)
    {
        try {
            // return DemoDataEnum::DEMO_QUIZ;

            $quiz = $this->getGptResponse(
                GptPropmtsEnum::GENERATE_QUIZ_PROMPT->value . $summary,
                [],
                JsonSchemesEnum::QUIZ_JSON_SCHEMA_OPENAI,
                'generate_quiz'
            );
            // Log::alert("Quiz");
            // Log::alert($quiz);

            return $quiz['quiz'];
        } catch (\Exception $e) {
            Log::error('GptService - generateQuiz - ' . $e->getMessage());
            return HttpStatusEnum::ERROR;
        }
    }

    public function getChatResponse(string $message, array $chatHistory)
    {
        try {
            // return 'chat response';

            return $this->getGptResponse($message, $chatHistory);
        } catch (\Exception $e) {
            Log::error('GptService - getChatResponse - ' . $e->getMessage());
            return HttpStatusEnum::ERROR;
        }
    }

    // ------------------- private Functions -------------------

    private function getGptResponse(string $prompt, array $chatHistory = [], array $jsonSchema = [], string $jsonSchemaFunctionName = '')
    {
        try {
            $client = new Client();

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

            $bodyRequest = [
                'headers' => [
                    'Authorization' => 'Bearer ' . config('app.openai_api_key'),
                    'Content-Type' => 'application/json'
                ],
                'json' => [
                    "model" => config('app.openai_model'),
                    'messages' => $messages,
                ],
                'verify' => false,
                'timeout' => 3000,
            ];

            if (!empty($jsonSchema) && !empty($jsonSchemaFunctionName)) {
                $bodyRequest['json']['functions'] = $jsonSchema;
                $bodyRequest['json']["function_call"] = ["name" => $jsonSchemaFunctionName];
            }

            $response = $client->post(config('app.openai_base_uri') . 'chat/completions', $bodyRequest);

            $responseData = json_decode($response->getBody(), true);

            if (isset($responseData['choices'][0]['message']['function_call'])) {
                Log::alert("ronen gay");
                Log::alert(json_decode($responseData['choices'][0]['message']['function_call']['arguments'], true));
                return json_decode($responseData['choices'][0]['message']['function_call']['arguments'], true);
            }

            return $responseData['choices'][0]['message']['content'];
        } catch (\Exception $e) {
            Log::error('GptService - getGptResponse - ' . $e->getMessage());
            return HttpStatusEnum::ERROR;
        }
    }
}
