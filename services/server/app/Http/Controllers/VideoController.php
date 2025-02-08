<?php

namespace App\Http\Controllers;

use App\Services\VideoService;

use App\Enums\HttpStatusEnum;

use App\Http\Requests\UpdateLastWatchedTimeRequest;

use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
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
        $status = $this->videoService->updateLastWatchedTime(
            uuid: $uuid,
            lastWatchedTime: $request->last_watched_time,
        );

        return match ($status) {
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
        $status = $this->videoService->fixAudio(
            uuid: $uuid,
        );

        return match ($status) {
            HttpStatusEnum::ERROR => response()->json(['message' => 'An error occurred'], Response::HTTP_INTERNAL_SERVER_ERROR),
            HttpStatusEnum::NOT_FOUND => response()->json(['message' => 'Video Not Found'], Response::HTTP_NOT_FOUND),
            HttpStatusEnum::OK => response()->json(['message' => 'Audio fixed successfully'], Response::HTTP_OK),
            default => response()->json(['message' => 'no content'], Response::HTTP_NO_CONTENT)
        };
    }

    /**
     * @OA\Get(
     *     path="/api/video/stream/{uuid}",
     *     summary="Stream a video file",
     *     description="Streams a video file stored on the server. Supports range requests for efficient playback.",
     *     operationId="streamVideo",
     *     tags={"Videos"},
     *     @OA\Parameter(
     *         name="uuid",
     *         in="path",
     *         required=true,
     *         description="The UUID of the video to stream",
     *         @OA\Schema(type="string", format="uuid")
     *     ),
     *     @OA\Response(
     *         response=200,
     *         description="Full video stream",
     *         @OA\Header(header="Content-Type", description="MIME type of the video", @OA\Schema(type="string")),
     *         @OA\Header(header="Accept-Ranges", description="Indicates byte-range support", @OA\Schema(type="string")),
     *         @OA\Header(header="Content-Length", description="Total file size", @OA\Schema(type="integer")),
     *         @OA\Header(header="Content-Range", description="Byte range for partial content", @OA\Schema(type="string")),
     *         @OA\MediaType(
     *             mediaType="video/mp4",
     *             @OA\Schema(type="string", format="binary")
     *         )
     *     ),
     *     @OA\Response(
     *         response=206,
     *         description="Partial video stream (for range requests)",
     *         @OA\Header(header="Content-Range", description="Byte range served", @OA\Schema(type="string")),
     *         @OA\MediaType(
     *             mediaType="video/mp4",
     *             @OA\Schema(type="string", format="binary")
     *         )
     *     ),
     *     @OA\Response(
     *         response=404,
     *         description="Video not found",
     *     ),
     *     @OA\Response(
     *         response=500,
     *         description="Internal server error",
     *     ),
     * )
     */

    public function streamVideo(string $uuid, Request $request)
    {
        $storagePath = $this->videoService->streamVideo(
            uuid: $uuid,
        );

        if ($storagePath instanceof HttpStatusEnum) {
            return match ($storagePath) {
                HttpStatusEnum::ERROR => response()->json(['message' => 'An error occurred'], Response::HTTP_INTERNAL_SERVER_ERROR),
                HttpStatusEnum::NOT_FOUND => response()->json(['message' => 'Video not found'], Response::HTTP_NOT_FOUND),
                default => response()->json(['message' => 'No content'], Response::HTTP_NO_CONTENT)
            };
        }

        $fileSize = filesize($storagePath);

        $mimeType = mime_content_type($storagePath);

        $headers = [
            'Content-Type' => $mimeType,
            'Accept-Ranges' => 'bytes',
        ];

        // Handle Range Requests
        if ($request->header('Range')) {
            list(, $range) = explode('=', $request->header('Range'), 2);
            list($start, $end) = explode('-', $range);

            $start = (int)$start;
            $end = ($end !== '') ? (int)$end : ($fileSize - 1);
            $length = $end - $start + 1;

            $headers += [
                'Content-Length' => $length,
                'Content-Range' => "bytes $start-$end/$fileSize",
            ];

            return response()->stream(function () use ($storagePath, $start, $length) {
                $handle = fopen($storagePath, 'rb');
                fseek($handle, $start);
                echo fread($handle, $length);
                fclose($handle);
            }, Response::HTTP_PARTIAL_CONTENT, $headers);
        }

        // Return Full Video if No Range Request
        return response()->stream(function () use ($storagePath) {
            readfile($storagePath);
        }, Response::HTTP_OK, $headers + ['Content-Length' => $fileSize]);
    }

    /**
     * @OA\Get(
     *     path="/api/video/preview/{uuid}",
     *     summary="Get the preview image for a video",
     *     description="Retrieves the preview image associated with a given video UUID.",
     *     operationId="getPreviewImage",
     *     tags={"Videos"},
     *     @OA\Parameter(
     *         name="uuid",
     *         in="path",
     *         required=true,
     *         description="The UUID of the video to retrieve the preview image for",
     *         @OA\Schema(type="string", format="uuid")
     *     ),
     *     @OA\Response(
     *         response=200,
     *         description="Successful response with the preview image",
     *         @OA\Header(header="Content-Type", description="Image MIME type", @OA\Schema(type="string")),
     *         @OA\MediaType(
     *             mediaType="image/jpeg",
     *             @OA\Schema(type="string", format="binary")
     *         )
     *     ),
     *     @OA\Response(
     *         response=404,
     *         description="Video not found",
     *     ),
     *     @OA\Response(
     *         response=500,
     *         description="Internal server error",
     *     )
     * )
     */

    public function getPreviewImage(string $uuid)
    {
        $storagePath = $this->videoService->getPreviewImage(
            uuid: $uuid,
        );

        if ($storagePath instanceof HttpStatusEnum) {
            return match ($storagePath) {
                HttpStatusEnum::ERROR => response()->json(['message' => 'An error occurred'], Response::HTTP_INTERNAL_SERVER_ERROR),
                HttpStatusEnum::NOT_FOUND => response()->json(['message' => 'Video not found'], Response::HTTP_NOT_FOUND),
                default => response()->json(['message' => 'No content'], Response::HTTP_NO_CONTENT)
            };
        }

        $mimeType = mime_content_type($storagePath);

        return response()->file($storagePath, ['Content-Type' => $mimeType]);
    }
}
