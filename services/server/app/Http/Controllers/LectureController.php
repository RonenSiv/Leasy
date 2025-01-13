<?php

namespace App\Http\Controllers;

use App\Enums\HTTP_Status;
use App\Http\Requests\StoreLectureRequest;
use App\Services\LectureService;
use Symfony\Component\HttpFoundation\Response;
use Illuminate\Http\JsonResponse;

class LectureController extends Controller
{
    private LectureService $lectureService;
    public function __construct()
    {
        $this->lectureService = new LectureService();
    }

    /**
     * @OA\Post(
     *      path="/api/lecture",
     *      operationId="store new lecture",
     *      tags={"Lectures"},
     *      summary="Store a new lecture",
     *      description="Store a lecture with the provided details",
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
     *          description="lecture created successfully",
     *      ),
     *      @OA\Response(
     *          response=500,
     *          description="An error occurred",
     *      )
     * )
     *
     * @param  StoreUnitRequest  $request
     * @return \Illuminate\Http\JsonResponse
     */

    public function store(StoreLectureRequest $request): JsonResponse
    {
        $result = $this->lectureService->store(
            video: $request->file('video'),
        );

        if ($result instanceof HTTP_Status) {
            return match ($result) {
                HTTP_Status::ERROR => response()->json(['message' => 'An error occurred'], Response::HTTP_INTERNAL_SERVER_ERROR),
                default => response()->json('', Response::HTTP_NO_CONTENT)
            };
        }

        return response()->json(['message' => 'lecture created successfully', 'uuid' => $result], Response::HTTP_CREATED);
    }
}
