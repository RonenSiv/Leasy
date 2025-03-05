<?php

namespace App\Enums;

enum JsonSchemesEnum
{
    public const QUIZ_JSON_SCHEMA = [
        'name' => 'quiz',
        'strict' => true,
        'schema' => [
            'type' => 'array',
            'minItems' => 10,
            'maxItems' => 10,
            'items' => [
                'type' => 'object',
                'properties' => [
                    'question' => ['type' => 'string'],
                    'options' => [
                        'type' => 'object',
                        'patternProperties' => [
                            '^[1-9][0-9]*$' => ['type' => 'string']
                        ],
                        'additionalProperties' => false
                    ],
                    'correct_answer' => ['type' => 'integer']
                ],
                'required' => ['question', 'options', 'correct_answer'],
                'additionalProperties' => false
            ]
        ],
        'additionalProperties' => false
    ];


    public const MIND_MAP_JSON_SCHEMA = [
        "title" => "Tree Structure",
        "type" => "object",
        "properties" => [
            "title" => ["type" => "string"],
            "nodes" => [
                "type" => "array",
                "items" => [
                    "type" => "object",
                    "properties" => [
                        "id" => ["type" => "integer"],
                        "label" => ["type" => "string"],
                        "description" => ["type" => "string"],
                        "children" => [
                            "type" => "array",
                            "items" => [
                                "type" => "object",
                                "properties" => [
                                    "id" => ["type" => "integer"],
                                    "label" => ["type" => "string"],
                                    "description" => ["type" => "string"]
                                ],
                                "required" => ["id", "label", "description"],
                                "additionalProperties" => false
                            ]
                        ]
                    ],
                    "required" => ["id", "label", "description", "children"],
                    "additionalProperties" => false
                ]
            ]
        ],
        "required" => ["title", "nodes"],
        "additionalProperties" => false
    ];

    public const QUIZ_JSON_SCHEMA_OPENAI = [
        [
            "name" => "generate_quiz",
            "parameters" => [
                "type" => "object",
                "properties" => [
                    "quiz" => [
                        "type" => "array",
                        "minItems" => 10,
                        "maxItems" => 10,
                        "items" => [
                            "type" => "object",
                            "properties" => [
                                "question" => [
                                    "type" => "string"
                                ],
                                "options" => [
                                    "type" => "object",
                                    "properties" => [
                                        "1" => ["type" => "string"],
                                        "2" => ["type" => "string"],
                                        "3" => ["type" => "string"],
                                        "4" => ["type" => "string"]
                                    ],
                                    "required" => ["1", "2", "3", "4"],
                                    "additionalProperties" => false
                                ],
                                "correct_answer" => [
                                    "type" => "integer",
                                    "enum" => [1, 2, 3, 4]
                                ]
                            ],
                            "required" => ["question", "options", "correct_answer"],
                            "additionalProperties" => false
                        ]
                    ]
                ],
                "required" => ["quiz"],
                "additionalProperties" => false
            ]
        ]
    ];

    public const MIND_MAP_JSON_SCHEMA_OPENAI = [
        [
            "name" => "generate_mind_map",
            "parameters" => [
                "type" => "object",
                "properties" => [
                    "title" => [
                        "type" => "string"
                    ],
                    "nodes" => [
                        "type" => "array",
                        "items" => [
                            "type" => "object",
                            "properties" => [
                                "id" => [
                                    "type" => "integer"
                                ],
                                "label" => [
                                    "type" => "string"
                                ],
                                "description" => [
                                    "type" => "string"
                                ],
                                "children" => [
                                    "type" => "array",
                                    "items" => [
                                        "type" => "object",
                                        "properties" => [
                                            "id" => [
                                                "type" => "integer"
                                            ],
                                            "label" => [
                                                "type" => "string"
                                            ],
                                            "description" => [
                                                "type" => "string"
                                            ]
                                        ],
                                        "required" => ["id", "label", "description"],
                                        "additionalProperties" => false
                                    ]
                                ]
                            ],
                            "required" => ["id", "label", "description", "children"],
                            "additionalProperties" => false
                        ]
                    ]
                ],
                "required" => ["title", "nodes"],
                "additionalProperties" => false
            ]
        ]
    ];
}
