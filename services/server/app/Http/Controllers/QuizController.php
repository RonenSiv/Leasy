<?php

namespace App\Http\Controllers;

use App\Services\QuizService;

use App\Enums\HTTP_Status;
use App\Enums\WhisperFailedEnum;
use App\Http\Requests\AnswerQuestionRequest;

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
     *     path="/api/quiz/questions/{uuid}",
     *     summary="Get the questions of the quiz",
     *     description="Fetches all questions of a quiz.",
     *     tags={"Quizzes"},
     *     @OA\Parameter(
     *         name="uuid",
     *         in="path",
     *         description="The UUID of the quiz",
     *         required=true,
     *         @OA\Schema(type="string", format="uuid")
     *     ),
     *     @OA\Response(
     *         response=200,
     *         description="Questions retrieved successfully",
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

    public function getQuizQuestions(string $uuid)
    {
        $result = $this->quizService->getQuizQuestions(
            uuid: $uuid,
        );

        if ($result instanceof HTTP_Status) {
            return match ($result) {
                HTTP_Status::ERROR => response()->json(['message' => 'An error occurred'], Response::HTTP_INTERNAL_SERVER_ERROR),
                HTTP_Status::NOT_FOUND => response()->json(['message' => 'Quiz not found'], Response::HTTP_NOT_FOUND),
                default => response()->json(['message' => 'No content'], Response::HTTP_NO_CONTENT)
            };
        }

        if ($result->isEmpty()) {
            return response()->json(['message' => WhisperFailedEnum::QUIZ_FAILED->value], Response::HTTP_OK);
        }

        return response()->json(['data' => $result], Response::HTTP_OK);
    }

    /**
     * @OA\Put(
     *     path="/api/quiz/answer/{uuid}",
     *     summary="Answer quiz",
     *     description="Submits answers for a quiz",
     *     tags={"Quizzes"},
     *     @OA\Parameter(
     *         name="uuid",
     *         in="path",
     *         description="The UUID of the quiz",
     *         required=true,
     *         @OA\Schema(type="string", format="uuid")
     *     ),
     *     @OA\RequestBody(
     *         required=true,
     *         description="Answers for the quiz questions",
     *         @OA\JsonContent(
     *             type="object",
     *             @OA\Property(
     *                 property="answers",
     *                 type="array",
     *                 description="List of answers",
     *                 @OA\Items(
     *                     type="object",
     *                     required={"question_uuid", "answer"},
     *                     @OA\Property(
     *                         property="question_uuid",
     *                         type="string",
     *                         format="uuid",
     *                         description="The UUID of the question"
     *                     ),
     *                     @OA\Property(
     *                         property="answer",
     *                         type="string",
     *                         example="2"
     *                     )
     *                 )
     *             )
     *         )
     *     ),
     *     @OA\Response(
     *         response=200,
     *         description="Answers submitted successfully",
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
     *         description="An error occurred",
     *     ),
     *     @OA\Response(
     *         response=204,
     *         description="No content",
     *     )
     * )
     */

    public function answerQuiz(string $uuid, AnswerQuestionRequest $request)
    {
        $result = $this->quizService->answerQuiz(
            uuid: $uuid,
            answers: $request->answers,
        );

        if ($result instanceof HTTP_Status) {
            return match ($result) {
                HTTP_Status::NOT_FOUND => response()->json(['message' => 'Some of the quiz properties not found'], Response::HTTP_NOT_FOUND),
                HTTP_Status::BAD_REQUEST => response()->json(['message' => 'This question cannot be answered'], Response::HTTP_BAD_REQUEST),
                HTTP_Status::ERROR => response()->json(['message' => 'An error occurred'], Response::HTTP_INTERNAL_SERVER_ERROR),
                default => response()->json(['message' => 'No content'], Response::HTTP_NO_CONTENT)
            };
        }

        return response()->json(['data' => $result], Response::HTTP_OK);
    }
}
