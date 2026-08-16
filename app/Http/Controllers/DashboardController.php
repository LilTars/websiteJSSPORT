<?php

namespace App\Http\Controllers;

use App\Domain\Analytics\Actions\BuildClickAnalyticsAction;
use App\Models\TeamInvitation;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Inertia\Inertia;
use Inertia\Response;

class DashboardController extends Controller
{
    public function __invoke(Request $request, BuildClickAnalyticsAction $buildClickAnalytics): Response
    {
        $email = strtolower($request->user()->email);

        $pendingInvitations = TeamInvitation::query()
            ->with(['inviter', 'team'])
            ->whereRaw('LOWER(email) = ?', [$email])
            ->whereNull('accepted_at')
            ->where(fn ($query) => $query
                ->whereNull('expires_at')
                ->orWhere('expires_at', '>=', now()))
            ->latest()
            ->get()
            ->map(fn (TeamInvitation $invitation) => [
                'code' => $invitation->code,
                'inviterName' => $invitation->inviter->name,
                'team' => [
                    'name' => $invitation->team->name,
                    'slug' => $invitation->team->slug,
                ],
            ]);

        $clickAnalytics = $buildClickAnalytics->handle();

        return Inertia::render('dashboard', [
            'pendingInvitations' => $pendingInvitations,
            'websiteVisits' => $this->buildWebsiteVisitAnalytics(),
            'pageVisitors' => $clickAnalytics['pageVisitors'],
            'homePageClicks' => $clickAnalytics['pageVisitors'],
            'productCategoryClicks' => $clickAnalytics['productCategoryClicks'],
            'topViewedProducts' => $clickAnalytics['topViewedProducts'],
        ]);
    }

    /**
     * @return array{hasData: bool, total: int, series: array<int, array{label: string, value: int}>, emptyMessage: string}
     */
    private function buildWebsiteVisitAnalytics(): array
    {
        $days = 30;
        $start = now()->subDays($days - 1)->startOfDay();
        $driver = DB::getDriverName();

        $dateExpression = match ($driver) {
            'sqlite' => "strftime('%Y-%m-%d', datetime(last_activity, 'unixepoch'))",
            'mysql' => 'DATE(FROM_UNIXTIME(last_activity))',
            default => 'DATE(FROM_UNIXTIME(last_activity))',
        };

        $counts = DB::table('sessions')
            ->selectRaw("{$dateExpression} as day, COUNT(*) as total")
            ->where('last_activity', '>=', $start->getTimestamp())
            ->groupByRaw($dateExpression)
            ->get()
            ->mapWithKeys(fn ($row) => [$row->day => (int) $row->total]);

        $series = [];
        $total = 0;

        for ($offset = 0; $offset < $days; $offset++) {
            $date = $start->copy()->addDays($offset);
            $day = $date->toDateString();
            $value = (int) ($counts[$day] ?? 0);
            $total += $value;

            $series[] = [
                'label' => $date->format('d'),
                'value' => $value,
            ];
        }

        return [
            'hasData' => $total > 0,
            'total' => $total,
            'series' => $series,
            'emptyMessage' => 'ไม่มีข้อมูลผู้เข้าใช้งานเว็บไซต์จริงในช่วง 30 วันล่าสุด',
        ];
    }
}
