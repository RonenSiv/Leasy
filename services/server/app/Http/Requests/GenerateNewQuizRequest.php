<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class GenerateNewQuizRequest extends FormRequest
{
    /**
     * Determine if the user is authorized to make this request.
     */
    public function authorize(): bool
    {
        return true;
    }

    /**
     * Get the validation rules that apply to the request.
     *
     * @return array<string, \Illuminate\Contracts\Validation\ValidationRule|array<mixed>|string>
     */
    public function rules(): array
    {
        return [
            'old_quiz_uuid' => [
                'required',
                'uuid',
                'exists:quizzes,uuid'
            ],
            'summary' => [
                'required',
                'string'
            ],
        ];
    }

    /**
     * Get the custom messages for validation errors.
     *
     * @return array
     */
    public function messages(): array
    {
        return [
            'old_quiz_uuid.required' => 'The old quiz UUID is required.',
            'old_quiz_uuid.uuid' => 'The old quiz UUID must be a valid UUID.',
            'old_quiz_uuid.exists' => 'The old quiz UUID must exist in the quizzes table.',
            'summary.required' => 'The summary is required.',
            'summary.string' => 'The summary must be a string.',
        ];
    }
}
