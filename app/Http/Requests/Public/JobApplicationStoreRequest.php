<?php

namespace App\Http\Requests\Public;

use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

class JobApplicationStoreRequest extends FormRequest
{
    public function rules(): array
    {
        return [
            'job_posting_id' => ['nullable', 'integer', Rule::exists('job_postings', 'id')],
            'full_name' => ['required', 'string', 'max:180'],
            'email' => ['required', 'email', 'max:190'],
            'phone' => ['nullable', 'string', 'max:30'],
            'line_id' => ['nullable', 'string', 'max:120'],
            'portfolio_url' => ['nullable', 'url', 'max:255'],
            'resume_path' => ['nullable', 'string', 'max:255'],
            'message' => ['nullable', 'string'],
            'source' => ['nullable', 'string', 'max:120'],
        ];
    }
}
