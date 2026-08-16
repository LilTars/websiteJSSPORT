<?php

namespace App\Http\Controllers\Public;

use App\Domain\Catalog\Actions\GetHomeMesportProductsAction;
use App\Domain\Catalog\Actions\GetHomeLatestProductsAction;
use App\Domain\Catalog\Actions\GetHomePartnerBrandLogosAction;
use App\Domain\Catalog\Actions\GetHomeNpfcProductsAction;
use App\Http\Controllers\Controller;
use Illuminate\Support\Collection;
use Illuminate\Support\Facades\Storage;
use Inertia\Inertia;
use Inertia\Response;

class HomePageController extends Controller
{
    public function __invoke(
        GetHomeNpfcProductsAction $getHomeNpfcProducts,
        GetHomeMesportProductsAction $getHomeMesportProducts,
        GetHomeLatestProductsAction $getHomeLatestProducts,
        GetHomePartnerBrandLogosAction $getHomePartnerBrandLogos,
    ): Response
    {
        $npfcProducts = $getHomeNpfcProducts->handle();
        $mesportProducts = $getHomeMesportProducts->handle();
        $latestProducts = $getHomeLatestProducts->handle();
        $partnerBrands = $getHomePartnerBrandLogos->handle();

        return Inertia::render('Home', [
            'npfcProducts' => $this->toHomeProducts($npfcProducts),
            'mesportProducts' => $this->toHomeProducts($mesportProducts),
            'latestProducts' => $this->toHomeProducts($latestProducts),
            'partnerBrandLogos' => $partnerBrands->map(fn ($brand) => [
                'id' => $brand->id,
                'name' => $brand->name,
                'logoUrl' => $this->resolveImageUrl($brand->image_path),
            ])->filter(fn (array $brand) => $brand['logoUrl'] !== null)->values(),
        ]);
    }

    /**
     * @param Collection<int, \App\Models\Product> $products
     * @return Collection<int, array{id: int, name: string, price: float|null, categorySlug: string|null, categoryName: string|null, imageUrl: string|null, hidePriceOnCard: bool}>
     */
    private function toHomeProducts(Collection $products): Collection
    {
        return $products->map(fn ($product) => [
            'id' => $product->id,
            'name' => $product->name,
            'price' => $product->price !== null ? (float) $product->price : null,
            'categorySlug' => $product->category?->slug,
            'categoryName' => $product->category?->name,
            'imageUrl' => $this->resolveImageUrl($product->thumbnail_path),
            'hidePriceOnCard' => ! $product->show_price_on_card,
        ])->values();
    }

    private function resolveImageUrl(?string $path): ?string
    {
        if ($path === null || $path === '') {
            return null;
        }

        if (str_starts_with($path, 'http://') || str_starts_with($path, 'https://') || str_starts_with($path, '/')) {
            return $path;
        }

        return Storage::disk('public')->url($path);
    }
}
