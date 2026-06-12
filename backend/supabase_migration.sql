-- SQL Migration to create shared_files table in public schema
-- Run this on your Supabase SQL Editor.

CREATE TABLE IF NOT EXISTS public.shared_files (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    owner_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    file_name TEXT NOT NULL,
    storage_path TEXT NOT NULL,
    share_token TEXT UNIQUE NOT NULL,
    expires_at TIMESTAMPTZ NOT NULL,
    max_downloads INTEGER DEFAULT 1, -- -1 for unlimited
    download_count INTEGER DEFAULT 0,
    access_count INTEGER DEFAULT 0,
    link_password_hash TEXT NULL,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    last_accessed_at TIMESTAMPTZ NULL,
    status TEXT DEFAULT 'active'
);

-- Index token for fast O(1) lookups
CREATE UNIQUE INDEX IF NOT EXISTS idx_shared_files_token ON public.shared_files (share_token);

-- Index owner for fast user share lists
CREATE INDEX IF NOT EXISTS idx_shared_files_owner ON public.shared_files (owner_id);

-- Enable Row Level Security (RLS)
ALTER TABLE public.shared_files ENABLE ROW LEVEL SECURITY;

-- Disable direct public read access to ensure tokens are validated exclusively via FastAPI backend.
-- Allow authenticated owners to manage their shared files directly
CREATE POLICY "Allow owners to manage their shares" ON public.shared_files
    FOR ALL
    TO authenticated
    USING (auth.uid() = owner_id)
    WITH CHECK (auth.uid() = owner_id);
