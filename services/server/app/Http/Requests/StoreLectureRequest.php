<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class StoreLectureRequest extends FormRequest
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
            'video' => 'required|file|mimes:mp4|max:512000',
            'title' => 'required|string|max:255',
            'description' => 'required|string|max:5000',
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
            'video.required' => 'The lecture video must be uploaded',
            'video.file' => 'The video is invalid',
            'video.mimes' => 'Invalid file extension. Only mp4 files are allowed',
            'video.max' => 'The video is too large',

            'title.required' => 'The lecture title is required',
            'title.string' => 'The title must be a valid string',
            'title.max' => 'The title may not be longer than 255 characters',

            'description.required' => 'The lecture description is required',
            'description.string' => 'The description must be a valid string',
            'description.max' => 'The description may not be longer than 5000 characters',
        ];
    }
}
