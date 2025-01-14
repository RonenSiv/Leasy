<?php

namespace App\Services;

use App\Models\Chat;

use App\Enums\HTTP_Status;

use Illuminate\Support\Facades\Log;
use Illuminate\Support\Str;

class ChatService
{
    public function storeChat(string $lectureTitle)
    {
        try {
            $newChat = Chat::create([
                'uuid' => Str::uuid(),
                'title' => $lectureTitle,
            ]);

            return $newChat;
        } catch (\Exception $e) {
            Log::error($e->getMessage());
            return HTTP_Status::ERROR;
        }
    }
}
