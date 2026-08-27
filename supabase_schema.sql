-- ==============================================================================
-- MarketShield Supabase Database Schema
-- Run this script in your Supabase SQL Editor: https://supabase.com/dashboard/project/_/sql
-- ==============================================================================

-- 1. PROFILES TABLE (User Accounts & 5-Stock Watchlist)
CREATE TABLE IF NOT EXISTS public.profiles (
    id TEXT PRIMARY KEY,
    email TEXT UNIQUE NOT NULL,
    name TEXT,
    avatar_url TEXT,
    watchlist TEXT[] DEFAULT ARRAY['^NSEI', 'RELIANCE.NS', 'TCS.NS', 'HDFCBANK.NS', 'INFY.NS'],
    last_login TIMESTAMPTZ DEFAULT NOW(),
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Enable RLS for Profiles
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Allow public read on profiles" ON public.profiles FOR SELECT USING (true);
CREATE POLICY "Allow public insert/update on profiles" ON public.profiles FOR ALL USING (true);

-- 2. COMMUNITY POSTS TABLE
CREATE TABLE IF NOT EXISTS public.community_posts (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_email TEXT NOT NULL,
    author_name TEXT NOT NULL,
    author_handle TEXT NOT NULL,
    author_avatar TEXT NOT NULL,
    author_image TEXT,
    stock_tag TEXT NOT NULL DEFAULT '$NIFTY50',
    content TEXT NOT NULL,
    likes_count INTEGER DEFAULT 0,
    dislikes_count INTEGER DEFAULT 0,
    reposts_count INTEGER DEFAULT 0,
    bookmarks_count INTEGER DEFAULT 0,
    is_flagged BOOLEAN DEFAULT FALSE,
    flag_reason TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Enable RLS for Community Posts
ALTER TABLE public.community_posts ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Allow public read on community_posts" ON public.community_posts FOR SELECT USING (true);
CREATE POLICY "Allow public insert/update on community_posts" ON public.community_posts FOR ALL USING (true);

-- 3. COMMUNITY POST INTERACTIONS TABLE (Likes, Dislikes, Reposts, Bookmarks per user)
CREATE TABLE IF NOT EXISTS public.community_post_interactions (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    post_id UUID REFERENCES public.community_posts(id) ON DELETE CASCADE,
    user_email TEXT NOT NULL,
    interaction_type TEXT NOT NULL CHECK (interaction_type IN ('like', 'dislike', 'repost', 'bookmark')),
    created_at TIMESTAMPTZ DEFAULT NOW(),
    UNIQUE(post_id, user_email, interaction_type)
);

-- Enable RLS for Interactions
ALTER TABLE public.community_post_interactions ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Allow public read on interactions" ON public.community_post_interactions FOR SELECT USING (true);
CREATE POLICY "Allow public insert/delete on interactions" ON public.community_post_interactions FOR ALL USING (true);

-- 4. COMMUNITY REPLIES TABLE
CREATE TABLE IF NOT EXISTS public.community_replies (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    post_id UUID REFERENCES public.community_posts(id) ON DELETE CASCADE,
    user_email TEXT NOT NULL,
    author_name TEXT NOT NULL,
    author_handle TEXT NOT NULL,
    author_avatar TEXT NOT NULL,
    author_image TEXT,
    content TEXT NOT NULL,
    likes_count INTEGER DEFAULT 0,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Enable RLS for Replies
ALTER TABLE public.community_replies ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Allow public read on community_replies" ON public.community_replies FOR SELECT USING (true);
CREATE POLICY "Allow public insert/update on community_replies" ON public.community_replies FOR ALL USING (true);

-- Indices for rapid querying
CREATE INDEX IF NOT EXISTS idx_profiles_email ON public.profiles(email);
CREATE INDEX IF NOT EXISTS idx_posts_created_at ON public.community_posts(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_replies_post_id ON public.community_replies(post_id, created_at ASC);
CREATE INDEX IF NOT EXISTS idx_interactions_lookup ON public.community_post_interactions(post_id, user_email);
