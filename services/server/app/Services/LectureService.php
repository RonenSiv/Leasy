<?php

namespace App\Services;

// use FFMpeg;

use App\Enums\HTTP_Status;

use App\Http\Resources\LectureResource;

use App\Models\QuestionOption;
use App\Models\Question;
use App\Models\Lecture;
use App\Models\Video;
use App\Models\Quiz;
use App\Models\Chat;

use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Str;

use ProtoneMedia\LaravelFFMpeg\Support\FFMpeg;

class LectureService
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

    private GptService $GptService;
    public function __construct()
    {
        $this->GptService = new GptService();
    }

    public function store($video): HTTP_Status|string
    {
        try {
            DB::beginTransaction();

            $newVideo = $this->storeVideo($video);

            $transcription = $this->GptService->getTranscription();

            $summary = $this->GptService->getSummary();

            $lectureTitle = $this->GptService->getLectureTitle($summary);

            $newChat = $this->storeChat($lectureTitle);

            $newQuiz = $this->storeQuiz($lectureTitle, $summary);

            $newLecture = Lecture::create([
                'uuid' => Str::uuid(),
                'user_id' => Auth::id(),
                'video_id' => $newVideo->id,
                'chat_id' => $newChat->id,
                'quiz_id' => $newQuiz->id,
                'transcription' => $transcription,
                'summary' => $summary,
            ]);

            DB::commit();

            return $newLecture->uuid;
        } catch (\Exception $e) {
            DB::rollBack();
            // if (Storage::disk(config('filesystems.storage_service'))->exists($newVideo->video_name)) {
            //     Storage::disk(config('filesystems.storage_service'))->delete($newVideo->video_name);
            // }
            Log::error($e->getMessage());
            return HTTP_Status::ERROR;
        }
    }

    public function show(string $uuid)
    {
        $lecture = Lecture::with('user', 'quiz.questions.questionOptions', 'chat.messages', 'video')
            ->where('uuid', $uuid)
            ->first();

        if (is_null($lecture)) {
            return HTTP_Status::NOT_FOUND;
        }

        return new LectureResource($lecture);
    }

    // ---------------------------- Private Functions ----------------------------
    private function storeVideo($video)
    {
        $videoExtension = $video->getClientOriginalExtension();
        $VideoName = uniqid() . '_' . Str::random(10) . '.' . $videoExtension;

        Storage::disk(config('filesystems.storage_service'))->put($VideoName, file_get_contents($video));
        $VideoMimeType = $video->getClientMimeType();

        $previewImageName = uniqid() . '_' . Str::random(10) . '.jpg';

        FFMpeg::fromDisk(config('filesystems.storage_service'))
            ->open($VideoName)
            ->getFrameFromSeconds(10)
            ->export()
            ->toDisk(config('filesystems.storage_service'))
            ->save($previewImageName);

        $previewImageMimeType = 'image/jpeg';
        $videoPath = config('filesystems.storage_path') . "/" . $VideoName;
        $previewImagePath = config('filesystems.storage_path') . "/" . $previewImageName;

        $newVideo = Video::create([
            'uuid' => Str::uuid(),
            'video_path' => $videoPath,
            'video_name' => $VideoName,
            'video_mime_type' => $VideoMimeType,
            'preview_image_path' => $previewImagePath,
            'preview_image_name' => $previewImageName,
            'preview_image_mime_type' => $previewImageMimeType,
        ]);

        return $newVideo;
    }

    private function storeChat(string $lectureTitle)
    {
        $newChat = Chat::create([
            'uuid' => Str::uuid(),
            'title' => $lectureTitle,
        ]);

        return $newChat;
    }

    private function storeQuiz(string $lectureTitle, string $summary)
    {
        $newQuiz = Quiz::create([
            'uuid' => Str::uuid(),
            'title' => $lectureTitle,
        ]);

        $quizQuestions = $this->GptService->getQuizQuestions($summary);

        // delete before prod
        $quizQuestions = self::DEMO_QUIZ;

        $this->storeQuizQuestions($newQuiz, $quizQuestions);

        return $newQuiz;
    }

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
