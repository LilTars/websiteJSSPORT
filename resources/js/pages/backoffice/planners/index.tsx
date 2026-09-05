import { Head, router, useForm, usePage } from '@inertiajs/react';
import { useState } from 'react';
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
    NoPermission,
    Panel,
    PanelForm,
    PrimaryButton,
    SecondaryButton,
    SelectInput,
    StatusBadge,
    TableBody,
    TableHead,
    Td,
    TextInput,
    Tr,
} from '@/pages/backoffice/components/ui-kit';
import { backofficePath, canManageTeam } from '@/pages/backoffice/shared';
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

    return (
        <>
            <Head title="จัดการพลาสเนอร์" />
            <BackofficePage>
                <BackofficeHero
                    title="จัดการพลาสเนอร์"
                    description="จัดการข้อมูลผู้ประสานงานผลิตงานให้ครบทั้งรายละเอียดติดต่อและสถานะการใช้งาน"
                />

                <StatsStrip cards={stats} />

                <PanelForm className="grid gap-3 md:grid-cols-3" onSubmit={(event) => {
                    event.preventDefault();
                    const data = new FormData(event.currentTarget);
                    router.get(basePath, {
                        search: String(data.get('search') ?? ''),
                        sort_dir: String(data.get('sort_dir') ?? 'asc'),
                    }, { preserveState: true, preserveScroll: true });
                }}>
                    <TextInput name="search" defaultValue={props.filters.search} placeholder="ค้นหาพลาสเนอร์" />
                    <SelectInput name="sort_dir" defaultValue={props.filters.sort_dir}>
                        <option value="asc">A-Z</option>
                        <option value="desc">Z-A</option>
                    </SelectInput>
                    <SecondaryButton type="submit">กรองข้อมูล</SecondaryButton>
                </PanelForm>

                {canManage && (
                    <PanelForm className="grid gap-2 md:grid-cols-2" onSubmit={(event) => {
                        event.preventDefault();

                        if (editingId === null) {
                            form.post(basePath, { preserveScroll: true });
                        } else {
                            form.put(`${basePath}/${editingId}`, { preserveScroll: true });
                        }
                    }}>
                        <TextInput value={form.data.name} onChange={(event) => form.setData('name', event.target.value)} placeholder="ชื่อพลาสเนอร์" />
                        <TextInput value={form.data.slug} onChange={(event) => form.setData('slug', event.target.value)} placeholder="slug" />
                        <TextInput value={form.data.contact_name} onChange={(event) => form.setData('contact_name', event.target.value)} placeholder="ชื่อผู้ติดต่อ" />
                        <TextInput value={form.data.phone} onChange={(event) => form.setData('phone', event.target.value)} placeholder="เบอร์โทร" />
                        <TextInput value={form.data.email} onChange={(event) => form.setData('email', event.target.value)} placeholder="อีเมล" />
                        <TextInput value={form.data.line_id} onChange={(event) => form.setData('line_id', event.target.value)} placeholder="LINE ID" />
                        <CheckboxField
                            label="เปิดใช้งาน"
                            checked={form.data.is_active}
                            onChange={(event) => form.setData('is_active', event.target.checked)}
                        />
                        <PrimaryButton type="submit" disabled={form.processing}>{editingId === null ? 'เพิ่มพลาสเนอร์' : 'บันทึกการแก้ไข'}</PrimaryButton>
                    </PanelForm>
                )}

                <Panel>
                    <DataTable>
                        <TableHead columns={['ชื่อพลาสเนอร์', 'ผู้ติดต่อ', 'เบอร์โทร', 'สถานะ', 'จัดการ']} />
                        <TableBody>
                            {props.items.data.length === 0 && <EmptyRow colSpan={5} />}
                            {props.items.data.map((planner) => (
                                <Tr key={planner.id}>
                                    <Td className="font-medium">{planner.name}</Td>
                                    <Td className="text-muted-foreground">{planner.contact_name ?? '-'}</Td>
                                    <Td className="text-muted-foreground">{planner.phone ?? '-'}</Td>
                                    <Td><StatusBadge isActive={planner.is_active} /></Td>
                                    <Td>
                                        {canManage ? (
                                            <ActionGroup>
                                                <ActionButton
                                                    variant="edit"
                                                    onClick={() => {
                                                        setEditingId(planner.id);
                                                        form.setData('name', planner.name);
                                                        form.setData('slug', planner.slug);
                                                        form.setData('contact_name', planner.contact_name ?? '');
                                                        form.setData('phone', planner.phone ?? '');
                                                        form.setData('email', planner.email ?? '');
                                                        form.setData('is_active', planner.is_active);
                                                        form.setData('sort_order', planner.sort_order);
                                                    }}
                                                >
                                                    แก้ไข
                                                </ActionButton>
                                                <ActionButton
                                                    variant="danger"
                                                    onClick={() => router.delete(`${basePath}/${planner.id}`, { preserveScroll: true })}
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
            </BackofficePage>
        </>
    );
}

PlannersIndex.layout = (props: { currentTeam?: { slug: string } | null }) => ({
    breadcrumbs: [{ title: 'จัดการพลาสเนอร์', href: props.currentTeam ? `/${props.currentTeam.slug}/backoffice/planners` : '/' }],
});
