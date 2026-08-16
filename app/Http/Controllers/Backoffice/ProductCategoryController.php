<?php

namespace App\Http\Controllers\Backoffice;

use App\Domain\Backoffice\Actions\DeleteProductCategoryAction;
use App\Domain\Backoffice\Actions\UpsertProductCategoryAction;
use App\Http\Controllers\Controller;
use App\Http\Requests\Backoffice\ProductCategoryUpsertRequest;
use App\Models\ProductCategory;
use Illuminate\Http\RedirectResponse;
use Inertia\Inertia;
use Inertia\Response;

class ProductCategoryController extends Controller
{
    public function index(): Response
    {
        $categories = ProductCategory::query()
            ->orderByDesc('id')
            ->paginate(20)
            ->withQueryString();

        return Inertia::render('backoffice/product-categories/index', [
            'items' => $categories->through(fn (ProductCategory $category) => [
                'id' => $category->id,
                'name' => $category->name,
                'is_active' => $category->is_active,
                'created_at' => $category->created_at?->toDateString(),
            ]),
        ]);
    }

    public function toggleActive(string $current_team, string $category): RedirectResponse
    {
        $categoryModel = ProductCategory::query()->findOrFail((int) $category);
        $categoryModel->is_active = ! $categoryModel->is_active;
        $categoryModel->save();

        Inertia::flash('toast', [
            'type' => 'success',
            'message' => $categoryModel->is_active ? 'เปิดใช้งานประเภทสินค้าเรียบร้อยแล้ว' : 'ปิดใช้งานประเภทสินค้าเรียบร้อยแล้ว',
        ]);

        return back();
    }

    public function store(ProductCategoryUpsertRequest $request, UpsertProductCategoryAction $upsertCategory): RedirectResponse
    {
        $upsertCategory->handle($request->validated(), $request->user()->id);

        Inertia::flash('toast', ['type' => 'success', 'message' => 'สร้างประเภทสินค้าเรียบร้อยแล้ว']);

        return back();
    }

    public function update(ProductCategoryUpsertRequest $request, string $current_team, string $category, UpsertProductCategoryAction $upsertCategory): RedirectResponse
    {
        $categoryModel = ProductCategory::query()->findOrFail((int) $category);

        $upsertCategory->handle($request->validated(), $request->user()->id, $categoryModel);

        Inertia::flash('toast', ['type' => 'success', 'message' => 'อัปเดตประเภทสินค้าเรียบร้อยแล้ว']);

        return back();
    }

    public function destroy(string $current_team, string $category, DeleteProductCategoryAction $deleteCategory): RedirectResponse
    {
        $categoryModel = ProductCategory::query()->findOrFail((int) $category);
        $failureReason = $deleteCategory->handle($categoryModel);

        if ($failureReason === 'has_children') {
            Inertia::flash('toast', ['type' => 'error', 'message' => 'ไม่สามารถลบหมวดได้ เนื่องจากยังมีหมวดย่อยอยู่']);

            return back();
        }

        if ($failureReason === 'has_products') {
            Inertia::flash('toast', ['type' => 'error', 'message' => 'ไม่สามารถลบหมวดได้ เนื่องจากยังมีสินค้าอยู่ในหมวด']);

            return back();
        }

        Inertia::flash('toast', ['type' => 'success', 'message' => 'ลบประเภทสินค้าเรียบร้อยแล้ว']);

        return back();
    }
}
