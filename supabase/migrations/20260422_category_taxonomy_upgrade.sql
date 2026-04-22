-- Migration: Upgrade Category Taxonomy
-- Date: 2026-04-22
-- Description: Replaces existing category system with new hybrid taxonomy
--   (21 parents, 193 subcategories) that is more granular and better organized
--   for Nigeria's diverse business landscape.
--
-- IMPORTANT: Run this in Supabase SQL Editor. It will:
--   1. Map existing businesses to new categories where possible
--   2. Delete ALL existing categories
--   3. Insert 21 new parent categories
--   4. Insert 193 new subcategories

DO $$
DECLARE
  agriculture_farming_id TEXT := gen_random_uuid()::text;
  auto_services_motoring_id TEXT := gen_random_uuid()::text;
  business_services_id TEXT := gen_random_uuid()::text;
  computers_technology_id TEXT := gen_random_uuid()::text;
  construction_tradesmen_id TEXT := gen_random_uuid()::text;
  education_training_id TEXT := gen_random_uuid()::text;
  entertainment_leisure_id TEXT := gen_random_uuid()::text;
  events_weddings_id TEXT := gen_random_uuid()::text;
  fashion_beauty_id TEXT := gen_random_uuid()::text;
  finance_insurance_id TEXT := gen_random_uuid()::text;
  food_dining_id TEXT := gen_random_uuid()::text;
  health_medical_id TEXT := gen_random_uuid()::text;
  home_services_id TEXT := gen_random_uuid()::text;
  legal_services_id TEXT := gen_random_uuid()::text;
  logistics_transport_id TEXT := gen_random_uuid()::text;
  manufacturing_industry_id TEXT := gen_random_uuid()::text;
  property_real_estate_id TEXT := gen_random_uuid()::text;
  religious_community_id TEXT := gen_random_uuid()::text;
  shopping_retail_id TEXT := gen_random_uuid()::text;
  tourism_hospitality_id TEXT := gen_random_uuid()::text;
  other_id TEXT := gen_random_uuid()::text;
  biz_count INTEGER;
BEGIN

  -- =============================================================
  -- STEP 1: Map existing businesses to new category IDs
  -- =============================================================
  SELECT COUNT(*) INTO biz_count FROM businesses;

  IF biz_count > 0 THEN
    CREATE TEMP TABLE _cat_map (old_slug TEXT, new_id TEXT);
    INSERT INTO _cat_map (old_slug, new_id) VALUES
      ('hair-beauty', fashion_beauty_id),
      ('fashion-style', fashion_beauty_id),
      ('food-restaurants', food_dining_id),
      ('events-celebrations', events_weddings_id),
      ('photography', events_weddings_id),
      ('health-wellness', health_medical_id),
      ('education-training', education_training_id),
      ('home-services', home_services_id),
      ('auto-services', auto_services_motoring_id),
      ('technology-it', computers_technology_id),
      ('real-estate', property_real_estate_id),
      ('legal-finance', finance_insurance_id),
      ('logistics-transport', logistics_transport_id),
      ('agriculture-farming', agriculture_farming_id),
      ('printing-branding', business_services_id),
      ('laundry-dry-cleaning', home_services_id),
      ('supermarkets-retail', shopping_retail_id),
      ('religious-spiritual', religious_community_id),
      ('entertainment-leisure', entertainment_leisure_id),
      ('childcare-parenting', education_training_id),
      ('other', other_id);

    -- Map businesses on parent categories
    UPDATE businesses b
    SET category_id = m.new_id
    FROM categories c
    JOIN _cat_map m ON c.slug = m.old_slug
    WHERE b.category_id = c.id AND c.parent_id IS NULL;

    -- Map businesses on subcategories (via parent slug)
    UPDATE businesses b
    SET category_id = m.new_id
    FROM categories c
    JOIN categories p ON c.parent_id = p.id
    JOIN _cat_map m ON p.slug = m.old_slug
    WHERE b.category_id = c.id AND c.parent_id IS NOT NULL;

    -- Unmapped businesses go to "Other"
    UPDATE businesses SET category_id = other_id
    WHERE category_id NOT IN (
      agriculture_farming_id, auto_services_motoring_id, business_services_id, computers_technology_id, construction_tradesmen_id, education_training_id, entertainment_leisure_id, events_weddings_id, fashion_beauty_id, finance_insurance_id, food_dining_id, health_medical_id, home_services_id, legal_services_id, logistics_transport_id, manufacturing_industry_id, property_real_estate_id, religious_community_id, shopping_retail_id, tourism_hospitality_id, other_id
    );

    DROP TABLE IF EXISTS _cat_map;
  END IF;

  -- =============================================================
  -- STEP 2: Delete ALL existing categories
  -- =============================================================
  DELETE FROM categories WHERE parent_id IS NOT NULL;
  DELETE FROM categories WHERE parent_id IS NULL;

  -- =============================================================
  -- STEP 3: Insert 21 parent categories
  -- =============================================================
  INSERT INTO categories (id, slug, name, icon, description, parent_id, seo_title_template, seo_description_template)
  VALUES
    (agriculture_farming_id, 'agriculture-farming', 'Agriculture & Farming', '🌾', 'Farm produce, poultry, fish farming, agro-chemicals and farm equipment across Nigeria', NULL, '{name} - Agriculture & Farming in {area} | MyHustle', 'Find {name} for agriculture & farming in {area}. Read reviews and book on MyHustle.'),
    (auto_services_motoring_id, 'auto-services-motoring', 'Auto Services & Motoring', '🚗', 'Mechanics, car wash, auto electricians, panel beaters and tyre services across Nigeria', NULL, '{name} - Auto Services & Motoring in {area} | MyHustle', 'Find {name} for auto services & motoring in {area}. Read reviews and book on MyHustle.'),
    (business_services_id, 'business-services', 'Business Services', '💼', 'Advertising, consulting, printing, branding and office services across Nigeria', NULL, '{name} - Business Services in {area} | MyHustle', 'Find {name} for business services in {area}. Read reviews and book on MyHustle.'),
    (computers_technology_id, 'computers-technology', 'Computers & Technology', '💻', 'Phone repair, computer repair, web design, CCTV installation and networking across Nigeria', NULL, '{name} - Computers & Technology in {area} | MyHustle', 'Find {name} for computers & technology in {area}. Read reviews and book on MyHustle.'),
    (construction_tradesmen_id, 'construction-tradesmen', 'Construction & Tradesmen', '🏗️', 'Building contractors, carpenters, welders, roofers and construction materials across Nigeria', NULL, '{name} - Construction & Tradesmen in {area} | MyHustle', 'Find {name} for construction & tradesmen in {area}. Read reviews and book on MyHustle.'),
    (education_training_id, 'education-training', 'Education & Training', '📚', 'Schools, tutorial centres, driving schools, computer training and vocational institutes across Nigeria', NULL, '{name} - Education & Training in {area} | MyHustle', 'Find {name} for education & training in {area}. Read reviews and book on MyHustle.'),
    (entertainment_leisure_id, 'entertainment-leisure', 'Entertainment & Leisure', '🎭', 'Lounges, clubs, game centres, cinemas and recreation across Nigeria', NULL, '{name} - Entertainment & Leisure in {area} | MyHustle', 'Find {name} for entertainment & leisure in {area}. Read reviews and book on MyHustle.'),
    (events_weddings_id, 'events-weddings', 'Events & Weddings', '💒', 'Event planners, caterers, photographers, DJs and wedding services across Nigeria', NULL, '{name} - Events & Weddings in {area} | MyHustle', 'Find {name} for events & weddings in {area}. Read reviews and book on MyHustle.'),
    (fashion_beauty_id, 'fashion-beauty', 'Fashion & Beauty', '💇', 'Hair salons, barbers, fashion designers, tailors and beauty services across Nigeria', NULL, '{name} - Fashion & Beauty in {area} | MyHustle', 'Find {name} for fashion & beauty in {area}. Read reviews and book on MyHustle.'),
    (finance_insurance_id, 'finance-insurance', 'Finance & Insurance', '💰', 'Accountants, banks, insurance agents, tax consultants and financial services across Nigeria', NULL, '{name} - Finance & Insurance in {area} | MyHustle', 'Find {name} for finance & insurance in {area}. Read reviews and book on MyHustle.'),
    (food_dining_id, 'food-dining', 'Food & Dining', '🍽️', 'Restaurants, bakeries, fast food, catering and food vendors across Nigeria', NULL, '{name} - Food & Dining in {area} | MyHustle', 'Find {name} for food & dining in {area}. Read reviews and book on MyHustle.'),
    (health_medical_id, 'health-medical', 'Health & Medical', '🏥', 'Hospitals, clinics, pharmacies, dentists, gyms and wellness services across Nigeria', NULL, '{name} - Health & Medical in {area} | MyHustle', 'Find {name} for health & medical in {area}. Read reviews and book on MyHustle.'),
    (home_services_id, 'home-services', 'Home Services', '🏠', 'Plumbers, electricians, cleaners, painters and home maintenance across Nigeria', NULL, '{name} - Home Services in {area} | MyHustle', 'Find {name} for home services in {area}. Read reviews and book on MyHustle.'),
    (legal_services_id, 'legal-services', 'Legal Services', '⚖️', 'Lawyers, solicitors, notary public and legal advisory services across Nigeria', NULL, '{name} - Legal Services in {area} | MyHustle', 'Find {name} for legal services in {area}. Read reviews and book on MyHustle.'),
    (logistics_transport_id, 'logistics-transport', 'Logistics & Transport', '🚚', 'Dispatch riders, moving services, haulage, courier and shipping across Nigeria', NULL, '{name} - Logistics & Transport in {area} | MyHustle', 'Find {name} for logistics & transport in {area}. Read reviews and book on MyHustle.'),
    (manufacturing_industry_id, 'manufacturing-industry', 'Manufacturing & Industry', '🏭', 'Factories, processing plants, engineering and industrial services across Nigeria', NULL, '{name} - Manufacturing & Industry in {area} | MyHustle', 'Find {name} for manufacturing & industry in {area}. Read reviews and book on MyHustle.'),
    (property_real_estate_id, 'property-real-estate', 'Property & Real Estate', '🏘️', 'Estate agents, property management, short-let apartments and land agents across Nigeria', NULL, '{name} - Property & Real Estate in {area} | MyHustle', 'Find {name} for property & real estate in {area}. Read reviews and book on MyHustle.'),
    (religious_community_id, 'religious-community', 'Religious & Community', '⛪', 'Churches, mosques, community centres and counselling services across Nigeria', NULL, '{name} - Religious & Community in {area} | MyHustle', 'Find {name} for religious & community in {area}. Read reviews and book on MyHustle.'),
    (shopping_retail_id, 'shopping-retail', 'Shopping & Retail', '🛒', 'Supermarkets, electronics, clothing, hardware and retail stores across Nigeria', NULL, '{name} - Shopping & Retail in {area} | MyHustle', 'Find {name} for shopping & retail in {area}. Read reviews and book on MyHustle.'),
    (tourism_hospitality_id, 'tourism-hospitality', 'Tourism & Hospitality', '✈️', 'Hotels, resorts, travel agents, tour operators and holiday homes across Nigeria', NULL, '{name} - Tourism & Hospitality in {area} | MyHustle', 'Find {name} for tourism & hospitality in {area}. Read reviews and book on MyHustle.'),
    (other_id, 'other', 'Other', '📦', 'Other businesses and services across Nigeria', NULL, '{name} - Other in {area} | MyHustle', 'Find {name} for other in {area}. Read reviews and book on MyHustle.');

  -- =============================================================
  -- STEP 4: Insert 193 subcategories
  -- =============================================================

  -- Agriculture & Farming (8 subcategories)
  INSERT INTO categories (id, slug, name, icon, description, parent_id, seo_title_template, seo_description_template)
  VALUES
    (gen_random_uuid()::text, 'agro-chemicals', 'Agro-chemicals', NULL, 'Agro-chemicals services across Nigeria', agriculture_farming_id, NULL, NULL),
    (gen_random_uuid()::text, 'crop-farming', 'Crop Farming', NULL, 'Crop Farming services across Nigeria', agriculture_farming_id, NULL, NULL),
    (gen_random_uuid()::text, 'farm-equipment', 'Farm Equipment', NULL, 'Farm Equipment services across Nigeria', agriculture_farming_id, NULL, NULL),
    (gen_random_uuid()::text, 'farm-produce', 'Farm Produce', NULL, 'Farm Produce services across Nigeria', agriculture_farming_id, NULL, NULL),
    (gen_random_uuid()::text, 'fish-farming', 'Fish Farming', NULL, 'Fish Farming services across Nigeria', agriculture_farming_id, NULL, NULL),
    (gen_random_uuid()::text, 'fisheries', 'Fisheries', NULL, 'Fisheries services across Nigeria', agriculture_farming_id, NULL, NULL),
    (gen_random_uuid()::text, 'livestock', 'Livestock', NULL, 'Livestock services across Nigeria', agriculture_farming_id, NULL, NULL),
    (gen_random_uuid()::text, 'poultry', 'Poultry', NULL, 'Poultry services across Nigeria', agriculture_farming_id, NULL, NULL);

  -- Auto Services & Motoring (12 subcategories)
  INSERT INTO categories (id, slug, name, icon, description, parent_id, seo_title_template, seo_description_template)
  VALUES
    (gen_random_uuid()::text, 'auto-electricians', 'Auto Electricians', NULL, 'Auto Electricians services across Nigeria', auto_services_motoring_id, NULL, NULL),
    (gen_random_uuid()::text, 'auto-parts-accessories', 'Auto Parts & Accessories', NULL, 'Auto Parts & Accessories services across Nigeria', auto_services_motoring_id, NULL, NULL),
    (gen_random_uuid()::text, 'car-rental', 'Car Rental', NULL, 'Car Rental services across Nigeria', auto_services_motoring_id, NULL, NULL),
    (gen_random_uuid()::text, 'car-wash', 'Car Wash', NULL, 'Car Wash services across Nigeria', auto_services_motoring_id, NULL, NULL),
    (gen_random_uuid()::text, 'auto-driving-schools', 'Driving Schools', NULL, 'Driving Schools services across Nigeria', auto_services_motoring_id, NULL, NULL),
    (gen_random_uuid()::text, 'mechanics', 'Mechanics', NULL, 'Mechanics services across Nigeria', auto_services_motoring_id, NULL, NULL),
    (gen_random_uuid()::text, 'panel-beaters', 'Panel Beaters', NULL, 'Panel Beaters services across Nigeria', auto_services_motoring_id, NULL, NULL),
    (gen_random_uuid()::text, 'petrol-stations', 'Petrol Stations', NULL, 'Petrol Stations services across Nigeria', auto_services_motoring_id, NULL, NULL),
    (gen_random_uuid()::text, 'towing-services', 'Towing Services', NULL, 'Towing Services services across Nigeria', auto_services_motoring_id, NULL, NULL),
    (gen_random_uuid()::text, 'tyre-dealers', 'Tyre Dealers', NULL, 'Tyre Dealers services across Nigeria', auto_services_motoring_id, NULL, NULL),
    (gen_random_uuid()::text, 'vehicle-sales', 'Vehicle Sales', NULL, 'Vehicle Sales services across Nigeria', auto_services_motoring_id, NULL, NULL),
    (gen_random_uuid()::text, 'vulcanizers', 'Vulcanizers', NULL, 'Vulcanizers services across Nigeria', auto_services_motoring_id, NULL, NULL);

  -- Business Services (10 subcategories)
  INSERT INTO categories (id, slug, name, icon, description, parent_id, seo_title_template, seo_description_template)
  VALUES
    (gen_random_uuid()::text, 'advertising-marketing', 'Advertising & Marketing', NULL, 'Advertising & Marketing services across Nigeria', business_services_id, NULL, NULL),
    (gen_random_uuid()::text, 'consultants', 'Consultants', NULL, 'Consultants services across Nigeria', business_services_id, NULL, NULL),
    (gen_random_uuid()::text, 'courier-delivery', 'Courier & Delivery', NULL, 'Courier & Delivery services across Nigeria', business_services_id, NULL, NULL),
    (gen_random_uuid()::text, 'business-dispatch-riders', 'Dispatch Riders', NULL, 'Dispatch Riders services across Nigeria', business_services_id, NULL, NULL),
    (gen_random_uuid()::text, 'human-resources', 'Human Resources', NULL, 'Human Resources services across Nigeria', business_services_id, NULL, NULL),
    (gen_random_uuid()::text, 'office-services', 'Office Services', NULL, 'Office Services services across Nigeria', business_services_id, NULL, NULL),
    (gen_random_uuid()::text, 'printing-branding', 'Printing & Branding', NULL, 'Printing & Branding services across Nigeria', business_services_id, NULL, NULL),
    (gen_random_uuid()::text, 'public-relations', 'Public Relations', NULL, 'Public Relations services across Nigeria', business_services_id, NULL, NULL),
    (gen_random_uuid()::text, 'signage-banners', 'Signage & Banners', NULL, 'Signage & Banners services across Nigeria', business_services_id, NULL, NULL),
    (gen_random_uuid()::text, 'training-development', 'Training & Development', NULL, 'Training & Development services across Nigeria', business_services_id, NULL, NULL);

  -- Computers & Technology (12 subcategories)
  INSERT INTO categories (id, slug, name, icon, description, parent_id, seo_title_template, seo_description_template)
  VALUES
    (gen_random_uuid()::text, 'apps-software', 'Apps & Software', NULL, 'Apps & Software services across Nigeria', computers_technology_id, NULL, NULL),
    (gen_random_uuid()::text, 'cctv-security-systems', 'CCTV & Security Systems', NULL, 'CCTV & Security Systems services across Nigeria', computers_technology_id, NULL, NULL),
    (gen_random_uuid()::text, 'cloud-hosting', 'Cloud & Hosting', NULL, 'Cloud & Hosting services across Nigeria', computers_technology_id, NULL, NULL),
    (gen_random_uuid()::text, 'computer-repair', 'Computer Repair', NULL, 'Computer Repair services across Nigeria', computers_technology_id, NULL, NULL),
    (gen_random_uuid()::text, 'computers-computer-training', 'Computer Training', NULL, 'Computer Training services across Nigeria', computers_technology_id, NULL, NULL),
    (gen_random_uuid()::text, 'cyber-security', 'Cyber Security', NULL, 'Cyber Security services across Nigeria', computers_technology_id, NULL, NULL),
    (gen_random_uuid()::text, 'fintech', 'FinTech', NULL, 'FinTech services across Nigeria', computers_technology_id, NULL, NULL),
    (gen_random_uuid()::text, 'internet-service-providers', 'Internet Service Providers', NULL, 'Internet Service Providers services across Nigeria', computers_technology_id, NULL, NULL),
    (gen_random_uuid()::text, 'networking', 'Networking', NULL, 'Networking services across Nigeria', computers_technology_id, NULL, NULL),
    (gen_random_uuid()::text, 'phone-repair', 'Phone Repair', NULL, 'Phone Repair services across Nigeria', computers_technology_id, NULL, NULL),
    (gen_random_uuid()::text, 'pos-services', 'POS Services', NULL, 'POS Services services across Nigeria', computers_technology_id, NULL, NULL),
    (gen_random_uuid()::text, 'web-design-development', 'Web Design & Development', NULL, 'Web Design & Development services across Nigeria', computers_technology_id, NULL, NULL);

  -- Construction & Tradesmen (13 subcategories)
  INSERT INTO categories (id, slug, name, icon, description, parent_id, seo_title_template, seo_description_template)
  VALUES
    (gen_random_uuid()::text, 'aluminium-glass', 'Aluminium & Glass', NULL, 'Aluminium & Glass services across Nigeria', construction_tradesmen_id, NULL, NULL),
    (gen_random_uuid()::text, 'architectural-services', 'Architectural Services', NULL, 'Architectural Services services across Nigeria', construction_tradesmen_id, NULL, NULL),
    (gen_random_uuid()::text, 'block-bricks', 'Block & Bricks', NULL, 'Block & Bricks services across Nigeria', construction_tradesmen_id, NULL, NULL),
    (gen_random_uuid()::text, 'building-materials', 'Building Materials', NULL, 'Building Materials services across Nigeria', construction_tradesmen_id, NULL, NULL),
    (gen_random_uuid()::text, 'carpentry', 'Carpentry', NULL, 'Carpentry services across Nigeria', construction_tradesmen_id, NULL, NULL),
    (gen_random_uuid()::text, 'concrete-paving', 'Concrete & Paving', NULL, 'Concrete & Paving services across Nigeria', construction_tradesmen_id, NULL, NULL),
    (gen_random_uuid()::text, 'contractors', 'Contractors', NULL, 'Contractors services across Nigeria', construction_tradesmen_id, NULL, NULL),
    (gen_random_uuid()::text, 'decorators-painters', 'Decorators & Painters', NULL, 'Decorators & Painters services across Nigeria', construction_tradesmen_id, NULL, NULL),
    (gen_random_uuid()::text, 'electrical-installation', 'Electrical Installation', NULL, 'Electrical Installation services across Nigeria', construction_tradesmen_id, NULL, NULL),
    (gen_random_uuid()::text, 'construction-plumbers', 'Plumbers', NULL, 'Plumbers services across Nigeria', construction_tradesmen_id, NULL, NULL),
    (gen_random_uuid()::text, 'roofing', 'Roofing', NULL, 'Roofing services across Nigeria', construction_tradesmen_id, NULL, NULL),
    (gen_random_uuid()::text, 'tiling', 'Tiling', NULL, 'Tiling services across Nigeria', construction_tradesmen_id, NULL, NULL),
    (gen_random_uuid()::text, 'welding-fabrication', 'Welding & Fabrication', NULL, 'Welding & Fabrication services across Nigeria', construction_tradesmen_id, NULL, NULL);

  -- Education & Training (9 subcategories)
  INSERT INTO categories (id, slug, name, icon, description, parent_id, seo_title_template, seo_description_template)
  VALUES
    (gen_random_uuid()::text, 'after-school-programs', 'After School Programs', NULL, 'After School Programs services across Nigeria', education_training_id, NULL, NULL),
    (gen_random_uuid()::text, 'education-computer-training', 'Computer Training', NULL, 'Computer Training services across Nigeria', education_training_id, NULL, NULL),
    (gen_random_uuid()::text, 'creches-daycare', 'Crèches & Daycare', NULL, 'Crèches & Daycare services across Nigeria', education_training_id, NULL, NULL),
    (gen_random_uuid()::text, 'education-driving-schools', 'Driving Schools', NULL, 'Driving Schools services across Nigeria', education_training_id, NULL, NULL),
    (gen_random_uuid()::text, 'language-schools', 'Language Schools', NULL, 'Language Schools services across Nigeria', education_training_id, NULL, NULL),
    (gen_random_uuid()::text, 'lesson-teachers-tutoring', 'Lesson Teachers & Tutoring', NULL, 'Lesson Teachers & Tutoring services across Nigeria', education_training_id, NULL, NULL),
    (gen_random_uuid()::text, 'schools-colleges', 'Schools & Colleges', NULL, 'Schools & Colleges services across Nigeria', education_training_id, NULL, NULL),
    (gen_random_uuid()::text, 'universities', 'Universities', NULL, 'Universities services across Nigeria', education_training_id, NULL, NULL),
    (gen_random_uuid()::text, 'vocational-training', 'Vocational Training', NULL, 'Vocational Training services across Nigeria', education_training_id, NULL, NULL);

  -- Entertainment & Leisure (7 subcategories)
  INSERT INTO categories (id, slug, name, icon, description, parent_id, seo_title_template, seo_description_template)
  VALUES
    (gen_random_uuid()::text, 'amusement-game-centres', 'Amusement & Game Centres', NULL, 'Amusement & Game Centres services across Nigeria', entertainment_leisure_id, NULL, NULL),
    (gen_random_uuid()::text, 'arts-crafts', 'Arts & Crafts', NULL, 'Arts & Crafts services across Nigeria', entertainment_leisure_id, NULL, NULL),
    (gen_random_uuid()::text, 'cinemas', 'Cinemas', NULL, 'Cinemas services across Nigeria', entertainment_leisure_id, NULL, NULL),
    (gen_random_uuid()::text, 'clubs-lounges', 'Clubs & Lounges', NULL, 'Clubs & Lounges services across Nigeria', entertainment_leisure_id, NULL, NULL),
    (gen_random_uuid()::text, 'music-djs', 'Music & DJs', NULL, 'Music & DJs services across Nigeria', entertainment_leisure_id, NULL, NULL),
    (gen_random_uuid()::text, 'recreation-sports', 'Recreation & Sports', NULL, 'Recreation & Sports services across Nigeria', entertainment_leisure_id, NULL, NULL),
    (gen_random_uuid()::text, 'streaming-content', 'Streaming & Content', NULL, 'Streaming & Content services across Nigeria', entertainment_leisure_id, NULL, NULL);

  -- Events & Weddings (9 subcategories)
  INSERT INTO categories (id, slug, name, icon, description, parent_id, seo_title_template, seo_description_template)
  VALUES
    (gen_random_uuid()::text, 'caterers', 'Caterers', NULL, 'Caterers services across Nigeria', events_weddings_id, NULL, NULL),
    (gen_random_uuid()::text, 'decorators', 'Decorators', NULL, 'Decorators services across Nigeria', events_weddings_id, NULL, NULL),
    (gen_random_uuid()::text, 'djs-mcs', 'DJs & MCs', NULL, 'DJs & MCs services across Nigeria', events_weddings_id, NULL, NULL),
    (gen_random_uuid()::text, 'event-equipment-rental', 'Event Equipment Rental', NULL, 'Event Equipment Rental services across Nigeria', events_weddings_id, NULL, NULL),
    (gen_random_uuid()::text, 'event-planners', 'Event Planners', NULL, 'Event Planners services across Nigeria', events_weddings_id, NULL, NULL),
    (gen_random_uuid()::text, 'photographers', 'Photographers', NULL, 'Photographers services across Nigeria', events_weddings_id, NULL, NULL),
    (gen_random_uuid()::text, 'venues-event-halls', 'Venues & Event Halls', NULL, 'Venues & Event Halls services across Nigeria', events_weddings_id, NULL, NULL),
    (gen_random_uuid()::text, 'videographers', 'Videographers', NULL, 'Videographers services across Nigeria', events_weddings_id, NULL, NULL),
    (gen_random_uuid()::text, 'wedding-services', 'Wedding Services', NULL, 'Wedding Services services across Nigeria', events_weddings_id, NULL, NULL);

  -- Fashion & Beauty (11 subcategories)
  INSERT INTO categories (id, slug, name, icon, description, parent_id, seo_title_template, seo_description_template)
  VALUES
    (gen_random_uuid()::text, 'barber-shops', 'Barber Shops', NULL, 'Barber Shops services across Nigeria', fashion_beauty_id, NULL, NULL),
    (gen_random_uuid()::text, 'beauty-products', 'Beauty Products', NULL, 'Beauty Products services across Nigeria', fashion_beauty_id, NULL, NULL),
    (gen_random_uuid()::text, 'cosmetics', 'Cosmetics', NULL, 'Cosmetics services across Nigeria', fashion_beauty_id, NULL, NULL),
    (gen_random_uuid()::text, 'fabric-stores', 'Fabric Stores', NULL, 'Fabric Stores services across Nigeria', fashion_beauty_id, NULL, NULL),
    (gen_random_uuid()::text, 'fashion-designers', 'Fashion Designers', NULL, 'Fashion Designers services across Nigeria', fashion_beauty_id, NULL, NULL),
    (gen_random_uuid()::text, 'hair-salons', 'Hair Salons', NULL, 'Hair Salons services across Nigeria', fashion_beauty_id, NULL, NULL),
    (gen_random_uuid()::text, 'jewellery', 'Jewellery', NULL, 'Jewellery services across Nigeria', fashion_beauty_id, NULL, NULL),
    (gen_random_uuid()::text, 'makeup-artists', 'Makeup Artists', NULL, 'Makeup Artists services across Nigeria', fashion_beauty_id, NULL, NULL),
    (gen_random_uuid()::text, 'nail-studios', 'Nail Studios', NULL, 'Nail Studios services across Nigeria', fashion_beauty_id, NULL, NULL),
    (gen_random_uuid()::text, 'shoe-makers', 'Shoe Makers', NULL, 'Shoe Makers services across Nigeria', fashion_beauty_id, NULL, NULL),
    (gen_random_uuid()::text, 'tailors-alterations', 'Tailors & Alterations', NULL, 'Tailors & Alterations services across Nigeria', fashion_beauty_id, NULL, NULL);

  -- Finance & Insurance (7 subcategories)
  INSERT INTO categories (id, slug, name, icon, description, parent_id, seo_title_template, seo_description_template)
  VALUES
    (gen_random_uuid()::text, 'accountants-auditors', 'Accountants & Auditors', NULL, 'Accountants & Auditors services across Nigeria', finance_insurance_id, NULL, NULL),
    (gen_random_uuid()::text, 'banks-microfinance', 'Banks & Microfinance', NULL, 'Banks & Microfinance services across Nigeria', finance_insurance_id, NULL, NULL),
    (gen_random_uuid()::text, 'crowdfunding-investment', 'Crowdfunding & Investment', NULL, 'Crowdfunding & Investment services across Nigeria', finance_insurance_id, NULL, NULL),
    (gen_random_uuid()::text, 'insurance-agents', 'Insurance Agents', NULL, 'Insurance Agents services across Nigeria', finance_insurance_id, NULL, NULL),
    (gen_random_uuid()::text, 'mobile-money-pos', 'Mobile Money & POS', NULL, 'Mobile Money & POS services across Nigeria', finance_insurance_id, NULL, NULL),
    (gen_random_uuid()::text, 'payroll-services', 'Payroll Services', NULL, 'Payroll Services services across Nigeria', finance_insurance_id, NULL, NULL),
    (gen_random_uuid()::text, 'tax-consultants', 'Tax Consultants', NULL, 'Tax Consultants services across Nigeria', finance_insurance_id, NULL, NULL);

  -- Food & Dining (10 subcategories)
  INSERT INTO categories (id, slug, name, icon, description, parent_id, seo_title_template, seo_description_template)
  VALUES
    (gen_random_uuid()::text, 'bakeries', 'Bakeries', NULL, 'Bakeries services across Nigeria', food_dining_id, NULL, NULL),
    (gen_random_uuid()::text, 'cafes-coffee-shops', 'Cafes & Coffee Shops', NULL, 'Cafes & Coffee Shops services across Nigeria', food_dining_id, NULL, NULL),
    (gen_random_uuid()::text, 'catering-services', 'Catering Services', NULL, 'Catering Services services across Nigeria', food_dining_id, NULL, NULL),
    (gen_random_uuid()::text, 'fast-food-takeaway', 'Fast Food & Takeaway', NULL, 'Fast Food & Takeaway services across Nigeria', food_dining_id, NULL, NULL),
    (gen_random_uuid()::text, 'food-manufacturing', 'Food Manufacturing', NULL, 'Food Manufacturing services across Nigeria', food_dining_id, NULL, NULL),
    (gen_random_uuid()::text, 'food-vendors-bukka', 'Food Vendors & Bukka', NULL, 'Food Vendors & Bukka services across Nigeria', food_dining_id, NULL, NULL),
    (gen_random_uuid()::text, 'restaurants', 'Restaurants', NULL, 'Restaurants services across Nigeria', food_dining_id, NULL, NULL),
    (gen_random_uuid()::text, 'suya-grills', 'Suya & Grills', NULL, 'Suya & Grills services across Nigeria', food_dining_id, NULL, NULL),
    (gen_random_uuid()::text, 'supermarkets-provision-stores', 'Supermarkets & Provision Stores', NULL, 'Supermarkets & Provision Stores services across Nigeria', food_dining_id, NULL, NULL),
    (gen_random_uuid()::text, 'wine-drinks', 'Wine & Drinks', NULL, 'Wine & Drinks services across Nigeria', food_dining_id, NULL, NULL);

  -- Health & Medical (12 subcategories)
  INSERT INTO categories (id, slug, name, icon, description, parent_id, seo_title_template, seo_description_template)
  VALUES
    (gen_random_uuid()::text, 'clinics-hospitals', 'Clinics & Hospitals', NULL, 'Clinics & Hospitals services across Nigeria', health_medical_id, NULL, NULL),
    (gen_random_uuid()::text, 'dentists', 'Dentists', NULL, 'Dentists services across Nigeria', health_medical_id, NULL, NULL),
    (gen_random_uuid()::text, 'diagnostics-labs', 'Diagnostics & Labs', NULL, 'Diagnostics & Labs services across Nigeria', health_medical_id, NULL, NULL),
    (gen_random_uuid()::text, 'doctors', 'Doctors', NULL, 'Doctors services across Nigeria', health_medical_id, NULL, NULL),
    (gen_random_uuid()::text, 'gyms-fitness', 'Gyms & Fitness', NULL, 'Gyms & Fitness services across Nigeria', health_medical_id, NULL, NULL),
    (gen_random_uuid()::text, 'mental-health', 'Mental Health', NULL, 'Mental Health services across Nigeria', health_medical_id, NULL, NULL),
    (gen_random_uuid()::text, 'nursing-home-care', 'Nursing & Home Care', NULL, 'Nursing & Home Care services across Nigeria', health_medical_id, NULL, NULL),
    (gen_random_uuid()::text, 'opticians', 'Opticians', NULL, 'Opticians services across Nigeria', health_medical_id, NULL, NULL),
    (gen_random_uuid()::text, 'pharmacies', 'Pharmacies', NULL, 'Pharmacies services across Nigeria', health_medical_id, NULL, NULL),
    (gen_random_uuid()::text, 'spa-massage', 'Spa & Massage', NULL, 'Spa & Massage services across Nigeria', health_medical_id, NULL, NULL),
    (gen_random_uuid()::text, 'traditional-alternative-medicine', 'Traditional & Alternative Medicine', NULL, 'Traditional & Alternative Medicine services across Nigeria', health_medical_id, NULL, NULL),
    (gen_random_uuid()::text, 'veterinary', 'Veterinary', NULL, 'Veterinary services across Nigeria', health_medical_id, NULL, NULL);

  -- Home Services (11 subcategories)
  INSERT INTO categories (id, slug, name, icon, description, parent_id, seo_title_template, seo_description_template)
  VALUES
    (gen_random_uuid()::text, 'ac-repair-installation', 'AC Repair & Installation', NULL, 'AC Repair & Installation services across Nigeria', home_services_id, NULL, NULL),
    (gen_random_uuid()::text, 'cleaners-housekeeping', 'Cleaners & Housekeeping', NULL, 'Cleaners & Housekeeping services across Nigeria', home_services_id, NULL, NULL),
    (gen_random_uuid()::text, 'electricians', 'Electricians', NULL, 'Electricians services across Nigeria', home_services_id, NULL, NULL),
    (gen_random_uuid()::text, 'fumigation-pest-control', 'Fumigation & Pest Control', NULL, 'Fumigation & Pest Control services across Nigeria', home_services_id, NULL, NULL),
    (gen_random_uuid()::text, 'gardeners-landscaping', 'Gardeners & Landscaping', NULL, 'Gardeners & Landscaping services across Nigeria', home_services_id, NULL, NULL),
    (gen_random_uuid()::text, 'interior-design', 'Interior Design', NULL, 'Interior Design services across Nigeria', home_services_id, NULL, NULL),
    (gen_random_uuid()::text, 'laundry-dry-cleaning', 'Laundry & Dry Cleaning', NULL, 'Laundry & Dry Cleaning services across Nigeria', home_services_id, NULL, NULL),
    (gen_random_uuid()::text, 'locksmiths', 'Locksmiths', NULL, 'Locksmiths services across Nigeria', home_services_id, NULL, NULL),
    (gen_random_uuid()::text, 'painters', 'Painters', NULL, 'Painters services across Nigeria', home_services_id, NULL, NULL),
    (gen_random_uuid()::text, 'home-plumbers', 'Plumbers', NULL, 'Plumbers services across Nigeria', home_services_id, NULL, NULL),
    (gen_random_uuid()::text, 'waste-disposal', 'Waste Disposal', NULL, 'Waste Disposal services across Nigeria', home_services_id, NULL, NULL);

  -- Legal Services (6 subcategories)
  INSERT INTO categories (id, slug, name, icon, description, parent_id, seo_title_template, seo_description_template)
  VALUES
    (gen_random_uuid()::text, 'corporate-law', 'Corporate Law', NULL, 'Corporate Law services across Nigeria', legal_services_id, NULL, NULL),
    (gen_random_uuid()::text, 'family-law', 'Family Law', NULL, 'Family Law services across Nigeria', legal_services_id, NULL, NULL),
    (gen_random_uuid()::text, 'immigration-visa', 'Immigration & Visa', NULL, 'Immigration & Visa services across Nigeria', legal_services_id, NULL, NULL),
    (gen_random_uuid()::text, 'lawyers-solicitors', 'Lawyers & Solicitors', NULL, 'Lawyers & Solicitors services across Nigeria', legal_services_id, NULL, NULL),
    (gen_random_uuid()::text, 'notary-public', 'Notary Public', NULL, 'Notary Public services across Nigeria', legal_services_id, NULL, NULL),
    (gen_random_uuid()::text, 'property-law', 'Property Law', NULL, 'Property Law services across Nigeria', legal_services_id, NULL, NULL);

  -- Logistics & Transport (9 subcategories)
  INSERT INTO categories (id, slug, name, icon, description, parent_id, seo_title_template, seo_description_template)
  VALUES
    (gen_random_uuid()::text, 'air-freight', 'Air Freight', NULL, 'Air Freight services across Nigeria', logistics_transport_id, NULL, NULL),
    (gen_random_uuid()::text, 'bus-public-transport', 'Bus & Public Transport', NULL, 'Bus & Public Transport services across Nigeria', logistics_transport_id, NULL, NULL),
    (gen_random_uuid()::text, 'cargo-shipping', 'Cargo & Shipping', NULL, 'Cargo & Shipping services across Nigeria', logistics_transport_id, NULL, NULL),
    (gen_random_uuid()::text, 'courier-services', 'Courier Services', NULL, 'Courier Services services across Nigeria', logistics_transport_id, NULL, NULL),
    (gen_random_uuid()::text, 'logistics-dispatch-riders', 'Dispatch Riders', NULL, 'Dispatch Riders services across Nigeria', logistics_transport_id, NULL, NULL),
    (gen_random_uuid()::text, 'haulage-trucking', 'Haulage & Trucking', NULL, 'Haulage & Trucking services across Nigeria', logistics_transport_id, NULL, NULL),
    (gen_random_uuid()::text, 'moving-relocation', 'Moving & Relocation', NULL, 'Moving & Relocation services across Nigeria', logistics_transport_id, NULL, NULL),
    (gen_random_uuid()::text, 'taxis-ride-hailing', 'Taxis & Ride-Hailing', NULL, 'Taxis & Ride-Hailing services across Nigeria', logistics_transport_id, NULL, NULL),
    (gen_random_uuid()::text, 'warehousing', 'Warehousing', NULL, 'Warehousing services across Nigeria', logistics_transport_id, NULL, NULL);

  -- Manufacturing & Industry (13 subcategories)
  INSERT INTO categories (id, slug, name, icon, description, parent_id, seo_title_template, seo_description_template)
  VALUES
    (gen_random_uuid()::text, 'chemicals', 'Chemicals', NULL, 'Chemicals services across Nigeria', manufacturing_industry_id, NULL, NULL),
    (gen_random_uuid()::text, 'electrical-equipment', 'Electrical Equipment', NULL, 'Electrical Equipment services across Nigeria', manufacturing_industry_id, NULL, NULL),
    (gen_random_uuid()::text, 'energy-power', 'Energy & Power', NULL, 'Energy & Power services across Nigeria', manufacturing_industry_id, NULL, NULL),
    (gen_random_uuid()::text, 'engineering-services', 'Engineering Services', NULL, 'Engineering Services services across Nigeria', manufacturing_industry_id, NULL, NULL),
    (gen_random_uuid()::text, 'food-processing', 'Food Processing', NULL, 'Food Processing services across Nigeria', manufacturing_industry_id, NULL, NULL),
    (gen_random_uuid()::text, 'furniture-manufacturing', 'Furniture Manufacturing', NULL, 'Furniture Manufacturing services across Nigeria', manufacturing_industry_id, NULL, NULL),
    (gen_random_uuid()::text, 'industrial-equipment', 'Industrial Equipment', NULL, 'Industrial Equipment services across Nigeria', manufacturing_industry_id, NULL, NULL),
    (gen_random_uuid()::text, 'oil-gas', 'Oil & Gas', NULL, 'Oil & Gas services across Nigeria', manufacturing_industry_id, NULL, NULL),
    (gen_random_uuid()::text, 'packaging', 'Packaging', NULL, 'Packaging services across Nigeria', manufacturing_industry_id, NULL, NULL),
    (gen_random_uuid()::text, 'plastics-rubber', 'Plastics & Rubber', NULL, 'Plastics & Rubber services across Nigeria', manufacturing_industry_id, NULL, NULL),
    (gen_random_uuid()::text, 'steel-metal-works', 'Steel & Metal Works', NULL, 'Steel & Metal Works services across Nigeria', manufacturing_industry_id, NULL, NULL),
    (gen_random_uuid()::text, 'textiles', 'Textiles', NULL, 'Textiles services across Nigeria', manufacturing_industry_id, NULL, NULL),
    (gen_random_uuid()::text, 'water-treatment', 'Water Treatment', NULL, 'Water Treatment services across Nigeria', manufacturing_industry_id, NULL, NULL);

  -- Property & Real Estate (8 subcategories)
  INSERT INTO categories (id, slug, name, icon, description, parent_id, seo_title_template, seo_description_template)
  VALUES
    (gen_random_uuid()::text, 'commercial-property', 'Commercial Property', NULL, 'Commercial Property services across Nigeria', property_real_estate_id, NULL, NULL),
    (gen_random_uuid()::text, 'coworking-spaces', 'Coworking Spaces', NULL, 'Coworking Spaces services across Nigeria', property_real_estate_id, NULL, NULL),
    (gen_random_uuid()::text, 'estate-agents', 'Estate Agents', NULL, 'Estate Agents services across Nigeria', property_real_estate_id, NULL, NULL),
    (gen_random_uuid()::text, 'facility-management', 'Facility Management', NULL, 'Facility Management services across Nigeria', property_real_estate_id, NULL, NULL),
    (gen_random_uuid()::text, 'land-agents', 'Land Agents', NULL, 'Land Agents services across Nigeria', property_real_estate_id, NULL, NULL),
    (gen_random_uuid()::text, 'property-development', 'Property Development', NULL, 'Property Development services across Nigeria', property_real_estate_id, NULL, NULL),
    (gen_random_uuid()::text, 'property-management', 'Property Management', NULL, 'Property Management services across Nigeria', property_real_estate_id, NULL, NULL),
    (gen_random_uuid()::text, 'short-let-apartments', 'Short-Let Apartments', NULL, 'Short-Let Apartments services across Nigeria', property_real_estate_id, NULL, NULL);

  -- Religious & Community (6 subcategories)
  INSERT INTO categories (id, slug, name, icon, description, parent_id, seo_title_template, seo_description_template)
  VALUES
    (gen_random_uuid()::text, 'charity-ngos', 'Charity & NGOs', NULL, 'Charity & NGOs services across Nigeria', religious_community_id, NULL, NULL),
    (gen_random_uuid()::text, 'churches', 'Churches', NULL, 'Churches services across Nigeria', religious_community_id, NULL, NULL),
    (gen_random_uuid()::text, 'community-centres', 'Community Centres', NULL, 'Community Centres services across Nigeria', religious_community_id, NULL, NULL),
    (gen_random_uuid()::text, 'counselling', 'Counselling', NULL, 'Counselling services across Nigeria', religious_community_id, NULL, NULL),
    (gen_random_uuid()::text, 'mosques', 'Mosques', NULL, 'Mosques services across Nigeria', religious_community_id, NULL, NULL),
    (gen_random_uuid()::text, 'youth-organizations', 'Youth Organizations', NULL, 'Youth Organizations services across Nigeria', religious_community_id, NULL, NULL);

  -- Shopping & Retail (12 subcategories)
  INSERT INTO categories (id, slug, name, icon, description, parent_id, seo_title_template, seo_description_template)
  VALUES
    (gen_random_uuid()::text, 'baby-kids-stores', 'Baby & Kids Stores', NULL, 'Baby & Kids Stores services across Nigeria', shopping_retail_id, NULL, NULL),
    (gen_random_uuid()::text, 'books-stationery', 'Books & Stationery', NULL, 'Books & Stationery services across Nigeria', shopping_retail_id, NULL, NULL),
    (gen_random_uuid()::text, 'clothing-accessories', 'Clothing & Accessories', NULL, 'Clothing & Accessories services across Nigeria', shopping_retail_id, NULL, NULL),
    (gen_random_uuid()::text, 'electronics-gadgets', 'Electronics & Gadgets', NULL, 'Electronics & Gadgets services across Nigeria', shopping_retail_id, NULL, NULL),
    (gen_random_uuid()::text, 'gift-shops', 'Gift Shops', NULL, 'Gift Shops services across Nigeria', shopping_retail_id, NULL, NULL),
    (gen_random_uuid()::text, 'hardware-stores', 'Hardware Stores', NULL, 'Hardware Stores services across Nigeria', shopping_retail_id, NULL, NULL),
    (gen_random_uuid()::text, 'home-garden', 'Home & Garden', NULL, 'Home & Garden services across Nigeria', shopping_retail_id, NULL, NULL),
    (gen_random_uuid()::text, 'mobile-phone-shops', 'Mobile Phone Shops', NULL, 'Mobile Phone Shops services across Nigeria', shopping_retail_id, NULL, NULL),
    (gen_random_uuid()::text, 'online-stores', 'Online Stores', NULL, 'Online Stores services across Nigeria', shopping_retail_id, NULL, NULL),
    (gen_random_uuid()::text, 'provision-stores', 'Provision Stores', NULL, 'Provision Stores services across Nigeria', shopping_retail_id, NULL, NULL),
    (gen_random_uuid()::text, 'supermarkets', 'Supermarkets', NULL, 'Supermarkets services across Nigeria', shopping_retail_id, NULL, NULL),
    (gen_random_uuid()::text, 'wholesale', 'Wholesale', NULL, 'Wholesale services across Nigeria', shopping_retail_id, NULL, NULL);

  -- Tourism & Hospitality (8 subcategories)
  INSERT INTO categories (id, slug, name, icon, description, parent_id, seo_title_template, seo_description_template)
  VALUES
    (gen_random_uuid()::text, 'apartments-guest-houses', 'Apartments & Guest Houses', NULL, 'Apartments & Guest Houses services across Nigeria', tourism_hospitality_id, NULL, NULL),
    (gen_random_uuid()::text, 'attractions-sightseeing', 'Attractions & Sightseeing', NULL, 'Attractions & Sightseeing services across Nigeria', tourism_hospitality_id, NULL, NULL),
    (gen_random_uuid()::text, 'bed-breakfast', 'Bed & Breakfast', NULL, 'Bed & Breakfast services across Nigeria', tourism_hospitality_id, NULL, NULL),
    (gen_random_uuid()::text, 'holiday-homes', 'Holiday Homes', NULL, 'Holiday Homes services across Nigeria', tourism_hospitality_id, NULL, NULL),
    (gen_random_uuid()::text, 'hotels-resorts', 'Hotels & Resorts', NULL, 'Hotels & Resorts services across Nigeria', tourism_hospitality_id, NULL, NULL),
    (gen_random_uuid()::text, 'tour-operators', 'Tour Operators', NULL, 'Tour Operators services across Nigeria', tourism_hospitality_id, NULL, NULL),
    (gen_random_uuid()::text, 'travel-agents', 'Travel Agents', NULL, 'Travel Agents services across Nigeria', tourism_hospitality_id, NULL, NULL),
    (gen_random_uuid()::text, 'visa-services', 'Visa Services', NULL, 'Visa Services services across Nigeria', tourism_hospitality_id, NULL, NULL);

  RAISE NOTICE 'Category taxonomy upgrade complete: 21 parents, 193 subcategories';

END $$;
