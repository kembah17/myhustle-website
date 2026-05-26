-- Efficient function to get business counts per area for a given city
CREATE OR REPLACE FUNCTION get_area_business_counts(target_city_id text)
RETURNS TABLE(area_id text, count bigint)
LANGUAGE sql
STABLE
AS $$
  SELECT area_id, COUNT(*) as count
  FROM businesses
  WHERE city_id = target_city_id
    AND area_id IS NOT NULL
  GROUP BY area_id;
$$;
