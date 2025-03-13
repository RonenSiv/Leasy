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

    $client = new Google_Client(['client_id' => config('services.google.client_id')]);
    $payload = $client->verifyIdToken($token);

    if (!$payload) {
      return response()->json(['error' => 'Invalid token'], 401);
    }

    // Get user info from Google
    $googleId = $payload['sub'];
    $email = $payload['email'];
    $fullName = $payload['name'];

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

  // public function googleAuthentication(): array|HttpStatusEnum
  // {
  //   try {
  //     $googleUser = Socialite::driver('google')->user();

  //     $user = User::where('google_id', $googleUser->id)->first();

  //     if (is_null($user)) {
  //       $user = User::where('email', $googleUser->email)->first();

  //       if (is_null($user)) {
  //         $user = User::create([
  //           'uuid' => Str::uuid(),
  //           'full_name' => $googleUser->name,
  //           'email' => $googleUser->email,
  //           'password' => Hash::make(uniqid()),
  //           'google_id' => $googleUser->id,
  //         ]);
  //       } else {
  //         $user->update(['google_id' => $googleUser->id]);
  //       }
  //     }

  //     Token::where('user_id', $user->id)->update([
  //       'revoked' => true,
  //     ]);

  //     $tokenName = config('auth.access_token_name');
  //     $token = $user->createToken($tokenName);

  //     return [
  //       "full_name" => $user->full_name,
  //       "email" => $user->email,
  //       "tokenName" => $tokenName,
  //       "accessToken" => $token->accessToken,
  //     ];
  //   } catch (\Exception $e) {
  //     Log::error($e->getMessage());
  //     return HttpStatusEnum::ERROR;
  //   }
  // }
}
