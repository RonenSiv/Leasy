<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class SendMailRequest extends FormRequest
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
            'mail_subject'   => 'required|string|max:50',
            'mail_content'   => 'required|string|max:200',
        ];
    }

    /**
     * Get the custom messages for validation errors.
     *
     * @return array<string, string>
     */
    public function messages(): array
    {
        return [
            'mail_subject.required' => 'The email subject is required.',
            'mail_subject.string' => 'The email subject must be a valid string.',
            'mail_subject.max' => 'The email subject cannot exceed 50 characters.',

            'mail_content.required' => 'The email content is required.',
            'mail_content.string' => 'The email content must be a valid string.',
            'mail_content.max' => 'The email content cannot exceed 200 characters.',
        ];
    }
}
