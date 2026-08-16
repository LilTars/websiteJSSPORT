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

            resolve(new File([blob], `brand-${Date.now()}.jpg`, { type: 'image/jpeg' }));
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
    const actionButtonBaseClass = 'rounded px-2 py-1 text-xs font-semibold transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-1';

    return (
        <>
            <Head title="จัดการแบร์นสินค้า" />

            <div className="space-y-6 bg-white p-4 text-slate-900 md:p-6">
                <BackofficeHero
                    title="จัดการแบร์นสินค้า"
                    description="เก็บชื่อและรูปภาพแบร์นเป็นก้อนข้อมูลเดียว พร้อมจัดการสถานะการใช้งานได้ทันที"
                />

                <StatsStrip cards={stats} />

                <section className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
                    <div className="mb-4 flex items-center justify-between">
                        <h2 className="text-base font-semibold text-slate-900">รายการแบร์นสินค้า</h2>
                        {canManage && (
                            <button
                                type="button"
                                onClick={() => setIsCreateOpen(true)}
                                className="rounded-xl bg-emerald-600 px-3 py-2 text-sm font-semibold text-white transition hover:bg-emerald-700"
                            >
                                เพิ่มแบร์นสินค้า
                            </button>
                        )}
                    </div>

                    <div className="overflow-x-auto">
                        <table className="min-w-full divide-y divide-slate-200 text-sm">
                            <thead className="bg-slate-50">
                                <tr>
                                    <th className="px-3 py-2 text-left">รูปภาพ</th>
                                    <th className="px-3 py-2 text-left">ชื่อแบร์น</th>
                                    <th className="px-3 py-2 text-left">วันที่บันทึก</th>
                                    <th className="px-3 py-2 text-left">สถานะ</th>
                                    <th className="px-3 py-2 text-left">actions</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-slate-100">
                                {props.items.data.map((brand) => (
                                    <tr key={brand.id}>
                                        <td className="px-3 py-2">
                                            {brand.image_url ? (
                                                <img src={brand.image_url} alt={brand.name} className="h-12 w-12 rounded-lg border border-slate-200 object-cover" />
                                            ) : (
                                                <div className="flex h-12 w-12 items-center justify-center rounded-lg border border-dashed border-slate-300 text-xs text-slate-400">N/A</div>
                                            )}
                                        </td>
                                        <td className="px-3 py-2 font-medium text-slate-800">{brand.name}</td>
                                        <td className="px-3 py-2 text-slate-600">{brand.created_at ?? '-'}</td>
                                        <td className="px-3 py-2">
                                            <span className={`rounded-full px-2.5 py-1 text-xs font-semibold ${brand.is_active ? 'bg-emerald-100 text-emerald-700' : 'bg-slate-200 text-slate-700'}`}>
                                                {boolLabel(brand.is_active)}
                                            </span>
                                        </td>
                                        <td className="px-3 py-2">
                                            <div className="flex gap-2">
                                                {canManage ? (
                                                    <>
                                                        <button
                                                            type="button"
                                                            onClick={() => {
                                                                setEditingBrandId(brand.id);
                                                                editForm.setData('name', brand.name);
                                                                editForm.setData('image', null);
                                                                setEditPreviewUrl(brand.image_url);
                                                                setIsEditOpen(true);
                                                            }}
                                                            className={`${actionButtonBaseClass} border border-sky-300 bg-sky-50 text-sky-700 hover:bg-sky-100 focus-visible:ring-sky-400`}
                                                        >
                                                            แก้ไข
                                                        </button>
                                                        <button
                                                            type="button"
                                                            onClick={() => router.put(`${basePath}/${brand.id}/toggle-active`, {}, { preserveScroll: true })}
                                                            className={`${actionButtonBaseClass} ${brand.is_active
                                                                ? 'border border-amber-300 bg-amber-50 text-amber-800 hover:bg-amber-100 focus-visible:ring-amber-400'
                                                                : 'border border-emerald-300 bg-emerald-50 text-emerald-700 hover:bg-emerald-100 focus-visible:ring-emerald-400'
                                                            }`}
                                                        >
                                                            {brand.is_active ? 'ปิดใช้งาน' : 'เปิดใช้งาน'}
                                                        </button>
                                                        <button
                                                            type="button"
                                                            onClick={() => router.delete(`${basePath}/${brand.id}`, { preserveScroll: true })}
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
                </section>

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
                            <input
                                value={createForm.data.name}
                                onChange={(event) => createForm.setData('name', event.target.value)}
                                placeholder="ชื่อแบร์นสินค้า"
                                className="rounded-lg border border-slate-300 px-3 py-2 text-sm"
                            />
                            {createForm.errors.name && <p className="text-xs text-rose-600">{createForm.errors.name}</p>}

                            <div className="space-y-2">
                                <label htmlFor="brand-create-image" className="text-sm font-semibold text-slate-700">รูปภาพแบร์น</label>
                                <input
                                    id="brand-create-image"
                                    type="file"
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
                                            const optimizedFile = await optimizeImageFile(file);
                                            createForm.setData('image', optimizedFile);
                                            setCreatePreviewUrl(URL.createObjectURL(optimizedFile));
                                            createForm.clearErrors('image');
                                        } catch (error) {
                                            createForm.setData('image', null);
                                            setCreatePreviewUrl(null);
                                            createForm.setError('image', error instanceof Error ? error.message : 'ไม่สามารถเตรียมไฟล์อัปโหลดได้');
                                        }
                                    }}
                                    className="block w-full rounded-xl border border-slate-300 bg-white px-3 py-2 text-sm file:mr-3 file:rounded-lg file:border-0 file:bg-slate-900 file:px-3 file:py-2 file:text-sm file:font-semibold file:text-white"
                                />
                                <p className="text-xs text-slate-500">รองรับไฟล์ไม่เกิน 2MB ระบบจะบีบอัดรูปให้อัตโนมัติก่อนอัปโหลด</p>
                                {createForm.errors.image && <p className="text-xs text-rose-600">{createForm.errors.image}</p>}
                            </div>

                            {createPreviewUrl && (
                                <div className="overflow-hidden rounded-xl border border-slate-200">
                                    <img src={createPreviewUrl} alt="preview" className="h-44 w-full object-contain bg-slate-50" />
                                </div>
                            )}

                            {createForm.progress && (
                                <div className="h-2 overflow-hidden rounded-full bg-slate-100">
                                    <div className="h-full bg-emerald-500 transition-all" style={{ width: `${createForm.progress.percentage}%` }} />
                                </div>
                            )}

                            <DialogFooter>
                                <button type="submit" disabled={createForm.processing} className="rounded bg-emerald-600 px-3 py-2 text-sm font-semibold text-white disabled:opacity-60">บันทึก</button>
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
                            <input
                                value={editForm.data.name}
                                onChange={(event) => editForm.setData('name', event.target.value)}
                                placeholder="ชื่อแบร์นสินค้า"
                                className="rounded-lg border border-slate-300 px-3 py-2 text-sm"
                            />
                            {editForm.errors.name && <p className="text-xs text-rose-600">{editForm.errors.name}</p>}

                            <div className="space-y-2">
                                <label htmlFor="brand-edit-image" className="text-sm font-semibold text-slate-700">รูปภาพแบร์น (ไม่เปลี่ยนก็ได้)</label>
                                <input
                                    id="brand-edit-image"
                                    type="file"
                                    accept="image/*"
                                    onChange={async (event) => {
                                        const file = event.target.files?.[0] ?? null;

                                        if (!file) {
                                            editForm.setData('image', null);
                                            editForm.clearErrors('image');

                                            return;
                                        }

                                        try {
                                            const optimizedFile = await optimizeImageFile(file);
                                            editForm.setData('image', optimizedFile);
                                            setEditPreviewUrl(URL.createObjectURL(optimizedFile));
                                            editForm.clearErrors('image');
                                        } catch (error) {
                                            editForm.setData('image', null);
                                            editForm.setError('image', error instanceof Error ? error.message : 'ไม่สามารถเตรียมไฟล์อัปโหลดได้');
                                        }
                                    }}
                                    className="block w-full rounded-xl border border-slate-300 bg-white px-3 py-2 text-sm file:mr-3 file:rounded-lg file:border-0 file:bg-slate-900 file:px-3 file:py-2 file:text-sm file:font-semibold file:text-white"
                                />
                                <p className="text-xs text-slate-500">รองรับไฟล์ไม่เกิน 2MB ระบบจะบีบอัดรูปให้อัตโนมัติก่อนอัปโหลด</p>
                                {editForm.errors.image && <p className="text-xs text-rose-600">{editForm.errors.image}</p>}
                            </div>

                            {editPreviewUrl && (
                                <div className="overflow-hidden rounded-xl border border-slate-200">
                                    <img src={editPreviewUrl} alt="preview" className="h-44 w-full object-contain bg-slate-50" />
                                </div>
                            )}

                            {editForm.progress && (
                                <div className="h-2 overflow-hidden rounded-full bg-slate-100">
                                    <div className="h-full bg-emerald-500 transition-all" style={{ width: `${editForm.progress.percentage}%` }} />
                                </div>
                            )}

                            <DialogFooter>
                                <button type="submit" disabled={editForm.processing || editingBrandId === null} className="rounded bg-emerald-600 px-3 py-2 text-sm font-semibold text-white disabled:opacity-60">บันทึก</button>
                            </DialogFooter>
                        </form>
                    </DialogContent>
                </Dialog>
            </div>
        </>
    );
}

BrandsIndex.layout = (props: { currentTeam?: { slug: string } | null }) => ({
    breadcrumbs: [{ title: 'จัดการแบร์นสินค้า', href: props.currentTeam ? `/${props.currentTeam.slug}/backoffice/brands` : '/' }],
});
