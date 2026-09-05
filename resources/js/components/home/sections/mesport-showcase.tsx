import { Link } from '@inertiajs/react';
import { useRef, useState } from 'react';
import { HOME_PRODUCT_FALLBACK_IMAGE } from '@/components/home/types';
import type { HomeProductItem } from '@/components/home/types';
import { buildLoopedTrack, handleCarouselArrowKeys, useAutoScrollCarousel } from '@/components/home/use-auto-scroll-carousel';
import { trackSiteClick } from '@/lib/track-click';

const mesportShowcaseTitle = 'ME SPORT STUDIO';
const mesportShowcaseChars = mesportShowcaseTitle.split('');
const cardLayoutClass = 'w-[78vw] max-w-[320px] min-h-[300px] md:w-[320px] md:min-h-[380px]';

type MesportShowcaseProps = {
    products: HomeProductItem[];
};

export default function MesportShowcase({ products }: MesportShowcaseProps) {
    const [isPaused, setIsPaused] = useState(false);
    const carouselRef = useAutoScrollCarousel<HTMLDivElement>(isPaused, 0.45);
    const dragStateRef = useRef({
        isDragging: false,
        startX: 0,
        startScrollLeft: 0,
    });

    const cards = products.map((product) => ({
        id: product.id,
        title: product.name,
        imageUrl: product.imageUrl ?? HOME_PRODUCT_FALLBACK_IMAGE,
    }));
    const carouselItems = buildLoopedTrack(cards, 8);

    const handleMouseDown = (event: React.MouseEvent<HTMLDivElement>) => {
        const carousel = carouselRef.current;

        if (!carousel) {
            return;
        }

        dragStateRef.current = {
            isDragging: true,
            startX: event.pageX,
            startScrollLeft: carousel.scrollLeft,
        };
        setIsPaused(true);
    };

    const handleMouseMove = (event: React.MouseEvent<HTMLDivElement>) => {
        const carousel = carouselRef.current;

        if (!carousel || !dragStateRef.current.isDragging) {
            return;
        }

        event.preventDefault();
        const deltaX = event.pageX - dragStateRef.current.startX;
        const loopPoint = carousel.scrollWidth / 2;
        carousel.scrollLeft = dragStateRef.current.startScrollLeft - deltaX;

        if (carousel.scrollLeft < 0) {
            carousel.scrollLeft += loopPoint;
        } else if (carousel.scrollLeft >= loopPoint) {
            carousel.scrollLeft -= loopPoint;
        }
    };

    const handleMouseUp = () => {
        dragStateRef.current.isDragging = false;
        setIsPaused(false);
    };

    return (
        <section className="bg-white py-12 dark:bg-transparent md:py-16">
            <div className="mx-auto max-w-7xl px-4 md:px-8">
                <div className="mb-8 md:mb-10">
                    <p className="text-xs font-black uppercase tracking-[0.24em] text-pink-500">
                        ME SPORT  STUDIO
                    </p>
                    <h2 className="mt-2 -skew-x-6 text-3xl font-black uppercase tracking-tight text-slate-900 dark:text-white md:text-6xl">
                        <span className="mesport-wave inline-block skew-x-6">
                            {mesportShowcaseChars.map((character, index) => (
                                <span
                                    key={`${character}-${index}`}
                                    className="mesport-wave-char"
                                    style={{
                                        animationDelay: `${index * 0.05}s`,
                                        '--wave-index': index,
                                        '--wave-count': mesportShowcaseChars.length,
                                    } as React.CSSProperties}
                                >
                                    {character === ' ' ? '\u00A0' : character}
                                </span>
                            ))}
                        </span>
                    </h2>
                    <p className="mt-4 max-w-3xl text-sm font-medium text-slate-600 dark:text-slate-300 md:text-base">
                        เสื้อกีฬาและอุปกรณ์กีฬาระดับพรีเมียม
                        สำหรับทีมที่ต้องการภาพลักษณ์มืออาชีพและความมั่นใจทุกครั้งที่ลงสนาม
                    </p>
                </div>

                <div
                    ref={carouselRef}
                    role="group"
                    aria-label="สินค้า ME SPORT — ใช้ปุ่มลูกศรเพื่อเลื่อน"
                    tabIndex={0}
                    className="max-w-full cursor-grab overflow-x-auto pb-2 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-500 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden active:cursor-grabbing"
                    onKeyDown={handleCarouselArrowKeys}
                    onFocus={() => setIsPaused(true)}
                    onBlur={() => setIsPaused(false)}
                    onMouseDown={handleMouseDown}
                    onMouseMove={handleMouseMove}
                    onMouseUp={handleMouseUp}
                    onMouseLeave={handleMouseUp}
                >
                    <div className="flex w-max max-w-full items-stretch gap-5">
                        {carouselItems.map((item, index) => (
                            <Link
                                key={`${item.id}-${index}`}
                                href={`/products/${item.id}`}
                                className={`group relative shrink-0 overflow-hidden border border-emerald-200/70 shadow-[0_18px_45px_-25px_rgba(3,105,161,0.55)] dark:border-emerald-400/30 ${cardLayoutClass}`}
                                style={{
                                    clipPath:
                                        'polygon(0 0, calc(100% - 30px) 0, 100% 30px, 100% 100%, 0 100%)',
                                }}
                                onMouseEnter={() => setIsPaused(true)}
                                onMouseLeave={() => setIsPaused(false)}
                                onFocus={() => setIsPaused(true)}
                                onBlur={() => setIsPaused(false)}
                                onClick={() => trackSiteClick({
                                    eventType: 'product_click',
                                    page: 'home',
                                    productId: item.id,
                                    productName: item.title,
                                    referrer: window.location.href,
                                })}
                                aria-label={`ไปยังสินค้า ${item.title}`}
                            >
                                <img
                                    src={item.imageUrl}
                                    alt={item.title}
                                    className="absolute inset-0 h-full w-full object-cover transition duration-1000 group-hover:scale-110"
                                />
                                <div className="absolute inset-x-0 top-0 h-[2px] bg-gradient-to-r from-emerald-300 via-sky-300 to-white/70 opacity-90" />
                            </Link>
                        ))}
                    </div>
                </div>

                {products.length === 0 && (
                    <p className="mt-4 text-sm font-semibold text-slate-600 dark:text-slate-300">
                        ยังไม่มีสินค้า <span className="font-black">MESPORT</span> ที่เปิดใช้งานสำหรับแสดงผล
                    </p>
                )}
            </div>
        </section>
    );
}
