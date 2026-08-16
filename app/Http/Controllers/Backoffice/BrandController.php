<?php

namespace App\Http\Controllers\Backoffice;

use App\Domain\Backoffice\Actions\DeleteBrandAction;
use App\Domain\Backoffice\Actions\UpsertBrandAction;
use App\Http\Controllers\Controller;
use App\Http\Requests\Backoffice\BrandUpsertRequest;
use App\Models\Brand;
use Illuminate\Http\RedirectResponse;
use Illuminate\Support\Facades\Storage;
use Inertia\Inertia;
use Inertia\Response;

class BrandController extends Controller
{
    public function index(): Response
    {
        $brands = Brand::query()
            ->orderByDesc('id')
            ->paginate(20)
            ->withQueryString();

        return Inertia::render('backoffice/brands/index', [
            'items' => $brands->through(fn (Brand $brand) => [
                'id' => $brand->id,
                'name' => $brand->name,
                'image_path' => $brand->image_path,
                'image_url' => $this->resolveImageUrl($brand->image_path),
                'is_active' => $brand->is_active,
                'created_at' => $brand->created_at?->toDateString(),
            ]),
        ]);
    }

    public function store(BrandUpsertRequest $request, UpsertBrandAction $upsertBrand): RedirectResponse
    {
        $upsertBrand->handle($request->validated(), $request->user()->id);

        Inertia::flash('toast', ['type' => 'success', 'message' => 'สร้างแบร์นสินค้าเรียบร้อยแล้ว']);

        return back();
    }

    public function update(BrandUpsertRequest $request, string $current_team, string $brand, UpsertBrandAction $upsertBrand): RedirectResponse
    {
        $brandModel = Brand::query()->findOrFail((int) $brand);

        $upsertBrand->handle($request->validated(), $request->user()->id, $brandModel);

        Inertia::flash('toast', ['type' => 'success', 'message' => 'อัปเดตแบร์นสินค้าเรียบร้อยแล้ว']);

        return back();
    }

    public function toggleActive(string $current_team, string $brand): RedirectResponse
    {
        $brandModel = Brand::query()->findOrFail((int) $brand);
        $brandModel->is_active = ! $brandModel->is_active;
        $brandModel->save();

        Inertia::flash('toast', [
            'type' => 'success',
            'message' => $brandModel->is_active ? 'เปิดใช้งานแบร์นสินค้าเรียบร้อยแล้ว' : 'ปิดใช้งานแบร์นสินค้าเรียบร้อยแล้ว',
        ]);

        return back();
    }

    public function destroy(string $current_team, string $brand, DeleteBrandAction $deleteBrand): RedirectResponse
    {
        $brandModel = Brand::query()->findOrFail((int) $brand);
        $failureReason = $deleteBrand->handle($brandModel);

        if ($failureReason === 'has_categories') {
            Inertia::flash('toast', ['type' => 'error', 'message' => 'ไม่สามารถลบแบร์นได้ เนื่องจากยังมีประเภทสินค้าอ้างอิง']);

            return back();
        }

        if ($failureReason === 'has_products') {
            Inertia::flash('toast', ['type' => 'error', 'message' => 'ไม่สามารถลบแบร์นได้ เนื่องจากยังมีสินค้าอ้างอิง']);

            return back();
        }

        Inertia::flash('toast', ['type' => 'success', 'message' => 'ลบแบร์นสินค้าเรียบร้อยแล้ว']);

        return back();
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
