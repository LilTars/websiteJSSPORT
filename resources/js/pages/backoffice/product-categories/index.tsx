import { Head, router, useForm, usePage } from '@inertiajs/react';
import { useState } from 'react';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import BackofficeHero from '@/pages/backoffice/components/backoffice-hero';
import PaginationLinks from '@/pages/backoffice/components/pagination-links';
import StatsStrip from '@/pages/backoffice/components/stats-strip';
import {
    ActionButton,
    ActionGroup,
    BackofficePage,
    DataTable,
    EmptyRow,
    FieldError,
    NoPermission,
    Panel,
    PanelHeader,
    PrimaryButton,
    StatusBadge,
    TableBody,
    TableHead,
    Td,
    TextInput,
    ToggleActiveButton,
    Tr,
} from '@/pages/backoffice/components/ui-kit';
import { backofficePath, canManageTeam } from '@/pages/backoffice/shared';
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

    return (
        <>
            <Head title="จัดการประเภทสินค้า" />
            <BackofficePage>
                <BackofficeHero
                    title="จัดการประเภทสินค้า"
                    description="ควบคุมหมวดสินค้าให้เป็นระเบียบ พร้อมปรับสถานะการใช้งานแต่ละหมวดได้ทันที"
                />

                <StatsStrip cards={stats} />

                <Panel>
                    <PanelHeader
                        title="รายการประเภทสินค้า"
                        action={canManage && (
                            <PrimaryButton onClick={() => setIsCreateOpen(true)}>เพิ่มประเภทสินค้า</PrimaryButton>
                        )}
                    />

                    <DataTable>
                        <TableHead columns={['ชื่อประเภท', 'วันที่บันทึก', 'สถานะ', 'จัดการ']} />
                        <TableBody>
                            {props.items.data.length === 0 && <EmptyRow colSpan={4} />}
                            {props.items.data.map((category) => (
                                <Tr key={category.id}>
                                    <Td className="font-medium">{category.name}</Td>
                                    <Td className="text-muted-foreground">{category.created_at ?? '-'}</Td>
                                    <Td><StatusBadge isActive={category.is_active} /></Td>
                                    <Td>
                                        {canManage ? (
                                            <ActionGroup>
                                                <ActionButton
                                                    variant="edit"
                                                    onClick={() => {
                                                        setEditingCategoryId(category.id);
                                                        editForm.setData('name', category.name);
                                                        setIsEditOpen(true);
                                                    }}
                                                >
                                                    แก้ไข
                                                </ActionButton>
                                                <ToggleActiveButton
                                                    isActive={category.is_active}
                                                    onClick={() => router.put(`${basePath}/${category.id}/toggle-active`, {}, { preserveScroll: true })}
                                                />
                                                <ActionButton
                                                    variant="danger"
                                                    onClick={() => router.delete(`${basePath}/${category.id}`, { preserveScroll: true })}
                                                >
                                                    ลบ
                                                </ActionButton>
                                            </ActionGroup>
                                        ) : (
                                            <NoPermission />
                                        )}
                                    </Td>
                                </Tr>
                            ))}
                        </TableBody>
                    </DataTable>

                    <div className="mt-4"><PaginationLinks links={props.items.links} /></div>
                </Panel>

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
                            <TextInput value={createForm.data.name} onChange={(event) => createForm.setData('name', event.target.value)} placeholder="ชื่อประเภทสินค้า" />
                            <FieldError message={createForm.errors.name} />
                            <DialogFooter>
                                <PrimaryButton type="submit" disabled={createForm.processing}>บันทึก</PrimaryButton>
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
                            <TextInput value={editForm.data.name} onChange={(event) => editForm.setData('name', event.target.value)} placeholder="ชื่อประเภทสินค้า" />
                            <FieldError message={editForm.errors.name} />
                            <DialogFooter>
                                <PrimaryButton type="submit" disabled={editForm.processing || editingCategoryId === null}>บันทึก</PrimaryButton>
                            </DialogFooter>
                        </form>
                    </DialogContent>
                </Dialog>
            </BackofficePage>
        </>
    );
}

ProductCategoriesIndex.layout = (props: { currentTeam?: { slug: string } | null }) => ({
    breadcrumbs: [{ title: 'จัดการประเภทสินค้า', href: props.currentTeam ? `/${props.currentTeam.slug}/backoffice/product-categories` : '/' }],
});
