<?php

namespace App\Enums;

enum PaginationEnum: int
{
    case VIDEOS_PER_PAGE = 6;
    case MESSAGES_PER_PAGE = 20;
}
