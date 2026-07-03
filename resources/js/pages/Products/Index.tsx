import { Head, Link } from '@inertiajs/react';
import { useMemo, useState } from 'react';
import type { ReactElement, ReactNode } from 'react';
import PublicLayout from '@/layouts/public-layout';

type ProductCategory =
    | 'All'
    | 'Jerseys'
    | 'PE kits'
    | 'Office uniforms'
    | 'Gear'
    | 'Shoes';

type Product = {
    id: number;
    name: string;
    category: Exclude<ProductCategory, 'All'>;
    price: number;
    imageUrl: string;
};

const categories: ProductCategory[] = [
    'All',
    'Jerseys',
    'PE kits',
    'Office uniforms',
    'Gear',
    'Shoes',
];

const categoryLabels: Record<ProductCategory, string> = {
    All: 'ทั้งหมด',
    Jerseys: 'เสื้อแข่ง',
    'PE kits': 'ชุดพละ',
    'Office uniforms': 'ยูนิฟอร์มองค์กร',
    Gear: 'อุปกรณ์กีฬา',
    Shoes: 'รองเท้า',
};

const products: Product[] = [
    {
        id: 1,
        name: 'ชุดแข่ง Storm Pro',
        category: 'Jerseys',
        price: 890,
        imageUrl:
            'https://images.unsplash.com/photo-1517649763962-0c623066013b?auto=format&fit=crop&w=1200&q=80',
    },
    {
        id: 2,
        name: 'ชุดพละ Active School',
        category: 'PE kits',
        price: 540,
        imageUrl:
            'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?auto=format&fit=crop&w=1200&q=80',
    },
    {
        id: 3,
        name: 'ยูนิฟอร์ม Corporate Sprint',
        category: 'Office uniforms',
        price: 990,
        imageUrl:
            'https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?auto=format&fit=crop&w=1200&q=80',
    },
    {
        id: 4,
        name: 'ชุดกรวยซ้อมทีม',
        category: 'Gear',
        price: 320,
        imageUrl:
            'https://images.unsplash.com/photo-1431324155629-1a6deb1dec8d?auto=format&fit=crop&w=1200&q=80',
    },
    {
        id: 5,
        name: 'รองเท้า Velocity Grip',
        category: 'Shoes',
        price: 1590,
        imageUrl:
            'https://images.unsplash.com/photo-1542291026-7eec264c27ff?auto=format&fit=crop&w=1200&q=80',
    },
    {
        id: 6,
        name: 'เสื้อแข่ง Falcon Match',
        category: 'Jerseys',
        price: 760,
        imageUrl:
            'https://images.unsplash.com/photo-1461896836934-ffe607ba8211?auto=format&fit=crop&w=1200&q=80',
    },
];

type PageWithLayout = {
    (): ReactElement;
    layout?: (page: ReactNode) => ReactNode;
};

const ProductsIndex: PageWithLayout = () => {
    const [activeCategory, setActiveCategory] = useState<ProductCategory>('All');

    const filteredProducts = useMemo(() => {
        if (activeCategory === 'All') {
            return products;
        }

        return products.filter((product) => product.category === activeCategory);
    }, [activeCategory]);

    return (
        <>
            <Head title="สินค้า" />

            <section className="mx-auto w-full max-w-7xl px-4 pb-14 pt-10 md:px-8 md:pt-14">
                <div className="flex flex-wrap items-end justify-between gap-4">
                    <div>
                        <p className="text-xs font-semibold uppercase tracking-[0.2em] text-sport-accent">
                            แคตตาล็อกสินค้า
                        </p>
                        <h1 className="mt-1 text-3xl font-black uppercase md:text-5xl">
                            เลือกอุปกรณ์ที่ใช่สำหรับทีมของคุณ
                        </h1>
                    </div>
                </div>

                <div className="mt-7 flex flex-wrap gap-2">
                    {categories.map((category) => {
                        const isActive = activeCategory === category;

                        return (
                            <button
                                key={category}
                                type="button"
                                onClick={() => setActiveCategory(category)}
                                className={`rounded-full border px-4 py-2 text-sm font-semibold transition ${
                                    isActive
                                        ? 'border-sport-accent bg-sport-accent text-sport-black'
                                        : 'border-black/15 bg-white/70 hover:border-sport-accent hover:text-sport-accent dark:border-white/20 dark:bg-white/5'
                                }`}
                            >
                                {categoryLabels[category]}
                            </button>
                        );
                    })}
                </div>

                <div className="mt-8 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
                    {filteredProducts.map((product) => (
                        <article
                            key={product.id}
                            className="group relative isolate overflow-hidden border-2 border-black/55 bg-white/85 shadow-[8px_8px_0_0_rgba(15,23,42,0.55)] backdrop-blur transition duration-300 hover:-translate-y-1.5 hover:border-sport-pink hover:shadow-[12px_12px_0_0_rgba(236,72,153,0.6)] dark:border-white/30 dark:bg-black/30"
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

                            <div className="aspect-[4/3] overflow-hidden border-b-2 border-black/50 dark:border-white/25">
                                <img
                                    src={product.imageUrl}
                                    alt={product.name}
                                    className="h-full w-full object-cover transition duration-700 group-hover:scale-110"
                                />
                                <div className="pointer-events-none absolute inset-x-0 top-0 h-full bg-gradient-to-t from-black/70 via-black/15 to-transparent opacity-70 transition group-hover:opacity-90" />
                            </div>

                            <div className="space-y-3 p-4">
                                <p className="text-xs font-black uppercase tracking-[0.2em] text-sport-pink">
                                    {categoryLabels[product.category]}
                                </p>
                                <h2 className="text-xl font-black uppercase leading-tight tracking-[0.03em]">
                                    {product.name}
                                </h2>
                                <div className="flex items-center justify-between">
                                    <p className="text-2xl font-black uppercase tracking-[0.06em] text-sport-accent">
                                        ฿{product.price.toLocaleString()}
                                    </p>
                                    <Link
                                        href={`/products/${product.id}`}
                                        className="border-2 border-black/60 px-3 py-1 text-xs font-black uppercase tracking-[0.14em] transition hover:border-sport-pink hover:bg-sport-pink hover:text-white dark:border-white/40"
                                    >
                                        รายละเอียด
                                    </Link>
                                </div>
                            </div>
                        </article>
                    ))}
                </div>
            </section>
        </>
    );
};

ProductsIndex.layout = (page: ReactNode) => (
    <PublicLayout>{page}</PublicLayout>
);

export default ProductsIndex;
