<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Lecture extends Model
{
    use HasFactory;

    protected $fillable = [
        'uuid',
        'title',
        'description',
        'user_id',
        'video_id',
        'chat_id',
        'quiz_id',
        'transcription',
        'summary',
        'is_favorite',
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
    public function chat()
    {
        return $this->belongsTo(Chat::class, 'chat_id');
    }
    public function quiz()
    {
        return $this->belongsTo(Quiz::class, 'quiz_id');
    }
}
