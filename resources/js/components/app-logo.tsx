import AppLogoIcon from '@/components/app-logo-icon';

export default function AppLogo() {
    return (
        <>
            <div className="flex shrink-0 items-center justify-center overflow-hidden">
                <AppLogoIcon className="h-10 w-auto object-contain" />
            </div>
            <div className="ml-1 grid flex-1 text-left text-sm">
                <span className="mb-0.5 truncate leading-tight font-semibold">
                    JS SPORT x ME SPORT
                </span>
            </div>
        </>
    );
}
