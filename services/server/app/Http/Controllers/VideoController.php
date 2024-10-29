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

    // /**
    //  * @OA\Get(
    //  *      path="/api/units/{uuid}",
    //  *      operationId="show unit",
    //  *      tags={"Units"},
    //  *      summary="Show a unit by id",
    //  *      description="Retrieve a unit by its id",
    //  *      @OA\Parameter(
    //  *          name="uuid",
    //  *          in="path",
    //  *          description="UUID of the unit",
    //  *          required=true,
    //  *          @OA\Schema(
    //  *              type="string",
    //  *              format="uuid"
    //  *          )
    //  *      ),
    //  *      @OA\Response(
    //  *          response=200,
    //  *          description="היחידה נמצאה בהצלחה",
    //  *      ),
    //  *      @OA\Response(
    //  *          response=404,
    //  *          description="לא נמצא",
    //  *      ),
    //  *      @OA\Response(
    //  *          response=500,
    //  *          description="אירעה שגיאה",
    //  *      ),
    //  *      @OA\Response(
    //  *          response=204,
    //  *          description="אין תוכן",
    //  *      ),
    //  * )
    //  *
    //  * @param  int  $id
    //  * @return \Illuminate\Http\JsonResponse
    //  */
    // public function show(string $uuid): JsonResponse
    // {
    //     $result = $this->service->show(
    //         uuid: $uuid,
    //     );
    //     if ($result instanceof HTTP_Status) {
    //         return match ($result) {
    //             HTTP_Status::ERROR => response()->json('אירעה שגיאה', Response::HTTP_INTERNAL_SERVER_ERROR),
    //             HTTP_Status::NOT_FOUND => response()->json('יחידה אינה קיימת', Response::HTTP_NOT_FOUND),
    //             default => response()->json('', Response::HTTP_NO_CONTENT)
    //         };
    //     }

    //     return response()->json($result, Response::HTTP_OK);
    // }

    // /**
    //  * @OA\Get(
    //  *      path="/api/units",
    //  *      operationId="index unit",
    //  *      tags={"Units"},
    //  *      summary="Retrieve all units",
    //  *      description="Retrieve all units",
    //  *      @OA\Response(
    //  *          response=200,
    //  *          description="הפעולה התבצעה בהצלחה",
    //  *      )
    //  * )
    //  *
    //  * @return \Illuminate\Http\JsonResponse
    //  */

    // public function index(): JsonResponse
    // {
    //     $result = $this->service->index();
    //     return response()->json($result, Response::HTTP_OK);
    // }
}
