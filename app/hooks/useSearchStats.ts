"use client";

import { useState, useEffect, useCallback } from "react";

const STORAGE_KEY = "pokemon-search-stats";

interface SearchStat {
    query: string;      // Pokemon name (lowercase)
    count: number;      // Number of times clicked
    lastSearched: number; // Timestamp
}

interface SearchStats {
    [query: string]: SearchStat;
}

/**
 * Hook สำหรับจัดการสถิติการ search Pokemon
 * - บันทึกทุกครั้งที่ user กดเข้าดู Pokemon detail
 * - ดึง Top N คำที่ถูก search บ่อยสุด
 */
export function useSearchStats() {
    const [stats, setStats] = useState<SearchStats>({});

    // Load from localStorage on mount
    useEffect(() => {
        if (typeof window === "undefined") return;

        try {
            const stored = localStorage.getItem(STORAGE_KEY);
            if (stored) {
                setStats(JSON.parse(stored));
            }
        } catch (e) {
            console.warn("Failed to load search stats:", e);
        }
    }, []);

    // Save to localStorage when stats change
    const saveStats = useCallback((newStats: SearchStats) => {
        setStats(newStats);
        try {
            localStorage.setItem(STORAGE_KEY, JSON.stringify(newStats));
        } catch (e) {
            console.warn("Failed to save search stats:", e);
        }
    }, []);

    /**
     * บันทึกการ search (เรียกเมื่อ user กดเข้าดู detail)
     */
    const recordSearch = useCallback((query: string) => {
        if (!query.trim()) return;

        const normalizedQuery = query.toLowerCase().trim();

        setStats((prevStats) => {
            const existing = prevStats[normalizedQuery];
            const newStats = {
                ...prevStats,
                [normalizedQuery]: {
                    query: normalizedQuery,
                    count: existing ? existing.count + 1 : 1,
                    lastSearched: Date.now(),
                },
            };

            // Save to localStorage
            try {
                localStorage.setItem(STORAGE_KEY, JSON.stringify(newStats));
            } catch (e) {
                console.warn("Failed to save search stats:", e);
            }

            return newStats;
        });
    }, []);

    /**
     * ดึง Top N Pokemon ที่ถูก search บ่อยสุด
     */
    const getPopularSearches = useCallback((limit: number = 5): SearchStat[] => {
        return Object.values(stats)
            .sort((a, b) => b.count - a.count)
            .slice(0, limit);
    }, [stats]);

    /**
     * ดึง Pokemon ที่ถูก search ล่าสุด
     */
    const getRecentSearches = useCallback((limit: number = 5): SearchStat[] => {
        return Object.values(stats)
            .sort((a, b) => b.lastSearched - a.lastSearched)
            .slice(0, limit);
    }, [stats]);

    /**
     * Clear all stats
     */
    const clearStats = useCallback(() => {
        saveStats({});
    }, [saveStats]);

    return {
        stats,
        recordSearch,
        getPopularSearches,
        getRecentSearches,
        clearStats,
    };
}
