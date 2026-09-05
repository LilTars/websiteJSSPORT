import { Link } from '@inertiajs/react';
import type { PropsWithChildren, ReactNode } from 'react';
import CookieConsent from '@/components/cookie-consent';
import Navbar from '@/components/Navbar';
import { ThemeProvider } from '@/contexts/theme-context';
import { openCookieSettings } from '@/lib/cookie-consent';

type SocialLink = {
    label: string;
    detail: string;
    href: string;
    icon: () => ReactNode;
};

const socialLinks: SocialLink[] = [
    {
        label: 'Facebook',
        detail: 'JSSportGroup',
        href: 'https://www.facebook.com/JSSportGroup?locale=th_TH',
        icon: () => (
            <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
                <path d="M13.5 22v-8.3h2.8l.4-3.2h-3.2V8.4c0-.9.3-1.5 1.6-1.5h1.8V4c-.8-.1-1.8-.2-2.9-.2-2.9 0-4.8 1.7-4.8 4.9v1.8H7v3.2h2.2V22h4.3z" />
            </svg>
        ),
    },
    {
        label: 'Line',
        detail: 'JS SPORT',
        href: 'https://lin.ee/6DeBOxS?fbclid=IwZXh0bgNhZW0CMTAAYnJpZBExanFyZlVsa1lIR1NzY2tad3NydGMGYXBwX2lkEDIyMjAzOTE3ODgyMDA4OTIAAR6IutFKxQ8tLEffeh4yV4hhNnrWnIf5yZu4QayLZcYCBbskaBReQiuzJ_wk4w_aem_iw-o8rJoO1DOcwZpx-GKBA',
        icon: () => (
            <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
                <path d="M12 3C7 3 3 6.1 3 10.1c0 2.7 1.8 5.1 4.6 6.4l-.4 2.8c0 .3.4.5.7.3l3.4-2c.6.1 1.1.1 1.7.1 5 0 9-3.1 9-7.1S17 3 12 3Zm-3.3 9.8c0 .2-.2.4-.4.4H7.4c-.2 0-.4-.2-.4-.4V8.7c0-.2.2-.4.4-.4h.9c.2 0 .4.2.4.4v4.1Zm2.9 0c0 .2-.2.4-.4.4h-.9c-.2 0-.4-.2-.4-.4V8.7c0-.2.2-.4.4-.4h.9c.2 0 .4.2.4.4v4.1Zm4.5 0c0 .2-.2.4-.4.4h-2.2c-.2 0-.4-.2-.4-.4V8.7c0-.2.2-.4.4-.4h.9c.2 0 .4.2.4.4v3.1h.9c.2 0 .4.2.4.4v.6Z" />
            </svg>
        ),
    },
    {
        label: 'TikTok JSSPORT',
        detail: '@j.s.sport_shop',
        href: 'https://www.tiktok.com/@j.s.sport_shop?fbclid=IwZXh0bgNhZW0CMTAAYnJpZBExanFyZlVsa1lIR1NzY2tad3NydGMGYXBwX2lkEDIyMjAzOTE3ODgyMDA4OTIAAR6IutFKxQ8tLEffeh4yV4hhNnrWnIf5yZu4QayLZcYCBbskaBReQiuzJ_wk4w_aem_iw-o8rJoO1DOcwZpx-GKBA',
        icon: () => (
            <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
                <path d="M15.8 3c.6 2.4 2.1 3.9 4.4 4.3v2.5c-1.5 0-2.8-.4-4.1-1.2v6.1c0 3.2-2.2 5.5-5.5 5.5S5 18 5 14.7c0-3.3 2.5-5.8 6.1-5.8.3 0 .6 0 .9.1v2.8c-.3-.1-.6-.1-.9-.1-1.9 0-3.1 1.3-3.1 3s1.2 3 3 3c1.8 0 3.1-1.3 3.1-3V3h1.7Z" />
            </svg>
        ),
    },
    {
        label: 'TikTok MESPORT',
        detail: '@mesport80',
        href: 'https://www.tiktok.com/@mesport80?fbclid=IwZXh0bgNhZW0CMTAAYnJpZBExanFyZlVsa1lIR1NzY2tad3NydGMGYXBwX2lkEDIyMjAzOTE3ODgyMDA4OTIAAR644oP6eHzQsEC05Tn1Lb2PsBxO7eMJRM-infwgyj7lBXteVGUdfEceCIppfQ_aem_ocOC5FJlQYuSFgFwNZW8Hw',
        icon: () => (
            <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
                <path d="M15.8 3c.6 2.4 2.1 3.9 4.4 4.3v2.5c-1.5 0-2.8-.4-4.1-1.2v6.1c0 3.2-2.2 5.5-5.5 5.5S5 18 5 14.7c0-3.3 2.5-5.8 6.1-5.8.3 0 .6 0 .9.1v2.8c-.3-.1-.6-.1-.9-.1-1.9 0-3.1 1.3-3.1 3s1.2 3 3 3c1.8 0 3.1-1.3 3.1-3V3h1.7Z" />
            </svg>
        ),
    },
    {
        label: 'Shopee',
        detail: 'jssportgroup',
        href: 'https://shopee.co.th/jssportgroup?fbclid=IwZXh0bgNhZW0CMTAAYnJpZBExanFyZlVsa1lIR1NzY2tad3NydGMGYXBwX2lkEDIyMjAzOTE3ODgyMDA4OTIAAR5zfkIUz2zOc-pduvSxGlGTKvmfFaXzZZOJmatv4ijDkG6reiDNd_A_VfGOEA_aem_Jw8UKorSC1ubiRV0VGf88Q',
        icon: () => (
            <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
                <path d="M7 7.2h10l-.7 9.2a2 2 0 0 1-2 1.8H9.7a2 2 0 0 1-2-1.8L7 7.2Zm2.4-2.4h5.2c.8 0 1.4.6 1.4 1.4v.8H8v-.8c0-.8.6-1.4 1.4-1.4Zm1.1 3.9v5.7h1.2V8.7H10.5Zm3 0v5.7h1.2V8.7h-1.2Z" />
            </svg>
        ),
    },
];

function LayoutFrame({ children }: PropsWithChildren) {
    return (
        <div
            className="relative isolate min-h-screen bg-white font-sans text-sport-text-light antialiased transition-colors duration-300 dark:bg-slate-950 dark:text-slate-100"
        >
            <div className="site-ambient-bg pointer-events-none fixed inset-0 -z-10 bg-[linear-gradient(to_top,rgba(251,113,133,0.14),rgba(255,255,255,0.96)_28%,rgba(255,255,255,1)_60%),radial-gradient(circle_at_12%_18%,rgba(244,114,182,0.14),transparent_34%),radial-gradient(circle_at_84%_20%,rgba(248,113,113,0.1),transparent_30%)]" />

            <Navbar />

            <main className="relative z-10">{children}</main>

            <CookieConsent />

            <footer className="border-t border-slate-700/80 bg-slate-950/95 px-4 py-10 text-slate-100 backdrop-blur-xl md:px-8 md:py-12">
                <div className="mx-auto grid w-full max-w-7xl gap-7 md:grid-cols-2 xl:grid-cols-[1.35fr_1fr_1fr] xl:items-center xl:gap-8">
                    <div className="flex items-center justify-center md:justify-start xl:justify-center">
                        <img
                            src="/images/logos/logojs.png"
                            alt="JS SPORT Group"
                            className="h-[10.5rem] w-auto max-w-[330px] object-contain sm:h-[13.5rem] sm:max-w-[390px] md:h-[16.5rem] md:max-w-[480px]"
                        />
                    </div>

                    <div className="self-center">
                        <p className="text-sm font-semibold text-slate-100">ช่องทางติดตาม</p>
                        <ul className="mt-4 space-y-3 text-sm text-slate-300">
                            {socialLinks.slice(0, 3).map((social) => (
                                <li key={social.label}>
                                    <a
                                        href={social.href}
                                        target="_blank"
                                        rel="noreferrer"
                                        className="group flex min-h-12 items-center gap-3 rounded-2xl border border-slate-700/70 bg-slate-900/80 px-3 py-2.5 transition hover:border-pink-400/60 hover:bg-slate-900"
                                    >
                                        <span className="inline-flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-pink-500/20 to-slate-800 text-white shadow-[0_10px_18px_-15px_rgba(0,0,0,0.7)] transition group-hover:scale-105">
                                            <span className="h-4 w-4">{social.icon()}</span>
                                        </span>
                                        <span className="min-w-0">
                                            <span className="block text-xs font-semibold uppercase tracking-[0.2em] text-slate-400">
                                                {social.label}
                                            </span>
                                            <span className="block truncate text-sm font-semibold text-slate-100 transition group-hover:text-pink-300">
                                                {social.detail}
                                            </span>
                                        </span>
                                    </a>
                                </li>
                            ))}
                        </ul>
                    </div>

                    <div className="self-center">
                        <p className="text-sm font-semibold text-slate-100">ติดต่อเรา</p>
                        <ul className="mt-4 space-y-3 text-sm text-slate-300">
                            {socialLinks.slice(3).map((social) => (
                                <li key={social.label}>
                                    <a
                                        href={social.href}
                                        target="_blank"
                                        rel="noreferrer"
                                        className="group flex min-h-12 items-center gap-3 rounded-2xl border border-slate-700/70 bg-slate-900/80 px-3 py-2.5 transition hover:border-pink-400/60 hover:bg-slate-900"
                                    >
                                        <span className="inline-flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-pink-500/20 to-slate-800 text-white shadow-[0_10px_18px_-15px_rgba(0,0,0,0.7)] transition group-hover:scale-105">
                                            <span className="h-4 w-4">{social.icon()}</span>
                                        </span>
                                        <span className="min-w-0">
                                            <span className="block text-xs font-semibold uppercase tracking-[0.2em] text-slate-400">
                                                {social.label}
                                            </span>
                                            <span className="block truncate text-sm font-semibold text-slate-100 transition group-hover:text-pink-300">
                                                {social.detail}
                                            </span>
                                        </span>
                                    </a>
                                </li>
                            ))}
                            <li>
                                <a
                                    href="tel:0813209725"
                                    className="group flex min-h-12 items-center gap-3 rounded-2xl border border-slate-700/70 bg-slate-900/80 px-3 py-2.5 transition hover:border-pink-400/60 hover:bg-slate-900"
                                >
                                    <span className="inline-flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-pink-500/20 to-slate-800 text-white shadow-[0_10px_18px_-15px_rgba(0,0,0,0.7)] transition group-hover:scale-105">
                                        <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
                                            <path d="M6.6 10.8c1.4 2.8 3.6 5 6.4 6.4l2.1-2.1c.3-.3.7-.4 1.1-.3 1.2.4 2.6.6 4 .6.6 0 1 .4 1 1v3.4c0 .6-.4 1-1 1C10.9 21 3 13.1 3 3c0-.6.4-1 1-1h3.4c.6 0 1 .4 1 1 0 1.4.2 2.8.6 4 .1.4 0 .8-.3 1.1L6.6 10.8Z" />
                                        </svg>
                                    </span>
                                    <span className="min-w-0">
                                        <span className="block text-xs font-semibold uppercase text-slate-400">
                                            โทร
                                        </span>
                                        <span className="block text-sm font-semibold text-slate-100 transition group-hover:text-pink-300">
                                            0813209725
                                        </span>
                                    </span>
                                </a>
                            </li>
                        </ul>
                    </div>
                </div>

                <div className="mx-auto mt-9 flex w-full max-w-7xl flex-col gap-3 border-t border-slate-700/70 pt-6 text-sm text-slate-400 sm:flex-row sm:items-center sm:justify-between">
                    <p>© {new Date().getFullYear()} JS SPORT GROUP</p>
                    <div className="flex flex-wrap items-center gap-x-5 gap-y-2">
                        <Link href="/privacy" className="transition hover:text-pink-300 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-pink-400">
                            นโยบายความเป็นส่วนตัว
                        </Link>
                        <button
                            type="button"
                            onClick={openCookieSettings}
                            className="transition hover:text-pink-300 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-pink-400"
                        >
                            ตั้งค่าคุกกี้
                        </button>
                    </div>
                </div>
            </footer>
        </div>
    );
}

export default function PublicLayout({ children }: PropsWithChildren) {
    return (
        <ThemeProvider>
            <LayoutFrame>{children}</LayoutFrame>
        </ThemeProvider>
    );
}
