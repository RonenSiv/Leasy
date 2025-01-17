<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class QuestionOption extends Model
{
    use HasFactory;

    protected $fillable = [
        'question_id',
        'option_index',
        'option_text',
        'is_correct',
    ];
    protected $hidden = [
        'created_at',
        'updated_at',
    ];

    public function question()
    {
        return $this->belongsTo(Question::class, 'question_id');
    }
}
