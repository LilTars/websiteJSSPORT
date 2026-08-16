<?php

namespace App\Http\Requests\Backoffice;

use App\Models\JobPosting;
use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

class JobPostingUpsertRequest extends FormRequest
{
    public function rules(): array
    {
        $jobPostingParam = $this->route('jobPosting');
        $jobPostingId = $jobPostingParam instanceof JobPosting
            ? $jobPostingParam->id
            : (is_numeric($jobPostingParam) ? (int) $jobPostingParam : null);

        return [
            'title' => ['required', 'string', 'max:180'],
            'description' => ['required', 'string'],
            'positions_count' => ['required', 'integer', 'min:1', 'max:9999'],
            'is_active' => ['sometimes', 'boolean'],
            'slug' => ['sometimes', 'string', 'max:220', Rule::unique('job_postings', 'slug')->ignore($jobPostingId)],
        ];
    }
}
