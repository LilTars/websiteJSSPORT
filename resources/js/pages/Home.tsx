import { Head, Link } from '@inertiajs/react';
import { useEffect, useState } from 'react';
import type { ReactElement, ReactNode } from 'react';
import PublicLayout from '@/layouts/public-layout';

type SocialProofItem = {
    value: string;
    label: string;
};

type LookbookItem = {
    title: string;
    kicker: string;
    imageUrl: string;
    layoutClass: string;
};

type HighlightItem = {
    title: string;
    category: string;
    price: string;
    imageUrl: string;
};

type LabFeature = {
    title: string;
    detail: string;
};

const socialProofItems: SocialProofItem[] = [
    {
        value: '120+',
        label: 'ทีมที่ไว้วางใจสั่งผลิต',
    },
    {
        value: '50,000+',
        label: 'ตัวที่ผลิตและส่งมอบแล้ว',
    },
];

const lookbookItems: LookbookItem[] = [
    {
        title: 'CUSTOM JERSEYS',
        kicker: 'LOOKBOOK / 01',
        imageUrl:
            'https://static.nike.com/a/images/t_web_pw_592_v2/f_auto/u_9ddf04c7-2a9a-4d76-add1-d15af8f0263d,c_scale,fl_relative,w_1.0,h_1.0,fl_layer_apply/974fc9e7-ed50-4038-b850-19c11b5e0221/NIKE+X+LEGO+COL+AEROFIT+J+JSY.png',
        layoutClass: 'md:col-span-7 md:row-span-2 min-h-[560px] md:min-h-[760px]',
    },
    {
        title: 'PE KITS',
        kicker: 'CAMPAIGN / 02',
        imageUrl:
            'https://static.nike.com/a/images/t_web_pw_592_v2/f_auto/u_9ddf04c7-2a9a-4d76-add1-d15af8f0263d,c_scale,fl_relative,w_1.0,h_1.0,fl_layer_apply/49cc0423-c8f5-4c6c-8c85-e382de0b11b8/NIKE+X+LEGO+COL+AEROFIT+F+JSY.png',
        layoutClass: 'md:col-span-5 min-h-[340px] md:min-h-[370px]',
    },
    {
        title: 'GEAR & SHOES',
        kicker: 'CAMPAIGN / 03',
        imageUrl:
            'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSK7Npo89uhyHeCvfb88ydaY7-ZvFPT3FOnbvdkOw1TPOTZYPRM0MSb9ViL&s=10',
        layoutClass: 'md:col-span-5 min-h-[340px] md:min-h-[370px]',
    },
];

const highlightItems: HighlightItem[] = [
    {
        title: 'STORM ELITE JERSEY',
        category: 'CUSTOM JERSEY',
        price: '฿890',
        imageUrl:
            'https://images.unsplash.com/photo-1517649763962-0c623066013b?auto=format&fit=crop&w=1400&q=80',
    },
    {
        title: 'ACTIVE SCHOOL PE KIT',
        category: 'PE KITS',
        price: '฿540',
        imageUrl:
            'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?auto=format&fit=crop&w=1400&q=80',
    },
    {
        title: 'VELOCITY GRIP PRO',
        category: 'SHOES',
        price: '฿1,590',
        imageUrl:
            'https://images.unsplash.com/photo-1542291026-7eec264c27ff?auto=format&fit=crop&w=1400&q=80',
    },
    {
        title: 'TEAM DRILL GEAR SET',
        category: 'TRAINING GEAR',
        price: '฿320',
        imageUrl:
            'https://images.unsplash.com/photo-1431324155629-1a6deb1dec8d?auto=format&fit=crop&w=1400&q=80',
    },
];

const labFeatures: LabFeature[] = [
    {
        title: 'CUSTOM SUBLIMATION',
        detail: 'สีคม ลายเต็มผืน และงานกราฟิกเฉพาะทีมโดยไม่ซีดง่าย',
    },
    {
        title: 'PREMIUM FABRIC',
        detail: 'ผ้าระบายอากาศดี น้ำหนักเบา และรองรับการใช้งานหนักตลอดฤดูกาล',
    },
    {
        title: 'FAST TURNAROUND',
        detail: 'วางแพตเทิร์น ผลิต และส่งมอบไวตามรอบแข่งขันของทีมคุณ',
    },
];

const heroSlides = [
    'https://static.nike.com/a/images/f_auto/dpr_3.0,cs_srgb/h_411,c_limit/02ecceec-1877-4510-a770-c5a1d4948ea8/nike-soccer.jpg',
    'https://scontent.fbkk13-1.fna.fbcdn.net/v/t39.99422-6/725664713_1295825706091578_4263662065487052615_n.png?stp=dst-jpg_tt6&cstp=mx2000x2000&ctp=s2000x2000&_nc_cat=105&ccb=1-7&_nc_sid=833d8c&_nc_ohc=hnLJfeAF8lUQ7kNvwGXcmvF&_nc_oc=AdrM0b0wbQhphDgWjgYwDZYokp9jqb9493qfh5efXdhTu1PCBjptk54Y6kWJzm5Dd3q44Ft20JRN8buHdoInD9wC&_nc_zt=14&_nc_ht=scontent.fbkk13-1.fna&_nc_gid=tj24-QU85WJ4Rv9oMwXY7w&_nc_ss=7b289&oh=00_Af9AUatrZwD3M-Ld-sbas7XXZY3i03XzBvjZO7Ip2gO7YA&oe=6A42A234',
    'https://scontent.fbkk12-1.fna.fbcdn.net/v/t39.30808-6/699273755_1435722361930936_4320129232689528510_n.jpg?stp=dst-jpg_tt6&cstp=mx1533x1917&ctp=s1533x1917&_nc_cat=101&ccb=1-7&_nc_sid=127cfc&_nc_ohc=Tv8_ZFdFgTYQ7kNvwEmFh5s&_nc_oc=AdoQbalYTrZcZXEZp1CKiC0o0K2Z4XFGK7lPwnyiPeO_pQ0U4Qh9EPB9McYKo-lH75pRMcmQ_wpQx69963xcXGO5&_nc_zt=23&_nc_ht=scontent.fbkk12-1.fna&_nc_gid=0Fe7DDTJgQajF7ea0hCl5A&_nc_ss=7b289&oh=00_Af8W5g7fXKGbQ-NKYJf7j8A3AmoaZyvBv8hGEX78EJotLw&oe=6A428466',
];

const partnerBrandLogos = [
    {
        name: 'GRAND SPORT',
        logoUrl: 'https://21stwist.com/wp-content/uploads/2018/12/22_Grand-Sport.png',
    },
    {
        name: 'PAN',
        logoUrl: 'https://pan-thailand.com/cdn/shop/files/header-Logo-png_6a18beec-b343-4dfe-a19d-18191c13658b.png?v=1718160382',
    },
    {
        name: 'WINGZ',
        logoUrl: 'https://cdn1.sgliteasset.com/smtsport/images/brand/brand-14033/oF9HRVyj675195fc69164_1733400060.png',
    },
    {
        name: 'FBT',
        logoUrl: 'https://upload.wikimedia.org/wikipedia/commons/thumb/7/7d/FBT_Logo.svg/3840px-FBT_Logo.svg.png',
    },
    {
        name: 'PUMA',
        logoUrl: 'https://www.pngkey.com/png/full/899-8991479_puma-puma-logo.png',
    },
    {
        name: 'NIKE',
        logoUrl: 'https://pngimg.com/uploads/nike/nike_PNG17.png',
    },
];

const npfcFeaturedMosaicCards = [
    {
        label: 'NPFC Home Kit',
        imageUrl:
            'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQc_Qo1M0K6MoWKjkx5fCX9S5xeWKSotaoD1R6nn9jBV0NvYbma-cM9oP-O&s=10',
    },
    {
        label: 'NPFC Away Kit',
        imageUrl: 'https://down-th.img.susercontent.com/file/th-11134207-7ra0q-md9vzrnv653ya5',
    },
    {
        label: 'NPFC Third Kit',
        imageUrl:
            'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQMZ1UIAsVwHd6Cnr1fKecG2r_yd92rRHzaDR-FDG-wMVfmnmgDfntanEY&s=10',
    },
    {
        label: 'NPFC Goalkeeper Kit',
        imageUrl: 'https://down-th.img.susercontent.com/file/th-11134207-7r98u-lyngqjrcn54919',
    },
];

type PageWithLayout = {
    (): ReactElement;
    layout?: (page: ReactNode) => ReactNode;
};

const Home: PageWithLayout = () => {
    const [activeSlide, setActiveSlide] = useState(0);
    const [activeMosaicIndex, setActiveMosaicIndex] = useState<number | null>(null);

    useEffect(() => {
        const timer = window.setInterval(() => {
            setActiveSlide((previous) => (previous + 1) % heroSlides.length);
        }, 5000);

        return () => window.clearInterval(timer);
    }, []);

    useEffect(() => {
        const existingScript = document.getElementById('tiktok-embed-script');

        if (existingScript) {
            existingScript.remove();
        }

        const script = document.createElement('script');
        script.id = 'tiktok-embed-script';
        script.src = 'https://www.tiktok.com/embed.js';
        script.async = true;
        document.body.appendChild(script);

        return () => {
            script.remove();
        };
    }, []);

    return (
        <>
            <Head title="หน้าแรก" />

            <section className="relative left-1/2 min-h-[85vh] w-screen -translate-x-1/2 overflow-hidden">
                <div className="absolute inset-0">
                    {heroSlides.map((image, index) => (
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

                <div className="relative mx-auto flex min-h-[85vh] w-full max-w-7xl items-end px-4 pb-14 pt-24 text-white md:px-8 md:pb-20">
                    <div className="max-w-4xl">
                        <div key={activeSlide}>
                        <p className="mb-6 text-xs font-bold uppercase tracking-[0.3em] text-pink-200">
                            
                        </p>
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
                        <div className="mt-8 flex flex-wrap gap-3">
                            <Link
                                href="/contact"
                                className="inline-flex items-center bg-gradient-to-r from-blue-800 to-red-700 px-8 py-3 font-sans text-base font-bold tracking-wide text-white transition hover:-translate-y-0.5 hover:from-blue-900 hover:to-red-800"
                                style={{
                                    clipPath:
                                        'polygon(0 0, calc(100% - 16px) 0, 100% 16px, 100% 100%, 0 100%)',
                                }}
                            >
                                ดูสินค้าล่าสุด
                            </Link>
                            <Link
                                href="/contact"
                                className="inline-flex items-center border border-blue-500/50 bg-white/10 px-8 py-3 font-sans text-base font-bold tracking-wide text-white backdrop-blur-md transition hover:-translate-y-0.5 hover:border-blue-500 hover:bg-blue-800/80"
                                style={{
                                    clipPath:
                                        'polygon(0 0, calc(100% - 16px) 0, 100% 16px, 100% 100%, 0 100%)',
                                }}
                            >
                                สั่งผลิต / ขอราคา
                            </Link>
                        </div>
                    </div>

                    <div className="absolute bottom-8 right-4 flex items-center gap-2 md:right-8">
                        {heroSlides.map((image, index) => (
                            <button
                                key={image}
                                type="button"
                                aria-label={`ไปยังสไลด์ ${index + 1}`}
                                onClick={() => setActiveSlide(index)}
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

            <section className="py-12 md:py-16">
                <div className="mx-auto max-w-7xl px-4 md:px-8">
                    <p className="mb-8 text-xs font-semibold uppercase tracking-[0.28em] text-pink-500 md:mb-10">
                        OUR PARTNERS
                    </p>

                    <div className="overflow-hidden py-6">
                        <div
                            className="flex w-max whitespace-nowrap animate-marquee"
                            style={{ width: 'max-content' }}
                        >
                            {[0, 1].map((track) => (
                                <div
                                    key={track}
                                    className="flex items-center gap-10 pr-10 md:gap-14 md:pr-14"
                                >
                                    {partnerBrandLogos.map((brand, index) => (
                                        <img
                                            key={`${track}-${brand.name}`}
                                            src={brand.logoUrl}
                                            alt={`${brand.name} logo`}
                                            className={`h-10 w-auto object-contain transition-all duration-300 md:h-14 ${
                                                index % 2 === 0
                                                    ? 'hover:drop-shadow-[0_0_12px_rgba(37,99,235,0.35)]'
                                                    : 'hover:drop-shadow-[0_0_12px_rgba(220,38,38,0.35)]'
                                            }`}
                                            loading="lazy"
                                        />
                                    ))}
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </section>

            <section className="py-12 md:py-16">
                <div className="mx-auto max-w-7xl px-4 md:px-8">
                    <div className="mb-8 md:mb-10">
                        <p className="text-xs font-semibold uppercase tracking-[0.24em] text-pink-500">
                            EDITORIAL LOOKBOOK
                        </p>
                        <h2 className="mt-2 text-3xl font-black uppercase tracking-tight md:text-6xl">
                            CATEGORIES & CAMPAIGNS
                        </h2>
                    </div>

                    <div className="grid gap-5 md:grid-cols-12 md:grid-rows-2">
                        {lookbookItems.map((item) => (
                            <article
                                key={item.title}
                                className={`group relative overflow-hidden ${item.layoutClass}`}
                                style={{
                                    clipPath:
                                        'polygon(0 0, calc(100% - 32px) 0, 100% 32px, 100% 100%, 0 100%)',
                                }}
                            >
                                <img
                                    src={item.imageUrl}
                                    alt={item.title}
                                    className="absolute inset-0 h-full w-full object-cover transition duration-1000 group-hover:scale-110"
                                />
                                <div className="absolute inset-0 bg-gradient-to-br from-black/85 via-black/35 to-pink-800/45 transition duration-700 group-hover:from-black/70 group-hover:via-pink-900/40 group-hover:to-pink-500/40" />

                                <div className="relative flex h-full flex-col justify-end p-6 text-white md:p-8">
                                    <p className="text-[11px] font-bold uppercase tracking-[0.25em] text-pink-200">
                                        {item.kicker}
                                    </p>
                                    <h3 className="mt-3 -skew-x-12 text-4xl font-black uppercase leading-[0.82] md:text-6xl lg:text-7xl">
                                        <span className="block skew-x-12">{item.title}</span>
                                    </h3>
                                    <span className="mt-5 block h-[3px] w-16 bg-white transition-all duration-700 group-hover:w-52 group-hover:bg-pink-500" />
                                </div>
                            </article>
                        ))}
                    </div>
                </div>
            </section>

            <section className="py-12 md:py-16">
                <div className="mx-auto max-w-7xl px-4 md:px-8">
                    <div className="mb-8 flex items-end justify-between gap-6 md:mb-10">
                        <div>
                            <p className="text-xs font-semibold uppercase tracking-[0.24em] text-pink-500">
                                LATEST DROPS
                            </p>
                            <h2 className="-skew-x-12 text-4xl font-black uppercase tracking-tight md:text-6xl">
                                <span className="block skew-x-12">GEAR UP</span>
                            </h2>
                        </div>
                        <p className="text-xs font-bold uppercase tracking-[0.22em] text-sport-slate dark:text-slate-300">
                            ไฮไลท์สินค้า / swipe
                        </p>
                    </div>

                    <div className="overflow-x-auto snap-x snap-mandatory [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
                        <div className="flex min-w-max gap-5 pb-3 md:gap-6">
                            {highlightItems.map((item, index) => (
                                <article
                                    key={item.title}
                                    className="group relative h-[460px] w-[80vw] max-w-[360px] shrink-0 snap-start overflow-hidden border-2 border-black/90 bg-white/30 transition duration-300 hover:-translate-y-2 hover:border-pink-500 hover:shadow-[14px_14px_0_0_rgba(236,72,153,0.55)] dark:border-white/85"
                                    style={{
                                        clipPath:
                                            'polygon(0 0, calc(100% - 28px) 0, 100% 28px, 100% 100%, 0 100%, 0 0)',
                                    }}
                                >
                                    <div className="absolute inset-0 bg-black" />
                                    <img
                                        src={item.imageUrl}
                                        alt={item.title}
                                        className="absolute inset-0 h-full w-full object-cover transition duration-700 group-hover:scale-110"
                                    />
                                    <div className="absolute inset-0 bg-gradient-to-t from-black via-black/35 to-transparent" />
                                    <div className="absolute inset-x-0 top-0 h-[2px] bg-gradient-to-r from-pink-500 via-pink-700 to-transparent opacity-80" />

                                    <div className="absolute bottom-0 left-0 right-0 p-5 text-white md:p-6">
                                        <p className="text-[11px] font-bold uppercase tracking-[0.24em] text-pink-200">
                                            {item.category}
                                        </p>
                                        <h3 className="mt-3 text-2xl font-black uppercase leading-[0.92] md:text-3xl">
                                            {item.title}
                                        </h3>
                                        <div className="mt-5 flex items-end justify-between gap-4">
                                            <p className="bg-gradient-to-r from-pink-500 via-pink-600 to-pink-700 bg-clip-text text-2xl font-black uppercase text-transparent md:text-3xl">
                                                {item.price}
                                            </p>
                                            <Link
                                                href={`/products/${index + 1}`}
                                                className="border border-white/70 px-3 py-1 text-[10px] font-black uppercase tracking-[0.22em] text-white transition group-hover:border-pink-500 group-hover:text-pink-500"
                                            >
                                                View Drop
                                            </Link>
                                        </div>
                                    </div>
                                </article>
                            ))}
                        </div>
                    </div>
                </div>
            </section>

            <section className="py-12 md:py-16">
                <div className="mx-auto max-w-7xl px-4 md:px-8">
                    <div className="mb-8 md:mb-10">
                        <p className="text-xs font-semibold uppercase tracking-[0.28em] text-pink-500">
                            EXCLUSIVE DROP / คอลเลกชันล่าสุด
                        </p>
                        <h2 className="mt-3 text-2xl font-black uppercase tracking-tight md:text-3xl">
                            สโมสรฟุตบอลหนองบัว พิชญ FC

                        </h2>
                    </div>

                    <div
                        className="-mx-4 overflow-x-auto px-4 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden md:mx-0 md:px-0"
                        onMouseLeave={() => setActiveMosaicIndex(null)}
                    >
                        <div className="flex min-w-max items-start gap-4 pb-4 md:grid md:min-w-0 md:grid-cols-4 md:gap-6 md:pb-0">
                            {npfcFeaturedMosaicCards.map((card, index) => {
                                const isActive = activeMosaicIndex === index;
                                const hasActive = activeMosaicIndex !== null;

                                return (
                                    <article
                                        key={card.label}
                                        onMouseEnter={() => setActiveMosaicIndex(index)}
                                        onFocus={() => setActiveMosaicIndex(index)}
                                        onTouchStart={() => setActiveMosaicIndex(index)}
                                        className={`relative w-[68vw] max-w-[280px] shrink-0 transition-all duration-500 ease-out md:w-auto md:max-w-none md:shrink ${
                                            isActive
                                                ? 'z-20 -translate-y-4 scale-110 opacity-100 shadow-2xl'
                                                : hasActive
                                                  ? 'z-0 opacity-60'
                                                  : 'z-0 opacity-100'
                                        }`}
                                    >
                                        <div className="relative aspect-[3/4] overflow-hidden bg-black">
                                            <img
                                                src={card.imageUrl}
                                                alt={card.label}
                                                className="h-full w-full object-cover"
                                                loading="lazy"
                                            />
                                            <div className="absolute inset-0 bg-gradient-to-t from-black/35 via-transparent to-transparent" />
                                        </div>

                                        <p className="mt-3 text-sm font-black uppercase tracking-[0.1em] text-black md:text-base dark:text-white">
                                            {card.label}
                                        </p>
                                    </article>
                                );
                            })}
                        </div>
                    </div>
                </div>
            </section>

            <section className="py-12 md:py-16">
                <div className="mx-auto max-w-7xl px-4 md:px-8">
                    <div
                        className="group relative min-h-[720px] overflow-hidden"
                        style={{
                            clipPath:
                                'polygon(0 0, calc(100% - 42px) 0, 100% 42px, 100% 100%, 0 100%)',
                        }}
                    >
                        <img
                            src="https://images.unsplash.com/photo-1512436991641-6745cdb1723f?auto=format&fit=crop&w=1800&q=80"
                            alt="Jersey production"
                            className="absolute inset-0 h-full w-full object-cover transition duration-1000 group-hover:scale-105"
                        />
                        <div className="absolute inset-0 bg-gradient-to-br from-black/90 via-black/55 to-pink-900/45" />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-transparent to-transparent" />

                        <div className="relative flex min-h-[720px] flex-col justify-between p-6 text-white md:p-10 lg:p-14">
                            <div className="mb-8 md:mb-10">
                                <p className="text-xs font-semibold uppercase tracking-[0.26em] text-pink-200">
                                    THE LAB / กระบวนการผลิต
                                </p>
                                <h2 className="mt-5 max-w-4xl -skew-x-12 text-4xl font-black uppercase leading-[0.82] tracking-tight md:text-6xl lg:text-7xl">
                                    <span className="block skew-x-12">PRECISION IN</span>
                                    <span className="block skew-x-12">EVERY STITCH</span>
                                </h2>
                                <p className="mt-6 max-w-2xl text-sm font-medium leading-relaxed text-white/85 md:text-base">
                                    ตั้งแต่การเลือกผ้า วางแพตเทิร์น พิมพ์ลาย จนถึงการเย็บประกอบ
                                    ทุกขั้นตอนถูกออกแบบเพื่อให้เสื้อทีมของคุณดูเฉียบ คม และพร้อมแข่งจริง
                                </p>
                            </div>

                            <div className="grid gap-4 md:grid-cols-3 md:items-end">
                                {labFeatures.map((feature) => (
                                    <div
                                        key={feature.title}
                                        className="border border-white/20 bg-white/10 p-4 backdrop-blur-md md:p-5"
                                        style={{
                                            clipPath:
                                                'polygon(0 0, calc(100% - 18px) 0, 100% 18px, 100% 100%, 0 100%)',
                                        }}
                                    >
                                        <p className="text-[11px] font-black uppercase tracking-[0.24em] text-pink-500">
                                            {feature.title}
                                        </p>
                                        <p className="mt-3 text-sm leading-relaxed text-white/80">
                                            {feature.detail}
                                        </p>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            <section className="py-12 md:py-16">
                <div className="mx-auto grid max-w-7xl gap-10 px-4 md:grid-cols-2 md:items-stretch md:gap-12 md:px-8">
                    <div className="flex flex-col justify-center">
                        <p className="inline-flex items-center gap-2 text-xs font-bold uppercase tracking-[0.24em] text-red-500">
                            <span className="relative inline-flex h-2.5 w-2.5">
                                <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-red-500 opacity-75" />
                                <span className="relative inline-flex h-2.5 w-2.5 rounded-full bg-red-500" />
                            </span>
                            LIVE NOW
                        </p>
                        <h2 className="mt-5 -skew-x-12 text-5xl font-black uppercase leading-[0.8] md:text-7xl">
                            <span className="block skew-x-12">LIVE ON</span>
                            <span className="block skew-x-12 text-red-600">TIKTOK</span>
                        </h2>
                        <p className="mt-6 max-w-lg text-sm font-medium text-sport-slate dark:text-slate-300 md:text-base">
                            อัปเดตสินค้าใหม่ โปรโมชัน และตัวอย่างงานจริงจากหน้าร้านแบบเรียลไทม์
                            พร้อมพูดคุยรายละเอียดการสั่งผลิตกับทีมงานได้ทันที
                        </p>
                    </div>

                    <div
                        className="relative min-h-[460px] overflow-hidden"
                        style={{
                            clipPath:
                                'polygon(8% 0, 100% 0, 100% 100%, 0 100%, 0 14%)',
                        }}
                    >
                        <div className="flex h-full min-h-[460px] items-center justify-center bg-black px-4 py-6">
                            <blockquote
                                className="tiktok-embed !m-0 w-full max-w-[780px] min-w-[288px]"
                                cite="https://www.tiktok.com/@j.s.sport_shop"
                                data-unique-id="j.s.sport_shop"
                                data-embed-type="creator"
                            >
                                <section>
                                    <a
                                        target="_blank"
                                        rel="noreferrer"
                                        href="https://www.tiktok.com/@j.s.sport_shop?refer=creator_embed"
                                    >
                                        @j.s.sport_shop
                                    </a>
                                </section>
                            </blockquote>
                        </div>
                    </div>
                </div>
            </section>
        </>
    );
};

Home.layout = (page: ReactNode) => <PublicLayout>{page}</PublicLayout>;

export default Home;
