import { Link, usePage } from '@inertiajs/react';
import { Menu, Moon, Sun } from 'lucide-react';
import { useState } from 'react';
import type { PropsWithChildren } from 'react';
import { ThemeProvider, useTheme } from '@/contexts/theme-context';

type NavItem = {
    label: string;
    href: string;
};

const navItems: NavItem[] = [
    { label: 'Home', href: '/' },
    { label: 'Products', href: '/products' },
    { label: 'เกี่ยวกับเรา', href: '/about' },
    { label: 'ร่วมงานกับเรา', href: '/careers' },
];

function LayoutFrame({ children }: PropsWithChildren) {
    const [mobileOpen, setMobileOpen] = useState(false);
    const { theme, toggleTheme } = useTheme();
    const { url } = usePage();

    const currentPath = url.split('?')[0];

    const isActiveLink = (href: string): boolean => {
        if (href === '/') {
            return currentPath === '/';
        }

        return currentPath === href || currentPath.startsWith(`${href}/`);
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-white via-pink-50 to-pink-100/50 text-sport-text-light antialiased transition-colors duration-300 dark:from-black dark:via-pink-950/40 dark:to-[#0a0a0a] dark:text-sport-text-dark">
            <div className="pointer-events-none fixed inset-0 -z-10 bg-sport-pink-radial opacity-90" />
            <div className="pointer-events-none fixed inset-0 -z-10 opacity-[0.05] dark:opacity-[0.12] [background-image:linear-gradient(to_right,rgba(15,23,42,0.3)_1px,transparent_1px),linear-gradient(to_bottom,rgba(15,23,42,0.3)_1px,transparent_1px)] [background-size:46px_46px]" />

            <header className="sticky top-0 z-50 border-b border-pink-200/70 bg-white/55 backdrop-blur-2xl dark:border-pink-500/20 dark:bg-black/35">
                <div className="mx-auto flex h-20 w-full max-w-7xl items-center justify-between px-4 md:px-8">
                    <Link href="/" className="group flex items-center gap-3">
                        <span className="inline-flex items-center justify-center overflow-hidden transition group-hover:scale-105">
                            <img
                                src="/images/logos/logojs.png"
                                alt="JS SPORT logo"
                                className="h-12 w-auto object-contain md:h-14"
                            />
                        </span>
                        <span className="text-xs font-black uppercase tracking-[0.2em] md:text-sm">
                            JS SPORT x ME SPORT
                        </span>
                    </Link>

                    <nav className="hidden items-center gap-3 md:flex">
                        {navItems.map((item) => (
                            (() => {
                                const isActive = isActiveLink(item.href);

                                return (
                                    <Link
                                        key={item.href}
                                        href={item.href}
                                        className={`group relative overflow-hidden -skew-x-12 px-5 py-2 text-xs font-black uppercase tracking-[0.2em] transition-all duration-300 ${
                                            isActive
                                                ? 'text-red-600 dark:text-red-400'
                                                : 'text-sport-text-light/80 hover:text-blue-700 dark:text-sport-text-dark/80 dark:hover:text-blue-400'
                                        }`}
                                    >
                                        <span className="relative z-10 block skew-x-12">
                                            {item.label}
                                        </span>
                                        {isActive ? (
                                            <>
                                                <span className="absolute bottom-1 left-4 h-[2px] w-14 -skew-x-12 bg-red-600 shadow-[0_0_12px_rgba(220,38,38,0.6)]" />
                                            </>
                                        ) : (
                                            <span className="pointer-events-none absolute bottom-1 left-4 h-[2px] w-0 -skew-x-12 bg-blue-700 opacity-0 transition-all duration-300 group-hover:w-14 group-hover:opacity-100 dark:bg-blue-400" />
                                        )}
                                    </Link>
                                );
                            })()
                        ))}
                    </nav>

                    <div className="flex items-center gap-2 md:gap-3">
                        <button
                            type="button"
                            onClick={toggleTheme}
                            className="group inline-flex -skew-x-12 items-center gap-2 rounded-sm border border-pink-300/70 bg-white/50 px-3 py-2 text-[11px] font-black uppercase tracking-[0.16em] shadow-sport-glass transition hover:-translate-y-0.5 hover:border-sport-pink hover:text-sport-pink dark:border-pink-500/35 dark:bg-white/5"
                            aria-label="Toggle theme"
                        >
                            <span className="skew-x-12">
                                {theme === 'dark' ? (
                                    <Sun size={15} className="transition group-hover:rotate-12" />
                                ) : (
                                    <Moon size={15} className="transition group-hover:-rotate-12" />
                                )}
                            </span>
                            <span className="skew-x-12">{theme}</span>
                        </button>

                        <Link
                            href="/login"
                            className="group hidden -skew-x-12 items-center border border-white/20 px-4 py-2 text-[11px] font-black uppercase tracking-[0.2em] text-sport-text-light transition-all duration-300 hover:border-blue-700 hover:text-blue-700 hover:shadow-[0_0_0_1px_rgba(37,99,235,0.18),0_0_18px_rgba(37,99,235,0.22)] dark:border-white/10 dark:text-sport-text-dark dark:hover:border-blue-400 dark:hover:text-blue-400 md:inline-flex"
                        >
                            <span className="block skew-x-12">เข้าสู่ระบบ</span>
                        </Link>

                        <button
                            type="button"
                            className="inline-flex h-10 w-10 items-center justify-center rounded-md border border-pink-300/70 bg-white/50 md:hidden dark:border-pink-500/35 dark:bg-white/5"
                            aria-label="Open menu"
                            onClick={() => setMobileOpen((value) => !value)}
                        >
                            <Menu size={18} />
                        </button>
                    </div>
                </div>

                {mobileOpen && (
                    <div className="border-t border-pink-200/70 px-4 py-3 md:hidden dark:border-pink-500/20">
                        <nav className="flex flex-col gap-2">
                            {navItems.map((item) => (
                                (() => {
                                    const isActive = isActiveLink(item.href);

                                    return (
                                        <Link
                                            key={item.href}
                                            href={item.href}
                                            className={`-skew-x-12 px-3 py-2 text-xs font-black uppercase tracking-[0.18em] transition-all duration-300 ${
                                                isActive
                                                    ? 'text-red-600 dark:text-red-400'
                                                    : 'text-sport-text-light/80 hover:text-blue-700 dark:text-sport-text-dark/80 dark:hover:text-blue-400'
                                            }`}
                                            onClick={() => setMobileOpen(false)}
                                        >
                                            <span className="block skew-x-12">{item.label}</span>
                                            {isActive && (
                                                    <span className="mt-2 block h-[2px] w-16 -skew-x-12 bg-red-600 shadow-[0_0_12px_rgba(220,38,38,0.6)]" />
                                            )}
                                        </Link>
                                    );
                                })()
                            ))}
                            <Link
                                href="/login"
                                    className="-skew-x-12 border border-white/20 px-3 py-2 text-center text-xs font-black uppercase tracking-[0.2em] text-sport-text-light transition-all duration-300 hover:border-blue-700 hover:text-blue-700 dark:border-white/10 dark:text-sport-text-dark dark:hover:border-blue-400 dark:hover:text-blue-400"
                                onClick={() => setMobileOpen(false)}
                            >
                                    <span className="block skew-x-12">เข้าสู่ระบบ</span>
                            </Link>
                        </nav>
                    </div>
                )}
            </header>

            <main className="relative">{children}</main>

            <footer className="mt-16 border-t border-pink-200/70 bg-white/50 px-4 py-10 backdrop-blur-xl dark:border-pink-500/20 dark:bg-black/30 md:px-8">
                <div className="mx-auto grid w-full max-w-7xl gap-8 md:grid-cols-3">
                    <div>
                        <p className="text-xs font-semibold uppercase tracking-[0.2em] text-blue-700 dark:text-blue-400">
                            JS SPORT x ME SPORT
                        </p>
                        <p className="mt-3 text-sm text-sport-slate dark:text-slate-300">
                            Performance kits, custom jerseys, and team-ready sports gear
                            built for winners.
                        </p>
                    </div>

                    <div>
                        <p className="text-sm font-semibold">Branches</p>
                        <ul className="mt-3 space-y-1 text-sm text-sport-slate dark:text-slate-300">
                            <li>JS SPORT - Main Store</li>
                            <li>ME SPORT - Downtown</li>
                        </ul>
                    </div>

                    <div>
                        <p className="text-sm font-semibold">Contact</p>
                        <ul className="mt-3 space-y-1 text-sm text-sport-slate dark:text-slate-300">
                            <li>LINE: @jssportteam</li>
                            <li>Phone: 08x-xxx-xxxx</li>
                            <li>Email: hello@jssport.local</li>
                        </ul>
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
