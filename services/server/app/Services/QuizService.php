<?php

namespace App\Services;

use App\Models\QuestionOption;
use App\Models\Question;
use App\Models\Quiz;

use App\Http\Resources\QuestionResource;

use App\Enums\HTTP_Status;
use App\Enums\WhisperFailedEnum;
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
            ]
        ],
        [
            'question' => 'where?',
            'options' => [
                'correct' => '3option 1',
                2 => '3option 2',
                3 => '3option 3',
                4 => '3option 4',
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

            $quizQuestions = $this->gptService->generateQuiz($summary);

            if ($quizQuestions == WhisperFailedEnum::QUIZ_FAILED->value) {
                $quizQuestions = [];
            }
            // DELETE: before prod
            // $quizQuestions = self::DEMO_QUIZ;
            $this->storeQuizQuestions($newQuiz, $quizQuestions);

            DB::commit();

            return $newQuiz;
        } catch (\Exception $e) {
            DB::rollBack();
            Log::error($e->getMessage());
            return HTTP_Status::ERROR;
        }
    }

    public function getQuizQuestions(string $uuid)
    {
        try {
            $quiz = Quiz::with('questions')
                ->where('uuid', $uuid)->first();

            if (is_null($quiz)) {
                return HTTP_Status::NOT_FOUND;
            }

            return  QuestionResource::collection($quiz->questions);
        } catch (\Exception $e) {
            Log::error($e->getMessage());
            return HTTP_Status::ERROR;
        }
    }

    public function answerQuiz(string $uuid, array $answers): array|HTTP_Status
    {
        try {
            DB::beginTransaction();

            $quiz = Quiz::with('questions.questionOptions')
                ->where('uuid', $uuid)
                ->first();

            if (is_null($quiz)) {
                return HTTP_Status::NOT_FOUND;
            }

            $score = 0;
            $numOfQuestions = $quiz->questions->count();
            $scorePerQuestion = (int)(100 / $numOfQuestions);
            if ($numOfQuestions <= 0) {
                return HTTP_Status::BAD_REQUEST;
            }

            foreach ($answers as $answer) {
                $question = $quiz->questions->firstWhere('uuid', $answer['question_uuid']);
                if (is_null($question)) {
                    return HTTP_Status::NOT_FOUND;
                }
                $correctAnswers = $question->questionOptions->Where('is_correct', true);
                $isCorrect = $correctAnswers->contains('option_index', $answer['answer']);

                if ($isCorrect) {
                    $score = $score + $scorePerQuestion;
                }
            }

            $quiz->update([
                'score' => $score
            ]);

            DB::commit();

            return ['score' => $score];
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
                    'uuid' => Str::uuid(),
                    'quiz_id' => $quiz->id,
                    'question_text' => $questionText,
                ]);
                $optionIndex = 0;
                foreach ($questionOptions as $isCorrect => $questionOptionText) {
                    $optionIndex++;
                    QuestionOption::create([
                        'question_id' => $newQuestion->id,
                        'option_index' => $optionIndex,
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
