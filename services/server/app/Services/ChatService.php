<?php

namespace App\Services;

use App\Models\Message;
use App\Models\Chat;

use App\Enums\PaginationEnum;
use App\Enums\HttpStatusEnum;
use App\Enums\SenderEnum;

use App\Http\Resources\MessageResource;

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
            return HttpStatusEnum::ERROR;
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

            if ($chatResponse instanceof HttpStatusEnum) {
                Log::error('Error with GPT integration');
                return HttpStatusEnum::ERROR;
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
            return HttpStatusEnum::ERROR;
        }
    }

    public function getChatMessages(string $uuid)
    {
        try {
            $chatId = Chat::where('uuid', $uuid)->value('id');

            $messages = Message::where('chat_id', $chatId)
                ->orderBy('id', 'desc')
                ->paginate(PaginationEnum::MESSAGES_PER_PAGE->value);

            return  MessageResource::collection($messages);
        } catch (\Exception $e) {
            Log::error($e->getMessage());
            return HttpStatusEnum::ERROR;
        }
    }
}
