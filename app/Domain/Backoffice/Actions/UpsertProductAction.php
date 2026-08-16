<?php

namespace App\Domain\Backoffice\Actions;

use App\Models\Product;
use Illuminate\Http\UploadedFile;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Str;

class UpsertProductAction
{
    /**
     * @param array<string, mixed> $data
     */
    public function handle(array $data, int $actorId, ?Product $product = null): Product
    {
        return DB::transaction(function () use ($data, $actorId, $product) {
            $product ??= new Product();

            $productName = trim((string) ($data['name'] ?? ''));
            $resolvedSlug = Str::slug($productName);

            if ($resolvedSlug === '') {
                $resolvedSlug = 'product';
            }

            $baseSlug = $resolvedSlug;
            $suffix = 2;

            while (Product::query()
                ->where('slug', $resolvedSlug)
                ->when($product->exists, fn ($query) => $query->whereKeyNot($product->id))
                ->withTrashed()
                ->exists()) {
                $resolvedSlug = "{$baseSlug}-{$suffix}";
                $suffix++;
            }

            /** @var list<UploadedFile> $uploadedImages */
            $uploadedImages = [];

            if (array_key_exists('images', $data) && is_array($data['images'])) {
                foreach ($data['images'] as $imageFile) {
                    if ($imageFile instanceof UploadedFile) {
                        $uploadedImages[] = $imageFile;
                    }
                }
            }

            $existingThumbnailPath = $product->thumbnail_path;
            $thumbnailPath = $existingThumbnailPath;
            $storedImagePaths = [];

            if ($uploadedImages !== []) {
                foreach ($uploadedImages as $uploadedImage) {
                    $storedImagePaths[] = $uploadedImage->store('products/images', 'public');
                }
            }

            $retainedImageIds = [];

            if (array_key_exists('retained_image_ids', $data) && is_array($data['retained_image_ids'])) {
                foreach ($data['retained_image_ids'] as $retainedImageId) {
                    $retainedImageIds[] = (int) $retainedImageId;
                }
            }

            $isEditingWithImageChanges = $product->exists && (array_key_exists('retained_image_ids', $data) || $storedImagePaths !== []);
            $finalImagePaths = [];

            if ($isEditingWithImageChanges) {
                $existingImages = $product->images()->get(['id', 'image_path']);

                foreach ($existingImages as $existingImage) {
                    if (in_array($existingImage->id, $retainedImageIds, true) && $existingImage->image_path !== null && $existingImage->image_path !== '') {
                        $finalImagePaths[] = $existingImage->image_path;
                    } elseif ($existingImage->image_path !== null && $existingImage->image_path !== '' && ! str_starts_with($existingImage->image_path, '/')) {
                        Storage::disk('public')->delete($existingImage->image_path);
                    }
                }
            }

            $finalImagePaths = [...$finalImagePaths, ...$storedImagePaths];

            if ($storedImagePaths !== [] && $existingThumbnailPath !== null && $existingThumbnailPath !== '' && ! str_starts_with($existingThumbnailPath, '/')) {
                Storage::disk('public')->delete($existingThumbnailPath);
            }

            if ($isEditingWithImageChanges || $storedImagePaths !== []) {
                $thumbnailPath = $finalImagePaths[0] ?? null;
            }

            $product->fill([
                'name' => $productName,
                'slug' => $resolvedSlug,
                'description' => $data['description'] ?? null,
                'brand_id' => $data['brand_id'] ?? null,
                'product_category_id' => $data['product_category_id'],
                'price' => $data['price'] ?? null,
                'thumbnail_path' => $thumbnailPath,
                'is_active' => array_key_exists('is_active', $data)
                    ? (bool) $data['is_active']
                    : ($product->exists ? (bool) $product->is_active : true),
                'show_price_on_card' => true,
                'show_price_on_detail' => true,
                'sort_order' => 0,
            ]);
            $product->updated_by = $actorId;

            if (! $product->exists) {
                $product->created_by = $actorId;
            }

            $product->save();

            if ($isEditingWithImageChanges || $storedImagePaths !== []) {
                $product->images()->delete();

                foreach ($finalImagePaths as $index => $imagePath) {
                    $product->images()->create([
                        'image_path' => $imagePath,
                        'alt_text' => null,
                        'sort_order' => $index,
                        'is_primary' => $index === 0,
                    ]);
                }
            }

            return $product->refresh()->load('images');
        });
    }
}
