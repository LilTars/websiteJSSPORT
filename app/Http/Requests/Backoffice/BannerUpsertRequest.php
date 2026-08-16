<?php

namespace App\Http\Requests\Backoffice;

use App\Models\Banner;
use Illuminate\Foundation\Http\FormRequest;

class BannerUpsertRequest extends FormRequest
{
    public function rules(): array
    {
        /** @var Banner|null $banner */
        $banner = $this->route('banner');

        return [
            'image' => [$banner ? 'nullable' : 'required', 'file', 'image', 'max:2048'],
            'is_active' => ['sometimes', 'boolean'],
        ];
    }
}
