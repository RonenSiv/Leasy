<?php

namespace App\Services;

use App\Models\Message;
use App\Models\Chat;

use App\Enums\HTTP_Status;
use App\Enums\SenderEnum;

use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Str;

class ChatService
{
    private GptService $gptService;
    public function __construct()
    {
        $this->gptService = new GptService();
    }

    public function storeChat(string $lectureTitle)
    {
        try {
            $newChat = Chat::create([
                'uuid' => Str::uuid(),
                'title' => $lectureTitle,
            ]);

            Message::create([
                'chat_id' => $newChat->id,
                'sender' => SenderEnum::ASSISTANT->value,
                'message' => "Hi! 😊 How can I help with your lecture today?",
            ]);


            return $newChat;
        } catch (\Exception $e) {
            Log::error($e->getMessage());
            return HTTP_Status::ERROR;
        }
    }

    public function sendMessageToChat(string $uuid, string $message)
    {
        try {
            DB::beginTransaction();

            $chat = Chat::with('messages')
                ->where('uuid', $uuid)
                ->first();

            $chatHistory = $chat->messages->map(function ($message) {
                return [
                    'role' => $message['sender'],
                    'content' => $message['message'],
                ];
            })->toArray();

            $maxMessages = 20;
            if (count($chatHistory) > $maxMessages) {
                $chatHistory = array_slice($chatHistory, -$maxMessages);
            }

            $chatResponse = $this->gptService->getChatResponse($message, $chatHistory);

            if ($chatResponse instanceof HTTP_Status) {
                Log::error('Error with GPT integration');
                return HTTP_Status::ERROR;
            }

            Message::insert([
                [
                    'chat_id' => $chat->id,
                    'sender' => SenderEnum::USER->value,
                    'message' => $message,
                    'created_at' => now(),
                    'updated_at' => now(),
                ],
                [
                    'chat_id' => $chat->id,
                    'sender' => SenderEnum::ASSISTANT->value,
                    'message' => $chatResponse,
                    'created_at' => now(),
                    'updated_at' => now(),
                ]
            ]);

            DB::commit();

            return $chatResponse;
        } catch (\Exception $e) {
            DB::rollBack();
            Log::error($e->getMessage());
            return HTTP_Status::ERROR;
        }
    }
}
