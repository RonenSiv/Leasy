<?php

namespace App\Enums;

enum DemoDataEnum
{
    public const DEMO_QUIZ = [
        [
            'question' => 'why?',
            'options' => [
                1 => 'option 1',
                2 => 'option 2',
                3 => 'option 3',
                4 => 'option 4',
            ],
            'correct_answer' => 3,
        ],
        [
            'question' => 'how?',
            'options' => [
                1 => 'option 1',
                2 => 'option 2',
                3 => 'option 3',
                4 => 'option 4',
            ],
            'correct_answer' => 1,
        ],
        [
            'question' => 'where?',
            'options' => [
                1 => 'option 1',
                2 => 'option 2',
                3 => 'option 3',
                4 => 'option 4',
            ],
            'correct_answer' => 4,
        ],
    ];
}
