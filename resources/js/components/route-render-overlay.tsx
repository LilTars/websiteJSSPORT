import { router } from '@inertiajs/react';
import { useCallback, useEffect, useRef, useState } from 'react';
import type { PropsWithChildren } from 'react';

const INITIAL_DISPLAY_MS = 3800;
const HOME_NAVIGATION_MS = 3000;
const EXIT_ANIMATION_MS = 720;
const TOTAL_SEGMENTS = 24;
const SEGMENT_STEP_MS = 95;

const isHomePath = (path: string): boolean => path === '/';

export default function RouteRenderOverlay({ children }: PropsWithChildren) {
    const [isVisible, setIsVisible] = useState(true);
    const [isExiting, setIsExiting] = useState(false);
    const [filledSegments, setFilledSegments] = useState(0);
    const loadingTimerRef = useRef<number | null>(null);
    const hideTimerRef = useRef<number | null>(null);
    const prefersReducedMotionRef = useRef(false);

    const clearTimers = useCallback(() => {
        if (loadingTimerRef.current !== null) {
            window.clearInterval(loadingTimerRef.current);
            loadingTimerRef.current = null;
        }

        if (hideTimerRef.current !== null) {
            window.clearTimeout(hideTimerRef.current);
            hideTimerRef.current = null;
        }
    }, []);

    useEffect(() => {
        if (typeof window === 'undefined') {
            return;
        }

        const mediaQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
        const updatePreference = () => {
            prefersReducedMotionRef.current = mediaQuery.matches;

            if (mediaQuery.matches) {
                clearTimers();
                setIsVisible(false);
                setIsExiting(false);
                setFilledSegments(0);
            }
        };

        updatePreference();
        mediaQuery.addEventListener('change', updatePreference);

        return () => {
            mediaQuery.removeEventListener('change', updatePreference);
        };
    }, [clearTimers]);

    const startLoadingSequence = useCallback((durationMs: number) => {
        if (prefersReducedMotionRef.current) {
            setIsVisible(false);
            setIsExiting(false);
            setFilledSegments(0);

            return;
        }

        clearTimers();
        setIsVisible(true);
        setIsExiting(false);
        setFilledSegments(0);

        const totalSteps = Math.max(1, Math.floor(durationMs / SEGMENT_STEP_MS));
        const segmentsPerStep = TOTAL_SEGMENTS / totalSteps;
        let progress = 0;

        loadingTimerRef.current = window.setInterval(() => {
            progress += segmentsPerStep;

            if (progress >= TOTAL_SEGMENTS) {
                setFilledSegments(TOTAL_SEGMENTS);
                clearTimers();

                hideTimerRef.current = window.setTimeout(() => {
                    setIsExiting(true);
                    window.setTimeout(() => {
                        setIsVisible(false);
                        setIsExiting(false);
                        setFilledSegments(0);
                    }, EXIT_ANIMATION_MS);
                }, 160);

                return;
            }

            setFilledSegments(Math.max(1, Math.ceil(progress)));
        }, SEGMENT_STEP_MS);
    }, [clearTimers]);

    useEffect(() => {
        const initialTimer = window.setTimeout(() => {
            startLoadingSequence(INITIAL_DISPLAY_MS);
        }, 0);

        return () => {
            window.clearTimeout(initialTimer);
        };
    }, [startLoadingSequence]);

    useEffect(() => {
        const stopStart = router.on('start', (event) => {
            const nextUrl = event.detail.visit.url;
            const nextPath = nextUrl.pathname;

            if (isHomePath(nextPath)) {
                startLoadingSequence(HOME_NAVIGATION_MS);
            }
        });

        return () => {
            stopStart();
            clearTimers();
        };
    }, [clearTimers, startLoadingSequence]);

    return (
        <>
            {children}

            {isVisible && (
                <div
                    className={`pointer-events-none fixed inset-0 z-[200] flex items-center justify-center overflow-hidden bg-slate-950 transition-opacity duration-700 ease-out ${isExiting ? 'opacity-0' : 'opacity-100'}`}
                >
                    <div className="absolute inset-0 render-overlay-bg" />

                    <div className="relative flex w-full max-w-3xl flex-col items-center justify-center px-6 text-center">
                        <div className="render-orbit-wrap mb-7">
                            <div className="render-orbit-ring" />
                            <div className="render-orbit-ring-delay" />

                            <div className="render-logo-row">
                                <img
                                    src="/images/logos/logojs.png"
                                    alt="JS SPORT"
                                    className="render-logo render-logo-main"
                                />
                                <img
                                    src="/images/logos/logome.png"
                                    alt="ME SPORT"
                                    className="render-logo render-logo-sub"
                                />
                            </div>
                        </div>

                        <p className="text-[11px] font-bold uppercase tracking-[0.35em] text-cyan-200/90">
                            Rendering Experience
                        </p>
                        <h2 className="mt-4 text-3xl font-black uppercase leading-tight text-white md:text-5xl">
                            JS SPORT x ME SPORT
                        </h2>
                        <p className="mt-4 max-w-2xl text-sm font-medium text-slate-200/85 md:text-base">
                            กำลังเตรียมหน้าถัดไปด้วยพลังงานเต็มสปีด
                        </p>

                        <div className="mt-8 w-full max-w-md">
                            <div className="grid gap-1.5" style={{ gridTemplateColumns: `repeat(${TOTAL_SEGMENTS}, minmax(0, 1fr))` }}>
                                {Array.from({ length: TOTAL_SEGMENTS }).map((_, index) => {
                                    const isFilled = index < filledSegments;

                                    return (
                                        <span
                                            key={index}
                                            className={`h-2 rounded-full transition-all duration-300 ${isFilled ? 'bg-gradient-to-r from-cyan-300 via-sky-400 to-pink-500 shadow-[0_0_18px_rgba(56,189,248,0.55)]' : 'bg-white/12'}`}
                                        />
                                    );
                                })}
                            </div>
                            <p className="mt-3 text-[11px] font-semibold uppercase tracking-[0.3em] text-cyan-100/70">
                                Loading next scene
                            </p>
                        </div>
                    </div>
                </div>
            )}
        </>
    );
}
