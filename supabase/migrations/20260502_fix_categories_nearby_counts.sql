-- Fix for /categories and /near-me pages
-- Replace .eq('active', true) queries with efficient RPC count functions

CREATE OR REPLACE FUNCTION get_category_business_counts()
RETURNS TABLE(category_id text, count bigint)
LANGUAGE sql STABLE
AS $$
  SELECT category_id, COUNT(*) as count
  FROM businesses
  WHERE category_id IS NOT NULL
  GROUP BY category_id;
$$;

CREATE OR REPLACE FUNCTION get_area_business_counts()
RETURNS TABLE(area_id text, count bigint)
LANGUAGE sql STABLE
AS $$
  SELECT area_id, COUNT(*) as count
  FROM businesses
  WHERE area_id IS NOT NULL
  GROUP BY area_id;
$$;
