import { Head, router, useForm, usePage } from '@inertiajs/react';
import { useState } from 'react';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import BackofficeHero from '@/pages/backoffice/components/backoffice-hero';
import PaginationLinks from '@/pages/backoffice/components/pagination-links';
import StatsStrip from '@/pages/backoffice/components/stats-strip';
import { backofficePath, boolLabel, canManageTeam } from '@/pages/backoffice/shared';
import type { Paginated, SharedPageProps } from '@/pages/backoffice/shared';

type CategoryRow = {
    id: number;
    name: string;
    is_active: boolean;
    created_at: string | null;
};

type PageProps = SharedPageProps & {
    items: Paginated<CategoryRow>;
};

export default function ProductCategoriesIndex() {
    const { props } = usePage<PageProps>();
    const teamSlug = props.currentTeam?.slug;
    const canManage = canManageTeam(props.currentTeam?.role);
    const [isCreateOpen, setIsCreateOpen] = useState(false);
    const [editingCategoryId, setEditingCategoryId] = useState<number | null>(null);
    const [isEditOpen, setIsEditOpen] = useState(false);

    const createForm = useForm({
        name: '',
    });

    const editForm = useForm({
        name: '',
    });

    if (!teamSlug) {
return <div className="p-6">No current team selected.</div>;
}

    const basePath = backofficePath(teamSlug, 'product-categories');
    const stats = [
        { label: 'หมวดทั้งหมด', value: props.items.total },
        { label: 'เปิดใช้งาน', value: props.items.data.filter((category) => category.is_active).length },
        { label: 'ปิดใช้งาน', value: props.items.data.filter((category) => !category.is_active).length },
    ];
    const actionButtonBaseClass = 'rounded px-2 py-1 text-xs font-semibold transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-1';

    return (
        <>
            <Head title="จัดการประเภทสินค้า" />
            <div className="space-y-6 bg-white p-4 text-slate-900 md:p-6">
                <BackofficeHero
                    title="จัดการประเภทสินค้า"
                    description="ควบคุมหมวดสินค้าให้เป็นระเบียบ พร้อมปรับสถานะการใช้งานแต่ละหมวดได้ทันที"
                />

                <StatsStrip cards={stats} />

                <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
                    <div className="mb-4 flex items-center justify-between">
                        <h2 className="text-base font-semibold text-slate-900">รายการประเภทสินค้า</h2>
                        {canManage && (
                            <button type="button" onClick={() => setIsCreateOpen(true)} className="rounded-xl bg-emerald-600 px-3 py-2 text-sm font-semibold text-white hover:bg-emerald-700">เพิ่มประเภทสินค้า</button>
                        )}
                    </div>
                    <div className="overflow-x-auto">
                        <table className="min-w-full divide-y divide-slate-200 text-sm">
                        <thead className="bg-slate-50"><tr><th className="px-3 py-2 text-left">name</th><th className="px-3 py-2 text-left">วันที่บันทึก</th><th className="px-3 py-2 text-left">status</th><th className="px-3 py-2 text-left">actions</th></tr></thead>
                        <tbody className="divide-y divide-slate-100">
                            {props.items.data.map((category) => (
                                <tr key={category.id}>
                                    <td className="px-3 py-2">{category.name}</td><td className="px-3 py-2">{category.created_at ?? '-'}</td><td className="px-3 py-2">{boolLabel(category.is_active)}</td>
                                    <td className="px-3 py-2">
                                        <div className="flex gap-2">
                                            {canManage ? (
                                                <>
                                                    <button
                                                        type="button"
                                                        onClick={() => {
                                                            setEditingCategoryId(category.id);
                                                            editForm.setData('name', category.name);
                                                            setIsEditOpen(true);
                                                        }}
                                                        className={`${actionButtonBaseClass} border border-sky-300 bg-sky-50 text-sky-700 hover:bg-sky-100 focus-visible:ring-sky-400`}
                                                    >
                                                        แก้ไข
                                                    </button>
                                                    <button
                                                        type="button"
                                                        onClick={() => router.put(`${basePath}/${category.id}/toggle-active`, {}, { preserveScroll: true })}
                                                        className={`${actionButtonBaseClass} ${category.is_active
                                                            ? 'border border-amber-300 bg-amber-50 text-amber-800 hover:bg-amber-100 focus-visible:ring-amber-400'
                                                            : 'border border-emerald-300 bg-emerald-50 text-emerald-700 hover:bg-emerald-100 focus-visible:ring-emerald-400'
                                                        }`}
                                                    >
                                                        {category.is_active ? 'ปิดใช้งาน' : 'เปิดใช้งาน'}
                                                    </button>
                                                    <button
                                                        type="button"
                                                        onClick={() => router.delete(`${basePath}/${category.id}`, { preserveScroll: true })}
                                                        className={`${actionButtonBaseClass} border border-rose-300 bg-rose-50 text-rose-700 hover:bg-rose-100 focus-visible:ring-rose-400`}
                                                    >
                                                        ลบ
                                                    </button>
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
                    <DialogContent>
                        <DialogHeader>
                            <DialogTitle>เพิ่มประเภทสินค้า</DialogTitle>
                            <DialogDescription>กรอกเฉพาะชื่อประเภทสินค้า</DialogDescription>
                        </DialogHeader>
                        <form className="grid gap-2" onSubmit={(event) => {
                            event.preventDefault();
                            createForm.post(basePath, {
                                preserveScroll: true,
                                onSuccess: () => {
                                    setIsCreateOpen(false);
                                    createForm.reset();
                                },
                            });
                        }}>
                            <input value={createForm.data.name} onChange={(event) => createForm.setData('name', event.target.value)} placeholder="ชื่อประเภทสินค้า" className="rounded border border-slate-300 px-3 py-2 text-sm" />
                            {createForm.errors.name && <p className="text-xs text-rose-600">{createForm.errors.name}</p>}
                            <DialogFooter>
                                <button type="submit" disabled={createForm.processing} className="rounded bg-emerald-600 px-3 py-2 text-sm font-semibold text-white disabled:opacity-60">บันทึก</button>
                            </DialogFooter>
                        </form>
                    </DialogContent>
                </Dialog>

                <Dialog open={isEditOpen} onOpenChange={(open) => {
                    setIsEditOpen(open);

                    if (!open) {
                        setEditingCategoryId(null);
                        editForm.reset();
                    }
                }}>
                    <DialogContent>
                        <DialogHeader>
                            <DialogTitle>แก้ไขประเภทสินค้า</DialogTitle>
                            <DialogDescription>แก้ไขชื่อประเภทสินค้า</DialogDescription>
                        </DialogHeader>
                        <form className="grid gap-2" onSubmit={(event) => {
                            event.preventDefault();

                            if (editingCategoryId === null) {
                                return;
                            }

                            editForm.put(`${basePath}/${editingCategoryId}`, {
                                preserveScroll: true,
                                onSuccess: () => {
                                    setIsEditOpen(false);
                                    setEditingCategoryId(null);
                                    editForm.reset();
                                },
                            });
                        }}>
                            <input value={editForm.data.name} onChange={(event) => editForm.setData('name', event.target.value)} placeholder="ชื่อประเภทสินค้า" className="rounded border border-slate-300 px-3 py-2 text-sm" />
                            {editForm.errors.name && <p className="text-xs text-rose-600">{editForm.errors.name}</p>}
                            <DialogFooter>
                                <button type="submit" disabled={editForm.processing || editingCategoryId === null} className="rounded bg-emerald-600 px-3 py-2 text-sm font-semibold text-white disabled:opacity-60">บันทึก</button>
                            </DialogFooter>
                        </form>
                    </DialogContent>
                </Dialog>
            </div>
        </>
    );
}

ProductCategoriesIndex.layout = (props: { currentTeam?: { slug: string } | null }) => ({
    breadcrumbs: [{ title: 'จัดการประเภทสินค้า', href: props.currentTeam ? `/${props.currentTeam.slug}/backoffice/product-categories` : '/' }],
});
