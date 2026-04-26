-- Migration: Fix 3 missed parent category renames
-- Date: 2026-04-26
-- These were requested but omitted from the previous cleanup migration.

-- 1. Auto Services & Motoring → Auto Services & Repair
UPDATE categories
  SET name = 'Auto Services & Repair', slug = 'auto-services-and-repair'
  WHERE slug = 'auto-services-and-motoring';

-- 2. Events & Weddings → Events & Parties
UPDATE categories
  SET name = 'Events & Parties', slug = 'events-and-parties'
  WHERE slug = 'events-and-weddings';

-- 3. Health & Medical → Healthcare & Fitness
UPDATE categories
  SET name = 'Healthcare & Fitness', slug = 'healthcare-and-fitness'
  WHERE slug = 'health-and-medical';

-- Also update any subcategory slugs that reference old parent prefixes
UPDATE categories
  SET slug = REPLACE(slug, 'auto-services-and-motoring-', 'auto-services-and-repair-')
  WHERE slug LIKE 'auto-services-and-motoring-%';

UPDATE categories
  SET slug = REPLACE(slug, 'events-and-weddings-', 'events-and-parties-')
  WHERE slug LIKE 'events-and-weddings-%';

UPDATE categories
  SET slug = REPLACE(slug, 'health-and-medical-', 'healthcare-and-fitness-')
  WHERE slug LIKE 'health-and-medical-%';
