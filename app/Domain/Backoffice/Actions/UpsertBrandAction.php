<?php

namespace App\Domain\Backoffice\Actions;

use App\Models\Brand;
use Illuminate\Http\UploadedFile;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Str;

class UpsertBrandAction
{
    /**
     * @param array<string, mixed> $data
     */
    public function handle(array $data, int $actorId, ?Brand $brand = null): Brand
    {
        $brand ??= new Brand();

        $brandName = trim((string) ($data['name'] ?? ''));
        $resolvedSlug = Str::slug($brandName);

        if ($resolvedSlug === '') {
            $resolvedSlug = 'brand';
        }

        $baseSlug = $resolvedSlug;
        $suffix = 2;

        while (Brand::query()
            ->where('slug', $resolvedSlug)
            ->when($brand->exists, fn ($query) => $query->whereKeyNot($brand->id))
            ->withTrashed()
            ->exists()) {
            $resolvedSlug = "{$baseSlug}-{$suffix}";
            $suffix++;
        }

        $existingPath = $brand->image_path;
        $imagePath = $existingPath;

        if (array_key_exists('image', $data) && $data['image'] instanceof UploadedFile) {
            $imagePath = $data['image']->store('brands/logos', 'public');

            if ($existingPath !== null && $existingPath !== '' && ! str_starts_with($existingPath, '/')) {
                Storage::disk('public')->delete($existingPath);
            }
        }

        $brand->fill([
            'name' => $brandName,
            'slug' => $resolvedSlug,
            'image_path' => $imagePath,
            'description' => null,
            'sort_order' => 0,
        ]);

        $brand->updated_by = $actorId;

        if (! $brand->exists) {
            $brand->created_by = $actorId;
            $brand->is_active = true;
        }

        $brand->save();

        return $brand->refresh();
    }
}
