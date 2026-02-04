import { createClient } from '@supabase/supabase-js';

// Supabase client configuration
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || '';
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || '';

// Create client only if credentials are available
export const supabase = supabaseUrl && supabaseAnonKey
    ? createClient(supabaseUrl, supabaseAnonKey)
    : null;

// Check if Supabase is available
export const isSupabaseConfigured = () => {
    return supabase !== null;
};

// Database types for search history
export interface SearchRecord {
    id?: number;
    pokemon_name: string;
    search_count: number;
    last_searched_at: string;
    created_at?: string;
}

// Record a Pokemon search
export async function recordSearch(pokemonName: string): Promise<boolean> {
    if (!supabase) {
        console.log('Supabase not configured, search not recorded');
        return false;
    }

    try {
        const normalizedName = pokemonName.toLowerCase();

        // Check if Pokemon already exists in search history
        const { data: existing } = await supabase
            .from('search_history')
            .select('*')
            .eq('pokemon_name', normalizedName)
            .single();

        if (existing) {
            // Update existing record
            const { error } = await supabase
                .from('search_history')
                .update({
                    search_count: existing.search_count + 1,
                    last_searched_at: new Date().toISOString()
                })
                .eq('pokemon_name', normalizedName);

            if (error) throw error;
        } else {
            // Insert new record
            const { error } = await supabase
                .from('search_history')
                .insert({
                    pokemon_name: normalizedName,
                    search_count: 1,
                    last_searched_at: new Date().toISOString()
                });

            if (error) throw error;
        }

        return true;
    } catch (error) {
        console.error('Error recording search:', error);
        return false;
    }
}

// Get popular/top searched Pokemon
export async function getPopularSearches(limit: number = 10): Promise<SearchRecord[]> {
    if (!supabase) {
        return [];
    }

    try {
        const { data, error } = await supabase
            .from('search_history')
            .select('*')
            .order('search_count', { ascending: false })
            .limit(limit);

        if (error) throw error;
        return data || [];
    } catch (error) {
        console.error('Error fetching popular searches:', error);
        return [];
    }
}
