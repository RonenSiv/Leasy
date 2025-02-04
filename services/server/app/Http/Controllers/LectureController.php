<?php

namespace App\Http\Controllers;

use App\Services\LectureService;

use App\Enums\HttpStatusEnum;
use App\Enums\SortingParametersEnum;
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
     */

    public function store(StoreLectureRequest $request): JsonResponse
    {
        $result = $this->lectureService->store(
            video: $request->file('video'),
            title: $request->title,
            description: $request->description,
        );

        if ($result instanceof HttpStatusEnum) {
            return match ($result) {
                HttpStatusEnum::ERROR => response()->json(['message' => 'An error occurred'], Response::HTTP_INTERNAL_SERVER_ERROR),
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

        if ($result instanceof HttpStatusEnum) {
            return match ($result) {
                HttpStatusEnum::NOT_FOUND => response()->json(['message' => 'Lecture not found'], Response::HTTP_INTERNAL_SERVER_ERROR),
                HttpStatusEnum::ERROR => response()->json(['message' => 'An error occurred'], Response::HTTP_INTERNAL_SERVER_ERROR),
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
     *         name="only_favorites",
     *         in="query",
     *         required=false,
     *         description="Filter only favorite lectures (true or false).",
     *         @OA\Schema(type="boolean", example=true)
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
            sortBy: $request->query('sort_by', SortingParametersEnum::DATE->value),
            sortDirection: $request->query('sort_direction', 'asc'),
            onlyFavorites: $request->boolean('only_favorites', false),
        );

        if ($result instanceof HttpStatusEnum) {
            return match ($result) {
                HttpStatusEnum::ERROR => response()->json(['message' => 'An error occurred'], Response::HTTP_INTERNAL_SERVER_ERROR),
                default => response()->json(['message' => 'no content'], Response::HTTP_NO_CONTENT)
            };
        }

        return response()->json(['data' => $result], Response::HTTP_OK);
    }

    /**
     * @OA\Put(
     *     path="/api/lecture/add-to-favorites/{uuid}",
     *     description="Add a lecture to the user's favorites.",
     *     operationId="addLectureToFavorites",
     *     tags={"Lectures"},
     *     @OA\Parameter(
     *         name="uuid",
     *         in="path",
     *         required=true,
     *         description="UUID of the lecture to add to favorites.",
     *         @OA\Schema(type="string", format="uuid", example="123e4567-e89b-12d3-a456-426614174000")
     *     ),
     *     @OA\Response(
     *         response=200,
     *         description="Lecture has been successfully added to favorites",
     *     ),
     *     @OA\Response(
     *         response=204,
     *         description="No content"
     *     ),
     *     @OA\Response(
     *         response=404,
     *         description="Lecture Not Found",
     *     ),
     *     @OA\Response(
     *         response=500,
     *         description="An error occurred",
     *     )
     * )
     */

    public function addToFavorites(string $uuid)
    {
        $status = $this->lectureService->addToFavorites(
            uuid: $uuid,
        );

        return match ($status) {
            HttpStatusEnum::ERROR => response()->json(['message' => 'An error occurred'], Response::HTTP_INTERNAL_SERVER_ERROR),
            HttpStatusEnum::NOT_FOUND => response()->json(['message' => 'Lecture Not Found'], Response::HTTP_NOT_FOUND),
            HttpStatusEnum::OK => response()->json(['message' => 'Lecture has been successfully added to favorites'], Response::HTTP_OK),
            default => response()->json(['message' => 'no content'], Response::HTTP_NO_CONTENT)
        };
    }
}
