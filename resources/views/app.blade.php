<!DOCTYPE html>
<html
    lang="{{ config('seo.html_lang', 'th') }}"
    data-default-appearance="{{ $defaultAppearance ?? 'light' }}"
    data-backoffice="{{ request()->is('*backoffice*', 'dashboard') ? 'true' : 'false' }}"
    @class(['dark' => ($appearance ?? ($defaultAppearance ?? 'light')) == 'dark'])
>
    <head>
        <meta charset="utf-8">
        <meta name="viewport" content="width=device-width, initial-scale=1">
        <meta name="csrf-token" content="{{ csrf_token() }}">

        {{-- Inline script to detect system dark mode preference and apply it immediately --}}
        <script>
            (function() {
                const appearance = '{{ $appearance ?? ($defaultAppearance ?? "light") }}';

                if (appearance === 'system') {
                    const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;

                    if (prefersDark) {
                        document.documentElement.classList.add('dark');
                    }
                }
            })();
        </script>

        {{-- Inline style to set the HTML background color based on our theme in app.css --}}
        <style>
            html {
                background-color: oklch(1 0 0);
            }

            html.dark {
                background-color: oklch(0.145 0 0);
            }
        </style>

        <link rel="icon" href="/favicon.ico" sizes="any">
        <link rel="icon" href="/favicon.svg" type="image/svg+xml">
        <link rel="apple-touch-icon" href="/apple-touch-icon.png">

        <link rel="preconnect" href="https://fonts.googleapis.com">
        <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>

        @fonts

        @viteReactRefresh
        @vite(['resources/css/app.css', 'resources/js/app.tsx', "resources/js/pages/{$page['component']}.tsx"])
        <x-inertia::head>
            {{-- Server-side fallback; <SeoHead> replaces each tag by its data-inertia key once the app boots. --}}
            @php($seo = app(\App\Domain\Seo\Actions\ResolvePageSeoAction::class)->handle($page))
            <title>{{ $seo['title'] }}</title>
            <meta name="description" content="{{ $seo['description'] }}" data-inertia="description">
            <meta name="robots" content="{{ $seo['robots'] }}" data-inertia="robots">
            <link rel="canonical" href="{{ $seo['canonical'] }}" data-inertia="canonical">
            <meta property="og:site_name" content="{{ $seo['siteName'] }}" data-inertia="og:site_name">
            <meta property="og:type" content="{{ $seo['type'] }}" data-inertia="og:type">
            <meta property="og:title" content="{{ $seo['title'] }}" data-inertia="og:title">
            <meta property="og:description" content="{{ $seo['description'] }}" data-inertia="og:description">
            <meta property="og:url" content="{{ $seo['canonical'] }}" data-inertia="og:url">
            <meta property="og:image" content="{{ $seo['image'] }}" data-inertia="og:image">
            <meta property="og:locale" content="{{ $seo['locale'] }}" data-inertia="og:locale">
            <meta name="twitter:card" content="summary_large_image" data-inertia="twitter:card">
            <meta name="twitter:title" content="{{ $seo['title'] }}" data-inertia="twitter:title">
            <meta name="twitter:description" content="{{ $seo['description'] }}" data-inertia="twitter:description">
            <meta name="twitter:image" content="{{ $seo['image'] }}" data-inertia="twitter:image">
        </x-inertia::head>
    </head>
    <body class="font-sans antialiased">
        <x-inertia::app />
    </body>
</html>
