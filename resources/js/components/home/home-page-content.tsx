import { Link } from '@inertiajs/react';
import { useEffect, useRef, useState } from 'react';
import { productCategoryLabelsMock, productsMock } from '@/mock/menu-data';

type LookbookItem = {
    title: string;
    kicker: string;
    imageUrl: string;
    layoutClass: string;
};

const lookbookItems: LookbookItem[] = [
    {
        title: 'ชุดพละนักเรียน',
        kicker: 'LOOKBOOK / 01',
        imageUrl: '/images/logos/Pd02.png',
        layoutClass: 'md:col-span-7 md:row-span-2 min-h-[560px] md:min-h-[760px]',
    },
    {
        title: 'ชุดกีฬา',
        kicker: 'CAMPAIGN / 02',
        imageUrl:
            'https://static.nike.com/a/images/t_web_pw_592_v2/f_auto/u_9ddf04c7-2a9a-4d76-add1-d15af8f0263d,c_scale,fl_relative,w_1.0,h_1.0,fl_layer_apply/49cc0423-c8f5-4c6c-8c85-e382de0b11b8/NIKE+X+LEGO+COL+AEROFIT+F+JSY.png',
        layoutClass: 'md:col-span-5 min-h-[340px] md:min-h-[370px]',
    },
    {
        title: 'รองเท้ากีฬา',
        kicker: 'CAMPAIGN / 03',
        imageUrl: '/images/logos/Pd03.jpg',
        layoutClass: 'md:col-span-5 min-h-[340px] md:min-h-[370px]',
    },
];

const mesportFashionItems: LookbookItem[] = [
    {
        title: '',
        kicker: '',
        imageUrl: '/images/logos/Pd06.jpg',
        layoutClass: 'w-[78vw] max-w-[320px] min-h-[300px] md:w-[320px] md:min-h-[380px]',
    },
    {
        title: '',
        kicker: '',
        imageUrl: '/images/logos/Pd04.jpg',
        layoutClass: 'w-[78vw] max-w-[320px] min-h-[300px] md:w-[320px] md:min-h-[380px]',
    },
    {
        title: '',
        kicker: '',
        imageUrl: '/images/logos/Pd05.jpg',
        layoutClass: 'w-[78vw] max-w-[320px] min-h-[300px] md:w-[320px] md:min-h-[380px]',
    },
    {
        title: '',
        kicker: '',
        imageUrl: '/images/logos/Pd07.jpg',
        layoutClass: 'w-[78vw] max-w-[320px] min-h-[300px] md:w-[320px] md:min-h-[380px]',
    },
    {
        title: '',
        kicker: '',
        imageUrl: '/images/logos/Pd04.jpg',
        layoutClass: 'w-[78vw] max-w-[320px] min-h-[300px] md:w-[320px] md:min-h-[380px]',
    },
    {
        title: '',
        kicker: '',
        imageUrl: '/images/logos/Pd05.jpg',
        layoutClass: 'w-[78vw] max-w-[320px] min-h-[300px] md:w-[320px] md:min-h-[380px]',
    },
    {
        title: '',
        kicker: '',
        imageUrl: '/images/logos/Pd06.jpg',
        layoutClass: 'w-[78vw] max-w-[320px] min-h-[300px] md:w-[320px] md:min-h-[380px]',
    },
    {
        title: '',
        kicker: '',
        imageUrl: '/images/logos/Pd07.jpg',
        layoutClass: 'w-[78vw] max-w-[320px] min-h-[300px] md:w-[320px] md:min-h-[380px]',
    },
];

const mesportShowcaseTitle = 'ME SPORT STUDIO';

const heroSlides = [
    '/images/logos/braner1.png',
    '/images/logos/braner2.png',
    '/images/logos/braner3.png',
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
        name: 'ZETA',
        logoUrl: 'https://scontent.fbkk12-1.fna.fbcdn.net/v/t39.30808-6/450898921_981867100300080_3656416687120076500_n.jpg?stp=dst-jpg_tt6&cstp=mx709x713&ctp=s709x713&_nc_cat=101&ccb=1-7&_nc_sid=6ee11a&_nc_ohc=__uWXUuPr2EQ7kNvwHW20t5&_nc_oc=AdpKPczUIPp9K8dyg2HDrr4uEyvXBkVUhi8NOSB8CbQY6-QGuB_jqN2PEg5xkOZEaP5QzJtvi_BVizI63bg1kpk2&_nc_zt=23&_nc_ht=scontent.fbkk12-1.fna&_nc_gid=sJ5wgKc3llQvPhn3RLhy1w&_nc_ss=7b289&oh=00_AQDdxcN3JFou-A2HbSYSSt6ARo7a8BcpXMu_UUcIjAf8Ww&oe=6A5E7D82',
    },
    {
        name: 'NIKE',
        logoUrl: 'https://pngimg.com/uploads/nike/nike_PNG17.png',
    },
];

const npfcFeaturedMosaicCards = [
    {
        label: '',
        imageUrl:
            'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQc_Qo1M0K6MoWKjkx5fCX9S5xeWKSotaoD1R6nn9jBV0NvYbma-cM9oP-O&s=10',
    },
    {
        label: '',
        imageUrl: 'https://down-th.img.susercontent.com/file/th-11134207-7ra0q-md9vzrnv653ya5',
    },
    {
        label: '',
        imageUrl:
            'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQMZ1UIAsVwHd6Cnr1fKecG2r_yd92rRHzaDR-FDG-wMVfmnmgDfntanEY&s=10',
    },
    {
        label: '',
        imageUrl: 'https://down-th.img.susercontent.com/file/th-11134207-7r98u-lyngqjrcn54919',
    },
];

const HomePageContent = () => {
    const [activeSlide, setActiveSlide] = useState(0);
    const [activeMosaicIndex, setActiveMosaicIndex] = useState<number | null>(null);
    const [isMesportCarouselPaused, setIsMesportCarouselPaused] = useState(false);
    const mesportCarouselItems = [...mesportFashionItems, ...mesportFashionItems];
    const mesportCarouselRef = useRef<HTMLDivElement | null>(null);
    const mesportDragStateRef = useRef({
        isDragging: false,
        startX: 0,
        startScrollLeft: 0,
    });

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

    useEffect(() => {
        if (isMesportCarouselPaused) {
            return;
        }

        let frameId = 0;

        const tick = () => {
            const carousel = mesportCarouselRef.current;

            if (!carousel) {
                frameId = window.requestAnimationFrame(tick);

                return;
            }

            carousel.scrollLeft += 0.45;
            const loopPoint = carousel.scrollWidth / 2;

            if (carousel.scrollLeft >= loopPoint) {
                carousel.scrollLeft -= loopPoint;
            }

            frameId = window.requestAnimationFrame(tick);
        };

        frameId = window.requestAnimationFrame(tick);

        return () => {
            window.cancelAnimationFrame(frameId);
        };
    }, [isMesportCarouselPaused]);

    const handleMesportMouseDown = (event: React.MouseEvent<HTMLDivElement>) => {
        const carousel = mesportCarouselRef.current;

        if (!carousel) {
            return;
        }

        mesportDragStateRef.current = {
            isDragging: true,
            startX: event.pageX,
            startScrollLeft: carousel.scrollLeft,
        };
        setIsMesportCarouselPaused(true);
    };

    const handleMesportMouseMove = (event: React.MouseEvent<HTMLDivElement>) => {
        const carousel = mesportCarouselRef.current;

        if (!carousel || !mesportDragStateRef.current.isDragging) {
            return;
        }

        event.preventDefault();
        const deltaX = event.pageX - mesportDragStateRef.current.startX;
        const loopPoint = carousel.scrollWidth / 2;
        carousel.scrollLeft = mesportDragStateRef.current.startScrollLeft - deltaX;

        if (carousel.scrollLeft < 0) {
            carousel.scrollLeft += loopPoint;
        } else if (carousel.scrollLeft >= loopPoint) {
            carousel.scrollLeft -= loopPoint;
        }
    };

    const handleMesportMouseUp = () => {
        mesportDragStateRef.current.isDragging = false;
        setIsMesportCarouselPaused(false);
    };

    return (
        <div className="relative isolate bg-white dark:bg-slate-950">
                <div className="pointer-events-none absolute inset-0 -z-10 bg-[linear-gradient(to_top,rgba(251,113,133,0.14),rgba(255,255,255,0.96)_28%,rgba(255,255,255,1)_60%),radial-gradient(circle_at_12%_18%,rgba(244,114,182,0.14),transparent_34%),radial-gradient(circle_at_84%_20%,rgba(248,113,113,0.1),transparent_30%)] dark:bg-[linear-gradient(to_top,rgba(244,63,94,0.16),rgba(2,6,23,0.92)_30%,rgba(2,6,23,1)_62%),radial-gradient(circle_at_12%_18%,rgba(244,114,182,0.2),transparent_36%),radial-gradient(circle_at_84%_20%,rgba(59,130,246,0.14),transparent_34%)]" />

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
                    <div className="mb-8 md:mb-10">
                        <p className="text-xs font-semibold uppercase tracking-[0.24em] text-pink-500">
                            คัตตาล็อกแฟชั่น
                        </p>
                        <h2 className="mt-2 text-3xl font-black uppercase tracking-tight md:text-6xl">
                            <span className="bg-gradient-to-r from-pink-500 to-red-600 bg-clip-text text-transparent">
                                หมวดหมู่ และแคมเปญ
                            </span>
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

            <section className="bg-white py-12 md:py-16">
                <div className="mx-auto max-w-7xl px-4 md:px-8">
                    <div className="mb-8 md:mb-10">
                        <p className="text-xs font-semibold uppercase tracking-[0.24em] text-pink-500">
                            ME SPORT  STUDIO
                        </p>
                        <h2 className="mt-2 -skew-x-6 text-3xl font-black uppercase tracking-tight text-slate-900 md:text-6xl">
                            <span className="mesport-wave inline-block skew-x-6 bg-gradient-to-r from-blue-600 via-cyan-500 to-emerald-500 bg-clip-text text-transparent">
                                {mesportShowcaseTitle.split('').map((character, index) => (
                                    <span
                                        key={`${character}-${index}`}
                                        className="mesport-wave-char"
                                        style={{ animationDelay: `${index * 0.05}s` }}
                                    >
                                        {character === ' ' ? '\u00A0' : character}
                                    </span>
                                ))}
                            </span>
                        </h2>
                        <p className="mt-4 max-w-3xl text-sm font-medium text-slate-600 md:text-base">
                            เสื้อกีฬาและอุปกรณ์กีฬาระดับพรีเมียม
                            สำหรับทีมที่ต้องการภาพลักษณ์มืออาชีพและความมั่นใจทุกครั้งที่ลงสนาม
                        </p>
                    </div>

                    <div
                        ref={mesportCarouselRef}
                        className="cursor-grab overflow-x-auto pb-2 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden active:cursor-grabbing"
                        onMouseDown={handleMesportMouseDown}
                        onMouseMove={handleMesportMouseMove}
                        onMouseUp={handleMesportMouseUp}
                        onMouseLeave={handleMesportMouseUp}
                    >
                        <div
                            className="flex min-w-max items-stretch gap-5"
                        >
                            {mesportCarouselItems.map((item, index) => (
                                <Link
                                    key={`${item.title}-${index}`}
                                    href="/products?category=Mesport"
                                    className={`group relative shrink-0 overflow-hidden border border-emerald-200/70 shadow-[0_18px_45px_-25px_rgba(3,105,161,0.55)] ${item.layoutClass}`}
                                    style={{
                                        clipPath:
                                            'polygon(0 0, calc(100% - 30px) 0, 100% 30px, 100% 100%, 0 100%)',
                                    }}
                                    onMouseEnter={() => setIsMesportCarouselPaused(true)}
                                    onMouseLeave={() => setIsMesportCarouselPaused(false)}
                                    onFocus={() => setIsMesportCarouselPaused(true)}
                                    onBlur={() => setIsMesportCarouselPaused(false)}
                                    aria-label="ไปยังสินค้าหมวด Mesport"
                                >
                                    <img
                                        src={item.imageUrl}
                                        alt={item.title}
                                        className="absolute inset-0 h-full w-full object-cover transition duration-1000 group-hover:scale-110"
                                    />
                                    <div className="absolute inset-x-0 top-0 h-[2px] bg-gradient-to-r from-emerald-300 via-sky-300 to-white/70 opacity-90" />

                                    <div className="relative flex h-full flex-col justify-end p-6 text-white md:p-8">
                                        <p className="text-[11px] font-bold uppercase tracking-[0.25em] text-emerald-100">
                                            {item.kicker}
                                        </p>
                                        <h3 className="mt-3 -skew-x-12 text-4xl font-black uppercase leading-[0.82] md:text-5xl">
                                            <span className="block skew-x-12">{item.title}</span>
                                        </h3>
                                        
                                        <span className="mt-5 block h-[3px] w-16 bg-white transition-all duration-700 group-hover:w-52 group-hover:bg-emerald-300" />
                                    </div>
                                </Link>
                            ))}
                        </div>
                    </div>
                </div>
            </section>

            <section className="py-12 md:py-16">
                <div className="mx-auto max-w-7xl px-4 md:px-8">
                    <div className="mb-8 flex items-end justify-between gap-6 md:mb-10">
                        <div>
                            <p className="text-xs font-semibold uppercase tracking-[0.24em] text-pink-500">
                                สินค้ามาใหม่
                            </p>
                            <h2 className="-skew-x-12 text-4xl font-black uppercase tracking-tight md:text-6xl">
                                <span className="block skew-x-12 bg-gradient-to-r from-pink-500 to-red-600 bg-clip-text text-transparent">เต็มไปด้วยสินค้า</span>
                            </h2>
                        </div>
                        <p className="text-xs font-bold uppercase tracking-[0.22em] text-sport-slate dark:text-slate-300">
                            ไฮไลท์สินค้า / swipe
                        </p>
                    </div>

                    <div className="overflow-x-auto snap-x snap-mandatory [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
                        <div className="flex min-w-max gap-5 pb-3 md:gap-6">
                            {productsMock.map((item) => (
                                <article
                                    key={item.id}
                                    className="group relative h-[460px] w-[80vw] max-w-[360px] shrink-0 snap-start overflow-hidden border-2 border-black/90 bg-white/30 transition duration-300 hover:-translate-y-2 hover:border-pink-500 hover:shadow-[14px_14px_0_0_rgba(236,72,153,0.55)] dark:border-white/85"
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
                                        <p className="text-[11px] font-bold uppercase tracking-[0.24em] text-pink-200">
                                            {productCategoryLabelsMock[item.category]}
                                        </p>
                                        <h3 className="mt-3 text-2xl font-black uppercase leading-[0.92] md:text-3xl">
                                            {item.name}
                                        </h3>
                                        <div className={`mt-5 flex items-end gap-4 ${item.hidePriceOnCard ? 'justify-end' : 'justify-between'}`}>
                                            {!item.hidePriceOnCard && (
                                                <p className="bg-gradient-to-r from-pink-500 via-pink-600 to-pink-700 bg-clip-text text-2xl font-black uppercase text-transparent md:text-3xl">
                                                    ฿{item.price.toLocaleString()}
                                                </p>
                                            )}
                                            <Link
                                                href={`/products/${item.id}`}
                                                className="border border-white/70 px-3 py-1 text-[10px] font-black uppercase tracking-[0.22em] text-white transition group-hover:border-pink-500 group-hover:text-pink-500"
                                            >
                                                ดูสินค้า
                                            </Link>
                                        </div>
                                    </div>
                                </article>
                            ))}
                        </div>
                    </div>
                </div>
            </section>

            <section 
                className="relative py-12 md:py-16 before:absolute before:inset-0 before:bg-cover before:bg-center before:opacity-15"
                style={{
                    backgroundImage: 'url(https://scontent.fbkk12-3.fna.fbcdn.net/v/t39.30808-6/571478314_122186162714513975_220908490551661769_n.jpg?stp=dst-jpg_tt6&cstp=mx1440x1440&ctp=s1440x1440&_nc_cat=102&ccb=1-7&_nc_sid=833d8c&_nc_ohc=yqeiBKi-gkEQ7kNvwGdRcFH&_nc_oc=Adp1xGPjFT_bxsD6eX0ePumKXUPWcZsyodFDJWIv9behaftc0FdijjIphUbwTcBj8PJU5K9ahlpivB-yYy-vzY4z&_nc_zt=23&_nc_ht=scontent.fbkk12-3.fna&_nc_gid=2syXcC2X-sX4aXkfZRgrXw&_nc_ss=7b289&oh=00_AQAdcEwSnn7YCXy0J8X9A3RqXI_jEzBf3KcaVZsu-YvQFw&oe=6A4E9B26)',
                    backgroundSize: 'cover',
                    backgroundPosition: 'center',
                }}
            >
                <div className="absolute inset-0 bg-gradient-to-b from-white/25 via-white/40 to-white/25" />
                <div className="relative mx-auto max-w-7xl px-4 md:px-8">
                    <div className="mb-8 md:mb-10">
                        <p className="text-xs font-semibold uppercase tracking-[0.28em] text-pink-500">
                            EXCLUSIVE DROP / คอลเลกชันล่าสุด
                        </p>
                        <h2 className="mt-3 text-2xl font-black uppercase tracking-tight md:text-3xl">
                            <span className="bg-gradient-to-r from-pink-500 to-red-600 bg-clip-text text-transparent">
                                สโมสรฟุตบอลหนองบัว พิชญ FC
                            </span>

                        </h2>
                    </div>

                    <div
                        className="relative -mx-4 overflow-x-auto px-4 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden md:mx-0 md:px-0"
                        onMouseLeave={() => setActiveMosaicIndex(null)}
                    >
                        <div className="flex min-w-max items-start gap-4 pb-4 md:grid md:min-w-0 md:grid-cols-4 md:gap-6 md:pb-0">
                            {npfcFeaturedMosaicCards.map((card, index) => {
                                const isActive = activeMosaicIndex === index;
                                const hasActive = activeMosaicIndex !== null;

                                return (
                                    <Link
                                        key={`npfc-${index}`}
                                        href="/products?category=Pitchaya"
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
                                        aria-label="ไปยังสินค้าหมวดพิชญ"
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
                                    </Link>
                                );
                            })}
                        </div>
                    </div>
                </div>
            </section>

            <section className="relative border-y border-slate-200 bg-white py-12 md:py-16">

                <div className="mx-auto max-w-7xl px-4 md:px-8">
                    <div className="grid gap-8 lg:grid-cols-12 lg:items-start">
                        <div className="lg:col-span-5 lg:sticky lg:top-24">
                            <p className="inline-flex items-center gap-2 text-xs font-bold uppercase tracking-[0.24em] text-red-400">
                                <span className="relative inline-flex h-2.5 w-2.5">
                                    <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-red-500 opacity-75" />
                                    <span className="relative inline-flex h-2.5 w-2.5 rounded-full bg-red-500" />
                                </span>
                                ออนไลน์ตอนนี้
                            </p>

                            <h2 className="mt-5 -skew-x-12 text-5xl font-black uppercase leading-[0.8] text-slate-900 md:text-7xl">
                                <span className="block skew-x-12 bg-gradient-to-r from-pink-500 to-red-600 bg-clip-text text-transparent">สดบน</span>
                                <span className="block skew-x-12 bg-gradient-to-r from-pink-500 to-red-600 bg-clip-text text-transparent">
                                    TikTok
                                </span>
                            </h2>

                            <p className="mt-6 max-w-lg text-sm font-medium text-slate-600 md:text-base">
                                อัปเดตสินค้าใหม่ โปรโมชัน และตัวอย่างงานจริงแบบเรียลไทม์
                                จากทั้งสองช่อง เพื่อให้ลูกค้าเห็นคอนเทนต์ล่าสุดก่อนตัดสินใจสั่งผลิต
                            </p>

                            <div className="mt-7 flex flex-wrap gap-2 text-[11px] font-bold uppercase tracking-[0.18em]">
                                <span className="border border-red-300/60 bg-red-50 px-3 py-1 text-red-600">live updates</span>
                                <span className="border border-pink-300/60 bg-pink-50 px-3 py-1 text-pink-600">new arrivals</span>
                                <span className="border border-rose-300/60 bg-rose-50 px-3 py-1 text-rose-600">teamwear stories</span>
                            </div>
                        </div>

                        <div className="grid gap-5 lg:col-span-7 xl:grid-cols-2">
                            <article
                                className="group relative overflow-hidden border border-red-200 bg-white p-4 shadow-[0_18px_36px_-26px_rgba(239,68,68,0.5)] transition duration-300 hover:-translate-y-1 hover:border-red-400/55"
                                style={{
                                    clipPath:
                                        'polygon(8% 0, 100% 0, 100% 100%, 0 100%, 0 14%)',
                                }}
                            >
                                <div className="mb-4 flex items-center justify-between gap-3 text-white">
                                    <p className="text-xs font-black uppercase tracking-[0.22em] text-red-400">
                                        Channel 01
                                    </p>
                                    <span className="rounded-full border border-red-500/45 px-3 py-1 text-[10px] font-bold uppercase tracking-[0.18em] text-red-200">
                                        @j.s.sport_shop
                                    </span>
                                </div>

                                <div className="flex min-h-[430px] items-center justify-center">
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
                            </article>

                            <article
                                className="group relative overflow-hidden border border-pink-200 bg-white p-4 shadow-[0_18px_36px_-26px_rgba(236,72,153,0.45)] transition duration-300 hover:-translate-y-1 hover:border-pink-400/60"
                                style={{
                                    clipPath:
                                        'polygon(0 0, calc(100% - 26px) 0, 100% 26px, 100% 100%, 0 100%)',
                                }}
                            >
                                <div className="mb-4 flex items-center justify-between gap-3 text-white">
                                    <p className="text-xs font-black uppercase tracking-[0.22em] text-cyan-300">
                                        Channel 02
                                    </p>
                                    <span className="rounded-full border border-cyan-500/45 px-3 py-1 text-[10px] font-bold uppercase tracking-[0.18em] text-cyan-100">
                                        @mesport80
                                    </span>
                                </div>

                                <div className="flex min-h-[430px] items-center justify-center">
                                    <blockquote
                                        className="tiktok-embed !m-0 w-full max-w-[780px] min-w-[288px]"
                                        cite="https://www.tiktok.com/@mesport80"
                                        data-unique-id="mesport80"
                                        data-embed-type="creator"
                                    >
                                        <section>
                                            <a
                                                target="_blank"
                                                rel="noreferrer"
                                                href="https://www.tiktok.com/@mesport80?refer=creator_embed"
                                            >
                                                @mesport80
                                            </a>
                                        </section>
                                    </blockquote>
                                </div>
                            </article>
                        </div>
                    </div>
                </div>
            </section>

            <section className="bg-white py-12 md:py-16">
                <div className="mx-auto max-w-7xl px-4 md:px-8">
                    <p className="mb-8 text-xs font-semibold uppercase tracking-[0.28em] text-pink-500 md:mb-10">
                        คู่ค้าของเรา
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
        </div>
    );
};

export default HomePageContent;
