import { Head, router, useForm, usePage } from '@inertiajs/react';
import { useState } from 'react';
import { optimizeImageFile } from '@/lib/optimize-image-file';
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
    FieldHint,
    FieldLabel,
    FileInput,
    GhostButton,
    NoPermission,
    Panel,
    PanelForm,
    PrimaryButton,
    StatusBadge,
    TableBody,
    TableHead,
    Td,
    ToggleActiveButton,
    Tr,
    UploadProgress,
} from '@/pages/backoffice/components/ui-kit';
import { backofficePath, canManageTeam } from '@/pages/backoffice/shared';
import type { Paginated, SharedPageProps } from '@/pages/backoffice/shared';

type BannerRow = {
    id: number;
    desktop_image_path: string | null;
    image_url: string | null;
    is_active: boolean;
    created_at: string | null;
};

type PageProps = SharedPageProps & {
    items: Paginated<BannerRow>;
};

export default function BannersIndex() {
    const { props } = usePage<PageProps>();
    const teamSlug = props.currentTeam?.slug;
    const canManage = canManageTeam(props.currentTeam?.role);
    const [editingId, setEditingId] = useState<number | null>(null);
    const [previewUrl, setPreviewUrl] = useState<string | null>(null);

    const form = useForm({
        image: null as File | null,
    });

    if (!teamSlug) {
        return <div className="p-6">No current team selected.</div>;
    }

    const basePath = backofficePath(teamSlug, 'banners');
    const stats = [
        { label: 'แบนเนอร์ทั้งหมด', value: props.items.total },
        { label: 'เปิดใช้งาน', value: props.items.data.filter((banner) => banner.is_active).length },
        { label: 'ปิดใช้งาน', value: props.items.data.filter((banner) => !banner.is_active).length },
    ];

    return (
        <>
            <Head title="จัดการแบนเนอร์" />
            <BackofficePage>
                <BackofficeHero
                    title="จัดการแบนเนอร์ Relative"
                    description="อัปโหลดรูปเพื่อใช้แสดงในส่วน Relative บนหน้าเว็บไซต์ พร้อมควบคุมสถานะการใช้งานได้ทันที"
                />

                <StatsStrip cards={stats} />

                {canManage && (
                    <PanelForm className="space-y-4 md:p-5" onSubmit={(event) => {
                        event.preventDefault();

                        if (editingId === null) {
                            form.transform((data) => ({
                                image: data.image,
                            }));
                            form.post(basePath, {
                                preserveScroll: true,
                                forceFormData: true,
                                onSuccess: () => {
                                    setPreviewUrl(null);
                                    form.reset();
                                },
                                onFinish: () => form.transform((data) => data),
                            });

                            return;
                        }

                        form.transform((data) => ({
                            image: data.image,
                            _method: 'put',
                        }));
                        form.post(`${basePath}/${editingId}`, {
                            preserveScroll: true,
                            forceFormData: true,
                            onSuccess: () => {
                                setEditingId(null);
                                setPreviewUrl(null);
                                form.reset();
                            },
                            onFinish: () => form.transform((data) => data),
                        });
                    }}>
                        <div className="space-y-2">
                            <FieldLabel htmlFor="banner-image">อัปโหลดรูปแบนเนอร์</FieldLabel>
                            <FileInput
                                id="banner-image"
                                accept="image/*"
                                onChange={async (event) => {
                                    const file = event.target.files?.[0] ?? null;

                                    if (!file) {
                                        form.setData('image', null);
                                        setPreviewUrl(null);
                                        form.clearErrors('image');

                                        return;
                                    }

                                    try {
                                        const optimizedFile = await optimizeImageFile(file, { namePrefix: 'banner', maxWidth: 2400 });
                                        form.setData('image', optimizedFile);
                                        setPreviewUrl(URL.createObjectURL(optimizedFile));
                                        form.clearErrors('image');
                                    } catch (error) {
                                        form.setData('image', null);
                                        setPreviewUrl(null);
                                        form.setError('image', error instanceof Error ? error.message : 'ไม่สามารถเตรียมไฟล์อัปโหลดได้');
                                    }
                                }}
                            />
                            <FieldHint>รองรับไฟล์ไม่เกิน 2MB และระบบจะบีบอัดให้อัตโนมัติก่อนอัปโหลด</FieldHint>
                            <FieldHint>ขนาดแนะนำจากหน้าบ้าน: สัดส่วน 16:9 ที่ 1920x1080 px (หรือ 2400x1350 px สำหรับภาพคมชัดขึ้น)</FieldHint>
                            <FieldHint>หลีกเลี่ยงตัวอักษรชิดขอบภาพ เพราะหน้า Hero และการ์ด Relative จะมีการครอปตามอุปกรณ์</FieldHint>
                            <FieldError message={form.errors.image} />
                        </div>

                        {previewUrl && (
                            <div className="overflow-hidden rounded-xl border border-border">
                                <img src={previewUrl} alt="preview" className="h-52 w-full object-cover" />
                            </div>
                        )}

                        {form.progress && <UploadProgress percentage={form.progress.percentage ?? 0} />}

                        <div className="flex flex-wrap items-center gap-2">
                            <PrimaryButton type="submit" className="px-4" disabled={form.processing}>
                                {editingId === null ? 'เพิ่มรูปแบนเนอร์' : 'บันทึกการแก้ไข'}
                            </PrimaryButton>
                            {editingId !== null && (
                                <GhostButton
                                    onClick={() => {
                                        setEditingId(null);
                                        setPreviewUrl(null);
                                        form.reset();
                                        form.transform((data) => data);
                                        form.clearErrors();
                                    }}
                                >
                                    ยกเลิกแก้ไข
                                </GhostButton>
                            )}
                        </div>
                    </PanelForm>
                )}

                <Panel>
                    <DataTable>
                        <TableHead columns={['รูปภาพ', 'สถานะ', 'สร้างเมื่อ', 'จัดการ']} />
                        <TableBody>
                            {props.items.data.length === 0 && <EmptyRow colSpan={4}>ยังไม่มีแบนเนอร์</EmptyRow>}
                            {props.items.data.map((banner) => (
                                <Tr key={banner.id}>
                                    <Td>
                                        {banner.image_url ? (
                                            <div className="flex items-center gap-3">
                                                <img src={banner.image_url} alt="banner" className="h-14 w-24 rounded-lg object-cover" />
                                                <span className="max-w-[360px] truncate text-xs text-muted-foreground">{banner.desktop_image_path ?? '-'}</span>
                                            </div>
                                        ) : (
                                            '-'
                                        )}
                                    </Td>
                                    <Td><StatusBadge isActive={banner.is_active} /></Td>
                                    <Td className="text-muted-foreground">{banner.created_at ?? '-'}</Td>
                                    <Td>
                                        {canManage ? (
                                            <ActionGroup>
                                                <ActionButton
                                                    variant="edit"
                                                    onClick={() => {
                                                        setEditingId(banner.id);
                                                        form.setData('image', null);
                                                        form.transform((data) => data);
                                                        setPreviewUrl(banner.image_url ?? null);
                                                    }}
                                                >
                                                    แก้ไข
                                                </ActionButton>
                                                <ToggleActiveButton
                                                    isActive={banner.is_active}
                                                    onClick={() => router.put(`${basePath}/${banner.id}/toggle-active`, {}, { preserveScroll: true })}
                                                />
                                                <ActionButton
                                                    variant="danger"
                                                    onClick={() => router.post(`${basePath}/${banner.id}/delete`, {}, { preserveScroll: true })}
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

BannersIndex.layout = (props: { currentTeam?: { slug: string } | null }) => ({
    breadcrumbs: [{ title: 'จัดการแบนเนอร์', href: props.currentTeam ? `/${props.currentTeam.slug}/backoffice/banners` : '/' }],
});
