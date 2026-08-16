<?php

namespace App\Domain\Catalog\Actions;

use App\Models\Product;

class GetSitemapUrlsAction
{
    /**
     * @return array<int, array{loc: string, lastmod: string, changefreq: string, priority: string}>
     */
    public function handle(): array
    {
        $baseUrl = rtrim((string) config('seo.base_url'), '/');
        $now = now()->toAtomString();

        $staticUrls = [
            [
                'loc' => $baseUrl.'/',
                'lastmod' => $now,
                'changefreq' => 'daily',
                'priority' => '1.0',
            ],
            [
                'loc' => $baseUrl.'/products',
                'lastmod' => $now,
                'changefreq' => 'daily',
                'priority' => '0.9',
            ],
            [
                'loc' => $baseUrl.'/about',
                'lastmod' => $now,
                'changefreq' => 'weekly',
                'priority' => '0.7',
            ],
            [
                'loc' => $baseUrl.'/careers',
                'lastmod' => $now,
                'changefreq' => 'weekly',
                'priority' => '0.6',
            ],
            [
                'loc' => $baseUrl.'/contact',
                'lastmod' => $now,
                'changefreq' => 'weekly',
                'priority' => '0.8',
            ],
        ];

        $productUrls = Product::query()
            ->where('is_active', true)
            ->whereNotNull('published_at')
            ->where('published_at', '<=', now())
            ->orderByDesc('updated_at')
            ->get(['id', 'updated_at'])
            ->map(fn (Product $product) => [
                'loc' => $baseUrl.'/products/'.$product->id,
                'lastmod' => ($product->updated_at ?? now())->toAtomString(),
                'changefreq' => 'weekly',
                'priority' => '0.8',
            ])
            ->values()
            ->all();

        return [...$staticUrls, ...$productUrls];
    }
}
