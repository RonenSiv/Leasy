<?php

namespace App\Models;

// use Illuminate\Contracts\Auth\MustVerifyEmail;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Foundation\Auth\User as Authenticatable;
use Illuminate\Notifications\Notifiable;
use Laravel\Passport\HasApiTokens;

class User extends Authenticatable
{
    use HasFactory, Notifiable, HasApiTokens;
    protected $fillable = [
        'uuid',
        'full_name',
        'email',
        'password',
        'google_id',
    ];
    protected $hidden = [
        'password',
        'created_at',
        'updated_at',
    ];

    public function lectures()
    {
        return $this->hasMany(Lecture::class);
    }
    public function videoUserProgress()
    {
        return $this->hasMany(VideoUserProgress::class);
    }
}
