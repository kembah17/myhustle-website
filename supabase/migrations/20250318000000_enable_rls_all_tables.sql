-- ============================================================
-- MyHustle RLS Fix Migration
-- Date: 2025-03-18
-- Issue: 8 tables created in init migration have RLS disabled
-- Fix: Enable RLS + create appropriate policies
-- Note: service_role key bypasses RLS by default in Supabase,
--       so no explicit service-role policies are needed.
-- ============================================================

-- ============================================================
-- 1. REFERENCE / LOOKUP TABLES
--    (categories, cities, areas, landmarks)
--    Policy: Anyone can read. Writes go through service_role
--    key (which bypasses RLS) or admin API routes.
-- ============================================================

-- CATEGORIES
ALTER TABLE "categories" ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Categories are viewable by everyone"
  ON "categories" FOR SELECT
  USING (true);

-- CITIES
ALTER TABLE "cities" ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Cities are viewable by everyone"
  ON "cities" FOR SELECT
  USING (true);

-- AREAS
ALTER TABLE "areas" ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Areas are viewable by everyone"
  ON "areas" FOR SELECT
  USING (true);

-- LANDMARKS
ALTER TABLE "landmarks" ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Landmarks are viewable by everyone"
  ON "landmarks" FOR SELECT
  USING (true);

-- ============================================================
-- 2. BUSINESS DATA TABLES
--    (businesses, business_hours, business_photos)
--    Policy: Anyone can read. Owners (matched by user_id on
--    businesses table) can manage their own records.
-- ============================================================

-- BUSINESSES
ALTER TABLE "businesses" ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Businesses are viewable by everyone"
  ON "businesses" FOR SELECT
  USING (true);

CREATE POLICY "Business owners can insert their own business"
  ON "businesses" FOR INSERT
  WITH CHECK (auth.uid()::text = user_id);

CREATE POLICY "Business owners can update their own business"
  ON "businesses" FOR UPDATE
  USING (auth.uid()::text = user_id)
  WITH CHECK (auth.uid()::text = user_id);

CREATE POLICY "Business owners can delete their own business"
  ON "businesses" FOR DELETE
  USING (auth.uid()::text = user_id);

-- BUSINESS_HOURS
ALTER TABLE "business_hours" ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Business hours are viewable by everyone"
  ON "business_hours" FOR SELECT
  USING (true);

CREATE POLICY "Business owners can manage their hours"
  ON "business_hours" FOR INSERT
  WITH CHECK (
    business_id IN (
      SELECT id FROM businesses WHERE user_id = auth.uid()::text
    )
  );

CREATE POLICY "Business owners can update their hours"
  ON "business_hours" FOR UPDATE
  USING (
    business_id IN (
      SELECT id FROM businesses WHERE user_id = auth.uid()::text
    )
  );

CREATE POLICY "Business owners can delete their hours"
  ON "business_hours" FOR DELETE
  USING (
    business_id IN (
      SELECT id FROM businesses WHERE user_id = auth.uid()::text
    )
  );

-- BUSINESS_PHOTOS
ALTER TABLE "business_photos" ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Business photos are viewable by everyone"
  ON "business_photos" FOR SELECT
  USING (true);

CREATE POLICY "Business owners can manage their photos"
  ON "business_photos" FOR INSERT
  WITH CHECK (
    business_id IN (
      SELECT id FROM businesses WHERE user_id = auth.uid()::text
    )
  );

CREATE POLICY "Business owners can update their photos"
  ON "business_photos" FOR UPDATE
  USING (
    business_id IN (
      SELECT id FROM businesses WHERE user_id = auth.uid()::text
    )
  );

CREATE POLICY "Business owners can delete their photos"
  ON "business_photos" FOR DELETE
  USING (
    business_id IN (
      SELECT id FROM businesses WHERE user_id = auth.uid()::text
    )
  );

-- ============================================================
-- 3. BOOKINGS TABLE
--    Note: bookings has NO user_id column. It stores guest
--    bookings with customer_name, customer_phone, customer_email.
--    Policy: Anyone can create a booking (public form).
--    Business owners can view bookings for their business.
-- ============================================================

ALTER TABLE "bookings" ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can create a booking"
  ON "bookings" FOR INSERT
  WITH CHECK (true);

CREATE POLICY "Business owners can view their bookings"
  ON "bookings" FOR SELECT
  USING (
    business_id IN (
      SELECT id FROM businesses WHERE user_id = auth.uid()::text
    )
  );

CREATE POLICY "Business owners can update their bookings"
  ON "bookings" FOR UPDATE
  USING (
    business_id IN (
      SELECT id FROM businesses WHERE user_id = auth.uid()::text
    )
  );

-- ============================================================
-- VERIFICATION: Run after migration to confirm all tables
-- have RLS enabled:
--
-- SELECT tablename, rowsecurity
-- FROM pg_tables
-- WHERE schemaname = 'public'
-- ORDER BY tablename;
-- ============================================================
