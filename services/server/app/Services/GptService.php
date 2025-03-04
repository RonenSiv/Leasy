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

            Log::alert('Transcription: ' . $output);

            return $output;
        } catch (\Exception $e) {
            Log::error($e->getMessage());
            return HttpStatusEnum::ERROR;
        }
    }

    public function getSummary(string $transcription)
    {
        try {
            // return 'summary';

            $summary = $this->getGptResponse(GptPropmtsEnum::GET_SUMMARY_PROMPT->value . $transcription);

            Log::alert('SUMMARY: ' . $summary);

            return $summary;
        } catch (\Exception $e) {
            Log::error($e->getMessage());
            return HttpStatusEnum::ERROR;
        }
    }

    public function getMindMapJson(string $summary)
    {
        // return json_encode(self::DEMO_MIND_MAP);

        $mindMap = $this->getGptResponse(
            GptPropmtsEnum::GET_MIND_MAP->value . $summary,
            [],
            JsonSchemesEnum::MIND_MAP_JSON_SCHEMA
        );

        if (preg_match('/```json\n(.*?)\n```/s', $mindMap, $matches)) {
            $jsonMindMap = $matches[1];
            return json_encode($jsonMindMap);
        }

        $mindMapJson = json_encode($mindMap);

        Log::alert('MIND MAP: ' . $mindMapJson);

        return $mindMapJson;
    }

    public function generateQuiz(string|null $summary)
    {
        try {
            // return DemoDataEnum::DEMO_QUIZ;

            $quiz = $this->getGptResponse(
                GptPropmtsEnum::GENERATE_QUIZ_PROMPT->value . $summary,
                [],
                JsonSchemesEnum::QUIZ_JSON_SCHEMA
            );

            Log::alert('QUIZ ' . $quiz);

            $quiz = trim($quiz);
            $quiz = preg_replace('/^```php\s*/', '', $quiz); // Remove the opening '```php'
            $quiz = preg_replace('/\s*```$/', '', $quiz); // Remove the closing '```'

            // Step 2: Escape single quotes inside string values to prevent breaking
            $quizString = preg_replace_callback("/'([^']+)'/", function ($matches) {
                // Escape any single quotes within the string
                return "'" . str_replace("'", "\'", $matches[1]) . "'";
            }, $quiz);

            // Step 3: Replace single quotes around values (but not keys) with double quotes
            $quizString = preg_replace("/'(\w+)'(\s*=>\s*)'([^']+)'/", '"$1"$2"$3"', $quizString);

            // Step 4: Use eval() to parse the string into an actual PHP array
            $quizArray = null;
            eval('$quizArray = ' . $quizString . ';');

            return $quizArray;
        } catch (\Exception $e) {
            Log::error($e->getMessage());
            return HttpStatusEnum::ERROR;
        }
    }

    public function getChatResponse(string $message, array $chatHistory)
    {
        try {
            // return 'chat response';

            return $this->getGptResponse($message, $chatHistory);
        } catch (\Exception $e) {
            Log::error($e->getMessage());
            return HttpStatusEnum::ERROR;
        }
    }

    // ------------------- private Functions -------------------

    private function getGptResponse(string $prompt, array $chatHistory = [], array $jsonSchema = [])
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
                    'Authorization' => 'Bearer ' . config('app.openrouter_api_key'),
                    'Content-Type' => 'application/json'
                ],
                'json' => [
                    "model" => config('app.deepseek_model'),
                    'messages' => $messages,
                    // 'max_tokens' => config('app.openai_max_tokens'),
                    // 'temperature' => config('app.openai_temperature'),
                ],
                'verify' => false,
                'timeout' => 3000,
            ];

            if (!empty($jsonSchema)) {
                $bodyRequest['json']['response_format'] = ['type' => 'json_schema', 'json_schema' => $jsonSchema];
            }

            $response = $client->post(config('app.openrouter_base_uri') . 'chat/completions', $bodyRequest);

            $responseData = json_decode($response->getBody(), true);
            $answer = $responseData['choices'][0]['message']['content'];

            return $answer;
        } catch (\Exception $e) {
            Log::error($e->getMessage());
            return HttpStatusEnum::ERROR;
        }
    }
}
