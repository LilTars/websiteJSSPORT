import plugin from 'tailwindcss/plugin';

/** @type {import('tailwindcss').Config} */
export default {
    darkMode: 'class',
    content: [
        './resources/**/*.blade.php',
        './resources/**/*.js',
        './resources/**/*.ts',
        './resources/**/*.jsx',
        './resources/**/*.tsx',
    ],
    theme: {
        extend: {
            fontFamily: {
                sans: ['Prompt', 'ui-sans-serif', 'system-ui', 'sans-serif'],
            },
            colors: {
                sport: {
                    black: '#15171A',
                    charcoal: '#23272F',
                    white: '#F8FAFC',
                    slate: '#64748B',
                    accent: '#DC2626',
                    pink: '#EC4899',
                    'pink-soft': '#FCE7F3',
                    'pink-deep': '#831843',
                    'text-light': '#0F172A',
                    'text-dark': '#F8FAFC',
                },
            },
            boxShadow: {
                'sport-glow': '0 0 0 1px rgba(37,99,235,.3), 0 15px 40px rgba(0,0,0,.35)',
                'sport-pink-glow': '0 0 0 1px rgba(236,72,153,.35), 0 20px 45px rgba(131,24,67,.25)',
                'sport-glass': '0 10px 30px rgba(15, 23, 42, .10), inset 0 1px 0 rgba(255,255,255,.35)',
            },
            backgroundImage: {
                'sport-grid':
                    'linear-gradient(rgba(255,255,255,.04) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,.04) 1px, transparent 1px)',
                'sport-radial':
                    'radial-gradient(circle at 20% 20%, rgba(37,99,235,.3), transparent 35%), radial-gradient(circle at 80% 0%, rgba(220,38,38,.2), transparent 32%)',
                'sport-pink-radial':
                    'radial-gradient(circle at 0% 0%, rgba(236,72,153,.22), transparent 35%), radial-gradient(circle at 90% 10%, rgba(190,24,93,.16), transparent 38%)',
            },
            animation: {
                'fade-up': 'fadeUp .7s ease-out both',
                'sport-slide-in': 'sportSlideIn .55s cubic-bezier(.18,.89,.32,1.28) both',
                'sport-zoom-out': 'sportZoomOut 1s cubic-bezier(.2,.65,.25,1) both',
                'sport-skew-reveal': 'sportSkewReveal .7s cubic-bezier(.19,1,.22,1) both',
                'slide-up-fade': 'slideUpFade .7s cubic-bezier(.22,1,.36,1) both',
                'skew-reveal': 'skewReveal .85s cubic-bezier(.16,1,.3,1) both',
                marquee: 'marquee 25s linear infinite',
                'sport-pulse': 'sportPulse 1.6s ease-in-out infinite',
                'sport-flash': 'sportFlash 4s ease-in-out infinite',
                'sport-link-sweep': 'sportLinkSweep .35s ease-out both',
                'sport-button-kick': 'sportButtonKick .35s cubic-bezier(.34,1.56,.64,1) both',
            },
            keyframes: {
                fadeUp: {
                    '0%': { opacity: '0', transform: 'translateY(18px)' },
                    '100%': { opacity: '1', transform: 'translateY(0)' },
                },
                sportSlideIn: {
                    '0%': {
                        opacity: '0',
                        transform: 'translateX(-36px) skewX(-8deg)',
                    },
                    '100%': {
                        opacity: '1',
                        transform: 'translateX(0) skewX(0deg)',
                    },
                },
                sportZoomOut: {
                    '0%': { transform: 'scale(1.08)' },
                    '100%': { transform: 'scale(1)' },
                },
                sportSkewReveal: {
                    '0%': {
                        opacity: '0',
                        transform: 'translateY(24px) skewY(3deg)',
                    },
                    '100%': {
                        opacity: '1',
                        transform: 'translateY(0) skewY(0deg)',
                    },
                },
                slideUpFade: {
                    '0%': {
                        opacity: '0',
                        transform: 'translateY(2.5rem)',
                    },
                    '100%': {
                        opacity: '1',
                        transform: 'translateY(0)',
                    },
                },
                skewReveal: {
                    '0%': {
                        opacity: '0',
                        transform: 'translateY(1.75rem) skewX(-18deg) scale(1.08)',
                    },
                    '65%': {
                        opacity: '1',
                        transform: 'translateY(-0.15rem) skewX(3deg) scale(1.01)',
                    },
                    '100%': {
                        opacity: '1',
                        transform: 'translateY(0) skewX(0deg) scale(1)',
                    },
                },
                marquee: {
                    from: { transform: 'translateX(0)' },
                    to: { transform: 'translateX(-50%)' },
                },
                sportPulse: {
                    '0%, 100%': {
                        transform: 'translateY(0)',
                        boxShadow: '0 0 0 0 rgba(220,38,38,.35)',
                    },
                    '50%': {
                        transform: 'translateY(-2px)',
                        boxShadow: '0 0 0 10px rgba(220,38,38,0)',
                    },
                },
                sportFlash: {
                    '0%, 100%': { opacity: '.88' },
                    '50%': { opacity: '1' },
                },
                sportLinkSweep: {
                    '0%': { transform: 'translateX(-110%) skewX(-24deg)' },
                    '100%': { transform: 'translateX(125%) skewX(-24deg)' },
                },
                sportButtonKick: {
                    '0%': { transform: 'translateY(0) scale(1)' },
                    '50%': { transform: 'translateY(-2px) scale(1.03)' },
                    '100%': { transform: 'translateY(0) scale(1)' },
                },
            },
        },
    },
    plugins: [
        plugin(function ({ addUtilities }) {
            addUtilities({
                '.animation-delay-100': {
                    animationDelay: '100ms',
                },
                '.animation-delay-200': {
                    animationDelay: '200ms',
                },
                '.animation-delay-300': {
                    animationDelay: '300ms',
                },
            });
        }),
    ],
};
