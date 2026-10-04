import { createInertiaApp } from '@inertiajs/react';
import RouteRenderOverlay from '@/components/route-render-overlay';
import { Toaster } from '@/components/ui/sonner';
import { TooltipProvider } from '@/components/ui/tooltip';
import { initializeTheme } from '@/hooks/use-appearance';
import AppLayout from '@/layouts/app-layout';
import AuthLayout from '@/layouts/auth-layout';
import SettingsLayout from '@/layouts/settings/layout';

const appName = import.meta.env.VITE_APP_NAME || 'Laravel';

createInertiaApp({
    // SeoHead already builds complete public titles ("Page | Site"), so only
    // bare titles (backoffice, auth) get the app name appended.
    title: (title) => {
        if (!title) {
            return appName;
        }

        return title.includes(appName) || / \| [^|]+$/.test(title) ? title : `${title} - ${appName}`;
    },
    layout: (name) => {
        const normalizedName = name.toLowerCase();

        switch (true) {
            case normalizedName === 'welcome':
                return null;
            case normalizedName.startsWith('auth/'):
                return AuthLayout;
            case normalizedName.startsWith('settings/'):
            case normalizedName.startsWith('teams/'):
                return [AppLayout, SettingsLayout];
            default:
                return AppLayout;
        }
    },
    strictMode: true,
    withApp(app) {
        return (
            <TooltipProvider delayDuration={0}>
                <RouteRenderOverlay>{app}</RouteRenderOverlay>
                <Toaster />
            </TooltipProvider>
        );
    },
    progress: {
        color: '#4B5563',
    },
});

// This will set light / dark mode on load...
initializeTheme();
