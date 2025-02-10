<?php

namespace App\Http\Controllers;

use App\Enums\HttpStatusEnum;
use App\Http\Requests\SendMailRequest;
use App\Services\MailService;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
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
     *     description="Sends an email to the support team with the provided subject and content.",
     *     tags={"Mails"},
     *     @OA\RequestBody(
     *         required=true,
     *         description="Details of the email to be sent",
     *         @OA\JsonContent(
     *             type="object",
     *             required={"mail_subject", "mail_content"},
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
     *             )
     *         )
     *     ),
     *     @OA\Response(
     *         response=200,
     *         description="The email was sent successfully",
     *     ),
     *     @OA\Response(
     *         response=204,
     *         description="No content"
     *     ),
     *     @OA\Response(
     *         response=500,
     *         description="An error occurred"
     *     )
     * )
     */

    public function sendSupportMail(SendMailRequest $request): JsonResponse
    {
        $result = $this->mailService->sendSupportMail(
            mailSubject: $request->mail_subject,
            mailContent: $request->mail_content,
        );

        return match ($result) {
            HttpStatusEnum::ERROR => response()->json(['message' => 'An error occurred'], Response::HTTP_INTERNAL_SERVER_ERROR),
            HttpStatusEnum::OK => response()->json(['message' => 'The email was sent successfully.'], Response::HTTP_INTERNAL_SERVER_ERROR),
            default => response()->json(['message' => 'no content'], Response::HTTP_NO_CONTENT)
        };
    }
}
