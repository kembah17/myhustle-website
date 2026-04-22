-- Migration: Upgrade Category Taxonomy (FIXED v3)
-- Date: 2026-04-22
-- Schema: categories(id, slug, name, description, parent_id, icon, seo_title_template, seo_description_template)
-- NO created_at/updated_at columns exist in this table.

DO $$
DECLARE
  agriculture_and_farming_id TEXT := gen_random_uuid()::text;
  auto_services_and_motoring_id TEXT := gen_random_uuid()::text;
  business_services_id TEXT := gen_random_uuid()::text;
  computers_and_technology_id TEXT := gen_random_uuid()::text;
  construction_and_tradesmen_id TEXT := gen_random_uuid()::text;
  education_and_training_id TEXT := gen_random_uuid()::text;
  entertainment_and_leisure_id TEXT := gen_random_uuid()::text;
  events_and_weddings_id TEXT := gen_random_uuid()::text;
  fashion_and_beauty_id TEXT := gen_random_uuid()::text;
  finance_and_insurance_id TEXT := gen_random_uuid()::text;
  food_and_dining_id TEXT := gen_random_uuid()::text;
  health_and_medical_id TEXT := gen_random_uuid()::text;
  home_services_id TEXT := gen_random_uuid()::text;
  legal_services_id TEXT := gen_random_uuid()::text;
  logistics_and_transport_id TEXT := gen_random_uuid()::text;
  manufacturing_and_industry_id TEXT := gen_random_uuid()::text;
  property_and_real_estate_id TEXT := gen_random_uuid()::text;
  religious_and_community_id TEXT := gen_random_uuid()::text;
  shopping_and_retail_id TEXT := gen_random_uuid()::text;
  tourism_and_hospitality_id TEXT := gen_random_uuid()::text;
  other_id TEXT := gen_random_uuid()::text;
  biz_count INTEGER;
BEGIN

  -- =============================================================
  -- STEP 1: Insert NEW parent categories
  -- =============================================================
  INSERT INTO categories (id, name, slug, parent_id)
  VALUES (agriculture_and_farming_id, 'Agriculture & Farming', 'agriculture-and-farming', NULL);

  INSERT INTO categories (id, name, slug, parent_id)
  VALUES (auto_services_and_motoring_id, 'Auto Services & Motoring', 'auto-services-and-motoring', NULL);

  INSERT INTO categories (id, name, slug, parent_id)
  VALUES (business_services_id, 'Business Services', 'business-services', NULL);

  INSERT INTO categories (id, name, slug, parent_id)
  VALUES (computers_and_technology_id, 'Computers & Technology', 'computers-and-technology', NULL);

  INSERT INTO categories (id, name, slug, parent_id)
  VALUES (construction_and_tradesmen_id, 'Construction & Tradesmen', 'construction-and-tradesmen', NULL);

  INSERT INTO categories (id, name, slug, parent_id)
  VALUES (education_and_training_id, 'Education & Training', 'education-and-training', NULL);

  INSERT INTO categories (id, name, slug, parent_id)
  VALUES (entertainment_and_leisure_id, 'Entertainment & Leisure', 'entertainment-and-leisure', NULL);

  INSERT INTO categories (id, name, slug, parent_id)
  VALUES (events_and_weddings_id, 'Events & Weddings', 'events-and-weddings', NULL);

  INSERT INTO categories (id, name, slug, parent_id)
  VALUES (fashion_and_beauty_id, 'Fashion & Beauty', 'fashion-and-beauty', NULL);

  INSERT INTO categories (id, name, slug, parent_id)
  VALUES (finance_and_insurance_id, 'Finance & Insurance', 'finance-and-insurance', NULL);

  INSERT INTO categories (id, name, slug, parent_id)
  VALUES (food_and_dining_id, 'Food & Dining', 'food-and-dining', NULL);

  INSERT INTO categories (id, name, slug, parent_id)
  VALUES (health_and_medical_id, 'Health & Medical', 'health-and-medical', NULL);

  INSERT INTO categories (id, name, slug, parent_id)
  VALUES (home_services_id, 'Home Services', 'home-services', NULL);

  INSERT INTO categories (id, name, slug, parent_id)
  VALUES (legal_services_id, 'Legal Services', 'legal-services', NULL);

  INSERT INTO categories (id, name, slug, parent_id)
  VALUES (logistics_and_transport_id, 'Logistics & Transport', 'logistics-and-transport', NULL);

  INSERT INTO categories (id, name, slug, parent_id)
  VALUES (manufacturing_and_industry_id, 'Manufacturing & Industry', 'manufacturing-and-industry', NULL);

  INSERT INTO categories (id, name, slug, parent_id)
  VALUES (property_and_real_estate_id, 'Property & Real Estate', 'property-and-real-estate', NULL);

  INSERT INTO categories (id, name, slug, parent_id)
  VALUES (religious_and_community_id, 'Religious & Community', 'religious-and-community', NULL);

  INSERT INTO categories (id, name, slug, parent_id)
  VALUES (shopping_and_retail_id, 'Shopping & Retail', 'shopping-and-retail', NULL);

  INSERT INTO categories (id, name, slug, parent_id)
  VALUES (tourism_and_hospitality_id, 'Tourism & Hospitality', 'tourism-and-hospitality', NULL);

  INSERT INTO categories (id, name, slug, parent_id)
  VALUES (other_id, 'Other', 'other', NULL);

  -- =============================================================
  -- STEP 2: Remap existing businesses to new categories
  -- =============================================================
  SELECT COUNT(*) INTO biz_count FROM businesses;

  IF biz_count > 0 THEN
    CREATE TEMP TABLE _cat_map (old_slug TEXT, new_id TEXT);
    INSERT INTO _cat_map (old_slug, new_id) VALUES
      ('agriculture-farming', agriculture_and_farming_id),
      ('auto-services', auto_services_and_motoring_id),
      ('childcare-parenting', education_and_training_id),
      ('education-training', education_and_training_id),
      ('entertainment-leisure', entertainment_and_leisure_id),
      ('events', events_and_weddings_id),
      ('fashion-tailoring', fashion_and_beauty_id),
      ('food-dining', food_and_dining_id),
      ('hair-beauty', fashion_and_beauty_id),
      ('health-wellness', health_and_medical_id),
      ('home-services', home_services_id),
      ('laundry-dry-cleaning', home_services_id),
      ('legal-finance', finance_and_insurance_id),
      ('logistics-transport', logistics_and_transport_id),
      ('photography', events_and_weddings_id),
      ('printing-branding', business_services_id),
      ('real-estate', property_and_real_estate_id),
      ('religious-spiritual', religious_and_community_id),
      ('supermarkets-retail', shopping_and_retail_id),
      ('technology-it', computers_and_technology_id),
      ('other', other_id);

    -- Update businesses pointing to old parent categories
    UPDATE businesses b
    SET category_id = m.new_id
    FROM categories c
    JOIN _cat_map m ON c.slug = m.old_slug
    WHERE b.category_id = c.id AND c.parent_id IS NULL;

    -- Update businesses pointing to old subcategories (via parent slug)
    UPDATE businesses b
    SET category_id = m.new_id
    FROM categories c
    JOIN categories p ON c.parent_id = p.id
    JOIN _cat_map m ON p.slug = m.old_slug
    WHERE b.category_id = c.id AND c.parent_id IS NOT NULL;

    -- Fallback: any unmapped businesses go to 'Other'
    UPDATE businesses
    SET category_id = other_id
    WHERE category_id NOT IN (
      agriculture_and_farming_id, auto_services_and_motoring_id, business_services_id, computers_and_technology_id, construction_and_tradesmen_id, education_and_training_id, entertainment_and_leisure_id, events_and_weddings_id, fashion_and_beauty_id, finance_and_insurance_id, food_and_dining_id, health_and_medical_id, home_services_id, legal_services_id, logistics_and_transport_id, manufacturing_and_industry_id, property_and_real_estate_id, religious_and_community_id, shopping_and_retail_id, tourism_and_hospitality_id, other_id
    );

    DROP TABLE _cat_map;
  END IF;

  -- =============================================================
  -- STEP 3: Delete OLD categories
  -- =============================================================
  -- Delete old subcategories first
  DELETE FROM categories WHERE parent_id IS NOT NULL AND parent_id NOT IN (
    agriculture_and_farming_id, auto_services_and_motoring_id, business_services_id, computers_and_technology_id, construction_and_tradesmen_id, education_and_training_id, entertainment_and_leisure_id, events_and_weddings_id, fashion_and_beauty_id, finance_and_insurance_id, food_and_dining_id, health_and_medical_id, home_services_id, legal_services_id, logistics_and_transport_id, manufacturing_and_industry_id, property_and_real_estate_id, religious_and_community_id, shopping_and_retail_id, tourism_and_hospitality_id, other_id
  );

  -- Delete old parent categories
  DELETE FROM categories WHERE parent_id IS NULL AND id NOT IN (
    agriculture_and_farming_id, auto_services_and_motoring_id, business_services_id, computers_and_technology_id, construction_and_tradesmen_id, education_and_training_id, entertainment_and_leisure_id, events_and_weddings_id, fashion_and_beauty_id, finance_and_insurance_id, food_and_dining_id, health_and_medical_id, home_services_id, legal_services_id, logistics_and_transport_id, manufacturing_and_industry_id, property_and_real_estate_id, religious_and_community_id, shopping_and_retail_id, tourism_and_hospitality_id, other_id
  );

  -- =============================================================
  -- STEP 4: Insert NEW subcategories
  -- =============================================================
  -- Agriculture & Farming
  INSERT INTO categories (id, name, slug, parent_id)
  VALUES (gen_random_uuid()::text, 'Agro-chemicals', 'agro-chemicals', agriculture_and_farming_id);
  INSERT INTO categories (id, name, slug, parent_id)
  VALUES (gen_random_uuid()::text, 'Crop Farming', 'crop-farming', agriculture_and_farming_id);
  INSERT INTO categories (id, name, slug, parent_id)
  VALUES (gen_random_uuid()::text, 'Farm Equipment', 'farm-equipment', agriculture_and_farming_id);
  INSERT INTO categories (id, name, slug, parent_id)
  VALUES (gen_random_uuid()::text, 'Farm Produce', 'farm-produce', agriculture_and_farming_id);
  INSERT INTO categories (id, name, slug, parent_id)
  VALUES (gen_random_uuid()::text, 'Fish Farming', 'fish-farming', agriculture_and_farming_id);
  INSERT INTO categories (id, name, slug, parent_id)
  VALUES (gen_random_uuid()::text, 'Fisheries', 'fisheries', agriculture_and_farming_id);
  INSERT INTO categories (id, name, slug, parent_id)
  VALUES (gen_random_uuid()::text, 'Livestock', 'livestock', agriculture_and_farming_id);
  INSERT INTO categories (id, name, slug, parent_id)
  VALUES (gen_random_uuid()::text, 'Poultry', 'poultry', agriculture_and_farming_id);

  -- Auto Services & Motoring
  INSERT INTO categories (id, name, slug, parent_id)
  VALUES (gen_random_uuid()::text, 'Auto Electricians', 'auto-electricians', auto_services_and_motoring_id);
  INSERT INTO categories (id, name, slug, parent_id)
  VALUES (gen_random_uuid()::text, 'Auto Parts & Accessories', 'auto-parts-and-accessories', auto_services_and_motoring_id);
  INSERT INTO categories (id, name, slug, parent_id)
  VALUES (gen_random_uuid()::text, 'Car Rental', 'car-rental', auto_services_and_motoring_id);
  INSERT INTO categories (id, name, slug, parent_id)
  VALUES (gen_random_uuid()::text, 'Car Wash', 'car-wash', auto_services_and_motoring_id);
  INSERT INTO categories (id, name, slug, parent_id)
  VALUES (gen_random_uuid()::text, 'Driving Schools', 'auto-driving-schools', auto_services_and_motoring_id);
  INSERT INTO categories (id, name, slug, parent_id)
  VALUES (gen_random_uuid()::text, 'Mechanics', 'mechanics', auto_services_and_motoring_id);
  INSERT INTO categories (id, name, slug, parent_id)
  VALUES (gen_random_uuid()::text, 'Panel Beaters', 'panel-beaters', auto_services_and_motoring_id);
  INSERT INTO categories (id, name, slug, parent_id)
  VALUES (gen_random_uuid()::text, 'Petrol Stations', 'petrol-stations', auto_services_and_motoring_id);
  INSERT INTO categories (id, name, slug, parent_id)
  VALUES (gen_random_uuid()::text, 'Towing Services', 'towing-services', auto_services_and_motoring_id);
  INSERT INTO categories (id, name, slug, parent_id)
  VALUES (gen_random_uuid()::text, 'Tyre Dealers', 'tyre-dealers', auto_services_and_motoring_id);
  INSERT INTO categories (id, name, slug, parent_id)
  VALUES (gen_random_uuid()::text, 'Vehicle Sales', 'vehicle-sales', auto_services_and_motoring_id);
  INSERT INTO categories (id, name, slug, parent_id)
  VALUES (gen_random_uuid()::text, 'Vulcanizers', 'vulcanizers', auto_services_and_motoring_id);

  -- Business Services
  INSERT INTO categories (id, name, slug, parent_id)
  VALUES (gen_random_uuid()::text, 'Advertising & Marketing', 'advertising-and-marketing', business_services_id);
  INSERT INTO categories (id, name, slug, parent_id)
  VALUES (gen_random_uuid()::text, 'Consultants', 'consultants', business_services_id);
  INSERT INTO categories (id, name, slug, parent_id)
  VALUES (gen_random_uuid()::text, 'Courier & Delivery', 'courier-and-delivery', business_services_id);
  INSERT INTO categories (id, name, slug, parent_id)
  VALUES (gen_random_uuid()::text, 'Dispatch Riders', 'business-dispatch-riders', business_services_id);
  INSERT INTO categories (id, name, slug, parent_id)
  VALUES (gen_random_uuid()::text, 'Human Resources', 'human-resources', business_services_id);
  INSERT INTO categories (id, name, slug, parent_id)
  VALUES (gen_random_uuid()::text, 'Office Services', 'office-services', business_services_id);
  INSERT INTO categories (id, name, slug, parent_id)
  VALUES (gen_random_uuid()::text, 'Printing & Branding', 'printing-and-branding', business_services_id);
  INSERT INTO categories (id, name, slug, parent_id)
  VALUES (gen_random_uuid()::text, 'Public Relations', 'public-relations', business_services_id);
  INSERT INTO categories (id, name, slug, parent_id)
  VALUES (gen_random_uuid()::text, 'Signage & Banners', 'signage-and-banners', business_services_id);
  INSERT INTO categories (id, name, slug, parent_id)
  VALUES (gen_random_uuid()::text, 'Training & Development', 'training-and-development', business_services_id);

  -- Computers & Technology
  INSERT INTO categories (id, name, slug, parent_id)
  VALUES (gen_random_uuid()::text, 'Apps & Software', 'apps-and-software', computers_and_technology_id);
  INSERT INTO categories (id, name, slug, parent_id)
  VALUES (gen_random_uuid()::text, 'CCTV & Security Systems', 'cctv-and-security-systems', computers_and_technology_id);
  INSERT INTO categories (id, name, slug, parent_id)
  VALUES (gen_random_uuid()::text, 'Cloud & Hosting', 'cloud-and-hosting', computers_and_technology_id);
  INSERT INTO categories (id, name, slug, parent_id)
  VALUES (gen_random_uuid()::text, 'Computer Repair', 'computer-repair', computers_and_technology_id);
  INSERT INTO categories (id, name, slug, parent_id)
  VALUES (gen_random_uuid()::text, 'Computer Training', 'computers-computer-training', computers_and_technology_id);
  INSERT INTO categories (id, name, slug, parent_id)
  VALUES (gen_random_uuid()::text, 'Cyber Security', 'cyber-security', computers_and_technology_id);
  INSERT INTO categories (id, name, slug, parent_id)
  VALUES (gen_random_uuid()::text, 'FinTech', 'fintech', computers_and_technology_id);
  INSERT INTO categories (id, name, slug, parent_id)
  VALUES (gen_random_uuid()::text, 'Internet Service Providers', 'internet-service-providers', computers_and_technology_id);
  INSERT INTO categories (id, name, slug, parent_id)
  VALUES (gen_random_uuid()::text, 'Networking', 'networking', computers_and_technology_id);
  INSERT INTO categories (id, name, slug, parent_id)
  VALUES (gen_random_uuid()::text, 'Phone Repair', 'phone-repair', computers_and_technology_id);
  INSERT INTO categories (id, name, slug, parent_id)
  VALUES (gen_random_uuid()::text, 'POS Services', 'pos-services', computers_and_technology_id);
  INSERT INTO categories (id, name, slug, parent_id)
  VALUES (gen_random_uuid()::text, 'Web Design & Development', 'web-design-and-development', computers_and_technology_id);

  -- Construction & Tradesmen
  INSERT INTO categories (id, name, slug, parent_id)
  VALUES (gen_random_uuid()::text, 'Aluminium & Glass', 'aluminium-and-glass', construction_and_tradesmen_id);
  INSERT INTO categories (id, name, slug, parent_id)
  VALUES (gen_random_uuid()::text, 'Architectural Services', 'architectural-services', construction_and_tradesmen_id);
  INSERT INTO categories (id, name, slug, parent_id)
  VALUES (gen_random_uuid()::text, 'Block & Bricks', 'block-and-bricks', construction_and_tradesmen_id);
  INSERT INTO categories (id, name, slug, parent_id)
  VALUES (gen_random_uuid()::text, 'Building Materials', 'building-materials', construction_and_tradesmen_id);
  INSERT INTO categories (id, name, slug, parent_id)
  VALUES (gen_random_uuid()::text, 'Carpentry', 'carpentry', construction_and_tradesmen_id);
  INSERT INTO categories (id, name, slug, parent_id)
  VALUES (gen_random_uuid()::text, 'Concrete & Paving', 'concrete-and-paving', construction_and_tradesmen_id);
  INSERT INTO categories (id, name, slug, parent_id)
  VALUES (gen_random_uuid()::text, 'Contractors', 'contractors', construction_and_tradesmen_id);
  INSERT INTO categories (id, name, slug, parent_id)
  VALUES (gen_random_uuid()::text, 'Decorators & Painters', 'decorators-and-painters', construction_and_tradesmen_id);
  INSERT INTO categories (id, name, slug, parent_id)
  VALUES (gen_random_uuid()::text, 'Electrical Installation', 'electrical-installation', construction_and_tradesmen_id);
  INSERT INTO categories (id, name, slug, parent_id)
  VALUES (gen_random_uuid()::text, 'Plumbers', 'construction-plumbers', construction_and_tradesmen_id);
  INSERT INTO categories (id, name, slug, parent_id)
  VALUES (gen_random_uuid()::text, 'Roofing', 'roofing', construction_and_tradesmen_id);
  INSERT INTO categories (id, name, slug, parent_id)
  VALUES (gen_random_uuid()::text, 'Tiling', 'tiling', construction_and_tradesmen_id);
  INSERT INTO categories (id, name, slug, parent_id)
  VALUES (gen_random_uuid()::text, 'Welding & Fabrication', 'welding-and-fabrication', construction_and_tradesmen_id);

  -- Education & Training
  INSERT INTO categories (id, name, slug, parent_id)
  VALUES (gen_random_uuid()::text, 'After School Programs', 'after-school-programs', education_and_training_id);
  INSERT INTO categories (id, name, slug, parent_id)
  VALUES (gen_random_uuid()::text, 'Computer Training', 'education-computer-training', education_and_training_id);
  INSERT INTO categories (id, name, slug, parent_id)
  VALUES (gen_random_uuid()::text, 'Crèches & Daycare', 'creches-and-daycare', education_and_training_id);
  INSERT INTO categories (id, name, slug, parent_id)
  VALUES (gen_random_uuid()::text, 'Driving Schools', 'education-driving-schools', education_and_training_id);
  INSERT INTO categories (id, name, slug, parent_id)
  VALUES (gen_random_uuid()::text, 'Language Schools', 'language-schools', education_and_training_id);
  INSERT INTO categories (id, name, slug, parent_id)
  VALUES (gen_random_uuid()::text, 'Lesson Teachers & Tutoring', 'lesson-teachers-and-tutoring', education_and_training_id);
  INSERT INTO categories (id, name, slug, parent_id)
  VALUES (gen_random_uuid()::text, 'Schools & Colleges', 'schools-and-colleges', education_and_training_id);
  INSERT INTO categories (id, name, slug, parent_id)
  VALUES (gen_random_uuid()::text, 'Universities', 'universities', education_and_training_id);
  INSERT INTO categories (id, name, slug, parent_id)
  VALUES (gen_random_uuid()::text, 'Vocational Training', 'vocational-training', education_and_training_id);

  -- Entertainment & Leisure
  INSERT INTO categories (id, name, slug, parent_id)
  VALUES (gen_random_uuid()::text, 'Amusement & Game Centres', 'amusement-and-game-centres', entertainment_and_leisure_id);
  INSERT INTO categories (id, name, slug, parent_id)
  VALUES (gen_random_uuid()::text, 'Arts & Crafts', 'arts-and-crafts', entertainment_and_leisure_id);
  INSERT INTO categories (id, name, slug, parent_id)
  VALUES (gen_random_uuid()::text, 'Cinemas', 'cinemas', entertainment_and_leisure_id);
  INSERT INTO categories (id, name, slug, parent_id)
  VALUES (gen_random_uuid()::text, 'Clubs & Lounges', 'clubs-and-lounges', entertainment_and_leisure_id);
  INSERT INTO categories (id, name, slug, parent_id)
  VALUES (gen_random_uuid()::text, 'Music & DJs', 'music-and-djs', entertainment_and_leisure_id);
  INSERT INTO categories (id, name, slug, parent_id)
  VALUES (gen_random_uuid()::text, 'Recreation & Sports', 'recreation-and-sports', entertainment_and_leisure_id);
  INSERT INTO categories (id, name, slug, parent_id)
  VALUES (gen_random_uuid()::text, 'Streaming & Content', 'streaming-and-content', entertainment_and_leisure_id);

  -- Events & Weddings
  INSERT INTO categories (id, name, slug, parent_id)
  VALUES (gen_random_uuid()::text, 'Caterers', 'caterers', events_and_weddings_id);
  INSERT INTO categories (id, name, slug, parent_id)
  VALUES (gen_random_uuid()::text, 'Decorators', 'decorators', events_and_weddings_id);
  INSERT INTO categories (id, name, slug, parent_id)
  VALUES (gen_random_uuid()::text, 'DJs & MCs', 'djs-and-mcs', events_and_weddings_id);
  INSERT INTO categories (id, name, slug, parent_id)
  VALUES (gen_random_uuid()::text, 'Event Equipment Rental', 'event-equipment-rental', events_and_weddings_id);
  INSERT INTO categories (id, name, slug, parent_id)
  VALUES (gen_random_uuid()::text, 'Event Planners', 'event-planners', events_and_weddings_id);
  INSERT INTO categories (id, name, slug, parent_id)
  VALUES (gen_random_uuid()::text, 'Photographers', 'photographers', events_and_weddings_id);
  INSERT INTO categories (id, name, slug, parent_id)
  VALUES (gen_random_uuid()::text, 'Venues & Event Halls', 'venues-and-event-halls', events_and_weddings_id);
  INSERT INTO categories (id, name, slug, parent_id)
  VALUES (gen_random_uuid()::text, 'Videographers', 'videographers', events_and_weddings_id);
  INSERT INTO categories (id, name, slug, parent_id)
  VALUES (gen_random_uuid()::text, 'Wedding Services', 'wedding-services', events_and_weddings_id);

  -- Fashion & Beauty
  INSERT INTO categories (id, name, slug, parent_id)
  VALUES (gen_random_uuid()::text, 'Barber Shops', 'barber-shops', fashion_and_beauty_id);
  INSERT INTO categories (id, name, slug, parent_id)
  VALUES (gen_random_uuid()::text, 'Beauty Products', 'beauty-products', fashion_and_beauty_id);
  INSERT INTO categories (id, name, slug, parent_id)
  VALUES (gen_random_uuid()::text, 'Cosmetics', 'cosmetics', fashion_and_beauty_id);
  INSERT INTO categories (id, name, slug, parent_id)
  VALUES (gen_random_uuid()::text, 'Fabric Stores', 'fabric-stores', fashion_and_beauty_id);
  INSERT INTO categories (id, name, slug, parent_id)
  VALUES (gen_random_uuid()::text, 'Fashion Designers', 'fashion-designers', fashion_and_beauty_id);
  INSERT INTO categories (id, name, slug, parent_id)
  VALUES (gen_random_uuid()::text, 'Hair Salons', 'hair-salons', fashion_and_beauty_id);
  INSERT INTO categories (id, name, slug, parent_id)
  VALUES (gen_random_uuid()::text, 'Jewellery', 'jewellery', fashion_and_beauty_id);
  INSERT INTO categories (id, name, slug, parent_id)
  VALUES (gen_random_uuid()::text, 'Makeup Artists', 'makeup-artists', fashion_and_beauty_id);
  INSERT INTO categories (id, name, slug, parent_id)
  VALUES (gen_random_uuid()::text, 'Nail Studios', 'nail-studios', fashion_and_beauty_id);
  INSERT INTO categories (id, name, slug, parent_id)
  VALUES (gen_random_uuid()::text, 'Shoe Makers', 'shoe-makers', fashion_and_beauty_id);
  INSERT INTO categories (id, name, slug, parent_id)
  VALUES (gen_random_uuid()::text, 'Tailors & Alterations', 'tailors-and-alterations', fashion_and_beauty_id);

  -- Finance & Insurance
  INSERT INTO categories (id, name, slug, parent_id)
  VALUES (gen_random_uuid()::text, 'Accountants & Auditors', 'accountants-and-auditors', finance_and_insurance_id);
  INSERT INTO categories (id, name, slug, parent_id)
  VALUES (gen_random_uuid()::text, 'Banks & Microfinance', 'banks-and-microfinance', finance_and_insurance_id);
  INSERT INTO categories (id, name, slug, parent_id)
  VALUES (gen_random_uuid()::text, 'Crowdfunding & Investment', 'crowdfunding-and-investment', finance_and_insurance_id);
  INSERT INTO categories (id, name, slug, parent_id)
  VALUES (gen_random_uuid()::text, 'Insurance Agents', 'insurance-agents', finance_and_insurance_id);
  INSERT INTO categories (id, name, slug, parent_id)
  VALUES (gen_random_uuid()::text, 'Mobile Money & POS', 'mobile-money-and-pos', finance_and_insurance_id);
  INSERT INTO categories (id, name, slug, parent_id)
  VALUES (gen_random_uuid()::text, 'Payroll Services', 'payroll-services', finance_and_insurance_id);
  INSERT INTO categories (id, name, slug, parent_id)
  VALUES (gen_random_uuid()::text, 'Tax Consultants', 'tax-consultants', finance_and_insurance_id);

  -- Food & Dining
  INSERT INTO categories (id, name, slug, parent_id)
  VALUES (gen_random_uuid()::text, 'Bakeries', 'bakeries', food_and_dining_id);
  INSERT INTO categories (id, name, slug, parent_id)
  VALUES (gen_random_uuid()::text, 'Cafes & Coffee Shops', 'cafes-and-coffee-shops', food_and_dining_id);
  INSERT INTO categories (id, name, slug, parent_id)
  VALUES (gen_random_uuid()::text, 'Catering Services', 'catering-services', food_and_dining_id);
  INSERT INTO categories (id, name, slug, parent_id)
  VALUES (gen_random_uuid()::text, 'Fast Food & Takeaway', 'fast-food-and-takeaway', food_and_dining_id);
  INSERT INTO categories (id, name, slug, parent_id)
  VALUES (gen_random_uuid()::text, 'Food Manufacturing', 'food-manufacturing', food_and_dining_id);
  INSERT INTO categories (id, name, slug, parent_id)
  VALUES (gen_random_uuid()::text, 'Food Vendors & Bukka', 'food-vendors-and-bukka', food_and_dining_id);
  INSERT INTO categories (id, name, slug, parent_id)
  VALUES (gen_random_uuid()::text, 'Restaurants', 'restaurants', food_and_dining_id);
  INSERT INTO categories (id, name, slug, parent_id)
  VALUES (gen_random_uuid()::text, 'Suya & Grills', 'suya-and-grills', food_and_dining_id);
  INSERT INTO categories (id, name, slug, parent_id)
  VALUES (gen_random_uuid()::text, 'Supermarkets & Provision Stores', 'supermarkets-and-provision-stores', food_and_dining_id);
  INSERT INTO categories (id, name, slug, parent_id)
  VALUES (gen_random_uuid()::text, 'Wine & Drinks', 'wine-and-drinks', food_and_dining_id);

  -- Health & Medical
  INSERT INTO categories (id, name, slug, parent_id)
  VALUES (gen_random_uuid()::text, 'Clinics & Hospitals', 'clinics-and-hospitals', health_and_medical_id);
  INSERT INTO categories (id, name, slug, parent_id)
  VALUES (gen_random_uuid()::text, 'Dentists', 'dentists', health_and_medical_id);
  INSERT INTO categories (id, name, slug, parent_id)
  VALUES (gen_random_uuid()::text, 'Diagnostics & Labs', 'diagnostics-and-labs', health_and_medical_id);
  INSERT INTO categories (id, name, slug, parent_id)
  VALUES (gen_random_uuid()::text, 'Doctors', 'doctors', health_and_medical_id);
  INSERT INTO categories (id, name, slug, parent_id)
  VALUES (gen_random_uuid()::text, 'Gyms & Fitness', 'gyms-and-fitness', health_and_medical_id);
  INSERT INTO categories (id, name, slug, parent_id)
  VALUES (gen_random_uuid()::text, 'Mental Health', 'mental-health', health_and_medical_id);
  INSERT INTO categories (id, name, slug, parent_id)
  VALUES (gen_random_uuid()::text, 'Nursing & Home Care', 'nursing-and-home-care', health_and_medical_id);
  INSERT INTO categories (id, name, slug, parent_id)
  VALUES (gen_random_uuid()::text, 'Opticians', 'opticians', health_and_medical_id);
  INSERT INTO categories (id, name, slug, parent_id)
  VALUES (gen_random_uuid()::text, 'Pharmacies', 'pharmacies', health_and_medical_id);
  INSERT INTO categories (id, name, slug, parent_id)
  VALUES (gen_random_uuid()::text, 'Spa & Massage', 'spa-and-massage', health_and_medical_id);
  INSERT INTO categories (id, name, slug, parent_id)
  VALUES (gen_random_uuid()::text, 'Traditional & Alternative Medicine', 'traditional-and-alternative-medicine', health_and_medical_id);
  INSERT INTO categories (id, name, slug, parent_id)
  VALUES (gen_random_uuid()::text, 'Veterinary', 'veterinary', health_and_medical_id);

  -- Home Services
  INSERT INTO categories (id, name, slug, parent_id)
  VALUES (gen_random_uuid()::text, 'AC Repair & Installation', 'ac-repair-and-installation', home_services_id);
  INSERT INTO categories (id, name, slug, parent_id)
  VALUES (gen_random_uuid()::text, 'Cleaners & Housekeeping', 'cleaners-and-housekeeping', home_services_id);
  INSERT INTO categories (id, name, slug, parent_id)
  VALUES (gen_random_uuid()::text, 'Electricians', 'electricians', home_services_id);
  INSERT INTO categories (id, name, slug, parent_id)
  VALUES (gen_random_uuid()::text, 'Fumigation & Pest Control', 'fumigation-and-pest-control', home_services_id);
  INSERT INTO categories (id, name, slug, parent_id)
  VALUES (gen_random_uuid()::text, 'Gardeners & Landscaping', 'gardeners-and-landscaping', home_services_id);
  INSERT INTO categories (id, name, slug, parent_id)
  VALUES (gen_random_uuid()::text, 'Interior Design', 'interior-design', home_services_id);
  INSERT INTO categories (id, name, slug, parent_id)
  VALUES (gen_random_uuid()::text, 'Laundry & Dry Cleaning', 'laundry-and-dry-cleaning', home_services_id);
  INSERT INTO categories (id, name, slug, parent_id)
  VALUES (gen_random_uuid()::text, 'Locksmiths', 'locksmiths', home_services_id);
  INSERT INTO categories (id, name, slug, parent_id)
  VALUES (gen_random_uuid()::text, 'Painters', 'painters', home_services_id);
  INSERT INTO categories (id, name, slug, parent_id)
  VALUES (gen_random_uuid()::text, 'Plumbers', 'home-plumbers', home_services_id);
  INSERT INTO categories (id, name, slug, parent_id)
  VALUES (gen_random_uuid()::text, 'Waste Disposal', 'waste-disposal', home_services_id);

  -- Legal Services
  INSERT INTO categories (id, name, slug, parent_id)
  VALUES (gen_random_uuid()::text, 'Corporate Law', 'corporate-law', legal_services_id);
  INSERT INTO categories (id, name, slug, parent_id)
  VALUES (gen_random_uuid()::text, 'Family Law', 'family-law', legal_services_id);
  INSERT INTO categories (id, name, slug, parent_id)
  VALUES (gen_random_uuid()::text, 'Immigration & Visa', 'immigration-and-visa', legal_services_id);
  INSERT INTO categories (id, name, slug, parent_id)
  VALUES (gen_random_uuid()::text, 'Lawyers & Solicitors', 'lawyers-and-solicitors', legal_services_id);
  INSERT INTO categories (id, name, slug, parent_id)
  VALUES (gen_random_uuid()::text, 'Notary Public', 'notary-public', legal_services_id);
  INSERT INTO categories (id, name, slug, parent_id)
  VALUES (gen_random_uuid()::text, 'Property Law', 'property-law', legal_services_id);

  -- Logistics & Transport
  INSERT INTO categories (id, name, slug, parent_id)
  VALUES (gen_random_uuid()::text, 'Air Freight', 'air-freight', logistics_and_transport_id);
  INSERT INTO categories (id, name, slug, parent_id)
  VALUES (gen_random_uuid()::text, 'Bus & Public Transport', 'bus-and-public-transport', logistics_and_transport_id);
  INSERT INTO categories (id, name, slug, parent_id)
  VALUES (gen_random_uuid()::text, 'Cargo & Shipping', 'cargo-and-shipping', logistics_and_transport_id);
  INSERT INTO categories (id, name, slug, parent_id)
  VALUES (gen_random_uuid()::text, 'Courier Services', 'courier-services', logistics_and_transport_id);
  INSERT INTO categories (id, name, slug, parent_id)
  VALUES (gen_random_uuid()::text, 'Dispatch Riders', 'logistics-dispatch-riders', logistics_and_transport_id);
  INSERT INTO categories (id, name, slug, parent_id)
  VALUES (gen_random_uuid()::text, 'Haulage & Trucking', 'haulage-and-trucking', logistics_and_transport_id);
  INSERT INTO categories (id, name, slug, parent_id)
  VALUES (gen_random_uuid()::text, 'Moving & Relocation', 'moving-and-relocation', logistics_and_transport_id);
  INSERT INTO categories (id, name, slug, parent_id)
  VALUES (gen_random_uuid()::text, 'Taxis & Ride-Hailing', 'taxis-and-ride-hailing', logistics_and_transport_id);
  INSERT INTO categories (id, name, slug, parent_id)
  VALUES (gen_random_uuid()::text, 'Warehousing', 'warehousing', logistics_and_transport_id);

  -- Manufacturing & Industry
  INSERT INTO categories (id, name, slug, parent_id)
  VALUES (gen_random_uuid()::text, 'Chemicals', 'chemicals', manufacturing_and_industry_id);
  INSERT INTO categories (id, name, slug, parent_id)
  VALUES (gen_random_uuid()::text, 'Electrical Equipment', 'electrical-equipment', manufacturing_and_industry_id);
  INSERT INTO categories (id, name, slug, parent_id)
  VALUES (gen_random_uuid()::text, 'Energy & Power', 'energy-and-power', manufacturing_and_industry_id);
  INSERT INTO categories (id, name, slug, parent_id)
  VALUES (gen_random_uuid()::text, 'Engineering Services', 'engineering-services', manufacturing_and_industry_id);
  INSERT INTO categories (id, name, slug, parent_id)
  VALUES (gen_random_uuid()::text, 'Food Processing', 'food-processing', manufacturing_and_industry_id);
  INSERT INTO categories (id, name, slug, parent_id)
  VALUES (gen_random_uuid()::text, 'Furniture Manufacturing', 'furniture-manufacturing', manufacturing_and_industry_id);
  INSERT INTO categories (id, name, slug, parent_id)
  VALUES (gen_random_uuid()::text, 'Industrial Equipment', 'industrial-equipment', manufacturing_and_industry_id);
  INSERT INTO categories (id, name, slug, parent_id)
  VALUES (gen_random_uuid()::text, 'Oil & Gas', 'oil-and-gas', manufacturing_and_industry_id);
  INSERT INTO categories (id, name, slug, parent_id)
  VALUES (gen_random_uuid()::text, 'Packaging', 'packaging', manufacturing_and_industry_id);
  INSERT INTO categories (id, name, slug, parent_id)
  VALUES (gen_random_uuid()::text, 'Plastics & Rubber', 'plastics-and-rubber', manufacturing_and_industry_id);
  INSERT INTO categories (id, name, slug, parent_id)
  VALUES (gen_random_uuid()::text, 'Steel & Metal Works', 'steel-and-metal-works', manufacturing_and_industry_id);
  INSERT INTO categories (id, name, slug, parent_id)
  VALUES (gen_random_uuid()::text, 'Textiles', 'textiles', manufacturing_and_industry_id);
  INSERT INTO categories (id, name, slug, parent_id)
  VALUES (gen_random_uuid()::text, 'Water Treatment', 'water-treatment', manufacturing_and_industry_id);

  -- Property & Real Estate
  INSERT INTO categories (id, name, slug, parent_id)
  VALUES (gen_random_uuid()::text, 'Commercial Property', 'commercial-property', property_and_real_estate_id);
  INSERT INTO categories (id, name, slug, parent_id)
  VALUES (gen_random_uuid()::text, 'Coworking Spaces', 'coworking-spaces', property_and_real_estate_id);
  INSERT INTO categories (id, name, slug, parent_id)
  VALUES (gen_random_uuid()::text, 'Estate Agents', 'estate-agents', property_and_real_estate_id);
  INSERT INTO categories (id, name, slug, parent_id)
  VALUES (gen_random_uuid()::text, 'Facility Management', 'facility-management', property_and_real_estate_id);
  INSERT INTO categories (id, name, slug, parent_id)
  VALUES (gen_random_uuid()::text, 'Land Agents', 'land-agents', property_and_real_estate_id);
  INSERT INTO categories (id, name, slug, parent_id)
  VALUES (gen_random_uuid()::text, 'Property Development', 'property-development', property_and_real_estate_id);
  INSERT INTO categories (id, name, slug, parent_id)
  VALUES (gen_random_uuid()::text, 'Property Management', 'property-management', property_and_real_estate_id);
  INSERT INTO categories (id, name, slug, parent_id)
  VALUES (gen_random_uuid()::text, 'Short-Let Apartments', 'short-let-apartments', property_and_real_estate_id);

  -- Religious & Community
  INSERT INTO categories (id, name, slug, parent_id)
  VALUES (gen_random_uuid()::text, 'Charity & NGOs', 'charity-and-ngos', religious_and_community_id);
  INSERT INTO categories (id, name, slug, parent_id)
  VALUES (gen_random_uuid()::text, 'Churches', 'churches', religious_and_community_id);
  INSERT INTO categories (id, name, slug, parent_id)
  VALUES (gen_random_uuid()::text, 'Community Centres', 'community-centres', religious_and_community_id);
  INSERT INTO categories (id, name, slug, parent_id)
  VALUES (gen_random_uuid()::text, 'Counselling', 'counselling', religious_and_community_id);
  INSERT INTO categories (id, name, slug, parent_id)
  VALUES (gen_random_uuid()::text, 'Mosques', 'mosques', religious_and_community_id);
  INSERT INTO categories (id, name, slug, parent_id)
  VALUES (gen_random_uuid()::text, 'Youth Organizations', 'youth-organizations', religious_and_community_id);

  -- Shopping & Retail
  INSERT INTO categories (id, name, slug, parent_id)
  VALUES (gen_random_uuid()::text, 'Baby & Kids Stores', 'baby-and-kids-stores', shopping_and_retail_id);
  INSERT INTO categories (id, name, slug, parent_id)
  VALUES (gen_random_uuid()::text, 'Books & Stationery', 'books-and-stationery', shopping_and_retail_id);
  INSERT INTO categories (id, name, slug, parent_id)
  VALUES (gen_random_uuid()::text, 'Clothing & Accessories', 'clothing-and-accessories', shopping_and_retail_id);
  INSERT INTO categories (id, name, slug, parent_id)
  VALUES (gen_random_uuid()::text, 'Electronics & Gadgets', 'electronics-and-gadgets', shopping_and_retail_id);
  INSERT INTO categories (id, name, slug, parent_id)
  VALUES (gen_random_uuid()::text, 'Gift Shops', 'gift-shops', shopping_and_retail_id);
  INSERT INTO categories (id, name, slug, parent_id)
  VALUES (gen_random_uuid()::text, 'Hardware Stores', 'hardware-stores', shopping_and_retail_id);
  INSERT INTO categories (id, name, slug, parent_id)
  VALUES (gen_random_uuid()::text, 'Home & Garden', 'home-and-garden', shopping_and_retail_id);
  INSERT INTO categories (id, name, slug, parent_id)
  VALUES (gen_random_uuid()::text, 'Mobile Phone Shops', 'mobile-phone-shops', shopping_and_retail_id);
  INSERT INTO categories (id, name, slug, parent_id)
  VALUES (gen_random_uuid()::text, 'Online Stores', 'online-stores', shopping_and_retail_id);
  INSERT INTO categories (id, name, slug, parent_id)
  VALUES (gen_random_uuid()::text, 'Provision Stores', 'provision-stores', shopping_and_retail_id);
  INSERT INTO categories (id, name, slug, parent_id)
  VALUES (gen_random_uuid()::text, 'Supermarkets', 'supermarkets', shopping_and_retail_id);
  INSERT INTO categories (id, name, slug, parent_id)
  VALUES (gen_random_uuid()::text, 'Wholesale', 'wholesale', shopping_and_retail_id);

  -- Tourism & Hospitality
  INSERT INTO categories (id, name, slug, parent_id)
  VALUES (gen_random_uuid()::text, 'Apartments & Guest Houses', 'apartments-and-guest-houses', tourism_and_hospitality_id);
  INSERT INTO categories (id, name, slug, parent_id)
  VALUES (gen_random_uuid()::text, 'Attractions & Sightseeing', 'attractions-and-sightseeing', tourism_and_hospitality_id);
  INSERT INTO categories (id, name, slug, parent_id)
  VALUES (gen_random_uuid()::text, 'Bed & Breakfast', 'bed-and-breakfast', tourism_and_hospitality_id);
  INSERT INTO categories (id, name, slug, parent_id)
  VALUES (gen_random_uuid()::text, 'Holiday Homes', 'holiday-homes', tourism_and_hospitality_id);
  INSERT INTO categories (id, name, slug, parent_id)
  VALUES (gen_random_uuid()::text, 'Hotels & Resorts', 'hotels-and-resorts', tourism_and_hospitality_id);
  INSERT INTO categories (id, name, slug, parent_id)
  VALUES (gen_random_uuid()::text, 'Tour Operators', 'tour-operators', tourism_and_hospitality_id);
  INSERT INTO categories (id, name, slug, parent_id)
  VALUES (gen_random_uuid()::text, 'Travel Agents', 'travel-agents', tourism_and_hospitality_id);
  INSERT INTO categories (id, name, slug, parent_id)
  VALUES (gen_random_uuid()::text, 'Visa Services', 'visa-services', tourism_and_hospitality_id);

END $$;