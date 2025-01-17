<?php

namespace App\Http\Controllers;

use App\Enums\HTTP_Status;
use App\Http\Requests\SendMessageToChatRequest;
use App\Services\ChatService;
use GuzzleHttp\Client;
use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Component\HttpFoundation\Response;

class ChatController extends Controller
{
    private ChatService $chatService;
    protected $client;

    public function __construct()
    {
        $this->chatService = new ChatService();
        // TEST - DELETE
        $this->client = new Client([
            'base_uri' => config('app.openai_base_uri'),
        ]);
    }

    // TEST - DELETE
    public function testGPT()
    {
        try {
            $message = 'write to me Ofir in Hebrew';
            $response = $this->client->post('chat/completions', [
                'headers' => [
                    'Authorization' => 'Bearer ' . config('app.openai_api_key')
                ],
                'json' => [
                    'model' => config('app.openai_model'),
                    'messages' => [
                        ['role' => 'system', 'content' => 'You are a helpful assistant.'],
                        ['role' => 'user', 'content' => $message],
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
            return ['error' => $e->getMessage()];
        }
    }

    /**
     * @OA\Post(
     *     path="/api/chat/send-message/{uuid}",
     *     summary="Send a message to a chat",
     *     description="Sends a message to a specific chat identified by its UUID.",
     *     tags={"Chat"},
     *     @OA\Parameter(
     *         name="uuid",
     *         in="path",
     *         description="The UUID of the chat",
     *         required=true,
     *         @OA\Schema(type="string", format="uuid")
     *     ),
     *     @OA\RequestBody(
     *         required=true,
     *         @OA\JsonContent(
     *             @OA\Property(property="message", type="string", example="Hello, how are you?")
     *         )
     *     ),
     *     @OA\Response(
     *         response=201,
     *         description="Message sent successfully"
     *     ),
     *     @OA\Response(
     *         response=404,
     *         description="Chat not found"
     *     ),
     *     @OA\Response(
     *         response=500,
     *         description="An error occurred"
     *     ),
     *     @OA\Response(
     *         response=204,
     *         description="No content"
     *     )
     * )
     */

    public function sendMessageToChat(string $uuid, SendMessageToChatRequest $request): JsonResponse
    {
        $result = $this->chatService->sendMessageToChat(
            uuid: $uuid,
            message: $request->message,
        );

        if ($result instanceof HTTP_Status) {
            return match ($result) {
                HTTP_Status::ERROR => response()->json(['message' => 'An error occurred'], Response::HTTP_INTERNAL_SERVER_ERROR),
                HTTP_Status::NOT_FOUND => response()->json(['message' => 'Chat not found'], Response::HTTP_NOT_FOUND),
                default => response()->json(['message' => 'no content'], Response::HTTP_NO_CONTENT)
            };
        }

        return response()->json(['message' => 'Message sent successfully', 'response' => $result], Response::HTTP_CREATED);
    }
}
