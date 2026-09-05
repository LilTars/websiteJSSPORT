import { Link, usePage } from '@inertiajs/react';
import { ChevronDown, Menu, Moon, Sun, X } from 'lucide-react';
import { useCallback, useEffect, useRef, useState } from 'react';
import ProductMegaMenu from '@/components/navbar/product-mega-menu';
import type { NavCatalog, NavCategory } from '@/components/navbar/product-mega-menu';
import { useTheme } from '@/contexts/theme-context';
import { menuItemsMock, utilityItemsMock } from '@/mock/menu-data';

type UtilityItem = {
    label: string;
    href: string;
};

type MenuItem = {
    label: string;
    href: string;
};

type TopBarProps = {
    utilityItems: UtilityItem[];
    theme: 'light' | 'dark';
    onToggleTheme: () => void;
};

type MainBarProps = {
    menuItems: MenuItem[];
    currentPath: string;
    authActionHref: string;
    authActionLabel: string;
    isMobileOpen: boolean;
    onToggleMobile: () => void;
    isMegaOpen: boolean;
    onMegaOpen: () => void;
    onMegaClose: () => void;
};

type MobileMenuProps = {
    isOpen: boolean;
    currentPath: string;
    menuItems: MenuItem[];
    authActionHref: string;
    authActionLabel: string;
    categories: NavCategory[];
    onClose: () => void;
};

const utilityItems: UtilityItem[] = utilityItemsMock;

const menuItems: MenuItem[] = menuItemsMock;

const isPathActive = (currentPath: string, href: string): boolean => {
    if (href === '/') {
        return currentPath === '/';
    }

    return currentPath === href || currentPath.startsWith(`${href}/`);
};

function TopBar({ utilityItems: items, theme, onToggleTheme }: TopBarProps) {
    return (
        <div className="border-b border-gray-200 bg-gray-100 dark:border-white/10 dark:bg-slate-950/50 dark:backdrop-blur-xl">
            <div className="mx-auto flex min-h-11 w-full max-w-7xl items-center justify-end px-4 py-1.5 md:px-6 lg:px-8">
                <div className="flex items-center gap-2 text-xs text-gray-700 sm:gap-3 dark:text-slate-300">
                    <button
                        type="button"
                        onClick={onToggleTheme}
                        className="inline-flex min-h-9 items-center gap-1.5 rounded-full border border-gray-300 bg-white px-3 py-1.5 text-[11px] font-semibold uppercase tracking-[0.12em] text-gray-700 transition hover:border-pink-400 hover:text-pink-600 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-200 dark:hover:border-pink-500 dark:hover:text-pink-400"
                        aria-label={theme === 'dark' ? 'เปลี่ยนเป็นโหมดสว่าง' : 'เปลี่ยนเป็นโหมดมืด'}
                    >
                        {theme === 'dark' ? <Sun size={12} /> : <Moon size={12} />}
                        {theme === 'dark' ? 'Light' : 'Dark'}
                    </button>

                <ul className="hidden items-center gap-3 sm:flex">
                    {items.map((item) => (
                        <li key={item.label} className="inline-flex items-center">
                            <Link
                                href={item.href}
                                className="relative transition-all duration-300 ease-in-out hover:-translate-y-0.5 hover:text-pink-600 after:absolute after:-bottom-0.5 after:left-0 after:h-[2px] after:w-0 after:bg-pink-500 after:transition-all after:duration-300 after:ease-in-out hover:after:w-full dark:hover:text-pink-400"
                            >
                                {item.label}
                            </Link>
                        </li>
                    ))}
                </ul>
                </div>
            </div>
        </div>
    );
}

const desktopLinkClass = 'relative text-sm font-semibold transition-all duration-300 ease-in-out after:absolute after:-bottom-1.5 after:left-0 after:h-[2px] after:bg-pink-500 after:transition-all after:duration-300 after:ease-in-out focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-pink-500 focus-visible:ring-offset-2 focus-visible:ring-offset-white dark:focus-visible:ring-offset-slate-950';

function MainBar({
    menuItems: items,
    currentPath,
    authActionHref,
    authActionLabel,
    isMobileOpen,
    onToggleMobile,
    isMegaOpen,
    onMegaOpen,
    onMegaClose,
}: MainBarProps) {
    return (
        <div className="border-b border-gray-200 bg-white dark:border-white/10 dark:bg-slate-950/60 dark:backdrop-blur-xl">
            <div className="mx-auto flex min-h-16 w-full max-w-7xl items-center justify-between gap-4 px-4 py-2 md:min-h-20 md:px-6 lg:px-8">
                <Link href="/" className="inline-flex shrink-0 items-center justify-start" aria-label="JS SPORT หน้าแรก">
                    <img
                        src="/images/logos/logojs.png"
                        alt="JS SPORT"
                        className="h-[4.5rem] w-auto object-contain transition-all duration-300 ease-in-out hover:scale-105 md:h-[6rem]"
                    />
                </Link>

                <nav aria-label="เมนูหลัก" className="hidden items-center gap-5 md:flex lg:gap-8">
                    {items.map((item) => {
                        const isActive = isPathActive(currentPath, item.href);
                        const stateClass = isActive
                            ? 'text-pink-600 after:w-full dark:text-pink-400'
                            : 'text-gray-900 after:w-0 hover:-translate-y-0.5 hover:text-pink-600 hover:after:w-full dark:text-slate-100 dark:hover:text-pink-400';

                        // The products entry is still a link, but hovering or focusing it
                        // also reveals the catalogue panel.
                        if (item.href === '/products') {
                            return (
                                <Link
                                    key={item.label}
                                    href={item.href}
                                    aria-current={isActive ? 'page' : undefined}
                                    aria-expanded={isMegaOpen}
                                    aria-controls="products-mega-menu"
                                    onMouseEnter={onMegaOpen}
                                    onMouseLeave={onMegaClose}
                                    onFocus={onMegaOpen}
                                    className={`${desktopLinkClass} inline-flex items-center gap-1 ${stateClass}`}
                                >
                                    {item.label}
                                    <ChevronDown
                                        size={14}
                                        aria-hidden="true"
                                        className={`transition-transform duration-200 ${isMegaOpen ? 'rotate-180' : ''}`}
                                    />
                                </Link>
                            );
                        }

                        return (
                            <Link
                                key={item.label}
                                href={item.href}
                                aria-current={isActive ? 'page' : undefined}
                                onMouseEnter={onMegaClose}
                                onFocus={onMegaClose}
                                className={`${desktopLinkClass} ${stateClass}`}
                            >
                                {item.label}
                            </Link>
                        );
                    })}
                </nav>

                <div className="hidden shrink-0 items-center justify-end md:flex">
                    <Link
                        href={authActionHref}
                        className="relative z-10 inline-flex min-h-10 items-center rounded-full bg-slate-900 px-5 py-2 text-sm font-semibold text-white transition-all duration-300 hover:bg-pink-600 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-pink-500 focus-visible:ring-offset-2 dark:bg-slate-100 dark:text-slate-900 dark:hover:bg-pink-400 dark:focus-visible:ring-offset-slate-950"
                    >
                        {authActionLabel}
                    </Link>
                </div>

                <button
                    type="button"
                    className="inline-flex min-h-11 min-w-11 items-center justify-center rounded-md border border-gray-300 p-2 text-gray-900 transition-all duration-300 ease-in-out hover:border-pink-400 hover:bg-pink-50 hover:text-pink-600 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-pink-500 dark:border-slate-700 dark:text-slate-100 dark:hover:bg-slate-900 dark:hover:text-pink-400 md:hidden"
                    onClick={onToggleMobile}
                    aria-label={isMobileOpen ? 'ปิดเมนู' : 'เปิดเมนู'}
                    aria-expanded={isMobileOpen}
                    aria-controls="mobile-menu"
                >
                    {isMobileOpen ? <X size={20} /> : <Menu size={20} />}
                </button>
            </div>
        </div>
    );
}

function MobileMenu({ isOpen, currentPath, menuItems: items, authActionHref, authActionLabel, categories, onClose }: MobileMenuProps) {
    return (
        <div
            id="mobile-menu"
            // Hidden from pointer AND keyboard when collapsed: max-h-0 alone still lets Tab reach the links.
            aria-hidden={!isOpen}
            inert={!isOpen ? true : undefined}
            className={`overflow-hidden border-b border-gray-200 bg-white transition-all duration-300 ease-in-out dark:border-white/10 dark:bg-slate-950/90 dark:backdrop-blur-xl md:hidden ${
                isOpen ? 'max-h-[80vh] opacity-100' : 'pointer-events-none max-h-0 opacity-0'
            }`}
        >
            <nav aria-label="เมนูหลัก (มือถือ)" className="space-y-6 px-4 pb-6 pt-4">
                <div className="flex flex-col gap-2">
                    {items.map((item) => {
                        const isActive = isPathActive(currentPath, item.href);
                        const isProducts = item.href === '/products';

                        return (
                            <div key={item.label}>
                                <Link
                                    href={item.href}
                                    onClick={onClose}
                                    aria-current={isActive ? 'page' : undefined}
                                    className={`block rounded-lg px-3 py-3 text-base font-semibold transition-all duration-300 ease-in-out focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-pink-500 ${
                                        isActive
                                            ? 'bg-pink-100 text-pink-700 dark:bg-pink-500/15 dark:text-pink-300'
                                            : 'text-gray-800 hover:bg-pink-50 hover:text-pink-600 dark:text-slate-200 dark:hover:bg-slate-900 dark:hover:text-pink-400'
                                    }`}
                                >
                                    {item.label}
                                </Link>

                                {/* No hover on touch devices, so the catalogue is listed inline. */}
                                {isProducts && categories.length > 0 && (
                                    <ul className="mt-1 space-y-0.5 border-l-2 border-pink-200 pl-3 dark:border-pink-500/30">
                                        {categories.map((category) => (
                                            <li key={category.id}>
                                                <Link
                                                    href={`/products?category=${encodeURIComponent(category.slug)}`}
                                                    onClick={onClose}
                                                    className="flex items-center justify-between gap-3 rounded-lg px-3 py-2 text-sm font-medium text-gray-600 transition-colors hover:bg-pink-50 hover:text-pink-600 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-pink-500 dark:text-slate-300 dark:hover:bg-slate-900 dark:hover:text-pink-400"
                                                >
                                                    <span>{category.name}</span>
                                                    <span className="text-xs font-bold text-gray-400 dark:text-slate-500">{category.productCount}</span>
                                                </Link>
                                            </li>
                                        ))}
                                    </ul>
                                )}
                            </div>
                        );
                    })}
                    <Link
                        href={authActionHref}
                        onClick={onClose}
                        className="mt-2 inline-flex min-h-11 items-center justify-center rounded-lg bg-slate-900 px-3 py-3 text-base font-semibold text-white transition hover:bg-pink-600 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-pink-500 dark:bg-slate-100 dark:text-slate-900 dark:hover:bg-pink-400"
                    >
                        {authActionLabel}
                    </Link>
                </div>
            </nav>
        </div>
    );
}

export default function Navbar() {
    const { theme, toggleTheme } = useTheme();
    const { url, props } = usePage<{ auth?: { user?: { id: number } | null }; currentTeam?: { slug: string } | null; teams?: Array<{ slug: string }>; navCatalog?: NavCatalog }>();
    const currentPath = url.split('?')[0];
    const isAuthenticated = Boolean(props.auth?.user);
    const teamSlug = props.currentTeam?.slug ?? props.teams?.[0]?.slug;
    const authActionHref = isAuthenticated
        ? (teamSlug ? `/${teamSlug}/backoffice/members` : '/')
        : '/login';
    const authActionLabel = isAuthenticated ? 'Backoffice' : 'Login';
    const navCatalog = props.navCatalog ?? { categories: [], featured: [] };
    const [isMegaOpen, setIsMegaOpen] = useState(false);
    const megaCloseTimerRef = useRef<number | null>(null);

    const clearMegaTimer = useCallback(() => {
        if (megaCloseTimerRef.current !== null) {
            window.clearTimeout(megaCloseTimerRef.current);
            megaCloseTimerRef.current = null;
        }
    }, []);

    const openMega = useCallback(() => {
        clearMegaTimer();
        setIsMegaOpen(true);
    }, [clearMegaTimer]);

    // Short grace period so moving the pointer diagonally from the trigger down
    // into the panel does not close it mid-travel.
    const closeMega = useCallback(() => {
        clearMegaTimer();
        megaCloseTimerRef.current = window.setTimeout(() => setIsMegaOpen(false), 140);
    }, [clearMegaTimer]);

    const closeMegaNow = useCallback(() => {
        clearMegaTimer();
        setIsMegaOpen(false);
    }, [clearMegaTimer]);

    useEffect(() => clearMegaTimer, [clearMegaTimer]);

    useEffect(() => {
        const onKeyDown = (event: KeyboardEvent) => {
            if (event.key === 'Escape') {
                closeMegaNow();
            }
        };

        window.addEventListener('keydown', onKeyDown);

        return () => window.removeEventListener('keydown', onKeyDown);
    }, [closeMegaNow]);

    const [isMobileOpen, setIsMobileOpen] = useState(false);
    const toggleMobileMenu = () => {
        setIsMobileOpen((value) => !value);
    };

    const closeMobileMenu = () => {
        setIsMobileOpen(false);
    };

    // A menu left open on a phone must not stay mounted-open once the viewport
    // reaches the desktop breakpoint, where the panel is display:none.
    useEffect(() => {
        if (typeof window === 'undefined') {
            return;
        }

        const desktopQuery = window.matchMedia('(min-width: 768px)');
        const collapseOnDesktop = () => {
            if (desktopQuery.matches) {
                setIsMobileOpen(false);
            }
        };

        collapseOnDesktop();
        desktopQuery.addEventListener('change', collapseOnDesktop);

        return () => desktopQuery.removeEventListener('change', collapseOnDesktop);
    }, []);

    return (
        // Fragment, not a wrapper div: position:sticky can only travel inside its
        // parent's box, so the sticky bar has to sit directly under the layout's
        // full-height container or it scrolls away with a navbar-sized parent.
        <>
            <TopBar utilityItems={utilityItems} theme={theme} onToggleTheme={toggleTheme} />

            <div className="sticky top-0 z-50">
                <div className="relative bg-white dark:bg-transparent">
                    <MainBar
                        menuItems={menuItems}
                        currentPath={currentPath}
                        isMobileOpen={isMobileOpen}
                        authActionHref={authActionHref}
                        authActionLabel={authActionLabel}
                        onToggleMobile={toggleMobileMenu}
                        isMegaOpen={isMegaOpen}
                        onMegaOpen={openMega}
                        onMegaClose={closeMega}
                    />
                    <ProductMegaMenu
                        catalog={navCatalog}
                        isOpen={isMegaOpen}
                        onNavigate={closeMegaNow}
                        onMouseEnter={openMega}
                        onMouseLeave={closeMega}
                    />
                    <MobileMenu
                        isOpen={isMobileOpen}
                        currentPath={currentPath}
                        menuItems={menuItems}
                        categories={navCatalog.categories}
                        onClose={closeMobileMenu}
                        authActionHref={authActionHref}
                        authActionLabel={authActionLabel}
                    />
                </div>
            </div>
        </>
    );
}
