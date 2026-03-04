-- ============================================================
-- Migration: Convert Tier 3 from Physical to Remote Video Verification
-- Date: 2024-01-02
-- Description: Rename visit_* columns to video_call_* columns
--              in verification_requests table
-- ============================================================

-- Rename columns
ALTER TABLE verification_requests RENAME COLUMN visit_date TO video_call_date;
ALTER TABLE verification_requests RENAME COLUMN visit_photos TO video_call_screenshots;
ALTER TABLE verification_requests RENAME COLUMN visit_notes TO video_call_notes;

-- Add comment to verified_address for clarity
COMMENT ON COLUMN verification_requests.verified_address IS 'Business address confirmed via live video call';

-- Update the verification_tier comment on businesses table
COMMENT ON COLUMN businesses.verification_tier IS '0=unverified, 1=phone OTP, 2=document upload, 3=remote video call';
