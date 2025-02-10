<?php

namespace App\Services;

use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Str;

use Laravel\Passport\Token;

use App\Enums\HttpStatusEnum;

use App\Models\User;

class AuthService
{

  private MailService $mailService;
  public function __construct()
  {
    $this->mailService = new MailService();
  }

  public function register(string $fullName, string $email, string $password): HttpStatusEnum
  {
    try {
      User::create([
        'uuid' => Str::uuid(),
        'email' => $email,
        'full_name' => $fullName,
        'password' => Hash::make($password),
      ]);

      $this->mailService->sendRegisterSuccessfullyMail([
        'full_name' => $fullName,
        'email' => $email,
      ]);

      return HttpStatusEnum::CREATED;
    } catch (\Exception $e) {
      Log::error($e->getMessage());
      return HttpStatusEnum::ERROR;
    }
  }

  public function login(string $email, string $password): HttpStatusEnum|array
  {
    try {

      $user = User::where('email', $email)->first();

      if (is_null($user) || !Hash::check($password, $user->password)) {
        return HttpStatusEnum::UNAUTHORIZED;
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
      return HttpStatusEnum::ERROR;
    }
  }

  public function logout(): HttpStatusEnum
  {
    try {
      Auth::user()->token()->revoke();

      return HttpStatusEnum::OK;
    } catch (\Exception $e) {
      Log::error($e->getMessage());
      return HttpStatusEnum::ERROR;
    }
  }
}
