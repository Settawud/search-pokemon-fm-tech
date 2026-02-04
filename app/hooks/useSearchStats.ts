"use client";

import { useState, useEffect, useCallback } from "react";
import { recordSearch as recordSupabaseSearch, getPopularSearches as getSupabasePopular, isSupabaseConfigured } from "../lib/supabase";

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
 * - ใช้ Supabase เป็นหลักถ้า config ครบ
 * - Fallback ไป localStorage ถ้าไม่มี Supabase
 */
export function useSearchStats() {
    const [stats, setStats] = useState<SearchStats>({});
    const [supabaseEnabled, setSupabaseEnabled] = useState(false);

    // Check if Supabase is available and load initial data
    useEffect(() => {
        const hasSupabase = isSupabaseConfigured();
        setSupabaseEnabled(hasSupabase);

        if (hasSupabase) {
            // Load from Supabase
            loadFromSupabase();
        } else {
            // Load from localStorage
            loadFromLocalStorage();
        }
    }, []);

    const loadFromLocalStorage = () => {
        if (typeof window === "undefined") return;
        try {
            const stored = localStorage.getItem(STORAGE_KEY);
            if (stored) {
                setStats(JSON.parse(stored));
            }
        } catch (e) {
            console.warn("Failed to load search stats:", e);
        }
    };

    const loadFromSupabase = async () => {
        try {
            const popular = await getSupabasePopular(50);
            const newStats: SearchStats = {};
            popular.forEach(record => {
                newStats[record.pokemon_name] = {
                    query: record.pokemon_name,
                    count: record.search_count,
                    lastSearched: new Date(record.last_searched_at).getTime()
                };
            });
            setStats(newStats);
        } catch (e) {
            console.warn("Failed to load from Supabase:", e);
            loadFromLocalStorage(); // Fallback
        }
    };

    // Save to localStorage (fallback)
    const saveToLocalStorage = useCallback((newStats: SearchStats) => {
        try {
            localStorage.setItem(STORAGE_KEY, JSON.stringify(newStats));
        } catch (e) {
            console.warn("Failed to save search stats:", e);
        }
    }, []);

    /**
     * บันทึกการ search (เรียกเมื่อ user กดเข้าดู detail)
     */
    const recordSearch = useCallback(async (query: string) => {
        if (!query.trim()) return;

        const normalizedQuery = query.toLowerCase().trim();

        // Always update local state
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

            // Save to localStorage as backup
            saveToLocalStorage(newStats);
            return newStats;
        });

        // Also save to Supabase if available
        if (supabaseEnabled) {
            await recordSupabaseSearch(normalizedQuery);
        }
    }, [supabaseEnabled, saveToLocalStorage]);

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
        setStats({});
        saveToLocalStorage({});
    }, [saveToLocalStorage]);

    return {
        stats,
        recordSearch,
        getPopularSearches,
        getRecentSearches,
        clearStats,
        supabaseEnabled,
    };
}

