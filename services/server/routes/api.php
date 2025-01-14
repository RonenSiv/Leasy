<?php

use App\Http\Controllers\AuthController;
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

// Route::controller(VideoController::class)
//   ->prefix('chat')
//   ->middleware(['auth:api'])
//   ->group(function () {
//     //
//   });

// Route::controller(VideoController::class)
//   ->prefix('quiz')
//   ->middleware(['auth:api'])
//   ->group(function () {
//     //
//   });
