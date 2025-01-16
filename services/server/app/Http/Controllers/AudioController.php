<?php

namespace App\Http\Controllers;

use App\Services\AudioService;
use App\Enums\HTTP_Status;
use Illuminate\Http\JsonResponse;
use Symfony\Component\HttpFoundation\Response;

class AudioController extends Controller
{
    private AudioService $audioService;
    public function __construct()
    {
        $this->audioService = new AudioService();
    }

    // TODO: add swagger
    public function fixAudio(string $videoUuid): JsonResponse
    {
        $result = $this->audioService->fixAudio(
            videoUuid: $videoUuid,
        );

        if ($result instanceof HTTP_Status) {
            return match ($result) {
                HTTP_Status::ERROR => response()->json(['message' => 'An error occurred'], Response::HTTP_INTERNAL_SERVER_ERROR),
                HTTP_Status::NOT_FOUND => response()->json(['message' => 'Video Not Found'], Response::HTTP_NOT_FOUND),
                HTTP_Status::OK => response()->json(['message' => 'Audio fixed successfully'], Response::HTTP_OK),
                default => response()->json(['message' => 'no content'], Response::HTTP_NO_CONTENT)
            };
        }
    }
}
