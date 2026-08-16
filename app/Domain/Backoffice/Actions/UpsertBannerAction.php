<?php

namespace App\Domain\Backoffice\Actions;

use App\Models\Banner;
use Illuminate\Http\UploadedFile;
use Illuminate\Support\Facades\Storage;

class UpsertBannerAction
{
    /**
     * @param array<string, mixed> $data
     */
    public function handle(array $data, int $actorId, ?Banner $banner = null): Banner
    {
        $banner ??= new Banner();

        $existingPath = $banner->desktop_image_path;
        $imagePath = $existingPath;

        if (array_key_exists('image', $data) && $data['image'] instanceof UploadedFile) {
            $imagePath = $data['image']->store('banners/relative', 'public');

            if ($existingPath !== null && $existingPath !== '' && ! str_starts_with($existingPath, '/')) {
                Storage::disk('public')->delete($existingPath);
            }
        }

        $payload = [
            'placement' => 'relative',
            'title' => 'Relative Banner',
            'subtitle' => null,
            'description' => null,
            'cta_label' => null,
            'cta_url' => null,
            'desktop_image_path' => $imagePath,
            'mobile_image_path' => $imagePath,
            'is_active' => array_key_exists('is_active', $data)
                ? (bool) $data['is_active']
                : ($banner->exists ? (bool) $banner->is_active : true),
            'sort_order' => 0,
            'starts_at' => null,
            'ends_at' => null,
        ];

        $banner->fill($payload);
        $banner->updated_by = $actorId;

        if (! $banner->exists) {
            $banner->created_by = $actorId;
        }

        $banner->save();

        return $banner->refresh();
    }
}
