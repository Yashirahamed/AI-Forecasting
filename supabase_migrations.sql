-- ═══════════════════════════════════════════════════════════════
-- WeatherCast AI — Supabase SQL Migrations
-- Run in Supabase SQL Editor (supabase.com → SQL Editor)
-- ═══════════════════════════════════════════════════════════════

-- ── 1. users ────────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS users (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  firebase_uid TEXT UNIQUE NOT NULL,
  name TEXT,
  email TEXT UNIQUE NOT NULL,
  avatar_url TEXT,          -- Cloudinary URL
  home_city TEXT,
  favourite_cities TEXT[],  -- array of city names
  preferred_unit TEXT DEFAULT 'celsius',
  language TEXT DEFAULT 'en',
  role TEXT DEFAULT 'user', -- 'user' or 'admin'
  eco_score INT DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT now()
);

ALTER TABLE users ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Service role full access on users"
  ON users FOR ALL TO service_role USING (true) WITH CHECK (true);

-- ── 2. alerts ───────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS alerts (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  city TEXT NOT NULL,
  type TEXT NOT NULL,       -- storm/heatwave/flood/frost
  severity TEXT NOT NULL,   -- LOW/MEDIUM/HIGH/CRITICAL
  message TEXT,
  ai_checklist TEXT[],      -- Groq-generated safety tips
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT now()
);

ALTER TABLE alerts ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Public read active alerts"
  ON alerts FOR SELECT USING (is_active = true);

CREATE POLICY "Service role full access on alerts"
  ON alerts FOR ALL TO service_role USING (true) WITH CHECK (true);

-- Enable Realtime for live alert updates
ALTER TABLE alerts REPLICA IDENTITY FULL;

-- ── 3. chat_history ─────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS chat_history (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id TEXT NOT NULL,    -- Firebase UID
  role TEXT NOT NULL,       -- 'user' or 'assistant'
  content TEXT NOT NULL,
  created_at TIMESTAMPTZ DEFAULT now()
);

ALTER TABLE chat_history ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Service role full access on chat_history"
  ON chat_history FOR ALL TO service_role USING (true) WITH CHECK (true);

-- ── 4. itineraries ──────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS itineraries (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id TEXT NOT NULL,
  destination TEXT NOT NULL,
  start_date DATE,
  end_date DATE,
  trip_type TEXT,
  plan JSONB,               -- AI-generated day-by-day plan
  weather_snapshot JSONB,   -- weather at time of generation
  pdf_url TEXT,             -- Cloudinary PDF URL
  created_at TIMESTAMPTZ DEFAULT now()
);

ALTER TABLE itineraries ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Service role full access on itineraries"
  ON itineraries FOR ALL TO service_role USING (true) WITH CHECK (true);

-- ── 5. packing_lists ────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS packing_lists (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id TEXT NOT NULL,
  destination TEXT,
  trip_type TEXT,
  items JSONB,              -- [{item, checked, day}]
  pdf_url TEXT,
  created_at TIMESTAMPTZ DEFAULT now()
);

ALTER TABLE packing_lists ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Service role full access on packing_lists"
  ON packing_lists FOR ALL TO service_role USING (true) WITH CHECK (true);

-- ── 6. community_reports ────────────────────────────────────────
CREATE TABLE IF NOT EXISTS community_reports (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id TEXT NOT NULL,
  city TEXT NOT NULL,
  lat FLOAT,
  lng FLOAT,
  description TEXT,
  photo_url TEXT,           -- Cloudinary URL
  weather_type TEXT,        -- rain/fog/storm/clear
  upvotes INT DEFAULT 0,
  downvotes INT DEFAULT 0,
  ai_validated BOOLEAN DEFAULT false,
  created_at TIMESTAMPTZ DEFAULT now()
);

ALTER TABLE community_reports ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Public read community_reports"
  ON community_reports FOR SELECT USING (true);

CREATE POLICY "Service role full access on community_reports"
  ON community_reports FOR ALL TO service_role USING (true) WITH CHECK (true);

-- ── 7. badges ───────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS badges (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id TEXT NOT NULL,
  badge_type TEXT NOT NULL, -- monsoon_chaser/eco_hero etc
  badge_name TEXT,
  badge_icon TEXT,          -- Cloudinary icon URL
  earned_at TIMESTAMPTZ DEFAULT now()
);

ALTER TABLE badges ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Service role full access on badges"
  ON badges FOR ALL TO service_role USING (true) WITH CHECK (true);

-- ── 8. eco_scores ───────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS eco_scores (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id TEXT NOT NULL,
  city TEXT,
  score_delta INT,          -- points earned/lost
  reason TEXT,
  created_at TIMESTAMPTZ DEFAULT now()
);

ALTER TABLE eco_scores ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Service role full access on eco_scores"
  ON eco_scores FOR ALL TO service_role USING (true) WITH CHECK (true);

-- ── 9. saved_articles ───────────────────────────────────────────
CREATE TABLE IF NOT EXISTS saved_articles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id TEXT NOT NULL,
  title TEXT,
  summary TEXT,
  url TEXT,
  category TEXT,
  created_at TIMESTAMPTZ DEFAULT now()
);

ALTER TABLE saved_articles ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Service role full access on saved_articles"
  ON saved_articles FOR ALL TO service_role USING (true) WITH CHECK (true);

-- ── 10. event_plans ─────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS event_plans (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id TEXT NOT NULL,
  event_name TEXT,
  event_date DATE,
  city TEXT,
  event_type TEXT,
  weather_risk_score INT,
  ai_report TEXT,
  alternative_dates JSONB,
  created_at TIMESTAMPTZ DEFAULT now()
);

ALTER TABLE event_plans ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Service role full access on event_plans"
  ON event_plans FOR ALL TO service_role USING (true) WITH CHECK (true);

-- ── 11. weather_cache ───────────────────────────────────────────
CREATE TABLE IF NOT EXISTS weather_cache (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  city TEXT UNIQUE NOT NULL,
  data JSONB,
  cached_at TIMESTAMPTZ DEFAULT now()
);

ALTER TABLE weather_cache ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Service role full access on weather_cache"
  ON weather_cache FOR ALL TO service_role USING (true) WITH CHECK (true);

CREATE POLICY "Public read weather_cache"
  ON weather_cache FOR SELECT USING (true);

-- ── 12. news_cache ──────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS news_cache (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  category TEXT UNIQUE NOT NULL,
  articles JSONB,
  cached_at TIMESTAMPTZ DEFAULT now()
);

ALTER TABLE news_cache ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Service role full access on news_cache"
  ON news_cache FOR ALL TO service_role USING (true) WITH CHECK (true);

CREATE POLICY "Public read news_cache"
  ON news_cache FOR SELECT USING (true);

-- ═══════════════════════════════════════════════════════════════
-- AFTER RUNNING: Go to Supabase → Realtime → Enable for alerts
-- ═══════════════════════════════════════════════════════════════
