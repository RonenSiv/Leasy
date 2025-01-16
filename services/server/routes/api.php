<?php

use App\Http\Controllers\AudioController;
use App\Http\Controllers\AuthController;
use App\Http\Controllers\ChatController;
use App\Http\Controllers\LectureController;
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
  });

Route::controller(AudioController::class)
  ->prefix('audio')
  ->middleware(['auth:api'])
  ->group(function () {
    Route::put('/fix/{videoUuid}',  'fixAudio');
  });

// Route::controller(ChatController::class)
//   ->prefix('chat')
//   ->middleware(['auth:api'])
//   ->group(function () {
//     Route::get('/',  'getChatResponse');
//   });

// Route::controller(VideoController::class)
//   ->prefix('quiz')
//   ->middleware(['auth:api'])
//   ->group(function () {
//     //
//   });

Route::controller(ChatController::class)
  ->prefix('test')
  ->middleware(['auth:api'])
  ->group(function () {
    Route::get('/',  'getChatResponse');
  });
