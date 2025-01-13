<?php

namespace App\Http\Controllers;

use App\Enums\HTTP_Status;
use App\Http\Requests\StoreVideoRequest;
use App\services\VideoService;
use Illuminate\Http\Request;
use Symfony\Component\HttpFoundation\Response;
use Illuminate\Http\JsonResponse;

class VideoController extends Controller
{
    private VideoService $service;
    public function __construct()
    {
        $this->service = new VideoService();
    }
    /**
     * @OA\Post(
     *      path="/api/videos",
     *      operationId="store video",
     *      tags={"Videos"},
     *      summary="Store a video",
     *      description="Store a video with the provided name",
     *      @OA\RequestBody(
     *          required=true,
     *          @OA\MediaType(
     *              mediaType="multipart/form-data",
     *              @OA\Schema(
     *                  required={"video"},
     *                  @OA\Property(
     *                      property="video",
     *                      type="string",
     *                      format="binary",
     *                      description="The video file to upload"
     *                  )
     *              )
     *          )
     *      ),
     *      @OA\Response(
     *          response=201,
     *          description="Video uploaded successfully",
     *      ),
     *      @OA\Response(
     *          response=500,
     *          description="An error occurred while fetching the user",
     *      )
     * )
     *
     * @param  StoreUnitRequest  $request
     * @return \Illuminate\Http\JsonResponse
     */

    public function store(StoreVideoRequest $request): JsonResponse
    {
        $result = $this->service->store(
            video: $request->file('video'),
        );

        if ($result instanceof HTTP_Status) {
            return match ($result) {
                HTTP_Status::ERROR => response()->json('אירעה שגיאה בעת העלאה', Response::HTTP_INTERNAL_SERVER_ERROR),
                default => response()->json('', Response::HTTP_NO_CONTENT)
            };
        }

        return response()->json(['message' => 'Video uploaded successfully', 'uuid' => $result], Response::HTTP_CREATED);
    }
}
