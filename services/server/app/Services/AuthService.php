<?php

namespace App\Services;

use App\Enums\HTTP_Status;
use Illuminate\Support\Facades\Log;
use Laravel\Passport\Token;
use App\Models\User;
use Illuminate\Support\Facades\Hash;


class AuthService
{
  public function register(string $fullName, string $email, string $phoneNumber, string $password)
  {
    try {
      User::create([
        'email' => $email,
        'full_name' => $fullName,
        'phone_number' => $phoneNumber,
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
        return HTTP_Status::NOT_FOUND;
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
}