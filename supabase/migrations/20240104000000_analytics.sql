-- Analytics Event Tracking Tables
-- Migration: 20240104000000_analytics.sql
-- Purpose: Lightweight event tracking + pre-aggregated daily stats for business analytics dashboard

-- 1. analytics_events: Raw event tracking table
CREATE TABLE analytics_events (
  id TEXT PRIMARY KEY DEFAULT gen_random_uuid()::text,
  business_id TEXT NOT NULL REFERENCES businesses(id) ON DELETE CASCADE,
  event_type TEXT NOT NULL,  -- 'page_view', 'whatsapp_click', 'call_click', 'booking_started', 'booking_completed', 'search_impression', 'review_read'
  metadata JSONB DEFAULT '{}',  -- flexible: {search_query, referrer, device, area, category}
  visitor_id TEXT,  -- anonymous fingerprint (no PII)
  created_at TIMESTAMPTZ DEFAULT now()
);

CREATE INDEX idx_analytics_business ON analytics_events(business_id);
CREATE INDEX idx_analytics_type ON analytics_events(event_type);
CREATE INDEX idx_analytics_created ON analytics_events(created_at);
CREATE INDEX idx_analytics_business_type ON analytics_events(business_id, event_type);

-- 2. analytics_daily: Pre-aggregated daily stats for fast dashboard loading
CREATE TABLE analytics_daily (
  id TEXT PRIMARY KEY DEFAULT gen_random_uuid()::text,
  business_id TEXT NOT NULL REFERENCES businesses(id) ON DELETE CASCADE,
  date DATE NOT NULL,
  page_views INTEGER DEFAULT 0,
  whatsapp_clicks INTEGER DEFAULT 0,
  call_clicks INTEGER DEFAULT 0,
  bookings_started INTEGER DEFAULT 0,
  bookings_completed INTEGER DEFAULT 0,
  search_impressions INTEGER DEFAULT 0,
  unique_visitors INTEGER DEFAULT 0,
  UNIQUE(business_id, date)
);

CREATE INDEX idx_daily_business_date ON analytics_daily(business_id, date);

-- 3. RLS Policies
ALTER TABLE analytics_events ENABLE ROW LEVEL SECURITY;
ALTER TABLE analytics_daily ENABLE ROW LEVEL SECURITY;

-- analytics_events: Anyone can INSERT (anonymous tracking)
CREATE POLICY "Anyone can insert analytics events"
  ON analytics_events FOR INSERT
  WITH CHECK (true);

-- analytics_events: Only business owner can SELECT their events
CREATE POLICY "Business owner can view their analytics events"
  ON analytics_events FOR SELECT
  USING (
    business_id IN (
      SELECT id FROM businesses WHERE user_id = auth.uid()::text
    )
  );

-- analytics_daily: Only business owner can SELECT their daily stats
CREATE POLICY "Business owner can view their daily analytics"
  ON analytics_daily FOR SELECT
  USING (
    business_id IN (
      SELECT id FROM businesses WHERE user_id = auth.uid()::text
    )
  );

-- Allow service role full access for aggregation
CREATE POLICY "Service role full access to analytics_events"
  ON analytics_events FOR ALL
  USING (auth.role() = 'service_role');

CREATE POLICY "Service role full access to analytics_daily"
  ON analytics_daily FOR ALL
  USING (auth.role() = 'service_role');

-- 4. Aggregation function: Aggregate raw events into daily stats
CREATE OR REPLACE FUNCTION aggregate_daily_analytics(target_date DATE DEFAULT CURRENT_DATE)
RETURNS void AS $$
BEGIN
  INSERT INTO analytics_daily (business_id, date, page_views, whatsapp_clicks, call_clicks, bookings_started, bookings_completed, search_impressions, unique_visitors)
  SELECT 
    business_id,
    target_date,
    COUNT(*) FILTER (WHERE event_type = 'page_view'),
    COUNT(*) FILTER (WHERE event_type = 'whatsapp_click'),
    COUNT(*) FILTER (WHERE event_type = 'call_click'),
    COUNT(*) FILTER (WHERE event_type = 'booking_started'),
    COUNT(*) FILTER (WHERE event_type = 'booking_completed'),
    COUNT(*) FILTER (WHERE event_type = 'search_impression'),
    COUNT(DISTINCT visitor_id)
  FROM analytics_events
  WHERE created_at::date = target_date
  GROUP BY business_id
  ON CONFLICT (business_id, date) DO UPDATE SET
    page_views = EXCLUDED.page_views,
    whatsapp_clicks = EXCLUDED.whatsapp_clicks,
    call_clicks = EXCLUDED.call_clicks,
    bookings_started = EXCLUDED.bookings_started,
    bookings_completed = EXCLUDED.bookings_completed,
    search_impressions = EXCLUDED.search_impressions,
    unique_visitors = EXCLUDED.unique_visitors;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;
