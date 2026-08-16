<?php

namespace App\Http\Requests\Backoffice;

use App\Models\Brand;
use Illuminate\Foundation\Http\FormRequest;

class BrandUpsertRequest extends FormRequest
{
    public function rules(): array
    {
        /** @var Brand|null $brand */
        $brand = $this->route('brand');

        return [
            'name' => ['required', 'string', 'max:120'],
            'image' => [$brand ? 'nullable' : 'required', 'file', 'image', 'max:2048'],
        ];
    }
}
