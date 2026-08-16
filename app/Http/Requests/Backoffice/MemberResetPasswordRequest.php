<?php

namespace App\Http\Requests\Backoffice;

use Illuminate\Foundation\Http\FormRequest;

class MemberResetPasswordRequest extends FormRequest
{
    public function rules(): array
    {
        return [
            'password' => ['required', 'string', 'min:8'],
        ];
    }
}
