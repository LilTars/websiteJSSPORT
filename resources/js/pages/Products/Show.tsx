import { Link, usePage } from '@inertiajs/react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { useCallback, useState } from 'react';
import type { ReactElement, ReactNode } from 'react';
import SeoHead from '@/components/seo/seo-head';
import SocialChannelButtons from '@/components/social-channel-buttons';
import PublicLayout from '@/layouts/public-layout';

type ProductDetail = {
    id: number;
    brandTag: string | null;
    name: string;
    price: string | number | null;
    description: string | null;
    category: string | null;
    material: string | null;
    turnaround: string | null;
    images: string[];
    hidePriceOnDetail: boolean;
};

type PageWithLayout = {
    (): ReactElement;
    layout?: (page: ReactNode) => ReactNode;
};

const ProductShow: PageWithLayout = () => {
    const [activeImage, setActiveImage] = useState(0);
    const { props } = usePage<{ product: ProductDetail }>();
    const product = props.product;
    const images = product.images.length > 0 ? product.images : ['/images/logos/pd01.jpg'];
    const primaryImage = images[0] ?? '/images/logos/pd01.jpg';
    const hasMultipleImages = images.length > 1;

    const stepImage = useCallback((direction: 1 | -1) => {
        setActiveImage((current) => (current + direction + images.length) % images.length);
    }, [images.length]);
    const productSchema = {
        '@context': 'https://schema.org',
        '@type': 'Product',
        name: product.name,
        description: product.description ?? `${product.name} จาก JSSPORT`,
        image: images,
        category: product.category ?? undefined,
        brand: product.brandTag
            ? {
                '@type': 'Brand',
                name: product.brandTag,
            }
            : undefined,
        offers: !product.hidePriceOnDetail && product.price !== null
            ? {
                '@type': 'Offer',
                priceCurrency: 'THB',
                price: typeof product.price === 'number' ? product.price.toFixed(2) : String(product.price),
                availability: 'https://schema.org/InStock',
                url: `https://jssport.co.th/products/${product.id}`,
            }
            : undefined,
    };

    return (
        <>
            <SeoHead
                title={product.name}
                description={product.description ?? `${product.name} สินค้ากีฬาคุณภาพจาก JSSPORT`}
                path={`/products/${product.id}`}
                image={primaryImage}
                type="product"
                keywords={[
                    product.name,
                    product.category ?? 'สินค้า กีฬา',
                    product.brandTag ?? 'JSSPORT',
                ]}
                jsonLd={productSchema}
            />

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
                                className="group relative overflow-hidden border border-black/10 bg-black focus-within:ring-2 focus-within:ring-red-500 dark:border-white/20"
                                style={{
                                    clipPath:
                                        'polygon(0 0, calc(100% - 34px) 0, 100% 34px, 100% 100%, 0 100%)',
                                }}
                                // Arrow keys move through the gallery once it has focus.
                                tabIndex={hasMultipleImages ? 0 : undefined}
                                role={hasMultipleImages ? 'group' : undefined}
                                aria-label={hasMultipleImages ? `รูปสินค้า ${activeImage + 1} จาก ${images.length} — ใช้ปุ่มลูกศรเพื่อเปลี่ยนรูป` : undefined}
                                onKeyDown={(event) => {
                                    if (!hasMultipleImages) {
                                        return;
                                    }

                                    if (event.key === 'ArrowRight') {
                                        event.preventDefault();
                                        stepImage(1);
                                    } else if (event.key === 'ArrowLeft') {
                                        event.preventDefault();
                                        stepImage(-1);
                                    }
                                }}
                            >
                                <img
                                    src={images[activeImage]}
                                    alt={`${product.name} รูปที่ ${activeImage + 1}`}
                                    className="h-[68vh] min-h-[420px] w-full object-cover transition duration-700 group-hover:scale-[1.03]"
                                />
                                <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/45 via-transparent to-black/10" />

                                {hasMultipleImages && (
                                    <>
                                        <button
                                            type="button"
                                            aria-label="รูปก่อนหน้า"
                                            onClick={() => stepImage(-1)}
                                            className="absolute left-3 top-1/2 -translate-y-1/2 rounded-full bg-black/55 p-2 text-white backdrop-blur transition hover:bg-red-600 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white"
                                        >
                                            <ChevronLeft size={20} />
                                        </button>
                                        <button
                                            type="button"
                                            aria-label="รูปถัดไป"
                                            onClick={() => stepImage(1)}
                                            className="absolute right-3 top-1/2 -translate-y-1/2 rounded-full bg-black/55 p-2 text-white backdrop-blur transition hover:bg-red-600 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white"
                                        >
                                            <ChevronRight size={20} />
                                        </button>
                                        <p className="absolute bottom-4 left-1/2 -translate-x-1/2 rounded-full bg-black/55 px-3 py-1 text-xs font-bold tracking-[0.14em] text-white backdrop-blur">
                                            {activeImage + 1} / {images.length}
                                        </p>
                                    </>
                                )}
                            </article>

                            {hasMultipleImages && (
                            <div className="grid grid-cols-2 gap-4 md:grid-cols-3">
                                {images.map((imageUrl, index) => {
                                    const isActive = activeImage === index;

                                    return (
                                        <button
                                            key={imageUrl}
                                            type="button"
                                            aria-label={`ดูรูปที่ ${index + 1}`}
                                            aria-pressed={isActive}
                                            onClick={() => setActiveImage(index)}
                                            className={`group relative overflow-hidden border transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-red-500 ${
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
                                                alt=""
                                                loading="lazy"
                                                className="h-40 w-full object-cover transition duration-500 group-hover:scale-105"
                                            />
                                            <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent" />
                                        </button>
                                    );
                                })}
                            </div>
                            )}
                        </div>

                        <aside className="top-24 lg:sticky">
                            <div
                                className="border border-black/10 bg-white/70 p-6 backdrop-blur-md dark:border-white/15 dark:bg-black/40 md:p-7"
                                style={{
                                    clipPath:
                                        'polygon(0 0, calc(100% - 26px) 0, 100% 26px, 100% 100%, 0 100%)',
                                }}
                            >
                                {product.brandTag && (
                                    <p className="text-[11px] font-black uppercase text-blue-700 dark:text-blue-400">
                                        {product.brandTag}
                                    </p>
                                )}

                                <h1 className="mt-4 -skew-x-12 text-4xl font-black uppercase leading-[1.25] md:text-5xl">
                                    <span className="block skew-x-12">{product.name}</span>
                                </h1>

                                {!product.hidePriceOnDetail && product.price !== null && (
                                    <p className="mt-4 bg-gradient-to-r from-blue-700 via-red-600 to-red-500 bg-clip-text text-3xl font-black uppercase text-transparent dark:from-blue-400 dark:via-red-400 dark:to-pink-300">
                                        {typeof product.price === 'number'
                                            ? `฿${product.price.toLocaleString()}`
                                            : product.price}
                                    </p>
                                )}

                                {product.description && (
                                    <p className="mt-5 whitespace-pre-line text-sm leading-relaxed text-sport-slate dark:text-slate-300">
                                        {product.description}
                                    </p>
                                )}

                                <div className="mt-6 grid grid-cols-2 gap-3 text-[11px] font-bold uppercase text-sport-slate dark:text-slate-300">
                                    <div className="border border-black/10 bg-white/60 p-3 dark:border-white/15 dark:bg-white/5">
                                        <p className="tracking-[0.2em]">Category</p>
                                        <p className="mt-2 text-blue-700 dark:text-blue-400">{product.category ?? '-'}</p>
                                    </div>
                                    <div className="border border-black/10 bg-white/60 p-3 dark:border-white/15 dark:bg-white/5">
                                        <p className="tracking-[0.2em]">Material</p>
                                        <p className="mt-2 text-blue-700 dark:text-blue-400">{product.material ?? '-'}</p>
                                    </div>
                                    <div className="border border-black/10 bg-white/60 p-3 dark:border-white/15 dark:bg-white/5 col-span-2">
                                        <p className="tracking-[0.2em]">Turnaround</p>
                                        <p className="mt-2 text-red-600 dark:text-red-400">{product.turnaround ?? '-'}</p>
                                    </div>
                                </div>

                                <div className="mt-8">
                                    <p className="mb-3 text-xs font-black uppercase text-red-600 dark:text-red-400">
                                        เลือกซื้อผ่าน
                                    </p>
                                    <SocialChannelButtons />
                                </div>
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
