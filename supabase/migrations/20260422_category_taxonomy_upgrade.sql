-- Migration: Upgrade Category Taxonomy (v7 - correct slugs, IF/ELSIF)
-- Date: 2026-04-22
-- Fixes: proper slugify, IF/ELSIF instead of CASE, no temp tables

DO $$
DECLARE
  agriculture_and_farming_id TEXT;
  auto_services_and_motoring_id TEXT;
  business_services_id TEXT;
  computers_and_technology_id TEXT;
  construction_and_tradesmen_id TEXT;
  education_and_training_id TEXT;
  entertainment_and_leisure_id TEXT;
  events_and_weddings_id TEXT;
  fashion_and_beauty_id TEXT;
  finance_and_insurance_id TEXT;
  food_and_dining_id TEXT;
  health_and_medical_id TEXT;
  home_services_id TEXT;
  legal_services_id TEXT;
  logistics_and_transport_id TEXT;
  manufacturing_and_industry_id TEXT;
  property_and_real_estate_id TEXT;
  religious_and_community_id TEXT;
  shopping_and_retail_id TEXT;
  tourism_and_hospitality_id TEXT;
  other_id TEXT;
  biz_count INTEGER;
  old_cat RECORD;
BEGIN

  -- STEP 1: Upsert parent categories
  SELECT id INTO agriculture_and_farming_id FROM categories WHERE slug = 'agriculture-and-farming' AND parent_id IS NULL;
  IF agriculture_and_farming_id IS NULL THEN
    agriculture_and_farming_id := gen_random_uuid()::text;
    INSERT INTO categories (id, name, slug, parent_id) VALUES (agriculture_and_farming_id, 'Agriculture & Farming', 'agriculture-and-farming', NULL);
  ELSE
    UPDATE categories SET name = 'Agriculture & Farming' WHERE id = agriculture_and_farming_id;
  END IF;

  SELECT id INTO auto_services_and_motoring_id FROM categories WHERE slug = 'auto-services-and-motoring' AND parent_id IS NULL;
  IF auto_services_and_motoring_id IS NULL THEN
    auto_services_and_motoring_id := gen_random_uuid()::text;
    INSERT INTO categories (id, name, slug, parent_id) VALUES (auto_services_and_motoring_id, 'Auto Services & Motoring', 'auto-services-and-motoring', NULL);
  ELSE
    UPDATE categories SET name = 'Auto Services & Motoring' WHERE id = auto_services_and_motoring_id;
  END IF;

  SELECT id INTO business_services_id FROM categories WHERE slug = 'business-services' AND parent_id IS NULL;
  IF business_services_id IS NULL THEN
    business_services_id := gen_random_uuid()::text;
    INSERT INTO categories (id, name, slug, parent_id) VALUES (business_services_id, 'Business Services', 'business-services', NULL);
  ELSE
    UPDATE categories SET name = 'Business Services' WHERE id = business_services_id;
  END IF;

  SELECT id INTO computers_and_technology_id FROM categories WHERE slug = 'computers-and-technology' AND parent_id IS NULL;
  IF computers_and_technology_id IS NULL THEN
    computers_and_technology_id := gen_random_uuid()::text;
    INSERT INTO categories (id, name, slug, parent_id) VALUES (computers_and_technology_id, 'Computers & Technology', 'computers-and-technology', NULL);
  ELSE
    UPDATE categories SET name = 'Computers & Technology' WHERE id = computers_and_technology_id;
  END IF;

  SELECT id INTO construction_and_tradesmen_id FROM categories WHERE slug = 'construction-and-tradesmen' AND parent_id IS NULL;
  IF construction_and_tradesmen_id IS NULL THEN
    construction_and_tradesmen_id := gen_random_uuid()::text;
    INSERT INTO categories (id, name, slug, parent_id) VALUES (construction_and_tradesmen_id, 'Construction & Tradesmen', 'construction-and-tradesmen', NULL);
  ELSE
    UPDATE categories SET name = 'Construction & Tradesmen' WHERE id = construction_and_tradesmen_id;
  END IF;

  SELECT id INTO education_and_training_id FROM categories WHERE slug = 'education-and-training' AND parent_id IS NULL;
  IF education_and_training_id IS NULL THEN
    education_and_training_id := gen_random_uuid()::text;
    INSERT INTO categories (id, name, slug, parent_id) VALUES (education_and_training_id, 'Education & Training', 'education-and-training', NULL);
  ELSE
    UPDATE categories SET name = 'Education & Training' WHERE id = education_and_training_id;
  END IF;

  SELECT id INTO entertainment_and_leisure_id FROM categories WHERE slug = 'entertainment-and-leisure' AND parent_id IS NULL;
  IF entertainment_and_leisure_id IS NULL THEN
    entertainment_and_leisure_id := gen_random_uuid()::text;
    INSERT INTO categories (id, name, slug, parent_id) VALUES (entertainment_and_leisure_id, 'Entertainment & Leisure', 'entertainment-and-leisure', NULL);
  ELSE
    UPDATE categories SET name = 'Entertainment & Leisure' WHERE id = entertainment_and_leisure_id;
  END IF;

  SELECT id INTO events_and_weddings_id FROM categories WHERE slug = 'events-and-weddings' AND parent_id IS NULL;
  IF events_and_weddings_id IS NULL THEN
    events_and_weddings_id := gen_random_uuid()::text;
    INSERT INTO categories (id, name, slug, parent_id) VALUES (events_and_weddings_id, 'Events & Weddings', 'events-and-weddings', NULL);
  ELSE
    UPDATE categories SET name = 'Events & Weddings' WHERE id = events_and_weddings_id;
  END IF;

  SELECT id INTO fashion_and_beauty_id FROM categories WHERE slug = 'fashion-and-beauty' AND parent_id IS NULL;
  IF fashion_and_beauty_id IS NULL THEN
    fashion_and_beauty_id := gen_random_uuid()::text;
    INSERT INTO categories (id, name, slug, parent_id) VALUES (fashion_and_beauty_id, 'Fashion & Beauty', 'fashion-and-beauty', NULL);
  ELSE
    UPDATE categories SET name = 'Fashion & Beauty' WHERE id = fashion_and_beauty_id;
  END IF;

  SELECT id INTO finance_and_insurance_id FROM categories WHERE slug = 'finance-and-insurance' AND parent_id IS NULL;
  IF finance_and_insurance_id IS NULL THEN
    finance_and_insurance_id := gen_random_uuid()::text;
    INSERT INTO categories (id, name, slug, parent_id) VALUES (finance_and_insurance_id, 'Finance & Insurance', 'finance-and-insurance', NULL);
  ELSE
    UPDATE categories SET name = 'Finance & Insurance' WHERE id = finance_and_insurance_id;
  END IF;

  SELECT id INTO food_and_dining_id FROM categories WHERE slug = 'food-and-dining' AND parent_id IS NULL;
  IF food_and_dining_id IS NULL THEN
    food_and_dining_id := gen_random_uuid()::text;
    INSERT INTO categories (id, name, slug, parent_id) VALUES (food_and_dining_id, 'Food & Dining', 'food-and-dining', NULL);
  ELSE
    UPDATE categories SET name = 'Food & Dining' WHERE id = food_and_dining_id;
  END IF;

  SELECT id INTO health_and_medical_id FROM categories WHERE slug = 'health-and-medical' AND parent_id IS NULL;
  IF health_and_medical_id IS NULL THEN
    health_and_medical_id := gen_random_uuid()::text;
    INSERT INTO categories (id, name, slug, parent_id) VALUES (health_and_medical_id, 'Health & Medical', 'health-and-medical', NULL);
  ELSE
    UPDATE categories SET name = 'Health & Medical' WHERE id = health_and_medical_id;
  END IF;

  SELECT id INTO home_services_id FROM categories WHERE slug = 'home-services' AND parent_id IS NULL;
  IF home_services_id IS NULL THEN
    home_services_id := gen_random_uuid()::text;
    INSERT INTO categories (id, name, slug, parent_id) VALUES (home_services_id, 'Home Services', 'home-services', NULL);
  ELSE
    UPDATE categories SET name = 'Home Services' WHERE id = home_services_id;
  END IF;

  SELECT id INTO legal_services_id FROM categories WHERE slug = 'legal-services' AND parent_id IS NULL;
  IF legal_services_id IS NULL THEN
    legal_services_id := gen_random_uuid()::text;
    INSERT INTO categories (id, name, slug, parent_id) VALUES (legal_services_id, 'Legal Services', 'legal-services', NULL);
  ELSE
    UPDATE categories SET name = 'Legal Services' WHERE id = legal_services_id;
  END IF;

  SELECT id INTO logistics_and_transport_id FROM categories WHERE slug = 'logistics-and-transport' AND parent_id IS NULL;
  IF logistics_and_transport_id IS NULL THEN
    logistics_and_transport_id := gen_random_uuid()::text;
    INSERT INTO categories (id, name, slug, parent_id) VALUES (logistics_and_transport_id, 'Logistics & Transport', 'logistics-and-transport', NULL);
  ELSE
    UPDATE categories SET name = 'Logistics & Transport' WHERE id = logistics_and_transport_id;
  END IF;

  SELECT id INTO manufacturing_and_industry_id FROM categories WHERE slug = 'manufacturing-and-industry' AND parent_id IS NULL;
  IF manufacturing_and_industry_id IS NULL THEN
    manufacturing_and_industry_id := gen_random_uuid()::text;
    INSERT INTO categories (id, name, slug, parent_id) VALUES (manufacturing_and_industry_id, 'Manufacturing & Industry', 'manufacturing-and-industry', NULL);
  ELSE
    UPDATE categories SET name = 'Manufacturing & Industry' WHERE id = manufacturing_and_industry_id;
  END IF;

  SELECT id INTO property_and_real_estate_id FROM categories WHERE slug = 'property-and-real-estate' AND parent_id IS NULL;
  IF property_and_real_estate_id IS NULL THEN
    property_and_real_estate_id := gen_random_uuid()::text;
    INSERT INTO categories (id, name, slug, parent_id) VALUES (property_and_real_estate_id, 'Property & Real Estate', 'property-and-real-estate', NULL);
  ELSE
    UPDATE categories SET name = 'Property & Real Estate' WHERE id = property_and_real_estate_id;
  END IF;

  SELECT id INTO religious_and_community_id FROM categories WHERE slug = 'religious-and-community' AND parent_id IS NULL;
  IF religious_and_community_id IS NULL THEN
    religious_and_community_id := gen_random_uuid()::text;
    INSERT INTO categories (id, name, slug, parent_id) VALUES (religious_and_community_id, 'Religious & Community', 'religious-and-community', NULL);
  ELSE
    UPDATE categories SET name = 'Religious & Community' WHERE id = religious_and_community_id;
  END IF;

  SELECT id INTO shopping_and_retail_id FROM categories WHERE slug = 'shopping-and-retail' AND parent_id IS NULL;
  IF shopping_and_retail_id IS NULL THEN
    shopping_and_retail_id := gen_random_uuid()::text;
    INSERT INTO categories (id, name, slug, parent_id) VALUES (shopping_and_retail_id, 'Shopping & Retail', 'shopping-and-retail', NULL);
  ELSE
    UPDATE categories SET name = 'Shopping & Retail' WHERE id = shopping_and_retail_id;
  END IF;

  SELECT id INTO tourism_and_hospitality_id FROM categories WHERE slug = 'tourism-and-hospitality' AND parent_id IS NULL;
  IF tourism_and_hospitality_id IS NULL THEN
    tourism_and_hospitality_id := gen_random_uuid()::text;
    INSERT INTO categories (id, name, slug, parent_id) VALUES (tourism_and_hospitality_id, 'Tourism & Hospitality', 'tourism-and-hospitality', NULL);
  ELSE
    UPDATE categories SET name = 'Tourism & Hospitality' WHERE id = tourism_and_hospitality_id;
  END IF;

  SELECT id INTO other_id FROM categories WHERE slug = 'other' AND parent_id IS NULL;
  IF other_id IS NULL THEN
    other_id := gen_random_uuid()::text;
    INSERT INTO categories (id, name, slug, parent_id) VALUES (other_id, 'Other', 'other', NULL);
  ELSE
    UPDATE categories SET name = 'Other' WHERE id = other_id;
  END IF;

  -- STEP 2: Remap businesses
  SELECT COUNT(*) INTO biz_count FROM businesses;
  IF biz_count > 0 THEN

    -- Remap from old PARENT categories
    FOR old_cat IN SELECT id, slug FROM categories WHERE parent_id IS NULL AND slug NOT IN ('agriculture-and-farming', 'auto-services-and-motoring', 'business-services', 'computers-and-technology', 'construction-and-tradesmen', 'education-and-training', 'entertainment-and-leisure', 'events-and-weddings', 'fashion-and-beauty', 'finance-and-insurance', 'food-and-dining', 'health-and-medical', 'home-services', 'legal-services', 'logistics-and-transport', 'manufacturing-and-industry', 'property-and-real-estate', 'religious-and-community', 'shopping-and-retail', 'tourism-and-hospitality', 'other')
    LOOP
      IF old_cat.slug = 'agriculture-farming' THEN
        UPDATE businesses SET category_id = agriculture_and_farming_id WHERE category_id = old_cat.id;
      ELSIF old_cat.slug = 'auto-services' THEN
        UPDATE businesses SET category_id = auto_services_and_motoring_id WHERE category_id = old_cat.id;
      ELSIF old_cat.slug = 'childcare-parenting' THEN
        UPDATE businesses SET category_id = education_and_training_id WHERE category_id = old_cat.id;
      ELSIF old_cat.slug = 'education-training' THEN
        UPDATE businesses SET category_id = education_and_training_id WHERE category_id = old_cat.id;
      ELSIF old_cat.slug = 'entertainment-leisure' THEN
        UPDATE businesses SET category_id = entertainment_and_leisure_id WHERE category_id = old_cat.id;
      ELSIF old_cat.slug = 'events' THEN
        UPDATE businesses SET category_id = events_and_weddings_id WHERE category_id = old_cat.id;
      ELSIF old_cat.slug = 'fashion-tailoring' THEN
        UPDATE businesses SET category_id = fashion_and_beauty_id WHERE category_id = old_cat.id;
      ELSIF old_cat.slug = 'food-dining' THEN
        UPDATE businesses SET category_id = food_and_dining_id WHERE category_id = old_cat.id;
      ELSIF old_cat.slug = 'hair-beauty' THEN
        UPDATE businesses SET category_id = fashion_and_beauty_id WHERE category_id = old_cat.id;
      ELSIF old_cat.slug = 'health-wellness' THEN
        UPDATE businesses SET category_id = health_and_medical_id WHERE category_id = old_cat.id;
      ELSIF old_cat.slug = 'home-services' THEN
        UPDATE businesses SET category_id = home_services_id WHERE category_id = old_cat.id;
      ELSIF old_cat.slug = 'laundry-dry-cleaning' THEN
        UPDATE businesses SET category_id = home_services_id WHERE category_id = old_cat.id;
      ELSIF old_cat.slug = 'legal-finance' THEN
        UPDATE businesses SET category_id = finance_and_insurance_id WHERE category_id = old_cat.id;
      ELSIF old_cat.slug = 'logistics-transport' THEN
        UPDATE businesses SET category_id = logistics_and_transport_id WHERE category_id = old_cat.id;
      ELSIF old_cat.slug = 'photography' THEN
        UPDATE businesses SET category_id = events_and_weddings_id WHERE category_id = old_cat.id;
      ELSIF old_cat.slug = 'printing-branding' THEN
        UPDATE businesses SET category_id = business_services_id WHERE category_id = old_cat.id;
      ELSIF old_cat.slug = 'real-estate' THEN
        UPDATE businesses SET category_id = property_and_real_estate_id WHERE category_id = old_cat.id;
      ELSIF old_cat.slug = 'religious-spiritual' THEN
        UPDATE businesses SET category_id = religious_and_community_id WHERE category_id = old_cat.id;
      ELSIF old_cat.slug = 'supermarkets-retail' THEN
        UPDATE businesses SET category_id = shopping_and_retail_id WHERE category_id = old_cat.id;
      ELSIF old_cat.slug = 'technology-it' THEN
        UPDATE businesses SET category_id = computers_and_technology_id WHERE category_id = old_cat.id;
      ELSIF old_cat.slug = 'other' THEN
        UPDATE businesses SET category_id = other_id WHERE category_id = old_cat.id;
      ELSE
        UPDATE businesses SET category_id = other_id WHERE category_id = old_cat.id;
      END IF;
    END LOOP;

    -- Remap from old SUBCATEGORIES
    FOR old_cat IN SELECT c.id, p.slug AS parent_slug FROM categories c JOIN categories p ON c.parent_id = p.id WHERE p.slug NOT IN ('agriculture-and-farming', 'auto-services-and-motoring', 'business-services', 'computers-and-technology', 'construction-and-tradesmen', 'education-and-training', 'entertainment-and-leisure', 'events-and-weddings', 'fashion-and-beauty', 'finance-and-insurance', 'food-and-dining', 'health-and-medical', 'home-services', 'legal-services', 'logistics-and-transport', 'manufacturing-and-industry', 'property-and-real-estate', 'religious-and-community', 'shopping-and-retail', 'tourism-and-hospitality', 'other')
    LOOP
      IF old_cat.parent_slug = 'agriculture-farming' THEN
        UPDATE businesses SET category_id = agriculture_and_farming_id WHERE category_id = old_cat.id;
      ELSIF old_cat.parent_slug = 'auto-services' THEN
        UPDATE businesses SET category_id = auto_services_and_motoring_id WHERE category_id = old_cat.id;
      ELSIF old_cat.parent_slug = 'childcare-parenting' THEN
        UPDATE businesses SET category_id = education_and_training_id WHERE category_id = old_cat.id;
      ELSIF old_cat.parent_slug = 'education-training' THEN
        UPDATE businesses SET category_id = education_and_training_id WHERE category_id = old_cat.id;
      ELSIF old_cat.parent_slug = 'entertainment-leisure' THEN
        UPDATE businesses SET category_id = entertainment_and_leisure_id WHERE category_id = old_cat.id;
      ELSIF old_cat.parent_slug = 'events' THEN
        UPDATE businesses SET category_id = events_and_weddings_id WHERE category_id = old_cat.id;
      ELSIF old_cat.parent_slug = 'fashion-tailoring' THEN
        UPDATE businesses SET category_id = fashion_and_beauty_id WHERE category_id = old_cat.id;
      ELSIF old_cat.parent_slug = 'food-dining' THEN
        UPDATE businesses SET category_id = food_and_dining_id WHERE category_id = old_cat.id;
      ELSIF old_cat.parent_slug = 'hair-beauty' THEN
        UPDATE businesses SET category_id = fashion_and_beauty_id WHERE category_id = old_cat.id;
      ELSIF old_cat.parent_slug = 'health-wellness' THEN
        UPDATE businesses SET category_id = health_and_medical_id WHERE category_id = old_cat.id;
      ELSIF old_cat.parent_slug = 'home-services' THEN
        UPDATE businesses SET category_id = home_services_id WHERE category_id = old_cat.id;
      ELSIF old_cat.parent_slug = 'laundry-dry-cleaning' THEN
        UPDATE businesses SET category_id = home_services_id WHERE category_id = old_cat.id;
      ELSIF old_cat.parent_slug = 'legal-finance' THEN
        UPDATE businesses SET category_id = finance_and_insurance_id WHERE category_id = old_cat.id;
      ELSIF old_cat.parent_slug = 'logistics-transport' THEN
        UPDATE businesses SET category_id = logistics_and_transport_id WHERE category_id = old_cat.id;
      ELSIF old_cat.parent_slug = 'photography' THEN
        UPDATE businesses SET category_id = events_and_weddings_id WHERE category_id = old_cat.id;
      ELSIF old_cat.parent_slug = 'printing-branding' THEN
        UPDATE businesses SET category_id = business_services_id WHERE category_id = old_cat.id;
      ELSIF old_cat.parent_slug = 'real-estate' THEN
        UPDATE businesses SET category_id = property_and_real_estate_id WHERE category_id = old_cat.id;
      ELSIF old_cat.parent_slug = 'religious-spiritual' THEN
        UPDATE businesses SET category_id = religious_and_community_id WHERE category_id = old_cat.id;
      ELSIF old_cat.parent_slug = 'supermarkets-retail' THEN
        UPDATE businesses SET category_id = shopping_and_retail_id WHERE category_id = old_cat.id;
      ELSIF old_cat.parent_slug = 'technology-it' THEN
        UPDATE businesses SET category_id = computers_and_technology_id WHERE category_id = old_cat.id;
      ELSIF old_cat.parent_slug = 'other' THEN
        UPDATE businesses SET category_id = other_id WHERE category_id = old_cat.id;
      ELSE
        UPDATE businesses SET category_id = other_id WHERE category_id = old_cat.id;
      END IF;
    END LOOP;
  END IF;

  -- STEP 3: Delete old categories
  DELETE FROM categories WHERE parent_id IS NOT NULL AND parent_id NOT IN (agriculture_and_farming_id, auto_services_and_motoring_id, business_services_id, computers_and_technology_id, construction_and_tradesmen_id, education_and_training_id, entertainment_and_leisure_id, events_and_weddings_id, fashion_and_beauty_id, finance_and_insurance_id, food_and_dining_id, health_and_medical_id, home_services_id, legal_services_id, logistics_and_transport_id, manufacturing_and_industry_id, property_and_real_estate_id, religious_and_community_id, shopping_and_retail_id, tourism_and_hospitality_id, other_id);
  DELETE FROM categories WHERE parent_id IS NULL AND id NOT IN (agriculture_and_farming_id, auto_services_and_motoring_id, business_services_id, computers_and_technology_id, construction_and_tradesmen_id, education_and_training_id, entertainment_and_leisure_id, events_and_weddings_id, fashion_and_beauty_id, finance_and_insurance_id, food_and_dining_id, health_and_medical_id, home_services_id, legal_services_id, logistics_and_transport_id, manufacturing_and_industry_id, property_and_real_estate_id, religious_and_community_id, shopping_and_retail_id, tourism_and_hospitality_id, other_id);

  -- STEP 4: Insert subcategories
  -- Agriculture & Farming
  INSERT INTO categories (id, name, slug, parent_id) VALUES (gen_random_uuid()::text, 'Agro-chemicals', 'agro-chemicals', agriculture_and_farming_id)
  ON CONFLICT (slug) DO UPDATE SET name = EXCLUDED.name, parent_id = EXCLUDED.parent_id;
  INSERT INTO categories (id, name, slug, parent_id) VALUES (gen_random_uuid()::text, 'Crop Farming', 'crop-farming', agriculture_and_farming_id)
  ON CONFLICT (slug) DO UPDATE SET name = EXCLUDED.name, parent_id = EXCLUDED.parent_id;
  INSERT INTO categories (id, name, slug, parent_id) VALUES (gen_random_uuid()::text, 'Farm Equipment', 'farm-equipment', agriculture_and_farming_id)
  ON CONFLICT (slug) DO UPDATE SET name = EXCLUDED.name, parent_id = EXCLUDED.parent_id;
  INSERT INTO categories (id, name, slug, parent_id) VALUES (gen_random_uuid()::text, 'Farm Produce', 'farm-produce', agriculture_and_farming_id)
  ON CONFLICT (slug) DO UPDATE SET name = EXCLUDED.name, parent_id = EXCLUDED.parent_id;
  INSERT INTO categories (id, name, slug, parent_id) VALUES (gen_random_uuid()::text, 'Fish Farming', 'fish-farming', agriculture_and_farming_id)
  ON CONFLICT (slug) DO UPDATE SET name = EXCLUDED.name, parent_id = EXCLUDED.parent_id;
  INSERT INTO categories (id, name, slug, parent_id) VALUES (gen_random_uuid()::text, 'Fisheries', 'fisheries', agriculture_and_farming_id)
  ON CONFLICT (slug) DO UPDATE SET name = EXCLUDED.name, parent_id = EXCLUDED.parent_id;
  INSERT INTO categories (id, name, slug, parent_id) VALUES (gen_random_uuid()::text, 'Livestock', 'livestock', agriculture_and_farming_id)
  ON CONFLICT (slug) DO UPDATE SET name = EXCLUDED.name, parent_id = EXCLUDED.parent_id;
  INSERT INTO categories (id, name, slug, parent_id) VALUES (gen_random_uuid()::text, 'Poultry', 'poultry', agriculture_and_farming_id)
  ON CONFLICT (slug) DO UPDATE SET name = EXCLUDED.name, parent_id = EXCLUDED.parent_id;

  -- Auto Services & Motoring
  INSERT INTO categories (id, name, slug, parent_id) VALUES (gen_random_uuid()::text, 'Auto Electricians', 'auto-electricians', auto_services_and_motoring_id)
  ON CONFLICT (slug) DO UPDATE SET name = EXCLUDED.name, parent_id = EXCLUDED.parent_id;
  INSERT INTO categories (id, name, slug, parent_id) VALUES (gen_random_uuid()::text, 'Auto Parts & Accessories', 'auto-parts-and-accessories', auto_services_and_motoring_id)
  ON CONFLICT (slug) DO UPDATE SET name = EXCLUDED.name, parent_id = EXCLUDED.parent_id;
  INSERT INTO categories (id, name, slug, parent_id) VALUES (gen_random_uuid()::text, 'Car Rental', 'car-rental', auto_services_and_motoring_id)
  ON CONFLICT (slug) DO UPDATE SET name = EXCLUDED.name, parent_id = EXCLUDED.parent_id;
  INSERT INTO categories (id, name, slug, parent_id) VALUES (gen_random_uuid()::text, 'Car Wash', 'car-wash', auto_services_and_motoring_id)
  ON CONFLICT (slug) DO UPDATE SET name = EXCLUDED.name, parent_id = EXCLUDED.parent_id;
  INSERT INTO categories (id, name, slug, parent_id) VALUES (gen_random_uuid()::text, 'Driving Schools', 'auto-driving-schools', auto_services_and_motoring_id)
  ON CONFLICT (slug) DO UPDATE SET name = EXCLUDED.name, parent_id = EXCLUDED.parent_id;
  INSERT INTO categories (id, name, slug, parent_id) VALUES (gen_random_uuid()::text, 'Mechanics', 'mechanics', auto_services_and_motoring_id)
  ON CONFLICT (slug) DO UPDATE SET name = EXCLUDED.name, parent_id = EXCLUDED.parent_id;
  INSERT INTO categories (id, name, slug, parent_id) VALUES (gen_random_uuid()::text, 'Panel Beaters', 'panel-beaters', auto_services_and_motoring_id)
  ON CONFLICT (slug) DO UPDATE SET name = EXCLUDED.name, parent_id = EXCLUDED.parent_id;
  INSERT INTO categories (id, name, slug, parent_id) VALUES (gen_random_uuid()::text, 'Petrol Stations', 'petrol-stations', auto_services_and_motoring_id)
  ON CONFLICT (slug) DO UPDATE SET name = EXCLUDED.name, parent_id = EXCLUDED.parent_id;
  INSERT INTO categories (id, name, slug, parent_id) VALUES (gen_random_uuid()::text, 'Towing Services', 'towing-services', auto_services_and_motoring_id)
  ON CONFLICT (slug) DO UPDATE SET name = EXCLUDED.name, parent_id = EXCLUDED.parent_id;
  INSERT INTO categories (id, name, slug, parent_id) VALUES (gen_random_uuid()::text, 'Tyre Dealers', 'tyre-dealers', auto_services_and_motoring_id)
  ON CONFLICT (slug) DO UPDATE SET name = EXCLUDED.name, parent_id = EXCLUDED.parent_id;
  INSERT INTO categories (id, name, slug, parent_id) VALUES (gen_random_uuid()::text, 'Vehicle Sales', 'vehicle-sales', auto_services_and_motoring_id)
  ON CONFLICT (slug) DO UPDATE SET name = EXCLUDED.name, parent_id = EXCLUDED.parent_id;
  INSERT INTO categories (id, name, slug, parent_id) VALUES (gen_random_uuid()::text, 'Vulcanizers', 'vulcanizers', auto_services_and_motoring_id)
  ON CONFLICT (slug) DO UPDATE SET name = EXCLUDED.name, parent_id = EXCLUDED.parent_id;

  -- Business Services
  INSERT INTO categories (id, name, slug, parent_id) VALUES (gen_random_uuid()::text, 'Advertising & Marketing', 'advertising-and-marketing', business_services_id)
  ON CONFLICT (slug) DO UPDATE SET name = EXCLUDED.name, parent_id = EXCLUDED.parent_id;
  INSERT INTO categories (id, name, slug, parent_id) VALUES (gen_random_uuid()::text, 'Consultants', 'consultants', business_services_id)
  ON CONFLICT (slug) DO UPDATE SET name = EXCLUDED.name, parent_id = EXCLUDED.parent_id;
  INSERT INTO categories (id, name, slug, parent_id) VALUES (gen_random_uuid()::text, 'Courier & Delivery', 'courier-and-delivery', business_services_id)
  ON CONFLICT (slug) DO UPDATE SET name = EXCLUDED.name, parent_id = EXCLUDED.parent_id;
  INSERT INTO categories (id, name, slug, parent_id) VALUES (gen_random_uuid()::text, 'Dispatch Riders', 'business-dispatch-riders', business_services_id)
  ON CONFLICT (slug) DO UPDATE SET name = EXCLUDED.name, parent_id = EXCLUDED.parent_id;
  INSERT INTO categories (id, name, slug, parent_id) VALUES (gen_random_uuid()::text, 'Human Resources', 'human-resources', business_services_id)
  ON CONFLICT (slug) DO UPDATE SET name = EXCLUDED.name, parent_id = EXCLUDED.parent_id;
  INSERT INTO categories (id, name, slug, parent_id) VALUES (gen_random_uuid()::text, 'Office Services', 'office-services', business_services_id)
  ON CONFLICT (slug) DO UPDATE SET name = EXCLUDED.name, parent_id = EXCLUDED.parent_id;
  INSERT INTO categories (id, name, slug, parent_id) VALUES (gen_random_uuid()::text, 'Printing & Branding', 'printing-and-branding', business_services_id)
  ON CONFLICT (slug) DO UPDATE SET name = EXCLUDED.name, parent_id = EXCLUDED.parent_id;
  INSERT INTO categories (id, name, slug, parent_id) VALUES (gen_random_uuid()::text, 'Public Relations', 'public-relations', business_services_id)
  ON CONFLICT (slug) DO UPDATE SET name = EXCLUDED.name, parent_id = EXCLUDED.parent_id;
  INSERT INTO categories (id, name, slug, parent_id) VALUES (gen_random_uuid()::text, 'Signage & Banners', 'signage-and-banners', business_services_id)
  ON CONFLICT (slug) DO UPDATE SET name = EXCLUDED.name, parent_id = EXCLUDED.parent_id;
  INSERT INTO categories (id, name, slug, parent_id) VALUES (gen_random_uuid()::text, 'Training & Development', 'training-and-development', business_services_id)
  ON CONFLICT (slug) DO UPDATE SET name = EXCLUDED.name, parent_id = EXCLUDED.parent_id;

  -- Computers & Technology
  INSERT INTO categories (id, name, slug, parent_id) VALUES (gen_random_uuid()::text, 'Apps & Software', 'apps-and-software', computers_and_technology_id)
  ON CONFLICT (slug) DO UPDATE SET name = EXCLUDED.name, parent_id = EXCLUDED.parent_id;
  INSERT INTO categories (id, name, slug, parent_id) VALUES (gen_random_uuid()::text, 'CCTV & Security Systems', 'cctv-and-security-systems', computers_and_technology_id)
  ON CONFLICT (slug) DO UPDATE SET name = EXCLUDED.name, parent_id = EXCLUDED.parent_id;
  INSERT INTO categories (id, name, slug, parent_id) VALUES (gen_random_uuid()::text, 'Cloud & Hosting', 'cloud-and-hosting', computers_and_technology_id)
  ON CONFLICT (slug) DO UPDATE SET name = EXCLUDED.name, parent_id = EXCLUDED.parent_id;
  INSERT INTO categories (id, name, slug, parent_id) VALUES (gen_random_uuid()::text, 'Computer Repair', 'computer-repair', computers_and_technology_id)
  ON CONFLICT (slug) DO UPDATE SET name = EXCLUDED.name, parent_id = EXCLUDED.parent_id;
  INSERT INTO categories (id, name, slug, parent_id) VALUES (gen_random_uuid()::text, 'Computer Training', 'computers-computer-training', computers_and_technology_id)
  ON CONFLICT (slug) DO UPDATE SET name = EXCLUDED.name, parent_id = EXCLUDED.parent_id;
  INSERT INTO categories (id, name, slug, parent_id) VALUES (gen_random_uuid()::text, 'Cyber Security', 'cyber-security', computers_and_technology_id)
  ON CONFLICT (slug) DO UPDATE SET name = EXCLUDED.name, parent_id = EXCLUDED.parent_id;
  INSERT INTO categories (id, name, slug, parent_id) VALUES (gen_random_uuid()::text, 'FinTech', 'fintech', computers_and_technology_id)
  ON CONFLICT (slug) DO UPDATE SET name = EXCLUDED.name, parent_id = EXCLUDED.parent_id;
  INSERT INTO categories (id, name, slug, parent_id) VALUES (gen_random_uuid()::text, 'Internet Service Providers', 'internet-service-providers', computers_and_technology_id)
  ON CONFLICT (slug) DO UPDATE SET name = EXCLUDED.name, parent_id = EXCLUDED.parent_id;
  INSERT INTO categories (id, name, slug, parent_id) VALUES (gen_random_uuid()::text, 'Networking', 'networking', computers_and_technology_id)
  ON CONFLICT (slug) DO UPDATE SET name = EXCLUDED.name, parent_id = EXCLUDED.parent_id;
  INSERT INTO categories (id, name, slug, parent_id) VALUES (gen_random_uuid()::text, 'Phone Repair', 'phone-repair', computers_and_technology_id)
  ON CONFLICT (slug) DO UPDATE SET name = EXCLUDED.name, parent_id = EXCLUDED.parent_id;
  INSERT INTO categories (id, name, slug, parent_id) VALUES (gen_random_uuid()::text, 'POS Services', 'pos-services', computers_and_technology_id)
  ON CONFLICT (slug) DO UPDATE SET name = EXCLUDED.name, parent_id = EXCLUDED.parent_id;
  INSERT INTO categories (id, name, slug, parent_id) VALUES (gen_random_uuid()::text, 'Web Design & Development', 'web-design-and-development', computers_and_technology_id)
  ON CONFLICT (slug) DO UPDATE SET name = EXCLUDED.name, parent_id = EXCLUDED.parent_id;

  -- Construction & Tradesmen
  INSERT INTO categories (id, name, slug, parent_id) VALUES (gen_random_uuid()::text, 'Aluminium & Glass', 'aluminium-and-glass', construction_and_tradesmen_id)
  ON CONFLICT (slug) DO UPDATE SET name = EXCLUDED.name, parent_id = EXCLUDED.parent_id;
  INSERT INTO categories (id, name, slug, parent_id) VALUES (gen_random_uuid()::text, 'Architectural Services', 'architectural-services', construction_and_tradesmen_id)
  ON CONFLICT (slug) DO UPDATE SET name = EXCLUDED.name, parent_id = EXCLUDED.parent_id;
  INSERT INTO categories (id, name, slug, parent_id) VALUES (gen_random_uuid()::text, 'Block & Bricks', 'block-and-bricks', construction_and_tradesmen_id)
  ON CONFLICT (slug) DO UPDATE SET name = EXCLUDED.name, parent_id = EXCLUDED.parent_id;
  INSERT INTO categories (id, name, slug, parent_id) VALUES (gen_random_uuid()::text, 'Building Materials', 'building-materials', construction_and_tradesmen_id)
  ON CONFLICT (slug) DO UPDATE SET name = EXCLUDED.name, parent_id = EXCLUDED.parent_id;
  INSERT INTO categories (id, name, slug, parent_id) VALUES (gen_random_uuid()::text, 'Carpentry', 'carpentry', construction_and_tradesmen_id)
  ON CONFLICT (slug) DO UPDATE SET name = EXCLUDED.name, parent_id = EXCLUDED.parent_id;
  INSERT INTO categories (id, name, slug, parent_id) VALUES (gen_random_uuid()::text, 'Concrete & Paving', 'concrete-and-paving', construction_and_tradesmen_id)
  ON CONFLICT (slug) DO UPDATE SET name = EXCLUDED.name, parent_id = EXCLUDED.parent_id;
  INSERT INTO categories (id, name, slug, parent_id) VALUES (gen_random_uuid()::text, 'Contractors', 'contractors', construction_and_tradesmen_id)
  ON CONFLICT (slug) DO UPDATE SET name = EXCLUDED.name, parent_id = EXCLUDED.parent_id;
  INSERT INTO categories (id, name, slug, parent_id) VALUES (gen_random_uuid()::text, 'Decorators & Painters', 'decorators-and-painters', construction_and_tradesmen_id)
  ON CONFLICT (slug) DO UPDATE SET name = EXCLUDED.name, parent_id = EXCLUDED.parent_id;
  INSERT INTO categories (id, name, slug, parent_id) VALUES (gen_random_uuid()::text, 'Electrical Installation', 'electrical-installation', construction_and_tradesmen_id)
  ON CONFLICT (slug) DO UPDATE SET name = EXCLUDED.name, parent_id = EXCLUDED.parent_id;
  INSERT INTO categories (id, name, slug, parent_id) VALUES (gen_random_uuid()::text, 'Plumbers', 'construction-plumbers', construction_and_tradesmen_id)
  ON CONFLICT (slug) DO UPDATE SET name = EXCLUDED.name, parent_id = EXCLUDED.parent_id;
  INSERT INTO categories (id, name, slug, parent_id) VALUES (gen_random_uuid()::text, 'Roofing', 'roofing', construction_and_tradesmen_id)
  ON CONFLICT (slug) DO UPDATE SET name = EXCLUDED.name, parent_id = EXCLUDED.parent_id;
  INSERT INTO categories (id, name, slug, parent_id) VALUES (gen_random_uuid()::text, 'Tiling', 'tiling', construction_and_tradesmen_id)
  ON CONFLICT (slug) DO UPDATE SET name = EXCLUDED.name, parent_id = EXCLUDED.parent_id;
  INSERT INTO categories (id, name, slug, parent_id) VALUES (gen_random_uuid()::text, 'Welding & Fabrication', 'welding-and-fabrication', construction_and_tradesmen_id)
  ON CONFLICT (slug) DO UPDATE SET name = EXCLUDED.name, parent_id = EXCLUDED.parent_id;

  -- Education & Training
  INSERT INTO categories (id, name, slug, parent_id) VALUES (gen_random_uuid()::text, 'After School Programs', 'after-school-programs', education_and_training_id)
  ON CONFLICT (slug) DO UPDATE SET name = EXCLUDED.name, parent_id = EXCLUDED.parent_id;
  INSERT INTO categories (id, name, slug, parent_id) VALUES (gen_random_uuid()::text, 'Computer Training', 'education-computer-training', education_and_training_id)
  ON CONFLICT (slug) DO UPDATE SET name = EXCLUDED.name, parent_id = EXCLUDED.parent_id;
  INSERT INTO categories (id, name, slug, parent_id) VALUES (gen_random_uuid()::text, 'Crèches & Daycare', 'crches-and-daycare', education_and_training_id)
  ON CONFLICT (slug) DO UPDATE SET name = EXCLUDED.name, parent_id = EXCLUDED.parent_id;
  INSERT INTO categories (id, name, slug, parent_id) VALUES (gen_random_uuid()::text, 'Driving Schools', 'education-driving-schools', education_and_training_id)
  ON CONFLICT (slug) DO UPDATE SET name = EXCLUDED.name, parent_id = EXCLUDED.parent_id;
  INSERT INTO categories (id, name, slug, parent_id) VALUES (gen_random_uuid()::text, 'Language Schools', 'language-schools', education_and_training_id)
  ON CONFLICT (slug) DO UPDATE SET name = EXCLUDED.name, parent_id = EXCLUDED.parent_id;
  INSERT INTO categories (id, name, slug, parent_id) VALUES (gen_random_uuid()::text, 'Lesson Teachers & Tutoring', 'lesson-teachers-and-tutoring', education_and_training_id)
  ON CONFLICT (slug) DO UPDATE SET name = EXCLUDED.name, parent_id = EXCLUDED.parent_id;
  INSERT INTO categories (id, name, slug, parent_id) VALUES (gen_random_uuid()::text, 'Schools & Colleges', 'schools-and-colleges', education_and_training_id)
  ON CONFLICT (slug) DO UPDATE SET name = EXCLUDED.name, parent_id = EXCLUDED.parent_id;
  INSERT INTO categories (id, name, slug, parent_id) VALUES (gen_random_uuid()::text, 'Universities', 'universities', education_and_training_id)
  ON CONFLICT (slug) DO UPDATE SET name = EXCLUDED.name, parent_id = EXCLUDED.parent_id;
  INSERT INTO categories (id, name, slug, parent_id) VALUES (gen_random_uuid()::text, 'Vocational Training', 'vocational-training', education_and_training_id)
  ON CONFLICT (slug) DO UPDATE SET name = EXCLUDED.name, parent_id = EXCLUDED.parent_id;

  -- Entertainment & Leisure
  INSERT INTO categories (id, name, slug, parent_id) VALUES (gen_random_uuid()::text, 'Amusement & Game Centres', 'amusement-and-game-centres', entertainment_and_leisure_id)
  ON CONFLICT (slug) DO UPDATE SET name = EXCLUDED.name, parent_id = EXCLUDED.parent_id;
  INSERT INTO categories (id, name, slug, parent_id) VALUES (gen_random_uuid()::text, 'Arts & Crafts', 'arts-and-crafts', entertainment_and_leisure_id)
  ON CONFLICT (slug) DO UPDATE SET name = EXCLUDED.name, parent_id = EXCLUDED.parent_id;
  INSERT INTO categories (id, name, slug, parent_id) VALUES (gen_random_uuid()::text, 'Cinemas', 'cinemas', entertainment_and_leisure_id)
  ON CONFLICT (slug) DO UPDATE SET name = EXCLUDED.name, parent_id = EXCLUDED.parent_id;
  INSERT INTO categories (id, name, slug, parent_id) VALUES (gen_random_uuid()::text, 'Clubs & Lounges', 'clubs-and-lounges', entertainment_and_leisure_id)
  ON CONFLICT (slug) DO UPDATE SET name = EXCLUDED.name, parent_id = EXCLUDED.parent_id;
  INSERT INTO categories (id, name, slug, parent_id) VALUES (gen_random_uuid()::text, 'Music & DJs', 'music-and-djs', entertainment_and_leisure_id)
  ON CONFLICT (slug) DO UPDATE SET name = EXCLUDED.name, parent_id = EXCLUDED.parent_id;
  INSERT INTO categories (id, name, slug, parent_id) VALUES (gen_random_uuid()::text, 'Recreation & Sports', 'recreation-and-sports', entertainment_and_leisure_id)
  ON CONFLICT (slug) DO UPDATE SET name = EXCLUDED.name, parent_id = EXCLUDED.parent_id;
  INSERT INTO categories (id, name, slug, parent_id) VALUES (gen_random_uuid()::text, 'Streaming & Content', 'streaming-and-content', entertainment_and_leisure_id)
  ON CONFLICT (slug) DO UPDATE SET name = EXCLUDED.name, parent_id = EXCLUDED.parent_id;

  -- Events & Weddings
  INSERT INTO categories (id, name, slug, parent_id) VALUES (gen_random_uuid()::text, 'Caterers', 'caterers', events_and_weddings_id)
  ON CONFLICT (slug) DO UPDATE SET name = EXCLUDED.name, parent_id = EXCLUDED.parent_id;
  INSERT INTO categories (id, name, slug, parent_id) VALUES (gen_random_uuid()::text, 'Decorators', 'decorators', events_and_weddings_id)
  ON CONFLICT (slug) DO UPDATE SET name = EXCLUDED.name, parent_id = EXCLUDED.parent_id;
  INSERT INTO categories (id, name, slug, parent_id) VALUES (gen_random_uuid()::text, 'DJs & MCs', 'djs-and-mcs', events_and_weddings_id)
  ON CONFLICT (slug) DO UPDATE SET name = EXCLUDED.name, parent_id = EXCLUDED.parent_id;
  INSERT INTO categories (id, name, slug, parent_id) VALUES (gen_random_uuid()::text, 'Event Equipment Rental', 'event-equipment-rental', events_and_weddings_id)
  ON CONFLICT (slug) DO UPDATE SET name = EXCLUDED.name, parent_id = EXCLUDED.parent_id;
  INSERT INTO categories (id, name, slug, parent_id) VALUES (gen_random_uuid()::text, 'Event Planners', 'event-planners', events_and_weddings_id)
  ON CONFLICT (slug) DO UPDATE SET name = EXCLUDED.name, parent_id = EXCLUDED.parent_id;
  INSERT INTO categories (id, name, slug, parent_id) VALUES (gen_random_uuid()::text, 'Photographers', 'photographers', events_and_weddings_id)
  ON CONFLICT (slug) DO UPDATE SET name = EXCLUDED.name, parent_id = EXCLUDED.parent_id;
  INSERT INTO categories (id, name, slug, parent_id) VALUES (gen_random_uuid()::text, 'Venues & Event Halls', 'venues-and-event-halls', events_and_weddings_id)
  ON CONFLICT (slug) DO UPDATE SET name = EXCLUDED.name, parent_id = EXCLUDED.parent_id;
  INSERT INTO categories (id, name, slug, parent_id) VALUES (gen_random_uuid()::text, 'Videographers', 'videographers', events_and_weddings_id)
  ON CONFLICT (slug) DO UPDATE SET name = EXCLUDED.name, parent_id = EXCLUDED.parent_id;
  INSERT INTO categories (id, name, slug, parent_id) VALUES (gen_random_uuid()::text, 'Wedding Services', 'wedding-services', events_and_weddings_id)
  ON CONFLICT (slug) DO UPDATE SET name = EXCLUDED.name, parent_id = EXCLUDED.parent_id;

  -- Fashion & Beauty
  INSERT INTO categories (id, name, slug, parent_id) VALUES (gen_random_uuid()::text, 'Barber Shops', 'barber-shops', fashion_and_beauty_id)
  ON CONFLICT (slug) DO UPDATE SET name = EXCLUDED.name, parent_id = EXCLUDED.parent_id;
  INSERT INTO categories (id, name, slug, parent_id) VALUES (gen_random_uuid()::text, 'Beauty Products', 'beauty-products', fashion_and_beauty_id)
  ON CONFLICT (slug) DO UPDATE SET name = EXCLUDED.name, parent_id = EXCLUDED.parent_id;
  INSERT INTO categories (id, name, slug, parent_id) VALUES (gen_random_uuid()::text, 'Cosmetics', 'cosmetics', fashion_and_beauty_id)
  ON CONFLICT (slug) DO UPDATE SET name = EXCLUDED.name, parent_id = EXCLUDED.parent_id;
  INSERT INTO categories (id, name, slug, parent_id) VALUES (gen_random_uuid()::text, 'Fabric Stores', 'fabric-stores', fashion_and_beauty_id)
  ON CONFLICT (slug) DO UPDATE SET name = EXCLUDED.name, parent_id = EXCLUDED.parent_id;
  INSERT INTO categories (id, name, slug, parent_id) VALUES (gen_random_uuid()::text, 'Fashion Designers', 'fashion-designers', fashion_and_beauty_id)
  ON CONFLICT (slug) DO UPDATE SET name = EXCLUDED.name, parent_id = EXCLUDED.parent_id;
  INSERT INTO categories (id, name, slug, parent_id) VALUES (gen_random_uuid()::text, 'Hair Salons', 'hair-salons', fashion_and_beauty_id)
  ON CONFLICT (slug) DO UPDATE SET name = EXCLUDED.name, parent_id = EXCLUDED.parent_id;
  INSERT INTO categories (id, name, slug, parent_id) VALUES (gen_random_uuid()::text, 'Jewellery', 'jewellery', fashion_and_beauty_id)
  ON CONFLICT (slug) DO UPDATE SET name = EXCLUDED.name, parent_id = EXCLUDED.parent_id;
  INSERT INTO categories (id, name, slug, parent_id) VALUES (gen_random_uuid()::text, 'Makeup Artists', 'makeup-artists', fashion_and_beauty_id)
  ON CONFLICT (slug) DO UPDATE SET name = EXCLUDED.name, parent_id = EXCLUDED.parent_id;
  INSERT INTO categories (id, name, slug, parent_id) VALUES (gen_random_uuid()::text, 'Nail Studios', 'nail-studios', fashion_and_beauty_id)
  ON CONFLICT (slug) DO UPDATE SET name = EXCLUDED.name, parent_id = EXCLUDED.parent_id;
  INSERT INTO categories (id, name, slug, parent_id) VALUES (gen_random_uuid()::text, 'Shoe Makers', 'shoe-makers', fashion_and_beauty_id)
  ON CONFLICT (slug) DO UPDATE SET name = EXCLUDED.name, parent_id = EXCLUDED.parent_id;
  INSERT INTO categories (id, name, slug, parent_id) VALUES (gen_random_uuid()::text, 'Tailors & Alterations', 'tailors-and-alterations', fashion_and_beauty_id)
  ON CONFLICT (slug) DO UPDATE SET name = EXCLUDED.name, parent_id = EXCLUDED.parent_id;

  -- Finance & Insurance
  INSERT INTO categories (id, name, slug, parent_id) VALUES (gen_random_uuid()::text, 'Accountants & Auditors', 'accountants-and-auditors', finance_and_insurance_id)
  ON CONFLICT (slug) DO UPDATE SET name = EXCLUDED.name, parent_id = EXCLUDED.parent_id;
  INSERT INTO categories (id, name, slug, parent_id) VALUES (gen_random_uuid()::text, 'Banks & Microfinance', 'banks-and-microfinance', finance_and_insurance_id)
  ON CONFLICT (slug) DO UPDATE SET name = EXCLUDED.name, parent_id = EXCLUDED.parent_id;
  INSERT INTO categories (id, name, slug, parent_id) VALUES (gen_random_uuid()::text, 'Crowdfunding & Investment', 'crowdfunding-and-investment', finance_and_insurance_id)
  ON CONFLICT (slug) DO UPDATE SET name = EXCLUDED.name, parent_id = EXCLUDED.parent_id;
  INSERT INTO categories (id, name, slug, parent_id) VALUES (gen_random_uuid()::text, 'Insurance Agents', 'insurance-agents', finance_and_insurance_id)
  ON CONFLICT (slug) DO UPDATE SET name = EXCLUDED.name, parent_id = EXCLUDED.parent_id;
  INSERT INTO categories (id, name, slug, parent_id) VALUES (gen_random_uuid()::text, 'Mobile Money & POS', 'mobile-money-and-pos', finance_and_insurance_id)
  ON CONFLICT (slug) DO UPDATE SET name = EXCLUDED.name, parent_id = EXCLUDED.parent_id;
  INSERT INTO categories (id, name, slug, parent_id) VALUES (gen_random_uuid()::text, 'Payroll Services', 'payroll-services', finance_and_insurance_id)
  ON CONFLICT (slug) DO UPDATE SET name = EXCLUDED.name, parent_id = EXCLUDED.parent_id;
  INSERT INTO categories (id, name, slug, parent_id) VALUES (gen_random_uuid()::text, 'Tax Consultants', 'tax-consultants', finance_and_insurance_id)
  ON CONFLICT (slug) DO UPDATE SET name = EXCLUDED.name, parent_id = EXCLUDED.parent_id;

  -- Food & Dining
  INSERT INTO categories (id, name, slug, parent_id) VALUES (gen_random_uuid()::text, 'Bakeries', 'bakeries', food_and_dining_id)
  ON CONFLICT (slug) DO UPDATE SET name = EXCLUDED.name, parent_id = EXCLUDED.parent_id;
  INSERT INTO categories (id, name, slug, parent_id) VALUES (gen_random_uuid()::text, 'Cafes & Coffee Shops', 'cafes-and-coffee-shops', food_and_dining_id)
  ON CONFLICT (slug) DO UPDATE SET name = EXCLUDED.name, parent_id = EXCLUDED.parent_id;
  INSERT INTO categories (id, name, slug, parent_id) VALUES (gen_random_uuid()::text, 'Catering Services', 'catering-services', food_and_dining_id)
  ON CONFLICT (slug) DO UPDATE SET name = EXCLUDED.name, parent_id = EXCLUDED.parent_id;
  INSERT INTO categories (id, name, slug, parent_id) VALUES (gen_random_uuid()::text, 'Fast Food & Takeaway', 'fast-food-and-takeaway', food_and_dining_id)
  ON CONFLICT (slug) DO UPDATE SET name = EXCLUDED.name, parent_id = EXCLUDED.parent_id;
  INSERT INTO categories (id, name, slug, parent_id) VALUES (gen_random_uuid()::text, 'Food Manufacturing', 'food-manufacturing', food_and_dining_id)
  ON CONFLICT (slug) DO UPDATE SET name = EXCLUDED.name, parent_id = EXCLUDED.parent_id;
  INSERT INTO categories (id, name, slug, parent_id) VALUES (gen_random_uuid()::text, 'Food Vendors & Bukka', 'food-vendors-and-bukka', food_and_dining_id)
  ON CONFLICT (slug) DO UPDATE SET name = EXCLUDED.name, parent_id = EXCLUDED.parent_id;
  INSERT INTO categories (id, name, slug, parent_id) VALUES (gen_random_uuid()::text, 'Restaurants', 'restaurants', food_and_dining_id)
  ON CONFLICT (slug) DO UPDATE SET name = EXCLUDED.name, parent_id = EXCLUDED.parent_id;
  INSERT INTO categories (id, name, slug, parent_id) VALUES (gen_random_uuid()::text, 'Suya & Grills', 'suya-and-grills', food_and_dining_id)
  ON CONFLICT (slug) DO UPDATE SET name = EXCLUDED.name, parent_id = EXCLUDED.parent_id;
  INSERT INTO categories (id, name, slug, parent_id) VALUES (gen_random_uuid()::text, 'Supermarkets & Provision Stores', 'supermarkets-and-provision-stores', food_and_dining_id)
  ON CONFLICT (slug) DO UPDATE SET name = EXCLUDED.name, parent_id = EXCLUDED.parent_id;
  INSERT INTO categories (id, name, slug, parent_id) VALUES (gen_random_uuid()::text, 'Wine & Drinks', 'wine-and-drinks', food_and_dining_id)
  ON CONFLICT (slug) DO UPDATE SET name = EXCLUDED.name, parent_id = EXCLUDED.parent_id;

  -- Health & Medical
  INSERT INTO categories (id, name, slug, parent_id) VALUES (gen_random_uuid()::text, 'Clinics & Hospitals', 'clinics-and-hospitals', health_and_medical_id)
  ON CONFLICT (slug) DO UPDATE SET name = EXCLUDED.name, parent_id = EXCLUDED.parent_id;
  INSERT INTO categories (id, name, slug, parent_id) VALUES (gen_random_uuid()::text, 'Dentists', 'dentists', health_and_medical_id)
  ON CONFLICT (slug) DO UPDATE SET name = EXCLUDED.name, parent_id = EXCLUDED.parent_id;
  INSERT INTO categories (id, name, slug, parent_id) VALUES (gen_random_uuid()::text, 'Diagnostics & Labs', 'diagnostics-and-labs', health_and_medical_id)
  ON CONFLICT (slug) DO UPDATE SET name = EXCLUDED.name, parent_id = EXCLUDED.parent_id;
  INSERT INTO categories (id, name, slug, parent_id) VALUES (gen_random_uuid()::text, 'Doctors', 'doctors', health_and_medical_id)
  ON CONFLICT (slug) DO UPDATE SET name = EXCLUDED.name, parent_id = EXCLUDED.parent_id;
  INSERT INTO categories (id, name, slug, parent_id) VALUES (gen_random_uuid()::text, 'Gyms & Fitness', 'gyms-and-fitness', health_and_medical_id)
  ON CONFLICT (slug) DO UPDATE SET name = EXCLUDED.name, parent_id = EXCLUDED.parent_id;
  INSERT INTO categories (id, name, slug, parent_id) VALUES (gen_random_uuid()::text, 'Mental Health', 'mental-health', health_and_medical_id)
  ON CONFLICT (slug) DO UPDATE SET name = EXCLUDED.name, parent_id = EXCLUDED.parent_id;
  INSERT INTO categories (id, name, slug, parent_id) VALUES (gen_random_uuid()::text, 'Nursing & Home Care', 'nursing-and-home-care', health_and_medical_id)
  ON CONFLICT (slug) DO UPDATE SET name = EXCLUDED.name, parent_id = EXCLUDED.parent_id;
  INSERT INTO categories (id, name, slug, parent_id) VALUES (gen_random_uuid()::text, 'Opticians', 'opticians', health_and_medical_id)
  ON CONFLICT (slug) DO UPDATE SET name = EXCLUDED.name, parent_id = EXCLUDED.parent_id;
  INSERT INTO categories (id, name, slug, parent_id) VALUES (gen_random_uuid()::text, 'Pharmacies', 'pharmacies', health_and_medical_id)
  ON CONFLICT (slug) DO UPDATE SET name = EXCLUDED.name, parent_id = EXCLUDED.parent_id;
  INSERT INTO categories (id, name, slug, parent_id) VALUES (gen_random_uuid()::text, 'Spa & Massage', 'spa-and-massage', health_and_medical_id)
  ON CONFLICT (slug) DO UPDATE SET name = EXCLUDED.name, parent_id = EXCLUDED.parent_id;
  INSERT INTO categories (id, name, slug, parent_id) VALUES (gen_random_uuid()::text, 'Traditional & Alternative Medicine', 'traditional-and-alternative-medicine', health_and_medical_id)
  ON CONFLICT (slug) DO UPDATE SET name = EXCLUDED.name, parent_id = EXCLUDED.parent_id;
  INSERT INTO categories (id, name, slug, parent_id) VALUES (gen_random_uuid()::text, 'Veterinary', 'veterinary', health_and_medical_id)
  ON CONFLICT (slug) DO UPDATE SET name = EXCLUDED.name, parent_id = EXCLUDED.parent_id;

  -- Home Services
  INSERT INTO categories (id, name, slug, parent_id) VALUES (gen_random_uuid()::text, 'AC Repair & Installation', 'ac-repair-and-installation', home_services_id)
  ON CONFLICT (slug) DO UPDATE SET name = EXCLUDED.name, parent_id = EXCLUDED.parent_id;
  INSERT INTO categories (id, name, slug, parent_id) VALUES (gen_random_uuid()::text, 'Cleaners & Housekeeping', 'cleaners-and-housekeeping', home_services_id)
  ON CONFLICT (slug) DO UPDATE SET name = EXCLUDED.name, parent_id = EXCLUDED.parent_id;
  INSERT INTO categories (id, name, slug, parent_id) VALUES (gen_random_uuid()::text, 'Electricians', 'electricians', home_services_id)
  ON CONFLICT (slug) DO UPDATE SET name = EXCLUDED.name, parent_id = EXCLUDED.parent_id;
  INSERT INTO categories (id, name, slug, parent_id) VALUES (gen_random_uuid()::text, 'Fumigation & Pest Control', 'fumigation-and-pest-control', home_services_id)
  ON CONFLICT (slug) DO UPDATE SET name = EXCLUDED.name, parent_id = EXCLUDED.parent_id;
  INSERT INTO categories (id, name, slug, parent_id) VALUES (gen_random_uuid()::text, 'Gardeners & Landscaping', 'gardeners-and-landscaping', home_services_id)
  ON CONFLICT (slug) DO UPDATE SET name = EXCLUDED.name, parent_id = EXCLUDED.parent_id;
  INSERT INTO categories (id, name, slug, parent_id) VALUES (gen_random_uuid()::text, 'Interior Design', 'interior-design', home_services_id)
  ON CONFLICT (slug) DO UPDATE SET name = EXCLUDED.name, parent_id = EXCLUDED.parent_id;
  INSERT INTO categories (id, name, slug, parent_id) VALUES (gen_random_uuid()::text, 'Laundry & Dry Cleaning', 'laundry-and-dry-cleaning', home_services_id)
  ON CONFLICT (slug) DO UPDATE SET name = EXCLUDED.name, parent_id = EXCLUDED.parent_id;
  INSERT INTO categories (id, name, slug, parent_id) VALUES (gen_random_uuid()::text, 'Locksmiths', 'locksmiths', home_services_id)
  ON CONFLICT (slug) DO UPDATE SET name = EXCLUDED.name, parent_id = EXCLUDED.parent_id;
  INSERT INTO categories (id, name, slug, parent_id) VALUES (gen_random_uuid()::text, 'Painters', 'painters', home_services_id)
  ON CONFLICT (slug) DO UPDATE SET name = EXCLUDED.name, parent_id = EXCLUDED.parent_id;
  INSERT INTO categories (id, name, slug, parent_id) VALUES (gen_random_uuid()::text, 'Plumbers', 'home-plumbers', home_services_id)
  ON CONFLICT (slug) DO UPDATE SET name = EXCLUDED.name, parent_id = EXCLUDED.parent_id;
  INSERT INTO categories (id, name, slug, parent_id) VALUES (gen_random_uuid()::text, 'Waste Disposal', 'waste-disposal', home_services_id)
  ON CONFLICT (slug) DO UPDATE SET name = EXCLUDED.name, parent_id = EXCLUDED.parent_id;

  -- Legal Services
  INSERT INTO categories (id, name, slug, parent_id) VALUES (gen_random_uuid()::text, 'Corporate Law', 'corporate-law', legal_services_id)
  ON CONFLICT (slug) DO UPDATE SET name = EXCLUDED.name, parent_id = EXCLUDED.parent_id;
  INSERT INTO categories (id, name, slug, parent_id) VALUES (gen_random_uuid()::text, 'Family Law', 'family-law', legal_services_id)
  ON CONFLICT (slug) DO UPDATE SET name = EXCLUDED.name, parent_id = EXCLUDED.parent_id;
  INSERT INTO categories (id, name, slug, parent_id) VALUES (gen_random_uuid()::text, 'Immigration & Visa', 'immigration-and-visa', legal_services_id)
  ON CONFLICT (slug) DO UPDATE SET name = EXCLUDED.name, parent_id = EXCLUDED.parent_id;
  INSERT INTO categories (id, name, slug, parent_id) VALUES (gen_random_uuid()::text, 'Lawyers & Solicitors', 'lawyers-and-solicitors', legal_services_id)
  ON CONFLICT (slug) DO UPDATE SET name = EXCLUDED.name, parent_id = EXCLUDED.parent_id;
  INSERT INTO categories (id, name, slug, parent_id) VALUES (gen_random_uuid()::text, 'Notary Public', 'notary-public', legal_services_id)
  ON CONFLICT (slug) DO UPDATE SET name = EXCLUDED.name, parent_id = EXCLUDED.parent_id;
  INSERT INTO categories (id, name, slug, parent_id) VALUES (gen_random_uuid()::text, 'Property Law', 'property-law', legal_services_id)
  ON CONFLICT (slug) DO UPDATE SET name = EXCLUDED.name, parent_id = EXCLUDED.parent_id;

  -- Logistics & Transport
  INSERT INTO categories (id, name, slug, parent_id) VALUES (gen_random_uuid()::text, 'Air Freight', 'air-freight', logistics_and_transport_id)
  ON CONFLICT (slug) DO UPDATE SET name = EXCLUDED.name, parent_id = EXCLUDED.parent_id;
  INSERT INTO categories (id, name, slug, parent_id) VALUES (gen_random_uuid()::text, 'Bus & Public Transport', 'bus-and-public-transport', logistics_and_transport_id)
  ON CONFLICT (slug) DO UPDATE SET name = EXCLUDED.name, parent_id = EXCLUDED.parent_id;
  INSERT INTO categories (id, name, slug, parent_id) VALUES (gen_random_uuid()::text, 'Cargo & Shipping', 'cargo-and-shipping', logistics_and_transport_id)
  ON CONFLICT (slug) DO UPDATE SET name = EXCLUDED.name, parent_id = EXCLUDED.parent_id;
  INSERT INTO categories (id, name, slug, parent_id) VALUES (gen_random_uuid()::text, 'Courier Services', 'courier-services', logistics_and_transport_id)
  ON CONFLICT (slug) DO UPDATE SET name = EXCLUDED.name, parent_id = EXCLUDED.parent_id;
  INSERT INTO categories (id, name, slug, parent_id) VALUES (gen_random_uuid()::text, 'Dispatch Riders', 'logistics-dispatch-riders', logistics_and_transport_id)
  ON CONFLICT (slug) DO UPDATE SET name = EXCLUDED.name, parent_id = EXCLUDED.parent_id;
  INSERT INTO categories (id, name, slug, parent_id) VALUES (gen_random_uuid()::text, 'Haulage & Trucking', 'haulage-and-trucking', logistics_and_transport_id)
  ON CONFLICT (slug) DO UPDATE SET name = EXCLUDED.name, parent_id = EXCLUDED.parent_id;
  INSERT INTO categories (id, name, slug, parent_id) VALUES (gen_random_uuid()::text, 'Moving & Relocation', 'moving-and-relocation', logistics_and_transport_id)
  ON CONFLICT (slug) DO UPDATE SET name = EXCLUDED.name, parent_id = EXCLUDED.parent_id;
  INSERT INTO categories (id, name, slug, parent_id) VALUES (gen_random_uuid()::text, 'Taxis & Ride-Hailing', 'taxis-and-ride-hailing', logistics_and_transport_id)
  ON CONFLICT (slug) DO UPDATE SET name = EXCLUDED.name, parent_id = EXCLUDED.parent_id;
  INSERT INTO categories (id, name, slug, parent_id) VALUES (gen_random_uuid()::text, 'Warehousing', 'warehousing', logistics_and_transport_id)
  ON CONFLICT (slug) DO UPDATE SET name = EXCLUDED.name, parent_id = EXCLUDED.parent_id;

  -- Manufacturing & Industry
  INSERT INTO categories (id, name, slug, parent_id) VALUES (gen_random_uuid()::text, 'Chemicals', 'chemicals', manufacturing_and_industry_id)
  ON CONFLICT (slug) DO UPDATE SET name = EXCLUDED.name, parent_id = EXCLUDED.parent_id;
  INSERT INTO categories (id, name, slug, parent_id) VALUES (gen_random_uuid()::text, 'Electrical Equipment', 'electrical-equipment', manufacturing_and_industry_id)
  ON CONFLICT (slug) DO UPDATE SET name = EXCLUDED.name, parent_id = EXCLUDED.parent_id;
  INSERT INTO categories (id, name, slug, parent_id) VALUES (gen_random_uuid()::text, 'Energy & Power', 'energy-and-power', manufacturing_and_industry_id)
  ON CONFLICT (slug) DO UPDATE SET name = EXCLUDED.name, parent_id = EXCLUDED.parent_id;
  INSERT INTO categories (id, name, slug, parent_id) VALUES (gen_random_uuid()::text, 'Engineering Services', 'engineering-services', manufacturing_and_industry_id)
  ON CONFLICT (slug) DO UPDATE SET name = EXCLUDED.name, parent_id = EXCLUDED.parent_id;
  INSERT INTO categories (id, name, slug, parent_id) VALUES (gen_random_uuid()::text, 'Food Processing', 'food-processing', manufacturing_and_industry_id)
  ON CONFLICT (slug) DO UPDATE SET name = EXCLUDED.name, parent_id = EXCLUDED.parent_id;
  INSERT INTO categories (id, name, slug, parent_id) VALUES (gen_random_uuid()::text, 'Furniture Manufacturing', 'furniture-manufacturing', manufacturing_and_industry_id)
  ON CONFLICT (slug) DO UPDATE SET name = EXCLUDED.name, parent_id = EXCLUDED.parent_id;
  INSERT INTO categories (id, name, slug, parent_id) VALUES (gen_random_uuid()::text, 'Industrial Equipment', 'industrial-equipment', manufacturing_and_industry_id)
  ON CONFLICT (slug) DO UPDATE SET name = EXCLUDED.name, parent_id = EXCLUDED.parent_id;
  INSERT INTO categories (id, name, slug, parent_id) VALUES (gen_random_uuid()::text, 'Oil & Gas', 'oil-and-gas', manufacturing_and_industry_id)
  ON CONFLICT (slug) DO UPDATE SET name = EXCLUDED.name, parent_id = EXCLUDED.parent_id;
  INSERT INTO categories (id, name, slug, parent_id) VALUES (gen_random_uuid()::text, 'Packaging', 'packaging', manufacturing_and_industry_id)
  ON CONFLICT (slug) DO UPDATE SET name = EXCLUDED.name, parent_id = EXCLUDED.parent_id;
  INSERT INTO categories (id, name, slug, parent_id) VALUES (gen_random_uuid()::text, 'Plastics & Rubber', 'plastics-and-rubber', manufacturing_and_industry_id)
  ON CONFLICT (slug) DO UPDATE SET name = EXCLUDED.name, parent_id = EXCLUDED.parent_id;
  INSERT INTO categories (id, name, slug, parent_id) VALUES (gen_random_uuid()::text, 'Steel & Metal Works', 'steel-and-metal-works', manufacturing_and_industry_id)
  ON CONFLICT (slug) DO UPDATE SET name = EXCLUDED.name, parent_id = EXCLUDED.parent_id;
  INSERT INTO categories (id, name, slug, parent_id) VALUES (gen_random_uuid()::text, 'Textiles', 'textiles', manufacturing_and_industry_id)
  ON CONFLICT (slug) DO UPDATE SET name = EXCLUDED.name, parent_id = EXCLUDED.parent_id;
  INSERT INTO categories (id, name, slug, parent_id) VALUES (gen_random_uuid()::text, 'Water Treatment', 'water-treatment', manufacturing_and_industry_id)
  ON CONFLICT (slug) DO UPDATE SET name = EXCLUDED.name, parent_id = EXCLUDED.parent_id;

  -- Property & Real Estate
  INSERT INTO categories (id, name, slug, parent_id) VALUES (gen_random_uuid()::text, 'Commercial Property', 'commercial-property', property_and_real_estate_id)
  ON CONFLICT (slug) DO UPDATE SET name = EXCLUDED.name, parent_id = EXCLUDED.parent_id;
  INSERT INTO categories (id, name, slug, parent_id) VALUES (gen_random_uuid()::text, 'Coworking Spaces', 'coworking-spaces', property_and_real_estate_id)
  ON CONFLICT (slug) DO UPDATE SET name = EXCLUDED.name, parent_id = EXCLUDED.parent_id;
  INSERT INTO categories (id, name, slug, parent_id) VALUES (gen_random_uuid()::text, 'Estate Agents', 'estate-agents', property_and_real_estate_id)
  ON CONFLICT (slug) DO UPDATE SET name = EXCLUDED.name, parent_id = EXCLUDED.parent_id;
  INSERT INTO categories (id, name, slug, parent_id) VALUES (gen_random_uuid()::text, 'Facility Management', 'facility-management', property_and_real_estate_id)
  ON CONFLICT (slug) DO UPDATE SET name = EXCLUDED.name, parent_id = EXCLUDED.parent_id;
  INSERT INTO categories (id, name, slug, parent_id) VALUES (gen_random_uuid()::text, 'Land Agents', 'land-agents', property_and_real_estate_id)
  ON CONFLICT (slug) DO UPDATE SET name = EXCLUDED.name, parent_id = EXCLUDED.parent_id;
  INSERT INTO categories (id, name, slug, parent_id) VALUES (gen_random_uuid()::text, 'Property Development', 'property-development', property_and_real_estate_id)
  ON CONFLICT (slug) DO UPDATE SET name = EXCLUDED.name, parent_id = EXCLUDED.parent_id;
  INSERT INTO categories (id, name, slug, parent_id) VALUES (gen_random_uuid()::text, 'Property Management', 'property-management', property_and_real_estate_id)
  ON CONFLICT (slug) DO UPDATE SET name = EXCLUDED.name, parent_id = EXCLUDED.parent_id;
  INSERT INTO categories (id, name, slug, parent_id) VALUES (gen_random_uuid()::text, 'Short-Let Apartments', 'short-let-apartments', property_and_real_estate_id)
  ON CONFLICT (slug) DO UPDATE SET name = EXCLUDED.name, parent_id = EXCLUDED.parent_id;

  -- Religious & Community
  INSERT INTO categories (id, name, slug, parent_id) VALUES (gen_random_uuid()::text, 'Charity & NGOs', 'charity-and-ngos', religious_and_community_id)
  ON CONFLICT (slug) DO UPDATE SET name = EXCLUDED.name, parent_id = EXCLUDED.parent_id;
  INSERT INTO categories (id, name, slug, parent_id) VALUES (gen_random_uuid()::text, 'Churches', 'churches', religious_and_community_id)
  ON CONFLICT (slug) DO UPDATE SET name = EXCLUDED.name, parent_id = EXCLUDED.parent_id;
  INSERT INTO categories (id, name, slug, parent_id) VALUES (gen_random_uuid()::text, 'Community Centres', 'community-centres', religious_and_community_id)
  ON CONFLICT (slug) DO UPDATE SET name = EXCLUDED.name, parent_id = EXCLUDED.parent_id;
  INSERT INTO categories (id, name, slug, parent_id) VALUES (gen_random_uuid()::text, 'Counselling', 'counselling', religious_and_community_id)
  ON CONFLICT (slug) DO UPDATE SET name = EXCLUDED.name, parent_id = EXCLUDED.parent_id;
  INSERT INTO categories (id, name, slug, parent_id) VALUES (gen_random_uuid()::text, 'Mosques', 'mosques', religious_and_community_id)
  ON CONFLICT (slug) DO UPDATE SET name = EXCLUDED.name, parent_id = EXCLUDED.parent_id;
  INSERT INTO categories (id, name, slug, parent_id) VALUES (gen_random_uuid()::text, 'Youth Organizations', 'youth-organizations', religious_and_community_id)
  ON CONFLICT (slug) DO UPDATE SET name = EXCLUDED.name, parent_id = EXCLUDED.parent_id;

  -- Shopping & Retail
  INSERT INTO categories (id, name, slug, parent_id) VALUES (gen_random_uuid()::text, 'Baby & Kids Stores', 'baby-and-kids-stores', shopping_and_retail_id)
  ON CONFLICT (slug) DO UPDATE SET name = EXCLUDED.name, parent_id = EXCLUDED.parent_id;
  INSERT INTO categories (id, name, slug, parent_id) VALUES (gen_random_uuid()::text, 'Books & Stationery', 'books-and-stationery', shopping_and_retail_id)
  ON CONFLICT (slug) DO UPDATE SET name = EXCLUDED.name, parent_id = EXCLUDED.parent_id;
  INSERT INTO categories (id, name, slug, parent_id) VALUES (gen_random_uuid()::text, 'Clothing & Accessories', 'clothing-and-accessories', shopping_and_retail_id)
  ON CONFLICT (slug) DO UPDATE SET name = EXCLUDED.name, parent_id = EXCLUDED.parent_id;
  INSERT INTO categories (id, name, slug, parent_id) VALUES (gen_random_uuid()::text, 'Electronics & Gadgets', 'electronics-and-gadgets', shopping_and_retail_id)
  ON CONFLICT (slug) DO UPDATE SET name = EXCLUDED.name, parent_id = EXCLUDED.parent_id;
  INSERT INTO categories (id, name, slug, parent_id) VALUES (gen_random_uuid()::text, 'Gift Shops', 'gift-shops', shopping_and_retail_id)
  ON CONFLICT (slug) DO UPDATE SET name = EXCLUDED.name, parent_id = EXCLUDED.parent_id;
  INSERT INTO categories (id, name, slug, parent_id) VALUES (gen_random_uuid()::text, 'Hardware Stores', 'hardware-stores', shopping_and_retail_id)
  ON CONFLICT (slug) DO UPDATE SET name = EXCLUDED.name, parent_id = EXCLUDED.parent_id;
  INSERT INTO categories (id, name, slug, parent_id) VALUES (gen_random_uuid()::text, 'Home & Garden', 'home-and-garden', shopping_and_retail_id)
  ON CONFLICT (slug) DO UPDATE SET name = EXCLUDED.name, parent_id = EXCLUDED.parent_id;
  INSERT INTO categories (id, name, slug, parent_id) VALUES (gen_random_uuid()::text, 'Mobile Phone Shops', 'mobile-phone-shops', shopping_and_retail_id)
  ON CONFLICT (slug) DO UPDATE SET name = EXCLUDED.name, parent_id = EXCLUDED.parent_id;
  INSERT INTO categories (id, name, slug, parent_id) VALUES (gen_random_uuid()::text, 'Online Stores', 'online-stores', shopping_and_retail_id)
  ON CONFLICT (slug) DO UPDATE SET name = EXCLUDED.name, parent_id = EXCLUDED.parent_id;
  INSERT INTO categories (id, name, slug, parent_id) VALUES (gen_random_uuid()::text, 'Provision Stores', 'provision-stores', shopping_and_retail_id)
  ON CONFLICT (slug) DO UPDATE SET name = EXCLUDED.name, parent_id = EXCLUDED.parent_id;
  INSERT INTO categories (id, name, slug, parent_id) VALUES (gen_random_uuid()::text, 'Supermarkets', 'supermarkets', shopping_and_retail_id)
  ON CONFLICT (slug) DO UPDATE SET name = EXCLUDED.name, parent_id = EXCLUDED.parent_id;
  INSERT INTO categories (id, name, slug, parent_id) VALUES (gen_random_uuid()::text, 'Wholesale', 'wholesale', shopping_and_retail_id)
  ON CONFLICT (slug) DO UPDATE SET name = EXCLUDED.name, parent_id = EXCLUDED.parent_id;

  -- Tourism & Hospitality
  INSERT INTO categories (id, name, slug, parent_id) VALUES (gen_random_uuid()::text, 'Apartments & Guest Houses', 'apartments-and-guest-houses', tourism_and_hospitality_id)
  ON CONFLICT (slug) DO UPDATE SET name = EXCLUDED.name, parent_id = EXCLUDED.parent_id;
  INSERT INTO categories (id, name, slug, parent_id) VALUES (gen_random_uuid()::text, 'Attractions & Sightseeing', 'attractions-and-sightseeing', tourism_and_hospitality_id)
  ON CONFLICT (slug) DO UPDATE SET name = EXCLUDED.name, parent_id = EXCLUDED.parent_id;
  INSERT INTO categories (id, name, slug, parent_id) VALUES (gen_random_uuid()::text, 'Bed & Breakfast', 'bed-and-breakfast', tourism_and_hospitality_id)
  ON CONFLICT (slug) DO UPDATE SET name = EXCLUDED.name, parent_id = EXCLUDED.parent_id;
  INSERT INTO categories (id, name, slug, parent_id) VALUES (gen_random_uuid()::text, 'Holiday Homes', 'holiday-homes', tourism_and_hospitality_id)
  ON CONFLICT (slug) DO UPDATE SET name = EXCLUDED.name, parent_id = EXCLUDED.parent_id;
  INSERT INTO categories (id, name, slug, parent_id) VALUES (gen_random_uuid()::text, 'Hotels & Resorts', 'hotels-and-resorts', tourism_and_hospitality_id)
  ON CONFLICT (slug) DO UPDATE SET name = EXCLUDED.name, parent_id = EXCLUDED.parent_id;
  INSERT INTO categories (id, name, slug, parent_id) VALUES (gen_random_uuid()::text, 'Tour Operators', 'tour-operators', tourism_and_hospitality_id)
  ON CONFLICT (slug) DO UPDATE SET name = EXCLUDED.name, parent_id = EXCLUDED.parent_id;
  INSERT INTO categories (id, name, slug, parent_id) VALUES (gen_random_uuid()::text, 'Travel Agents', 'travel-agents', tourism_and_hospitality_id)
  ON CONFLICT (slug) DO UPDATE SET name = EXCLUDED.name, parent_id = EXCLUDED.parent_id;
  INSERT INTO categories (id, name, slug, parent_id) VALUES (gen_random_uuid()::text, 'Visa Services', 'visa-services', tourism_and_hospitality_id)
  ON CONFLICT (slug) DO UPDATE SET name = EXCLUDED.name, parent_id = EXCLUDED.parent_id;

  RAISE NOTICE 'Category taxonomy upgrade complete!';
END $$;