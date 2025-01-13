<?php

namespace App\Http\Controllers;

use App\Services\ChatService;
use Illuminate\Http\Request;

class ChatController extends Controller
{
    private ChatService $chatService;
    public function __construct()
    {
        $this->chatService = new ChatService();
    }
}
