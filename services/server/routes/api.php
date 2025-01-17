<?php

use App\Http\Controllers\AuthController;
use App\Http\Controllers\ChatController;
use App\Http\Controllers\LectureController;
use App\Http\Controllers\QuizController;
use App\Http\Controllers\UserController;
use App\Http\Controllers\VideoController;
use Illuminate\Support\Facades\Route;

Route::post("login", [AuthController::class, 'login']);
Route::post("register", [AuthController::class, 'register']);
Route::get("user", [UserController::class, 'getAuthUser'])->middleware(['auth:api']);

Route::controller(LectureController::class)
  ->prefix('lecture')
  ->middleware(['auth:api'])
  ->group(function () {
    Route::post('/',  'store');
    Route::get('/',  'index');
    Route::get('/{uuid}',  'show');
  });

Route::controller(VideoController::class)
  ->prefix('video')
  ->middleware(['auth:api'])
  ->group(function () {
    Route::put('/last-watched-time/{uuid}',  'updateLastWatchedTime');
    Route::put('/fix-audio/{uuid}',  'fixAudio');
  });

Route::controller(ChatController::class)
  ->prefix('chat')
  ->middleware(['auth:api'])
  ->group(function () {
    Route::post('/send-message/{uuid}', 'sendMessageToChat');
  });

Route::controller(QuizController::class)
  ->prefix('quiz')
  ->middleware(['auth:api'])
  ->group(function () {
    Route::get('/next-question/{uuid}',  'getNextQuestion');
    Route::put('/add-to-score/{uuid}',  'addToScore');
  });

Route::controller(ChatController::class)
  ->prefix('test')
  ->middleware(['auth:api'])
  ->group(function () {
    Route::get('/',  'testGPT');
  });
