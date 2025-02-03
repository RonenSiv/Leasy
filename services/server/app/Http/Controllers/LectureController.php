<?php

namespace App\Http\Controllers;

use App\Services\LectureService;

use App\Enums\HTTP_Status;

use App\Http\Requests\StoreLectureRequest;

use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

use Symfony\Component\HttpFoundation\Response;

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
     *      tags={"Lectures"},
     *      description="Store a lecture with the provided details",
     *      operationId="postLecture",
     *      @OA\RequestBody(
     *          required=true,
     *          @OA\MediaType(
     *              mediaType="multipart/form-data",
     *              @OA\Schema(
     *                  required={"video", "title", "description"},
     *                  @OA\Property(
     *                      property="video",
     *                      type="string",
     *                      format="binary",
     *                      description="The video file to upload"
     *                  ),
     *                  @OA\Property(
     *                      property="title",
     *                      type="string",
     *                      description="The title of the lecture",
     *                      example="Introduction to Physics"
     *                  ),
     *                  @OA\Property(
     *                      property="description",
     *                      type="string",
     *                      description="The description of the lecture",
     *                      example="An introductory lecture on the fundamentals of physics."
     *                  )
     *              )
     *          )
     *      ),
     *      @OA\Response(
     *          response=201,
     *          description="Lecture created successfully",
     *      ),
     *      @OA\Response(
     *          response=500,
     *          description="An error occurred",
     *      ),
     *      @OA\Response(
     *          response=204,
     *          description="No content"
     *      )
     * )
     *
     * @param  StoreLectureRequest  $request
     * @return \Illuminate\Http\JsonResponse
     */

    public function store(StoreLectureRequest $request): JsonResponse
    {
        $result = $this->lectureService->store(
            video: $request->file('video'),
            title: $request->title,
            description: $request->description,
        );

        if ($result instanceof HTTP_Status) {
            return match ($result) {
                HTTP_Status::ERROR => response()->json(['message' => 'An error occurred'], Response::HTTP_INTERNAL_SERVER_ERROR),
                default => response()->json(['message' => 'no content'], Response::HTTP_NO_CONTENT)
            };
        }

        return response()->json(['message' => 'lecture created successfully', 'data' => $result], Response::HTTP_CREATED);
    }

    /**
     * @OA\Get(
     *     path="/api/lecture/{uuid}",
     *     description="Fetch detailed information about a specific lecture using its UUID.",
     *     operationId="getLecture",
     *     tags={"Lectures"},
     *     @OA\Parameter(
     *         name="uuid",
     *         in="path",
     *         required=true,
     *         description="The UUID of the lecture",
     *         @OA\Schema(type="string")
     *     ),
     *     @OA\Response(
     *         response=200,
     *         description="Successful response with lecture data",
     *     ),
     *     @OA\Response(
     *         response=404,
     *         description="Lecture not found",
     *     ),
     *     @OA\Response(
     *         response=500,
     *         description="An error occurred",
     *     )
     * )
     */

    public function show(string $uuid): JsonResponse
    {
        $result = $this->lectureService->show(
            uuid: $uuid
        );

        if ($result instanceof HTTP_Status) {
            return match ($result) {
                HTTP_Status::NOT_FOUND => response()->json(['message' => 'Lecture not found'], Response::HTTP_INTERNAL_SERVER_ERROR),
                HTTP_Status::ERROR => response()->json(['message' => 'An error occurred'], Response::HTTP_INTERNAL_SERVER_ERROR),
                default => response()->json(['message' => 'no content'], Response::HTTP_NO_CONTENT)
            };
        }

        return response()->json(['data' => $result], Response::HTTP_OK);
    }

    /**
     * @OA\Get(
     *     path="/api/lecture",
     *     description="Retrieve lecture records. Supports pagination and sorting.",
     *     operationId="getLectures",
     *     tags={"Lectures"},
     *     @OA\Parameter(
     *         name="page",
     *         in="query",
     *         required=false,
     *         description="Page number for pagination.",
     *         @OA\Schema(type="integer", example=2)
     *     ),
     *     @OA\Parameter(
     *         name="search_by_title",
     *         in="query",
     *         required=false,
     *         description="Search lectures by title prefix (e.g., 'Intro' matches 'Introduction to Physics').",
     *         @OA\Schema(type="string", example="Intro")
     *     ),
     *     @OA\Parameter(
     *         name="sort_by",
     *         in="query",
     *         required=false,
     *         description="Sort by column (e.g., 'date', 'name', 'progress').",
     *         @OA\Schema(type="string", enum={"date", "name", "progress"})
     *     ),
     *     @OA\Parameter(
     *         name="sort_direction",
     *         in="query",
     *         required=false,
     *         description="Sort direction (e.g., 'asc', 'desc').",
     *         @OA\Schema(type="string", enum={"asc", "desc"})
     *     ),
     *     @OA\Response(
     *         response=200,
     *         description="Successful response with lectures data",
     *     ),
     *     @OA\Response(
     *         response=204,
     *         description="No content"
     *     ),
     *     @OA\Response(
     *         response=500,
     *         description="An error occurred"
     *     )
     * )
     */

    public function index(Request $request): JsonResponse
    {
        $result = $this->lectureService->index(
            searchByTitle: $request->query('search_by_title', null),
            sortBy: $request->query('sort_by', 'date'),
            sortDirection: $request->query('sort_direction', 'asc')
        );

        if ($result instanceof HTTP_Status) {
            return match ($result) {
                HTTP_Status::ERROR => response()->json(['message' => 'An error occurred'], Response::HTTP_INTERNAL_SERVER_ERROR),
                default => response()->json(['message' => 'no content'], Response::HTTP_NO_CONTENT)
            };
        }

        return response()->json(['data' => $result], Response::HTTP_OK);
    }
}
