<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class ClickEvent extends Model
{
    use HasFactory;

    /** @var list<string> */
    protected $fillable = [
        'event_type',
        'page',
        'page_key',
        'section',
        'category_name',
        'category_slug',
        'product_id',
        'product_name',
        'user_id',
        'session_id',
        'ip_address',
        'user_agent',
        'referrer',
    ];

    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class);
    }

    public function product(): BelongsTo
    {
        return $this->belongsTo(Product::class);
    }
}
