<?php

namespace App\Http\Controllers;

use App\Enums\HTTP_Status;
use App\Services\UserService;
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
     *          description="An error occurred while fetching the user",
     *      )
     * )
     */

    public function getAuthUser()
    {
        $result = $this->service->getAuthUser();
        if ($result instanceof HTTP_Status) {
            return match ($result) {
                HTTP_Status::ERROR => response()->json('An error occurred while fetching the user', Response::HTTP_INTERNAL_SERVER_ERROR),
                HTTP_Status::NOT_FOUND => response()->json('User not found', Response::HTTP_NOT_FOUND),
                default => response()->json('', Response::HTTP_NO_CONTENT)
            };
        }

        return response()->json($result, Response::HTTP_OK);
    }
}
