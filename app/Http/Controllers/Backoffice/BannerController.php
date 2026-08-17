<?php

namespace App\Http\Controllers\Backoffice;

use App\Domain\Backoffice\Actions\UpsertBannerAction;
use App\Http\Controllers\Controller;
use App\Http\Requests\Backoffice\BannerUpsertRequest;
use App\Models\Banner;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;
use Inertia\Inertia;
use Inertia\Response;

class BannerController extends Controller
{
    public function index(): Response
    {
        $banners = Banner::query()
            ->where('placement', 'relative')
            ->orderBy('id', 'desc')
            ->paginate(15)
            ->withQueryString();

        return Inertia::render('backoffice/banners/index', [
            'items' => $banners->through(fn (Banner $banner) => [
                'id' => $banner->id,
                'desktop_image_path' => $banner->desktop_image_path,
                'image_url' => $this->resolveImageUrl($banner->desktop_image_path),
                'is_active' => $banner->is_active,
                'created_at' => $banner->created_at?->toDateString(),
            ]),
        ]);
    }

    public function store(BannerUpsertRequest $request, UpsertBannerAction $upsertBanner): RedirectResponse
    {
        $upsertBanner->handle($request->validated(), $request->user()->id);

        Inertia::flash('toast', ['type' => 'success', 'message' => 'สร้างแบนเนอร์เรียบร้อยแล้ว']);

        return back();
    }

    public function update(BannerUpsertRequest $request, Banner $banner, UpsertBannerAction $upsertBanner): RedirectResponse
    {
        $upsertBanner->handle($request->validated(), $request->user()->id, $banner);

        Inertia::flash('toast', ['type' => 'success', 'message' => 'อัปเดตแบนเนอร์เรียบร้อยแล้ว']);

        return back();
    }

    public function destroy(string $current_team, string $banner): RedirectResponse
    {
        $bannerModel = Banner::query()->findOrFail((int) $banner);

        if ($bannerModel->desktop_image_path !== null && $bannerModel->desktop_image_path !== '' && ! str_starts_with($bannerModel->desktop_image_path, '/')) {
            Storage::disk('public')->delete($bannerModel->desktop_image_path);
        }

        $bannerModel->delete();

        Inertia::flash('toast', ['type' => 'success', 'message' => 'ลบแบนเนอร์เรียบร้อยแล้ว']);

        return back();
    }

    public function toggleActive(Request $request, string $current_team, string $banner): RedirectResponse
    {
        $bannerModel = Banner::query()->findOrFail((int) $banner);

        $bannerModel->is_active = ! $bannerModel->is_active;
        $bannerModel->updated_by = $request->user()->id;
        $bannerModel->save();

        Inertia::flash('toast', ['type' => 'success', 'message' => 'อัปเดตสถานะแบนเนอร์เรียบร้อยแล้ว']);

        return back();
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
