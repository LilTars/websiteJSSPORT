<?php

namespace App\Domain\Analytics\Actions;

use Illuminate\Support\Collection;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Schema;

class BuildClickAnalyticsAction
{
    /**
     * @return array{
     *     pageVisitors: array{hasData: bool, total: int, series: array<int, array{label: string, value: int}>, emptyMessage: string},
     *     productCategoryClicks: array{hasData: bool, total: int, series: array<int, array{label: string, value: int}>, emptyMessage: string},
     *     topViewedProducts: array{hasData: bool, total: int, series: array<int, array{label: string, value: int}>, emptyMessage: string},
     * }
     */
    public function handle(): array
    {
        if (! Schema::hasTable('click_events')) {
            return [
                'pageVisitors' => $this->emptyMetric('ไม่มีข้อมูลผู้ใช้งานจริงแยกตามหน้าในช่วง 30 วันล่าสุด'),
                'productCategoryClicks' => $this->emptyMetric('ไม่มีข้อมูล click ตามประเภทสินค้าจริงในระบบปัจจุบัน'),
                'topViewedProducts' => $this->emptyMetric('ไม่มีข้อมูลการคลิกเข้าดูสินค้าอย่างเป็นทางการในระบบปัจจุบัน'),
            ];
        }

        return [
            'pageVisitors' => $this->buildPageVisitorsMetric(),
            'productCategoryClicks' => $this->buildByLabelMetric(
                'product_category_click',
                'products',
                'category_name',
                'ไม่มีข้อมูล click ตามประเภทสินค้าจริงในระบบปัจจุบัน',
            ),
            'topViewedProducts' => $this->buildTopProductsMetric(),
        ];
    }

    /**
     * @return array{hasData: bool, total: int, series: array<int, array{label: string, value: int}>, emptyMessage: string}
     */
    private function emptyMetric(string $emptyMessage): array
    {
        return [
            'hasData' => false,
            'total' => 0,
            'series' => [],
            'emptyMessage' => $emptyMessage,
        ];
    }

    /**
     * @return array{hasData: bool, total: int, series: array<int, array{label: string, value: int}>, emptyMessage: string}
     */
    private function buildPageVisitorsMetric(): array
    {
        $pageOrder = ['home', 'products', 'about', 'careers', 'contact'];
        $pageLabelMap = [
            'home' => 'Home',
            'products' => 'หน้าสินค้า',
            'about' => 'เกี่ยวกับเรา',
            'careers' => 'ร่วมงานกับเรา',
            'contact' => 'ติดต่อเรา',
        ];

        $rows = DB::table('click_events')
            ->where('event_type', 'page_view')
            ->where('created_at', '>=', now()->subDays(30)->startOfDay())
            ->select('page_key', 'user_id', 'session_id')
            ->get();

        $pageVisitors = [];

        foreach ($rows as $row) {
            $pageKey = (string) ($row->page_key ?? 'unknown');

            if ($pageKey === '' || $pageKey === 'unknown') {
                continue;
            }

            $pageVisitors[$pageKey] ??= [
                'userKeys' => [],
                'sessionKeys' => [],
                'sessionsWithUser' => [],
            ];

            $sessionId = $row->session_id !== null ? (string) $row->session_id : null;

            if ($row->user_id !== null) {
                $pageVisitors[$pageKey]['userKeys']['user:'.$row->user_id] = true;

                if ($sessionId !== null) {
                    $pageVisitors[$pageKey]['sessionsWithUser'][$sessionId] = true;
                }

                continue;
            }

            if ($sessionId === null) {
                continue;
            }

            if (isset($pageVisitors[$pageKey]['sessionsWithUser'][$sessionId])) {
                continue;
            }

            if (! isset($pageVisitors[$pageKey]['sessionKeys']['session:'.$sessionId])) {
                $pageVisitors[$pageKey]['sessionKeys']['session:'.$sessionId] = true;
            }
        }

        $counts = [];
        foreach ($pageOrder as $pageKey) {
            $counts[$pageKey] = count($pageVisitors[$pageKey]['userKeys'] ?? []) + count($pageVisitors[$pageKey]['sessionKeys'] ?? []);
        }

        $series = [];
        $total = 0;

        foreach ($pageOrder as $pageKey) {
            $value = (int) ($counts[$pageKey] ?? 0);
            $total += $value;
            $series[] = [
                'label' => $pageLabelMap[$pageKey] ?? ucfirst((string) $pageKey),
                'value' => $value,
            ];
        }

        return [
            'hasData' => $total > 0,
            'total' => $total,
            'series' => $series,
            'emptyMessage' => 'ไม่มีข้อมูลผู้ใช้งานจริงแยกตามหน้าในช่วง 30 วันล่าสุด',
        ];
    }

    /**
     * @return array{hasData: bool, total: int, series: array<int, array{label: string, value: int}>, emptyMessage: string}
     */
    private function buildByLabelMetric(string $eventType, string $page, string $labelColumn, string $emptyMessage): array
    {
        $rows = DB::table('click_events')
            ->where('event_type', $eventType)
            ->where('page', $page)
            ->selectRaw("COALESCE({$labelColumn}, 'unknown') as label, COUNT(*) as total")
            ->groupBy($labelColumn)
            ->orderByDesc('total')
            ->orderBy('label')
            ->get();

        $series = $rows->map(fn ($row) => [
            'label' => (string) $row->label,
            'value' => (int) $row->total,
        ])->all();

        $total = array_sum(array_map(fn (array $row) => $row['value'], $series));

        return [
            'hasData' => $total > 0,
            'total' => $total,
            'series' => $series,
            'emptyMessage' => $emptyMessage,
        ];
    }

    /**
     * @return array{hasData: bool, total: int, series: array<int, array{label: string, value: int}>, emptyMessage: string}
     */
    private function buildTopProductsMetric(): array
    {
        $rows = DB::table('click_events')
            ->where('event_type', 'product_click')
            ->whereNotNull('product_id')
            ->selectRaw('COALESCE(product_name, CONCAT("Product #", product_id)) as label, COUNT(*) as total')
            ->groupBy('product_id', 'product_name')
            ->orderByDesc('total')
            ->orderBy('label')
            ->limit(10)
            ->get();

        /** @var Collection<int, array{label: string, value: int}> $series */
        $series = $rows->map(fn ($row) => [
            'label' => (string) $row->label,
            'value' => (int) $row->total,
        ]);

        $total = $series->sum('value');

        return [
            'hasData' => $total > 0,
            'total' => $total,
            'series' => $series->all(),
            'emptyMessage' => 'ไม่มีข้อมูลการคลิกเข้าดูสินค้าอย่างเป็นทางการในระบบปัจจุบัน',
        ];
    }
}
