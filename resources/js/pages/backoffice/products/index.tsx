import { Head, router, useForm, usePage } from '@inertiajs/react';
import { useState } from 'react';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import BackofficeHero from '@/pages/backoffice/components/backoffice-hero';
import PaginationLinks from '@/pages/backoffice/components/pagination-links';
import StatsStrip from '@/pages/backoffice/components/stats-strip';
import { backofficePath, boolLabel, canManageTeam } from '@/pages/backoffice/shared';
import type { Paginated, SharedPageProps } from '@/pages/backoffice/shared';

const MAX_UPLOAD_BYTES = 2 * 1024 * 1024;
const TARGET_UPLOAD_BYTES = Math.floor(MAX_UPLOAD_BYTES * 0.92);

async function fileToDataUrl(file: File): Promise<string> {
    return await new Promise((resolve, reject) => {
        const reader = new FileReader();

        reader.onload = () => resolve(String(reader.result ?? ''));
        reader.onerror = () => reject(new Error('ไม่สามารถอ่านไฟล์รูปภาพได้'));
        reader.readAsDataURL(file);
    });
}

async function loadImage(dataUrl: string): Promise<HTMLImageElement> {
    return await new Promise((resolve, reject) => {
        const image = new Image();

        image.onload = () => resolve(image);
        image.onerror = () => reject(new Error('ไม่สามารถประมวลผลรูปภาพได้'));
        image.src = dataUrl;
    });
}

async function canvasToFile(canvas: HTMLCanvasElement, quality: number): Promise<File> {
    return await new Promise((resolve, reject) => {
        canvas.toBlob((blob) => {
            if (!blob) {
                reject(new Error('ไม่สามารถบีบอัดรูปภาพได้'));

                return;
            }

            resolve(new File([blob], `product-${Date.now()}.jpg`, { type: 'image/jpeg' }));
        }, 'image/jpeg', quality);
    });
}

async function optimizeImageFile(file: File): Promise<File> {
    if (file.size <= TARGET_UPLOAD_BYTES) {
        return file;
    }

    const dataUrl = await fileToDataUrl(file);
    const image = await loadImage(dataUrl);

    const maxWidth = 1600;
    const widthRatio = image.width > maxWidth ? maxWidth / image.width : 1;
    const targetWidth = Math.max(1, Math.round(image.width * widthRatio));
    const targetHeight = Math.max(1, Math.round(image.height * widthRatio));

    const canvas = document.createElement('canvas');
    canvas.width = targetWidth;
    canvas.height = targetHeight;

    const ctx = canvas.getContext('2d');

    if (!ctx) {
        throw new Error('ไม่สามารถเตรียมรูปภาพเพื่ออัปโหลดได้');
    }

    ctx.drawImage(image, 0, 0, targetWidth, targetHeight);

    const qualities = [0.9, 0.82, 0.74, 0.66, 0.58, 0.5, 0.42];
    let compressed = await canvasToFile(canvas, qualities[qualities.length - 1]);

    for (const quality of qualities) {
        compressed = await canvasToFile(canvas, quality);

        if (compressed.size <= TARGET_UPLOAD_BYTES) {
            return compressed;
        }
    }

    if (compressed.size > MAX_UPLOAD_BYTES) {
        throw new Error('รูปภาพยังใหญ่เกิน 2MB หลังบีบอัด กรุณาลดขนาดไฟล์แล้วลองใหม่');
    }

    return compressed;
}

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
    const actionButtonBaseClass = 'rounded px-2 py-1 text-xs font-semibold transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-1';
    const createActivePreviewUrl = createPreviewUrls[createSlideIndex] ?? createPreviewUrls[0] ?? null;
    const editActivePreviewUrl = editPreviewUrls[editSlideIndex] ?? editPreviewUrls[0] ?? null;
    const editActivePreviewImage = editExistingImages[editSlideIndex] ?? null;

    return (
        <>
            <Head title="จัดการสินค้า" />
            <div className="space-y-6 bg-white p-4 text-slate-900 md:p-6">
                <BackofficeHero
                    title="จัดการสินค้า"
                    description="ดูแลข้อมูลสินค้า การเชื่อมหมวด แบรนด์ และสถานะการแสดงผลได้จากหน้าจอเดียว"
                />

                <StatsStrip cards={stats} />

                <form className="grid gap-3 rounded-2xl border border-slate-200 bg-white p-4 shadow-sm md:grid-cols-5" onSubmit={(event) => {
                    event.preventDefault();
                    const data = new FormData(event.currentTarget);
                    router.get(basePath, {
                        search: String(data.get('search') ?? ''),
                        category_id: Number(data.get('category_id') ?? 0),
                        sort_by: String(data.get('sort_by') ?? 'id'),
                        sort_dir: String(data.get('sort_dir') ?? 'desc'),
                    }, { preserveState: true, preserveScroll: true });
                }}>
                    <input name="search" defaultValue={props.filters.search} placeholder="ค้นหาสินค้า" className="rounded border border-slate-300 px-3 py-2 text-sm" />
                    <select name="category_id" defaultValue={String(props.filters.category_id ?? 0)} className="rounded border border-slate-300 px-3 py-2 text-sm"><option value="0">ทุกหมวด</option>{props.categories.map((c) => <option key={c.id} value={c.id}>{c.name}</option>)}</select>
                    <select name="sort_by" defaultValue={props.filters.sort_by} className="rounded border border-slate-300 px-3 py-2 text-sm"><option value="id">ล่าสุด</option><option value="name">ชื่อสินค้า</option><option value="price">ราคา</option></select>
                    <select name="sort_dir" defaultValue={props.filters.sort_dir} className="rounded border border-slate-300 px-3 py-2 text-sm"><option value="desc">มากไปน้อย</option><option value="asc">น้อยไปมาก</option></select>
                    <button type="submit" className="rounded-xl bg-slate-900 px-3 py-2 text-sm font-semibold text-white">กรองข้อมูล</button>
                </form>

                <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
                    <div className="mb-4 flex items-center justify-between">
                        <h2 className="text-base font-semibold text-slate-900">รายการสินค้า</h2>
                        {canManage && (
                            <button type="button" onClick={() => setIsCreateOpen(true)} className="rounded-xl bg-emerald-600 px-3 py-2 text-sm font-semibold text-white hover:bg-emerald-700">เพิ่มสินค้าใหม่</button>
                        )}
                    </div>
                    <div className="overflow-x-auto">
                        <table className="min-w-full divide-y divide-slate-200 text-sm">
                        <thead className="bg-slate-50"><tr><th className="px-3 py-2 text-left">รูปภาพ</th><th className="px-3 py-2 text-left">ชื่อสินค้า</th><th className="px-3 py-2 text-left">หมวดสินค้า</th><th className="px-3 py-2 text-left">แบรนด์</th><th className="px-3 py-2 text-left">ราคา</th><th className="px-3 py-2 text-left">สถานะ</th><th className="px-3 py-2 text-left">actions</th></tr></thead>
                        <tbody className="divide-y divide-slate-100">
                            {props.items.data.map((product) => (
                                <tr key={product.id}>
                                    <td className="px-3 py-2">
                                        {product.image_url ? (
                                            <div className="flex items-center gap-2">
                                                <img src={product.image_url} alt={product.name} className="h-12 w-12 rounded-lg border border-slate-200 object-cover" />
                                                {product.image_urls.length > 1 && (
                                                    <span className="rounded-full bg-slate-100 px-2 py-1 text-xs text-slate-600">+{product.image_urls.length - 1}</span>
                                                )}
                                            </div>
                                        ) : (
                                            <div className="flex h-12 w-12 items-center justify-center rounded-lg border border-dashed border-slate-300 text-xs text-slate-400">N/A</div>
                                        )}
                                    </td>
                                    <td className="px-3 py-2 font-medium text-slate-800">{product.name}</td>
                                    <td className="px-3 py-2">{product.category ?? '-'}</td>
                                    <td className="px-3 py-2">{product.brand ?? '-'}</td>
                                    <td className="px-3 py-2">{product.price ?? '-'}</td>
                                    <td className="px-3 py-2">{boolLabel(product.is_active)}</td>
                                    <td className="px-3 py-2">
                                        <div className="flex gap-2">
                                            {canManage ? (
                                                <>
                                                    <button type="button" onClick={() => {
 setEditingId(product.id); editForm.setData('name', product.name); editForm.setData('description', product.description ?? ''); editForm.setData('brand_id', product.brand_id); editForm.setData('product_category_id', product.product_category_id); editForm.setData('price', product.price ?? ''); editForm.setData('is_active', product.is_active); editForm.setData('images', []); editForm.setData('retained_image_ids', product.images.map((image) => image.id)); setEditExistingImages(product.images); setEditPreviewUrls(product.images.map((image) => image.url)); setEditSlideIndex(0); setIsEditOpen(true); 
}} className={`${actionButtonBaseClass} border border-sky-300 bg-sky-50 text-sky-700 hover:bg-sky-100 focus-visible:ring-sky-400`}>แก้ไข</button>
                                                    <button type="button" onClick={() => router.put(`${basePath}/${product.id}/toggle-active`, {}, { preserveScroll: true })} className={`${actionButtonBaseClass} ${product.is_active ? 'border border-amber-300 bg-amber-50 text-amber-800 hover:bg-amber-100 focus-visible:ring-amber-400' : 'border border-emerald-300 bg-emerald-50 text-emerald-700 hover:bg-emerald-100 focus-visible:ring-emerald-400'}`}>{product.is_active ? 'ปิดใช้งาน' : 'เปิดใช้งาน'}</button>
                                                    <button type="button" onClick={() => router.delete(`${basePath}/${product.id}`, { preserveScroll: true })} className={`${actionButtonBaseClass} border border-rose-300 bg-rose-50 text-rose-700 hover:bg-rose-100 focus-visible:ring-rose-400`}>ลบ</button>
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
                            <input value={createForm.data.name} onChange={(event) => createForm.setData('name', event.target.value)} placeholder="ชื่อสินค้า" className="rounded-xl border border-slate-300 px-3 py-2 text-sm" />
                            {createForm.errors.name && <p className="text-xs text-rose-600">{createForm.errors.name}</p>}

                            <div className="grid gap-2 md:grid-cols-2">
                                <select value={createForm.data.product_category_id} onChange={(event) => createForm.setData('product_category_id', Number(event.target.value))} className="rounded-xl border border-slate-300 px-3 py-2 text-sm">
                                    {props.categories.map((item) => <option key={item.id} value={item.id}>{item.name}</option>)}
                                </select>
                                <select value={createForm.data.brand_id ?? ''} onChange={(event) => createForm.setData('brand_id', event.target.value === '' ? null : Number(event.target.value))} className="rounded-xl border border-slate-300 px-3 py-2 text-sm">
                                    <option value="">ไม่ระบุแบรนด์</option>
                                    {props.brands.map((item) => <option key={item.id} value={item.id}>{item.name}</option>)}
                                </select>
                            </div>

                            <input value={createForm.data.price} onChange={(event) => createForm.setData('price', event.target.value)} placeholder="ราคา" className="rounded-xl border border-slate-300 px-3 py-2 text-sm" />
                            {createForm.errors.price && <p className="text-xs text-rose-600">{createForm.errors.price}</p>}

                            <textarea value={createForm.data.description} onChange={(event) => createForm.setData('description', event.target.value)} placeholder="รายละเอียดสินค้า" rows={5} className="rounded-xl border border-slate-300 px-3 py-2 text-sm" />
                            {createForm.errors.description && <p className="text-xs text-rose-600">{createForm.errors.description}</p>}

                            <div className="space-y-2">
                                <label htmlFor="product-create-image" className="text-sm font-semibold text-slate-700">รูปภาพสินค้า (เลือกได้หลายภาพ)</label>
                                <input
                                    id="product-create-image"
                                    type="file"
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
                                            const optimizedFiles = await Promise.all(files.map(async (file) => await optimizeImageFile(file)));
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
                                    className="block w-full rounded-xl border border-slate-300 bg-white px-3 py-2 text-sm file:mr-3 file:rounded-lg file:border-0 file:bg-slate-900 file:px-3 file:py-2 file:text-sm file:font-semibold file:text-white"
                                />
                                <p className="text-xs text-slate-500">รองรับไฟล์รูปภาพไม่เกิน 2MB และระบบจะช่วยบีบอัดก่อนอัปโหลด</p>
                                {createForm.errors.images && <p className="text-xs text-rose-600">{createForm.errors.images}</p>}
                            </div>

                            <label className="flex items-center gap-2 text-sm text-slate-700">
                                <input type="checkbox" checked={createForm.data.is_active} onChange={(event) => createForm.setData('is_active', event.target.checked)} />
                                เปิดใช้งานสินค้า
                            </label>

                            <DialogFooter className="justify-start">
                                <button type="submit" disabled={createForm.processing} className="rounded-xl bg-emerald-600 px-4 py-2 text-sm font-semibold text-white disabled:opacity-60">บันทึก</button>
                            </DialogFooter>
                        </form>
                            </div>

                            <aside className="flex flex-col gap-3 border-t border-slate-200 bg-slate-50 p-4 md:border-l md:border-t-0 md:p-5">
                                <p className="text-sm font-semibold text-slate-700">พรีวิวรูปภาพสินค้า</p>
                                {createPreviewUrls.length > 0 && createActivePreviewUrl ? (
                                <div className="space-y-2 overflow-hidden rounded-xl border border-slate-200 bg-white p-2">
                                    <div className="relative overflow-hidden rounded-lg bg-slate-50">
                                        <img src={createActivePreviewUrl} alt={`preview-${createSlideIndex + 1}`} className="h-56 w-full object-contain" />
                                        {createPreviewUrls.length > 1 && (
                                            <>
                                                <button
                                                    type="button"
                                                    onClick={() => setCreateSlideIndex((current) => (current - 1 + createPreviewUrls.length) % createPreviewUrls.length)}
                                                    className="absolute left-2 top-1/2 -translate-y-1/2 rounded-full bg-slate-900/70 px-2 py-1 text-sm font-bold text-white"
                                                >
                                                    {'<'}
                                                </button>
                                                <button
                                                    type="button"
                                                    onClick={() => setCreateSlideIndex((current) => (current + 1) % createPreviewUrls.length)}
                                                    className="absolute right-2 top-1/2 -translate-y-1/2 rounded-full bg-slate-900/70 px-2 py-1 text-sm font-bold text-white"
                                                >
                                                    {'>'}
                                                </button>
                                            </>
                                        )}
                                    </div>
                                    {createPreviewUrls.length > 1 && (
                                        <div className="flex items-center justify-between gap-2">
                                            <p className="text-xs text-slate-500">รูปที่ {createSlideIndex + 1} / {createPreviewUrls.length}</p>
                                            <div className="flex gap-1 overflow-x-auto">
                                                {createPreviewUrls.map((previewUrl, index) => (
                                                    <button
                                                        key={`${previewUrl}-${index}`}
                                                        type="button"
                                                        onClick={() => setCreateSlideIndex(index)}
                                                        className={`h-12 w-12 overflow-hidden rounded-md border ${index === createSlideIndex ? 'border-amber-500' : 'border-slate-200'}`}
                                                    >
                                                        <img src={previewUrl} alt={`thumb-${index + 1}`} className="h-full w-full object-cover" />
                                                    </button>
                                                ))}
                                            </div>
                                        </div>
                                    )}
                                </div>
                                ) : (
                                    <div className="flex h-56 items-center justify-center rounded-xl border border-dashed border-slate-300 bg-white text-sm text-slate-400">ยังไม่มีรูปที่เลือก</div>
                                )}
                            </aside>
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
                            <input value={editForm.data.name} onChange={(event) => editForm.setData('name', event.target.value)} placeholder="ชื่อสินค้า" className="rounded-xl border border-slate-300 px-3 py-2 text-sm" />
                            {editForm.errors.name && <p className="text-xs text-rose-600">{editForm.errors.name}</p>}

                            <div className="grid gap-2 md:grid-cols-2">
                                <select value={editForm.data.product_category_id} onChange={(event) => editForm.setData('product_category_id', Number(event.target.value))} className="rounded-xl border border-slate-300 px-3 py-2 text-sm">
                                    {props.categories.map((item) => <option key={item.id} value={item.id}>{item.name}</option>)}
                                </select>
                                <select value={editForm.data.brand_id ?? ''} onChange={(event) => editForm.setData('brand_id', event.target.value === '' ? null : Number(event.target.value))} className="rounded-xl border border-slate-300 px-3 py-2 text-sm">
                                    <option value="">ไม่ระบุแบรนด์</option>
                                    {props.brands.map((item) => <option key={item.id} value={item.id}>{item.name}</option>)}
                                </select>
                            </div>

                            <input value={editForm.data.price} onChange={(event) => editForm.setData('price', event.target.value)} placeholder="ราคา" className="rounded-xl border border-slate-300 px-3 py-2 text-sm" />
                            {editForm.errors.price && <p className="text-xs text-rose-600">{editForm.errors.price}</p>}

                            <textarea value={editForm.data.description} onChange={(event) => editForm.setData('description', event.target.value)} placeholder="รายละเอียดสินค้า" rows={5} className="rounded-xl border border-slate-300 px-3 py-2 text-sm" />

                            <div className="space-y-2">
                                <label htmlFor="product-edit-image" className="text-sm font-semibold text-slate-700">รูปภาพสินค้า (เลือกหลายภาพเพื่อแทนชุดเดิม)</label>
                                <input
                                    id="product-edit-image"
                                    type="file"
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
                                            const optimizedFiles = await Promise.all(files.map(async (file) => await optimizeImageFile(file)));
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
                                    className="block w-full rounded-xl border border-slate-300 bg-white px-3 py-2 text-sm file:mr-3 file:rounded-lg file:border-0 file:bg-slate-900 file:px-3 file:py-2 file:text-sm file:font-semibold file:text-white"
                                />
                                {editForm.errors.images && <p className="text-xs text-rose-600">{editForm.errors.images}</p>}
                            </div>

                            <label className="flex items-center gap-2 text-sm text-slate-700">
                                <input type="checkbox" checked={editForm.data.is_active} onChange={(event) => editForm.setData('is_active', event.target.checked)} />
                                เปิดใช้งานสินค้า
                            </label>

                            <DialogFooter className="justify-start">
                                <button type="submit" disabled={editForm.processing || editingId === null} className="rounded-xl bg-emerald-600 px-4 py-2 text-sm font-semibold text-white disabled:opacity-60">บันทึก</button>
                            </DialogFooter>
                        </form>
                            </div>

                            <aside className="flex flex-col gap-3 border-t border-slate-200 bg-slate-50 p-4 md:border-l md:border-t-0 md:p-5">
                                <p className="text-sm font-semibold text-slate-700">พรีวิวรูปภาพสินค้า</p>
                                {editPreviewUrls.length > 0 && editActivePreviewUrl ? (
                                <div className="space-y-2 overflow-hidden rounded-xl border border-slate-200 bg-white p-2">
                                    <div className="relative overflow-hidden rounded-lg bg-slate-50">
                                        <img src={editActivePreviewUrl} alt={`preview-${editSlideIndex + 1}`} className="h-56 w-full object-contain" />
                                        {editActivePreviewImage && (
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
                                        {editPreviewUrls.length > 1 && (
                                            <>
                                                <button
                                                    type="button"
                                                    onClick={() => setEditSlideIndex((current) => (current - 1 + editPreviewUrls.length) % editPreviewUrls.length)}
                                                    className="absolute left-2 top-1/2 -translate-y-1/2 rounded-full bg-slate-900/70 px-2 py-1 text-sm font-bold text-white"
                                                >
                                                    {'<'}
                                                </button>
                                                <button
                                                    type="button"
                                                    onClick={() => setEditSlideIndex((current) => (current + 1) % editPreviewUrls.length)}
                                                    className="absolute right-2 top-1/2 -translate-y-1/2 rounded-full bg-slate-900/70 px-2 py-1 text-sm font-bold text-white"
                                                >
                                                    {'>'}
                                                </button>
                                            </>
                                        )}
                                    </div>
                                    {editPreviewUrls.length > 1 && (
                                        <div className="flex items-center justify-between gap-2">
                                            <p className="text-xs text-slate-500">รูปที่ {editSlideIndex + 1} / {editPreviewUrls.length}</p>
                                            <div className="flex gap-1 overflow-x-auto">
                                                {editPreviewUrls.map((previewUrl, index) => (
                                                    <button
                                                        key={`${previewUrl}-${index}`}
                                                        type="button"
                                                        onClick={() => setEditSlideIndex(index)}
                                                        className={`h-12 w-12 overflow-hidden rounded-md border ${index === editSlideIndex ? 'border-amber-500' : 'border-slate-200'}`}
                                                    >
                                                        <img src={previewUrl} alt={`thumb-${index + 1}`} className="h-full w-full object-cover" />
                                                    </button>
                                                ))}
                                            </div>
                                        </div>
                                    )}
                                </div>
                                ) : (
                                    <div className="flex h-56 items-center justify-center rounded-xl border border-dashed border-slate-300 bg-white text-sm text-slate-400">ยังไม่มีรูปที่เลือก</div>
                                )}
                            </aside>
                        </div>
                    </DialogContent>
                </Dialog>
            </div>
        </>
    );
}

ProductsBackofficeIndex.layout = (props: { currentTeam?: { slug: string } | null }) => ({
    breadcrumbs: [{ title: 'จัดการสินค้า', href: props.currentTeam ? `/${props.currentTeam.slug}/backoffice/products` : '/' }],
});
