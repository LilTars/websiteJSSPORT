<?php

namespace App\Http\Requests\Backoffice;

use App\Models\Product;
use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

class ProductUpsertRequest extends FormRequest
{
    public function rules(): array
    {
        /** @var Product|null $product */
        $product = $this->route('product');

        return [
            'name' => ['required', 'string', 'max:180'],
            'description' => ['nullable', 'string'],
            'brand_id' => ['nullable', 'integer', Rule::exists('brands', 'id')],
            'product_category_id' => ['required', 'integer', Rule::exists('product_categories', 'id')],
            'price' => ['nullable', 'numeric', 'min:0'],
            'images' => [$product ? 'nullable' : 'required', 'array', 'min:1'],
            'images.*' => ['required', 'file', 'image', 'max:2048'],
            'retained_image_ids' => ['sometimes', 'array'],
            'retained_image_ids.*' => ['integer', Rule::exists('product_images', 'id')],
            'is_active' => ['sometimes', 'boolean'],
        ];
    }
}
