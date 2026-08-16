<?php

namespace App\Http\Middleware;

use App\Models\Banner;
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
