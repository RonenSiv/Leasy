<?php

namespace App\Enums;

enum WhisperFailedEnum: string
{
    case TRANSCRIPTION_FAILED = "Transcription for this lecture is not available. Please contact the System Manager for further assistance.";
    case SUMMARY_FAILED = "Summary for this lecture is not available. Please contact the System Manager for further assistance.";
    case QUIZ_FAILED = "Quiz for this lecture is not available. Please contact the System Manager for further assistance.";
}
