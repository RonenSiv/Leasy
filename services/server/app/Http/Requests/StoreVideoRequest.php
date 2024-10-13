<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class StoreVideoRequest extends FormRequest
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
            'video' => 'required|file|mimes:mp4|max:102400',
        ];
    }

    public function messages(): array
    {
        return [
            'video.required' => 'יש להעלות ביטוח רכב עבור הרכב השני',
            'video.file' => 'יש להעלות סרטון בלבד',
            'video.mimes' => 'סיומת קובץ אינה תקינה. יש להעלות רק קבצים מסוג: mp4',
            'video.max' => 'קובץ גדול מידי'
        ];
    }
}
