<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class UpdateLastWatchedTimeRequest extends FormRequest
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
     * @return array
     */
    public function rules(): array
    {
        return [
            'last_watched_time' => [
                'required',
                'integer',
                'min:0',
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
            'last_watched_time.required' => 'The last watched time is required.',
            'last_watched_time.integer' => 'The last watched time must be a valid integer.',
            'last_watched_time.min' => 'The last watched time must be a positive number.',
        ];
    }
}
