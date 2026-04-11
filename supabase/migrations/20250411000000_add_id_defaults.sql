-- Fix: Add default UUID generation for tables where users create records
-- Root cause: "id" TEXT NOT NULL has no DEFAULT, and application code doesn't provide one
-- This affects businesses, reviews, and bookings tables

-- Businesses table - users create listings via onboarding
ALTER TABLE "businesses" 
  ALTER COLUMN "id" SET DEFAULT gen_random_uuid()::text;

-- Reviews table - users will create reviews
ALTER TABLE "reviews" 
  ALTER COLUMN "id" SET DEFAULT gen_random_uuid()::text;

-- Bookings table - users will create bookings  
ALTER TABLE "bookings" 
  ALTER COLUMN "id" SET DEFAULT gen_random_uuid()::text;

-- Verify defaults are set
SELECT table_name, column_name, column_default 
FROM information_schema.columns 
WHERE table_schema = 'public' 
  AND column_name = 'id' 
  AND table_name IN ('businesses', 'reviews', 'bookings');
