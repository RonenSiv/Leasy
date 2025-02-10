<?php

namespace App\Http\Controllers;

use App\Enums\HttpStatusEnum;
use App\Http\Requests\SendSupportMailRequest;
use App\Services\MailService;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Response;

class MailController extends Controller
{
    private MailService $mailService;
    public function __construct()
    {
        $this->mailService = new MailService();
    }

    /**
     * @OA\Post(
     *     path="/api/mail/support",
     *     summary="Send a support email",
     *     description="Sends an email to the support team with the provided details.",
     *     tags={"Mails"},
     *     @OA\RequestBody(
     *         required=true,
     *         description="Details of the email to be sent",
     *         @OA\JsonContent(
     *             type="object",
     *             required={"mail_subject", "mail_content", "sender_mail_address", "sender_full_name"},
     *             @OA\Property(
     *                 property="mail_subject",
     *                 type="string",
     *                 maxLength=50,
     *                 description="The subject of the support email",
     *                 example="Issue with account login"
     *             ),
     *             @OA\Property(
     *                 property="mail_content",
     *                 type="string",
     *                 maxLength=200,
     *                 description="The content of the support email",
     *                 example="Hello, I'm unable to log in to my account. I tried resetting my password but still can't access it. Please assist."
     *             ),
     *             @OA\Property(
     *                 property="sender_mail_address",
     *                 type="string",
     *                 format="email",
     *                 description="The email address of the sender",
     *                 example="omer.groman123@gmail.com"
     *             ),
     *             @OA\Property(
     *                 property="sender_full_name",
     *                 type="string",
     *                 maxLength=100,
     *                 description="The full name of the sender",
     *                 example="Omer Groman"
     *             )
     *         )
     *     ),
     *     @OA\Response(
     *         response=200,
     *         description="The email was sent successfully",
     *     ),
     *     @OA\Response(
     *         response=204,
     *         description="No content",
     *     ),
     *     @OA\Response(
     *         response=500,
     *         description="An error occurred",
     *     )
     * )
     */


    public function sendSupportMail(SendSupportMailRequest $request): JsonResponse
    {
        $result = $this->mailService->sendSupportMail(
            mailSubject: $request->mail_subject,
            mailContent: $request->mail_content,
            senderMailAddress: $request->sender_mail_address,
            senderFullName: $request->sender_full_name,
        );

        return match ($result) {
            HttpStatusEnum::ERROR => response()->json(['message' => 'An error occurred'], Response::HTTP_INTERNAL_SERVER_ERROR),
            HttpStatusEnum::OK => response()->json(['message' => 'The email was sent successfully.'], Response::HTTP_INTERNAL_SERVER_ERROR),
            default => response()->json(['message' => 'no content'], Response::HTTP_NO_CONTENT)
        };
    }
}
