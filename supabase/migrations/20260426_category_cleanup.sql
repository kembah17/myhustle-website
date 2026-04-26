-- Migration: Category Taxonomy Cleanup + phone2 column
-- Date: 2026-04-26
-- Description: Rename parent categories, remove duplicate subcategories,
--   merge Beauty Products + Cosmetics, rename Decorators, split broad subcategories,
--   add phone2 column to businesses table.

-- ============================================================
-- A. Rename 3 parent categories
-- ============================================================
UPDATE categories SET name = 'Religious Community', slug = 'religious-community' WHERE slug = 'religious-and-community';
UPDATE categories SET name = 'Travel and Hospitality', slug = 'travel-and-hospitality' WHERE slug = 'tourism-and-hospitality';
UPDATE categories SET name = 'Construction & Trades', slug = 'construction-and-trades' WHERE slug = 'construction-and-tradesmen';

-- ============================================================
-- B. Remove 8 duplicate subcategories (reassign businesses first)
-- ============================================================

-- 1. auto-driving-schools → education-driving-schools
UPDATE businesses SET category_id = (SELECT id FROM categories WHERE slug = 'education-driving-schools')
  WHERE category_id = (SELECT id FROM categories WHERE slug = 'auto-driving-schools');
DELETE FROM categories WHERE slug = 'auto-driving-schools';

-- 2. computers-computer-training → education-computer-training
UPDATE businesses SET category_id = (SELECT id FROM categories WHERE slug = 'education-computer-training')
  WHERE category_id = (SELECT id FROM categories WHERE slug = 'computers-computer-training');
DELETE FROM categories WHERE slug = 'computers-computer-training';

-- 3. business-dispatch-riders → logistics-dispatch-riders
UPDATE businesses SET category_id = (SELECT id FROM categories WHERE slug = 'logistics-dispatch-riders')
  WHERE category_id = (SELECT id FROM categories WHERE slug = 'business-dispatch-riders');
DELETE FROM categories WHERE slug = 'business-dispatch-riders';

-- 4. construction-plumbers → home-plumbers
UPDATE businesses SET category_id = (SELECT id FROM categories WHERE slug = 'home-plumbers')
  WHERE category_id = (SELECT id FROM categories WHERE slug = 'construction-plumbers');
DELETE FROM categories WHERE slug = 'construction-plumbers';

-- 5. caterers → catering-services (in Food)
UPDATE businesses SET category_id = (SELECT id FROM categories WHERE slug = 'catering-services')
  WHERE category_id = (SELECT id FROM categories WHERE slug = 'caterers');
DELETE FROM categories WHERE slug = 'caterers';

-- 6. courier-and-delivery → courier-services (in Logistics)
UPDATE businesses SET category_id = (SELECT id FROM categories WHERE slug = 'courier-services')
  WHERE category_id = (SELECT id FROM categories WHERE slug = 'courier-and-delivery');
DELETE FROM categories WHERE slug = 'courier-and-delivery';

-- 7. supermarkets-and-provision-stores (in Food) → keep split in Shopping
UPDATE businesses SET category_id = (SELECT id FROM categories WHERE slug = 'supermarkets')
  WHERE category_id = (SELECT id FROM categories WHERE slug = 'supermarkets-and-provision-stores');
DELETE FROM categories WHERE slug = 'supermarkets-and-provision-stores';

-- 8. pos-services → mobile-money-and-pos (in Finance)
UPDATE businesses SET category_id = (SELECT id FROM categories WHERE slug = 'mobile-money-and-pos')
  WHERE category_id = (SELECT id FROM categories WHERE slug = 'pos-services');
DELETE FROM categories WHERE slug = 'pos-services';

-- ============================================================
-- C. Merge Beauty Products + Cosmetics → Beauty & Cosmetics
-- ============================================================
UPDATE categories SET name = 'Beauty & Cosmetics', slug = 'beauty-and-cosmetics' WHERE slug = 'beauty-products';
UPDATE businesses SET category_id = (SELECT id FROM categories WHERE slug = 'beauty-and-cosmetics')
  WHERE category_id = (SELECT id FROM categories WHERE slug = 'cosmetics');
DELETE FROM categories WHERE slug = 'cosmetics';

-- ============================================================
-- D. Rename 'Decorators' in Events to 'Event Decorators'
-- ============================================================
UPDATE categories SET name = 'Event Decorators', slug = 'event-decorators' WHERE slug = 'decorators';

-- ============================================================
-- E. Split broad subcategories
-- ============================================================

DO $$ 
DECLARE
  v_parent_id UUID;
  v_old_id UUID;
BEGIN

  -- E1. Split 'Arts & Crafts' under Entertainment & Leisure
  SELECT id INTO v_parent_id FROM categories WHERE slug = 'entertainment-and-leisure';
  SELECT id INTO v_old_id FROM categories WHERE slug = 'arts-and-crafts';
  IF v_old_id IS NOT NULL AND v_parent_id IS NOT NULL THEN
    -- Reassign businesses to first new sub (art-galleries)
    -- We'll create it first, then reassign
    INSERT INTO categories (name, slug, parent_id) VALUES ('Art Galleries', 'art-galleries', v_parent_id) ON CONFLICT (slug) DO NOTHING;
    UPDATE businesses SET category_id = (SELECT id FROM categories WHERE slug = 'art-galleries')
      WHERE category_id = v_old_id;
    DELETE FROM categories WHERE id = v_old_id;
    INSERT INTO categories (name, slug, parent_id) VALUES ('Craft Workshops', 'craft-workshops', v_parent_id) ON CONFLICT (slug) DO NOTHING;
    INSERT INTO categories (name, slug, parent_id) VALUES ('Bead Making', 'bead-making', v_parent_id) ON CONFLICT (slug) DO NOTHING;
    INSERT INTO categories (name, slug, parent_id) VALUES ('Pottery', 'pottery', v_parent_id) ON CONFLICT (slug) DO NOTHING;
  END IF;

  -- E2. Split 'Consultants' under Business Services
  SELECT id INTO v_parent_id FROM categories WHERE slug = 'business-services';
  SELECT id INTO v_old_id FROM categories WHERE slug = 'consultants';
  IF v_old_id IS NOT NULL AND v_parent_id IS NOT NULL THEN
    INSERT INTO categories (name, slug, parent_id) VALUES ('Management Consultants', 'management-consultants', v_parent_id) ON CONFLICT (slug) DO NOTHING;
    UPDATE businesses SET category_id = (SELECT id FROM categories WHERE slug = 'management-consultants')
      WHERE category_id = v_old_id;
    DELETE FROM categories WHERE id = v_old_id;
    INSERT INTO categories (name, slug, parent_id) VALUES ('IT Consultants', 'it-consultants', v_parent_id) ON CONFLICT (slug) DO NOTHING;
    INSERT INTO categories (name, slug, parent_id) VALUES ('Strategy Consultants', 'strategy-consultants', v_parent_id) ON CONFLICT (slug) DO NOTHING;
  END IF;

  -- E3. Split 'Wedding Services' under Events & Weddings
  SELECT id INTO v_parent_id FROM categories WHERE slug = 'events-and-weddings';
  SELECT id INTO v_old_id FROM categories WHERE slug = 'wedding-services';
  IF v_old_id IS NOT NULL AND v_parent_id IS NOT NULL THEN
    INSERT INTO categories (name, slug, parent_id) VALUES ('Wedding Planners', 'wedding-planners', v_parent_id) ON CONFLICT (slug) DO NOTHING;
    UPDATE businesses SET category_id = (SELECT id FROM categories WHERE slug = 'wedding-planners')
      WHERE category_id = v_old_id;
    DELETE FROM categories WHERE id = v_old_id;
    INSERT INTO categories (name, slug, parent_id) VALUES ('Bridal Shops', 'bridal-shops', v_parent_id) ON CONFLICT (slug) DO NOTHING;
    INSERT INTO categories (name, slug, parent_id) VALUES ('Wedding Cakes', 'wedding-cakes', v_parent_id) ON CONFLICT (slug) DO NOTHING;
    INSERT INTO categories (name, slug, parent_id) VALUES ('Aso-Ebi', 'aso-ebi', v_parent_id) ON CONFLICT (slug) DO NOTHING;
  END IF;

  -- E4. Split 'Recreation & Sports' under Entertainment & Leisure
  SELECT id INTO v_parent_id FROM categories WHERE slug = 'entertainment-and-leisure';
  SELECT id INTO v_old_id FROM categories WHERE slug = 'recreation-and-sports';
  IF v_old_id IS NOT NULL AND v_parent_id IS NOT NULL THEN
    INSERT INTO categories (name, slug, parent_id) VALUES ('Sports Centres', 'sports-centres', v_parent_id) ON CONFLICT (slug) DO NOTHING;
    UPDATE businesses SET category_id = (SELECT id FROM categories WHERE slug = 'sports-centres')
      WHERE category_id = v_old_id;
    DELETE FROM categories WHERE id = v_old_id;
    INSERT INTO categories (name, slug, parent_id) VALUES ('Swimming Pools', 'swimming-pools', v_parent_id) ON CONFLICT (slug) DO NOTHING;
    INSERT INTO categories (name, slug, parent_id) VALUES ('Football Pitches', 'football-pitches', v_parent_id) ON CONFLICT (slug) DO NOTHING;
    INSERT INTO categories (name, slug, parent_id) VALUES ('Gyms', 'gyms', v_parent_id) ON CONFLICT (slug) DO NOTHING;
  END IF;

  -- E5. Split 'Online Stores' under Shopping & Retail
  SELECT id INTO v_parent_id FROM categories WHERE slug = 'shopping-and-retail';
  SELECT id INTO v_old_id FROM categories WHERE slug = 'online-stores';
  IF v_old_id IS NOT NULL AND v_parent_id IS NOT NULL THEN
    INSERT INTO categories (name, slug, parent_id) VALUES ('E-commerce', 'e-commerce', v_parent_id) ON CONFLICT (slug) DO NOTHING;
    UPDATE businesses SET category_id = (SELECT id FROM categories WHERE slug = 'e-commerce')
      WHERE category_id = v_old_id;
    DELETE FROM categories WHERE id = v_old_id;
    INSERT INTO categories (name, slug, parent_id) VALUES ('Dropshipping', 'dropshipping', v_parent_id) ON CONFLICT (slug) DO NOTHING;
    INSERT INTO categories (name, slug, parent_id) VALUES ('Instagram Shops', 'instagram-shops', v_parent_id) ON CONFLICT (slug) DO NOTHING;
  END IF;

END $$;

-- ============================================================
-- F. Add phone2 column to businesses
-- ============================================================
ALTER TABLE businesses ADD COLUMN IF NOT EXISTS phone2 TEXT;
COMMENT ON COLUMN businesses.phone2 IS 'Alternative/second phone number';
