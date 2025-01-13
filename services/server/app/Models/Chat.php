<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Chat extends Model
{
    use HasFactory;

    protected $fillable = [
        'uuid',
        'title',
    ];

    protected $hidden = [
        'created_at',
        'updated_at',
    ];

    public function messages()
    {
        return $this->hasMany(Message::class);
    }

    public function lectures()
    {
        return $this->hasMany(Lecture::class);
    }
}
