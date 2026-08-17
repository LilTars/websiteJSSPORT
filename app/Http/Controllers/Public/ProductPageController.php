<?php

namespace App\Http\Controllers\Public;

use App\Domain\Catalog\Actions\GetPublicProductsAction;
use App\Http\Controllers\Controller;
use App\Models\Product;
use Illuminate\Support\Facades\Storage;
use Inertia\Inertia;
use Inertia\Response;

class ProductPageController extends Controller
{
    public function index(GetPublicProductsAction $getPublicProducts): Response
    {
        $data = $getPublicProducts->handle();

        return Inertia::render('Products/Index', [
            'categories' => $data['categories']->map(fn ($category) => [
                'id' => $category->id,
                'name' => $category->name,
                'slug' => $category->slug,
            ])->values(),
            'products' => $data['products']->map(fn ($product) => [
                'id' => $product->id,
                'name' => $product->name,
                'category' => $product->category?->name,
                'category_slug' => $product->category?->slug,
                'price' => $product->price !== null ? (float) $product->price : null,
                'imageUrl' => $this->resolveImageUrl($product->thumbnail_path),
                'hidePriceOnCard' => ! $product->show_price_on_card,
            ])->values(),
        ]);
    }

    public function show(Product $product): Response
    {
        $product->load(['category', 'images']);

        return Inertia::render('Products/Show', [
            'product' => [
                'id' => $product->id,
                'brandTag' => $product->brand_tag,
                'name' => $product->name,
                'price' => $product->price !== null ? (float) $product->price : null,
                'description' => $product->description,
                'category' => $product->category?->name,
                'material' => $product->material,
                'turnaround' => $product->turnaround,
                'images' => $product->images
                    ->pluck('image_path')
                    ->map(fn (?string $path) => $this->resolveImageUrl($path))
                    ->filter()
                    ->values(),
                'hidePriceOnDetail' => ! $product->show_price_on_detail,
            ],
        ]);
    }

    private function resolveImageUrl(?string $path): ?string
    {
        if ($path === null) {
            return null;
        }

        $normalized = trim($path);
        $normalized = str_replace('\\', '/', $normalized);
        $normalized = preg_replace('#^/+#', '', $normalized) ?? $normalized;

        if ($normalized === '') {
            return null;
        }

        if (preg_match('#^https?://#i', $normalized)) {
            $host = parse_url($normalized, PHP_URL_HOST);
            $pathOnly = parse_url($normalized, PHP_URL_PATH) ?? $normalized;

            if ($host !== null && ! in_array(strtolower($host), ['localhost', '127.0.0.1'], true)) {
                return $normalized;
            }

            $normalized = ltrim($pathOnly, '/');
        }

        if (str_starts_with($normalized, 'images/') || str_starts_with($normalized, 'uploads/') || str_starts_with($normalized, 'storage/')) {
            return '/'.$normalized;
        }

        if (str_starts_with($normalized, '/')) {
            return $normalized;
        }

        if (str_starts_with($normalized, 'http://') || str_starts_with($normalized, 'https://')) {
            return $normalized;
        }

        return Storage::disk('public')->url($normalized);
    }
}
