<?php

namespace App\Http\Controllers\Analytics;

use App\Http\Controllers\Controller;
use App\Models\ClickEvent;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Schema;

class ClickTrackingController extends Controller
{
    public function store(Request $request): JsonResponse
    {
        if (! Schema::hasTable('click_events')) {
            return response()->json([
                'ok' => false,
                'skipped' => true,
                'message' => 'Tracking table is not available yet.',
            ], 204);
        }

        $payload = $request->validate([
            'event_type' => ['required', 'string', 'in:page_view,homepage_section_click,product_category_click,product_click'],
            'page' => ['required', 'string', 'max:80'],
            'page_key' => ['nullable', 'string', 'max:80'],
            'section' => ['nullable', 'string', 'max:120'],
            'category_name' => ['nullable', 'string', 'max:120'],
            'category_slug' => ['nullable', 'string', 'max:120'],
            'product_id' => ['nullable', 'integer', 'min:1'],
            'product_name' => ['nullable', 'string', 'max:200'],
            'referrer' => ['nullable', 'string', 'max:255'],
        ]);

        $clickEvent = ClickEvent::create([
            'event_type' => $payload['event_type'],
            'page' => $payload['page'],
            'page_key' => $payload['page_key'] ?? $payload['page'],
            'section' => $payload['section'] ?? null,
            'category_name' => $payload['category_name'] ?? null,
            'category_slug' => $payload['category_slug'] ?? null,
            'product_id' => $payload['product_id'] ?? null,
            'product_name' => $payload['product_name'] ?? null,
            'user_id' => $request->user()?->id,
            'session_id' => $request->session()->getId(),
            'ip_address' => $request->ip(),
            'user_agent' => $request->header('User-Agent'),
            'referrer' => $payload['referrer'] ?? $request->header('Referer'),
        ]);

        return response()->json([
            'ok' => true,
            'id' => $clickEvent->id,
        ], 201);
    }
}
