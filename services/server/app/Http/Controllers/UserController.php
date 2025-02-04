<?php

namespace App\Http\Controllers;

use App\Services\UserService;

use App\Enums\HttpStatusEnum;

use Symfony\Component\HttpFoundation\Response;

class UserController extends Controller
{
    private UserService $service;
    public function __construct()
    {
        $this->service = new UserService();
    }

    /**
     * @OA\Get(
     *      path="/api/user",
     *      operationId="getAuthUser",
     *      tags={"Users"},
     *      summary="Get authenticated user",
     *      description="Returns the authenticated user's details",
     *      @OA\Response(
     *          response=200,
     *          description="Successful operation",
     *      ),
     *      @OA\Response(
     *          response=404,
     *          description="User not found",
     *      ),
     *      @OA\Response(
     *          response=500,
     *          description="An error occurred",
     *      )
     * )
     */

    public function getAuthUser()
    {
        $result = $this->service->getAuthUser();
        if ($result instanceof HttpStatusEnum) {
            return match ($result) {
                HttpStatusEnum::ERROR => response()->json(['message' => 'An error occurred'], Response::HTTP_INTERNAL_SERVER_ERROR),
                HttpStatusEnum::NOT_FOUND => response()->json(['message' => 'User not found'], Response::HTTP_NOT_FOUND),
                default => response()->json(['message' => 'No content'], Response::HTTP_NO_CONTENT)
            };
        }

        return response()->json($result, Response::HTTP_OK);
    }
}
