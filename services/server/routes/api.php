<?php

use App\Http\Controllers\AuthController;
use App\Http\Controllers\UserController;
use App\Http\Controllers\VideoController;
use Illuminate\Support\Facades\Route;

Route::post("login", [AuthController::class, 'login']);
Route::post("register", [AuthController::class, 'register']);
Route::get("user", [UserController::class, 'getAuthUser'])->middleware(['auth:api']);

Route::controller(VideoController::class)
  ->prefix('videos')
  ->middleware(['auth:api'])
  ->group(function () {
    Route::post('/',  'store');
    Route::get('/{uuid}',  'show');
    Route::get('/',  'index');
  });

Route::controller(VideoController::class)
  ->prefix('chat')
  ->middleware(['auth:api'])
  ->group(function () {
    Route::get('/',  'getChatResponse');
    Route::get('/quiz',  'getQuiz');
    Route::get('/history{id}',  'getChatHistory');
  });
