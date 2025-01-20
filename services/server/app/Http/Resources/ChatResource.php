<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class ChatResource extends JsonResource
{
    /**
     * Transform the resource into an array.
     *
     * @return array<string, mixed>
     */
    public function toArray(Request $request): array
    {
        return [
            'uuid' => $this->uuid,
            'title' => $this->title,
            // 'messages' => $this->messages->map(function ($message) {
            //     return [
            //         'sender' => $message->sender,
            //         'message' => $message->message,
            //         'sent_at' => $message->created_at,
            //     ];
            // }),
        ];
    }
}
