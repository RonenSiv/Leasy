<?php

namespace App\Http\Controllers;

use App\Services\QuizService;

use App\Enums\HTTP_Status;

use Illuminate\Http\Request;

use Symfony\Component\HttpFoundation\Response;

class QuizController extends Controller
{
    private QuizService $quizService;
    public function __construct()
    {
        $this->quizService = new QuizService();
    }

    /**
     * @OA\Get(
     *     path="/api/quiz/next-question/{uuid}",
     *     summary="Get the next question in a quiz",
     *     description="Fetches the next question of a quiz based on the question index.",
     *     tags={"Quiz"},
     *     @OA\Parameter(
     *         name="uuid",
     *         in="path",
     *         description="The UUID of the quiz",
     *         required=true,
     *         @OA\Schema(type="string", format="uuid")
     *     ),
     *     @OA\Parameter(
     *         name="question_index",
     *         in="query",
     *         description="The index of the question to retrieve",
     *         required=true,
     *         @OA\Schema(type="integer", minimum=1, example=1)
     *     ),
     *     @OA\Response(
     *         response=200,
     *         description="Question retrieved successfully",
     *     ),
     *     @OA\Response(
     *         response=404,
     *         description="Quiz not found",
     *     ),
     *     @OA\Response(
     *         response=204,
     *         description="No content",
     *     ),
     *     @OA\Response(
     *         response=500,
     *         description="An error occurred",
     *     )
     * )
     */

    public function getNextQuestion(string $uuid, Request $request)
    {
        $result = $this->quizService->getNextQuestion(
            uuid: $uuid,
            questionIndex: $request->query('question_index'),
        );

        if ($result instanceof HTTP_Status) {
            return match ($result) {
                HTTP_Status::ERROR => response()->json(['message' => 'An error occurred while fetching the user'], Response::HTTP_INTERNAL_SERVER_ERROR),
                HTTP_Status::NOT_FOUND => response()->json(['message' => 'Quiz not found'], Response::HTTP_NOT_FOUND),
                default => response()->json(['message' => 'No content'], Response::HTTP_NO_CONTENT)
            };
        }

        return response()->json(['data' => $result], Response::HTTP_OK);
    }

    /**
     * @OA\Put(
     *     path="/api/quiz/add-to-score/{uuid}",
     *     summary="Add score to a quiz",
     *     description="Adds a score to a quiz based on its UUID.",
     *     tags={"Quiz"},
     *     @OA\Parameter(
     *         name="uuid",
     *         in="path",
     *         description="The UUID of the quiz",
     *         required=true,
     *         @OA\Schema(type="string", format="uuid")
     *     ),
     *     @OA\Response(
     *         response=200,
     *         description="Score added successfully"
     *     ),
     *     @OA\Response(
     *         response=400,
     *         description="quiz cannot be graded"
     *     ),
     *     @OA\Response(
     *         response=404,
     *         description="Quiz not found"
     *     ),
     *     @OA\Response(
     *         response=500,
     *         description="An error occurred while fetching the user"
     *     ),
     *     @OA\Response(
     *         response=204,
     *         description="No content"
     *     )
     * )
     */

    public function addToScore(string $uuid)
    {
        $result = $this->quizService->addToScore(
            uuid: $uuid,
        );

        if ($result instanceof HTTP_Status) {
            return match ($result) {
                HTTP_Status::ERROR => response()->json(['message' => 'An error occurred while fetching the user'], Response::HTTP_INTERNAL_SERVER_ERROR),
                HTTP_Status::BAD_REQUEST => response()->json(['message' => 'This quiz cannot be graded'], Response::HTTP_BAD_REQUEST),
                HTTP_Status::NOT_FOUND => response()->json(['message' => 'Quiz not found'], Response::HTTP_NOT_FOUND),
                default => response()->json(['message' => 'No content'], Response::HTTP_NO_CONTENT)
            };
        }

        return response()->json(['data' => $result], Response::HTTP_OK);
    }
}
