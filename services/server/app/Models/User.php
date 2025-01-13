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
        'phone_number',
        'password',
    ];
    protected $hidden = [
        'password',
        'remember_token',
        'password',
        'created_at',
        'updated_at',
    ];

    public function lecture()
    {
        return $this->hasMany(Lecture::class);
    }
}
