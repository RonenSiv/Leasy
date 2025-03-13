<?php

namespace App\Services;

use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Str;

use App\Enums\HttpStatusEnum;

use App\Models\User;
use Laravel\Passport\Token;

use Google_Client;
use Illuminate\Support\Facades\Http;
use Laravel\Socialite\Facades\Socialite;

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

  public function googleLogin(string $token)
  {
    if (!$token) {
      return HttpStatusEnum::BAD_REQUEST;
    }

    // Make a request to Google's user info endpoint
    $response = Http::get("https://www.googleapis.com/oauth2/v1/userinfo?access_token={$token}");

    if ($response->failed()) {
      return HttpStatusEnum::BAD_REQUEST;
    }

    $userData = $response->json();

    // Extract user details
    $googleId = $userData['id'] ?? null;
    $email = $userData['email'] ?? null;
    $fullName = $userData['name'] ?? null;

    if (!$googleId || !$email) {
      return HttpStatusEnum::UNAUTHORIZED;
    }

    $user = User::updateOrCreate(
      [
        'google_id' => $googleId
      ],
      [
        'uuid' => Str::uuid(),
        'full_name' => $fullName,
        'email' => $email,
        'password' => Hash::make(uniqid()),
      ]
    );

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
  }
}
