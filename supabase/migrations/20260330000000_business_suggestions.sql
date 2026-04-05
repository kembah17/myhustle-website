-- Migration: Business Suggestions System
-- Version: 2.0
-- Date: 2026-03-30
-- Description: Creates the business_suggestions table for community-driven
--   listing discovery. Users can suggest businesses they want to see on
--   MyHustle. When 3+ people suggest the same business (fuzzy match on
--   name + area), the priority auto-increments. Approved suggestions
--   become unclaimed listings (grey badge).

-- =============================================================
-- 1. Create ENUM type for suggestion status
-- =============================================================
DO $$
BEGIN
    IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'suggestion_status') THEN
        CREATE TYPE suggestion_status AS ENUM (
            'pending',
            'contacted',
            'listed',
            'rejected'
        );
    END IF;
END
$$;

-- =============================================================
-- 2. Create business_suggestions table
-- =============================================================
CREATE TABLE IF NOT EXISTS business_suggestions (
    id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    business_name   TEXT NOT NULL,
    category        TEXT NOT NULL,
    area            TEXT NOT NULL,
    city            TEXT NOT NULL,
    phone_number    TEXT,
    suggester_name  TEXT,
    suggester_phone TEXT,
    status          suggestion_status NOT NULL DEFAULT 'pending',
    priority        INTEGER NOT NULL DEFAULT 0,
    created_at      TIMESTAMPTZ NOT NULL DEFAULT now(),
    updated_at      TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- =============================================================
-- 3. Add comment for documentation
-- =============================================================
COMMENT ON TABLE business_suggestions IS
    'Community-submitted business suggestions. Priority auto-increments '
    'when multiple people suggest the same business (fuzzy match on '
    'business_name + area). Approved suggestions become unclaimed listings.';

COMMENT ON COLUMN business_suggestions.priority IS
    'Auto-incremented when 3+ people suggest the same business '
    '(fuzzy match on name + area). Higher = more requested.';

COMMENT ON COLUMN business_suggestions.status IS
    'pending = new suggestion, contacted = business has been reached out to, '
    'listed = converted to an unclaimed listing, rejected = not suitable.';

-- =============================================================
-- 4. Indexes for performance
-- =============================================================
CREATE INDEX IF NOT EXISTS idx_suggestions_status
    ON business_suggestions (status);

CREATE INDEX IF NOT EXISTS idx_suggestions_city
    ON business_suggestions (city);

CREATE INDEX IF NOT EXISTS idx_suggestions_city_area
    ON business_suggestions (city, area);

CREATE INDEX IF NOT EXISTS idx_suggestions_priority_desc
    ON business_suggestions (priority DESC)
    WHERE status = 'pending';

CREATE INDEX IF NOT EXISTS idx_suggestions_created_at
    ON business_suggestions (created_at DESC);

-- Composite index for fuzzy-match duplicate detection
CREATE INDEX IF NOT EXISTS idx_suggestions_name_area_lower
    ON business_suggestions (lower(business_name), lower(area));

-- =============================================================
-- 5. Auto-update updated_at trigger
-- =============================================================
CREATE OR REPLACE FUNCTION update_suggestion_updated_at()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = now();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS trg_suggestion_updated_at ON business_suggestions;
CREATE TRIGGER trg_suggestion_updated_at
    BEFORE UPDATE ON business_suggestions
    FOR EACH ROW
    EXECUTE FUNCTION update_suggestion_updated_at();

-- =============================================================
-- 6. Auto-priority increment trigger
--    When a new suggestion is inserted, check if a similar
--    business (same name pattern + same area) already exists.
--    If so, increment priority on all matching rows.
-- =============================================================
CREATE OR REPLACE FUNCTION auto_increment_suggestion_priority()
RETURNS TRIGGER AS $$
DECLARE
    match_count INTEGER;
BEGIN
    -- Count existing suggestions with similar name in same area
    -- Uses trigram-like fuzzy matching via LOWER + trimming
    SELECT COUNT(*) INTO match_count
    FROM business_suggestions
    WHERE id != NEW.id
      AND lower(trim(area)) = lower(trim(NEW.area))
      AND (
          lower(trim(business_name)) = lower(trim(NEW.business_name))
          OR lower(trim(business_name)) LIKE '%' || lower(trim(NEW.business_name)) || '%'
          OR lower(trim(NEW.business_name)) LIKE '%' || lower(trim(business_name)) || '%'
      );

    -- If 2+ existing matches (meaning this is the 3rd+ suggestion),
    -- increment priority on all matching rows including this one
    IF match_count >= 2 THEN
        UPDATE business_suggestions
        SET priority = priority + 1
        WHERE lower(trim(area)) = lower(trim(NEW.area))
          AND (
              lower(trim(business_name)) = lower(trim(NEW.business_name))
              OR lower(trim(business_name)) LIKE '%' || lower(trim(NEW.business_name)) || '%'
              OR lower(trim(NEW.business_name)) LIKE '%' || lower(trim(business_name)) || '%'
          );

        -- Also set priority on the new row itself
        NEW.priority = match_count;
    END IF;

    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS trg_auto_priority ON business_suggestions;
CREATE TRIGGER trg_auto_priority
    BEFORE INSERT ON business_suggestions
    FOR EACH ROW
    EXECUTE FUNCTION auto_increment_suggestion_priority();

-- =============================================================
-- 7. Row Level Security (RLS)
-- =============================================================
ALTER TABLE business_suggestions ENABLE ROW LEVEL SECURITY;

-- Policy: Anyone can INSERT (public suggestion form)
CREATE POLICY suggestions_public_insert
    ON business_suggestions
    FOR INSERT
    TO anon, authenticated
    WITH CHECK (true);

-- Policy: Anyone can read suggestions (for transparency / display)
CREATE POLICY suggestions_public_read
    ON business_suggestions
    FOR SELECT
    TO anon, authenticated
    USING (true);

-- Policy: Only service_role can UPDATE (admin operations)
CREATE POLICY suggestions_service_update
    ON business_suggestions
    FOR UPDATE
    TO service_role
    USING (true)
    WITH CHECK (true);

-- Policy: Only service_role can DELETE (admin operations)
CREATE POLICY suggestions_service_delete
    ON business_suggestions
    FOR DELETE
    TO service_role
    USING (true);

-- =============================================================
-- 8. Grant minimal permissions
-- =============================================================
GRANT INSERT ON business_suggestions TO anon;
GRANT SELECT ON business_suggestions TO anon;
GRANT INSERT, SELECT ON business_suggestions TO authenticated;
GRANT ALL ON business_suggestions TO service_role;
