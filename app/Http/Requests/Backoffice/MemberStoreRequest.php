<?php

namespace App\Http\Requests\Backoffice;

use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

class MemberStoreRequest extends FormRequest
{
    public function rules(): array
    {
        return [
            'first_name' => ['required', 'string', 'max:120'],
            'last_name' => ['required', 'string', 'max:120'],
            'position' => ['required', 'string', 'max:120'],
            'username' => ['required', 'string', 'max:120', 'unique:users,username'],
            'password' => ['required', 'string', 'min:8', 'confirmed'],
            'is_active' => ['sometimes', 'boolean'],
            'current_team_id' => ['nullable', 'integer', Rule::exists('teams', 'id')],
        ];
    }
}
