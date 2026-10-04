import { Link } from '@inertiajs/react';
import { ArrowUpRight, MapPin, Phone, ShoppingBag } from 'lucide-react';
import type { ReactNode } from 'react';
import { openCookieSettings } from '@/lib/cookie-consent';
import { menuItemsMock } from '@/mock/menu-data';

const phone = { display: '081-320-9725', href: 'tel:0813209725' };
const lineUrl = 'https://lin.ee/6DeBOxS';
const mapUrl = 'https://www.google.com/maps?cid=17269871248021325741';

type Channel = {
    name: string;
    handle: string;
    href: string;
    icon: ReactNode;
};

const iconClass = 'h-4 w-4';

const channels: Channel[] = [
    {
        name: 'Facebook',
        handle: 'JSSportGroup',
        href: 'https://www.facebook.com/JSSportGroup',
        icon: (
            <svg
                viewBox="0 0 24 24"
                fill="currentColor"
                aria-hidden="true"
                className={iconClass}
            >
                <path d="M13.5 22v-8.3h2.8l.4-3.2h-3.2V8.4c0-.9.3-1.5 1.6-1.5h1.8V4c-.8-.1-1.8-.2-2.9-.2-2.9 0-4.8 1.7-4.8 4.9v1.8H7v3.2h2.2V22h4.3z" />
            </svg>
        ),
    },
    {
        name: 'LINE',
        handle: 'JS SPORT',
        href: lineUrl,
        icon: (
            <svg
                viewBox="0 0 24 24"
                fill="currentColor"
                aria-hidden="true"
                className={iconClass}
            >
                <path d="M12 3C7 3 3 6.1 3 10.1c0 2.7 1.8 5.1 4.6 6.4l-.4 2.8c0 .3.4.5.7.3l3.4-2c.6.1 1.1.1 1.7.1 5 0 9-3.1 9-7.1S17 3 12 3Zm-3.3 9.8c0 .2-.2.4-.4.4H7.4c-.2 0-.4-.2-.4-.4V8.7c0-.2.2-.4.4-.4h.9c.2 0 .4.2.4.4v4.1Zm2.9 0c0 .2-.2.4-.4.4h-.9c-.2 0-.4-.2-.4-.4V8.7c0-.2.2-.4.4-.4h.9c.2 0 .4.2.4.4v4.1Zm4.5 0c0 .2-.2.4-.4.4h-2.2c-.2 0-.4-.2-.4-.4V8.7c0-.2.2-.4.4-.4h.9c.2 0 .4.2.4.4v3.1h.9c.2 0 .4.2.4.4v.6Z" />
            </svg>
        ),
    },
    {
        name: 'TikTok',
        handle: '@j.s.sport_shop',
        href: 'https://www.tiktok.com/@j.s.sport_shop',
        icon: (
            <svg
                viewBox="0 0 24 24"
                fill="currentColor"
                aria-hidden="true"
                className={iconClass}
            >
                <path d="M15.8 3c.6 2.4 2.1 3.9 4.4 4.3v2.5c-1.5 0-2.8-.4-4.1-1.2v6.1c0 3.2-2.2 5.5-5.5 5.5S5 18 5 14.7c0-3.3 2.5-5.8 6.1-5.8.3 0 .6 0 .9.1v2.8c-.3-.1-.6-.1-.9-.1-1.9 0-3.1 1.3-3.1 3s1.2 3 3 3c1.8 0 3.1-1.3 3.1-3V3h1.7Z" />
            </svg>
        ),
    },
    {
        name: 'TikTok',
        handle: '@mesport80',
        href: 'https://www.tiktok.com/@mesport80',
        icon: (
            <svg
                viewBox="0 0 24 24"
                fill="currentColor"
                aria-hidden="true"
                className={iconClass}
            >
                <path d="M15.8 3c.6 2.4 2.1 3.9 4.4 4.3v2.5c-1.5 0-2.8-.4-4.1-1.2v6.1c0 3.2-2.2 5.5-5.5 5.5S5 18 5 14.7c0-3.3 2.5-5.8 6.1-5.8.3 0 .6 0 .9.1v2.8c-.3-.1-.6-.1-.9-.1-1.9 0-3.1 1.3-3.1 3s1.2 3 3 3c1.8 0 3.1-1.3 3.1-3V3h1.7Z" />
            </svg>
        ),
    },
    {
        name: 'Shopee',
        handle: 'jssportgroup',
        href: 'https://shopee.co.th/jssportgroup',
        icon: (
            <ShoppingBag
                aria-hidden="true"
                className={iconClass}
                strokeWidth={2.25}
            />
        ),
    },
];

function ColumnTitle({ children }: { children: ReactNode }) {
    return (
        <h2 className="flex items-center gap-2 text-sm font-semibold text-white">
            <span
                aria-hidden="true"
                className="h-3 w-[3px] -skew-x-12 bg-pink-500"
            />

            {children}
        </h2>
    );
}

const linkFocus =
    'rounded-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-pink-400 focus-visible:ring-offset-2 focus-visible:ring-offset-[#0b0d12]';

export default function SiteFooter() {
    const year = new Date().getFullYear();

    return (
        <footer className="relative isolate overflow-hidden bg-[#0b0d12] text-slate-300">
            {/* Jersey-style trim along the top edge */}
            <div aria-hidden="true" className="flex h-1.5">
                <span className="flex-[5] bg-gradient-to-r from-pink-500 to-red-600" />
                <span className="flex-1 bg-white/90" />
                <span className="flex-[2] bg-blue-700" />
            </div>

            <div
                aria-hidden="true"
                className="pointer-events-none absolute top-10 -left-40 -z-10 h-96 w-96 rounded-full bg-pink-600/10 blur-3xl"
            />

            <div className="mx-auto w-full max-w-7xl px-4 md:px-8">
                {/* Call to action */}
                <div className="flex flex-col gap-8 border-b border-white/[0.07] py-14 md:py-16 lg:flex-row lg:items-end lg:justify-between">
                    <div className="max-w-2xl">
                        <p className="text-xs font-semibold tracking-[0.28em] text-pink-400 uppercase">
                            Let&rsquo;s talk kit
                        </p>
                        <p className="mt-4 text-3xl leading-[1.3] font-black text-white md:text-[2.75rem]">
                            อยากได้ชุดทีมแบบไหน
                            <br />
                            <span className="bg-gradient-to-r from-pink-400 to-red-500 bg-clip-text text-transparent">
                                เล่าให้เราฟังได้เลย
                            </span>
                        </p>
                        <p className="mt-4 max-w-md text-sm leading-relaxed text-slate-400 md:text-base">
                            โทรหรือทักไลน์มาคุยกับทีมงานได้โดยตรง เรื่องแบบ ผ้า
                            ไซซ์ หรือจำนวน ถามได้หมด
                        </p>
                    </div>

                    <div className="flex flex-col gap-3 sm:flex-row">
                        <a
                            href={lineUrl}
                            target="_blank"
                            rel="noreferrer"
                            className={`group inline-flex items-center justify-center gap-2 bg-gradient-to-r from-pink-500 to-red-600 px-6 py-3.5 text-sm font-black text-white transition hover:-translate-y-0.5 hover:shadow-[0_14px_30px_-12px_rgba(236,72,153,0.7)] ${linkFocus}`}
                            style={{
                                clipPath:
                                    'polygon(0 0, calc(100% - 14px) 0, 100% 14px, 100% 100%, 0 100%)',
                            }}
                        >
                            ทักไลน์คุยงาน
                            <ArrowUpRight
                                aria-hidden="true"
                                className="h-4 w-4 transition group-hover:translate-x-0.5 group-hover:-translate-y-0.5"
                            />
                        </a>
                        <a
                            href={phone.href}
                            className={`inline-flex items-center justify-center gap-2 border border-white/15 px-6 py-3.5 text-sm font-bold text-white transition hover:border-pink-400/70 hover:text-pink-200 ${linkFocus}`}
                        >
                            <Phone aria-hidden="true" className="h-4 w-4" />
                            {phone.display}
                        </a>
                    </div>
                </div>

                {/* Details */}
                <div className="grid gap-12 pt-14 pb-4 sm:grid-cols-2 lg:grid-cols-[1.5fr_0.8fr_1fr_1fr] lg:gap-10">
                    <div>
                        <div className="inline-flex items-center gap-4 rounded-2xl bg-white px-4 py-3 shadow-[0_18px_40px_-24px_rgba(0,0,0,0.9)]">
                            <img
                                src="/images/logos/logojs.png"
                                alt="J.S.sport"
                                width={500}
                                height={500}
                                loading="lazy"
                                className="h-14 w-14 object-contain"
                            />
                            <span
                                aria-hidden="true"
                                className="h-8 w-px bg-slate-200"
                            />
                            <img
                                src="/images/logos/logome.png"
                                alt="ME SPORT"
                                width={630}
                                height={396}
                                loading="lazy"
                                className="h-10 w-auto object-contain"
                            />
                        </div>
                        <p className="mt-6 text-base font-bold text-white">
                            บริษัท เจ.เอส.สปอร์ต กรุ๊ป จำกัด
                        </p>
                        <p className="mt-2 max-w-sm text-sm leading-relaxed text-slate-400">
                            ผลิตและจำหน่ายชุดกีฬา ด้วยประสบการณ์กว่า 40 ปี
                        </p>
                    </div>

                    <nav aria-label="เมนูท้ายเว็บ">
                        <ColumnTitle>เมนู</ColumnTitle>
                        <ul className="mt-5 space-y-3 text-sm">
                            {menuItemsMock.map((item) => (
                                <li key={item.href}>
                                    <Link
                                        href={item.href}
                                        className={`text-slate-300 transition hover:text-white ${linkFocus}`}
                                    >
                                        {item.label}
                                    </Link>
                                </li>
                            ))}
                        </ul>
                    </nav>

                    <div>
                        <ColumnTitle>ติดตามเรา</ColumnTitle>
                        <ul className="mt-5 space-y-3.5 text-sm">
                            {channels.map((channel) => (
                                <li key={channel.href}>
                                    <a
                                        href={channel.href}
                                        target="_blank"
                                        rel="noreferrer"
                                        className={`group flex items-center gap-3 ${linkFocus}`}
                                    >
                                        <span className="inline-flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-white/[0.06] text-slate-300 ring-1 ring-white/10 transition group-hover:bg-pink-500 group-hover:text-white group-hover:ring-pink-500">
                                            {channel.icon}
                                        </span>
                                        <span className="leading-tight">
                                            <span className="block text-slate-200 transition group-hover:text-white">
                                                {channel.handle}
                                            </span>
                                            <span className="block text-xs text-slate-500">
                                                {channel.name}
                                            </span>
                                        </span>
                                    </a>
                                </li>
                            ))}
                        </ul>
                    </div>

                    <div>
                        <ColumnTitle>สำนักงานใหญ่</ColumnTitle>
                        <address className="mt-5 space-y-4 text-sm leading-relaxed not-italic">
                            <p className="flex gap-3 text-slate-400">
                                <MapPin
                                    aria-hidden="true"
                                    className="mt-0.5 h-4 w-4 shrink-0 text-pink-400"
                                />
                                <span>
                                    175/47-48 หมู่ 2 ถนนวิไสยอุดรกิจ ต.หนองบัว
                                    อ.เมืองหนองบัวลำภู จ.หนองบัวลำภู
                                </span>
                            </p>
                            <p className="flex gap-3">
                                <Phone
                                    aria-hidden="true"
                                    className="mt-0.5 h-4 w-4 shrink-0 text-pink-400"
                                />
                                <a
                                    href={phone.href}
                                    className={`text-slate-200 transition hover:text-white ${linkFocus}`}
                                >
                                    {phone.display}
                                </a>
                            </p>
                            <a
                                href={mapUrl}
                                target="_blank"
                                rel="noreferrer"
                                className={`inline-flex items-center gap-1.5 pl-7 text-sm font-semibold text-pink-400 underline decoration-pink-400/40 underline-offset-4 transition hover:text-pink-300 hover:decoration-pink-300 ${linkFocus}`}
                            >
                                เปิดใน Google Maps
                                <ArrowUpRight
                                    aria-hidden="true"
                                    className="h-3.5 w-3.5"
                                />
                            </a>
                        </address>
                    </div>
                </div>
            </div>

            {/* Oversized wordmark, cropped by the bottom bar */}
            <div
                aria-hidden="true"
                className="pointer-events-none overflow-hidden select-none"
            >
                <p className="-mb-[0.22em] text-center text-[19vw] leading-none font-black tracking-tighter whitespace-nowrap text-transparent uppercase [-webkit-text-stroke:1px_rgba(255,255,255,0.09)] lg:text-[15rem]">
                    JS Sport
                </p>
            </div>

            <div className="relative border-t border-white/[0.07] bg-[#0b0d12]">
                <div className="mx-auto flex w-full max-w-7xl flex-col gap-3 px-4 py-6 text-xs text-slate-500 sm:flex-row sm:items-center sm:justify-between md:px-8">
                    <p>
                        © {year} บริษัท เจ.เอส.สปอร์ต กรุ๊ป จำกัด สงวนลิขสิทธิ์
                    </p>
                    <div className="flex flex-wrap items-center gap-x-6 gap-y-2">
                        <Link
                            href="/privacy"
                            className={`transition hover:text-slate-200 ${linkFocus}`}
                        >
                            นโยบายความเป็นส่วนตัว
                        </Link>
                        <button
                            type="button"
                            onClick={openCookieSettings}
                            className={`transition hover:text-slate-200 ${linkFocus}`}
                        >
                            ตั้งค่าคุกกี้
                        </button>
                    </div>
                </div>
            </div>
        </footer>
    );
}
