<?php

namespace App\Http\Middleware;

use App\Models\Banner;
use App\Models\Product;
use App\Models\ProductCategory;
use App\Models\Team;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;
use Inertia\Middleware;

class HandleInertiaRequests extends Middleware
{
    /**
     * The root template that's loaded on the first page visit.
     *
     * @see https://inertiajs.com/server-side-setup#root-template
     *
     * @var string
     */
    protected $rootView = 'app';

    /**
     * Determines the current asset version.
     *
     * @see https://inertiajs.com/asset-versioning
     */
    public function version(Request $request): ?string
    {
        return parent::version($request);
    }

    /**
     * Define the props that are shared by default.
     *
     * @see https://inertiajs.com/shared-data
     *
     * @return array<string, mixed>
     */
    public function share(Request $request): array
    {
        $user = $request->user();
        $currentTeam = $this->resolveCurrentTeam($request);

        return [
            ...parent::share($request),
            'name' => config('app.name'),
            'seo' => [
                'siteName' => config('seo.site_name'),
                'baseUrl' => rtrim((string) config('seo.base_url'), '/'),
                'currentUrl' => $request->fullUrl(),
                'defaultTitle' => config('seo.default_title'),
                'defaultDescription' => config('seo.default_description'),
                'defaultImage' => config('seo.default_image'),
                'twitterSite' => config('seo.twitter_site'),
                'locale' => config('seo.locale'),
            ],
            'auth' => [
                'user' => $user,
            ],
            'sidebarOpen' => ! $request->hasCookie('sidebar_state') || $request->cookie('sidebar_state') === 'true',
            'currentTeam' => fn () => $currentTeam ? $user?->toUserTeam($currentTeam) : null,
            'teams' => fn () => $user?->toUserTeams(includeCurrent: true) ?? [],
            'navCatalog' => fn () => $this->navCatalog(),
            'relativeBanners' => fn () => Banner::query()
                ->where('placement', 'relative')
                ->where('is_active', true)
                ->orderBy('id', 'desc')
                ->limit(12)
                ->get(['id', 'desktop_image_path'])
                ->map(fn (Banner $banner) => [
                    'id' => $banner->id,
                    'imageUrl' => $this->resolveImageUrl($banner->desktop_image_path),
                ])
                ->filter(fn (array $banner) => $banner['imageUrl'] !== null)
                ->values(),
        ];
    }

    /**
     * Catalogue data for the public navbar's product mega menu.
     *
     * @return array{
     *     categories: list<array{id: int, name: string, slug: string, productCount: int}>,
     *     featured: list<array{id: int, name: string, category: string|null, imageUrl: string|null}>
     * }
     */
    private function navCatalog(): array
    {
        $categories = [];

        $categoryRecords = ProductCategory::query()
            ->where('is_active', true)
            ->withCount(['products' => fn ($query) => $query->where('is_active', true)])
            ->orderBy('sort_order')
            ->orderBy('name')
            ->get(['id', 'name', 'slug']);

        foreach ($categoryRecords as $category) {
            $categories[] = [
                'id' => (int) $category->id,
                'name' => (string) $category->name,
                'slug' => (string) $category->slug,
                'productCount' => (int) $category->products_count,
            ];
        }

        $featured = [];

        $featuredRecords = Product::query()
            ->with('category:id,name')
            ->where('is_active', true)
            ->where(function ($query) {
                $query->whereNull('published_at')
                    ->orWhere('published_at', '<=', now());
            })
            ->orderBy('sort_order')
            ->orderByDesc('id')
            ->limit(3)
            ->get(['id', 'name', 'product_category_id', 'thumbnail_path']);

        foreach ($featuredRecords as $product) {
            $featured[] = [
                'id' => (int) $product->id,
                'name' => (string) $product->name,
                'category' => $product->category?->name,
                'imageUrl' => $this->resolveImageUrl($product->thumbnail_path),
            ];
        }

        return [
            'categories' => $categories,
            'featured' => $featured,
        ];
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

    private function resolveCurrentTeam(Request $request): ?Team
    {
        $user = $request->user();

        if (! $user) {
            return null;
        }

        $team = $user->currentTeam;

        if ($team && $user->belongsToTeam($team)) {
            return $team;
        }

        $team = $user->personalTeam() ?? $user->fallbackTeam();

        if ($team) {
            $user->switchTeam($team);

            return $team;
        }

        return null;
    }
}
