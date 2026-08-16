<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;

class CareerHiringStep extends Model
{
    use HasFactory, SoftDeletes;

    /** @var list<string> */
    protected $fillable = [
        'step_number',
        'title',
        'detail',
        'is_active',
        'sort_order',
    ];

    /**
     * @return array<string, string>
     */
    protected function casts(): array
    {
        return [
            'step_number' => 'integer',
            'is_active' => 'boolean',
            'sort_order' => 'integer',
        ];
    }
}
