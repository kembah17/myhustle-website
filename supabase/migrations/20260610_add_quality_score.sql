-- Add quality_score column to businesses table
-- Used by sitemap generation and SEO indexing decisions
ALTER TABLE businesses ADD COLUMN IF NOT EXISTS quality_score integer DEFAULT 0;

-- Create index for efficient sitemap filtering
CREATE INDEX IF NOT EXISTS idx_businesses_quality_score ON businesses(quality_score) WHERE active = true;

-- Function to recompute quality score for a single business
CREATE OR REPLACE FUNCTION compute_quality_score(biz_id uuid)
RETURNS integer AS $$
DECLARE
  score integer := 0;
  desc_len integer;
  biz record;
BEGIN
  SELECT description, area_id, website, verified, verification_tier
  INTO biz FROM businesses WHERE id = biz_id;

  IF NOT FOUND THEN RETURN 0; END IF;

  -- Description quality
  desc_len := length(trim(coalesce(biz.description, '')));
  IF desc_len > 200 THEN score := score + 2;
  ELSIF desc_len >= 100 THEN score := score + 1;
  END IF;

  -- Has area
  IF biz.area_id IS NOT NULL THEN score := score + 1; END IF;

  -- Has website
  IF biz.website IS NOT NULL AND biz.website != '' THEN score := score + 1; END IF;

  -- Has photos
  IF EXISTS(SELECT 1 FROM business_photos WHERE business_id = biz_id) THEN score := score + 2; END IF;

  -- Has published reviews
  IF EXISTS(SELECT 1 FROM reviews WHERE business_id = biz_id AND status = 'published') THEN score := score + 3; END IF;

  -- Has business hours
  IF EXISTS(SELECT 1 FROM business_hours WHERE business_id = biz_id) THEN score := score + 1; END IF;

  -- Is claimed/verified
  IF biz.verified = true OR coalesce(biz.verification_tier, 0) > 0 THEN score := score + 2; END IF;

  RETURN score;
END;
$$ LANGUAGE plpgsql STABLE;

-- Function to bulk-recompute all quality scores
CREATE OR REPLACE FUNCTION recompute_all_quality_scores()
RETURNS integer AS $$
DECLARE
  updated_count integer := 0;
BEGIN
  UPDATE businesses b
  SET quality_score = (
    CASE WHEN length(trim(coalesce(b.description, ''))) > 200 THEN 2
         WHEN length(trim(coalesce(b.description, ''))) >= 100 THEN 1
         ELSE 0 END
    + CASE WHEN b.area_id IS NOT NULL THEN 1 ELSE 0 END
    + CASE WHEN b.website IS NOT NULL AND b.website != '' THEN 1 ELSE 0 END
    + CASE WHEN EXISTS(SELECT 1 FROM business_photos bp WHERE bp.business_id = b.id) THEN 2 ELSE 0 END
    + CASE WHEN EXISTS(SELECT 1 FROM reviews r WHERE r.business_id = b.id AND r.status = 'published') THEN 3 ELSE 0 END
    + CASE WHEN EXISTS(SELECT 1 FROM business_hours bh WHERE bh.business_id = b.id) THEN 1 ELSE 0 END
    + CASE WHEN b.verified = true OR coalesce(b.verification_tier, 0) > 0 THEN 2 ELSE 0 END
  );
  GET DIAGNOSTICS updated_count = ROW_COUNT;
  RETURN updated_count;
END;
$$ LANGUAGE plpgsql;

-- Trigger to auto-update quality_score when business is modified
CREATE OR REPLACE FUNCTION trigger_update_quality_score()
RETURNS trigger AS $$
BEGIN
  NEW.quality_score := compute_quality_score(NEW.id);
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS trg_update_quality_score ON businesses;
CREATE TRIGGER trg_update_quality_score
  BEFORE INSERT OR UPDATE ON businesses
  FOR EACH ROW
  EXECUTE FUNCTION trigger_update_quality_score();

-- Run initial computation
SELECT recompute_all_quality_scores();
