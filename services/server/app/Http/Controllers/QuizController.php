<?php

namespace App\Http\Controllers;

use App\Services\QuizService;
use Illuminate\Http\Request;

class QuizController extends Controller
{
    private QuizService $quizService;
    public function __construct()
    {
        $this->quizService = new QuizService();
    }
}
