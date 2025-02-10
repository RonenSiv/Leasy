<?php

namespace App\Services;

use App\Enums\HttpStatusEnum;
use App\Mail\MessageReceivedMail;
use App\Mail\RegisterSuccessfullyMail;
use App\Mail\SupportMail;

use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Mail;
use Illuminate\Support\Facades\Log;

class MailService
{
    public function sendSupportMail(string $mailSubject, string $mailContent)
    {
        try {
            $userDetails = [
                'full_name' => Auth::user()->full_name,
                'email' => Auth::user()->email,
            ];

            Mail::to($userDetails['email'])->send(new MessageReceivedMail($userDetails));

            Mail::to(config('mail.support_mail'))->send(new SupportMail(
                $userDetails,
                $mailSubject,
                $mailContent,
            ));

            return HttpStatusEnum::OK;
        } catch (\Exception $e) {
            Log::error($e->getMessage());
            return HttpStatusEnum::ERROR;
        }
    }

    public function sendRegisterSuccessfullyMail(array $userDetails)
    {
        try {
            Mail::to($userDetails['email'])->send(new RegisterSuccessfullyMail($userDetails));

            return HttpStatusEnum::OK;
        } catch (\Exception $e) {
            Log::error($e->getMessage());
            return HttpStatusEnum::ERROR;
        }
    }
}
