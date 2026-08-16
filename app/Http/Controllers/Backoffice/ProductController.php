<?php

namespace App\Http\Controllers\Backoffice;

use App\Domain\Backoffice\Actions\UpsertProductAction;
use App\Http\Controllers\Controller;
use App\Http\Requests\Backoffice\ProductUpsertRequest;
use App\Models\Brand;
use App\Models\Product;
use App\Models\ProductCategory;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;
use Inertia\Inertia;
use Inertia\Response;

class ProductController extends Controller
{
    public function index(Request $request): Response
    {
        $search = $request->string('search')->toString();
        $categoryId = $request->integer('category_id');
        $sortBy = $request->string('sort_by')->toString();
        $sortDir = $request->string('sort_dir')->toString() === 'asc' ? 'asc' : 'desc';
        $allowedSorts = ['name', 'price', 'sort_order', 'published_at', 'id'];
        $effectiveSort = in_array($sortBy, $allowedSorts, true) ? $sortBy : 'id';

        $products = Product::query()
            ->with(['category:id,name,slug', 'brand:id,name,slug', 'images:id,product_id,image_path,sort_order,is_primary'])
            ->when($search !== '', fn ($query) => $query
                ->where('name', 'like', "%{$search}%")
                ->orWhere('slug', 'like', "%{$search}%")
                ->orWhere('sku', 'like', "%{$search}%"))
            ->when($categoryId > 0, fn ($query) => $query->where('product_category_id', $categoryId))
            ->orderBy($effectiveSort, $sortDir)
            ->paginate(15)
            ->withQueryString();

        $categories = ProductCategory::query()->orderBy('name')->get(['id', 'name']);
        $brands = Brand::query()->orderBy('name')->get(['id', 'name']);

        return Inertia::render('backoffice/products/index', [
            'filters' => [
                'search' => $search,
                'category_id' => $categoryId,
                'sort_by' => $effectiveSort,
                'sort_dir' => $sortDir,
            ],
            'categories' => $categories,
            'brands' => $brands,
            'items' => $products->through(fn (Product $product) => [
                'id' => $product->id,
                'name' => $product->name,
                'brand_id' => $product->brand_id,
                'product_category_id' => $product->product_category_id,
                'description' => $product->description,
                'brand' => $product->brand?->name,
                'category' => $product->category?->name,
                'price' => $product->price,
                'thumbnail_path' => $product->thumbnail_path,
                'image_url' => $this->resolveImageUrl($product->thumbnail_path),
                'image_urls' => $product->images
                    ->sortBy('sort_order')
                    ->map(fn ($image) => $this->resolveImageUrl($image->image_path))
                    ->filter()
                    ->values()
                    ->all(),
                'images' => $product->images
                    ->sortBy('sort_order')
                    ->map(fn ($image) => [
                        'id' => $image->id,
                        'url' => $this->resolveImageUrl($image->image_path),
                    ])
                    ->filter(fn ($image) => $image['url'] !== null)
                    ->values()
                    ->all(),
                'is_active' => $product->is_active,
                'created_at' => $product->created_at?->toDateString(),
            ]),
        ]);
    }

    public function store(ProductUpsertRequest $request, UpsertProductAction $upsertProduct): RedirectResponse
    {
        $upsertProduct->handle($request->validated(), $request->user()->id);

        Inertia::flash('toast', ['type' => 'success', 'message' => 'สร้างสินค้าเรียบร้อยแล้ว']);

        return back();
    }

    public function update(ProductUpsertRequest $request, string $current_team, string $product, UpsertProductAction $upsertProduct): RedirectResponse
    {
        $productModel = Product::query()->findOrFail((int) $product);

        $upsertProduct->handle($request->validated(), $request->user()->id, $productModel);

        Inertia::flash('toast', ['type' => 'success', 'message' => 'อัปเดตสินค้าเรียบร้อยแล้ว']);

        return back();
    }

    public function destroy(string $current_team, string $product): RedirectResponse
    {
        $productModel = Product::query()->findOrFail((int) $product);

        $productModel->load('images:id,product_id,image_path');

        foreach ($productModel->images as $image) {
            if ($image->image_path !== null && $image->image_path !== '' && ! str_starts_with($image->image_path, '/')) {
                Storage::disk('public')->delete($image->image_path);
            }
        }

        if ($productModel->thumbnail_path !== null && $productModel->thumbnail_path !== '' && ! str_starts_with($productModel->thumbnail_path, '/')) {
            Storage::disk('public')->delete($productModel->thumbnail_path);
        }

        $productModel->delete();

        Inertia::flash('toast', ['type' => 'success', 'message' => 'ลบสินค้าเรียบร้อยแล้ว']);

        return back();
    }

    public function toggleActive(string $current_team, string $product): RedirectResponse
    {
        $productModel = Product::query()->findOrFail((int) $product);
        $productModel->is_active = ! $productModel->is_active;
        $productModel->save();

        Inertia::flash('toast', [
            'type' => 'success',
            'message' => $productModel->is_active ? 'เปิดใช้งานสินค้าเรียบร้อยแล้ว' : 'ปิดใช้งานสินค้าเรียบร้อยแล้ว',
        ]);

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
