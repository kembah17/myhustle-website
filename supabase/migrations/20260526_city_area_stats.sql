-- Efficient function to get area stats for a specific city
-- Returns areas with business counts and top 3 category names
-- Used by city pages to avoid fetching individual businesses

CREATE OR REPLACE FUNCTION get_city_area_top_categories(p_city_id text)
RETURNS TABLE(area_id text, category_name text, biz_count bigint)
LANGUAGE sql STABLE
AS $$
  WITH ranked AS (
    SELECT
      b.area_id,
      c.name AS category_name,
      COUNT(*) AS biz_count,
      ROW_NUMBER() OVER (PARTITION BY b.area_id ORDER BY COUNT(*) DESC) AS rn
    FROM businesses b
    JOIN categories c ON c.id = b.category_id
    WHERE b.city_id = p_city_id
      AND b.area_id IS NOT NULL
      AND b.category_id IS NOT NULL
    GROUP BY b.area_id, c.name
  )
  SELECT ranked.area_id, ranked.category_name, ranked.biz_count
  FROM ranked
  WHERE rn <= 3;
$$;
