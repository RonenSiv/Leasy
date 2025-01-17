<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class VideoUserProgress extends Model
{
    use HasFactory;
    
    protected $fillable = [
        'video_id',
        'user_id',
        'last_watched_time',
    ];

    protected $hidden = [
        'created_at',
        'updated_at',
    ];

    public function user()
    {
        return $this->belongsTo(User::class, 'user_id');
    }
    public function video()
    {
        return $this->belongsTo(Video::class, 'video_id');
    }
}
