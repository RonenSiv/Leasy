<?php

namespace App\Services;

use App\Models\QuestionOption;
use App\Models\Question;
use App\Models\Quiz;

use App\Http\Resources\QuestionResource;

use App\Enums\HTTP_Status;

use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Str;

class QuizService
{
    const DEMO_QUIZ = [
        [
            'question' => 'why?',
            'options' => [
                1 => '1option 1',
                2 => '1option 2',
                'correct' => '1option 3',
                3 => '1option 4',
            ]
        ],
        [
            'question' => 'how?',
            'options' => [
                'correct' => '2option 1',
                2 => '2option 2',
                3 => '2option 3',
                4 => '2option 4',
                5 => '2option 5',
            ]
        ],

    ];

    private GptService $gptService;
    public function __construct()
    {
        $this->gptService = new GptService();
    }

    public function storeQuiz(string $lectureTitle, string $summary)
    {
        try {
            DB::beginTransaction();

            $newQuiz = Quiz::create([
                'uuid' => Str::uuid(),
                'title' => $lectureTitle,
            ]);

            $quizQuestions = $this->gptService->generateQuizFromGpt($summary);

            // delete before prod
            $quizQuestions = self::DEMO_QUIZ;

            $this->storeQuizQuestions($newQuiz, $quizQuestions);

            DB::commit();

            return $newQuiz;
        } catch (\Exception $e) {
            DB::rollBack();
            Log::error($e->getMessage());
            return HTTP_Status::ERROR;
        }
    }

    public function getNextQuestion(string $uuid, int $questionIndex)
    {
        try {
            $quiz = Quiz::where('uuid', $uuid)->first();

            if (is_null($quiz)) {
                return HTTP_Status::NOT_FOUND;
            }

            $nextQuestion = Question::with('questionOptions')
                ->where('quiz_id', $quiz->id)
                ->orderBy('id')
                ->skip($questionIndex - 1)
                ->first();

            if (is_null($nextQuestion)) {
                return ['score' => $quiz->score];
            }

            return new QuestionResource($nextQuestion);
        } catch (\Exception $e) {
            Log::error($e->getMessage());
            return HTTP_Status::ERROR;
        }
    }

    public function addToScore(string $uuid)
    {
        try {
            DB::beginTransaction();

            $quiz = Quiz::with('questions')
                ->where('uuid', $uuid)
                ->first();

            if (is_null($quiz)) {
                return HTTP_Status::NOT_FOUND;
            }

            $questionsCount = $quiz->questions->count();

            $currentScroe = $quiz->score;

            if ($currentScroe >= 100 || $questionsCount <= 0) {
                return HTTP_Status::BAD_REQUEST;
            }

            $quiz->update([
                'score' => $currentScroe + (100 / $questionsCount),
            ]);

            DB::commit();

            return [
                'new_score' => $quiz->score
            ];
        } catch (\Exception $e) {
            DB::rollBack();
            Log::error($e->getMessage());
            return HTTP_Status::ERROR;
        }
    }

    // ----------------------- Private Functions -----------------------
    private function storeQuizQuestions(Quiz $quiz, array $quizQuestions)
    {
        try {
            DB::beginTransaction();

            foreach ($quizQuestions as $questionData) {
                $questionText = $questionData['question'];
                $questionOptions = $questionData['options'];

                $newQuestion = Question::create([
                    'quiz_id' => $quiz->id,
                    'question_text' => $questionText,
                ]);

                foreach ($questionOptions as $isCorrect => $questionOptionText) {
                    QuestionOption::create([
                        'question_id' => $newQuestion->id,
                        'option_text' => $questionOptionText,
                        'is_correct' => $isCorrect === 'correct',
                    ]);
                }
            }
            DB::commit();
        } catch (\Exception $e) {
            DB::rollBack();

            Log::error($e->getMessage());
            return HTTP_Status::ERROR;
        }
    }
}
