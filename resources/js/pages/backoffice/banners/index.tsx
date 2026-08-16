import { Head, router, useForm, usePage } from '@inertiajs/react';
import { useState } from 'react';
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

            resolve(new File([blob], `banner-${Date.now()}.jpg`, { type: 'image/jpeg' }));
        }, 'image/jpeg', quality);
    });
}

async function optimizeImageFile(file: File): Promise<File> {
    if (file.size <= TARGET_UPLOAD_BYTES) {
        return file;
    }

    const dataUrl = await fileToDataUrl(file);
    const image = await loadImage(dataUrl);

    const maxWidth = 2400;
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
    const actionButtonBaseClass = 'rounded px-2 py-1 text-xs font-semibold transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-1';

    return (
        <>
            <Head title="จัดการแบนเนอร์" />
            <div className="space-y-6 bg-white p-4 text-slate-900 md:p-6">
                <BackofficeHero
                    title="จัดการแบนเนอร์ Relative"
                    description="อัปโหลดรูปเพื่อใช้แสดงในส่วน Relative บนหน้าเว็บไซต์ พร้อมควบคุมสถานะการใช้งานได้ทันที"
                />

                <StatsStrip cards={stats} />

                {canManage && (
                    <form className="space-y-4 rounded-2xl border border-slate-200 bg-white p-4 shadow-sm md:p-5" onSubmit={(event) => {
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
                            <div className="space-y-2">
                                <label htmlFor="banner-image" className="text-sm font-semibold text-slate-700">อัปโหลดรูปแบนเนอร์</label>
                                <input
                                    id="banner-image"
                                    type="file"
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
                                            const optimizedFile = await optimizeImageFile(file);
                                            form.setData('image', optimizedFile);
                                            setPreviewUrl(URL.createObjectURL(optimizedFile));
                                            form.clearErrors('image');
                                        } catch (error) {
                                            form.setData('image', null);
                                            setPreviewUrl(null);
                                            form.setError('image', error instanceof Error ? error.message : 'ไม่สามารถเตรียมไฟล์อัปโหลดได้');
                                        }
                                    }}
                                    className="block w-full rounded-xl border border-slate-300 bg-white px-3 py-2 text-sm file:mr-3 file:rounded-lg file:border-0 file:bg-slate-900 file:px-3 file:py-2 file:text-sm file:font-semibold file:text-white"
                                />
                                <p className="text-xs text-slate-500">รองรับไฟล์ไม่เกิน 2MB และระบบจะบีบอัดให้อัตโนมัติก่อนอัปโหลด</p>
                                <p className="text-xs text-slate-500">ขนาดแนะนำจากหน้าบ้าน: สัดส่วน 16:9 ที่ 1920x1080 px (หรือ 2400x1350 px สำหรับภาพคมชัดขึ้น)</p>
                                <p className="text-xs text-slate-500">หลีกเลี่ยงตัวอักษรชิดขอบภาพ เพราะหน้า Hero และการ์ด Relative จะมีการครอปตามอุปกรณ์</p>
                                {form.errors.image && <p className="text-xs text-rose-600">{form.errors.image}</p>}
                            </div>
                        </div>

                        {previewUrl && (
                            <div className="overflow-hidden rounded-xl border border-slate-200">
                                <img src={previewUrl} alt="preview" className="h-52 w-full object-cover" />
                            </div>
                        )}

                        {form.progress && (
                            <div className="h-2 overflow-hidden rounded-full bg-slate-100">
                                <div className="h-full bg-emerald-500 transition-all" style={{ width: `${form.progress.percentage}%` }} />
                            </div>
                        )}

                        <div className="flex flex-wrap items-center gap-2">
                            <button type="submit" className="rounded-xl bg-emerald-600 px-4 py-2 text-sm font-semibold text-white disabled:opacity-60" disabled={form.processing}>
                                {editingId === null ? 'เพิ่มรูปแบนเนอร์' : 'บันทึกการแก้ไข'}
                            </button>
                            {editingId !== null && (
                                <button
                                    type="button"
                                    onClick={() => {
                                        setEditingId(null);
                                        setPreviewUrl(null);
                                        form.reset();
                                        form.transform((data) => data);
                                        form.clearErrors();
                                    }}
                                    className="rounded-xl border border-slate-300 px-3 py-2 text-sm"
                                >
                                    ยกเลิกแก้ไข
                                </button>
                            )}
                        </div>
                    </form>
                )}

                <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
                    <div className="overflow-x-auto">
                        <table className="min-w-full divide-y divide-slate-200 text-sm">
                        <thead className="bg-slate-50">
                            <tr>
                                <th className="px-3 py-2 text-left">รูปภาพ</th>
                                <th className="px-3 py-2 text-left">status</th>
                                <th className="px-3 py-2 text-left">สร้างเมื่อ</th>
                                <th className="px-3 py-2 text-left">actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-100">
                            {props.items.data.map((banner) => (
                                <tr key={banner.id}>
                                    <td className="px-3 py-2">
                                        {banner.image_url ? (
                                            <div className="flex items-center gap-3">
                                                <img src={banner.image_url} alt="banner" className="h-14 w-24 rounded-lg object-cover" />
                                                <span className="max-w-[360px] truncate text-xs text-slate-500">{banner.desktop_image_path ?? '-'}</span>
                                            </div>
                                        ) : (
                                            '-'
                                        )}
                                    </td>
                                    <td className="px-3 py-2">
                                        <span className={`rounded-full px-2.5 py-1 text-xs font-semibold ${banner.is_active ? 'bg-emerald-100 text-emerald-700' : 'bg-slate-200 text-slate-700'}`}>
                                            {boolLabel(banner.is_active)}
                                        </span>
                                    </td>
                                    <td className="px-3 py-2">{banner.created_at ?? '-'}</td>
                                    <td className="px-3 py-2">
                                        <div className="flex gap-2">
                                            {canManage ? (
                                                <>
                                                    <button type="button" onClick={() => {
                                                        setEditingId(banner.id);
                                                        form.setData('image', null);
                                                        form.transform((data) => data);
                                                        setPreviewUrl(banner.image_url ?? null);
                                                    }} className={`${actionButtonBaseClass} border border-sky-300 bg-sky-50 text-sky-700 hover:bg-sky-100 focus-visible:ring-sky-400`}>แก้ไข</button>
                                                    <button type="button" onClick={() => router.put(`${basePath}/${banner.id}/toggle-active`, {}, { preserveScroll: true })} className={`${actionButtonBaseClass} ${banner.is_active ? 'border border-amber-300 bg-amber-50 text-amber-800 hover:bg-amber-100 focus-visible:ring-amber-400' : 'border border-emerald-300 bg-emerald-50 text-emerald-700 hover:bg-emerald-100 focus-visible:ring-emerald-400'}`}>{banner.is_active ? 'ปิดใช้งาน' : 'เปิดใช้งาน'}</button>
                                                    <button type="button" onClick={() => router.post(`${basePath}/${banner.id}/delete`, {}, { preserveScroll: true })} className={`${actionButtonBaseClass} border border-rose-300 bg-rose-50 text-rose-700 hover:bg-rose-100 focus-visible:ring-rose-400`}>ลบ</button>
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
            </div>
        </>
    );
}

BannersIndex.layout = (props: { currentTeam?: { slug: string } | null }) => ({
    breadcrumbs: [{ title: 'จัดการแบนเนอร์', href: props.currentTeam ? `/${props.currentTeam.slug}/backoffice/banners` : '/' }],
});
