import { useEffect, useRef } from 'react';

const TILT_TARGET = '[data-tilt], [data-parallax]';
const TILT_VARS = ['--tilt-rx', '--tilt-ry', '--tilt-x', '--tilt-y', '--tilt-px', '--tilt-py'] as const;

/**
 * Pointer-driven 3D tilt for every `[data-tilt]` (rotates) or `[data-parallax]`
 * (exposes pointer position only) element inside the returned container.
 *
 * One delegated listener serves a whole section, so carousels with many cards do
 * not attach a handler per card. The hook only writes CSS custom properties; the
 * actual transforms live in app.css, which keeps React out of the render loop.
 * It stays inert on touch screens and for visitors who prefer reduced motion.
 */
export function useTilt3D<T extends HTMLElement>(defaultMaxDegrees = 7) {
    const containerRef = useRef<T | null>(null);

    useEffect(() => {
        const container = containerRef.current;

        if (!container || typeof window === 'undefined') {
            return;
        }

        const finePointer = window.matchMedia('(hover: hover) and (pointer: fine)').matches;
        const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

        if (!finePointer || reducedMotion) {
            return;
        }

        let activeElement: HTMLElement | null = null;
        let lastEvent: PointerEvent | null = null;
        let frameId = 0;

        const release = (element: HTMLElement) => {
            TILT_VARS.forEach((name) => element.style.removeProperty(name));
            delete element.dataset.tilting;
        };

        const apply = () => {
            frameId = 0;

            if (!activeElement || !lastEvent) {
                return;
            }

            const rect = activeElement.getBoundingClientRect();

            if (rect.width === 0 || rect.height === 0) {
                return;
            }

            const x = Math.min(Math.max((lastEvent.clientX - rect.left) / rect.width, 0), 1);
            const y = Math.min(Math.max((lastEvent.clientY - rect.top) / rect.height, 0), 1);
            const maxDegrees = Number(activeElement.dataset.tilt) || defaultMaxDegrees;
            const style = activeElement.style;

            style.setProperty('--tilt-rx', `${((0.5 - y) * 2 * maxDegrees).toFixed(2)}deg`);
            style.setProperty('--tilt-ry', `${((x - 0.5) * 2 * maxDegrees).toFixed(2)}deg`);
            style.setProperty('--tilt-x', `${(x * 100).toFixed(1)}%`);
            style.setProperty('--tilt-y', `${(y * 100).toFixed(1)}%`);
            style.setProperty('--tilt-px', ((x - 0.5) * 2).toFixed(3));
            style.setProperty('--tilt-py', ((y - 0.5) * 2).toFixed(3));
        };

        const handlePointerMove = (event: PointerEvent) => {
            const target = event.target instanceof Element ? event.target.closest<HTMLElement>(TILT_TARGET) : null;
            const nextElement = target && container.contains(target) ? target : null;

            if (nextElement !== activeElement) {
                if (activeElement) {
                    release(activeElement);
                }

                activeElement = nextElement;

                if (activeElement) {
                    activeElement.dataset.tilting = 'true';
                }
            }

            lastEvent = event;

            if (activeElement && !frameId) {
                frameId = window.requestAnimationFrame(apply);
            }
        };

        const handlePointerLeave = () => {
            if (activeElement) {
                release(activeElement);
                activeElement = null;
            }
        };

        container.addEventListener('pointermove', handlePointerMove, { passive: true });
        container.addEventListener('pointerleave', handlePointerLeave);

        return () => {
            container.removeEventListener('pointermove', handlePointerMove);
            container.removeEventListener('pointerleave', handlePointerLeave);
            window.cancelAnimationFrame(frameId);
            handlePointerLeave();
        };
    }, [defaultMaxDegrees]);

    return containerRef;
}
