"use client";

import { useEffect, useRef } from "react";
import { usePathname } from "next/navigation";

const SCROLL_KEY = "pokemon-scroll-position";

/**
 * Hook to save and restore scroll position when navigating between pages
 * Saves position when leaving homepage, restores when returning
 */
export function useScrollRestoration() {
    const pathname = usePathname();
    const isHomepage = pathname === "/";
    const hasRestored = useRef(false);

    // Save scroll position before navigating away from homepage
    useEffect(() => {
        if (!isHomepage) return;

        const saveScrollPosition = () => {
            sessionStorage.setItem(SCROLL_KEY, window.scrollY.toString());
        };

        // Save on any navigation attempt (clicking links)
        const handleClick = (e: MouseEvent) => {
            const target = e.target as HTMLElement;
            const link = target.closest("a");
            if (link && link.href && !link.href.includes("#")) {
                saveScrollPosition();
            }
        };

        document.addEventListener("click", handleClick);

        // Restore scroll position when returning to homepage
        if (!hasRestored.current) {
            const savedPosition = sessionStorage.getItem(SCROLL_KEY);
            if (savedPosition) {
                // Use requestAnimationFrame to ensure DOM is painted
                requestAnimationFrame(() => {
                    window.scrollTo(0, parseInt(savedPosition, 10));
                    hasRestored.current = true;
                });
            }
        }

        return () => {
            document.removeEventListener("click", handleClick);
        };
    }, [isHomepage]);

    // Reset restoration flag when leaving homepage
    useEffect(() => {
        if (!isHomepage) {
            hasRestored.current = false;
        }
    }, [isHomepage]);
}
