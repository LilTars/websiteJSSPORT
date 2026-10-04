import type { PropsWithChildren } from 'react';
import CookieConsent from '@/components/cookie-consent';
import Navbar from '@/components/Navbar';
import SiteFooter from '@/components/site-footer';
import { ThemeProvider } from '@/contexts/theme-context';

function LayoutFrame({ children }: PropsWithChildren) {
    return (
        <div
            className="relative isolate min-h-screen bg-white font-sans text-sport-text-light antialiased transition-colors duration-300 dark:bg-slate-950 dark:text-slate-100"
        >
            <div className="site-ambient-bg pointer-events-none fixed inset-0 -z-10 bg-[linear-gradient(to_top,rgba(251,113,133,0.14),rgba(255,255,255,0.96)_28%,rgba(255,255,255,1)_60%),radial-gradient(circle_at_12%_18%,rgba(244,114,182,0.14),transparent_34%),radial-gradient(circle_at_84%_20%,rgba(248,113,113,0.1),transparent_30%)]" />

            <Navbar />

            <main className="relative z-10">{children}</main>

            <CookieConsent />

            <SiteFooter />
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
