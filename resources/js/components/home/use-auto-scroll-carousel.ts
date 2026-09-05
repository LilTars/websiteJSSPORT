import { useEffect, useRef } from 'react';

/**
 * Drives a seamless left-to-right marquee on an overflow-x container whose track
 * is rendered twice, so scrolling past the halfway point can silently rewind.
 */
export function useAutoScrollCarousel<T extends HTMLElement>(isPaused: boolean, speed: number) {
    const carouselRef = useRef<T | null>(null);

    useEffect(() => {
        if (typeof window === 'undefined') {
            return;
        }

        const mediaQuery = window.matchMedia('(prefers-reduced-motion: reduce)');

        if (mediaQuery.matches || isPaused) {
            return;
        }

        let frameId = 0;

        const tick = () => {
            const carousel = carouselRef.current;

            if (!carousel) {
                frameId = window.requestAnimationFrame(tick);

                return;
            }

            carousel.scrollLeft += speed;
            const loopPoint = carousel.scrollWidth / 2;

            if (carousel.scrollLeft >= loopPoint) {
                carousel.scrollLeft -= loopPoint;
            }

            frameId = window.requestAnimationFrame(tick);
        };

        frameId = window.requestAnimationFrame(tick);

        return () => {
            window.cancelAnimationFrame(frameId);
        };
    }, [isPaused, speed]);

    return carouselRef;
}

/**
 * Repeats the source list until the track is long enough for the motion to read,
 * then doubles it so `useAutoScrollCarousel` can loop without a visible jump.
 */
export function buildLoopedTrack<T>(items: T[], minVisibleCards: number): T[] {
    if (items.length === 0) {
        return [];
    }

    const repeatCount = Math.max(1, Math.ceil(minVisibleCards / items.length));
    const loopSource = Array.from({ length: repeatCount }, () => items).flat();

    return [...loopSource, ...loopSource];
}

/**
 * Keyboard equivalent of the drag/auto-scroll interaction: arrow keys nudge the
 * track so the carousels are reachable without a pointer. Reads the scroller from
 * the event, so no ref has to be handed around during render.
 */
export function handleCarouselArrowKeys(event: React.KeyboardEvent<HTMLElement>, step = 340): void {
    if (event.key === 'ArrowRight') {
        event.preventDefault();
        event.currentTarget.scrollBy({ left: step, behavior: 'smooth' });
    } else if (event.key === 'ArrowLeft') {
        event.preventDefault();
        event.currentTarget.scrollBy({ left: -step, behavior: 'smooth' });
    }
}
