<?php

namespace App\Domain\Backoffice\Actions;

use App\Models\ProductCategory;
use Illuminate\Support\Str;

class UpsertProductCategoryAction
{
    /**
     * @param array<string, mixed> $data
     */
    public function handle(array $data, int $actorId, ?ProductCategory $category = null): ProductCategory
    {
        $category ??= new ProductCategory();

        $categoryName = trim((string) ($data['name'] ?? ''));
        $resolvedSlug = Str::slug($categoryName);

        if ($resolvedSlug === '') {
            $resolvedSlug = 'category';
        }

        $baseSlug = $resolvedSlug;
        $suffix = 2;

        while (ProductCategory::query()
            ->where('slug', $resolvedSlug)
            ->when($category->exists, fn ($query) => $query->whereKeyNot($category->id))
            ->withTrashed()
            ->exists()) {
            $resolvedSlug = "{$baseSlug}-{$suffix}";
            $suffix++;
        }

        $category->fill([
            'name' => $categoryName,
            'slug' => $resolvedSlug,
            'brand_id' => null,
            'parent_id' => null,
            'description' => null,
        ]);
        $category->updated_by = $actorId;

        if (! $category->exists) {
            $category->created_by = $actorId;
        }

        $category->save();

        return $category->refresh();
    }
}
