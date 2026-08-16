import { Head, router, useForm, usePage } from '@inertiajs/react';
import { useState } from 'react';
import InputError from '@/components/input-error';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import BackofficeHero from '@/pages/backoffice/components/backoffice-hero';
import PaginationLinks from '@/pages/backoffice/components/pagination-links';
import StatsStrip from '@/pages/backoffice/components/stats-strip';
import { backofficePath, boolLabel, canManageTeam } from '@/pages/backoffice/shared';
import type { Paginated, SharedPageProps } from '@/pages/backoffice/shared';

type MemberRow = {
    id: number;
    first_name: string | null;
    last_name: string | null;
    name: string;
    position: string | null;
    username: string | null;
    is_active: boolean;
    current_team_id: number | null;
    updated_at: string | null;
};

type PageProps = SharedPageProps & {
    items: Paginated<MemberRow>;
};

export default function MembersIndex() {
    const { props } = usePage<PageProps>();
    const teamSlug = props.currentTeam?.slug;
    const canManage = canManageTeam(props.currentTeam?.role);
    const [isCreateOpen, setIsCreateOpen] = useState(false);
    const [isEditOpen, setIsEditOpen] = useState(false);
    const [editingId, setEditingId] = useState<number | null>(null);

    const createForm = useForm({
        first_name: '',
        last_name: '',
        position: '',
        username: '',
        password: '',
        password_confirmation: '',
        is_active: true,
        current_team_id: null as number | null,
    });

    const editForm = useForm({
        first_name: '',
        last_name: '',
        position: '',
        username: '',
        is_active: true,
        current_team_id: null as number | null,
    });

    const resetPasswordForm = useForm({
        password: '',
    });

    const stats = [
        { label: 'สมาชิกทั้งหมด', value: props.items.total },
        { label: 'เปิดใช้งาน', value: props.items.data.filter((member) => member.is_active).length },
        { label: 'ปิดใช้งาน', value: props.items.data.filter((member) => !member.is_active).length },
    ];
    const actionButtonBaseClass = 'rounded px-2 py-1 text-xs font-semibold transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-1';

    if (!teamSlug) {
        return <div className="p-6">No current team selected.</div>;
    }

    const basePath = backofficePath(teamSlug, 'members');

    function startEdit(member: MemberRow) {
        setEditingId(member.id);
        editForm.setData({
            first_name: member.first_name ?? '',
            last_name: member.last_name ?? '',
            position: member.position ?? '',
            username: member.username ?? '',
            is_active: member.is_active,
            current_team_id: member.current_team_id,
        });
        setIsEditOpen(true);
    }

    return (
        <>
            <Head title="จัดการผู้ใช้งาน" />

            <div className="space-y-6 bg-white p-4 text-slate-900 md:p-6">
                <BackofficeHero
                    title="จัดการผู้ใช้งาน"
                    description="สร้างและจัดการบัญชีผู้ใช้งาน ด้วยข้อมูล ชื่อ สกุล ตำแหน่ง และชื่อบัญชี"
                />

                <StatsStrip cards={stats} />

                <section className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
                    <div className="mb-4 flex items-center justify-between">
                        <h2 className="text-base font-semibold text-slate-900">ข้อมูลผู้ใช้งาน</h2>
                        {canManage && (
                            <Button type="button" onClick={() => setIsCreateOpen(true)} className="rounded-xl bg-emerald-600 hover:bg-emerald-700">สร้างบัญชีผู้ใช้งาน</Button>
                        )}
                    </div>
                    <div className="overflow-x-auto">
                        <table className="min-w-full divide-y divide-slate-200 text-sm">
                            <thead className="bg-slate-50">
                                <tr>
                                    <th className="px-3 py-2 text-left">ชื่อ</th>
                                    <th className="px-3 py-2 text-left">สกุล</th>
                                    <th className="px-3 py-2 text-left">ตำแหน่ง</th>
                                    <th className="px-3 py-2 text-left">ชื่อบัญชี</th>
                                    <th className="px-3 py-2 text-left">สถานะ</th>
                                    <th className="px-3 py-2 text-left">การทำงาน</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-slate-100">
                                {props.items.data.map((member) => (
                                    <tr key={member.id}>
                                        <td className="px-3 py-2">{member.first_name ?? '-'}</td>
                                        <td className="px-3 py-2">{member.last_name ?? '-'}</td>
                                        <td className="px-3 py-2">{member.position ?? '-'}</td>
                                        <td className="px-3 py-2">{member.username ?? '-'}</td>
                                        <td className="px-3 py-2">{boolLabel(member.is_active)}</td>
                                        <td className="px-3 py-2">
                                            <div className="flex flex-wrap gap-2">
                                                {canManage ? (
                                                    <>
                                                        <button
                                                            type="button"
                                                            onClick={() => router.put(`${basePath}/${member.id}/toggle-active`, {}, { preserveScroll: true })}
                                                            className={`${actionButtonBaseClass} ${member.is_active ? 'border border-amber-300 bg-amber-50 text-amber-800 hover:bg-amber-100 focus-visible:ring-amber-400' : 'border border-emerald-300 bg-emerald-50 text-emerald-700 hover:bg-emerald-100 focus-visible:ring-emerald-400'}`}
                                                        >
                                                            {member.is_active ? 'ปิดใช้งาน' : 'เปิดใช้งาน'}
                                                        </button>
                                                        <button type="button" onClick={() => startEdit(member)} className={`${actionButtonBaseClass} border border-sky-300 bg-sky-50 text-sky-700 hover:bg-sky-100 focus-visible:ring-sky-400`}>แก้ไข</button>
                                                        <button
                                                            type="button"
                                                            onClick={() => {
                                                            resetPasswordForm.setData('password', 'password123');
                                                            resetPasswordForm.put(`${basePath}/${member.id}/reset-password`, { preserveScroll: true });
                                                        }}
                                                            className={`${actionButtonBaseClass} border border-amber-300 bg-amber-50 text-amber-800 hover:bg-amber-100 focus-visible:ring-amber-400`}
                                                        >
                                                            รีเซ็ตรหัสผ่าน
                                                        </button>
                                                        <button type="button" onClick={() => router.delete(`${basePath}/${member.id}`, { preserveScroll: true })} className={`${actionButtonBaseClass} border border-rose-300 bg-rose-50 text-rose-700 hover:bg-rose-100 focus-visible:ring-rose-400`}>ลบ</button>
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

                    <div className="mt-4">
                        <PaginationLinks links={props.items.links} />
                    </div>
                </section>

                <Dialog open={isCreateOpen} onOpenChange={setIsCreateOpen}>
                    <DialogContent className="w-[96vw] max-w-3xl">
                        <DialogHeader>
                            <DialogTitle className="text-xl font-black text-slate-900">สร้างบัญชีผู้ใช้งาน</DialogTitle>
                            <DialogDescription>กรอกข้อมูลพื้นฐานและความปลอดภัยให้ครบก่อนบันทึกบัญชีใหม่</DialogDescription>
                        </DialogHeader>
                        <form className="space-y-4" onSubmit={(event) => {
                            event.preventDefault();
                            createForm.post(basePath, {
                                preserveScroll: true,
                                onSuccess: () => {
                                    setIsCreateOpen(false);
                                    createForm.reset();
                                },
                            });
                        }}>
                            <div className="grid gap-4">
                                <section className="space-y-3 rounded-xl border border-slate-200 bg-slate-50/60 p-4">
                                    <p className="text-xs font-semibold uppercase tracking-[0.14em] text-slate-500">ข้อมูลผู้ใช้งาน</p>

                                    <div className="space-y-1.5">
                                        <label className="text-xs font-semibold text-slate-700">ชื่อ</label>
                                        <input value={createForm.data.first_name} onChange={(event) => createForm.setData('first_name', event.target.value)} placeholder="เช่น สมชาย" className="w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm" />
                                        <InputError message={createForm.errors.first_name} />
                                    </div>

                                    <div className="space-y-1.5">
                                        <label className="text-xs font-semibold text-slate-700">สกุล</label>
                                        <input value={createForm.data.last_name} onChange={(event) => createForm.setData('last_name', event.target.value)} placeholder="เช่น ใจดี" className="w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm" />
                                        <InputError message={createForm.errors.last_name} />
                                    </div>

                                    <div className="space-y-1.5">
                                        <label className="text-xs font-semibold text-slate-700">ตำแหน่ง</label>
                                        <input value={createForm.data.position} onChange={(event) => createForm.setData('position', event.target.value)} placeholder="เช่น Sales Manager" className="w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm" />
                                        <InputError message={createForm.errors.position} />
                                    </div>
                                </section>

                                <section className="space-y-3 rounded-xl border border-slate-200 bg-slate-50/60 p-4">
                                    <p className="text-xs font-semibold uppercase tracking-[0.14em] text-slate-500">ข้อมูลเข้าสู่ระบบ</p>

                                    <div className="space-y-1.5">
                                        <label className="text-xs font-semibold text-slate-700">ชื่อบัญชี</label>
                                        <input value={createForm.data.username} onChange={(event) => createForm.setData('username', event.target.value)} placeholder="เช่น somchai.admin" className="w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm" />
                                        <InputError message={createForm.errors.username} />
                                    </div>

                                    <div className="space-y-1.5">
                                        <label className="text-xs font-semibold text-slate-700">รหัสผ่าน</label>
                                        <input type="password" value={createForm.data.password} onChange={(event) => createForm.setData('password', event.target.value)} placeholder="อย่างน้อย 8 ตัวอักษร" className="w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm" />
                                        <InputError message={createForm.errors.password} />
                                    </div>

                                    <div className="space-y-1.5">
                                        <label className="text-xs font-semibold text-slate-700">ยืนยันรหัสผ่าน</label>
                                        <input type="password" value={createForm.data.password_confirmation} onChange={(event) => createForm.setData('password_confirmation', event.target.value)} placeholder="กรอกรหัสผ่านอีกครั้ง" className="w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm" />
                                        <InputError message={createForm.errors.password_confirmation} />
                                    </div>
                                </section>
                            </div>

                            <div className="rounded-xl border border-slate-200 bg-white px-4 py-3">
                                <label className="flex items-center gap-2 text-sm font-medium text-slate-700">
                                    <input type="checkbox" checked={createForm.data.is_active} onChange={(event) => createForm.setData('is_active', event.target.checked)} className="h-4 w-4 rounded border-slate-300" />
                                    เปิดใช้งานบัญชีทันทีหลังบันทึก
                                </label>
                            </div>

                            <DialogFooter className="gap-2">
                                <Button type="button" variant="outline" onClick={() => setIsCreateOpen(false)}>
                                    ยกเลิก
                                </Button>
                                <Button type="submit" disabled={createForm.processing} className="bg-emerald-600 hover:bg-emerald-700">
                                    บันทึกผู้ใช้งาน
                                </Button>
                            </DialogFooter>
                        </form>
                    </DialogContent>
                </Dialog>

                <Dialog open={isEditOpen} onOpenChange={setIsEditOpen}>
                    <DialogContent>
                        <DialogHeader>
                            <DialogTitle>แก้ไขผู้ใช้งาน</DialogTitle>
                            <DialogDescription>ปรับข้อมูลพื้นฐานของผู้ใช้งาน</DialogDescription>
                        </DialogHeader>
                        <form className="grid gap-2" onSubmit={(event) => {
                            event.preventDefault();

                            if (editingId === null) {
return;
}

                            editForm.put(`${basePath}/${editingId}`, {
                                preserveScroll: true,
                                onSuccess: () => setIsEditOpen(false),
                            });
                        }}>
                            <input value={editForm.data.first_name} onChange={(event) => editForm.setData('first_name', event.target.value)} placeholder="ชื่อ" className="rounded border border-slate-300 px-3 py-2 text-sm" />
                            <InputError message={editForm.errors.first_name} />
                            <input value={editForm.data.last_name} onChange={(event) => editForm.setData('last_name', event.target.value)} placeholder="สกุล" className="rounded border border-slate-300 px-3 py-2 text-sm" />
                            <InputError message={editForm.errors.last_name} />
                            <input value={editForm.data.position} onChange={(event) => editForm.setData('position', event.target.value)} placeholder="ตำแหน่ง" className="rounded border border-slate-300 px-3 py-2 text-sm" />
                            <InputError message={editForm.errors.position} />
                            <input value={editForm.data.username} onChange={(event) => editForm.setData('username', event.target.value)} placeholder="ชื่อบัญชี" className="rounded border border-slate-300 px-3 py-2 text-sm" />
                            <InputError message={editForm.errors.username} />
                            <label className="flex items-center gap-2 text-sm">
                                <input type="checkbox" checked={editForm.data.is_active} onChange={(event) => editForm.setData('is_active', event.target.checked)} />
                                เปิดใช้งาน
                            </label>
                            <DialogFooter>
                                <Button type="submit" disabled={editForm.processing || editingId === null}>บันทึกการแก้ไข</Button>
                            </DialogFooter>
                        </form>
                    </DialogContent>
                </Dialog>
            </div>
        </>
    );
}

MembersIndex.layout = (props: { currentTeam?: { slug: string } | null }) => ({
    breadcrumbs: [
        {
            title: 'จัดการผู้ใช้งาน',
            href: props.currentTeam ? `/${props.currentTeam.slug}/backoffice/members` : '/',
        },
    ],
});
