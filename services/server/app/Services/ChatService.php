<?php

namespace App\Services;

use Illuminate\Support\Str;

use App\Models\Chat;

class ChatService
{
    public function storeChat(string $lectureTitle)
    {
        $newChat = Chat::create([
            'uuid' => Str::uuid(),
            'title' => $lectureTitle,
        ]);

        return $newChat;
    }
}
