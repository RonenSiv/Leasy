<?php

namespace App\Enums;

enum HTTP_Status
{
    case OK;
    case GONE;
    case ERROR;
    case FAILED;
    case CREATED;
    case INVALID;
    case DUPLICATE;
    case NOT_FOUND;
    case FORBIDDEN;
    case BAD_REQUEST;
    case UNAUTHORIZED;
}
