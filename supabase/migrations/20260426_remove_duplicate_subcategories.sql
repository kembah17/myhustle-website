-- Remove duplicate subcategories in Home Services
-- Migration: 20260426_remove_duplicate_subcategories.sql
-- Remaps businesses to the kept category, then deletes the duplicate

BEGIN;

-- Cleaners → Cleaners & Housekeeping
UPDATE businesses SET category_id = (SELECT id FROM categories WHERE slug = 'cleaners-and-housekeeping' LIMIT 1)
  WHERE category_id = (SELECT id FROM categories WHERE slug = 'cleaners' LIMIT 1);
DELETE FROM categories WHERE slug = 'cleaners';

-- AC Repair → AC Repair & Installation
UPDATE businesses SET category_id = (SELECT id FROM categories WHERE slug = 'ac-repair-and-installation' LIMIT 1)
  WHERE category_id = (SELECT id FROM categories WHERE slug = 'ac-repair' LIMIT 1);
DELETE FROM categories WHERE slug = 'ac-repair';

-- Fumigation → Fumigation & Pest Control
UPDATE businesses SET category_id = (SELECT id FROM categories WHERE slug = 'fumigation-and-pest-control' LIMIT 1)
  WHERE category_id = (SELECT id FROM categories WHERE slug = 'fumigation' LIMIT 1);
DELETE FROM categories WHERE slug = 'fumigation';

-- Plumbers (generic) → Plumbers (Home Services)
UPDATE businesses SET category_id = (SELECT id FROM categories WHERE slug = 'home-plumbers' LIMIT 1)
  WHERE category_id = (SELECT id FROM categories WHERE slug = 'plumbers' LIMIT 1);
DELETE FROM categories WHERE slug = 'plumbers';

COMMIT;