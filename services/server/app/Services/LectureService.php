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

    public function store($video, string $title, string $description): HTTP_Status|array
    {
        try {
            DB::beginTransaction();

            $newVideo = $this->videoService->storeVideo($video);

            $transcription = $this->gptService->getTranscription($newVideo);

            $summary = $this->gptService->getSummary($transcription);

            $newChat = $this->chatService->storeChat($title);

            $newQuiz = $this->quizService->storeQuiz($title, $summary);

            $newLecture = Lecture::create([
                'uuid' => Str::uuid(),
                'title' => $title,
                'description' => $description,
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

    public function index(string $sortBy, string $sortDirection)
    {
        try {
            $sortableColumns = [
                'date' => 'created_at',
                'name' => 'title',
            ];

            $sortColumn = $sortableColumns[$sortBy] ?? 'created_at';

            $lectures = Lecture::with('video.videoUserProgresses')
                ->where('user_id', Auth::id())
                ->orderBy($sortColumn, $sortDirection)
                ->paginate(PaginationEnum::PER_PAGE->value);

            return [
                'dashboard' => $this->getLecturesDashboard(),
                'videos' => LecturesPreviewResource::collection($lectures)
            ];
        } catch (\Exception $e) {
            Log::error($e->getMessage());
            return HTTP_Status::ERROR;
        }
    }

    // ------------------- private Functions -------------------

    private function getLecturesDashboard()
    {
        $lectures = Lecture::with('video.videoUserProgresses')
            ->where('user_id', Auth::id())
            ->get();

        $totalVideos = $lectures->count();

        $sumProgress = 0;
        $numOfCompletedVideos = 0;
        foreach ($lectures as $lecture) {
            $progress = round(($lecture->video->videoUserProgresses->first()->last_watched_time / $lecture->video->video_duration) * 100);
            $sumProgress += $progress;

            $progress == 100 ? $numOfCompletedVideos++ : null;
        }

        $overallProgress = $totalVideos == 0 ? 0 : round($sumProgress / $totalVideos);

        $numOfPages = floor($totalVideos / PaginationEnum::PER_PAGE->value);
        return [
            'total_videos' => $totalVideos,
            'overall_progress' => $overallProgress,
            'completed_videos' => $numOfCompletedVideos,
            'incomplete_videos' => $totalVideos - $numOfCompletedVideos,
            'num_of_pages' => $totalVideos % PaginationEnum::PER_PAGE->value > 0 ? $numOfPages + 1 : $numOfPages,
        ];
    }
}
