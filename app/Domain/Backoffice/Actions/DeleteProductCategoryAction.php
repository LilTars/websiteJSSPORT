<?php

namespace App\Domain\Backoffice\Actions;

use App\Models\ProductCategory;

class DeleteProductCategoryAction
{
    public function handle(ProductCategory $category): ?string
    {
        if ($category->children()->exists()) {
            return 'has_children';
        }

        if ($category->products()->exists()) {
            return 'has_products';
        }

        $category->delete();

        return null;
    }
}
