import { Head, router, useForm, usePage } from '@inertiajs/react';
import BackofficeHero from '@/pages/backoffice/components/backoffice-hero';
import PaginationLinks from '@/pages/backoffice/components/pagination-links';
import StatsStrip from '@/pages/backoffice/components/stats-strip';
import {
    ActionButton,
    ActionGroup,
    BackofficePage,
    DataTable,
    EmptyRow,
    NoPermission,
    Panel,
    PanelForm,
    SecondaryButton,
    SelectInput,
    TableBody,
    TableHead,
    Td,
    TextBadge,
    TextInput,
    Tr,
} from '@/pages/backoffice/components/ui-kit';
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

    return (
        <>
            <Head title="ผู้สมัครงาน" />
            <BackofficePage>
                <BackofficeHero
                    title="ผู้สมัครงาน"
                    description="ติดตามผู้สมัคร ปรับสถานะ และดูข้อมูลติดต่อแบบอ่านง่ายในหน้าเดียว"
                />

                <StatsStrip cards={stats} />

                <PanelForm className="grid gap-3 md:grid-cols-4" onSubmit={(event) => {
                    event.preventDefault();
                    const data = new FormData(event.currentTarget);
                    router.get(basePath, {
                        search: String(data.get('search') ?? ''),
                        status: String(data.get('status') ?? ''),
                        sort_dir: String(data.get('sort_dir') ?? 'desc'),
                    }, { preserveState: true, preserveScroll: true });
                }}>
                    <TextInput name="search" defaultValue={props.filters.search} placeholder="ค้นหาผู้สมัคร" />
                    <TextInput name="status" defaultValue={props.filters.status} placeholder="สถานะ เช่น new" />
                    <SelectInput name="sort_dir" defaultValue={props.filters.sort_dir}>
                        <option value="desc">ใหม่ไปเก่า</option>
                        <option value="asc">เก่าไปใหม่</option>
                    </SelectInput>
                    <SecondaryButton type="submit">กรองข้อมูล</SecondaryButton>
                </PanelForm>

                <Panel>
                    <DataTable>
                        <TableHead columns={['ชื่อ', 'ตำแหน่ง', 'อีเมล', 'สถานะ', 'จัดการ']} />
                        <TableBody>
                            {props.items.data.length === 0 && <EmptyRow colSpan={5}>ยังไม่มีใบสมัคร</EmptyRow>}
                            {props.items.data.map((application) => (
                                <Tr key={application.id}>
                                    <Td className="font-medium">{application.full_name}</Td>
                                    <Td className="text-muted-foreground">{application.position ?? '-'}</Td>
                                    <Td className="text-muted-foreground">{application.email}</Td>
                                    <Td><TextBadge>{application.status}</TextBadge></Td>
                                    <Td>
                                        {canManage ? (
                                            <ActionGroup>
                                                <ActionButton
                                                    variant="edit"
                                                    onClick={() => {
                                                        updateForm.setData('status', 'reviewed');
                                                        updateForm.setData('review_notes', 'Reviewed by admin');
                                                        updateForm.put(`${basePath}/${application.id}`, { preserveScroll: true });
                                                    }}
                                                >
                                                    Mark reviewed
                                                </ActionButton>
                                                <ActionButton
                                                    variant="danger"
                                                    onClick={() => router.delete(`${basePath}/${application.id}`, { preserveScroll: true })}
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

JobApplicationsIndex.layout = (props: { currentTeam?: { slug: string } | null }) => ({
    breadcrumbs: [{ title: 'ผู้สมัครงาน', href: props.currentTeam ? `/${props.currentTeam.slug}/backoffice/job-applications` : '/' }],
});
