<?php

namespace App\Http\Controllers;

use App\Services\ChatService;

use App\Enums\HttpStatusEnum;

use App\Http\Requests\SendMessageToChatRequest;

use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Component\HttpFoundation\Response;

class ChatController extends Controller
{
    private ChatService $chatService;
    protected $client;

    public function __construct()
    {
        $this->chatService = new ChatService();
    }

    /**
     * @OA\Post(
     *     path="/api/chat/send-message/{uuid}",
     *     summary="Send a message to a chat",
     *     description="Sends a message to a specific chat identified by its UUID.",
     *     tags={"Chats"},
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

        if ($result instanceof HttpStatusEnum) {
            return match ($result) {
                HttpStatusEnum::ERROR => response()->json(['message' => 'An error occurred'], Response::HTTP_INTERNAL_SERVER_ERROR),
                HttpStatusEnum::NOT_FOUND => response()->json(['message' => 'Chat not found'], Response::HTTP_NOT_FOUND),
                default => response()->json(['message' => 'No content'], Response::HTTP_NO_CONTENT)
            };
        }

        return response()->json(['data' => $result], Response::HTTP_CREATED);
    }

    /**
     * @OA\Get(
     *     path="/api/chat/messages/{uuid}",
     *     description="Retrieve messages records. Supports pagination.",
     *     operationId="getChatMessages",
     *     tags={"Chats"},
     *     @OA\Parameter(
     *         name="uuid",
     *         in="path",
     *         required=true,
     *         description="The UUID of the chat",
     *         @OA\Schema(type="string")
     *     ),
     *     @OA\Parameter(
     *         name="page",
     *         in="query",
     *         required=false,
     *         description="Page number for pagination.",
     *         @OA\Schema(type="integer", example=1)
     *     ),
     *     @OA\Response(
     *         response=200,
     *         description="Successful response with messages of the chat",
     *     ),
     *     @OA\Response(
     *         response=204,
     *         description="No content"
     *     ),
     *     @OA\Response(
     *         response=500,
     *         description="An error occurred"
     *     )
     * )
     */
    public function getChatMessages(string $uuid)
    {
        $result = $this->chatService->getChatMessages(
            uuid: $uuid,
        );

        if ($result instanceof HttpStatusEnum) {
            return match ($result) {
                HttpStatusEnum::ERROR => response()->json(['message' => 'An error occurred'], Response::HTTP_INTERNAL_SERVER_ERROR),
                HttpStatusEnum::NOT_FOUND => response()->json(['message' => 'Chat not found'], Response::HTTP_NOT_FOUND),
                default => response()->json(['message' => 'No content'], Response::HTTP_NO_CONTENT)
            };
        }

        return response()->json(['data' => $result], Response::HTTP_OK);
    }
}
