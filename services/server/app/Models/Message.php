<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Message extends Model
{
    use HasFactory;

    protected $fillable = [
        'chat_id',
        'sender',
        'message',
    ];

    protected $hidden = [
        'created_at',
        'updated_at',
    ];

    public function chat()
    {
        return $this->belongsTo(Chat::class, 'chat_id');
    }
}
