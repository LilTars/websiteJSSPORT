import { Head, Link, usePage } from '@inertiajs/react';
import { useMemo, useState } from 'react';
import type { ReactElement, ReactNode } from 'react';
import PublicLayout from '@/layouts/public-layout';

type ProductDetail = {
    id: number;
    brandTag: string;
    name: string;
    price: string;
    description: string;
    category: string;
    material: string;
    turnaround: string;
    images: string[];
};

const productCatalog: ProductDetail[] = [
    {
        id: 1,
        brandTag: 'JS SPORT EXCLUSIVE',
        name: 'STORM ELITE JERSEY KIT',
        price: '฿890',
        category: 'CUSTOM JERSEY',
        material: 'AEROFIT PRO FABRIC',
        turnaround: '7-12 DAYS',
        description:
            'เสื้อแข่งทรงแข่งขันที่ออกแบบเพื่อทีมจริง เนื้อผ้าเบา ระบายอากาศดี แห้งไว และรองรับการพิมพ์ลายเต็มผืน ให้ภาพลักษณ์คมชัดระดับโปรทุกแมตช์สำคัญของทีมคุณ',
        images: [
            'https://images.unsplash.com/photo-1517649763962-0c623066013b?auto=format&fit=crop&w=1900&q=80',
            'https://images.unsplash.com/photo-1461896836934-ffe607ba8211?auto=format&fit=crop&w=1900&q=80',
            'https://images.unsplash.com/photo-1562771379-eafdca7a02f8?auto=format&fit=crop&w=1900&q=80',
            'https://images.unsplash.com/photo-1522778119026-d647f0596c20?auto=format&fit=crop&w=1900&q=80',
        ],
    },
    {
        id: 2,
        brandTag: 'JS SPORT EXCLUSIVE',
        name: 'ACTIVE SCHOOL PE KIT',
        price: '฿540',
        category: 'PE KITS',
        material: 'LIGHTWEIGHT MESH',
        turnaround: '5-9 DAYS',
        description:
            'ชุดพละดีไซน์ร่วมสมัยสำหรับการใช้งานทุกวัน เน้นความคล่องตัว ทนทาน และความสบายตลอดกิจกรรม รองรับการสกรีนโลโก้และชื่อโรงเรียนอย่างชัดเจน',
        images: [
            'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?auto=format&fit=crop&w=1900&q=80',
            'https://images.unsplash.com/photo-1483721310020-03333e577078?auto=format&fit=crop&w=1900&q=80',
            'https://images.unsplash.com/photo-1518459031867-a89b944bffe4?auto=format&fit=crop&w=1900&q=80',
            'https://images.unsplash.com/photo-1599059813005-11265ba4b4ce?auto=format&fit=crop&w=1900&q=80',
        ],
    },
];

const sizeOptions = ['S', 'M', 'L', 'XL', 'XXL'] as const;

type PageWithLayout = {
    (): ReactElement;
    layout?: (page: ReactNode) => ReactNode;
};

const ProductShow: PageWithLayout = () => {
    const [activeImage, setActiveImage] = useState(0);
    const [selectedSize, setSelectedSize] = useState<(typeof sizeOptions)[number]>('L');
    const { url } = usePage();

    const product = useMemo(() => {
        const routeId = Number(url.split('/').pop()?.split('?')[0]);

        return productCatalog.find((item) => item.id === routeId) ?? productCatalog[0];
    }, [url]);

    return (
        <>
            <Head title={`${product.name} | Product Detail`} />

            <section className="relative overflow-hidden py-8 md:py-10">
                <div className="pointer-events-none absolute inset-0 -z-10 bg-[radial-gradient(circle_at_18%_8%,rgba(37,99,235,0.14)_0%,transparent_44%),radial-gradient(circle_at_82%_12%,rgba(220,38,38,0.12)_0%,transparent_42%)]" />

                <div className="mx-auto max-w-7xl px-4 md:px-8">
                    <div className="mb-6 flex items-center gap-2 text-xs font-bold uppercase tracking-[0.22em] text-sport-slate dark:text-slate-300">
                        <Link href="/" className="hover:text-blue-700 dark:hover:text-blue-400">
                            Home
                        </Link>
                        <span>/</span>
                        <Link href="/products" className="hover:text-blue-700 dark:hover:text-blue-400">
                            Products
                        </Link>
                        <span>/</span>
                        <span className="text-red-600 dark:text-red-400">Detail</span>
                    </div>

                    <div className="grid items-start gap-6 lg:grid-cols-[1.6fr_1fr] lg:gap-8">
                        <div className="space-y-4">
                            <article
                                className="group relative overflow-hidden border border-black/10 bg-black dark:border-white/20"
                                style={{
                                    clipPath:
                                        'polygon(0 0, calc(100% - 34px) 0, 100% 34px, 100% 100%, 0 100%)',
                                }}
                            >
                                <img
                                    src={product.images[activeImage]}
                                    alt={product.name}
                                    className="h-[68vh] min-h-[420px] w-full object-cover transition duration-700 group-hover:scale-[1.03]"
                                />
                                <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/45 via-transparent to-black/10" />
                            </article>

                            <div className="grid grid-cols-2 gap-4 md:grid-cols-3">
                                {product.images.map((imageUrl, index) => {
                                    const isActive = activeImage === index;

                                    return (
                                        <button
                                            key={imageUrl}
                                            type="button"
                                            onClick={() => setActiveImage(index)}
                                            className={`group relative overflow-hidden border transition ${
                                                isActive
                                                    ? 'border-red-600 shadow-[0_0_0_1px_rgba(220,38,38,0.45)]'
                                                    : 'border-black/15 hover:border-blue-700 dark:border-white/20 dark:hover:border-blue-400'
                                            }`}
                                            style={{
                                                clipPath:
                                                    'polygon(0 0, calc(100% - 18px) 0, 100% 18px, 100% 100%, 0 100%)',
                                            }}
                                        >
                                            <img
                                                src={imageUrl}
                                                alt={`${product.name} ${index + 1}`}
                                                className="h-40 w-full object-cover transition duration-500 group-hover:scale-105"
                                            />
                                            <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent" />
                                        </button>
                                    );
                                })}
                            </div>
                        </div>

                        <aside className="top-24 lg:sticky">
                            <div
                                className="border border-black/10 bg-white/70 p-6 backdrop-blur-md dark:border-white/15 dark:bg-black/40 md:p-7"
                                style={{
                                    clipPath:
                                        'polygon(0 0, calc(100% - 26px) 0, 100% 26px, 100% 100%, 0 100%)',
                                }}
                            >
                                <p className="text-[11px] font-black uppercase tracking-[0.28em] text-blue-700 dark:text-blue-400">
                                    {product.brandTag}
                                </p>

                                <h1 className="mt-4 -skew-x-12 text-4xl font-black uppercase leading-[0.88] tracking-tight md:text-5xl">
                                    <span className="block skew-x-12">{product.name}</span>
                                </h1>

                                <p className="mt-4 bg-gradient-to-r from-blue-700 via-red-600 to-white bg-clip-text text-3xl font-black uppercase text-transparent drop-shadow-sm">
                                    {product.price}
                                </p>

                                <p className="mt-5 text-sm leading-relaxed text-sport-slate dark:text-slate-300">
                                    {product.description}
                                </p>

                                <div className="mt-6 grid grid-cols-2 gap-3 text-[11px] font-bold uppercase tracking-[0.2em] text-sport-slate dark:text-slate-300">
                                    <div className="border border-black/10 bg-white/60 p-3 dark:border-white/15 dark:bg-white/5">
                                        <p>Category</p>
                                        <p className="mt-2 text-blue-700 dark:text-blue-400">{product.category}</p>
                                    </div>
                                    <div className="border border-black/10 bg-white/60 p-3 dark:border-white/15 dark:bg-white/5">
                                        <p>Material</p>
                                        <p className="mt-2 text-blue-700 dark:text-blue-400">{product.material}</p>
                                    </div>
                                    <div className="border border-black/10 bg-white/60 p-3 dark:border-white/15 dark:bg-white/5 col-span-2">
                                        <p>Turnaround</p>
                                        <p className="mt-2 text-red-600 dark:text-red-400">{product.turnaround}</p>
                                    </div>
                                </div>

                                <div className="mt-7">
                                    <p className="text-xs font-black uppercase tracking-[0.24em] text-sport-slate dark:text-slate-300">
                                        Select Size
                                    </p>
                                    <div className="mt-3 grid grid-cols-5 gap-2">
                                        {sizeOptions.map((size) => {
                                            const isSelected = selectedSize === size;

                                            return (
                                                <button
                                                    key={size}
                                                    type="button"
                                                    onClick={() => setSelectedSize(size)}
                                                    className={`px-0 py-2 text-sm font-black uppercase transition ${
                                                        isSelected
                                                            ? 'bg-gradient-to-r from-blue-800 to-red-700 text-white'
                                                            : 'border border-black/20 bg-white/70 text-sport-text-light hover:border-blue-700 hover:text-blue-700 dark:border-white/20 dark:bg-white/5 dark:text-white dark:hover:border-blue-400 dark:hover:text-blue-400'
                                                    }`}
                                                    style={{
                                                        clipPath:
                                                            'polygon(0 0, calc(100% - 12px) 0, 100% 12px, 100% 100%, 0 100%)',
                                                    }}
                                                >
                                                    {size}
                                                </button>
                                            );
                                        })}
                                    </div>
                                </div>

                                <Link
                                    href="/contact"
                                    className="mt-8 inline-flex w-full items-center justify-center bg-gradient-to-r from-blue-800 to-red-700 px-6 py-4 text-center text-sm font-black uppercase tracking-[0.1em] text-white transition hover:-translate-y-0.5 hover:from-blue-900 hover:to-red-800"
                                    style={{
                                        clipPath:
                                            'polygon(0 0, calc(100% - 20px) 0, 100% 20px, 100% 100%, 0 100%)',
                                    }}
                                >
                                    ขอใบเสนอราคา / สั่งทำชุดนี้
                                </Link>
                            </div>
                        </aside>
                    </div>
                </div>
            </section>
        </>
    );
};

ProductShow.layout = (page: ReactNode) => <PublicLayout>{page}</PublicLayout>;

export default ProductShow;
