import { Head, router, useForm, usePage } from '@inertiajs/react';
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import BackofficeHero from '@/pages/backoffice/components/backoffice-hero';
import PaginationLinks from '@/pages/backoffice/components/pagination-links';
import StatsStrip from '@/pages/backoffice/components/stats-strip';
import {
    ActionButton,
    ActionGroup,
    BackofficePage,
    CheckboxField,
    DataTable,
    EmptyRow,
    Field,
    FieldError,
    FormSection,
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

            <BackofficePage>
                <BackofficeHero
                    title="จัดการผู้ใช้งาน"
                    description="สร้างและจัดการบัญชีผู้ใช้งาน ด้วยข้อมูล ชื่อ สกุล ตำแหน่ง และชื่อบัญชี"
                />

                <StatsStrip cards={stats} />

                <Panel>
                    <PanelHeader
                        title="ข้อมูลผู้ใช้งาน"
                        action={canManage && (
                            <PrimaryButton onClick={() => setIsCreateOpen(true)}>สร้างบัญชีผู้ใช้งาน</PrimaryButton>
                        )}
                    />

                    <DataTable>
                        <TableHead columns={['ชื่อ', 'สกุล', 'ตำแหน่ง', 'ชื่อบัญชี', 'สถานะ', 'การทำงาน']} />
                        <TableBody>
                            {props.items.data.length === 0 && <EmptyRow colSpan={6}>ยังไม่มีผู้ใช้งาน</EmptyRow>}
                            {props.items.data.map((member) => (
                                <Tr key={member.id}>
                                    <Td className="font-medium">{member.first_name ?? '-'}</Td>
                                    <Td className="font-medium">{member.last_name ?? '-'}</Td>
                                    <Td className="text-muted-foreground">{member.position ?? '-'}</Td>
                                    <Td className="text-muted-foreground">{member.username ?? '-'}</Td>
                                    <Td><StatusBadge isActive={member.is_active} /></Td>
                                    <Td>
                                        {canManage ? (
                                            <ActionGroup>
                                                <ToggleActiveButton
                                                    isActive={member.is_active}
                                                    onClick={() => router.put(`${basePath}/${member.id}/toggle-active`, {}, { preserveScroll: true })}
                                                />
                                                <ActionButton variant="edit" onClick={() => startEdit(member)}>แก้ไข</ActionButton>
                                                <ActionButton
                                                    variant="disable"
                                                    onClick={() => {
                                                        resetPasswordForm.setData('password', 'password123');
                                                        resetPasswordForm.put(`${basePath}/${member.id}/reset-password`, { preserveScroll: true });
                                                    }}
                                                >
                                                    รีเซ็ตรหัสผ่าน
                                                </ActionButton>
                                                <ActionButton
                                                    variant="danger"
                                                    onClick={() => router.delete(`${basePath}/${member.id}`, { preserveScroll: true })}
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

                    <div className="mt-4">
                        <PaginationLinks links={props.items.links} />
                    </div>
                </Panel>

                <Dialog open={isCreateOpen} onOpenChange={setIsCreateOpen}>
                    <DialogContent className="w-[96vw] max-w-3xl">
                        <DialogHeader>
                            <DialogTitle className="text-xl font-black">สร้างบัญชีผู้ใช้งาน</DialogTitle>
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
                                <FormSection title="ข้อมูลผู้ใช้งาน">
                                    <Field label="ชื่อ" error={createForm.errors.first_name}>
                                        <TextInput value={createForm.data.first_name} onChange={(event) => createForm.setData('first_name', event.target.value)} placeholder="เช่น สมชาย" />
                                    </Field>
                                    <Field label="สกุล" error={createForm.errors.last_name}>
                                        <TextInput value={createForm.data.last_name} onChange={(event) => createForm.setData('last_name', event.target.value)} placeholder="เช่น ใจดี" />
                                    </Field>
                                    <Field label="ตำแหน่ง" error={createForm.errors.position}>
                                        <TextInput value={createForm.data.position} onChange={(event) => createForm.setData('position', event.target.value)} placeholder="เช่น Sales Manager" />
                                    </Field>
                                </FormSection>

                                <FormSection title="ข้อมูลเข้าสู่ระบบ">
                                    <Field label="ชื่อบัญชี" error={createForm.errors.username}>
                                        <TextInput value={createForm.data.username} onChange={(event) => createForm.setData('username', event.target.value)} placeholder="เช่น somchai.admin" />
                                    </Field>
                                    <Field label="รหัสผ่าน" error={createForm.errors.password}>
                                        <TextInput type="password" value={createForm.data.password} onChange={(event) => createForm.setData('password', event.target.value)} placeholder="อย่างน้อย 8 ตัวอักษร" />
                                    </Field>
                                    <Field label="ยืนยันรหัสผ่าน" error={createForm.errors.password_confirmation}>
                                        <TextInput type="password" value={createForm.data.password_confirmation} onChange={(event) => createForm.setData('password_confirmation', event.target.value)} placeholder="กรอกรหัสผ่านอีกครั้ง" />
                                    </Field>
                                </FormSection>
                            </div>

                            <div className="rounded-xl border border-border bg-card px-4 py-3">
                                <CheckboxField
                                    label="เปิดใช้งานบัญชีทันทีหลังบันทึก"
                                    className="font-medium"
                                    checked={createForm.data.is_active}
                                    onChange={(event) => createForm.setData('is_active', event.target.checked)}
                                />
                            </div>

                            <DialogFooter className="gap-2">
                                <Button type="button" variant="outline" onClick={() => setIsCreateOpen(false)}>
                                    ยกเลิก
                                </Button>
                                <PrimaryButton type="submit" disabled={createForm.processing} className="px-4">
                                    บันทึกผู้ใช้งาน
                                </PrimaryButton>
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
                            <TextInput value={editForm.data.first_name} onChange={(event) => editForm.setData('first_name', event.target.value)} placeholder="ชื่อ" />
                            <FieldError message={editForm.errors.first_name} />
                            <TextInput value={editForm.data.last_name} onChange={(event) => editForm.setData('last_name', event.target.value)} placeholder="สกุล" />
                            <FieldError message={editForm.errors.last_name} />
                            <TextInput value={editForm.data.position} onChange={(event) => editForm.setData('position', event.target.value)} placeholder="ตำแหน่ง" />
                            <FieldError message={editForm.errors.position} />
                            <TextInput value={editForm.data.username} onChange={(event) => editForm.setData('username', event.target.value)} placeholder="ชื่อบัญชี" />
                            <FieldError message={editForm.errors.username} />
                            <CheckboxField
                                label="เปิดใช้งาน"
                                checked={editForm.data.is_active}
                                onChange={(event) => editForm.setData('is_active', event.target.checked)}
                            />
                            <DialogFooter>
                                <Button type="submit" disabled={editForm.processing || editingId === null}>บันทึกการแก้ไข</Button>
                            </DialogFooter>
                        </form>
                    </DialogContent>
                </Dialog>
            </BackofficePage>
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
