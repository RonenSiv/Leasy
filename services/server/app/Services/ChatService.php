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
                'sender' => SenderEnum::BOT->value,
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

            $chat = Chat::where('uuid', $uuid)->first();

            Message::create([
                'chat_id' => $chat->id,
                'sender' => SenderEnum::USER->value,
                'message' => $message,
            ]);

            $chatResponse = $this->gptService->getChatResponse($message);

            Message::create([
                'chat_id' => $chat->id,
                'sender' => SenderEnum::BOT->value,
                'message' => $chatResponse,
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
