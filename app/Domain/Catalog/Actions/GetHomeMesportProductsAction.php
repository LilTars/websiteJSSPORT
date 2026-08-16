<?php

namespace App\Domain\Catalog\Actions;

use App\Models\Product;
use Illuminate\Support\Collection;

class GetHomeMesportProductsAction
{
    /**
     * @return Collection<int, Product>
     */
    public function handle(int $limit = 12): Collection
    {
        $categoryName = (string) config('home_sections.mesport.category_name', 'Mesport');
        $resolvedLimit = (int) config('home_sections.mesport.limit', $limit);

        return Product::query()
            ->with(['category:id,name,slug'])
            ->where('is_active', true)
            ->where(function ($query) {
                $query->whereNull('published_at')
                    ->orWhere('published_at', '<=', now());
            })
            ->whereHas('category', function ($query) use ($categoryName) {
                $query->where('is_active', true)
                    ->where('name', $categoryName);
            })
            ->orderBy('sort_order')
            ->orderByDesc('id')
            ->limit(max(1, $resolvedLimit))
            ->get();
    }
}
