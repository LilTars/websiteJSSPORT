import { Link } from '@inertiajs/react';
import { ArrowRight } from 'lucide-react';
import { HOME_PRODUCT_FALLBACK_IMAGE } from '@/components/home/types';
import type { HomeProductItem } from '@/components/home/types';
import { trackSiteClick } from '@/lib/track-click';

type NpfcCollectionProps = {
    products: HomeProductItem[];
};

export default function NpfcCollection({ products }: NpfcCollectionProps) {
    const collection = products[0];
    const collectionSlug = collection?.categorySlug ?? null;
    const collectionName = collection?.categoryName ?? 'เสื้อพิชญ';

    return (
        <section className="relative isolate overflow-hidden py-16 md:py-24">
            {/* The club artwork is a poster with its own headline baked in, so it is
                pushed back to a blurred texture instead of competing with the copy. */}
            <img
                src="/images/logos/braner1.png"
                alt=""
                aria-hidden="true"
                loading="lazy"
                className="absolute inset-0 -z-20 h-full w-full scale-125 object-cover opacity-[0.18] blur-lg"
            />
            <div className="absolute inset-0 -z-10 bg-[radial-gradient(circle_at_18%_25%,rgba(236,72,153,0.3),transparent_48%),radial-gradient(circle_at_85%_75%,rgba(59,130,246,0.16),transparent_45%),linear-gradient(180deg,rgba(2,6,23,0.97)_0%,rgba(2,6,23,0.88)_45%,rgba(2,6,23,0.98)_100%)]" />

            <div className="mx-auto max-w-7xl px-4 md:px-8">
                <div className="grid gap-10 lg:grid-cols-[minmax(0,0.85fr)_minmax(0,1.15fr)] lg:items-center lg:gap-14">
                    <div>
                        <p className="inline-flex items-center gap-2 text-[11px] font-black uppercase tracking-[0.28em] text-pink-300">
                            <span className="inline-block h-1.5 w-8 rounded-full bg-gradient-to-r from-pink-400 to-red-500" />
                            Exclusive Drop
                        </p>

                        <h2 className="mt-5 text-3xl font-black leading-[1.25] text-white sm:text-4xl lg:text-5xl">
                            สโมสรฟุตบอล
                            <span className="mt-1 block bg-gradient-to-r from-pink-200 via-pink-400 to-red-500 bg-clip-text text-transparent">
                                หนองบัว พิชญ FC
                            </span>
                        </h2>

                        <p className="mt-5 max-w-md text-sm leading-relaxed text-slate-300 md:text-base">
                            ชุดแข่งและของที่ระลึกอย่างเป็นทางการของสโมสร ผลิตด้วยมาตรฐานเดียวกับที่นักเตะใส่ลงสนามจริง
                        </p>

                        <div className="mt-8 flex flex-wrap items-center gap-4">
                            {collectionSlug && (
                                <Link
                                    href={`/products?category=${encodeURIComponent(collectionSlug)}`}
                                    onClick={() => trackSiteClick({
                                        eventType: 'product_category_click',
                                        page: 'home',
                                        section: 'npfc_collection',
                                        categoryName: collectionName,
                                        categorySlug: collectionSlug,
                                        referrer: window.location.href,
                                    })}
                                    className="group inline-flex items-center gap-2 rounded-full bg-white px-6 py-3 text-sm font-black text-slate-900 transition hover:bg-pink-400 hover:text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-pink-400 focus-visible:ring-offset-2 focus-visible:ring-offset-slate-950"
                                >
                                    ดูคอลเลกชันทั้งหมด
                                    <ArrowRight size={16} className="transition-transform group-hover:translate-x-1" />
                                </Link>
                            )}

                            {products.length > 0 && (
                                <p className="text-xs font-bold text-slate-400">
                                    {products.length} รายการในคอลเลกชัน
                                </p>
                            )}
                        </div>
                    </div>

                    {products.length > 0 ? (
                        // Column count follows the real number of items, so a short
                        // collection does not leave empty slots in a fixed 4-up grid.
                        <div
                            className={`grid gap-4 sm:gap-5 ${
                                products.length === 1
                                    ? 'grid-cols-1 sm:max-w-sm'
                                    : products.length === 2
                                      ? 'grid-cols-2'
                                      : 'grid-cols-2 lg:grid-cols-3'
                            }`}
                        >
                            {products.map((product) => (
                                <Link
                                    key={`npfc-${product.id}`}
                                    href={`/products/${product.id}`}
                                    onClick={() => trackSiteClick({
                                        eventType: 'product_click',
                                        page: 'home',
                                        productId: product.id,
                                        productName: product.name,
                                        referrer: window.location.href,
                                    })}
                                    className="group relative flex flex-col overflow-hidden rounded-2xl border border-white/15 bg-white/[0.06] shadow-[0_24px_48px_-28px_rgba(0,0,0,0.9)] backdrop-blur-sm transition duration-300 hover:-translate-y-1.5 hover:border-pink-400/70 hover:bg-white/[0.1] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-pink-400 focus-visible:ring-offset-2 focus-visible:ring-offset-slate-950"
                                    aria-label={`ไปยังสินค้า ${product.name}`}
                                >
                                    <div className="relative aspect-[3/4] overflow-hidden bg-slate-900">
                                        <img
                                            src={product.imageUrl ?? HOME_PRODUCT_FALLBACK_IMAGE}
                                            alt={product.name}
                                            loading="lazy"
                                            className="h-full w-full object-cover transition duration-700 group-hover:scale-105"
                                        />
                                        <div className="absolute inset-x-0 bottom-0 h-1/3 bg-gradient-to-t from-slate-950/80 to-transparent" />
                                    </div>

                                    <div className="flex flex-1 flex-col gap-1 p-4">
                                        <p className="text-[10px] font-black uppercase text-pink-300">
                                            {product.categoryName ?? collectionName}
                                        </p>
                                        <h3 className="text-sm font-bold leading-[1.35] text-white md:text-base">
                                            {product.name}
                                        </h3>

                                        <div className="mt-auto flex items-end justify-between gap-3 pt-3">
                                            {!product.hidePriceOnCard && product.price !== null ? (
                                                <p className="text-lg font-black text-white md:text-xl">
                                                    ฿{product.price.toLocaleString()}
                                                </p>
                                            ) : (
                                                <span />
                                            )}
                                            <span className="inline-flex items-center gap-1 text-[11px] font-black text-pink-300 transition-transform group-hover:translate-x-0.5">
                                                ดูสินค้า
                                                <ArrowRight size={13} />
                                            </span>
                                        </div>
                                    </div>
                                </Link>
                            ))}
                        </div>
                    ) : (
                        <div className="rounded-2xl border border-dashed border-white/25 bg-white/[0.04] px-6 py-14 text-center">
                            <p className="text-sm font-semibold text-slate-300">
                                ยังไม่มีสินค้าหมวดพิชญที่เปิดใช้งานสำหรับแสดงผล
                            </p>
                        </div>
                    )}
                </div>
            </div>
        </section>
    );
}
