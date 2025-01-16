<?php

namespace App\Http\Controllers;

use App\Services\ChatService;
use GuzzleHttp\Client;

class ChatController extends Controller
{
    private ChatService $chatService;
    protected $client;

    public function __construct()
    {
        $this->chatService = new ChatService();
        // TEST - DELETE
        // $this->client = new Client([
        //     'base_uri' => config('app.openai_base_uri'),
        // ]);
    }

    // TEST - DELETE
    // public function getChatResponse()
    // {
    //     try {
    //         $message = 'write to me Ofir in Hebrew';
    //         $response = $this->client->post('chat/completions', [
    //             'headers' => [
    //                 'Authorization' => 'Bearer ' . config('app.openai_api_key')
    //             ],
    //             'json' => [
    //                 'model' => config('app.openai_model'),
    //                 'messages' => [
    //                     ['role' => 'system', 'content' => 'You are a helpful assistant.'],
    //                     ['role' => 'user', 'content' => $message],
    //                 ],
    //                 'max_tokens' => config('app.openai_max_tokens'),
    //                 'temperature' => config('app.openai_temperature'),
    //             ],
    //             'verify' => false,
    //         ]);

    //         $respnseData = json_decode($response->getBody(), true);
    //         $answer = $respnseData['choices'][0]['message']['content'];

    //         return $answer;
    //     } catch (\Exception $e) {
    //         return ['error' => $e->getMessage()];
    //     }
    // }
}
