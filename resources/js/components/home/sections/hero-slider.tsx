import { useEffect, useState } from 'react';
import { trackSiteClick } from '@/lib/track-click';

const defaultHeroSlides = [
    '/images/logos/braner1.png',
    '/images/logos/braner2.png',
    '/images/logos/braner3.png',
];

type HeroSliderProps = {
    slides: string[];
};

export default function HeroSlider({ slides }: HeroSliderProps) {
    const [slideCursor, setSlideCursor] = useState(0);
    const effectiveHeroSlides = slides.length > 0 ? slides : defaultHeroSlides;
    // Derived so a shrinking banner list can never leave the cursor out of range.
    const activeSlide = slideCursor % effectiveHeroSlides.length;

    useEffect(() => {
        if (typeof window === 'undefined') {
            return;
        }

        const mediaQuery = window.matchMedia('(prefers-reduced-motion: reduce)');

        if (mediaQuery.matches) {
            return;
        }

        const timer = window.setInterval(() => {
            setSlideCursor((previous) => (previous + 1) % effectiveHeroSlides.length);
        }, 5000);

        return () => window.clearInterval(timer);
    }, [effectiveHeroSlides.length]);

    return (
        <section className="relative min-h-[27vh] w-full overflow-hidden md:min-h-[85vh]">
            <div className="absolute inset-0">
                {effectiveHeroSlides.map((image, index) => (
                    <img
                        key={image}
                        src={image}
                        alt="JS SPORT x ME SPORT hero"
                        className={`absolute inset-0 h-full w-full object-cover transition-all duration-1000 ${
                            activeSlide === index
                                ? 'animate-sport-zoom-out opacity-100'
                                : 'scale-[1.08] opacity-0'
                        }`}
                    />
                ))}
                <div className="absolute inset-0 bg-gradient-to-r from-black/85 via-black/55 to-black/20" />
                <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-transparent to-black/20" />
            </div>

            <div className="relative mx-auto flex min-h-[27vh] w-full max-w-7xl items-end px-4 pb-6 pt-10 text-white md:min-h-[85vh] md:px-8 md:pb-20 md:pt-24">
                <div className="max-w-4xl">
                    <div key={activeSlide}>
                        <h1 className="-skew-x-12 text-5xl font-black uppercase leading-[0.82] tracking-tight animate-slide-up-fade md:text-7xl lg:text-8xl">
                            <span className="block skew-x-12 animate-skew-reveal animation-delay-100 bg-gradient-to-r from-blue-700 via-red-600 to-white bg-clip-text text-transparent drop-shadow-lg">
                                JS SPORT
                            </span>
                            <span className="block skew-x-12 animate-skew-reveal animation-delay-200 bg-gradient-to-r from-blue-700 via-sky-400 to-green-500 bg-clip-text text-transparent drop-shadow-lg">
                                {' '}
                                ME SPORT
                            </span>
                        </h1>
                        <p className="mt-6 max-w-2xl animate-slide-up-fade animation-delay-300 text-sm font-medium text-white/85 md:text-base">
                            เสื้อแข่งสั่งทำและอุปกรณ์กีฬาระดับพรีเมียม
                            สำหรับทีมที่ต้องการภาพลักษณ์มืออาชีพและความมั่นใจทุกครั้งที่ลงสนาม
                        </p>
                    </div>
                </div>

                <div className="absolute bottom-8 right-4 flex items-center gap-2 md:right-8">
                    {effectiveHeroSlides.map((image, index) => (
                        <button
                            key={image}
                            type="button"
                            aria-label={`ไปยังสไลด์ ${index + 1}`}
                            onClick={() => {
                                setSlideCursor(index);
                                trackSiteClick({
                                    eventType: 'homepage_section_click',
                                    page: 'home',
                                    section: `hero_slide_${index + 1}`,
                                    referrer: window.location.href,
                                });
                            }}
                            className={`h-1.5 transition-all duration-300 ${
                                activeSlide === index
                                    ? 'w-12 bg-pink-500'
                                    : 'w-5 bg-white/60 hover:bg-white'
                            }`}
                            style={{
                                clipPath:
                                    'polygon(0 0, calc(100% - 6px) 0, 100% 100%, 6px 100%)',
                            }}
                        />
                    ))}
                </div>
            </div>
        </section>
    );
}
