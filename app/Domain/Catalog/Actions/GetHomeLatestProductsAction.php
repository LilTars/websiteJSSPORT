<?php

namespace App\Domain\Catalog\Actions;

use App\Models\Product;
use Illuminate\Support\Collection;

class GetHomeLatestProductsAction
{
    /**
     * @return Collection<int, Product>
     */
    public function handle(int $limit = 10): Collection
    {
        return Product::query()
            ->with(['category:id,name,slug'])
            ->where('is_active', true)
            ->where(function ($query) {
                $query->whereNull('published_at')
                    ->orWhere('published_at', '<=', now());
            })
            ->orderByDesc('id')
            ->limit(max(1, $limit))
            ->get();
    }
}
