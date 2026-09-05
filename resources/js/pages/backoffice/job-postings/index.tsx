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
    TextArea,
    TextInput,
    ToggleActiveButton,
    Tr,
} from '@/pages/backoffice/components/ui-kit';
import { backofficePath, canManageTeam } from '@/pages/backoffice/shared';
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

    return (
        <>
            <Head title="ประกาศรับสมัครงาน" />
            <BackofficePage>
                <BackofficeHero
                    title="ประกาศรับสมัครงาน"
                    description="จัดการประกาศด้วยโครงง่าย อ่านไว: ตำแหน่ง, รายละเอียด และสถานะการใช้งาน"
                />

                <StatsStrip cards={stats} />

                <Panel>
                    <PanelHeader
                        title="ข้อมูลประกาศ"
                        action={canManage && (
                            <PrimaryButton onClick={() => setIsCreateOpen(true)}>เพิ่มประกาศรับสมัคร</PrimaryButton>
                        )}
                    />

                    <DataTable>
                        <TableHead columns={['ตำแหน่ง', 'จำนวนอัตรา', 'รายละเอียด', 'วันที่ประกาศ', 'สถานะ', 'จัดการ']} />
                        <TableBody>
                            {props.items.data.length === 0 && <EmptyRow colSpan={6}>ยังไม่มีประกาศรับสมัคร</EmptyRow>}
                            {props.items.data.map((posting) => (
                                <Tr key={posting.id}>
                                    <Td className="font-medium">{posting.title}</Td>
                                    <Td>{posting.positions_count}</Td>
                                    <Td className="max-w-md text-muted-foreground">{posting.description ?? '-'}</Td>
                                    <Td className="text-muted-foreground">{posting.published_at ?? '-'}</Td>
                                    <Td><StatusBadge isActive={posting.is_active} /></Td>
                                    <Td>
                                        {canManage ? (
                                            <ActionGroup>
                                                <ToggleActiveButton
                                                    isActive={posting.is_active}
                                                    onClick={() => router.put(`${basePath}/${posting.id}/toggle-active`, {}, { preserveScroll: true })}
                                                />
                                                <ActionButton
                                                    variant="edit"
                                                    onClick={() => {
                                                        setEditingId(posting.id);
                                                        editForm.setData('title', posting.title);
                                                        editForm.setData('description', posting.description ?? '');
                                                        editForm.setData('positions_count', String(posting.positions_count));
                                                        setIsEditOpen(true);
                                                    }}
                                                >
                                                    แก้ไข
                                                </ActionButton>
                                                <ActionButton
                                                    variant="danger"
                                                    onClick={() => router.delete(`${basePath}/${posting.id}`, { preserveScroll: true })}
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
                            <TextInput value={createForm.data.title} onChange={(event) => createForm.setData('title', event.target.value)} placeholder="ตำแหน่ง" />
                            <FieldError message={createForm.errors.title} />
                            <TextArea value={createForm.data.description} onChange={(event) => createForm.setData('description', event.target.value)} placeholder="รายละเอียด" rows={5} />
                            <FieldError message={createForm.errors.description} />
                            <DialogFooter>
                                <PrimaryButton type="submit" disabled={createForm.processing} className="px-4">บันทึก</PrimaryButton>
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
                            <TextInput value={editForm.data.title} onChange={(event) => editForm.setData('title', event.target.value)} placeholder="ตำแหน่ง" />
                            <FieldError message={editForm.errors.title} />
                            <TextArea value={editForm.data.description} onChange={(event) => editForm.setData('description', event.target.value)} placeholder="รายละเอียด" rows={5} />
                            <FieldError message={editForm.errors.description} />
                            <DialogFooter>
                                <PrimaryButton type="submit" disabled={editForm.processing || editingId === null} className="px-4">บันทึก</PrimaryButton>
                            </DialogFooter>
                        </form>
                    </DialogContent>
                </Dialog>
            </BackofficePage>
        </>
    );
}

JobPostingsIndex.layout = (props: { currentTeam?: { slug: string } | null }) => ({
    breadcrumbs: [{ title: 'ประกาศรับสมัครงาน', href: props.currentTeam ? `/${props.currentTeam.slug}/backoffice/job-postings` : '/' }],
});
