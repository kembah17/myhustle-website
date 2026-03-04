-- Enhanced Reviews System Migration
-- Adds photo support, business owner responses, helpful counts, and moderation

-- 1. Add new columns to existing reviews table
ALTER TABLE "reviews" ADD COLUMN IF NOT EXISTS "reviewer_name" TEXT;
ALTER TABLE "reviews" ADD COLUMN IF NOT EXISTS "photos" TEXT[] DEFAULT '{}';
ALTER TABLE "reviews" ADD COLUMN IF NOT EXISTS "booking_id" TEXT;
ALTER TABLE "reviews" ADD COLUMN IF NOT EXISTS "is_verified_booking" BOOLEAN NOT NULL DEFAULT false;
ALTER TABLE "reviews" ADD COLUMN IF NOT EXISTS "status" TEXT NOT NULL DEFAULT 'published';
ALTER TABLE "reviews" ADD COLUMN IF NOT EXISTS "helpful_count" INTEGER NOT NULL DEFAULT 0;

-- Add foreign key for booking_id (nullable)
ALTER TABLE "reviews" ADD CONSTRAINT "reviews_booking_id_fkey"
  FOREIGN KEY ("booking_id") REFERENCES "bookings"("id")
  ON DELETE SET NULL ON UPDATE CASCADE;

-- Index for faster queries
CREATE INDEX IF NOT EXISTS "reviews_status_idx" ON "reviews"("status");
CREATE INDEX IF NOT EXISTS "reviews_business_status_idx" ON "reviews"("business_id", "status");
CREATE INDEX IF NOT EXISTS "reviews_helpful_idx" ON "reviews"("helpful_count" DESC);

-- 2. Create review_responses table for business owner replies
CREATE TABLE IF NOT EXISTS "review_responses" (
    "id" TEXT NOT NULL DEFAULT gen_random_uuid()::text,
    "review_id" TEXT NOT NULL,
    "business_id" TEXT NOT NULL,
    "response_text" TEXT NOT NULL,
    "created_at" TIMESTAMPTZ NOT NULL DEFAULT now(),

    CONSTRAINT "review_responses_pkey" PRIMARY KEY ("id"),
    CONSTRAINT "review_responses_review_id_fkey" FOREIGN KEY ("review_id") REFERENCES "reviews"("id") ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT "review_responses_business_id_fkey" FOREIGN KEY ("business_id") REFERENCES "businesses"("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- One response per review
CREATE UNIQUE INDEX IF NOT EXISTS "review_responses_review_id_unique" ON "review_responses"("review_id");

-- 3. Supabase Storage bucket for review photos
-- Note: Run this in Supabase SQL editor or via the dashboard
-- The bucket creation requires storage admin privileges
INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES (
  'review-photos',
  'review-photos',
  true,
  5242880, -- 5MB
  ARRAY['image/jpeg', 'image/png', 'image/webp']
)
ON CONFLICT (id) DO NOTHING;

-- Storage policies: anyone can read public review photos
CREATE POLICY "Public read access for review photos"
  ON storage.objects FOR SELECT
  USING (bucket_id = 'review-photos');

-- Authenticated users can upload review photos
CREATE POLICY "Authenticated users can upload review photos"
  ON storage.objects FOR INSERT
  WITH CHECK (
    bucket_id = 'review-photos'
  );

-- 4. RLS Policies for reviews table
ALTER TABLE "reviews" ENABLE ROW LEVEL SECURITY;

-- Anyone can read published reviews
CREATE POLICY "Anyone can read published reviews"
  ON "reviews" FOR SELECT
  USING ("status" = 'published');

-- Anyone can insert reviews (both authenticated and anonymous)
CREATE POLICY "Anyone can insert reviews"
  ON "reviews" FOR INSERT
  WITH CHECK (true);

-- Business owners can update review status (flag reviews)
CREATE POLICY "Business owners can flag reviews"
  ON "reviews" FOR UPDATE
  USING (
    EXISTS (
      SELECT 1 FROM "businesses"
      WHERE "businesses"."id" = "reviews"."business_id"
      AND "businesses"."user_id" = auth.uid()::text
    )
  );

-- 5. RLS Policies for review_responses table
ALTER TABLE "review_responses" ENABLE ROW LEVEL SECURITY;

-- Anyone can read responses
CREATE POLICY "Anyone can read review responses"
  ON "review_responses" FOR SELECT
  USING (true);

-- Business owners can insert responses for their business
CREATE POLICY "Business owners can respond to reviews"
  ON "review_responses" FOR INSERT
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM "businesses"
      WHERE "businesses"."id" = "review_responses"."business_id"
      AND "businesses"."user_id" = auth.uid()::text
    )
  );

-- Business owners can update their own responses
CREATE POLICY "Business owners can update their responses"
  ON "review_responses" FOR UPDATE
  USING (
    EXISTS (
      SELECT 1 FROM "businesses"
      WHERE "businesses"."id" = "review_responses"."business_id"
      AND "businesses"."user_id" = auth.uid()::text
    )
  );
