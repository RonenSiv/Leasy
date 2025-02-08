<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class addToOrRemoveFromFavoritesRequest extends FormRequest
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
            'favorite' => [
                'required',
                'boolean'
            ]
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
            'favorite.required' => 'The favorite field is required.',
            'favorite.boolean' => 'The favorite field must be true or false.',
        ];
    }
}
