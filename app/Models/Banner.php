<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;

class Banner extends Model
{
    use HasFactory, SoftDeletes;

    /** @var list<string> */
    protected $fillable = [
        'placement',
        'title',
        'subtitle',
        'description',
        'cta_label',
        'cta_url',
        'desktop_image_path',
        'mobile_image_path',
        'is_active',
        'sort_order',
        'starts_at',
        'ends_at',
        'created_by',
        'updated_by',
    ];

    /**
     * @return array<string, string>
     */
    protected function casts(): array
    {
        return [
            'is_active' => 'boolean',
            'sort_order' => 'integer',
            'starts_at' => 'datetime',
            'ends_at' => 'datetime',
        ];
    }
}
