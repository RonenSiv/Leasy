<?php

use App\Http\Controllers\AuthController;
use Illuminate\Support\Facades\Route;

Route::get('/', function () {
    return view('welcome');
});

Route::controller(AuthController::class)
    ->group(function () {
        Route::get('/auth/google', 'googleLogin')->name('auth.google');
    });
