<?php

namespace App\Http\Controllers;

use App\Services\AuthService;

use App\Http\Requests\RegisterRequest;

use App\Enums\HttpStatusEnum;

use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

use Symfony\Component\HttpFoundation\Response;

use Laravel\Socialite\Facades\Socialite;

use Illuminate\Support\Facades\Cookie;

class AuthController extends Controller
{
    private AuthService $service;
    public function __construct()
    {
        $this->service = new AuthService();
    }

    /**
     * @OA\Post(
     *     path="/api/register",
     *     summary="Create a new user",
     *     description="Create a new user with the provided information",
     *     tags={"Authentication"},
     *     @OA\RequestBody(
     *         required=true,
     *         description="User data",
     *         @OA\JsonContent(
     *             required={"email", "full_name", "password"},
     *             @OA\Property(property="email", type="string", example="leasy.helpdesk@gmail.com"),
     *             @OA\Property(property="full_name", type="string", example="Ofir Goldberg"),
     *             @OA\Property(property="password", type="string", example="Aa123!@#"),
     *         ),
     *     ),
     *     @OA\Response(
     *         response=200,
     *         description="User created successfully",
     *     ),
     *     @OA\Response(
     *         response=500,
     *         description="An error occurred",
     *     ),
     *     @OA\Response(
     *         response=204,
     *         description="No content",
     *     )
     * )
     */
    public function register(RegisterRequest $request)
    {
        $status = $this->service->register(
            email: $request->email,
            fullName: $request->full_name,
            password: $request->password,
        );

        return match ($status) {
            HttpStatusEnum::ERROR => response()->json(['message' => 'An error occurred'], Response::HTTP_INTERNAL_SERVER_ERROR),
            HttpStatusEnum::CREATED => response()->json(['message' => 'User created successfully'], Response::HTTP_OK),
            default => response()->json(['message' => 'No content'], Response::HTTP_NO_CONTENT)
        };
    }

    /**
     * @OA\Post(
     *      path="/api/login",
     *      operationId="login",
     *      tags={"Authentication"},
     *      summary="Login user",
     *      description="Authenticate and login user based on personal number",
     *      @OA\RequestBody(
     *          required=true,
     *          @OA\JsonContent(
     *              required={"email", "password"},
     *              @OA\Property(property="email", type="string", example="leasy.helpdesk@gmail.com"),
     *              @OA\Property(property="password", type="string", example="Aa123!@#")
     *          )
     *      ),
     *      @OA\Response(
     *          response=200,
     *          description="User logged in successfully",
     *      ),
     *      @OA\Response(
     *          response=404,
     *          description="User not found",
     *      ),
     *      @OA\Response(
     *          response=500,
     *          description="An error occurred while user logged in",
     *      ),
     *      @OA\Response(
     *          response=204,
     *          description="No content",
     *      ),
     * )
     *
     * @param  \Illuminate\Http\Request  $request
     * @return \Illuminate\Http\JsonResponse
     */

    public function login(Request $request): JsonResponse
    {
        $result = $this->service->login(
            email: $request->email,
            password: $request->password,
        );
        if ($result instanceof HttpStatusEnum) {
            return match ($result) {
                HttpStatusEnum::ERROR => response()->json(['message' => 'An error occurred while user logged in'], Response::HTTP_INTERNAL_SERVER_ERROR),
                HttpStatusEnum::UNAUTHORIZED => response()->json(['message' => 'Incorrect username or password'], Response::HTTP_UNAUTHORIZED),
                default => response()->json(['message' => 'No content'], Response::HTTP_NO_CONTENT)
            };
        }

        $filteredResult = [
            "email" => $result["email"],
            "full_name" => $result["full_name"],
        ];

        return response()
            ->json($filteredResult, Response::HTTP_OK)
            ->withCookie(Cookie::make($result["tokenName"], $result["accessToken"]));
    }

    /**
     * @OA\Post(
     *      path="/api/logout",
     *      operationId="logout",
     *      tags={"Authentication"},
     *      summary="Logout user",
     *      description="Logout the authenticated user by revoking the user's access token",
     *      @OA\Response(
     *          response=200,
     *          description="User logged out successfully",
     *      ),
     *      @OA\Response(
     *          response=500,
     *          description="An error occurred while logging out",
     *      ),
     *      @OA\Response(
     *          response=204,
     *          description="No content",
     *      ),
     * )
     */
    public function logout(): JsonResponse
    {
        $status = $this->service->logout();

        return match ($status) {
            HttpStatusEnum::ERROR => response()->json(['message' => 'An error occurred while user logged in'], Response::HTTP_INTERNAL_SERVER_ERROR),
            HttpStatusEnum::OK => response()->json(['message' => 'User logged out successfully'], Response::HTTP_OK),
            default => response()->json(['message' => 'No content'], Response::HTTP_NO_CONTENT)
        };
    }

    /**
     * @OA\Get(
     *     path="/auth/google",
     *     summary="Redirect to Google OAuth",
     *     description="Redirects the user to Google's OAuth authentication page.",
     *     operationId="googleLogin",
     *     tags={"Authentication"},
     *     @OA\Response(
     *         response=302,
     *         description="Redirect to Google authentication page"
     *     )
     * )
     */

    public function googleLogin(Request $request)
    {
        $result = $this->service->googleLogin(
            token: $request->token,
        );

        if ($result instanceof HttpStatusEnum) {
            return match ($result) {
                HttpStatusEnum::ERROR => response()->json(['message' => 'An error occurred while user logged in'], Response::HTTP_INTERNAL_SERVER_ERROR),
                HttpStatusEnum::UNAUTHORIZED => response()->json(['message' => 'Incorrect google account'], Response::HTTP_UNAUTHORIZED),
                HttpStatusEnum::BAD_REQUEST => response()->json(['message' => 'Invalid Google token'], Response::HTTP_BAD_REQUEST),
                default => response()->json(['message' => 'No content'], Response::HTTP_NO_CONTENT)
            };
        }

        $filteredResult = [
            "email" => $result["email"],
            "full_name" => $result["full_name"],
        ];

        return response()
            ->json($filteredResult, Response::HTTP_OK)
            ->withCookie(Cookie::make($result["tokenName"], $result["accessToken"]));
    }
}
