import { Head, usePage } from '@inertiajs/react';
import { useMemo, useState } from 'react';
import PendingInvitationsModal from '@/components/pending-invitations-modal';
import { dashboard } from '@/routes';
import type { DashboardInvitation } from '@/types';

type ChartPoint = {
    label: string;
    value: number;
};

type ChartData = {
    hasData: boolean;
    total: number | null;
    series: ChartPoint[];
    emptyMessage?: string;
};

type Props = {
    pendingInvitations?: DashboardInvitation[];
    websiteVisits?: ChartData;
    pageVisitors?: ChartData;
    homePageClicks?: ChartData;
    productCategoryClicks?: ChartData;
    topViewedProducts?: ChartData;
};

const chartPalette = ['#22c55e', '#38bdf8', '#f97316', '#a78bfa', '#f59e0b', '#fb7185', '#10b981'];

function formatNumber(value: number): string {
    return new Intl.NumberFormat('en-US').format(value);
}

function getMaxValue(data: ChartPoint[]) {
    return Math.max(1, ...data.map((point) => Number(point.value) || 0));
}

function EmptyChartState({ message }: { message: string }) {
    return (
        <div className="mt-5 flex min-h-40 items-center justify-center rounded-2xl border border-dashed border-slate-300 bg-slate-50 px-4 text-center text-sm text-slate-500">
            {message}
        </div>
    );
}

function MetricBarChart({
    data,
    color,
}: {
    data: ChartPoint[];
    color: string;
}) {
    if (data.length === 0) {
        return null;
    }

    const maxValue = getMaxValue(data);

    return (
        <div className="mt-5 flex h-40 items-end gap-2 overflow-hidden rounded-2xl bg-slate-50 p-3">
            {data.map((point) => {
                const height = `${Math.max((Number(point.value) / maxValue) * 100, Number(point.value) > 0 ? 10 : 0)}%`;

                return (
                    <div key={`${point.label}-${point.value}`} className="flex min-w-0 flex-1 flex-col items-center justify-end gap-2">
                        <span className="text-[10px] font-semibold text-slate-500">{point.value}</span>
                        <div
                            className="w-full rounded-t-lg shadow-inner"
                            style={{
                                height,
                                background: `linear-gradient(180deg, ${color} 0%, rgba(15, 23, 42, 0.82) 100%)`,
                            }}
                            aria-label={`${point.label}: ${point.value}`}
                            title={`${point.label}: ${point.value}`}
                        />
                        <span className="text-[10px] font-medium text-slate-500">{point.label}</span>
                    </div>
                );
            })}
        </div>
    );
}

function AreaTrendChart({ data }: { data: ChartPoint[] }) {
    if (data.length === 0) {
        return null;
    }

    const width = 640;
    const height = 210;
    const padding = 22;
    const maxValue = getMaxValue(data);

    const points = data.map((point, index) => {
        const x = data.length === 1 ? width / 2 : padding + (index * (width - padding * 2)) / (data.length - 1);
        const y = height - padding - (Number(point.value) / maxValue) * (height - padding * 2);
        return { x, y, label: point.label, value: point.value };
    });

    const linePath = points.map((point, index) => `${index === 0 ? 'M' : 'L'} ${point.x} ${point.y}`).join(' ');
    const areaPath = `${linePath} L ${points[points.length - 1].x} ${height - padding} L ${points[0].x} ${height - padding} Z`;
    const startLabel = data[0]?.label ?? '';
    const endLabel = data[data.length - 1]?.label ?? '';

    return (
        <div className="mt-5 overflow-hidden rounded-2xl border border-slate-200 bg-slate-50 p-3">
            <div className="mb-2 flex items-center justify-between gap-3 text-[10px] font-bold uppercase text-slate-500">
                <span>จำนวน session ต่อวัน</span>
                <span>{startLabel} — {endLabel}</span>
            </div>
            <div className="mb-2 text-[10px] font-medium text-slate-500">30 วันล่าสุด • hover จุดบนกราฟเพื่อดูค่าแบบละเอียด</div>
            <svg viewBox={`0 0 ${width} ${height}`} className="h-52 w-full" role="img" aria-label="Website visits trend chart: sessions per day over the last 30 days">
                <defs>
                    <linearGradient id="trendFill" x1="0" x2="0" y1="0" y2="1">
                        <stop offset="0%" stopColor="#38bdf8" stopOpacity="0.35" />
                        <stop offset="100%" stopColor="#38bdf8" stopOpacity="0.04" />
                    </linearGradient>
                </defs>
                {[0, 1, 2, 3].map((step) => {
                    const y = padding + (step * (height - padding * 2)) / 3;
                    return <line key={step} x1={padding} y1={y} x2={width - padding} y2={y} stroke="#cbd5e1" strokeDasharray="4 6" />;
                })}
                <path d={areaPath} fill="url(#trendFill)" />
                <path d={linePath} fill="none" stroke="#0ea5e9" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" />
                {points.map((point) => (
                    <g key={`${point.label}-${point.value}`}>
                        <circle cx={point.x} cy={point.y} r="4" fill="#ffffff" stroke="#0ea5e9" strokeWidth="2" />
                        <title>{`${point.label}: ${point.value}`}</title>
                    </g>
                ))}
            </svg>

        </div>
    );
}

function DonutChart({ data }: { data: ChartPoint[] }) {
    if (data.length === 0) {
        return null;
    }

    const total = data.reduce((sum, point) => sum + (Number(point.value) || 0), 0);

    if (total === 0) {
        return (
            <div className="mt-5 grid gap-4 sm:grid-cols-[170px_minmax(0,1fr)] sm:items-center">
                <div className="mx-auto flex h-36 w-36 items-center justify-center rounded-full border-[12px] border-slate-200 bg-slate-50 text-xl font-black text-slate-500">0</div>
                <div className="space-y-2 text-sm text-slate-500">
                    {data.map((point) => (
                        <div key={point.label} className="flex items-center justify-between gap-4 rounded-lg bg-slate-50 px-3 py-2">
                            <span className="flex items-center gap-2">
                                <span className="h-2.5 w-2.5 rounded-full bg-slate-300" />
                                {point.label}
                            </span>
                            <strong className="text-slate-700">{point.value}</strong>
                        </div>
                    ))}
                </div>
            </div>
        );
    }

    let current = 0;
    const gradient = data
        .map((point, index) => {
            const value = Number(point.value) || 0;
            if (value === 0) {
                return null;
            }
            const start = (current / total) * 100;
            current += value;
            const end = (current / total) * 100;
            return `${chartPalette[index % chartPalette.length]} ${start}% ${end}%`;
        })
        .filter(Boolean)
        .join(', ');

    return (
        <div className="mt-5 grid gap-4 sm:grid-cols-[170px_minmax(0,1fr)] sm:items-center">
            <div className="relative mx-auto flex h-36 w-36 items-center justify-center rounded-full" style={{ background: `conic-gradient(${gradient})` }} aria-label="Donut chart">
                <div className="flex h-20 w-20 flex-col items-center justify-center rounded-full bg-white text-center shadow-inner">
                    <span className="text-[10px] font-bold uppercase tracking-[0.18em] text-slate-500">Total</span>
                    <span className="text-lg font-black text-slate-900">{formatNumber(total)}</span>
                </div>
            </div>
            <div className="space-y-2 text-sm text-slate-600">
                {data.map((point, index) => {
                    const value = Number(point.value) || 0;
                    const share = total > 0 ? ((value / total) * 100).toFixed(1) : '0.0';

                    return (
                        <div key={point.label} className="flex items-center justify-between gap-4 rounded-lg bg-slate-50 px-3 py-2">
                            <span className="flex items-center gap-2">
                                <span className="h-2.5 w-2.5 rounded-full" style={{ backgroundColor: chartPalette[index % chartPalette.length] }} />
                                {point.label}
                            </span>
                            <span className="text-right">
                                <strong className="block text-slate-900">{value}</strong>
                                <small className="text-slate-500">{share}%</small>
                            </span>
                        </div>
                    );
                })}
            </div>
        </div>
    );
}

function DashboardSummaryCard({
    title,
    value,
    subtitle,
    accent,
}: {
    title: string;
    value: number;
    subtitle: string;
    accent: string;
}) {
    return (
        <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
            <div className="flex items-start justify-between gap-3">
                <div>
                    <p className="text-[11px] font-bold uppercase tracking-[0.18em] text-slate-500">{title}</p>
                    <p className="mt-3 text-3xl font-black tracking-tight text-slate-900">{formatNumber(value)}</p>
                </div>
                <span className="inline-flex h-10 w-10 items-center justify-center rounded-xl" style={{ backgroundColor: `${accent}22`, color: accent }}>
                    <span className="text-lg font-black">•</span>
                </span>
            </div>
            <p className="mt-3 text-sm text-slate-600">{subtitle}</p>
        </div>
    );
}

function DashboardChartCard({
    title,
    data,
    color,
    description,
    renderChart,
}: {
    title: string;
    data: ChartData;
    color: string;
    description: string;
    renderChart?: (data: ChartData) => JSX.Element | null;
}) {
    const hasSeries = Array.isArray(data.series) && data.series.length > 0;
    const total = data.total ?? 0;
    const showChart = hasSeries && (data.total === null || data.total >= 0);

    return (
        <article className="min-w-0 rounded-2xl border border-slate-200 bg-white p-4 shadow-sm sm:p-5">
            <div className="flex items-start justify-between gap-3">
                <div>
                    <p className="text-[11px] font-bold uppercase text-slate-500">{title}</p>
                    <h2 className="mt-2 text-2xl font-black text-slate-900">{hasSeries ? formatNumber(total) : '—'}</h2>
                </div>
                <span className="rounded-full border border-slate-200 bg-slate-50 px-2.5 py-1 text-[10px] font-bold uppercase tracking-[0.16em] text-slate-600">
                    {hasSeries ? 'Live' : 'No data'}
                </span>
            </div>

            <p className="mt-2 text-sm text-slate-600">{description}</p>

            {renderChart && showChart ? (
                renderChart(data)
            ) : (
                <EmptyChartState message={data.emptyMessage ?? 'ไม่มีข้อมูลจริงสำหรับเมตริกนี้ในระบบปัจจุบัน'} />
            )}
        </article>
    );
}

export default function Dashboard({
    pendingInvitations = [],
    websiteVisits,
    pageVisitors,
    homePageClicks,
    productCategoryClicks,
    topViewedProducts,
}: Props) {
    const { props } = usePage<{ currentTeam?: { slug: string } | null }>();
    const currentTeamSlug = props.currentTeam?.slug;
    const [showInvitations, setShowInvitations] = useState(
        pendingInvitations.length > 0,
    );

    const visits = websiteVisits ?? {
        hasData: false,
        total: null,
        series: [],
        emptyMessage: 'ไม่มีข้อมูลผู้เข้าใช้งานเว็บไซต์จริงในช่วง 30 วันล่าสุด',
    };

    const uniquePageVisitors = pageVisitors ?? homePageClicks ?? {
        hasData: false,
        total: null,
        series: [],
        emptyMessage: 'ไม่มีข้อมูลผู้ใช้งานจริงแยกตามหน้าในช่วง 30 วันล่าสุด',
    };

    const categoryClicks = productCategoryClicks ?? {
        hasData: false,
        total: null,
        series: [],
        emptyMessage: 'ไม่มีข้อมูล click ตามประเภทสินค้าจริงในระบบปัจจุบัน',
    };

    const topProducts = topViewedProducts ?? {
        hasData: false,
        total: null,
        series: [],
        emptyMessage: 'ไม่มีข้อมูลการคลิกเข้าดูสินค้าอย่างเป็นทางการในระบบปัจจุบัน',
    };

    const summaryCards = useMemo(() => [
        {
            title: 'Website visits',
            value: visits.total ?? 0,
            subtitle: 'Total sessions in 30 days',
            accent: '#22c55e',
        },
        {
            title: 'Page visitors',
            value: uniquePageVisitors.total ?? 0,
            subtitle: 'Distinct visitors by page',
            accent: '#38bdf8',
        },
        {
            title: 'Category clicks',
            value: categoryClicks.total ?? 0,
            subtitle: 'Clicks by product category',
            accent: '#f97316',
        },
        {
            title: 'Top products',
            value: topProducts.total ?? 0,
            subtitle: 'Most viewed items',
            accent: '#a78bfa',
        },
    ], [categoryClicks.total, topProducts.total, uniquePageVisitors.total, visits.total]);

    return (
        <>
            <Head title="Dashboard" />
            <PendingInvitationsModal
                invitations={pendingInvitations}
                open={pendingInvitations.length > 0 && showInvitations}
                onOpenChange={setShowInvitations}
            />

            <div className="flex h-full flex-1 flex-col gap-5 overflow-x-hidden rounded-xl p-4 text-slate-900 md:p-6">
                <header className="rounded-2xl border border-slate-200 bg-gradient-to-br from-slate-900 via-slate-800 to-slate-700 p-5 text-white sm:p-6">
                    <p className="text-[11px] font-bold uppercase tracking-[0.22em] text-cyan-300">JS SPORT GROUP</p>
                    <h1 className="mt-3 text-2xl font-black uppercase tracking-tight sm:text-3xl md:text-4xl">Dashboard Analytics</h1>
                    <p className="mt-2 max-w-3xl text-sm leading-relaxed text-slate-200">
                        ข้อมูลที่แสดงมาจาก source of truth ที่มีอยู่จริงในระบบเท่านั้น และแสดงภาพรวม clearly ด้วยกราฟที่อ่านง่ายในทุก breakpoint
                    </p>
                </header>

                <section className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
                    {summaryCards.map((card) => (
                        <DashboardSummaryCard
                            key={card.title}
                            title={card.title}
                            value={card.value}
                            subtitle={card.subtitle}
                            accent={card.accent}
                        />
                    ))}
                </section>

                <section className="grid gap-4 xl:grid-cols-[1.5fr_1fr]">
                    <DashboardChartCard
                        title="แนวโน้มผู้เข้าใช้งานเว็บไซต์"
                        data={visits}
                        color="#38bdf8"
                        description="จำนวน session ในช่วง 30 วันล่าสุด"
                        renderChart={() => <AreaTrendChart data={visits.series} />}
                    />
                    <DashboardChartCard
                        title="สัดส่วนการคลิกตามประเภทสินค้า"
                        data={categoryClicks}
                        color="#f97316"
                        description="สัดส่วน click ตามหมวดสินค้า"
                        renderChart={() => <DonutChart data={categoryClicks.series} />}
                    />
                </section>

                <section className="grid gap-4 xl:grid-cols-2">
                    <DashboardChartCard
                        title="จำนวนผู้ใช้งานแยกตามหน้า"
                        data={uniquePageVisitors}
                        color="#38bdf8"
                        description="จำนวน unique visitor ต่อหน้าใน 30 วันล่าสุด"
                        renderChart={() => <MetricBarChart data={uniquePageVisitors.series} color="#38bdf8" />}
                    />
                    <DashboardChartCard
                        title="Top 10 สินค้าที่ถูกรับชมมากสุด"
                        data={topProducts}
                        color="#a78bfa"
                        description="สินค้าที่ถูกคลิกเข้าดูมากที่สุดจาก event จริง"
                        renderChart={() => <MetricBarChart data={topProducts.series} color="#a78bfa" />}
                    />
                </section>

                {currentTeamSlug ? (
                    <p className="text-xs text-slate-500">
                        Active team: <span className="font-semibold text-slate-700">{currentTeamSlug}</span>
                    </p>
                ) : null}
            </div>
        </>
    );
}

Dashboard.layout = (props: { currentTeam?: { slug: string } | null }) => ({
    breadcrumbs: [
        {
            title: 'Dashboard',
            href: props.currentTeam ? dashboard(props.currentTeam.slug) : '/',
        },
    ],
});
