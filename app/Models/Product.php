<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Database\Eloquent\SoftDeletes;

class Product extends Model
{
    use HasFactory, SoftDeletes;

    /** @var list<string> */
    protected $fillable = [
        'sku',
        'name',
        'slug',
        'brand_tag',
        'short_description',
        'description',
        'brand_id',
        'product_category_id',
        'planner_id',
        'price',
        'show_price_on_card',
        'show_price_on_detail',
        'material',
        'turnaround',
        'thumbnail_path',
        'is_active',
        'is_featured',
        'sort_order',
        'published_at',
        'created_by',
        'updated_by',
    ];

    /**
     * @return array<string, string>
     */
    protected function casts(): array
    {
        return [
            'price' => 'decimal:2',
            'show_price_on_card' => 'boolean',
            'show_price_on_detail' => 'boolean',
            'is_active' => 'boolean',
            'is_featured' => 'boolean',
            'sort_order' => 'integer',
            'published_at' => 'datetime',
        ];
    }

    public function brand(): BelongsTo
    {
        return $this->belongsTo(Brand::class);
    }

    public function category(): BelongsTo
    {
        return $this->belongsTo(ProductCategory::class, 'product_category_id');
    }

    public function planner(): BelongsTo
    {
        return $this->belongsTo(Planner::class);
    }

    public function images(): HasMany
    {
        return $this->hasMany(ProductImage::class)->orderBy('sort_order');
    }
}
