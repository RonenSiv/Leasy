<?php

namespace App\Services;

use App\Models\QuestionOption;
use App\Models\Question;
use App\Models\Quiz;

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
        $newQuiz = Quiz::create([
            'uuid' => Str::uuid(),
            'title' => $lectureTitle,
        ]);

        $quizQuestions = $this->gptService->getQuizQuestions($summary);

        // delete before prod
        $quizQuestions = self::DEMO_QUIZ;

        $this->storeQuizQuestions($newQuiz, $quizQuestions);

        return $newQuiz;
    }
    // ----------------------- Private Functions -----------------------
    private function storeQuizQuestions(Quiz $quiz, array $quizQuestions)
    {
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
    }
}
