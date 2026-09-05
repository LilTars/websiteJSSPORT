import { Head, router, useForm, usePage } from '@inertiajs/react';
import { useState } from 'react';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
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
    ImageThumb,
    NoPermission,
    Panel,
    PanelHeader,
    PreviewFrame,
    PrimaryButton,
    StatusBadge,
    TableBody,
    TableHead,
    Td,
    TextInput,
    ToggleActiveButton,
    Tr,
    UploadProgress,
} from '@/pages/backoffice/components/ui-kit';
import { backofficePath, canManageTeam } from '@/pages/backoffice/shared';
import type { Paginated, SharedPageProps } from '@/pages/backoffice/shared';

const brandImageOptions = { namePrefix: 'brand', maxWidth: 1600 };

type BrandRow = {
    id: number;
    name: string;
    image_path: string | null;
    image_url: string | null;
    is_active: boolean;
    created_at: string | null;
};

type PageProps = SharedPageProps & {
    items: Paginated<BrandRow>;
};

export default function BrandsIndex() {
    const { props } = usePage<PageProps>();
    const teamSlug = props.currentTeam?.slug;
    const canManage = canManageTeam(props.currentTeam?.role);
    const [isCreateOpen, setIsCreateOpen] = useState(false);
    const [isEditOpen, setIsEditOpen] = useState(false);
    const [editingBrandId, setEditingBrandId] = useState<number | null>(null);
    const [createPreviewUrl, setCreatePreviewUrl] = useState<string | null>(null);
    const [editPreviewUrl, setEditPreviewUrl] = useState<string | null>(null);

    const createForm = useForm({
        name: '',
        image: null as File | null,
    });

    const editForm = useForm({
        name: '',
        image: null as File | null,
    });

    if (!teamSlug) {
        return <div className="p-6">No current team selected.</div>;
    }

    const basePath = backofficePath(teamSlug, 'brands');
    const stats = [
        { label: 'แบร์นทั้งหมด', value: props.items.total },
        { label: 'เปิดใช้งาน', value: props.items.data.filter((brand) => brand.is_active).length },
        { label: 'ปิดใช้งาน', value: props.items.data.filter((brand) => !brand.is_active).length },
    ];

    return (
        <>
            <Head title="จัดการแบร์นสินค้า" />

            <BackofficePage>
                <BackofficeHero
                    title="จัดการแบร์นสินค้า"
                    description="เก็บชื่อและรูปภาพแบร์นเป็นก้อนข้อมูลเดียว พร้อมจัดการสถานะการใช้งานได้ทันที"
                />

                <StatsStrip cards={stats} />

                <Panel>
                    <PanelHeader
                        title="รายการแบร์นสินค้า"
                        action={canManage && (
                            <PrimaryButton onClick={() => setIsCreateOpen(true)}>เพิ่มแบร์นสินค้า</PrimaryButton>
                        )}
                    />

                    <DataTable>
                        <TableHead columns={['รูปภาพ', 'ชื่อแบร์น', 'วันที่บันทึก', 'สถานะ', 'จัดการ']} />
                        <TableBody>
                            {props.items.data.length === 0 && <EmptyRow colSpan={5}>ยังไม่มีแบร์นสินค้า</EmptyRow>}
                            {props.items.data.map((brand) => (
                                <Tr key={brand.id}>
                                    <Td><ImageThumb src={brand.image_url} alt={brand.name} /></Td>
                                    <Td className="font-medium">{brand.name}</Td>
                                    <Td className="text-muted-foreground">{brand.created_at ?? '-'}</Td>
                                    <Td><StatusBadge isActive={brand.is_active} /></Td>
                                    <Td>
                                        {canManage ? (
                                            <ActionGroup>
                                                <ActionButton
                                                    variant="edit"
                                                    onClick={() => {
                                                        setEditingBrandId(brand.id);
                                                        editForm.setData('name', brand.name);
                                                        editForm.setData('image', null);
                                                        setEditPreviewUrl(brand.image_url);
                                                        setIsEditOpen(true);
                                                    }}
                                                >
                                                    แก้ไข
                                                </ActionButton>
                                                <ToggleActiveButton
                                                    isActive={brand.is_active}
                                                    onClick={() => router.put(`${basePath}/${brand.id}/toggle-active`, {}, { preserveScroll: true })}
                                                />
                                                <ActionButton
                                                    variant="danger"
                                                    onClick={() => router.delete(`${basePath}/${brand.id}`, { preserveScroll: true })}
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

                <Dialog open={isCreateOpen} onOpenChange={(open) => {
                    setIsCreateOpen(open);

                    if (!open) {
                        createForm.reset();
                        createForm.clearErrors();
                        setCreatePreviewUrl(null);
                    }
                }}>
                    <DialogContent>
                        <DialogHeader>
                            <DialogTitle>เพิ่มแบร์นสินค้า</DialogTitle>
                            <DialogDescription>กรอกชื่อแบร์นและใส่รูปภาพโลโก้เพื่อใช้งานบนระบบหลังบ้าน</DialogDescription>
                        </DialogHeader>
                        <form className="grid gap-3" onSubmit={(event) => {
                            event.preventDefault();
                            createForm.transform((data) => ({
                                name: data.name,
                                image: data.image,
                            }));
                            createForm.post(basePath, {
                                preserveScroll: true,
                                forceFormData: true,
                                onSuccess: () => {
                                    setIsCreateOpen(false);
                                    setCreatePreviewUrl(null);
                                    createForm.reset();
                                },
                                onFinish: () => createForm.transform((data) => data),
                            });
                        }}>
                            <TextInput
                                value={createForm.data.name}
                                onChange={(event) => createForm.setData('name', event.target.value)}
                                placeholder="ชื่อแบร์นสินค้า"
                            />
                            <FieldError message={createForm.errors.name} />

                            <div className="space-y-2">
                                <FieldLabel htmlFor="brand-create-image">รูปภาพแบร์น</FieldLabel>
                                <FileInput
                                    id="brand-create-image"
                                    accept="image/*"
                                    onChange={async (event) => {
                                        const file = event.target.files?.[0] ?? null;

                                        if (!file) {
                                            createForm.setData('image', null);
                                            setCreatePreviewUrl(null);
                                            createForm.clearErrors('image');

                                            return;
                                        }

                                        try {
                                            const optimizedFile = await optimizeImageFile(file, brandImageOptions);
                                            createForm.setData('image', optimizedFile);
                                            setCreatePreviewUrl(URL.createObjectURL(optimizedFile));
                                            createForm.clearErrors('image');
                                        } catch (error) {
                                            createForm.setData('image', null);
                                            setCreatePreviewUrl(null);
                                            createForm.setError('image', error instanceof Error ? error.message : 'ไม่สามารถเตรียมไฟล์อัปโหลดได้');
                                        }
                                    }}
                                />
                                <FieldHint>รองรับไฟล์ไม่เกิน 2MB ระบบจะบีบอัดรูปให้อัตโนมัติก่อนอัปโหลด</FieldHint>
                                <FieldError message={createForm.errors.image} />
                            </div>

                            {createPreviewUrl && (
                                <PreviewFrame>
                                    <img src={createPreviewUrl} alt="preview" className="h-44 w-full bg-muted object-contain" />
                                </PreviewFrame>
                            )}

                            {createForm.progress && <UploadProgress percentage={createForm.progress.percentage ?? 0} />}

                            <DialogFooter>
                                <PrimaryButton type="submit" disabled={createForm.processing}>บันทึก</PrimaryButton>
                            </DialogFooter>
                        </form>
                    </DialogContent>
                </Dialog>

                <Dialog open={isEditOpen} onOpenChange={(open) => {
                    setIsEditOpen(open);

                    if (!open) {
                        editForm.reset();
                        editForm.clearErrors();
                        setEditingBrandId(null);
                        setEditPreviewUrl(null);
                    }
                }}>
                    <DialogContent>
                        <DialogHeader>
                            <DialogTitle>แก้ไขแบร์นสินค้า</DialogTitle>
                            <DialogDescription>อัปเดตชื่อหรือรูปภาพแบร์นได้ทันที</DialogDescription>
                        </DialogHeader>
                        <form className="grid gap-3" onSubmit={(event) => {
                            event.preventDefault();

                            if (editingBrandId === null) {
                                return;
                            }

                            editForm.transform((data) => ({
                                name: data.name,
                                image: data.image,
                                _method: 'put',
                            }));
                            editForm.post(`${basePath}/${editingBrandId}`, {
                                preserveScroll: true,
                                forceFormData: true,
                                onSuccess: () => {
                                    setIsEditOpen(false);
                                    setEditingBrandId(null);
                                    setEditPreviewUrl(null);
                                    editForm.reset();
                                },
                                onFinish: () => editForm.transform((data) => data),
                            });
                        }}>
                            <TextInput
                                value={editForm.data.name}
                                onChange={(event) => editForm.setData('name', event.target.value)}
                                placeholder="ชื่อแบร์นสินค้า"
                            />
                            <FieldError message={editForm.errors.name} />

                            <div className="space-y-2">
                                <FieldLabel htmlFor="brand-edit-image">รูปภาพแบร์น (ไม่เปลี่ยนก็ได้)</FieldLabel>
                                <FileInput
                                    id="brand-edit-image"
                                    accept="image/*"
                                    onChange={async (event) => {
                                        const file = event.target.files?.[0] ?? null;

                                        if (!file) {
                                            editForm.setData('image', null);
                                            editForm.clearErrors('image');

                                            return;
                                        }

                                        try {
                                            const optimizedFile = await optimizeImageFile(file, brandImageOptions);
                                            editForm.setData('image', optimizedFile);
                                            setEditPreviewUrl(URL.createObjectURL(optimizedFile));
                                            editForm.clearErrors('image');
                                        } catch (error) {
                                            editForm.setData('image', null);
                                            editForm.setError('image', error instanceof Error ? error.message : 'ไม่สามารถเตรียมไฟล์อัปโหลดได้');
                                        }
                                    }}
                                />
                                <FieldHint>รองรับไฟล์ไม่เกิน 2MB ระบบจะบีบอัดรูปให้อัตโนมัติก่อนอัปโหลด</FieldHint>
                                <FieldError message={editForm.errors.image} />
                            </div>

                            {editPreviewUrl && (
                                <PreviewFrame>
                                    <img src={editPreviewUrl} alt="preview" className="h-44 w-full bg-muted object-contain" />
                                </PreviewFrame>
                            )}

                            {editForm.progress && <UploadProgress percentage={editForm.progress.percentage ?? 0} />}

                            <DialogFooter>
                                <PrimaryButton type="submit" disabled={editForm.processing || editingBrandId === null}>บันทึก</PrimaryButton>
                            </DialogFooter>
                        </form>
                    </DialogContent>
                </Dialog>
            </BackofficePage>
        </>
    );
}

BrandsIndex.layout = (props: { currentTeam?: { slug: string } | null }) => ({
    breadcrumbs: [{ title: 'จัดการแบร์นสินค้า', href: props.currentTeam ? `/${props.currentTeam.slug}/backoffice/brands` : '/' }],
});
