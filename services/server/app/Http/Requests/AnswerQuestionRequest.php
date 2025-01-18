<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class AnswerQuestionRequest extends FormRequest
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
            'answers' => 'required|array',
            'answers.*.question_uuid' => 'required|uuid|exists:questions,uuid',
            'answers.*.answer' => 'required',
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
            'answers.required' => 'The answers array is required.',
            'answers.array' => 'The answers must be an array.',
            'answers.*.question_uuid.required' => 'The question UUID is required.',
            'answers.*.question_uuid.uuid' => 'The question UUID must be a valid UUID.',
            'answers.*.question_uuid.exists' => 'The question UUID must exist in the questions table.',
            'answers.*.answer.required' => 'The answer index is required.',
        ];
    }
}
