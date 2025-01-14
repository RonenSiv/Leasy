<?php

namespace App\Http\Controllers;

use App\Enums\HTTP_Status;
use App\Http\Requests\UpdateLastWatchedTimeRequest;
use App\Services\VideoService;

use Symfony\Component\HttpFoundation\Response;

use Illuminate\Http\JsonResponse;

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
            HTTP_Status::OK => response()->json(['message' => 'last watched time update successfully'], Response::HTTP_OK),
            HTTP_Status::NOT_FOUND => response()->json(['message' => 'Video not found'], Response::HTTP_INTERNAL_SERVER_ERROR),
            HTTP_Status::ERROR => response()->json(['message' => 'An error occurred'], Response::HTTP_INTERNAL_SERVER_ERROR),
            default => response()->json(['message' => 'no content'], Response::HTTP_NO_CONTENT)
        };
    }
}
