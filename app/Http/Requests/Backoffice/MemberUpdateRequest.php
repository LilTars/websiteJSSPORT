<?php

namespace App\Http\Requests\Backoffice;

use App\Models\User;
use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

class MemberUpdateRequest extends FormRequest
{
    public function rules(): array
    {
        $member = $this->route('member');
        $memberId = $member instanceof User ? $member->id : (is_string($member) || is_int($member) ? (int) $member : null);

        return [
            'first_name' => ['required', 'string', 'max:120'],
            'last_name' => ['required', 'string', 'max:120'],
            'position' => ['required', 'string', 'max:120'],
            'username' => ['required', 'string', 'max:120', Rule::unique('users', 'username')->ignore($memberId)],
            'is_active' => ['sometimes', 'boolean'],
            'current_team_id' => ['nullable', 'integer', Rule::exists('teams', 'id')],
        ];
    }
}
