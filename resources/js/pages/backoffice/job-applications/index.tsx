import { Head, router, useForm, usePage } from '@inertiajs/react';
import BackofficeHero from '@/pages/backoffice/components/backoffice-hero';
import PaginationLinks from '@/pages/backoffice/components/pagination-links';
import StatsStrip from '@/pages/backoffice/components/stats-strip';
import { backofficePath, canManageTeam } from '@/pages/backoffice/shared';
import type { Paginated, SharedPageProps } from '@/pages/backoffice/shared';

type ApplicationRow = {
    id: number;
    job_posting_id: number | null;
    full_name: string;
    email: string;
    phone: string | null;
    position: string | null;
    status: string;
    applied_at: string | null;
};

type PageProps = SharedPageProps & {
    filters: { search: string; status: string; sort_dir: string };
    items: Paginated<ApplicationRow>;
};

export default function JobApplicationsIndex() {
    const { props } = usePage<PageProps>();
    const teamSlug = props.currentTeam?.slug;
    const canManage = canManageTeam(props.currentTeam?.role);
    const updateForm = useForm({ status: '', review_notes: '' });

    if (!teamSlug) {
return <div className="p-6">No current team selected.</div>;
}

    const basePath = backofficePath(teamSlug, 'job-applications');
    const stats = [
        { label: 'ใบสมัครทั้งหมด', value: props.items.total },
        { label: 'สถานะใหม่', value: props.items.data.filter((application) => application.status === 'new').length },
        { label: 'ตรวจแล้ว', value: props.items.data.filter((application) => application.status === 'reviewed').length },
        { label: 'หน้าปัจจุบัน', value: props.items.current_page },
    ];
    const actionButtonBaseClass = 'rounded px-2 py-1 text-xs font-semibold transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-1';

    return (
        <>
            <Head title="ผู้สมัครงาน" />
            <div className="space-y-6 bg-white p-4 text-slate-900 md:p-6">
                <BackofficeHero
                    title="ผู้สมัครงาน"
                    description="ติดตามผู้สมัคร ปรับสถานะ และดูข้อมูลติดต่อแบบอ่านง่ายในหน้าเดียว"
                />

                <StatsStrip cards={stats} />

                <form className="grid gap-3 rounded-2xl border border-slate-200 bg-white p-4 shadow-sm md:grid-cols-4" onSubmit={(event) => {
                    event.preventDefault();
                    const data = new FormData(event.currentTarget);
                    router.get(basePath, {
                        search: String(data.get('search') ?? ''),
                        status: String(data.get('status') ?? ''),
                        sort_dir: String(data.get('sort_dir') ?? 'desc'),
                    }, { preserveState: true, preserveScroll: true });
                }}>
                    <input name="search" defaultValue={props.filters.search} placeholder="ค้นหาผู้สมัคร" className="rounded border border-slate-300 px-3 py-2 text-sm" />
                    <input name="status" defaultValue={props.filters.status} placeholder="status เช่น new" className="rounded border border-slate-300 px-3 py-2 text-sm" />
                    <select name="sort_dir" defaultValue={props.filters.sort_dir} className="rounded border border-slate-300 px-3 py-2 text-sm"><option value="desc">ใหม่ไปเก่า</option><option value="asc">เก่าไปใหม่</option></select>
                    <button type="submit" className="rounded-xl bg-slate-900 px-3 py-2 text-sm font-semibold text-white">กรองข้อมูล</button>
                </form>

                <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
                    <div className="overflow-x-auto">
                        <table className="min-w-full divide-y divide-slate-200 text-sm">
                        <thead className="bg-slate-50"><tr><th className="px-3 py-2 text-left">ชื่อ</th><th className="px-3 py-2 text-left">ตำแหน่ง</th><th className="px-3 py-2 text-left">อีเมล</th><th className="px-3 py-2 text-left">สถานะ</th><th className="px-3 py-2 text-left">actions</th></tr></thead>
                        <tbody className="divide-y divide-slate-100">
                            {props.items.data.map((application) => (
                                <tr key={application.id}>
                                    <td className="px-3 py-2">{application.full_name}</td>
                                    <td className="px-3 py-2">{application.position ?? '-'}</td>
                                    <td className="px-3 py-2">{application.email}</td>
                                    <td className="px-3 py-2">{application.status}</td>
                                    <td className="px-3 py-2">
                                        <div className="flex flex-wrap gap-2">
                                            {canManage ? (
                                                <>
                                                    <button type="button" onClick={() => {
                                                        updateForm.setData('status', 'reviewed');
                                                        updateForm.setData('review_notes', 'Reviewed by admin');
                                                        updateForm.put(`${basePath}/${application.id}`, { preserveScroll: true });
                                                    }} className={`${actionButtonBaseClass} border border-sky-300 bg-sky-50 text-sky-700 hover:bg-sky-100 focus-visible:ring-sky-400`}>Mark reviewed</button>
                                                    <button type="button" onClick={() => router.delete(`${basePath}/${application.id}`, { preserveScroll: true })} className={`${actionButtonBaseClass} border border-rose-300 bg-rose-50 text-rose-700 hover:bg-rose-100 focus-visible:ring-rose-400`}>ลบ</button>
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

JobApplicationsIndex.layout = (props: { currentTeam?: { slug: string } | null }) => ({
    breadcrumbs: [{ title: 'ผู้สมัครงาน', href: props.currentTeam ? `/${props.currentTeam.slug}/backoffice/job-applications` : '/' }],
});
