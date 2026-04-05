-- ============================================================
-- Migration: Platform Security Features
-- File: 20250405000000_platform_security_features.sql
-- Date: 2025-04-05
-- Description: Adds listing flags, claim attempts, user roles,
--              reviews booking constraint, and comprehensive
--              RLS policies for platform integrity.
-- ============================================================
-- IMPORTANT: This migration is idempotent (safe to run multiple times).
-- All CREATE TABLE use IF NOT EXISTS, all ALTER TABLE use IF NOT EXISTS,
-- all CREATE INDEX use IF NOT EXISTS, all CREATE POLICY use DO $$ blocks.
-- ============================================================

-- ============================================================
-- HELPER: is_admin() function
-- Returns true if the current authenticated user has admin or
-- moderator role in user_roles table. Used by RLS policies.
-- ============================================================
CREATE OR REPLACE FUNCTION public.is_admin()
RETURNS boolean
LANGUAGE sql
SECURITY DEFINER
STABLE
AS $$
  SELECT EXISTS (
    SELECT 1 FROM public.user_roles
    WHERE user_id = auth.uid()::text
    AND role IN ('admin', 'moderator')
  );
$$;

-- ============================================================
-- 1. USER_ROLES TABLE
-- Admin role management. Created first because is_admin()
-- references it and other tables' RLS policies depend on it.
-- ============================================================
CREATE TABLE IF NOT EXISTS user_roles (
  id TEXT PRIMARY KEY DEFAULT gen_random_uuid()::text,
  user_id TEXT NOT NULL UNIQUE,
  role TEXT NOT NULL DEFAULT 'user',  -- 'user', 'admin', 'moderator'
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now(),

  -- Ensure role is one of the allowed values
  CONSTRAINT user_roles_role_check CHECK (role IN ('user', 'admin', 'moderator'))
);

COMMENT ON TABLE user_roles IS 'Stores user role assignments for admin/moderator access control';
COMMENT ON COLUMN user_roles.role IS 'user=default, admin=full access, moderator=content moderation';

-- ============================================================
-- 2. LISTING_FLAGS TABLE
-- Community reporting and system auto-flagging for listings.
-- ============================================================
CREATE TABLE IF NOT EXISTS listing_flags (
  id TEXT PRIMARY KEY DEFAULT gen_random_uuid()::text,
  business_id TEXT NOT NULL REFERENCES businesses(id) ON DELETE CASCADE,
  flag_type TEXT NOT NULL,       -- see CHECK constraint below
  source TEXT NOT NULL,          -- 'user_report', 'system_auto', 'admin'
  reporter_id TEXT,              -- null for system-generated flags
  details TEXT,                  -- free-text description of the issue
  status TEXT DEFAULT 'open',    -- 'open', 'reviewing', 'resolved', 'dismissed'
  auto_action_taken TEXT,        -- 'hidden', 'banner_added', 'marked_closed', null
  resolved_by TEXT,              -- user_id of admin who resolved
  resolved_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now(),

  CONSTRAINT listing_flags_type_check CHECK (
    flag_type IN ('spam', 'incorrect_info', 'closed', 'inappropriate', 'duplicate', 'inactive', 'phone_invalid', 'quality_concern')
  ),
  CONSTRAINT listing_flags_source_check CHECK (
    source IN ('user_report', 'system_auto', 'admin')
  ),
  CONSTRAINT listing_flags_status_check CHECK (
    status IN ('open', 'reviewing', 'resolved', 'dismissed')
  )
);

COMMENT ON TABLE listing_flags IS 'Tracks reports/flags against business listings from users, system, or admins';
COMMENT ON COLUMN listing_flags.flag_type IS 'spam|incorrect_info|closed|inappropriate|duplicate|inactive|phone_invalid|quality_concern';
COMMENT ON COLUMN listing_flags.source IS 'user_report=community flag, system_auto=automated detection, admin=manual admin flag';
COMMENT ON COLUMN listing_flags.auto_action_taken IS 'Action taken automatically: hidden|banner_added|marked_closed|null';

-- ============================================================
-- 3. CLAIM_ATTEMPTS TABLE
-- Audit trail for business claim attempts (phone match,
-- document upload, dispute resolution).
-- ============================================================
CREATE TABLE IF NOT EXISTS claim_attempts (
  id TEXT PRIMARY KEY DEFAULT gen_random_uuid()::text,
  business_id TEXT NOT NULL REFERENCES businesses(id) ON DELETE CASCADE,
  user_id TEXT NOT NULL,          -- the user attempting the claim
  phone_entered TEXT,             -- the phone number they entered for matching
  phone_matched BOOLEAN,          -- whether it matched the business phone
  claim_method TEXT NOT NULL,     -- 'phone_match', 'document_upload', 'dispute'
  document_url TEXT,              -- for dispute uploads (CAC certificate, utility bill)
  document_type TEXT,             -- 'cac_certificate', 'utility_bill', 'other'
  status TEXT DEFAULT 'pending',  -- 'pending', 'approved', 'rejected'
  reviewed_by TEXT,               -- admin user_id who reviewed
  reviewed_at TIMESTAMPTZ,
  notes TEXT,                     -- admin notes on the claim
  created_at TIMESTAMPTZ DEFAULT now(),

  CONSTRAINT claim_attempts_method_check CHECK (
    claim_method IN ('phone_match', 'document_upload', 'dispute')
  ),
  CONSTRAINT claim_attempts_doc_type_check CHECK (
    document_type IS NULL OR document_type IN ('cac_certificate', 'utility_bill', 'other')
  ),
  CONSTRAINT claim_attempts_status_check CHECK (
    status IN ('pending', 'approved', 'rejected')
  )
);

COMMENT ON TABLE claim_attempts IS 'Audit trail for business ownership claim attempts';
COMMENT ON COLUMN claim_attempts.claim_method IS 'phone_match=OTP verification, document_upload=CAC/utility bill, dispute=contested claim';
COMMENT ON COLUMN claim_attempts.document_url IS 'Storage URL for uploaded verification documents (CAC certificate, utility bill)';

-- ============================================================
-- 4. REVIEWS TABLE - ADD BOOKING UNIQUE CONSTRAINT
-- booking_id column already exists (TEXT) from migration
-- 20240103000000_enhanced_reviews.sql. We only add the
-- unique constraint here.
-- Note: NULL booking_id values are excluded from uniqueness
-- by PostgreSQL default behavior (NULLs are distinct).
-- ============================================================

-- Safely add unique constraint (idempotent via DO block)
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_constraint
    WHERE conname = 'reviews_booking_id_unique'
  ) THEN
    ALTER TABLE reviews ADD CONSTRAINT reviews_booking_id_unique UNIQUE (booking_id);
  END IF;
END $$;

COMMENT ON CONSTRAINT reviews_booking_id_unique ON reviews IS 'Ensures at most one review per booking. NULL booking_id allowed for legacy/non-booking reviews.';

-- ============================================================
-- 5. CLAIM CONSTRAINT: One phone can only claim one business
-- Partial unique index on approved phone-match claims.
-- ============================================================
CREATE UNIQUE INDEX IF NOT EXISTS claim_attempts_phone_approved_unique
  ON claim_attempts(phone_entered)
  WHERE status = 'approved' AND phone_matched = true;

COMMENT ON INDEX claim_attempts_phone_approved_unique IS 'Prevents the same phone number from claiming multiple businesses';

-- ============================================================
-- 6. INDEXES FOR PERFORMANCE
-- ============================================================

-- listing_flags indexes
CREATE INDEX IF NOT EXISTS idx_listing_flags_business_id
  ON listing_flags(business_id);
CREATE INDEX IF NOT EXISTS idx_listing_flags_status
  ON listing_flags(status);
CREATE INDEX IF NOT EXISTS idx_listing_flags_flag_type
  ON listing_flags(flag_type);
CREATE INDEX IF NOT EXISTS idx_listing_flags_created_at
  ON listing_flags(created_at DESC);

-- claim_attempts indexes
CREATE INDEX IF NOT EXISTS idx_claim_attempts_business_id
  ON claim_attempts(business_id);
CREATE INDEX IF NOT EXISTS idx_claim_attempts_user_id
  ON claim_attempts(user_id);
CREATE INDEX IF NOT EXISTS idx_claim_attempts_phone_entered
  ON claim_attempts(phone_entered);
CREATE INDEX IF NOT EXISTS idx_claim_attempts_status
  ON claim_attempts(status);

-- reviews booking_id index (partial - only non-null)
CREATE INDEX IF NOT EXISTS idx_reviews_booking_id
  ON reviews(booking_id)
  WHERE booking_id IS NOT NULL;

-- user_roles index
CREATE INDEX IF NOT EXISTS idx_user_roles_user_id
  ON user_roles(user_id);
CREATE INDEX IF NOT EXISTS idx_user_roles_role
  ON user_roles(role);

-- ============================================================
-- 7. ENABLE ROW LEVEL SECURITY ON ALL NEW TABLES
-- ============================================================
ALTER TABLE listing_flags ENABLE ROW LEVEL SECURITY;
ALTER TABLE claim_attempts ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_roles ENABLE ROW LEVEL SECURITY;

-- ============================================================
-- 8. RLS POLICIES - LISTING_FLAGS
-- - Authenticated users can INSERT (submit reports)
-- - Only admins can SELECT, UPDATE, DELETE
-- - Service role bypasses RLS by default
-- ============================================================

-- INSERT: Any authenticated user can submit a flag
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies
    WHERE tablename = 'listing_flags' AND policyname = 'Authenticated users can submit flags'
  ) THEN
    CREATE POLICY "Authenticated users can submit flags"
      ON listing_flags FOR INSERT
      WITH CHECK (auth.uid() IS NOT NULL);
  END IF;
END $$;

-- SELECT: Only admins can view flags
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies
    WHERE tablename = 'listing_flags' AND policyname = 'Admins can view all flags'
  ) THEN
    CREATE POLICY "Admins can view all flags"
      ON listing_flags FOR SELECT
      USING (public.is_admin());
  END IF;
END $$;

-- UPDATE: Only admins can update flags (resolve, dismiss, etc.)
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies
    WHERE tablename = 'listing_flags' AND policyname = 'Admins can update flags'
  ) THEN
    CREATE POLICY "Admins can update flags"
      ON listing_flags FOR UPDATE
      USING (public.is_admin())
      WITH CHECK (public.is_admin());
  END IF;
END $$;

-- DELETE: Only admins can delete flags
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies
    WHERE tablename = 'listing_flags' AND policyname = 'Admins can delete flags'
  ) THEN
    CREATE POLICY "Admins can delete flags"
      ON listing_flags FOR DELETE
      USING (public.is_admin());
  END IF;
END $$;

-- ============================================================
-- 9. RLS POLICIES - CLAIM_ATTEMPTS
-- - Authenticated users can INSERT their own claims
-- - Users can SELECT their own claims
-- - Only admins can UPDATE (approve/reject)
-- - Service role bypasses RLS by default
-- ============================================================

-- INSERT: Authenticated users can submit claims for themselves
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies
    WHERE tablename = 'claim_attempts' AND policyname = 'Users can submit their own claims'
  ) THEN
    CREATE POLICY "Users can submit their own claims"
      ON claim_attempts FOR INSERT
      WITH CHECK (auth.uid()::text = user_id);
  END IF;
END $$;

-- SELECT: Users can view their own claims
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies
    WHERE tablename = 'claim_attempts' AND policyname = 'Users can view their own claims'
  ) THEN
    CREATE POLICY "Users can view their own claims"
      ON claim_attempts FOR SELECT
      USING (auth.uid()::text = user_id);
  END IF;
END $$;

-- SELECT: Admins can view all claims
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies
    WHERE tablename = 'claim_attempts' AND policyname = 'Admins can view all claims'
  ) THEN
    CREATE POLICY "Admins can view all claims"
      ON claim_attempts FOR SELECT
      USING (public.is_admin());
  END IF;
END $$;

-- UPDATE: Only admins can update claims (approve/reject)
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies
    WHERE tablename = 'claim_attempts' AND policyname = 'Admins can update claims'
  ) THEN
    CREATE POLICY "Admins can update claims"
      ON claim_attempts FOR UPDATE
      USING (public.is_admin())
      WITH CHECK (public.is_admin());
  END IF;
END $$;

-- ============================================================
-- 10. RLS POLICIES - USER_ROLES
-- - Only service role can INSERT/UPDATE/DELETE (bypasses RLS)
-- - Users can SELECT their own role
-- - Admins can SELECT all roles (for admin panel)
-- ============================================================

-- SELECT: Users can view their own role
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies
    WHERE tablename = 'user_roles' AND policyname = 'Users can view their own role'
  ) THEN
    CREATE POLICY "Users can view their own role"
      ON user_roles FOR SELECT
      USING (auth.uid()::text = user_id);
  END IF;
END $$;

-- SELECT: Admins can view all roles
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies
    WHERE tablename = 'user_roles' AND policyname = 'Admins can view all roles'
  ) THEN
    CREATE POLICY "Admins can view all roles"
      ON user_roles FOR SELECT
      USING (public.is_admin());
  END IF;
END $$;

-- No INSERT/UPDATE/DELETE policies for user_roles.
-- Only service_role key (which bypasses RLS) can manage roles.
-- This prevents privilege escalation via the client.

-- ============================================================
-- 11. REVIEWS - ADDITIONAL RLS POLICY
-- Users can only insert a review with booking_id if they
-- are associated with that booking (via customer_email or
-- business ownership). Since bookings don't have user_id,
-- we validate via a function.
-- ============================================================

-- Note: The existing reviews INSERT policy allows anyone to insert.
-- We add a more restrictive policy for booking-linked reviews.
-- Since existing policy "Anyone can insert reviews" uses WITH CHECK (true),
-- it already permits all inserts. For booking validation, we rely on
-- application-level checks rather than RLS (bookings lack user_id).
-- Documenting this decision for future reference.

-- FUTURE: When bookings table gets a user_id column, add:
-- CREATE POLICY "Users can only review their own bookings"
--   ON reviews FOR INSERT
--   WITH CHECK (
--     booking_id IS NULL  -- allow non-booking reviews
--     OR EXISTS (
--       SELECT 1 FROM bookings
--       WHERE bookings.id = booking_id
--       AND bookings.user_id = auth.uid()::text
--     )
--   );

-- ============================================================
-- 12. UPDATED_AT TRIGGER FUNCTIONS
-- Auto-update updated_at timestamp on row modification.
-- ============================================================

-- Generic trigger function (reusable)
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER
LANGUAGE plpgsql
AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$;

-- Trigger for listing_flags
DROP TRIGGER IF EXISTS listing_flags_updated_at ON listing_flags;
CREATE TRIGGER listing_flags_updated_at
  BEFORE UPDATE ON listing_flags
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

-- Trigger for user_roles
DROP TRIGGER IF EXISTS user_roles_updated_at ON user_roles;
CREATE TRIGGER user_roles_updated_at
  BEFORE UPDATE ON user_roles
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

-- ============================================================
-- 13. AUTO-FLAG RULES (FUTURE IMPLEMENTATION)
-- These rules document the intended automatic flagging
-- behavior to be implemented as database functions or
-- application-level logic.
-- ============================================================

-- AUTO-FLAG RULE 1: Community Report Threshold
-- When a business receives 3+ flags from different users
-- (source = 'user_report'), automatically:
--   1. Set auto_action_taken = 'hidden' on the triggering flag
--   2. Set businesses.active = false
--   3. Create a system flag with source = 'system_auto'
-- Implementation: Database trigger or Edge Function on listing_flags INSERT
--
-- Example trigger logic:
-- SELECT COUNT(DISTINCT reporter_id) FROM listing_flags
-- WHERE business_id = NEW.business_id
--   AND source = 'user_report'
--   AND status = 'open'
-- If count >= 3 THEN auto-hide

-- AUTO-FLAG RULE 2: Incorrect Info Warning
-- When a business receives 1+ flags with flag_type = 'incorrect_info':
--   1. Add a warning banner to the listing (via metadata/flag)
--   2. Set auto_action_taken = 'banner_added'
-- Implementation: Check on INSERT, update business metadata

-- AUTO-FLAG RULE 3: Closed Business Detection
-- When a business receives 2+ flags with flag_type = 'closed'
-- from different reporters:
--   1. Mark business status as 'Temporarily Closed'
--   2. Set auto_action_taken = 'marked_closed'
-- Implementation: Trigger on listing_flags INSERT

-- AUTO-FLAG RULE 4: Duplicate Detection
-- When two businesses share the same phone number AND are in
-- the same area (same area_id):
--   1. Auto-create a flag with flag_type = 'duplicate'
--   2. Set source = 'system_auto'
-- Implementation: Trigger on businesses INSERT/UPDATE
-- Query: SELECT id FROM businesses
--        WHERE phone = NEW.phone
--          AND area_id = NEW.area_id
--          AND id != NEW.id

-- ============================================================
-- VERIFICATION QUERIES (run after migration to confirm)
-- ============================================================
-- Check all new tables exist:
-- SELECT tablename FROM pg_tables WHERE schemaname = 'public'
--   AND tablename IN ('listing_flags', 'claim_attempts', 'user_roles');
--
-- Check RLS is enabled:
-- SELECT tablename, rowsecurity FROM pg_tables
--   WHERE schemaname = 'public'
--   AND tablename IN ('listing_flags', 'claim_attempts', 'user_roles');
--
-- Check policies:
-- SELECT tablename, policyname, cmd FROM pg_policies
--   WHERE tablename IN ('listing_flags', 'claim_attempts', 'user_roles');
--
-- Check indexes:
-- SELECT indexname FROM pg_indexes
--   WHERE tablename IN ('listing_flags', 'claim_attempts', 'user_roles', 'reviews')
--   ORDER BY tablename, indexname;
--
-- Check constraint on reviews:
-- SELECT conname FROM pg_constraint WHERE conname = 'reviews_booking_id_unique';
-- ============================================================
