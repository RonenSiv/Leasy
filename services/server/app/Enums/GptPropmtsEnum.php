<?php

namespace App\Enums;

enum GptPropmtsEnum: string
{
    case GENERATE_QUIZ = "I will provide you with a summary of a subject.
    Based on this summary, create a quiz with 10 multiple-choice questions. 
    Each question should have 4 answer options, and only one of them should be correct.
    Provide the output in this exact text format for easy array generation in PHP:
    [
        [
            'question' => 'Your question here?',
            'options' => [
                1 => 'Option 1',
                2 => 'Option 2',
                'correct' => 'Correct Answer',
                3 => 'Option 4',
            ]
        ],
        [
            'question' => 'Another question here?',
            'options' => [
                'correct' => 'Correct Answer',
                2 => 'Option 2',
                3 => 'Option 3',
                4 => 'Option 4',
            ]
        ],
        // Continue for 10 questions
    ];
    Ensure that the correct answer is marked explicitly as 'correct'.
    Fill the options with plausible distractors.
    Use only text-based responses in the output for easy parsing into the array format.
    the summary is: \n";

    case GET_CHAT_RESPONSE = ' ';
}
