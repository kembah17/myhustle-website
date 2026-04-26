-- Fix all NULL category icons
-- Migration: 20260426_fix_null_icons.sql
-- Generated: 2026-04-26

BEGIN;

UPDATE categories SET icon = '💻' WHERE slug = 'it-consultants' AND icon IS NULL;
UPDATE categories SET icon = '📊' WHERE slug = 'management-consultants' AND icon IS NULL;
UPDATE categories SET icon = '🎯' WHERE slug = 'strategy-consultants' AND icon IS NULL;
UPDATE categories SET icon = '🖼️' WHERE slug = 'art-galleries' AND icon IS NULL;
UPDATE categories SET icon = '📿' WHERE slug = 'bead-making' AND icon IS NULL;
UPDATE categories SET icon = '🎨' WHERE slug = 'craft-workshops' AND icon IS NULL;
UPDATE categories SET icon = '⚽' WHERE slug = 'football-pitches' AND icon IS NULL;
UPDATE categories SET icon = '🏋️' WHERE slug = 'gyms' AND icon IS NULL;
UPDATE categories SET icon = '🏺' WHERE slug = 'pottery' AND icon IS NULL;
UPDATE categories SET icon = '🏟️' WHERE slug = 'sports-centres' AND icon IS NULL;
UPDATE categories SET icon = '🏊' WHERE slug = 'swimming-pools' AND icon IS NULL;
UPDATE categories SET icon = '👘' WHERE slug = 'aso-ebi' AND icon IS NULL;
UPDATE categories SET icon = '👰' WHERE slug = 'bridal-shops' AND icon IS NULL;
UPDATE categories SET icon = '🎂' WHERE slug = 'wedding-cakes' AND icon IS NULL;
UPDATE categories SET icon = '💒' WHERE slug = 'wedding-planners' AND icon IS NULL;
UPDATE categories SET icon = '📦' WHERE slug = 'dropshipping' AND icon IS NULL;
UPDATE categories SET icon = '🛒' WHERE slug = 'e-commerce' AND icon IS NULL;
UPDATE categories SET icon = '📸' WHERE slug = 'instagram-shops' AND icon IS NULL;

COMMIT;