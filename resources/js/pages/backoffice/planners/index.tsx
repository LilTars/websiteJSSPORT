import { Head, router, useForm, usePage } from '@inertiajs/react';
import { useState } from 'react';
import BackofficeHero from '@/pages/backoffice/components/backoffice-hero';
import PaginationLinks from '@/pages/backoffice/components/pagination-links';
import StatsStrip from '@/pages/backoffice/components/stats-strip';
import { backofficePath, boolLabel, canManageTeam } from '@/pages/backoffice/shared';
import type { Paginated, SharedPageProps } from '@/pages/backoffice/shared';

type PlannerRow = {
    id: number;
    name: string;
    slug: string;
    contact_name: string | null;
    phone: string | null;
    email: string | null;
    is_active: boolean;
    sort_order: number;
};

type PageProps = SharedPageProps & {
    filters: { search: string; sort_dir: string };
    items: Paginated<PlannerRow>;
};

export default function PlannersIndex() {
    const { props } = usePage<PageProps>();
    const teamSlug = props.currentTeam?.slug;
    const canManage = canManageTeam(props.currentTeam?.role);
    const [editingId, setEditingId] = useState<number | null>(null);

    const form = useForm({
        name: '',
        slug: '',
        contact_name: '',
        phone: '',
        email: '',
        line_id: '',
        facebook_url: '',
        notes: '',
        is_active: true,
        sort_order: 0,
    });

    if (!teamSlug) {
return <div className="p-6">No current team selected.</div>;
}

    const basePath = backofficePath(teamSlug, 'planners');
    const stats = [
        { label: 'พลาสเนอร์ทั้งหมด', value: props.items.total },
        { label: 'เปิดใช้งาน', value: props.items.data.filter((planner) => planner.is_active).length },
        { label: 'ปิดใช้งาน', value: props.items.data.filter((planner) => !planner.is_active).length },
        { label: 'หน้าปัจจุบัน', value: props.items.current_page },
    ];
    const actionButtonBaseClass = 'rounded px-2 py-1 text-xs font-semibold transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-1';

    return (
        <>
            <Head title="จัดการพลาสเนอร์" />
            <div className="space-y-6 bg-white p-4 text-slate-900 md:p-6">
                <BackofficeHero
                    title="จัดการพลาสเนอร์"
                    description="จัดการข้อมูลผู้ประสานงานผลิตงานให้ครบทั้งรายละเอียดติดต่อและสถานะการใช้งาน"
                />

                <StatsStrip cards={stats} />

                <form className="grid gap-3 rounded-2xl border border-slate-200 bg-white p-4 shadow-sm md:grid-cols-3" onSubmit={(event) => {
                    event.preventDefault();
                    const data = new FormData(event.currentTarget);
                    router.get(basePath, {
                        search: String(data.get('search') ?? ''),
                        sort_dir: String(data.get('sort_dir') ?? 'asc'),
                    }, { preserveState: true, preserveScroll: true });
                }}>
                    <input name="search" defaultValue={props.filters.search} placeholder="ค้นหาพลาสเนอร์" className="rounded border border-slate-300 px-3 py-2 text-sm" />
                    <select name="sort_dir" defaultValue={props.filters.sort_dir} className="rounded border border-slate-300 px-3 py-2 text-sm"><option value="asc">A-Z</option><option value="desc">Z-A</option></select>
                    <button type="submit" className="rounded-xl bg-slate-900 px-3 py-2 text-sm font-semibold text-white">กรองข้อมูล</button>
                </form>

                {canManage && (
                    <form className="grid gap-2 rounded-2xl border border-slate-200 bg-white p-4 shadow-sm md:grid-cols-2" onSubmit={(event) => {
                        event.preventDefault();

                        if (editingId === null) {
form.post(basePath, { preserveScroll: true });
} else {
form.put(`${basePath}/${editingId}`, { preserveScroll: true });
}
                    }}>
                        <input value={form.data.name} onChange={(event) => form.setData('name', event.target.value)} placeholder="name" className="rounded border border-slate-300 px-3 py-2 text-sm" />
                        <input value={form.data.slug} onChange={(event) => form.setData('slug', event.target.value)} placeholder="slug" className="rounded border border-slate-300 px-3 py-2 text-sm" />
                        <input value={form.data.contact_name} onChange={(event) => form.setData('contact_name', event.target.value)} placeholder="contact name" className="rounded border border-slate-300 px-3 py-2 text-sm" />
                        <input value={form.data.phone} onChange={(event) => form.setData('phone', event.target.value)} placeholder="phone" className="rounded border border-slate-300 px-3 py-2 text-sm" />
                        <input value={form.data.email} onChange={(event) => form.setData('email', event.target.value)} placeholder="email" className="rounded border border-slate-300 px-3 py-2 text-sm" />
                        <input value={form.data.line_id} onChange={(event) => form.setData('line_id', event.target.value)} placeholder="line id" className="rounded border border-slate-300 px-3 py-2 text-sm" />
                        <label className="flex items-center gap-2 text-sm"><input type="checkbox" checked={form.data.is_active} onChange={(event) => form.setData('is_active', event.target.checked)} />เปิดใช้งาน</label>
                        <button type="submit" className="rounded-xl bg-emerald-600 px-3 py-2 text-sm font-semibold text-white">{editingId === null ? 'เพิ่มพลาสเนอร์' : 'บันทึกการแก้ไข'}</button>
                    </form>
                )}

                <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
                    <div className="overflow-x-auto">
                        <table className="min-w-full divide-y divide-slate-200 text-sm">
                        <thead className="bg-slate-50"><tr><th className="px-3 py-2 text-left">name</th><th className="px-3 py-2 text-left">contact</th><th className="px-3 py-2 text-left">phone</th><th className="px-3 py-2 text-left">status</th><th className="px-3 py-2 text-left">actions</th></tr></thead>
                        <tbody className="divide-y divide-slate-100">
                            {props.items.data.map((planner) => (
                                <tr key={planner.id}>
                                    <td className="px-3 py-2">{planner.name}</td><td className="px-3 py-2">{planner.contact_name ?? '-'}</td><td className="px-3 py-2">{planner.phone ?? '-'}</td><td className="px-3 py-2">{boolLabel(planner.is_active)}</td>
                                    <td className="px-3 py-2">
                                        <div className="flex gap-2">
                                            {canManage ? (
                                                <>
                                                    <button type="button" onClick={() => {
 setEditingId(planner.id); form.setData('name', planner.name); form.setData('slug', planner.slug); form.setData('contact_name', planner.contact_name ?? ''); form.setData('phone', planner.phone ?? ''); form.setData('email', planner.email ?? ''); form.setData('is_active', planner.is_active); form.setData('sort_order', planner.sort_order); 
}} className={`${actionButtonBaseClass} border border-sky-300 bg-sky-50 text-sky-700 hover:bg-sky-100 focus-visible:ring-sky-400`}>แก้ไข</button>
                                                    <button type="button" onClick={() => router.delete(`${basePath}/${planner.id}`, { preserveScroll: true })} className={`${actionButtonBaseClass} border border-rose-300 bg-rose-50 text-rose-700 hover:bg-rose-100 focus-visible:ring-rose-400`}>ลบ</button>
                                                </>
                                            ) : (
                                                <span className="text-xs text-slate-400">สิทธิ์ไม่เพียงพอ</span>
                                            )}
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                        </table>
                    </div>
                    <div className="mt-4"><PaginationLinks links={props.items.links} /></div>
                </div>
            </div>
        </>
    );
}

PlannersIndex.layout = (props: { currentTeam?: { slug: string } | null }) => ({
    breadcrumbs: [{ title: 'จัดการพลาสเนอร์', href: props.currentTeam ? `/${props.currentTeam.slug}/backoffice/planners` : '/' }],
});
