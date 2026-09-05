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
    CheckboxField,
    DataTable,
    EmptyRow,
    FieldError,
    FieldHint,
    FieldLabel,
    FileInput,
    ImageThumb,
    NoPermission,
    Panel,
    PanelForm,
    PanelHeader,
    PrimaryButton,
    SecondaryButton,
    SelectInput,
    StatusBadge,
    TableBody,
    TableHead,
    Td,
    TextArea,
    TextBadge,
    TextInput,
    ToggleActiveButton,
    Tr,
} from '@/pages/backoffice/components/ui-kit';
import PreviewGallery from '@/pages/backoffice/products/preview-gallery';
import { backofficePath, canManageTeam } from '@/pages/backoffice/shared';
import type { Paginated, SharedPageProps } from '@/pages/backoffice/shared';

const productImageOptions = { namePrefix: 'product', maxWidth: 1600 };

type OptionItem = { id: number; name: string };
type ProductImageItem = { id: number; url: string };

type ProductRow = {
    id: number;
    name: string;
    brand_id: number | null;
    product_category_id: number;
    description: string | null;
    brand: string | null;
    category: string | null;
    price: string | null;
    thumbnail_path: string | null;
    image_url: string | null;
    image_urls: string[];
    images: ProductImageItem[];
    is_active: boolean;
    created_at: string | null;
};

type PageProps = SharedPageProps & {
    filters: { search: string; category_id: number; sort_by: string; sort_dir: string };
    categories: OptionItem[];
    brands: OptionItem[];
    items: Paginated<ProductRow>;
};

export default function ProductsBackofficeIndex() {
    const { props } = usePage<PageProps>();
    const teamSlug = props.currentTeam?.slug;
    const canManage = canManageTeam(props.currentTeam?.role);
    const [isCreateOpen, setIsCreateOpen] = useState(false);
    const [isEditOpen, setIsEditOpen] = useState(false);
    const [editingId, setEditingId] = useState<number | null>(null);
    const [createPreviewUrls, setCreatePreviewUrls] = useState<string[]>([]);
    const [editPreviewUrls, setEditPreviewUrls] = useState<string[]>([]);
    const [editExistingImages, setEditExistingImages] = useState<ProductImageItem[]>([]);
    const [createSlideIndex, setCreateSlideIndex] = useState(0);
    const [editSlideIndex, setEditSlideIndex] = useState(0);

    const createForm = useForm({
        name: '',
        description: '',
        brand_id: null as number | null,
        product_category_id: props.categories[0]?.id ?? 0,
        price: '',
        images: [] as File[],
        is_active: true,
    });

    const editForm = useForm({
        name: '',
        description: '',
        brand_id: null as number | null,
        product_category_id: props.categories[0]?.id ?? 0,
        price: '',
        images: [] as File[],
        retained_image_ids: [] as number[],
        is_active: true,
    });

    if (!teamSlug) {
        return <div className="p-6">No current team selected.</div>;
    }

    const basePath = backofficePath(teamSlug, 'products');
    const stats = [
        { label: 'สินค้าทั้งหมด', value: props.items.total },
        { label: 'เปิดใช้งาน', value: props.items.data.filter((product) => product.is_active).length },
        { label: 'ปิดใช้งาน', value: props.items.data.filter((product) => !product.is_active).length },
    ];
    const editActivePreviewImage = editExistingImages[editSlideIndex] ?? null;

    return (
        <>
            <Head title="จัดการสินค้า" />
            <BackofficePage>
                <BackofficeHero
                    title="จัดการสินค้า"
                    description="ดูแลข้อมูลสินค้า การเชื่อมหมวด แบรนด์ และสถานะการแสดงผลได้จากหน้าจอเดียว"
                />

                <StatsStrip cards={stats} />

                <PanelForm className="grid gap-3 md:grid-cols-5" onSubmit={(event) => {
                    event.preventDefault();
                    const data = new FormData(event.currentTarget);
                    router.get(basePath, {
                        search: String(data.get('search') ?? ''),
                        category_id: Number(data.get('category_id') ?? 0),
                        sort_by: String(data.get('sort_by') ?? 'id'),
                        sort_dir: String(data.get('sort_dir') ?? 'desc'),
                    }, { preserveState: true, preserveScroll: true });
                }}>
                    <TextInput name="search" defaultValue={props.filters.search} placeholder="ค้นหาสินค้า" />
                    <SelectInput name="category_id" defaultValue={String(props.filters.category_id ?? 0)}>
                        <option value="0">ทุกหมวด</option>
                        {props.categories.map((category) => <option key={category.id} value={category.id}>{category.name}</option>)}
                    </SelectInput>
                    <SelectInput name="sort_by" defaultValue={props.filters.sort_by}>
                        <option value="id">ล่าสุด</option>
                        <option value="name">ชื่อสินค้า</option>
                        <option value="price">ราคา</option>
                    </SelectInput>
                    <SelectInput name="sort_dir" defaultValue={props.filters.sort_dir}>
                        <option value="desc">มากไปน้อย</option>
                        <option value="asc">น้อยไปมาก</option>
                    </SelectInput>
                    <SecondaryButton type="submit">กรองข้อมูล</SecondaryButton>
                </PanelForm>

                <Panel>
                    <PanelHeader
                        title="รายการสินค้า"
                        action={canManage && (
                            <PrimaryButton onClick={() => setIsCreateOpen(true)}>เพิ่มสินค้าใหม่</PrimaryButton>
                        )}
                    />

                    <DataTable>
                        <TableHead columns={['รูปภาพ', 'ชื่อสินค้า', 'หมวดสินค้า', 'แบรนด์', 'ราคา', 'สถานะ', 'จัดการ']} />
                        <TableBody>
                            {props.items.data.length === 0 && <EmptyRow colSpan={7}>ยังไม่มีสินค้า</EmptyRow>}
                            {props.items.data.map((product) => (
                                <Tr key={product.id}>
                                    <Td>
                                        <div className="flex items-center gap-2">
                                            <ImageThumb src={product.image_url} alt={product.name} />
                                            {product.image_urls.length > 1 && (
                                                <TextBadge>+{product.image_urls.length - 1}</TextBadge>
                                            )}
                                        </div>
                                    </Td>
                                    <Td className="font-medium">{product.name}</Td>
                                    <Td className="text-muted-foreground">{product.category ?? '-'}</Td>
                                    <Td className="text-muted-foreground">{product.brand ?? '-'}</Td>
                                    <Td>{product.price ?? '-'}</Td>
                                    <Td><StatusBadge isActive={product.is_active} /></Td>
                                    <Td>
                                        {canManage ? (
                                            <ActionGroup>
                                                <ActionButton
                                                    variant="edit"
                                                    onClick={() => {
                                                        setEditingId(product.id);
                                                        editForm.setData('name', product.name);
                                                        editForm.setData('description', product.description ?? '');
                                                        editForm.setData('brand_id', product.brand_id);
                                                        editForm.setData('product_category_id', product.product_category_id);
                                                        editForm.setData('price', product.price ?? '');
                                                        editForm.setData('is_active', product.is_active);
                                                        editForm.setData('images', []);
                                                        editForm.setData('retained_image_ids', product.images.map((image) => image.id));
                                                        setEditExistingImages(product.images);
                                                        setEditPreviewUrls(product.images.map((image) => image.url));
                                                        setEditSlideIndex(0);
                                                        setIsEditOpen(true);
                                                    }}
                                                >
                                                    แก้ไข
                                                </ActionButton>
                                                <ToggleActiveButton
                                                    isActive={product.is_active}
                                                    onClick={() => router.put(`${basePath}/${product.id}/toggle-active`, {}, { preserveScroll: true })}
                                                />
                                                <ActionButton
                                                    variant="danger"
                                                    onClick={() => router.delete(`${basePath}/${product.id}`, { preserveScroll: true })}
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
                        setCreatePreviewUrls([]);
                        setCreateSlideIndex(0);
                    }
                }}>
                    <DialogContent className="w-[96vw] !max-w-[min(96vw,1120px)] max-h-[92vh] overflow-hidden p-0">
                        <div className="grid h-full max-h-[92vh] grid-cols-1 md:grid-cols-[minmax(0,1fr)_360px]">
                            <div className="overflow-y-auto p-6 md:p-7">
                                <DialogHeader>
                                    <DialogTitle>เพิ่มสินค้า</DialogTitle>
                                    <DialogDescription>เพิ่มสินค้าใหม่ด้วยข้อมูลหลักที่จำเป็นต่อการขายและการแสดงผล</DialogDescription>
                                </DialogHeader>
                                <form className="mt-4 grid gap-4" onSubmit={(event) => {
                                    event.preventDefault();
                                    createForm.transform((data) => ({
                                        name: data.name,
                                        description: data.description,
                                        brand_id: data.brand_id,
                                        product_category_id: data.product_category_id,
                                        price: data.price,
                                        images: data.images,
                                        is_active: data.is_active,
                                    }));
                                    createForm.post(basePath, {
                                        preserveScroll: true,
                                        forceFormData: true,
                                        onSuccess: () => {
                                            setIsCreateOpen(false);
                                            setCreatePreviewUrls([]);
                                            setCreateSlideIndex(0);
                                            createForm.reset();
                                        },
                                        onFinish: () => createForm.transform((data) => data),
                                    });
                                }}>
                                    <TextInput value={createForm.data.name} onChange={(event) => createForm.setData('name', event.target.value)} placeholder="ชื่อสินค้า" />
                                    <FieldError message={createForm.errors.name} />

                                    <div className="grid gap-2 md:grid-cols-2">
                                        <SelectInput value={createForm.data.product_category_id} onChange={(event) => createForm.setData('product_category_id', Number(event.target.value))}>
                                            {props.categories.map((item) => <option key={item.id} value={item.id}>{item.name}</option>)}
                                        </SelectInput>
                                        <SelectInput value={createForm.data.brand_id ?? ''} onChange={(event) => createForm.setData('brand_id', event.target.value === '' ? null : Number(event.target.value))}>
                                            <option value="">ไม่ระบุแบรนด์</option>
                                            {props.brands.map((item) => <option key={item.id} value={item.id}>{item.name}</option>)}
                                        </SelectInput>
                                    </div>

                                    <TextInput value={createForm.data.price} onChange={(event) => createForm.setData('price', event.target.value)} placeholder="ราคา" />
                                    <FieldError message={createForm.errors.price} />

                                    <TextArea value={createForm.data.description} onChange={(event) => createForm.setData('description', event.target.value)} placeholder="รายละเอียดสินค้า" rows={5} />
                                    <FieldError message={createForm.errors.description} />

                                    <div className="space-y-2">
                                        <FieldLabel htmlFor="product-create-image">รูปภาพสินค้า (เลือกได้หลายภาพ)</FieldLabel>
                                        <FileInput
                                            id="product-create-image"
                                            multiple
                                            accept="image/*"
                                            onChange={async (event) => {
                                                const files = Array.from(event.target.files ?? []);

                                                if (files.length === 0) {
                                                    createForm.setData('images', []);
                                                    setCreatePreviewUrls([]);
                                                    setCreateSlideIndex(0);
                                                    createForm.clearErrors('images');

                                                    return;
                                                }

                                                try {
                                                    const optimizedFiles = await Promise.all(files.map(async (file) => await optimizeImageFile(file, productImageOptions)));
                                                    createForm.setData('images', optimizedFiles);
                                                    setCreatePreviewUrls(optimizedFiles.map((file) => URL.createObjectURL(file)));
                                                    setCreateSlideIndex(0);
                                                    createForm.clearErrors('images');
                                                } catch (error) {
                                                    createForm.setData('images', []);
                                                    setCreatePreviewUrls([]);
                                                    setCreateSlideIndex(0);
                                                    createForm.setError('images', error instanceof Error ? error.message : 'ไม่สามารถเตรียมไฟล์อัปโหลดได้');
                                                }
                                            }}
                                        />
                                        <FieldHint>รองรับไฟล์รูปภาพไม่เกิน 2MB และระบบจะช่วยบีบอัดก่อนอัปโหลด</FieldHint>
                                        <FieldError message={createForm.errors.images} />
                                    </div>

                                    <CheckboxField
                                        label="เปิดใช้งานสินค้า"
                                        checked={createForm.data.is_active}
                                        onChange={(event) => createForm.setData('is_active', event.target.checked)}
                                    />

                                    <DialogFooter className="justify-start">
                                        <PrimaryButton type="submit" disabled={createForm.processing} className="px-4">บันทึก</PrimaryButton>
                                    </DialogFooter>
                                </form>
                            </div>

                            <PreviewGallery
                                previewUrls={createPreviewUrls}
                                slideIndex={createSlideIndex}
                                onSlideChange={setCreateSlideIndex}
                            />
                        </div>
                    </DialogContent>
                </Dialog>

                <Dialog open={isEditOpen} onOpenChange={(open) => {
                    setIsEditOpen(open);

                    if (!open) {
                        setEditingId(null);
                        editForm.reset();
                        editForm.clearErrors();
                        setEditPreviewUrls([]);
                        setEditExistingImages([]);
                        setEditSlideIndex(0);
                    }
                }}>
                    <DialogContent className="w-[96vw] !max-w-[min(96vw,1120px)] max-h-[92vh] overflow-hidden p-0">
                        <div className="grid h-full max-h-[92vh] grid-cols-1 md:grid-cols-[minmax(0,1fr)_360px]">
                            <div className="overflow-y-auto p-6 md:p-7">
                                <DialogHeader>
                                    <DialogTitle>แก้ไขสินค้า</DialogTitle>
                                    <DialogDescription>แก้ไขหมวด แบรนด์ รูปภาพ ราคา และรายละเอียดสินค้า</DialogDescription>
                                </DialogHeader>
                                <form className="mt-4 grid gap-4" onSubmit={(event) => {
                                    event.preventDefault();

                                    if (editingId === null) {
                                        return;
                                    }

                                    editForm.transform((data) => ({
                                        name: data.name,
                                        description: data.description,
                                        brand_id: data.brand_id,
                                        product_category_id: data.product_category_id,
                                        price: data.price,
                                        images: data.images,
                                        retained_image_ids: data.retained_image_ids,
                                        is_active: data.is_active,
                                        _method: 'put',
                                    }));
                                    editForm.post(`${basePath}/${editingId}`, {
                                        preserveScroll: true,
                                        forceFormData: true,
                                        onSuccess: () => {
                                            setIsEditOpen(false);
                                            setEditingId(null);
                                            editForm.reset();
                                            setEditPreviewUrls([]);
                                            setEditExistingImages([]);
                                            setEditSlideIndex(0);
                                        },
                                        onFinish: () => editForm.transform((data) => data),
                                    });
                                }}>
                                    <TextInput value={editForm.data.name} onChange={(event) => editForm.setData('name', event.target.value)} placeholder="ชื่อสินค้า" />
                                    <FieldError message={editForm.errors.name} />

                                    <div className="grid gap-2 md:grid-cols-2">
                                        <SelectInput value={editForm.data.product_category_id} onChange={(event) => editForm.setData('product_category_id', Number(event.target.value))}>
                                            {props.categories.map((item) => <option key={item.id} value={item.id}>{item.name}</option>)}
                                        </SelectInput>
                                        <SelectInput value={editForm.data.brand_id ?? ''} onChange={(event) => editForm.setData('brand_id', event.target.value === '' ? null : Number(event.target.value))}>
                                            <option value="">ไม่ระบุแบรนด์</option>
                                            {props.brands.map((item) => <option key={item.id} value={item.id}>{item.name}</option>)}
                                        </SelectInput>
                                    </div>

                                    <TextInput value={editForm.data.price} onChange={(event) => editForm.setData('price', event.target.value)} placeholder="ราคา" />
                                    <FieldError message={editForm.errors.price} />

                                    <TextArea value={editForm.data.description} onChange={(event) => editForm.setData('description', event.target.value)} placeholder="รายละเอียดสินค้า" rows={5} />

                                    <div className="space-y-2">
                                        <FieldLabel htmlFor="product-edit-image">รูปภาพสินค้า (เลือกหลายภาพเพื่อแทนชุดเดิม)</FieldLabel>
                                        <FileInput
                                            id="product-edit-image"
                                            multiple
                                            accept="image/*"
                                            onChange={async (event) => {
                                                const files = Array.from(event.target.files ?? []);

                                                if (files.length === 0) {
                                                    editForm.setData('images', []);
                                                    setEditPreviewUrls(editExistingImages.map((image) => image.url));
                                                    setEditSlideIndex(0);
                                                    editForm.clearErrors('images');

                                                    return;
                                                }

                                                try {
                                                    const optimizedFiles = await Promise.all(files.map(async (file) => await optimizeImageFile(file, productImageOptions)));
                                                    editForm.setData('images', optimizedFiles);
                                                    setEditPreviewUrls([...editExistingImages.map((image) => image.url), ...optimizedFiles.map((file) => URL.createObjectURL(file))]);
                                                    setEditSlideIndex(0);
                                                    editForm.clearErrors('images');
                                                } catch (error) {
                                                    editForm.setData('images', []);
                                                    setEditPreviewUrls(editExistingImages.map((image) => image.url));
                                                    setEditSlideIndex(0);
                                                    editForm.setError('images', error instanceof Error ? error.message : 'ไม่สามารถเตรียมไฟล์อัปโหลดได้');
                                                }
                                            }}
                                        />
                                        <FieldError message={editForm.errors.images} />
                                    </div>

                                    <CheckboxField
                                        label="เปิดใช้งานสินค้า"
                                        checked={editForm.data.is_active}
                                        onChange={(event) => editForm.setData('is_active', event.target.checked)}
                                    />

                                    <DialogFooter className="justify-start">
                                        <PrimaryButton type="submit" disabled={editForm.processing || editingId === null} className="px-4">บันทึก</PrimaryButton>
                                    </DialogFooter>
                                </form>
                            </div>

                            <PreviewGallery
                                previewUrls={editPreviewUrls}
                                slideIndex={editSlideIndex}
                                onSlideChange={setEditSlideIndex}
                                overlay={editActivePreviewImage && (
                                    <button
                                        type="button"
                                        onClick={() => {
                                            const removeIndex = editSlideIndex;

                                            const nextExistingImages = editExistingImages.filter((_, index) => index !== removeIndex);
                                            const existingCount = editExistingImages.length;

                                            setEditExistingImages(nextExistingImages);
                                            editForm.setData('retained_image_ids', nextExistingImages.map((image) => image.id));

                                            if (removeIndex >= existingCount) {
                                                const newImageIndex = removeIndex - existingCount;
                                                const nextFiles = editForm.data.images.filter((_, index) => index !== newImageIndex);
                                                editForm.setData('images', nextFiles);
                                            }

                                            const nextPreviewUrls = editPreviewUrls.filter((_, index) => index !== removeIndex);
                                            setEditPreviewUrls(nextPreviewUrls);

                                            if (nextPreviewUrls.length === 0) {
                                                setEditSlideIndex(0);
                                            } else if (removeIndex >= nextPreviewUrls.length) {
                                                setEditSlideIndex(nextPreviewUrls.length - 1);
                                            }
                                        }}
                                        className="absolute right-2 top-2 rounded bg-rose-600 px-2 py-1 text-xs font-semibold text-white hover:bg-rose-700"
                                    >
                                        ลบรูปนี้
                                    </button>
                                )}
                            />
                        </div>
                    </DialogContent>
                </Dialog>
            </BackofficePage>
        </>
    );
}

ProductsBackofficeIndex.layout = (props: { currentTeam?: { slug: string } | null }) => ({
    breadcrumbs: [{ title: 'จัดการสินค้า', href: props.currentTeam ? `/${props.currentTeam.slug}/backoffice/products` : '/' }],
});
