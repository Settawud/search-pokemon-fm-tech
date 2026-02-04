-- Supabase SQL: Create search_history table
-- Run this in your Supabase SQL Editor

CREATE TABLE IF NOT EXISTS search_history (
    id BIGSERIAL PRIMARY KEY,
    pokemon_name TEXT NOT NULL UNIQUE,
    search_count INTEGER DEFAULT 1,
    last_searched_at TIMESTAMPTZ DEFAULT NOW(),
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create index for faster queries
CREATE INDEX IF NOT EXISTS idx_search_history_count ON search_history(search_count DESC);
CREATE INDEX IF NOT EXISTS idx_search_history_name ON search_history(pokemon_name);

-- Enable Row Level Security (optional - if you want public access)
ALTER TABLE search_history ENABLE ROW LEVEL SECURITY;

-- Allow anonymous read/write (for public search tracking)
CREATE POLICY "Allow anonymous read" ON search_history FOR SELECT USING (true);
CREATE POLICY "Allow anonymous insert" ON search_history FOR INSERT WITH CHECK (true);
CREATE POLICY "Allow anonymous update" ON search_history FOR UPDATE USING (true);
