<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Question extends Model
{
    use HasFactory;
    protected $fillable = [
        'uuid',
        'quiz_id',
        'question_text',
    ];
    protected $hidden = [
        'created_at',
        'updated_at',
    ];

    public function quiz()
    {
        return $this->belongsTo(Quiz::class, 'quiz_id');
    }

    public function questionOptions()
    {
        return $this->hasMany(QuestionOption::class);
    }
}
