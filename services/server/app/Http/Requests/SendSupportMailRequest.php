<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class SendSupportMailRequest extends FormRequest
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
            'sender_mail_address' => 'required',
            'sender_full_name'  => 'required|string|max:25',
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

            'sender_mail_address.required' => 'The sender email address is required.',
            'sender_mail_address.email'    => 'The sender email address must be a valid email.',

            'sender_full_name.required' => 'The sender full name is required.',
            'sender_full_name.string'   => 'The sender full name must be a valid string.',
            'sender_full_name.max'      => 'The sender full name cannot exceed 25 characters.',
        ];
    }
}
