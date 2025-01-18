<?php

namespace App\Services;

use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Str;

use Laravel\Passport\Token;

use App\Enums\HTTP_Status;

use App\Models\User;
use Illuminate\Support\Facades\Auth;

class AuthService
{
  public function register(string $fullName, string $email, string $password)
  {
    try {
      User::create([
        'uuid' => Str::uuid(),
        'email' => $email,
        'full_name' => $fullName,
        'password' => Hash::make($password),
      ]);

      return HTTP_Status::CREATED;
    } catch (\Exception $e) {
      Log::error($e->getMessage());
      return HTTP_Status::ERROR;
    }
  }

  public function login(string $email, string $password): HTTP_Status|array
  {
    try {

      $user = User::where('email', $email)->first();

      if (is_null($user) || !Hash::check($password, $user->password)) {
        return HTTP_Status::UNAUTHORIZED;
      }

      Token::where('user_id', $user->id)->update([
        'revoked' => true,
      ]);

      $tokenName = config('auth.access_token_name');
      $token = $user->createToken($tokenName);

      return [
        "full_name" => $user->full_name,
        "email" => $user->email,
        "tokenName" => $tokenName,
        "accessToken" => $token->accessToken,
      ];
    } catch (\Exception $e) {
      Log::error($e->getMessage());
      return HTTP_Status::ERROR;
    }
  }

  public function logout(): HTTP_Status
  {
    try {
      Auth::user()->token()->revoke();

      return HTTP_Status::OK;
    } catch (\Exception $e) {
      Log::error($e->getMessage());
      return HTTP_Status::ERROR;
    }
  }
}
