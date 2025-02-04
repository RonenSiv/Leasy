<?php

namespace App\Http\Controllers;

use App\Services\VideoService;

use App\Enums\HttpStatusEnum;

use App\Http\Requests\UpdateLastWatchedTimeRequest;

use Illuminate\Http\JsonResponse;

use Symfony\Component\HttpFoundation\Response;

class VideoController extends Controller
{
    private VideoService $videoService;
    public function __construct()
    {
        $this->videoService = new VideoService();
    }

    /**
     * @OA\Put(
     *     path="/api/video/last-watched-time/{uuid}",
     *     summary="Update the last watched time for a video",
     *     description="Updates the last watched time for a specific video using the provided video UUID.",
     *     tags={"Videos"},
     *     @OA\Parameter(
     *         name="uuid",
     *         in="path",
     *         required=true,
     *         description="The UUID of the video to update the last watched time",
     *         @OA\Schema(type="string")
     *     ),
     *     @OA\RequestBody(
     *         required=true,
     *         description="The last watched time to update",
     *         @OA\JsonContent(
     *             type="object",
     *             @OA\Property(
     *                 property="last_watched_time",
     *                 type="integer",
     *                 example=120 
     *             )
     *         )
     *     ),
     *     @OA\Response(
     *         response=200,
     *         description="Last watched time updated successfully"
     *     ),
     *     @OA\Response(
     *         response=404,
     *         description="Video not found"
     *     ),
     *     @OA\Response(
     *         response=500,
     *         description="Internal server error"
     *     ),
     *     @OA\Response(
     *         response=204,
     *         description="No content"
     *     )
     * )
     */

    public function updateLastWatchedTime(string $uuid, UpdateLastWatchedTimeRequest $request): JsonResponse
    {
        $result = $this->videoService->updateLastWatchedTime(
            uuid: $uuid,
            lastWatchedTime: $request->last_watched_time,
        );

        return match ($result) {
            HttpStatusEnum::NOT_FOUND => response()->json(['message' => 'Video not found'], Response::HTTP_INTERNAL_SERVER_ERROR),
            HttpStatusEnum::ERROR => response()->json(['message' => 'An error occurred'], Response::HTTP_INTERNAL_SERVER_ERROR),
            HttpStatusEnum::OK => response()->json(['message' => 'last watched time update successfully'], Response::HTTP_OK),
            default => response()->json(['message' => 'no content'], Response::HTTP_NO_CONTENT)
        };
    }

    /**
     * @OA\Put(
     *     path="/api/video/fix-audio/{uuid}",
     *     summary="Fix audio of a video",
     *     description="Fixes the audio issues of the specified video.",
     *     tags={"Videos"},
     *     @OA\Parameter(
     *         name="uuid",
     *         in="path",
     *         description="The UUID of the video to fix audio",
     *         required=true,
     *         @OA\Schema(type="string", format="uuid")
     *     ),
     *     @OA\Response(
     *         response=200,
     *         description="Audio fixed successfully"
     *     ),
     *     @OA\Response(
     *         response=404,
     *         description="Video not found"
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

    public function fixAudio(string $uuid): JsonResponse
    {
        $result = $this->videoService->fixAudio(
            uuid: $uuid,
        );

        if ($result instanceof HttpStatusEnum) {
            return match ($result) {
                HttpStatusEnum::ERROR => response()->json(['message' => 'An error occurred'], Response::HTTP_INTERNAL_SERVER_ERROR),
                HttpStatusEnum::NOT_FOUND => response()->json(['message' => 'Video Not Found'], Response::HTTP_NOT_FOUND),
                HttpStatusEnum::OK => response()->json(['message' => 'Audio fixed successfully'], Response::HTTP_OK),
                default => response()->json(['message' => 'no content'], Response::HTTP_NO_CONTENT)
            };
        }
    }
}
