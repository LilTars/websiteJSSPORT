<?php

namespace App\Http\Requests\Backoffice;

use Illuminate\Foundation\Http\FormRequest;

class JobApplicationUpdateRequest extends FormRequest
{
    public function rules(): array
    {
        return [
            'status' => ['required', 'string', 'max:40'],
            'review_notes' => ['nullable', 'string'],
        ];
    }
}
