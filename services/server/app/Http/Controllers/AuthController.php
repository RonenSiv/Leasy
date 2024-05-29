<?php

namespace App\Http\Controllers;

use App\Enums\HTTP_Status;
use App\Http\Requests\RegisterRequest;
use Illuminate\Http\Request;
use App\Services\AuthService;
use Illuminate\Http\JsonResponse;
use Illuminate\Support\Facades\Cookie;
use Symfony\Component\HttpFoundation\Response;


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
     *             required={"email", "full_name", "phone_number", "password"},
     *             @OA\Property(property="email", type="string", example="ofirgoldofir@gmail.com"),
     *             @OA\Property(property="full_name", type="string", example="Ofir Goldberg"),
     *             @OA\Property(property="phone_number", type="string", example="0527576444"),
     *             @OA\Property(property="password", type="string", example="123"),
     *         ),
     *     ),
     *     @OA\Response(
     *         response=200,
     *         description="User created successfully",
     *     ),
     *     @OA\Response(
     *         response=500,
     *         description="An error occurred while creating the user",
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
            phoneNumber: $request->phone_number,
            password: $request->password,
        );

        return match ($status) {
            HTTP_Status::CREATED => response()->json(['משתמש נוצר בהצלחה'], Response::HTTP_OK),
            HTTP_Status::ERROR => response()->json(['אירעה שגיאה'], Response::HTTP_INTERNAL_SERVER_ERROR),
            default => response()->json('', Response::HTTP_NO_CONTENT)
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
     *              @OA\Property(property="email", type="string", example="ofirgoldofir@gmail.com"),
     *              @OA\Property(property="password", type="string", example="123")
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
     *          description="An error occurred while user logged in ",
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
        if ($result instanceof HTTP_Status) {
            return match ($result) {
                HTTP_Status::ERROR => response()->json('אירעה שגיאה בעת התחברות', Response::HTTP_INTERNAL_SERVER_ERROR),
                HTTP_Status::UNAUTHORIZED => response()->json('שם משתמש או סיסמה שגוים', Response::HTTP_UNAUTHORIZED),
                default => response()->json('', Response::HTTP_NO_CONTENT)
            };
        }
        $filteredResult = [
            "email" => $result["email"],
            "full_name" => $result["full_name"],
            'token' => $result['accessToken'],
        ];
        return response()->json($filteredResult, Response::HTTP_OK)->withCookie(Cookie::make($result["tokenName"], $result["accessToken"]));
    }
}