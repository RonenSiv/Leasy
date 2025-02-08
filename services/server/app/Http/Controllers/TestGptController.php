<?php

namespace App\Http\Controllers;

use Illuminate\Http\Response;
use Illuminate\Http\Request;
use GuzzleHttp\Client;

class TestGptController extends Controller
{
    /**
     * @OA\Post(
     *     path="/api/test/ai",
     *     summary="Test AI API",
     *     description="Send a prompt to the AI API and receive a response.",
     *     operationId="testAI",
     *     tags={"AI"},
     *     @OA\RequestBody(
     *         required=true,
     *         @OA\JsonContent(
     *             required={"prompt"},
     *             @OA\Property(property="prompt", type="string", description="The prompt to send to GPT API.")
     *         )
     *     ),
     *     @OA\Response(
     *         response=200,
     *         description="Success",
     *     ),
     *     @OA\Response(
     *         response=400,
     *         description="Bad request",
     *     ),
     *     @OA\Response(
     *         response=500,
     *         description="Internal server error",
     *     )
     * )
     */

    public function testAi(Request $request)
    {
        try {

            $jsonSchema = [
                'type' => 'json_schema',
                'json_schema' => [
                    'name' => 'quiz',
                    'strict' => true,
                    'schema' => [
                        'type' => 'array',
                        'items' => [
                            'type' => 'object',
                            'properties' => [
                                'question' => ['type' => 'string'],
                                'options' => [
                                    'type' => 'object',
                                    'patternProperties' => [
                                        '^[1-9][0-9]*$' => ['type' => 'string']
                                    ],
                                    'additionalProperties' => false
                                ],
                                'correct_answer' => ['type' => 'integer']
                            ],
                            'required' => ['question', 'options', 'correct_answer']
                        ]
                    ]
                ]
            ];


            $client = new Client();
            $response = $client->post(config('app.openrouter_base_uri') . 'chat/completions', [
                'headers' => [
                    'Authorization' => 'Bearer ' . config('app.openrouter_api_key'),
                    'Content-Type' => 'application/json'
                ],
                'json' => [
                    "model" => config('app.deepseek_model'),
                    "messages" => [
                        [
                            "role" => "user",
                            "content" => $request->prompt
                        ]
                    ]
                ],
                'verify' => false,
                'response_format' => ['type' => 'json_schema', 'json_schema' => $jsonSchema],
            ]);

            $responseData = json_decode($response->getBody(), true);

            $answer = $responseData['choices'][0]['message']['content'];

            return response()->json($answer, Response::HTTP_OK);
        } catch (\Exception $e) {
            return ['error' => $e->getMessage()];
        }
    }
}
