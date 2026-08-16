import { Head, router, useForm, usePage } from '@inertiajs/react';
import { useState } from 'react';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import BackofficeHero from '@/pages/backoffice/components/backoffice-hero';
import PaginationLinks from '@/pages/backoffice/components/pagination-links';
import StatsStrip from '@/pages/backoffice/components/stats-strip';
import { backofficePath, boolLabel, canManageTeam } from '@/pages/backoffice/shared';
import type { Paginated, SharedPageProps } from '@/pages/backoffice/shared';

type PostingRow = {
    id: number;
    title: string;
    description: string | null;
    positions_count: number;
    is_active: boolean;
    published_at: string | null;
};

type PageProps = SharedPageProps & {
    items: Paginated<PostingRow>;
};

export default function JobPostingsIndex() {
    const { props } = usePage<PageProps>();
    const teamSlug = props.currentTeam?.slug;
    const canManage = canManageTeam(props.currentTeam?.role);
    const [isCreateOpen, setIsCreateOpen] = useState(false);
    const [isEditOpen, setIsEditOpen] = useState(false);
    const [editingId, setEditingId] = useState<number | null>(null);

    const createForm = useForm({
        title: '',
        description: '',
        positions_count: '1',
    });

    const editForm = useForm({
        title: '',
        description: '',
        positions_count: '1',
    });

    if (!teamSlug) {
return <div className="p-6">No current team selected.</div>;
}

    const basePath = backofficePath(teamSlug, 'job-postings');
    const stats = [
        { label: 'ประกาศทั้งหมด', value: props.items.total },
        { label: 'เปิดใช้งาน', value: props.items.data.filter((posting) => posting.is_active).length },
        { label: 'ปิดใช้งาน', value: props.items.data.filter((posting) => !posting.is_active).length },
    ];
    const actionButtonBaseClass = 'rounded px-2 py-1 text-xs font-semibold transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-1';

    return (
        <>
            <Head title="ประกาศรับสมัครงาน" />
            <div className="space-y-6 bg-white p-4 text-slate-900 md:p-6">
                <BackofficeHero
                    title="ประกาศรับสมัครงาน"
                    description="จัดการประกาศด้วยโครงง่าย อ่านไว: ตำแหน่ง, รายละเอียด และสถานะการใช้งาน"
                />

                <StatsStrip cards={stats} />

                <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
                    <div className="mb-4 flex items-center justify-between">
                        <h2 className="text-base font-semibold text-slate-900">ข้อมูลประกาศ</h2>
                        {canManage && (
                            <button type="button" onClick={() => setIsCreateOpen(true)} className="rounded-xl bg-emerald-600 px-3 py-2 text-sm font-semibold text-white hover:bg-emerald-700">เพิ่มประกาศรับสมัคร</button>
                        )}
                    </div>
                    <div className="overflow-x-auto">
                        <table className="min-w-full divide-y divide-slate-200 text-sm">
                        <thead className="bg-slate-50"><tr><th className="px-3 py-2 text-left">ตำแหน่ง</th><th className="px-3 py-2 text-left">จำนวนอัตรา</th><th className="px-3 py-2 text-left">รายละเอียด</th><th className="px-3 py-2 text-left">วันที่ประกาศ</th><th className="px-3 py-2 text-left">สถานะ</th><th className="px-3 py-2 text-left">actions</th></tr></thead>
                        <tbody className="divide-y divide-slate-100">
                            {props.items.data.map((posting) => (
                                <tr key={posting.id}>
                                    <td className="px-3 py-2 font-medium text-slate-800">{posting.title}</td>
                                    <td className="px-3 py-2 text-slate-700">{posting.positions_count}</td>
                                    <td className="px-3 py-2 text-slate-600">{posting.description ?? '-'}</td>
                                    <td className="px-3 py-2">{posting.published_at ?? '-'}</td>
                                    <td className="px-3 py-2">{boolLabel(posting.is_active)}</td>
                                    <td className="px-3 py-2">
                                        <div className="flex gap-2">
                                            {canManage ? (
                                                <>
                                                    <button type="button" onClick={() => router.put(`${basePath}/${posting.id}/toggle-active`, {}, { preserveScroll: true })} className={`${actionButtonBaseClass} ${posting.is_active ? 'border border-amber-300 bg-amber-50 text-amber-800 hover:bg-amber-100 focus-visible:ring-amber-400' : 'border border-emerald-300 bg-emerald-50 text-emerald-700 hover:bg-emerald-100 focus-visible:ring-emerald-400'}`}>{posting.is_active ? 'ปิดใช้งาน' : 'เปิดใช้งาน'}</button>
                                                    <button type="button" onClick={() => {
 setEditingId(posting.id); editForm.setData('title', posting.title); editForm.setData('description', posting.description ?? ''); editForm.setData('positions_count', String(posting.positions_count)); setIsEditOpen(true); 
}} className={`${actionButtonBaseClass} border border-sky-300 bg-sky-50 text-sky-700 hover:bg-sky-100 focus-visible:ring-sky-400`}>แก้ไข</button>
                                                    <button type="button" onClick={() => router.delete(`${basePath}/${posting.id}`, { preserveScroll: true })} className={`${actionButtonBaseClass} border border-rose-300 bg-rose-50 text-rose-700 hover:bg-rose-100 focus-visible:ring-rose-400`}>ลบ</button>
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

                <Dialog open={isCreateOpen} onOpenChange={setIsCreateOpen}>
                    <DialogContent className="w-[96vw] max-w-xl">
                        <DialogHeader>
                            <DialogTitle>เพิ่มประกาศรับสมัคร</DialogTitle>
                            <DialogDescription>กรอกข้อมูลตำแหน่ง, จำนวนอัตรา และรายละเอียดประกาศ</DialogDescription>
                        </DialogHeader>
                        <form className="grid gap-3" onSubmit={(event) => {
                            event.preventDefault();
                            createForm.post(basePath, {
                                preserveScroll: true,
                                onSuccess: () => {
                                    setIsCreateOpen(false);
                                    createForm.reset();
                                },
                            });
                        }}>
                            <input value={createForm.data.title} onChange={(event) => createForm.setData('title', event.target.value)} placeholder="ตำแหน่ง" className="rounded-xl border border-slate-300 px-3 py-2 text-sm" />
                            {createForm.errors.title && <p className="text-xs text-rose-600">{createForm.errors.title}</p>}
                            <textarea value={createForm.data.description} onChange={(event) => createForm.setData('description', event.target.value)} placeholder="รายละเอียด" rows={5} className="rounded-xl border border-slate-300 px-3 py-2 text-sm" />
                            {createForm.errors.description && <p className="text-xs text-rose-600">{createForm.errors.description}</p>}
                            <DialogFooter>
                                <button type="submit" disabled={createForm.processing} className="rounded-xl bg-emerald-600 px-4 py-2 text-sm font-semibold text-white disabled:opacity-60">บันทึก</button>
                            </DialogFooter>
                        </form>
                    </DialogContent>
                </Dialog>

                <Dialog open={isEditOpen} onOpenChange={(open) => {
                    setIsEditOpen(open);

                    if (!open) {
                        setEditingId(null);
                        editForm.reset();
                    }
                }}>
                    <DialogContent className="w-[96vw] max-w-xl">
                        <DialogHeader>
                            <DialogTitle>แก้ไขประกาศรับสมัคร</DialogTitle>
                            <DialogDescription>แก้ไขตำแหน่ง, จำนวนอัตรา และรายละเอียดประกาศ</DialogDescription>
                        </DialogHeader>
                        <form className="grid gap-3" onSubmit={(event) => {
                            event.preventDefault();

                            if (editingId === null) {
                                return;
                            }

                            editForm.put(`${basePath}/${editingId}`, {
                                preserveScroll: true,
                                onSuccess: () => {
                                    setIsEditOpen(false);
                                    setEditingId(null);
                                    editForm.reset();
                                },
                            });
                        }}>
                            <input value={editForm.data.title} onChange={(event) => editForm.setData('title', event.target.value)} placeholder="ตำแหน่ง" className="rounded-xl border border-slate-300 px-3 py-2 text-sm" />
                            {editForm.errors.title && <p className="text-xs text-rose-600">{editForm.errors.title}</p>}
                            <textarea value={editForm.data.description} onChange={(event) => editForm.setData('description', event.target.value)} placeholder="รายละเอียด" rows={5} className="rounded-xl border border-slate-300 px-3 py-2 text-sm" />
                            {editForm.errors.description && <p className="text-xs text-rose-600">{editForm.errors.description}</p>}
                            <DialogFooter>
                                <button type="submit" disabled={editForm.processing || editingId === null} className="rounded-xl bg-emerald-600 px-4 py-2 text-sm font-semibold text-white disabled:opacity-60">บันทึก</button>
                            </DialogFooter>
                        </form>
                    </DialogContent>
                </Dialog>
            </div>
        </>
    );
}

JobPostingsIndex.layout = (props: { currentTeam?: { slug: string } | null }) => ({
    breadcrumbs: [{ title: 'ประกาศรับสมัครงาน', href: props.currentTeam ? `/${props.currentTeam.slug}/backoffice/job-postings` : '/' }],
});
