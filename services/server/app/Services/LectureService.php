<?php

namespace App\Services;

use App\Models\Lecture;

use App\Enums\SortingParametersEnum;
use App\Enums\WhisperFailedEnum;
use App\Enums\PaginationEnum;
use App\Enums\HttpStatusEnum;

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

    public function store($video, string $title, string $description): HttpStatusEnum|array
    {
        try {
            DB::beginTransaction();

            $newVideo = $this->videoService->storeVideo($video);

            if ($newVideo == HttpStatusEnum::ERROR) {
                return $this->errorDuringUpload('storeVideo');
            }

            $transcription = $this->gptService->getTranscription($newVideo);

            if ($transcription == HttpStatusEnum::ERROR) {
                return $this->errorDuringUpload('getTranscription');
            }

            $summary = $this->gptService->getSummary($transcription);

            if ($summary == HttpStatusEnum::ERROR) {
                return $this->errorDuringUpload('getSummary');
            }

            $mindMap = $this->gptService->getMindMapJson($summary);

            if ($mindMap == HttpStatusEnum::ERROR) {
                return $this->errorDuringUpload('getMindMapJson');
            }

            $newChat = $this->chatService->storeChat($title);

            if ($newChat == HttpStatusEnum::ERROR) {
                return $this->errorDuringUpload('storeChat');
            }

            $newQuiz = $this->quizService->storeQuiz($title, $summary);

            if ($newQuiz == HttpStatusEnum::ERROR) {
                return $this->errorDuringUpload('storeQuiz');
            }

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
                'mind_map' => $mindMap,
            ]);

            DB::commit();

            return ['uuid' => $newLecture->uuid];
        } catch (\Exception $e) {
            DB::rollBack();
            Log::error($e->getMessage());
            return HttpStatusEnum::ERROR;
        }
    }

    public function show(string $uuid)
    {
        try {
            $lecture = Lecture::with(
                'user',
                'quiz',
                'chat',
                'video.videoUserProgresses'
            )
                ->where('uuid', $uuid)
                ->first();

            if (is_null($lecture)) {
                return HttpStatusEnum::NOT_FOUND;
            }

            return new LectureResource($lecture);
        } catch (\Exception $e) {
            Log::error($e->getMessage());
            return HttpStatusEnum::ERROR;
        }
    }

    public function index(string|null $searchByTitle, string $sortBy, string $sortDirection, bool $onlyFavorites): HttpStatusEnum|array
    {
        try {
            $sortableColumns = [
                'date' => 'lectures.created_at',
                'name' => 'lectures.title',
                'progress' => 'video_user_progress.progress',
            ];

            $sortColumn = $sortableColumns[$sortBy] ?? 'lectures.created_at';

            $lecturesQuery = Lecture::with('video.videoUserProgresses')
                ->where('lectures.user_id', Auth::id());

            if ($onlyFavorites) {
                $lecturesQuery->where('lectures.is_favorite', true);
            }

            if (!is_null($searchByTitle)) {
                $lecturesQuery->where('lectures.title', 'LIKE', "{$searchByTitle}%");
            }

            if ($sortBy === SortingParametersEnum::PROGRESS->value) {
                $lecturesQuery->leftJoin('videos', 'lectures.video_id', '=', 'videos.id')
                    ->leftJoin('video_user_progress', 'videos.id', '=', 'video_user_progress.video_id');
            }

            $dashboard = $this->getLecturesDashboard($lecturesQuery);

            $lectures = $lecturesQuery->orderBy($sortColumn, $sortDirection)
                ->paginate(PaginationEnum::VIDEOS_PER_PAGE->value);

            return [
                'dashboard' => $dashboard,
                'lectures' => LecturesPreviewResource::collection($lectures)
            ];
        } catch (\Exception $e) {
            Log::error($e->getMessage());
            return HttpStatusEnum::ERROR;
        }
    }

    public function addToOrRemoveFromFavorites(string $uuid, bool $favorite): HttpStatusEnum
    {
        try {
            $lecture = Lecture::where('uuid', $uuid)->first();

            if (is_null($lecture)) {
                return HttpStatusEnum::NOT_FOUND;
            }

            $lecture->update([
                'is_favorite' => $favorite,
            ]);

            return HttpStatusEnum::OK;
        } catch (\Exception $e) {
            Log::error($e->getMessage());
            return HttpStatusEnum::ERROR;
        }
    }

    // ------------------- private Functions -------------------

    private function getLecturesDashboard($lecturesQuery): array
    {
        $lectures = $lecturesQuery->get();

        $totalVideos = $lectures->count();

        $totalFavoriteLectures = Lecture::where('user_id', Auth::id())->where('is_favorite', true)->count();

        $sumProgress = 0;
        $numOfCompletedVideos = 0;
        foreach ($lectures as $lecture) {
            $sumProgress += $lecture->video->videoUserProgresses->first()->progress;
            $lecture->video->videoUserProgresses->first()->progress == 100 ? $numOfCompletedVideos++ : null;
        }

        $overallProgress = $totalVideos == 0 ? 0 : (int)round($sumProgress / $totalVideos);

        $numOfPages = floor($totalVideos / PaginationEnum::VIDEOS_PER_PAGE->value);

        return [
            'total_lectures' => $totalVideos,
            'total_favorite_lectures' => $totalFavoriteLectures,
            'overall_progress' => $overallProgress,
            'completed_lectures' => $numOfCompletedVideos,
            'incomplete_lectures' => $totalVideos - $numOfCompletedVideos,
            'num_of_pages' => $totalVideos % PaginationEnum::VIDEOS_PER_PAGE->value > 0 ? $numOfPages + 1 : $numOfPages,
        ];
    }

    private function errorDuringUpload(string $failedFunc)
    {
        DB::rollBack();
        Log::error('Error in ' . $failedFunc . ' function');
        return HttpStatusEnum::ERROR;
    }
}
