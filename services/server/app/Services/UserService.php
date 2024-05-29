<?php

namespace App\Services;

use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Log;
use App\Enums\HTTP_Status;
use App\Models\Gender;
use App\Models\User;
use stdClass;

class UserService
{
    public function getAuthUser()
    {
        try {
            $user = User::where('id', Auth::id())->first();

            if (!$user) {
                return HTTP_Status::NOT_FOUND;
            }

            return $user;
        } catch (\Exception $e) {
            Log::error($e->getMessage());
            return HTTP_Status::ERROR;
        }
    }


}