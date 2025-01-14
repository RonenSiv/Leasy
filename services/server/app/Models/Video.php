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
        'preview_image_path',
        'preview_image_name',
        'preview_image_mime_type',
    ];
    protected $hidden = [
        'created_at',
        'updated_at',
    ];

    public function lecture()
    {
        return $this->hasMany(Lecture::class);
    }
}
