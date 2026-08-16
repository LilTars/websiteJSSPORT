<?php

namespace App\Domain\Backoffice\Actions;

use App\Models\Brand;
use Illuminate\Support\Facades\Storage;

class DeleteBrandAction
{
    public function handle(Brand $brand): ?string
    {
        if ($brand->categories()->exists()) {
            return 'has_categories';
        }

        if ($brand->products()->exists()) {
            return 'has_products';
        }

        $imagePath = $brand->image_path;

        $brand->delete();

        if ($imagePath !== null && $imagePath !== '' && ! str_starts_with($imagePath, '/')) {
            Storage::disk('public')->delete($imagePath);
        }

        return null;
    }
}
