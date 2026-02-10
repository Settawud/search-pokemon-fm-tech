"use client";

import { useEffect, useRef, useCallback } from "react";

const SCROLL_STATE_KEY = "pokemon-scroll-state";

interface ScrollState {
    scrollY: number;
    itemsCount: number;
}

/**
 * Hook to save and restore scroll position + loaded items count.
 * Saves state before navigating away, restores when component mounts.
 */
export function useScrollRestoration() {
    const hasRestored = useRef(false);

    // Save scroll position + items count before navigating to detail
    const saveScrollState = useCallback((itemsCount: number) => {
        if (typeof window === "undefined") return;
        const state: ScrollState = {
            scrollY: window.scrollY,
            itemsCount,
        };
        sessionStorage.setItem(SCROLL_STATE_KEY, JSON.stringify(state));
    }, []);

    // Get saved items count (call on mount to know how many items to pre-load)  
    const getSavedState = useCallback((): ScrollState | null => {
        if (typeof window === "undefined") return null;
        try {
            const raw = sessionStorage.getItem(SCROLL_STATE_KEY);
            if (raw) return JSON.parse(raw);
        } catch { /* ignore */ }
        return null;
    }, []);

    // Restore scroll position (call after items are loaded)
    // Uses fewer retries with early-exit for snappy restoration
    const restoreScrollPosition = useCallback(() => {
        if (typeof window === "undefined" || hasRestored.current) return;
        const state = getSavedState();
        if (!state) return;

        hasRestored.current = true;
        const targetY = state.scrollY;

        // Phase 1: Immediate scroll on next frame
        requestAnimationFrame(() => {
            window.scrollTo(0, targetY);

            // Phase 2: Re-scroll a few times to correct for layout shifts
            // Exit early once we're close enough to the target
            let count = 0;
            const maxRetries = 8;
            const interval = setInterval(() => {
                const diff = Math.abs(window.scrollY - targetY);
                if (diff < 5) {
                    // We're at the target — stop
                    clearInterval(interval);
                    return;
                }
                window.scrollTo(0, targetY);
                count++;
                if (count >= maxRetries) {
                    clearInterval(interval);
                }
            }, 100);
        });
    }, [getSavedState]);

    // Clear saved state (call when user actively changes search/filter)
    const clearScrollState = useCallback(() => {
        if (typeof window === "undefined") return;
        sessionStorage.removeItem(SCROLL_STATE_KEY);
        hasRestored.current = false;
    }, []);

    return {
        saveScrollState,
        getSavedState,
        restoreScrollPosition,
        clearScrollState,
    };
}
