-- Efficient function to get business counts per city
-- Avoids fetching all 73K+ business rows to the client
CREATE OR REPLACE FUNCTION get_city_business_counts()
RETURNS TABLE(city_id text, count bigint)
LANGUAGE sql
STABLE
AS $$
  SELECT city_id, COUNT(*) as count
  FROM businesses
  WHERE city_id IS NOT NULL
  GROUP BY city_id;
$$;
