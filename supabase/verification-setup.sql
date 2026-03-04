-- ============================================================
-- MyHustle 3-Tier Business Verification System
-- ============================================================
-- Tier 0: Unverified (default)
-- Tier 1: Phone Verified (OTP)
-- Tier 2: Document Verified (CAC, Tax ID, etc.)
-- Tier 3: Remotely Verified (live video call)
-- ============================================================

-- a) Alter businesses table
ALTER TABLE businesses ADD COLUMN IF NOT EXISTS verification_tier INTEGER DEFAULT 0;
ALTER TABLE businesses ADD COLUMN IF NOT EXISTS verification_phone TEXT;
ALTER TABLE businesses ADD COLUMN IF NOT EXISTS verification_date TIMESTAMPTZ;
-- verification_tier: 0=unverified, 1=phone, 2=document, 3=remote video call
-- Keep verified boolean as computed: true if verification_tier >= 1

-- b) Create verification_requests table
CREATE TABLE IF NOT EXISTS verification_requests (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  business_id UUID NOT NULL REFERENCES businesses(id) ON DELETE CASCADE,
  requested_tier INTEGER NOT NULL,
  status TEXT NOT NULL DEFAULT 'pending',
  submitted_at TIMESTAMPTZ DEFAULT now(),
  reviewed_at TIMESTAMPTZ,
  reviewer_notes TEXT,
  phone_number TEXT,
  otp_verified BOOLEAN DEFAULT false,
  document_type TEXT,
  document_url TEXT,
  business_name_on_doc TEXT,
  registration_number TEXT,
  video_call_date DATE,
  video_call_screenshots TEXT[],
  video_call_notes TEXT,
  verified_address TEXT  -- confirmed via video call
);

-- c) RLS policies
ALTER TABLE verification_requests ENABLE ROW LEVEL SECURITY;

-- Business owners can INSERT their own verification requests
CREATE POLICY "Business owners can insert verification requests"
  ON verification_requests
  FOR INSERT
  WITH CHECK (
    business_id IN (
      SELECT id FROM businesses WHERE user_id = auth.uid()
    )
  );

-- Business owners can SELECT their own verification requests
CREATE POLICY "Business owners can view own verification requests"
  ON verification_requests
  FOR SELECT
  USING (
    business_id IN (
      SELECT id FROM businesses WHERE user_id = auth.uid()
    )
  );

-- Service role can do everything (implicit via supabase service role)
-- No explicit policy needed as service role bypasses RLS

-- Index for faster lookups
CREATE INDEX IF NOT EXISTS idx_verification_requests_business_id
  ON verification_requests(business_id);

CREATE INDEX IF NOT EXISTS idx_verification_requests_status
  ON verification_requests(status);

CREATE INDEX IF NOT EXISTS idx_businesses_verification_tier
  ON businesses(verification_tier);
