<?php

namespace App\Services;

use App\Models\Lecture;

use App\Enums\PaginationEnum;
use App\Enums\HTTP_Status;

use App\Http\Resources\LecturesPreviewResource;
use App\Http\Resources\LectureResource;

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

            $lecturedescription = $this->gptService->getLectureDescription($summary);

            $newChat = $this->chatService->storeChat($lectureTitle);

            $newQuiz = $this->quizService->storeQuiz($lectureTitle, $summary);

            $newLecture = Lecture::create([
                'uuid' => Str::uuid(),
                'title' => $lectureTitle,
                'description' => $lecturedescription,
                'user_id' => Auth::id(),
                'video_id' => $newVideo->id,
                'chat_id' => $newChat->id,
                'quiz_id' => $newQuiz->id,
                'transcription' => $transcription,
                'summary' => $summary,
            ]);

            DB::commit();

            return ['uuid' => $newLecture->uuid];
        } catch (\Exception $e) {
            DB::rollBack();
            Log::error($e->getMessage());
            return HTTP_Status::ERROR;
        }
    }

    public function show(string $uuid)
    {
        try {
            $lecture = Lecture::with(
                'user',
                'quiz.questions.questionOptions',
                'chat.messages',
                'video.videoUserProgresses'
            )
                ->where('uuid', $uuid)
                ->first();

            if (is_null($lecture)) {
                return HTTP_Status::NOT_FOUND;
            }

            return new LectureResource($lecture);
        } catch (\Exception $e) {
            Log::error($e->getMessage());
            return HTTP_Status::ERROR;
        }
    }

    public function index()
    {
        try {
            $lectures = Lecture::with('video.videoUserProgresses')
                ->where('user_id', Auth::id())
                ->paginate(PaginationEnum::PER_PAGE->value);

            return LecturesPreviewResource::collection($lectures);
        } catch (\Exception $e) {
            Log::error($e->getMessage());
            return HTTP_Status::ERROR;
        }
    }
}
