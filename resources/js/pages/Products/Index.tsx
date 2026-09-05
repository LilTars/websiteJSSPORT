import { Link, usePage } from '@inertiajs/react';
import { useCallback, useEffect, useMemo, useState } from 'react';
import type { ReactElement, ReactNode } from 'react';
import SeoHead from '@/components/seo/seo-head';
import PublicLayout from '@/layouts/public-layout';
import { trackPageView, trackSiteClick } from '@/lib/track-click';

type CategoryItem = {
    id: number;
    name: string;
    slug: string;
};

type ProductItem = {
    id: number;
    name: string;
    category: string | null;
    category_slug: string | null;
    price: number | null;
    imageUrl: string | null;
    hidePriceOnCard: boolean;
};

type PageWithLayout = {
    (): ReactElement;
    layout?: (page: ReactNode) => ReactNode;
};

const ProductsIndex: PageWithLayout = () => {
    const { url, props } = usePage<{ categories: CategoryItem[]; products: ProductItem[] }>();
    const [selectedCategory, setSelectedCategory] = useState<string | null>(null);

    useEffect(() => {
        trackPageView('products');
    }, []);

    const categories = useMemo(() => ['all', ...props.categories.map((category) => category.slug)], [props.categories]);
    const categoryLabels = useMemo(
        () => Object.fromEntries([
            ['all', 'ทั้งหมด'],
            ...props.categories.map((category) => [category.slug, category.name]),
        ]),
        [props.categories],
    );

    const urlCategory = useMemo(() => {
        const query = url.split('?')[1];

        if (!query) {
            return null;
        }

        const requestedCategory = new URLSearchParams(query).get('category');

        if (requestedCategory && categories.includes(requestedCategory)) {
            return requestedCategory;
        }

        return null;
    }, [categories, url]);

    const activeCategory = selectedCategory ?? urlCategory ?? 'all';

    // Client-side filtering only; mirror the choice into the URL so the view can be shared.
    const selectCategory = useCallback((category: string) => {
        setSelectedCategory(category);

        if (typeof window === 'undefined') {
            return;
        }

        const nextUrl = new URL(window.location.href);

        if (category === 'all') {
            nextUrl.searchParams.delete('category');
        } else {
            nextUrl.searchParams.set('category', category);
        }

        window.history.replaceState(window.history.state, '', nextUrl.toString());
    }, []);

    const filteredProducts = useMemo(() => {
        if (activeCategory === 'all') {
            return props.products;
        }

        return props.products.filter((product) => product.category_slug === activeCategory);
    }, [activeCategory, props.products]);

    const productListSchema = {
        '@context': 'https://schema.org',
        '@type': 'CollectionPage',
        name: 'สินค้ากีฬา JSSPORT',
        url: 'https://jssport.co.th/products',
        mainEntity: {
            '@type': 'ItemList',
            numberOfItems: filteredProducts.length,
            itemListElement: filteredProducts.slice(0, 20).map((product, index) => ({
                '@type': 'ListItem',
                position: index + 1,
                url: `https://jssport.co.th/products/${product.id}`,
                name: product.name,
            })),
        },
    };

    return (
        <>
            <SeoHead
                title="สินค้า"
                description="เลือกซื้อเสื้อกีฬาและอุปกรณ์กีฬาคุณภาพสูงจาก JSSPORT ค้นหาตามหมวดหมู่และดูรายละเอียดสินค้าได้ทันที"
                path="/products"
                keywords={['สินค้า กีฬา', 'เสื้อกีฬา', 'อุปกรณ์กีฬา', 'ชุดทีม', 'JSSPORT products']}
                jsonLd={productListSchema}
            />

            <section className="mx-auto w-full max-w-7xl px-4 pb-14 pt-10 md:px-8 md:pt-14">
                <div className="flex flex-wrap items-end justify-between gap-4">
                    <div>
                        <p className="text-xs font-semibold uppercase text-sport-accent">
                            แคตตาล็อกสินค้า
                        </p>
                        <h1 className="mt-1 text-3xl font-black uppercase leading-[1.25] md:text-5xl">
                            เลือกอุปกรณ์ที่ใช่สำหรับทีมของคุณ
                        </h1>
                    </div>

                    <p aria-live="polite" className="text-sm font-semibold text-sport-slate dark:text-slate-300">
                        พบ <span className="text-sport-accent">{filteredProducts.length}</span> รายการ
                        {activeCategory !== 'all' && ` ในหมวด ${categoryLabels[activeCategory] ?? activeCategory}`}
                    </p>
                </div>

                <div className="mt-7 flex flex-wrap gap-2">
                    {categories.map((category) => {
                        const isActive = activeCategory === category;

                        return (
                            <button
                                key={category}
                                type="button"
                                aria-pressed={isActive}
                                onClick={() => {
                                    selectCategory(category);

                                    if (category !== 'all') {
                                        const selected = props.categories.find((item) => item.slug === category);

                                        trackSiteClick({
                                            eventType: 'product_category_click',
                                            page: 'products',
                                            categoryName: selected?.name ?? category,
                                            categorySlug: category,
                                            referrer: window.location.href,
                                        });
                                    }
                                }}
                                className={`rounded-full border px-4 py-2 text-sm font-semibold transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-sport-accent focus-visible:ring-offset-2 focus-visible:ring-offset-white dark:focus-visible:ring-offset-slate-950 ${
                                    isActive
                                        ? 'border-sport-accent bg-sport-accent text-sport-black'
                                        : 'border-black/15 bg-white/70 hover:border-sport-accent hover:text-sport-accent dark:border-white/20 dark:bg-white/5'
                                }`}
                            >
                                {categoryLabels[category] ?? category}
                            </button>
                        );
                    })}
                </div>

                <div className="mt-8 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
                    {filteredProducts.map((product) => (
                        <Link
                            key={product.id}
                            href={`/products/${product.id}`}
                            aria-label={`ดูรายละเอียด ${product.name}`}
                            onClick={() => trackSiteClick({
                                eventType: 'product_click',
                                page: 'products',
                                productId: product.id,
                                productName: product.name,
                                categoryName: product.category,
                                categorySlug: product.category_slug,
                                referrer: window.location.href,
                            })}
                            className="group relative isolate block overflow-hidden border-2 border-black/55 bg-white/85 shadow-[8px_8px_0_0_rgba(15,23,42,0.55)] backdrop-blur transition duration-300 hover:-translate-y-1.5 hover:border-sport-pink hover:shadow-[12px_12px_0_0_rgba(236,72,153,0.6)] focus-visible:border-sport-pink focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-sport-pink dark:border-white/30 dark:bg-black/30"
                            style={{
                                clipPath:
                                    'polygon(0 0, calc(100% - 26px) 0, 100% 26px, 100% 100%, 0 100%)',
                            }}
                        >
                            <div
                                className="absolute right-0 top-0 h-10 w-10 border-l-2 border-b-2 border-sport-pink/70 bg-sport-pink/20"
                                style={{
                                    clipPath: 'polygon(0 0, 100% 0, 100% 100%)',
                                }}
                            />

                            <div className="relative aspect-[4/3] overflow-hidden border-b-2 border-black/50 dark:border-white/25">
                                <img
                                    src={product.imageUrl ?? '/images/logos/pd01.jpg'}
                                    alt={product.name}
                                    loading="lazy"
                                    className="h-full w-full object-cover transition duration-700 group-hover:scale-110"
                                />
                                <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/70 via-black/15 to-transparent opacity-70 transition group-hover:opacity-90" />
                            </div>

                            <div className="space-y-3 p-4">
                                <p className="text-xs font-black uppercase text-sport-pink">
                                    {product.category ?? '-'}
                                </p>
                                <h2 className="text-xl font-black uppercase leading-snug">
                                    {product.name}
                                </h2>
                                <div className={`flex items-center ${product.hidePriceOnCard || product.price === null ? 'justify-end' : 'justify-between'}`}>
                                    {!product.hidePriceOnCard && product.price !== null && (
                                        <p className="text-2xl font-black uppercase tracking-[0.06em] text-sport-accent">
                                            ฿{product.price.toLocaleString()}
                                        </p>
                                    )}
                                    {/* Visual affordance only - the whole card is the link. */}
                                    <span className="border-2 border-black/60 px-3 py-1 text-xs font-black uppercase transition group-hover:border-sport-pink group-hover:bg-sport-pink group-hover:text-white dark:border-white/40">
                                        รายละเอียด
                                    </span>
                                </div>
                            </div>
                        </Link>
                    ))}
                </div>

                {filteredProducts.length === 0 && (
                    <div className="mt-8 flex flex-col items-center gap-4 border-2 border-dashed border-black/20 px-6 py-16 text-center dark:border-white/20">
                        <p className="text-lg font-black uppercase">ยังไม่มีสินค้าในหมวดนี้</p>
                        <p className="max-w-md text-sm text-sport-slate dark:text-slate-300">
                            ลองเลือกหมวดอื่น หรือดูสินค้าทั้งหมดของเรา
                        </p>
                        <button
                            type="button"
                            onClick={() => selectCategory('all')}
                            className="border-2 border-black/60 px-4 py-2 text-xs font-black uppercase transition hover:border-sport-pink hover:bg-sport-pink hover:text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-sport-pink dark:border-white/40"
                        >
                            ดูสินค้าทั้งหมด
                        </button>
                    </div>
                )}
            </section>
        </>
    );
};

ProductsIndex.layout = (page: ReactNode) => (
    <PublicLayout>{page}</PublicLayout>
);

export default ProductsIndex;
