<?php

namespace App\Services;

use App\Enums\HTTP_Status;

use App\Http\Resources\LectureResource;

use App\Models\Lecture;

use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Str;

class LectureService
{
    private GptService $gptService;
    private VideoService $videoService;
    private ChatService $chatService;
    private QuizService $quizService;
    public function __construct()
    {
        $this->gptService = new GptService();
        $this->videoService = new VideoService();
        $this->chatService = new ChatService();
        $this->quizService = new QuizService();
    }

    public function store($video): HTTP_Status|string
    {
        try {
            DB::beginTransaction();

            $newVideo = $this->videoService->storeVideo($video);

            $transcription = $this->gptService->getTranscription();

            $summary = $this->gptService->getSummary();

            $lectureTitle = $this->gptService->getLectureTitle($summary);

            $newChat = $this->chatService->storeChat($lectureTitle);

            $newQuiz = $this->quizService->storeQuiz($lectureTitle, $summary);

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
            Log::error($e->getMessage());
            return HTTP_Status::ERROR;
        }
    }

    public function show(string $uuid)
    {
        $lecture = Lecture::with('user', 'quiz.questions.questionOptions', 'chat.messages', 'video.videoUserProgresses')
            ->where('uuid', $uuid)
            ->first();

        if (is_null($lecture)) {
            return HTTP_Status::NOT_FOUND;
        }

        return new LectureResource($lecture);
    }
}
