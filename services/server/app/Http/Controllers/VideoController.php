<?php

namespace App\Http\Controllers;

use App\Services\VideoService;
use Illuminate\Http\Request;

class VideoController extends Controller
{
    private VideoService $videoService;
    public function __construct()
    {
        $this->videoService = new VideoService();
    }
}
