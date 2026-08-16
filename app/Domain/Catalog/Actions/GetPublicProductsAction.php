<?php

namespace App\Domain\Catalog\Actions;

use App\Models\Product;
use App\Models\ProductCategory;
use Illuminate\Support\Collection;

class GetPublicProductsAction
{
    /**
     * @return array{categories: Collection<int, ProductCategory>, products: Collection<int, Product>}
     */
    public function handle(): array
    {
        $categories = ProductCategory::query()
            ->where('is_active', true)
            ->orderBy('sort_order')
            ->orderBy('name')
            ->get();

        $products = Product::query()
            ->with(['category'])
            ->where('is_active', true)
            ->where(function ($query) {
                $query->whereNull('published_at')
                    ->orWhere('published_at', '<=', now());
            })
            ->orderBy('sort_order')
            ->orderByDesc('id')
            ->get();

        return [
            'categories' => $categories,
            'products' => $products,
        ];
    }
}
