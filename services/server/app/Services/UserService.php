<?php

namespace App\Services;

use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Log;

use App\Enums\HttpStatusEnum;

use App\Models\User;

class UserService
{
    public function getAuthUser(): User|HttpStatusEnum
    {
        try {
            $user = User::where('id', Auth::id())->first();

            if (is_null($user)) {
                return HttpStatusEnum::NOT_FOUND;
            }

            return $user;
        } catch (\Exception $e) {
            Log::error($e->getMessage());
            return HttpStatusEnum::ERROR;
        }
    }
}
