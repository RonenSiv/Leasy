<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Video extends Model
{
    use HasFactory;

    protected $fillable = [
        'uuid',
        'video_path',
        'video_name',
        'video_mime_type',
    ];
    protected $hidden = [
        'created_at',
        'updated_at',
    ];
}
