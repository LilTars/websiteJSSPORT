<?php

namespace App\Http\Requests\Backoffice;

use App\Models\Planner;
use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

class PlannerUpsertRequest extends FormRequest
{
    public function rules(): array
    {
        /** @var Planner|null $planner */
        $planner = $this->route('planner');

        return [
            'name' => ['required', 'string', 'max:160'],
            'slug' => ['required', 'string', 'max:180', Rule::unique('planners', 'slug')->ignore($planner?->id)],
            'contact_name' => ['nullable', 'string', 'max:160'],
            'phone' => ['nullable', 'string', 'max:30'],
            'email' => ['nullable', 'email', 'max:190'],
            'line_id' => ['nullable', 'string', 'max:120'],
            'facebook_url' => ['nullable', 'url', 'max:255'],
            'notes' => ['nullable', 'string'],
            'is_active' => ['sometimes', 'boolean'],
            'sort_order' => ['sometimes', 'integer', 'min:0'],
        ];
    }
}
