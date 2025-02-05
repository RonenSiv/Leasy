<?php

namespace App\Services;

use App\Models\Video;

use App\Enums\GptPropmtsEnum;
use App\Enums\HttpStatusEnum;
use App\Enums\WhisperFailedEnum;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Facades\Log;

use GuzzleHttp\Client;

class GptService
{
    const DEMO_MIND_MAP = [
        "title" => "🧠 Machine Learning Algorithms: A 17-Minute Guide",
        "nodes" => [
            [
                "id" => 1,
                "label" => "📌 Introduction",
                "description" => "Overview of machine learning algorithms to help choose the right one.",
                "children" => [
                    [
                        "id" => 2,
                        "label" => "👨‍🏫 About the Speaker",
                        "description" => "Tim, a data scientist with 10+ years of experience in teaching ML."
                    ],
                    [
                        "id" => 3,
                        "label" => "🎯 Goal",
                        "description" => "Provide an intuitive understanding of major ML algorithms."
                    ],
                    [
                        "id" => 4,
                        "label" => "📖 Definition of ML",
                        "description" => "Field of AI that uses statistical models to learn from data."
                    ],
                ]
            ],
            [
                "id" => 5,
                "label" => "📂 Machine Learning Categories",
                "description" => "ML is broadly divided into two main types.",
                "children" => [
                    [
                        "id" => 6,
                        "label" => "📊 Supervised Learning",
                        "description" => "Learning from labeled data.",
                        "children" => [
                            [
                                "id" => 7,
                                "label" => "🏡 Regression",
                                "description" => "Predicting continuous values (e.g., house prices)."
                            ],
                            [
                                "id" => 8,
                                "label" => "📩 Classification",
                                "description" => "Predicting discrete categories (e.g., spam detection)."
                            ],
                        ]
                    ],
                    [
                        "id" => 9,
                        "label" => "🔍 Unsupervised Learning",
                        "description" => "Finding patterns in unlabeled data.",
                        "children" => [
                            [
                                "id" => 10,
                                "label" => "📬 Clustering",
                                "description" => "Grouping similar data points together."
                            ],
                            [
                                "id" => 11,
                                "label" => "🔽 Dimensionality Reduction",
                                "description" => "Reducing data complexity while retaining information."
                            ],
                        ]
                    ],
                ]
            ],
            [
                "id" => 12,
                "label" => "🛠️ Machine Learning Algorithms",
                "description" => "Overview of key ML algorithms.",
                "children" => [
                    ["id" => 13, "label" => "📈 Linear Regression", "description" => "Models a linear relationship between input and output."],
                    ["id" => 14, "label" => "📊 Logistic Regression", "description" => "Classification algorithm using the sigmoid function."],
                    ["id" => 15, "label" => "🤝 K-Nearest Neighbors (KNN)", "description" => "Predicts output based on the closest K data points."],
                    ["id" => 16, "label" => "📏 Support Vector Machines (SVM)", "description" => "Finds optimal decision boundary between classes."],
                    ["id" => 17, "label" => "📧 Naïve Bayes", "description" => "Uses probability theory for classification (e.g., spam filtering)."],
                    [
                        "id" => 18,
                        "label" => "🌳 Decision Trees",
                        "description" => "Uses a tree-like model for decision-making.",
                        "children" => [
                            ["id" => 19, "label" => "🌲 Random Forest", "description" => "Combines multiple decision trees for better predictions."],
                            ["id" => 20, "label" => "🚀 Boosting", "description" => "Sequentially improves weak models (e.g., AdaBoost, XGBoost)."]
                        ]
                    ],
                    [
                        "id" => 21,
                        "label" => "🧠 Neural Networks",
                        "description" => "Mimics human brain structure to learn complex patterns.",
                        "children" => [
                            ["id" => 22, "label" => "🔗 Deep Learning", "description" => "Uses multiple hidden layers to learn hierarchical features."]
                        ]
                    ],
                    [
                        "id" => 23,
                        "label" => "🌀 Clustering Algorithms",
                        "description" => "Groups similar data points together.",
                        "children" => [
                            ["id" => 24, "label" => "🔹 K-Means Clustering", "description" => "Divides data into K groups based on similarity."],
                            ["id" => 25, "label" => "📏 Hierarchical Clustering", "description" => "Creates a hierarchy of clusters."],
                            ["id" => 26, "label" => "🌍 DBSCAN", "description" => "Detects clusters of arbitrary shape without predefined K."]
                        ]
                    ],
                    [
                        "id" => 27,
                        "label" => "📉 Dimensionality Reduction",
                        "description" => "Reduces number of features while preserving information.",
                        "children" => [
                            ["id" => 28, "label" => "🔍 Principal Component Analysis (PCA)", "description" => "Finds the most informative directions in data."]
                        ]
                    ]
                ]
            ],
            [
                "id" => 29,
                "label" => "📋 Summary",
                "description" => "Machine learning algorithms are diverse, and choosing the right one depends on the problem.",
                "children" => [
                    ["id" => 30, "label" => "🗺️ Cheat Sheet", "description" => "Scikit-learn provides a useful guide for algorithm selection."],
                    ["id" => 31, "label" => "📚 Learning Roadmap", "description" => "Further resources available in the speaker’s other videos."]
                ]
            ]
        ]
    ];
    protected $client;
    public function __construct()
    {
        $this->client = new Client([
            'base_uri' => config('app.openai_base_uri'),
        ]);
    }

    public function getTranscription(Video $video): mixed
    {
        try {
            return 'transcription';

            if (is_null($video)) {
                return HttpStatusEnum::NOT_FOUND;
            }
            $output = null;
            if (Storage::disk(config('filesystems.storage_service'))->exists($video->video_name)) {
                $audioName = $video->audio_name;
                ini_set('max_execution_time', config('app.max_execution_time'));
                $audioPath = storage_path("app/public/{$audioName}");

                $command = config('app.transcription_from_whisper_python_script') . ' ' . $audioPath . ' ' . config('app.openai_api_key');
                $output = shell_exec($command);

                if ($output == "error" || is_null($output)) {
                    Log::error('Error in transcription python script');
                    return null;
                }
            }
            Log::alert($output);
            return $output;
        } catch (\Exception $e) {
            Log::error($e->getMessage());
            return HttpStatusEnum::ERROR;
        }
    }

    public function getSummary(string|null $transcription)
    {
        try {
            return 'summary';

            if ($transcription == WhisperFailedEnum::TRANSCRIPTION_FAILED->value) {
                return WhisperFailedEnum::SUMMARY_FAILED->value;
            }
            $prompt = GptPropmtsEnum::GET_SUMMARY_PROMPT->value . $transcription;

            $summary = $this->getGptResponse($prompt);

            Log::alert($summary);
            return $summary;
        } catch (\Exception $e) {
            Log::error($e->getMessage());
            return HttpStatusEnum::ERROR;
        }
    }

    public function generateQuiz(string|null $summary)
    {
        try {
            return 'quiz';

            if ($summary == WhisperFailedEnum::SUMMARY_FAILED->value) {
                return WhisperFailedEnum::QUIZ_FAILED->value;
            }
            $prompt = GptPropmtsEnum::GENERATE_QUIZ_PROMPT->value . $summary;
            $quiz = $this->getGptResponse($prompt);
            Log::alert($quiz);
            return $quiz;
        } catch (\Exception $e) {
            Log::error($e->getMessage());
            return HttpStatusEnum::ERROR;
        }
    }

    public function getChatResponse(string $message, array $chatHistory)
    {
        try {
            return 'chat response';

            return $this->getGptResponse(GptPropmtsEnum::GET_CHAT_RESPONSE_PROMPT->value . $message, $chatHistory);
        } catch (\Exception $e) {
            Log::error($e->getMessage());
            return HttpStatusEnum::ERROR;
        }
    }

    public function getMindMapJson(string $summary)
    {
        return self::DEMO_MIND_MAP;
        $response = $this->getGptResponse(GptPropmtsEnum::GET_MIND_MAP->value . $summary);
        return json_decode($response);
    }

    // ------------------- private Functions -------------------

    private function getGptResponse(string $prompt, array $chatHistory = [])
    {
        try {
            $messages = [
                ['role' => 'system', 'content' => 'You are a helpful assistant.'],
            ];

            if (!empty($chatHistory)) {
                foreach ($chatHistory as $message) {
                    $messages[] = [
                        'role' => $message['role'],
                        'content' => $message['content'],
                    ];
                }
            }

            $messages[] = [
                'role' => 'user',
                'content' => $prompt,
            ];

            $response = $this->client->post('chat/completions', [
                'headers' => [
                    'Authorization' => 'Bearer ' . config('app.openai_api_key')
                ],
                'json' => [
                    'model' => config('app.openai_model'),
                    'messages' => $messages,
                    'max_tokens' => config('app.openai_max_tokens'),
                    'temperature' => config('app.openai_temperature'),
                ],
                'verify' => false,
            ]);

            $respnseData = json_decode($response->getBody(), true);
            $answer = $respnseData['choices'][0]['message']['content'];

            return $answer;
        } catch (\Exception $e) {
            Log::error($e->getMessage());
            return HttpStatusEnum::ERROR;
        }
    }
}
