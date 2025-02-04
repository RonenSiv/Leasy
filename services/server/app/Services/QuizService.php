<?php

namespace App\Services;

use App\Models\QuestionOption;
use App\Models\Question;
use App\Models\Quiz;

use App\Http\Resources\QuestionResource;

use App\Enums\HttpStatusEnum;
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
                1 => 'option 1',
                2 => 'option 2',
                'correct' => 'option 3',
                3 => 'option 4',
            ]
        ],
        [
            'question' => 'how?',
            'options' => [
                'correct' => 'option 1',
                2 => 'option 2',
                3 => 'option 3',
                4 => 'option 4',
            ]
        ],
        [
            'question' => 'where?',
            'options' => [
                'correct' => 'option 1',
                2 => 'option 2',
                3 => 'option 3',
                4 => 'option 4',
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
            // TODO: cast the quiz string to array
            // $quizQuestions = [];
            $quizQuestions = self::DEMO_QUIZ;

            $this->storeQuizQuestions($newQuiz, $quizQuestions);

            DB::commit();

            return $newQuiz;
        } catch (\Exception $e) {
            DB::rollBack();
            Log::error($e->getMessage());
            return HttpStatusEnum::ERROR;
        }
    }

    public function getQuizQuestions(string $uuid)
    {
        try {
            $quiz = Quiz::with('questions')
                ->where('uuid', $uuid)->first();

            if (is_null($quiz)) {
                return HttpStatusEnum::NOT_FOUND;
            }

            return QuestionResource::collection($quiz->questions);
        } catch (\Exception $e) {
            Log::error($e->getMessage());
            return HttpStatusEnum::ERROR;
        }
    }

    public function answerQuiz(string $uuid, array $answers): array|HttpStatusEnum
    {
        try {
            DB::beginTransaction();

            $quiz = Quiz::with('questions.questionOptions')
                ->where('uuid', $uuid)
                ->first();

            if (is_null($quiz)) {
                return HttpStatusEnum::NOT_FOUND;
            }

            $score = 0;
            $numOfQuestions = $quiz->questions->count();
            $scorePerQuestion = (int)(100 / $numOfQuestions);
            if ($numOfQuestions <= 0) {
                return HttpStatusEnum::BAD_REQUEST;
            }

            $questionsData = [];
            foreach ($answers as $answer) {
                $question = $quiz->questions->where('uuid', $answer['question_uuid'])->first();
                if (is_null($question)) {
                    return HttpStatusEnum::NOT_FOUND;
                }
                $correctAnswer = $question->questionOptions->where('is_correct', true)->first();

                if ($correctAnswer->option_index == $answer['answer']) {
                    $score = $score + $scorePerQuestion;
                }

                $questionsData[] = [
                    'selected_option' => (int)$answer['answer'],
                    'correct_option' => $correctAnswer->option_index,
                ];
            }

            $quiz->update([
                'score' => $score
            ]);

            DB::commit();

            return [
                'score' => $score,
                'questions_data' => $questionsData,
            ];
        } catch (\Exception $e) {
            DB::rollBack();
            Log::error($e->getMessage());
            return HttpStatusEnum::ERROR;
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
            return HttpStatusEnum::ERROR;
        }
    }
}
