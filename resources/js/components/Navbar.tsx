import { Link, usePage } from '@inertiajs/react';
import { Menu, Moon, Sun, X } from 'lucide-react';
import { useState } from 'react';
import { useTheme } from '@/contexts/theme-context';
import { menuItemsMock, utilityItemsMock } from '@/mock/menu-data';
import { login } from '@/routes';

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
};

type MobileMenuProps = {
    isOpen: boolean;
    currentPath: string;
    menuItems: MenuItem[];
    authActionHref: string;
    authActionLabel: string;
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
        <div className="border-b border-gray-200 bg-gray-100 dark:border-slate-800 dark:bg-slate-950">
            <div className="mx-auto flex min-h-11 w-full max-w-7xl items-center justify-end px-4 py-1.5 sm:justify-between md:px-6 lg:px-8">
                <Link href="/" className="inline-flex items-center gap-2 text-[11px] font-semibold text-gray-800 transition-all duration-300 ease-in-out hover:text-pink-600 dark:text-slate-200 dark:hover:text-pink-400">
                    
                    
                </Link>

                <div className="flex items-center gap-2 text-xs text-gray-700 sm:gap-3 dark:text-slate-300">
                    <button
                        type="button"
                        onClick={onToggleTheme}
                        className="inline-flex min-h-9 items-center gap-1.5 rounded-full border border-gray-300 bg-white px-3 py-1.5 text-[11px] font-semibold uppercase tracking-[0.12em] text-gray-700 transition hover:border-pink-400 hover:text-pink-600 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-200 dark:hover:border-pink-500 dark:hover:text-pink-400"
                        aria-label="สลับโหมดแสงและมืด"
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

function MainBar({
    menuItems: items,
    currentPath,
    authActionHref,
    authActionLabel,
    isMobileOpen,
    onToggleMobile,
}: MainBarProps) {
    const isProductsActive = isPathActive(currentPath, '/products');
    const primaryMenuItems = items.filter((item) => item.label !== 'สินค้า');

    return (
        <div className="border-b border-gray-200 bg-white dark:border-slate-800 dark:bg-slate-950">
            <div className="mx-auto flex min-h-16 w-full max-w-7xl items-center justify-between px-4 py-2 md:min-h-20 md:px-6 lg:px-8">
                <Link href="/" className="inline-flex w-56 items-center justify-start md:w-72">
                    <img
                        src="/images/logos/logojs.png"
                        alt="Main logo"
                        className="h-[4.5rem] w-auto object-contain transition-all duration-300 ease-in-out hover:scale-105 md:h-[6rem]"
                    />
                </Link>

                <nav className="hidden items-center gap-5 md:flex lg:gap-8">
                    {primaryMenuItems.slice(0, 1).map((item) => (
                        <Link
                            key={item.label}
                            href={item.href}
                            className={`relative text-sm font-semibold transition-all duration-300 ease-in-out after:absolute after:-bottom-1.5 after:left-0 after:h-[2px] after:bg-pink-500 after:transition-all after:duration-300 after:ease-in-out ${
                                isPathActive(currentPath, item.href)
                                    ? 'text-pink-600 after:w-full'
                                        : 'text-gray-900 after:w-0 hover:-translate-y-0.5 hover:text-pink-600 hover:after:w-full dark:text-slate-100 dark:hover:text-pink-400'
                            }`}
                        >
                            {item.label}
                        </Link>
                    ))}

                    <Link
                        href="/products"
                        className={`relative text-sm font-semibold transition-all duration-300 ease-in-out after:absolute after:-bottom-1.5 after:left-0 after:h-[2px] after:bg-pink-500 after:transition-all after:duration-300 after:ease-in-out ${
                            isProductsActive
                                ? 'text-pink-600 after:w-full'
                                : 'text-gray-900 after:w-0 hover:-translate-y-0.5 hover:text-pink-600 hover:after:w-full dark:text-slate-100 dark:hover:text-pink-400'
                        }`}
                    >
                        สินค้า
                    </Link>

                    {primaryMenuItems.slice(1).map((item) => (
                        <Link
                            key={item.label}
                            href={item.href}
                            className={`relative text-sm font-semibold transition-all duration-300 ease-in-out after:absolute after:-bottom-1.5 after:left-0 after:h-[2px] after:bg-pink-500 after:transition-all after:duration-300 after:ease-in-out ${
                                isPathActive(currentPath, item.href)
                                    ? 'text-pink-600 after:w-full'
                                        : 'text-gray-900 after:w-0 hover:-translate-y-0.5 hover:text-pink-600 hover:after:w-full dark:text-slate-100 dark:hover:text-pink-400'
                            }`}
                        >
                            {item.label}
                        </Link>
                    ))}
                </nav>

                <div className="hidden w-44 items-center justify-end md:flex md:w-56">
                    <Link
                        href={authActionHref}
                        className="relative z-10 inline-flex min-h-10 items-center rounded-full bg-slate-900 px-5 py-2 text-sm font-semibold text-white transition-all duration-300 hover:bg-pink-600 dark:bg-slate-100 dark:text-slate-900 dark:hover:bg-pink-400"
                    >
                        {authActionLabel}
                    </Link>
                </div>

                <button
                    type="button"
                    className="inline-flex min-h-11 min-w-11 items-center justify-center rounded-md border border-gray-300 p-2 text-gray-900 transition-all duration-300 ease-in-out hover:border-pink-400 hover:bg-pink-50 hover:text-pink-600 dark:border-slate-700 dark:text-slate-100 dark:hover:bg-slate-900 dark:hover:text-pink-400 md:hidden"
                    onClick={onToggleMobile}
                    aria-label="เปิดหรือปิดเมนู"
                >
                    {isMobileOpen ? <X size={20} /> : <Menu size={20} />}
                </button>
            </div>
        </div>
    );
}

function MobileMenu({ isOpen, currentPath, menuItems: items, authActionHref, authActionLabel, onClose }: MobileMenuProps) {
    return (
        <div
            className={`overflow-hidden border-b border-gray-200 bg-white transition-all duration-300 ease-in-out dark:border-slate-800 dark:bg-slate-950 md:hidden ${
                isOpen ? 'max-h-[80vh] opacity-100' : 'max-h-0 opacity-0'
            }`}
        >
            <div className="space-y-6 px-4 pb-6 pt-4">
                <nav className="flex flex-col gap-2">
                    {items.map((item) => (
                        <Link
                            key={item.label}
                            href={item.href}
                            onClick={onClose}
                            className={`rounded-lg px-3 py-3 text-base font-semibold transition-all duration-300 ease-in-out ${
                                isPathActive(currentPath, item.href)
                                    ? 'bg-pink-100 text-pink-700'
                                        : 'text-gray-800 hover:bg-pink-50 hover:text-pink-600 dark:text-slate-200 dark:hover:bg-slate-900 dark:hover:text-pink-400'
                            }`}
                        >
                            {item.label}
                        </Link>
                    ))}
                    <Link
                        href={authActionHref}
                        onClick={onClose}
                        className="mt-2 inline-flex min-h-11 items-center justify-center rounded-lg bg-slate-900 px-3 py-3 text-base font-semibold text-white transition hover:bg-pink-600 dark:bg-slate-100 dark:text-slate-900 dark:hover:bg-pink-400"
                    >
                        {authActionLabel}
                    </Link>
                </nav>
            </div>
        </div>
    );
}

export default function Navbar() {
    const { theme, toggleTheme } = useTheme();
    const { url, props } = usePage<{ auth?: { user?: { id: number } | null }; currentTeam?: { slug: string } | null; teams?: Array<{ slug: string }> }>();
    const currentPath = url.split('?')[0];
    const isHomePage = currentPath === '/';
    const isAuthenticated = Boolean(props.auth?.user);
    const teamSlug = props.currentTeam?.slug ?? props.teams?.[0]?.slug;
    const authActionHref = isAuthenticated
        ? (teamSlug ? `/${teamSlug}/backoffice/members` : '/')
        : '/login';
    const authActionLabel = isAuthenticated ? 'Backoffice' : 'Login';
    const [isMobileOpen, setIsMobileOpen] = useState(false);
    const toggleMobileMenu = () => {
        setIsMobileOpen((value) => !value);
    };

    const closeMobileMenu = () => {
        setIsMobileOpen(false);
    };

    return (
        <div style={{ fontFamily: "'IBM Plex Sans Thai Looped', 'Noto Sans Thai Looped', 'Sarabun', 'Prompt', ui-sans-serif, system-ui, sans-serif" }}>
            <TopBar utilityItems={utilityItems} theme={theme} onToggleTheme={toggleTheme} />

            <div className="sticky top-0 z-50">
                <div className="relative bg-white dark:bg-slate-950">
                    <MainBar
                        menuItems={menuItems}
                        currentPath={currentPath}
                        isMobileOpen={isMobileOpen}
                        authActionHref={authActionHref}
                        authActionLabel={authActionLabel}
                        onToggleMobile={toggleMobileMenu}
                    />
                    <MobileMenu
                        isOpen={isMobileOpen}
                        currentPath={currentPath}
                        menuItems={menuItems}
                        onClose={closeMobileMenu}
                        authActionHref={authActionHref}
                        authActionLabel={authActionLabel}
                    />
                </div>
            </div>
        </div>
    );
}
