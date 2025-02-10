<?php

use App\Http\Controllers\TestGptController;
use App\Http\Controllers\LectureController;
use App\Http\Controllers\VideoController;
use App\Http\Controllers\AuthController;
use App\Http\Controllers\ChatController;
use App\Http\Controllers\MailController;
use App\Http\Controllers\QuizController;
use App\Http\Controllers\UserController;
use Illuminate\Support\Facades\Route;

Route::post("/login", [AuthController::class, 'login']);
Route::post("/register", [AuthController::class, 'register']);
Route::post('/logout', [AuthController::class, 'logout'])->middleware(['auth:api']);
Route::get("/user", [UserController::class, 'getAuthUser'])->middleware(['auth:api']);

Route::controller(LectureController::class)
  ->prefix('lecture')
  ->middleware(['auth:api'])
  ->group(function () {
    Route::post('/', 'store');
    Route::get('/', 'index');
    Route::get('/{uuid}', 'show');
    Route::put('favorite/{uuid}', 'addToOrRemoveFromFavorites');
  });

Route::controller(VideoController::class)
  ->prefix('video')
  ->middleware(['auth:api'])
  ->group(function () {
    Route::get('/stream/{uuid}', 'streamVideo');
    Route::get('/preview/{uuid}', 'getPreviewImage');
    Route::put('/last-watched-time/{uuid}', 'updateLastWatchedTime');
    Route::put('/fix-audio/{uuid}',  'fixAudio');
  });

Route::controller(ChatController::class)
  ->prefix('chat')
  ->middleware(['auth:api'])
  ->group(function () {
    Route::post('/send-message/{uuid}', 'sendMessageToChat');
    Route::get('/messages/{uuid}', 'getChatMessages');
  });

Route::controller(QuizController::class)
  ->prefix('quiz')
  ->middleware(['auth:api'])
  ->group(function () {
    Route::get('/questions/{uuid}', 'getQuizQuestions');
    Route::put('/answer/{uuid}', 'answerQuiz');
    Route::put('generate-new-questions/{uuid}', 'generateNewQuiz');
  });

// TODO: add mail 
Route::controller(MailController::class)
  ->prefix('mail')
  ->middleware(['auth:api'])
  ->group(function () {
    Route::post('/support', 'sendSupportMail'); // TODO: complete this route
  });

// TEST
Route::controller(TestGptController::class)
  ->prefix('test')
  ->middleware(['auth:api'])
  ->group(function () {
    Route::post('/ai', 'testAi');
  });
