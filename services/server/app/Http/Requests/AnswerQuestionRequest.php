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
            'question_uuid' => 'required|uuid|exists:questions,uuid',
            'option_index' => 'required',
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
            'question_uuid.required' => 'The question UUID is required.',
            'question_uuid.uuid' => 'The question UUID must be a valid UUID.',
            'question_uuid.exists' => 'The question UUID must exist in the questions table.',
            'option_index.required' => 'The option index is required.',
        ];
    }
}
