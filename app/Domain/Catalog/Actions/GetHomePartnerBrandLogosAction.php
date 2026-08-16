<?php

namespace App\Domain\Catalog\Actions;

use App\Models\Brand;
use Illuminate\Support\Collection;

class GetHomePartnerBrandLogosAction
{
    /**
     * @return Collection<int, Brand>
     */
    public function handle(int $limit = 20): Collection
    {
        return Brand::query()
            ->where('is_active', true)
            ->whereNotNull('image_path')
            ->where('image_path', '!=', '')
            ->orderBy('sort_order')
            ->orderBy('name')
            ->limit(max(1, $limit))
            ->get(['id', 'name', 'image_path']);
    }
}
