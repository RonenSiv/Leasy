<?php

namespace App\Http\Controllers;

use App\Services\QuizService;

use App\Enums\HTTP_Status;
use App\Http\Requests\AnswerQuestionRequest;
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
     *     path="/api/quiz/answer/{uuid}",
     *     summary="Answer a question in a quiz",
     *     description="Submits an answer to a quiz question based on the quiz UUID, question UUID, and selected option index.",
     *     tags={"Quiz"},
     *     @OA\Parameter(
     *         name="uuid",
     *         in="path",
     *         description="The UUID of the quiz",
     *         required=true,
     *         @OA\Schema(type="string", format="uuid")
     *     ),
     *     @OA\RequestBody(
     *         required=true,
     *         @OA\JsonContent(
     *             required={"question_uuid", "option_index"},
     *             @OA\Property(property="question_uuid", type="string", format="uuid"),
     *             @OA\Property(property="option_index", type="Integer", example=1)
     *         )
     *     ),
     *     @OA\Response(
     *         response=200,
     *         description="Answer submitted successfully",
     *     ),
     *     @OA\Response(
     *         response=400,
     *         description="This question cannot be answered",
     *     ),
     *     @OA\Response(
     *         response=404,
     *         description="Some of the quiz properties not found",
     *     ),
     *     @OA\Response(
     *         response=500,
     *         description="An error occurred while processing the answer",
     *     ),
     *     @OA\Response(
     *         response=204,
     *         description="No content",
     *     )
     * )
     */

    public function answerQuestion(string $uuid, AnswerQuestionRequest $request)
    {
        $result = $this->quizService->answerQuestion(
            QuizUuid: $uuid,
            questionUuid: $request->question_uuid,
            optionIndex: $request->option_index,
        );

        if ($result instanceof HTTP_Status) {
            return match ($result) {
                HTTP_Status::ERROR => response()->json(['message' => 'An error occurred while fetching the user'], Response::HTTP_INTERNAL_SERVER_ERROR),
                HTTP_Status::NOT_FOUND => response()->json(['message' => 'Some of the quiz properties not found'], Response::HTTP_NOT_FOUND),
                HTTP_Status::BAD_REQUEST => response()->json(['message' => 'This question cannot be answered'], Response::HTTP_BAD_REQUEST),
                default => response()->json(['message' => 'No content'], Response::HTTP_NO_CONTENT)
            };
        }

        return response()->json(['data' => $result], Response::HTTP_OK);
    }
}
