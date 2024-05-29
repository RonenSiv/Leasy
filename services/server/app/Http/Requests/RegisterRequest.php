<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class RegisterRequest extends FormRequest
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
            'full_name' => 'required|string|regex:/^(\p{L}+\s\p{L}+[\p{L}\s]*)$/u',
            'email' => 'required|string|email|unique:users,email',
            'phone_number' => 'required|string|regex:/^\d{3}-?\d{3}-?\d{4}$/',
            'password' => 'required|string|min:8|regex:/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d).+$/',
        ];
    }

    public function messages(): array
    {
        return [
            'full_name.required' => 'Please enter your full name.',
            'full_name.string' => 'Full name must be a string.',
            'full_name.regex' => 'Please enter a valid full name with at least two words.',

            'email.required' => 'Please enter your email address.',
            'email.string' => 'Email must be a string.',
            'email.email' => 'Please enter a valid email address.',
            'email.unique' => 'This email address is already registered.',

            'phone_number.required' => 'Please enter your phone number.',
            'phone_number.string' => 'Phone number must be a string.',
            'phone_number.regex' => 'Please enter a valid phone number.',

            'password.required' => 'Please enter a password.',
            'password.string' => 'Password must be a string.',
            'password.min' => 'Password must be at least 8 characters long.',
            'password.regex' => 'Password must contain at least one uppercase letter, one lowercase letter, and one number.',
        ];
    }
}
