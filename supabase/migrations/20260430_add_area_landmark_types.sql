-- Add area_type and landmark_type columns for categorized drop-down UX
-- Area types: commercial, residential, mixed, industrial, government, university, suburban
-- Landmark types: market, mall, hotel, hospital, university, transport, government, religious, park, stadium, monument

-- Add area_type column
ALTER TABLE areas ADD COLUMN IF NOT EXISTS area_type TEXT DEFAULT 'mixed';

-- Add landmark_type column  
ALTER TABLE landmarks ADD COLUMN IF NOT EXISTS landmark_type TEXT DEFAULT 'market';

-- Add latitude/longitude to areas for map features
ALTER TABLE areas ADD COLUMN IF NOT EXISTS latitude DOUBLE PRECISION;
ALTER TABLE areas ADD COLUMN IF NOT EXISTS longitude DOUBLE PRECISION;

-- Create indexes for type-based filtering (drop-down categorization)
CREATE INDEX IF NOT EXISTS idx_areas_type ON areas(area_type);
CREATE INDEX IF NOT EXISTS idx_areas_city_type ON areas(city_id, area_type);
CREATE INDEX IF NOT EXISTS idx_landmarks_type ON landmarks(landmark_type);
CREATE INDEX IF NOT EXISTS idx_landmarks_area_type ON landmarks(area_id, landmark_type);

-- Comment on columns for documentation
COMMENT ON COLUMN areas.area_type IS 'Category for drop-down filtering: commercial, residential, mixed, industrial, government, university, suburban';
COMMENT ON COLUMN landmarks.landmark_type IS 'Category for drop-down filtering: market, mall, hotel, hospital, university, transport, government, religious, park, stadium, monument';
