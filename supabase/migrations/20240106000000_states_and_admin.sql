-- States table
CREATE TABLE IF NOT EXISTS states (
  id TEXT PRIMARY KEY DEFAULT gen_random_uuid()::text,
  slug TEXT UNIQUE NOT NULL,
  name TEXT NOT NULL,
  code TEXT UNIQUE,
  geo_zone TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Add state_id to cities
ALTER TABLE cities ADD COLUMN IF NOT EXISTS state_id TEXT REFERENCES states(id);

-- Seed Nigerian states for current cities
INSERT INTO states (id, slug, name, code, geo_zone) VALUES
  ('state-lagos', 'lagos', 'Lagos State', 'LA', 'South-West'),
  ('state-fct', 'abuja', 'Federal Capital Territory', 'FC', 'North-Central'),
  ('state-rivers', 'rivers', 'Rivers State', 'RV', 'South-South')
ON CONFLICT (slug) DO NOTHING;

-- Link existing cities to states
UPDATE cities SET state_id = 'state-lagos' WHERE slug = 'lagos';
UPDATE cities SET state_id = 'state-fct' WHERE slug = 'abuja';
UPDATE cities SET state_id = 'state-rivers' WHERE slug = 'port-harcourt';

-- RLS for states
ALTER TABLE states ENABLE ROW LEVEL SECURITY;
CREATE POLICY "States are viewable by everyone" ON states FOR SELECT USING (true);
CREATE POLICY "States are editable by service role" ON states FOR ALL USING (true);

-- Index
CREATE INDEX IF NOT EXISTS idx_cities_state_id ON cities(state_id);
