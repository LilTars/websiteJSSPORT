import { Link } from '@inertiajs/react';
import { useState } from 'react';
import { HOME_PRODUCT_FALLBACK_IMAGE } from '@/components/home/types';
import type { HomeProductItem } from '@/components/home/types';
import { buildLoopedTrack, handleCarouselArrowKeys, useAutoScrollCarousel } from '@/components/home/use-auto-scroll-carousel';
import { trackSiteClick } from '@/lib/track-click';

type LatestProductsProps = {
    products: HomeProductItem[];
};

export default function LatestProducts({ products }: LatestProductsProps) {
    const [isPaused, setIsPaused] = useState(false);
    const carouselRef = useAutoScrollCarousel<HTMLDivElement>(isPaused, 0.4);

    const cards = products.map((product) => ({
        id: product.id,
        name: product.name,
        price: product.price,
        categoryName: product.categoryName,
        imageUrl: product.imageUrl ?? HOME_PRODUCT_FALLBACK_IMAGE,
        hidePriceOnCard: product.hidePriceOnCard,
    }));
    const carouselItems = buildLoopedTrack(cards, 6);

    return (
        <section className="py-12 md:py-16">
            <div className="mx-auto max-w-7xl px-4 md:px-8">
                <div className="mb-8 flex flex-col gap-3 md:mb-10 md:flex-row md:items-end md:justify-between md:gap-6">
                    <div className="max-w-full">
                        <p className="text-xs font-semibold uppercase text-pink-500">
                            สินค้ามาใหม่
                        </p>
                        <h2 className="mt-2 max-w-full text-4xl font-black uppercase leading-[1.25] text-slate-900 dark:text-white md:text-6xl">
                            <span className="block overflow-visible bg-gradient-to-r from-pink-500 to-red-600 bg-clip-text text-transparent drop-shadow-[0_1px_0_rgba(15,23,42,0.08)]">
                                เต็มไปด้วยสินค้า
                            </span>
                        </h2>
                    </div>
                    <p className="text-xs font-bold uppercase text-sport-slate dark:text-slate-300">
                        ไฮไลท์สินค้า / <span className="font-black">SWIPE</span>
                    </p>
                </div>

                <div
                    ref={carouselRef}
                    role="group"
                    aria-label="สินค้ามาใหม่ — ใช้ปุ่มลูกศรเพื่อเลื่อน"
                    tabIndex={0}
                    className="max-w-full overflow-x-auto snap-x snap-mandatory focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-pink-500 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
                    onKeyDown={handleCarouselArrowKeys}
                    onFocus={() => setIsPaused(true)}
                    onBlur={() => setIsPaused(false)}
                    onMouseEnter={() => setIsPaused(true)}
                    onMouseLeave={() => setIsPaused(false)}
                    onTouchStart={() => setIsPaused(true)}
                    onTouchEnd={() => setIsPaused(false)}
                >
                    <div className="flex w-max max-w-full gap-5 pb-3 md:gap-6">
                        {carouselItems.map((item, index) => (
                            <Link
                                key={`${item.id}-${index}`}
                                href={`/products/${item.id}`}
                                aria-label={`ดูรายละเอียด ${item.name}`}
                                onClick={() => trackSiteClick({
                                    eventType: 'product_click',
                                    page: 'home',
                                    productId: item.id,
                                    productName: item.name,
                                    referrer: window.location.href,
                                })}
                                className="group relative block h-[460px] w-[80vw] max-w-[360px] shrink-0 snap-start overflow-hidden border-2 border-black/90 bg-white/30 transition duration-300 hover:-translate-y-2 hover:border-pink-500 hover:shadow-[14px_14px_0_0_rgba(236,72,153,0.55)] focus-visible:border-pink-500 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-pink-500 dark:border-white/85"
                                style={{
                                    clipPath:
                                        'polygon(0 0, calc(100% - 28px) 0, 100% 28px, 100% 100%, 0 100%, 0 0)',
                                }}
                            >
                                <div className="absolute inset-0 bg-black" />
                                <img
                                    src={item.imageUrl}
                                    alt={item.name}
                                    className="absolute inset-0 h-full w-full object-cover transition duration-700 group-hover:scale-110"
                                />
                                <div className="absolute inset-0 bg-gradient-to-t from-black via-black/35 to-transparent" />
                                <div className="absolute inset-x-0 top-0 h-[2px] bg-gradient-to-r from-pink-500 via-pink-700 to-transparent opacity-80" />

                                <div className="absolute bottom-0 left-0 right-0 p-5 text-white md:p-6">
                                    <p className="text-[11px] font-bold uppercase text-pink-200">
                                        {item.categoryName ?? '-'}
                                    </p>
                                    <h3 className="mt-3 text-2xl font-black uppercase leading-[1.25] md:text-3xl">
                                        {item.name}
                                    </h3>
                                    <div className={`mt-5 flex items-end gap-4 ${item.hidePriceOnCard ? 'justify-end' : 'justify-between'}`}>
                                        {!item.hidePriceOnCard && item.price !== null && (
                                            <p className="bg-gradient-to-r from-pink-500 via-pink-600 to-pink-700 bg-clip-text text-2xl font-black uppercase text-transparent md:text-3xl">
                                                ฿{item.price.toLocaleString()}
                                            </p>
                                        )}
                                        {/* Visual affordance only - the whole card is the link. */}
                                        <span className="border border-white/70 px-3 py-1 text-[10px] font-black uppercase text-white transition group-hover:border-pink-500 group-hover:text-pink-500">
                                            ดูสินค้า
                                        </span>
                                    </div>
                                </div>
                            </Link>
                        ))}
                    </div>
                </div>

                {products.length === 0 && (
                    <p className="mt-4 text-sm font-semibold text-slate-600 dark:text-slate-300">
                        ยังไม่มีสินค้าใหม่สำหรับแสดงผล
                    </p>
                )}
            </div>
        </section>
    );
}
