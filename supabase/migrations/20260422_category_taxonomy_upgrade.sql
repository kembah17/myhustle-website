-- Migration: Upgrade Category Taxonomy (FIXED v4 - handles existing slugs)
-- Date: 2026-04-22
-- Approach: UPSERT parent categories, remap businesses, delete old, insert subcategories

DO $$
DECLARE
  agricultureandfarming_id TEXT;
  auto_ervice_andmotoring_id TEXT;
  bu_ine_ervice_id TEXT;
  computer_andtechnology_id TEXT;
  con_tructionandtrade_men_id TEXT;
  educationandtraining_id TEXT;
  entertainmentandlei_ure_id TEXT;
  event_andwedding_id TEXT;
  fa_hionandbeauty_id TEXT;
  financeandin_urance_id TEXT;
  foodanddining_id TEXT;
  healthandmedical_id TEXT;
  home_ervice_id TEXT;
  legal_ervice_id TEXT;
  logi_tic_andtran_port_id TEXT;
  manufacturingandindu_try_id TEXT;
  propertyandreale_tate_id TEXT;
  religiou_andcommunity_id TEXT;
  hoppingandretail_id TEXT;
  touri_mandho_pitality_id TEXT;
  other_id TEXT;
  biz_count INTEGER;
BEGIN

  -- =============================================================
  -- STEP 1: Upsert parent categories (existing slugs get updated)
  -- =============================================================
  -- Agriculture & Farming
  SELECT id INTO agricultureandfarming_id FROM categories WHERE slug = 'agricultureandfarming' AND parent_id IS NULL;
  IF agricultureandfarming_id IS NULL THEN
    agricultureandfarming_id := gen_random_uuid()::text;
    INSERT INTO categories (id, name, slug, parent_id)
    VALUES (agricultureandfarming_id, 'Agriculture & Farming', 'agricultureandfarming', NULL);
  ELSE
    UPDATE categories SET name = 'Agriculture & Farming' WHERE id = agricultureandfarming_id;
  END IF;

  -- Auto Services & Motoring
  SELECT id INTO auto_ervice_andmotoring_id FROM categories WHERE slug = 'auto-ervice-andmotoring' AND parent_id IS NULL;
  IF auto_ervice_andmotoring_id IS NULL THEN
    auto_ervice_andmotoring_id := gen_random_uuid()::text;
    INSERT INTO categories (id, name, slug, parent_id)
    VALUES (auto_ervice_andmotoring_id, 'Auto Services & Motoring', 'auto-ervice-andmotoring', NULL);
  ELSE
    UPDATE categories SET name = 'Auto Services & Motoring' WHERE id = auto_ervice_andmotoring_id;
  END IF;

  -- Business Services
  SELECT id INTO bu_ine_ervice_id FROM categories WHERE slug = 'bu-ine-ervice' AND parent_id IS NULL;
  IF bu_ine_ervice_id IS NULL THEN
    bu_ine_ervice_id := gen_random_uuid()::text;
    INSERT INTO categories (id, name, slug, parent_id)
    VALUES (bu_ine_ervice_id, 'Business Services', 'bu-ine-ervice', NULL);
  ELSE
    UPDATE categories SET name = 'Business Services' WHERE id = bu_ine_ervice_id;
  END IF;

  -- Computers & Technology
  SELECT id INTO computer_andtechnology_id FROM categories WHERE slug = 'computer-andtechnology' AND parent_id IS NULL;
  IF computer_andtechnology_id IS NULL THEN
    computer_andtechnology_id := gen_random_uuid()::text;
    INSERT INTO categories (id, name, slug, parent_id)
    VALUES (computer_andtechnology_id, 'Computers & Technology', 'computer-andtechnology', NULL);
  ELSE
    UPDATE categories SET name = 'Computers & Technology' WHERE id = computer_andtechnology_id;
  END IF;

  -- Construction & Tradesmen
  SELECT id INTO con_tructionandtrade_men_id FROM categories WHERE slug = 'con-tructionandtrade-men' AND parent_id IS NULL;
  IF con_tructionandtrade_men_id IS NULL THEN
    con_tructionandtrade_men_id := gen_random_uuid()::text;
    INSERT INTO categories (id, name, slug, parent_id)
    VALUES (con_tructionandtrade_men_id, 'Construction & Tradesmen', 'con-tructionandtrade-men', NULL);
  ELSE
    UPDATE categories SET name = 'Construction & Tradesmen' WHERE id = con_tructionandtrade_men_id;
  END IF;

  -- Education & Training
  SELECT id INTO educationandtraining_id FROM categories WHERE slug = 'educationandtraining' AND parent_id IS NULL;
  IF educationandtraining_id IS NULL THEN
    educationandtraining_id := gen_random_uuid()::text;
    INSERT INTO categories (id, name, slug, parent_id)
    VALUES (educationandtraining_id, 'Education & Training', 'educationandtraining', NULL);
  ELSE
    UPDATE categories SET name = 'Education & Training' WHERE id = educationandtraining_id;
  END IF;

  -- Entertainment & Leisure
  SELECT id INTO entertainmentandlei_ure_id FROM categories WHERE slug = 'entertainmentandlei-ure' AND parent_id IS NULL;
  IF entertainmentandlei_ure_id IS NULL THEN
    entertainmentandlei_ure_id := gen_random_uuid()::text;
    INSERT INTO categories (id, name, slug, parent_id)
    VALUES (entertainmentandlei_ure_id, 'Entertainment & Leisure', 'entertainmentandlei-ure', NULL);
  ELSE
    UPDATE categories SET name = 'Entertainment & Leisure' WHERE id = entertainmentandlei_ure_id;
  END IF;

  -- Events & Weddings
  SELECT id INTO event_andwedding_id FROM categories WHERE slug = 'event-andwedding' AND parent_id IS NULL;
  IF event_andwedding_id IS NULL THEN
    event_andwedding_id := gen_random_uuid()::text;
    INSERT INTO categories (id, name, slug, parent_id)
    VALUES (event_andwedding_id, 'Events & Weddings', 'event-andwedding', NULL);
  ELSE
    UPDATE categories SET name = 'Events & Weddings' WHERE id = event_andwedding_id;
  END IF;

  -- Fashion & Beauty
  SELECT id INTO fa_hionandbeauty_id FROM categories WHERE slug = 'fa-hionandbeauty' AND parent_id IS NULL;
  IF fa_hionandbeauty_id IS NULL THEN
    fa_hionandbeauty_id := gen_random_uuid()::text;
    INSERT INTO categories (id, name, slug, parent_id)
    VALUES (fa_hionandbeauty_id, 'Fashion & Beauty', 'fa-hionandbeauty', NULL);
  ELSE
    UPDATE categories SET name = 'Fashion & Beauty' WHERE id = fa_hionandbeauty_id;
  END IF;

  -- Finance & Insurance
  SELECT id INTO financeandin_urance_id FROM categories WHERE slug = 'financeandin-urance' AND parent_id IS NULL;
  IF financeandin_urance_id IS NULL THEN
    financeandin_urance_id := gen_random_uuid()::text;
    INSERT INTO categories (id, name, slug, parent_id)
    VALUES (financeandin_urance_id, 'Finance & Insurance', 'financeandin-urance', NULL);
  ELSE
    UPDATE categories SET name = 'Finance & Insurance' WHERE id = financeandin_urance_id;
  END IF;

  -- Food & Dining
  SELECT id INTO foodanddining_id FROM categories WHERE slug = 'foodanddining' AND parent_id IS NULL;
  IF foodanddining_id IS NULL THEN
    foodanddining_id := gen_random_uuid()::text;
    INSERT INTO categories (id, name, slug, parent_id)
    VALUES (foodanddining_id, 'Food & Dining', 'foodanddining', NULL);
  ELSE
    UPDATE categories SET name = 'Food & Dining' WHERE id = foodanddining_id;
  END IF;

  -- Health & Medical
  SELECT id INTO healthandmedical_id FROM categories WHERE slug = 'healthandmedical' AND parent_id IS NULL;
  IF healthandmedical_id IS NULL THEN
    healthandmedical_id := gen_random_uuid()::text;
    INSERT INTO categories (id, name, slug, parent_id)
    VALUES (healthandmedical_id, 'Health & Medical', 'healthandmedical', NULL);
  ELSE
    UPDATE categories SET name = 'Health & Medical' WHERE id = healthandmedical_id;
  END IF;

  -- Home Services
  SELECT id INTO home_ervice_id FROM categories WHERE slug = 'home-ervice' AND parent_id IS NULL;
  IF home_ervice_id IS NULL THEN
    home_ervice_id := gen_random_uuid()::text;
    INSERT INTO categories (id, name, slug, parent_id)
    VALUES (home_ervice_id, 'Home Services', 'home-ervice', NULL);
  ELSE
    UPDATE categories SET name = 'Home Services' WHERE id = home_ervice_id;
  END IF;

  -- Legal Services
  SELECT id INTO legal_ervice_id FROM categories WHERE slug = 'legal-ervice' AND parent_id IS NULL;
  IF legal_ervice_id IS NULL THEN
    legal_ervice_id := gen_random_uuid()::text;
    INSERT INTO categories (id, name, slug, parent_id)
    VALUES (legal_ervice_id, 'Legal Services', 'legal-ervice', NULL);
  ELSE
    UPDATE categories SET name = 'Legal Services' WHERE id = legal_ervice_id;
  END IF;

  -- Logistics & Transport
  SELECT id INTO logi_tic_andtran_port_id FROM categories WHERE slug = 'logi-tic-andtran-port' AND parent_id IS NULL;
  IF logi_tic_andtran_port_id IS NULL THEN
    logi_tic_andtran_port_id := gen_random_uuid()::text;
    INSERT INTO categories (id, name, slug, parent_id)
    VALUES (logi_tic_andtran_port_id, 'Logistics & Transport', 'logi-tic-andtran-port', NULL);
  ELSE
    UPDATE categories SET name = 'Logistics & Transport' WHERE id = logi_tic_andtran_port_id;
  END IF;

  -- Manufacturing & Industry
  SELECT id INTO manufacturingandindu_try_id FROM categories WHERE slug = 'manufacturingandindu-try' AND parent_id IS NULL;
  IF manufacturingandindu_try_id IS NULL THEN
    manufacturingandindu_try_id := gen_random_uuid()::text;
    INSERT INTO categories (id, name, slug, parent_id)
    VALUES (manufacturingandindu_try_id, 'Manufacturing & Industry', 'manufacturingandindu-try', NULL);
  ELSE
    UPDATE categories SET name = 'Manufacturing & Industry' WHERE id = manufacturingandindu_try_id;
  END IF;

  -- Property & Real Estate
  SELECT id INTO propertyandreale_tate_id FROM categories WHERE slug = 'propertyandreale-tate' AND parent_id IS NULL;
  IF propertyandreale_tate_id IS NULL THEN
    propertyandreale_tate_id := gen_random_uuid()::text;
    INSERT INTO categories (id, name, slug, parent_id)
    VALUES (propertyandreale_tate_id, 'Property & Real Estate', 'propertyandreale-tate', NULL);
  ELSE
    UPDATE categories SET name = 'Property & Real Estate' WHERE id = propertyandreale_tate_id;
  END IF;

  -- Religious & Community
  SELECT id INTO religiou_andcommunity_id FROM categories WHERE slug = 'religiou-andcommunity' AND parent_id IS NULL;
  IF religiou_andcommunity_id IS NULL THEN
    religiou_andcommunity_id := gen_random_uuid()::text;
    INSERT INTO categories (id, name, slug, parent_id)
    VALUES (religiou_andcommunity_id, 'Religious & Community', 'religiou-andcommunity', NULL);
  ELSE
    UPDATE categories SET name = 'Religious & Community' WHERE id = religiou_andcommunity_id;
  END IF;

  -- Shopping & Retail
  SELECT id INTO hoppingandretail_id FROM categories WHERE slug = 'hoppingandretail' AND parent_id IS NULL;
  IF hoppingandretail_id IS NULL THEN
    hoppingandretail_id := gen_random_uuid()::text;
    INSERT INTO categories (id, name, slug, parent_id)
    VALUES (hoppingandretail_id, 'Shopping & Retail', 'hoppingandretail', NULL);
  ELSE
    UPDATE categories SET name = 'Shopping & Retail' WHERE id = hoppingandretail_id;
  END IF;

  -- Tourism & Hospitality
  SELECT id INTO touri_mandho_pitality_id FROM categories WHERE slug = 'touri-mandho-pitality' AND parent_id IS NULL;
  IF touri_mandho_pitality_id IS NULL THEN
    touri_mandho_pitality_id := gen_random_uuid()::text;
    INSERT INTO categories (id, name, slug, parent_id)
    VALUES (touri_mandho_pitality_id, 'Tourism & Hospitality', 'touri-mandho-pitality', NULL);
  ELSE
    UPDATE categories SET name = 'Tourism & Hospitality' WHERE id = touri_mandho_pitality_id;
  END IF;

  -- Other
  SELECT id INTO other_id FROM categories WHERE slug = 'other' AND parent_id IS NULL;
  IF other_id IS NULL THEN
    other_id := gen_random_uuid()::text;
    INSERT INTO categories (id, name, slug, parent_id)
    VALUES (other_id, 'Other', 'other', NULL);
  ELSE
    UPDATE categories SET name = 'Other' WHERE id = other_id;
  END IF;

  -- =============================================================
  -- STEP 2: Remap existing businesses to new parent categories
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
      agricultureandfarming_id, auto_ervice_andmotoring_id, bu_ine_ervice_id, computer_andtechnology_id, con_tructionandtrade_men_id, educationandtraining_id, entertainmentandlei_ure_id, event_andwedding_id, fa_hionandbeauty_id, financeandin_urance_id, foodanddining_id, healthandmedical_id, home_ervice_id, legal_ervice_id, logi_tic_andtran_port_id, manufacturingandindu_try_id, propertyandreale_tate_id, religiou_andcommunity_id, hoppingandretail_id, touri_mandho_pitality_id, other_id
    );

    DROP TABLE _cat_map;
  END IF;

  -- =============================================================
  -- STEP 3: Delete OLD subcategories and orphaned parent categories
  -- =============================================================
  -- Delete old subcategories (those whose parent is NOT one of our new parents)
  DELETE FROM categories WHERE parent_id IS NOT NULL AND parent_id NOT IN (
    agricultureandfarming_id, auto_ervice_andmotoring_id, bu_ine_ervice_id, computer_andtechnology_id, con_tructionandtrade_men_id, educationandtraining_id, entertainmentandlei_ure_id, event_andwedding_id, fa_hionandbeauty_id, financeandin_urance_id, foodanddining_id, healthandmedical_id, home_ervice_id, legal_ervice_id, logi_tic_andtran_port_id, manufacturingandindu_try_id, propertyandreale_tate_id, religiou_andcommunity_id, hoppingandretail_id, touri_mandho_pitality_id, other_id
  );

  -- Delete old parent categories that are NOT in our new set
  DELETE FROM categories WHERE parent_id IS NULL AND id NOT IN (
    agricultureandfarming_id, auto_ervice_andmotoring_id, bu_ine_ervice_id, computer_andtechnology_id, con_tructionandtrade_men_id, educationandtraining_id, entertainmentandlei_ure_id, event_andwedding_id, fa_hionandbeauty_id, financeandin_urance_id, foodanddining_id, healthandmedical_id, home_ervice_id, legal_ervice_id, logi_tic_andtran_port_id, manufacturingandindu_try_id, propertyandreale_tate_id, religiou_andcommunity_id, hoppingandretail_id, touri_mandho_pitality_id, other_id
  );

  -- =============================================================
  -- STEP 4: Insert NEW subcategories
  -- =============================================================
  -- Agriculture & Farming
  INSERT INTO categories (id, name, slug, parent_id)
  VALUES (gen_random_uuid()::text, 'Agro-chemicals', 'agro-chemical', agricultureandfarming_id)
  ON CONFLICT (slug) DO UPDATE SET name = EXCLUDED.name, parent_id = EXCLUDED.parent_id;
  INSERT INTO categories (id, name, slug, parent_id)
  VALUES (gen_random_uuid()::text, 'Crop Farming', 'cropfarming', agricultureandfarming_id)
  ON CONFLICT (slug) DO UPDATE SET name = EXCLUDED.name, parent_id = EXCLUDED.parent_id;
  INSERT INTO categories (id, name, slug, parent_id)
  VALUES (gen_random_uuid()::text, 'Farm Equipment', 'farmequipment', agricultureandfarming_id)
  ON CONFLICT (slug) DO UPDATE SET name = EXCLUDED.name, parent_id = EXCLUDED.parent_id;
  INSERT INTO categories (id, name, slug, parent_id)
  VALUES (gen_random_uuid()::text, 'Farm Produce', 'farmproduce', agricultureandfarming_id)
  ON CONFLICT (slug) DO UPDATE SET name = EXCLUDED.name, parent_id = EXCLUDED.parent_id;
  INSERT INTO categories (id, name, slug, parent_id)
  VALUES (gen_random_uuid()::text, 'Fish Farming', 'fi-hfarming', agricultureandfarming_id)
  ON CONFLICT (slug) DO UPDATE SET name = EXCLUDED.name, parent_id = EXCLUDED.parent_id;
  INSERT INTO categories (id, name, slug, parent_id)
  VALUES (gen_random_uuid()::text, 'Fisheries', 'fi-herie', agricultureandfarming_id)
  ON CONFLICT (slug) DO UPDATE SET name = EXCLUDED.name, parent_id = EXCLUDED.parent_id;
  INSERT INTO categories (id, name, slug, parent_id)
  VALUES (gen_random_uuid()::text, 'Livestock', 'live-tock', agricultureandfarming_id)
  ON CONFLICT (slug) DO UPDATE SET name = EXCLUDED.name, parent_id = EXCLUDED.parent_id;
  INSERT INTO categories (id, name, slug, parent_id)
  VALUES (gen_random_uuid()::text, 'Poultry', 'poultry', agricultureandfarming_id)
  ON CONFLICT (slug) DO UPDATE SET name = EXCLUDED.name, parent_id = EXCLUDED.parent_id;

  -- Auto Services & Motoring
  INSERT INTO categories (id, name, slug, parent_id)
  VALUES (gen_random_uuid()::text, 'Auto Electricians', 'autoelectrician', auto_ervice_andmotoring_id)
  ON CONFLICT (slug) DO UPDATE SET name = EXCLUDED.name, parent_id = EXCLUDED.parent_id;
  INSERT INTO categories (id, name, slug, parent_id)
  VALUES (gen_random_uuid()::text, 'Auto Parts & Accessories', 'autopart-andacce-orie', auto_ervice_andmotoring_id)
  ON CONFLICT (slug) DO UPDATE SET name = EXCLUDED.name, parent_id = EXCLUDED.parent_id;
  INSERT INTO categories (id, name, slug, parent_id)
  VALUES (gen_random_uuid()::text, 'Car Rental', 'carrental', auto_ervice_andmotoring_id)
  ON CONFLICT (slug) DO UPDATE SET name = EXCLUDED.name, parent_id = EXCLUDED.parent_id;
  INSERT INTO categories (id, name, slug, parent_id)
  VALUES (gen_random_uuid()::text, 'Car Wash', 'carwa-h', auto_ervice_andmotoring_id)
  ON CONFLICT (slug) DO UPDATE SET name = EXCLUDED.name, parent_id = EXCLUDED.parent_id;
  INSERT INTO categories (id, name, slug, parent_id)
  VALUES (gen_random_uuid()::text, 'Driving Schools', 'auto-driving-chool', auto_ervice_andmotoring_id)
  ON CONFLICT (slug) DO UPDATE SET name = EXCLUDED.name, parent_id = EXCLUDED.parent_id;
  INSERT INTO categories (id, name, slug, parent_id)
  VALUES (gen_random_uuid()::text, 'Mechanics', 'mechanic', auto_ervice_andmotoring_id)
  ON CONFLICT (slug) DO UPDATE SET name = EXCLUDED.name, parent_id = EXCLUDED.parent_id;
  INSERT INTO categories (id, name, slug, parent_id)
  VALUES (gen_random_uuid()::text, 'Panel Beaters', 'panelbeater', auto_ervice_andmotoring_id)
  ON CONFLICT (slug) DO UPDATE SET name = EXCLUDED.name, parent_id = EXCLUDED.parent_id;
  INSERT INTO categories (id, name, slug, parent_id)
  VALUES (gen_random_uuid()::text, 'Petrol Stations', 'petrol-tation', auto_ervice_andmotoring_id)
  ON CONFLICT (slug) DO UPDATE SET name = EXCLUDED.name, parent_id = EXCLUDED.parent_id;
  INSERT INTO categories (id, name, slug, parent_id)
  VALUES (gen_random_uuid()::text, 'Towing Services', 'towing-ervice', auto_ervice_andmotoring_id)
  ON CONFLICT (slug) DO UPDATE SET name = EXCLUDED.name, parent_id = EXCLUDED.parent_id;
  INSERT INTO categories (id, name, slug, parent_id)
  VALUES (gen_random_uuid()::text, 'Tyre Dealers', 'tyredealer', auto_ervice_andmotoring_id)
  ON CONFLICT (slug) DO UPDATE SET name = EXCLUDED.name, parent_id = EXCLUDED.parent_id;
  INSERT INTO categories (id, name, slug, parent_id)
  VALUES (gen_random_uuid()::text, 'Vehicle Sales', 'vehicle-ale', auto_ervice_andmotoring_id)
  ON CONFLICT (slug) DO UPDATE SET name = EXCLUDED.name, parent_id = EXCLUDED.parent_id;
  INSERT INTO categories (id, name, slug, parent_id)
  VALUES (gen_random_uuid()::text, 'Vulcanizers', 'vulcanizer', auto_ervice_andmotoring_id)
  ON CONFLICT (slug) DO UPDATE SET name = EXCLUDED.name, parent_id = EXCLUDED.parent_id;

  -- Business Services
  INSERT INTO categories (id, name, slug, parent_id)
  VALUES (gen_random_uuid()::text, 'Advertising & Marketing', 'adverti-ingandmarketing', bu_ine_ervice_id)
  ON CONFLICT (slug) DO UPDATE SET name = EXCLUDED.name, parent_id = EXCLUDED.parent_id;
  INSERT INTO categories (id, name, slug, parent_id)
  VALUES (gen_random_uuid()::text, 'Consultants', 'con-ultant', bu_ine_ervice_id)
  ON CONFLICT (slug) DO UPDATE SET name = EXCLUDED.name, parent_id = EXCLUDED.parent_id;
  INSERT INTO categories (id, name, slug, parent_id)
  VALUES (gen_random_uuid()::text, 'Courier & Delivery', 'courieranddelivery', bu_ine_ervice_id)
  ON CONFLICT (slug) DO UPDATE SET name = EXCLUDED.name, parent_id = EXCLUDED.parent_id;
  INSERT INTO categories (id, name, slug, parent_id)
  VALUES (gen_random_uuid()::text, 'Dispatch Riders', 'bu-di-patchrider', bu_ine_ervice_id)
  ON CONFLICT (slug) DO UPDATE SET name = EXCLUDED.name, parent_id = EXCLUDED.parent_id;
  INSERT INTO categories (id, name, slug, parent_id)
  VALUES (gen_random_uuid()::text, 'Human Resources', 'humanre-ource', bu_ine_ervice_id)
  ON CONFLICT (slug) DO UPDATE SET name = EXCLUDED.name, parent_id = EXCLUDED.parent_id;
  INSERT INTO categories (id, name, slug, parent_id)
  VALUES (gen_random_uuid()::text, 'Office Services', 'office-ervice', bu_ine_ervice_id)
  ON CONFLICT (slug) DO UPDATE SET name = EXCLUDED.name, parent_id = EXCLUDED.parent_id;
  INSERT INTO categories (id, name, slug, parent_id)
  VALUES (gen_random_uuid()::text, 'Printing & Branding', 'printingandbranding', bu_ine_ervice_id)
  ON CONFLICT (slug) DO UPDATE SET name = EXCLUDED.name, parent_id = EXCLUDED.parent_id;
  INSERT INTO categories (id, name, slug, parent_id)
  VALUES (gen_random_uuid()::text, 'Public Relations', 'publicrelation', bu_ine_ervice_id)
  ON CONFLICT (slug) DO UPDATE SET name = EXCLUDED.name, parent_id = EXCLUDED.parent_id;
  INSERT INTO categories (id, name, slug, parent_id)
  VALUES (gen_random_uuid()::text, 'Signage & Banners', 'ignageandbanner', bu_ine_ervice_id)
  ON CONFLICT (slug) DO UPDATE SET name = EXCLUDED.name, parent_id = EXCLUDED.parent_id;
  INSERT INTO categories (id, name, slug, parent_id)
  VALUES (gen_random_uuid()::text, 'Training & Development', 'traininganddevelopment', bu_ine_ervice_id)
  ON CONFLICT (slug) DO UPDATE SET name = EXCLUDED.name, parent_id = EXCLUDED.parent_id;

  -- Computers & Technology
  INSERT INTO categories (id, name, slug, parent_id)
  VALUES (gen_random_uuid()::text, 'Apps & Software', 'app-and-oftware', computer_andtechnology_id)
  ON CONFLICT (slug) DO UPDATE SET name = EXCLUDED.name, parent_id = EXCLUDED.parent_id;
  INSERT INTO categories (id, name, slug, parent_id)
  VALUES (gen_random_uuid()::text, 'CCTV & Security Systems', 'cctvand-ecurity-y-tem', computer_andtechnology_id)
  ON CONFLICT (slug) DO UPDATE SET name = EXCLUDED.name, parent_id = EXCLUDED.parent_id;
  INSERT INTO categories (id, name, slug, parent_id)
  VALUES (gen_random_uuid()::text, 'Cloud & Hosting', 'cloudandho-ting', computer_andtechnology_id)
  ON CONFLICT (slug) DO UPDATE SET name = EXCLUDED.name, parent_id = EXCLUDED.parent_id;
  INSERT INTO categories (id, name, slug, parent_id)
  VALUES (gen_random_uuid()::text, 'Computer Repair', 'computerrepair', computer_andtechnology_id)
  ON CONFLICT (slug) DO UPDATE SET name = EXCLUDED.name, parent_id = EXCLUDED.parent_id;
  INSERT INTO categories (id, name, slug, parent_id)
  VALUES (gen_random_uuid()::text, 'Computer Training', 'computer-computertraining', computer_andtechnology_id)
  ON CONFLICT (slug) DO UPDATE SET name = EXCLUDED.name, parent_id = EXCLUDED.parent_id;
  INSERT INTO categories (id, name, slug, parent_id)
  VALUES (gen_random_uuid()::text, 'Cyber Security', 'cyber-ecurity', computer_andtechnology_id)
  ON CONFLICT (slug) DO UPDATE SET name = EXCLUDED.name, parent_id = EXCLUDED.parent_id;
  INSERT INTO categories (id, name, slug, parent_id)
  VALUES (gen_random_uuid()::text, 'FinTech', 'fintech', computer_andtechnology_id)
  ON CONFLICT (slug) DO UPDATE SET name = EXCLUDED.name, parent_id = EXCLUDED.parent_id;
  INSERT INTO categories (id, name, slug, parent_id)
  VALUES (gen_random_uuid()::text, 'Internet Service Providers', 'internet-erviceprovider', computer_andtechnology_id)
  ON CONFLICT (slug) DO UPDATE SET name = EXCLUDED.name, parent_id = EXCLUDED.parent_id;
  INSERT INTO categories (id, name, slug, parent_id)
  VALUES (gen_random_uuid()::text, 'Networking', 'networking', computer_andtechnology_id)
  ON CONFLICT (slug) DO UPDATE SET name = EXCLUDED.name, parent_id = EXCLUDED.parent_id;
  INSERT INTO categories (id, name, slug, parent_id)
  VALUES (gen_random_uuid()::text, 'Phone Repair', 'phonerepair', computer_andtechnology_id)
  ON CONFLICT (slug) DO UPDATE SET name = EXCLUDED.name, parent_id = EXCLUDED.parent_id;
  INSERT INTO categories (id, name, slug, parent_id)
  VALUES (gen_random_uuid()::text, 'POS Services', 'po-ervice', computer_andtechnology_id)
  ON CONFLICT (slug) DO UPDATE SET name = EXCLUDED.name, parent_id = EXCLUDED.parent_id;
  INSERT INTO categories (id, name, slug, parent_id)
  VALUES (gen_random_uuid()::text, 'Web Design & Development', 'webde-ignanddevelopment', computer_andtechnology_id)
  ON CONFLICT (slug) DO UPDATE SET name = EXCLUDED.name, parent_id = EXCLUDED.parent_id;

  -- Construction & Tradesmen
  INSERT INTO categories (id, name, slug, parent_id)
  VALUES (gen_random_uuid()::text, 'Aluminium & Glass', 'aluminiumandgla', con_tructionandtrade_men_id)
  ON CONFLICT (slug) DO UPDATE SET name = EXCLUDED.name, parent_id = EXCLUDED.parent_id;
  INSERT INTO categories (id, name, slug, parent_id)
  VALUES (gen_random_uuid()::text, 'Architectural Services', 'architectural-ervice', con_tructionandtrade_men_id)
  ON CONFLICT (slug) DO UPDATE SET name = EXCLUDED.name, parent_id = EXCLUDED.parent_id;
  INSERT INTO categories (id, name, slug, parent_id)
  VALUES (gen_random_uuid()::text, 'Block & Bricks', 'blockandbrick', con_tructionandtrade_men_id)
  ON CONFLICT (slug) DO UPDATE SET name = EXCLUDED.name, parent_id = EXCLUDED.parent_id;
  INSERT INTO categories (id, name, slug, parent_id)
  VALUES (gen_random_uuid()::text, 'Building Materials', 'buildingmaterial', con_tructionandtrade_men_id)
  ON CONFLICT (slug) DO UPDATE SET name = EXCLUDED.name, parent_id = EXCLUDED.parent_id;
  INSERT INTO categories (id, name, slug, parent_id)
  VALUES (gen_random_uuid()::text, 'Carpentry', 'carpentry', con_tructionandtrade_men_id)
  ON CONFLICT (slug) DO UPDATE SET name = EXCLUDED.name, parent_id = EXCLUDED.parent_id;
  INSERT INTO categories (id, name, slug, parent_id)
  VALUES (gen_random_uuid()::text, 'Concrete & Paving', 'concreteandpaving', con_tructionandtrade_men_id)
  ON CONFLICT (slug) DO UPDATE SET name = EXCLUDED.name, parent_id = EXCLUDED.parent_id;
  INSERT INTO categories (id, name, slug, parent_id)
  VALUES (gen_random_uuid()::text, 'Contractors', 'contractor', con_tructionandtrade_men_id)
  ON CONFLICT (slug) DO UPDATE SET name = EXCLUDED.name, parent_id = EXCLUDED.parent_id;
  INSERT INTO categories (id, name, slug, parent_id)
  VALUES (gen_random_uuid()::text, 'Decorators & Painters', 'decorator-andpainter', con_tructionandtrade_men_id)
  ON CONFLICT (slug) DO UPDATE SET name = EXCLUDED.name, parent_id = EXCLUDED.parent_id;
  INSERT INTO categories (id, name, slug, parent_id)
  VALUES (gen_random_uuid()::text, 'Electrical Installation', 'electricalin-tallation', con_tructionandtrade_men_id)
  ON CONFLICT (slug) DO UPDATE SET name = EXCLUDED.name, parent_id = EXCLUDED.parent_id;
  INSERT INTO categories (id, name, slug, parent_id)
  VALUES (gen_random_uuid()::text, 'Plumbers', 'con-plumber', con_tructionandtrade_men_id)
  ON CONFLICT (slug) DO UPDATE SET name = EXCLUDED.name, parent_id = EXCLUDED.parent_id;
  INSERT INTO categories (id, name, slug, parent_id)
  VALUES (gen_random_uuid()::text, 'Roofing', 'roofing', con_tructionandtrade_men_id)
  ON CONFLICT (slug) DO UPDATE SET name = EXCLUDED.name, parent_id = EXCLUDED.parent_id;
  INSERT INTO categories (id, name, slug, parent_id)
  VALUES (gen_random_uuid()::text, 'Tiling', 'tiling', con_tructionandtrade_men_id)
  ON CONFLICT (slug) DO UPDATE SET name = EXCLUDED.name, parent_id = EXCLUDED.parent_id;
  INSERT INTO categories (id, name, slug, parent_id)
  VALUES (gen_random_uuid()::text, 'Welding & Fabrication', 'weldingandfabrication', con_tructionandtrade_men_id)
  ON CONFLICT (slug) DO UPDATE SET name = EXCLUDED.name, parent_id = EXCLUDED.parent_id;

  -- Education & Training
  INSERT INTO categories (id, name, slug, parent_id)
  VALUES (gen_random_uuid()::text, 'After School Programs', 'after-choolprogram', educationandtraining_id)
  ON CONFLICT (slug) DO UPDATE SET name = EXCLUDED.name, parent_id = EXCLUDED.parent_id;
  INSERT INTO categories (id, name, slug, parent_id)
  VALUES (gen_random_uuid()::text, 'Computer Training', 'educationandtraining-computertraining', educationandtraining_id)
  ON CONFLICT (slug) DO UPDATE SET name = EXCLUDED.name, parent_id = EXCLUDED.parent_id;
  INSERT INTO categories (id, name, slug, parent_id)
  VALUES (gen_random_uuid()::text, 'Crèches & Daycare', 'creche-anddaycare', educationandtraining_id)
  ON CONFLICT (slug) DO UPDATE SET name = EXCLUDED.name, parent_id = EXCLUDED.parent_id;
  INSERT INTO categories (id, name, slug, parent_id)
  VALUES (gen_random_uuid()::text, 'Driving Schools', 'educationandtraining-driving-chool', educationandtraining_id)
  ON CONFLICT (slug) DO UPDATE SET name = EXCLUDED.name, parent_id = EXCLUDED.parent_id;
  INSERT INTO categories (id, name, slug, parent_id)
  VALUES (gen_random_uuid()::text, 'Language Schools', 'language-chool', educationandtraining_id)
  ON CONFLICT (slug) DO UPDATE SET name = EXCLUDED.name, parent_id = EXCLUDED.parent_id;
  INSERT INTO categories (id, name, slug, parent_id)
  VALUES (gen_random_uuid()::text, 'Lesson Teachers & Tutoring', 'le-onteacher-andtutoring', educationandtraining_id)
  ON CONFLICT (slug) DO UPDATE SET name = EXCLUDED.name, parent_id = EXCLUDED.parent_id;
  INSERT INTO categories (id, name, slug, parent_id)
  VALUES (gen_random_uuid()::text, 'Schools & Colleges', 'chool-andcollege', educationandtraining_id)
  ON CONFLICT (slug) DO UPDATE SET name = EXCLUDED.name, parent_id = EXCLUDED.parent_id;
  INSERT INTO categories (id, name, slug, parent_id)
  VALUES (gen_random_uuid()::text, 'Universities', 'univer-itie', educationandtraining_id)
  ON CONFLICT (slug) DO UPDATE SET name = EXCLUDED.name, parent_id = EXCLUDED.parent_id;
  INSERT INTO categories (id, name, slug, parent_id)
  VALUES (gen_random_uuid()::text, 'Vocational Training', 'vocationaltraining', educationandtraining_id)
  ON CONFLICT (slug) DO UPDATE SET name = EXCLUDED.name, parent_id = EXCLUDED.parent_id;

  -- Entertainment & Leisure
  INSERT INTO categories (id, name, slug, parent_id)
  VALUES (gen_random_uuid()::text, 'Amusement & Game Centres', 'amu-ementandgamecentre', entertainmentandlei_ure_id)
  ON CONFLICT (slug) DO UPDATE SET name = EXCLUDED.name, parent_id = EXCLUDED.parent_id;
  INSERT INTO categories (id, name, slug, parent_id)
  VALUES (gen_random_uuid()::text, 'Arts & Crafts', 'art-andcraft', entertainmentandlei_ure_id)
  ON CONFLICT (slug) DO UPDATE SET name = EXCLUDED.name, parent_id = EXCLUDED.parent_id;
  INSERT INTO categories (id, name, slug, parent_id)
  VALUES (gen_random_uuid()::text, 'Cinemas', 'cinema', entertainmentandlei_ure_id)
  ON CONFLICT (slug) DO UPDATE SET name = EXCLUDED.name, parent_id = EXCLUDED.parent_id;
  INSERT INTO categories (id, name, slug, parent_id)
  VALUES (gen_random_uuid()::text, 'Clubs & Lounges', 'club-andlounge', entertainmentandlei_ure_id)
  ON CONFLICT (slug) DO UPDATE SET name = EXCLUDED.name, parent_id = EXCLUDED.parent_id;
  INSERT INTO categories (id, name, slug, parent_id)
  VALUES (gen_random_uuid()::text, 'Music & DJs', 'mu-icanddj', entertainmentandlei_ure_id)
  ON CONFLICT (slug) DO UPDATE SET name = EXCLUDED.name, parent_id = EXCLUDED.parent_id;
  INSERT INTO categories (id, name, slug, parent_id)
  VALUES (gen_random_uuid()::text, 'Recreation & Sports', 'recreationand-port', entertainmentandlei_ure_id)
  ON CONFLICT (slug) DO UPDATE SET name = EXCLUDED.name, parent_id = EXCLUDED.parent_id;
  INSERT INTO categories (id, name, slug, parent_id)
  VALUES (gen_random_uuid()::text, 'Streaming & Content', 'treamingandcontent', entertainmentandlei_ure_id)
  ON CONFLICT (slug) DO UPDATE SET name = EXCLUDED.name, parent_id = EXCLUDED.parent_id;

  -- Events & Weddings
  INSERT INTO categories (id, name, slug, parent_id)
  VALUES (gen_random_uuid()::text, 'Caterers', 'caterer', event_andwedding_id)
  ON CONFLICT (slug) DO UPDATE SET name = EXCLUDED.name, parent_id = EXCLUDED.parent_id;
  INSERT INTO categories (id, name, slug, parent_id)
  VALUES (gen_random_uuid()::text, 'Decorators', 'decorator', event_andwedding_id)
  ON CONFLICT (slug) DO UPDATE SET name = EXCLUDED.name, parent_id = EXCLUDED.parent_id;
  INSERT INTO categories (id, name, slug, parent_id)
  VALUES (gen_random_uuid()::text, 'DJs & MCs', 'dj-andmc', event_andwedding_id)
  ON CONFLICT (slug) DO UPDATE SET name = EXCLUDED.name, parent_id = EXCLUDED.parent_id;
  INSERT INTO categories (id, name, slug, parent_id)
  VALUES (gen_random_uuid()::text, 'Event Equipment Rental', 'eventequipmentrental', event_andwedding_id)
  ON CONFLICT (slug) DO UPDATE SET name = EXCLUDED.name, parent_id = EXCLUDED.parent_id;
  INSERT INTO categories (id, name, slug, parent_id)
  VALUES (gen_random_uuid()::text, 'Event Planners', 'eventplanner', event_andwedding_id)
  ON CONFLICT (slug) DO UPDATE SET name = EXCLUDED.name, parent_id = EXCLUDED.parent_id;
  INSERT INTO categories (id, name, slug, parent_id)
  VALUES (gen_random_uuid()::text, 'Photographers', 'photographer', event_andwedding_id)
  ON CONFLICT (slug) DO UPDATE SET name = EXCLUDED.name, parent_id = EXCLUDED.parent_id;
  INSERT INTO categories (id, name, slug, parent_id)
  VALUES (gen_random_uuid()::text, 'Venues & Event Halls', 'venue-andeventhall', event_andwedding_id)
  ON CONFLICT (slug) DO UPDATE SET name = EXCLUDED.name, parent_id = EXCLUDED.parent_id;
  INSERT INTO categories (id, name, slug, parent_id)
  VALUES (gen_random_uuid()::text, 'Videographers', 'videographer', event_andwedding_id)
  ON CONFLICT (slug) DO UPDATE SET name = EXCLUDED.name, parent_id = EXCLUDED.parent_id;
  INSERT INTO categories (id, name, slug, parent_id)
  VALUES (gen_random_uuid()::text, 'Wedding Services', 'wedding-ervice', event_andwedding_id)
  ON CONFLICT (slug) DO UPDATE SET name = EXCLUDED.name, parent_id = EXCLUDED.parent_id;

  -- Fashion & Beauty
  INSERT INTO categories (id, name, slug, parent_id)
  VALUES (gen_random_uuid()::text, 'Barber Shops', 'barber-hop', fa_hionandbeauty_id)
  ON CONFLICT (slug) DO UPDATE SET name = EXCLUDED.name, parent_id = EXCLUDED.parent_id;
  INSERT INTO categories (id, name, slug, parent_id)
  VALUES (gen_random_uuid()::text, 'Beauty Products', 'beautyproduct', fa_hionandbeauty_id)
  ON CONFLICT (slug) DO UPDATE SET name = EXCLUDED.name, parent_id = EXCLUDED.parent_id;
  INSERT INTO categories (id, name, slug, parent_id)
  VALUES (gen_random_uuid()::text, 'Cosmetics', 'co-metic', fa_hionandbeauty_id)
  ON CONFLICT (slug) DO UPDATE SET name = EXCLUDED.name, parent_id = EXCLUDED.parent_id;
  INSERT INTO categories (id, name, slug, parent_id)
  VALUES (gen_random_uuid()::text, 'Fabric Stores', 'fabric-tore', fa_hionandbeauty_id)
  ON CONFLICT (slug) DO UPDATE SET name = EXCLUDED.name, parent_id = EXCLUDED.parent_id;
  INSERT INTO categories (id, name, slug, parent_id)
  VALUES (gen_random_uuid()::text, 'Fashion Designers', 'fa-hionde-igner', fa_hionandbeauty_id)
  ON CONFLICT (slug) DO UPDATE SET name = EXCLUDED.name, parent_id = EXCLUDED.parent_id;
  INSERT INTO categories (id, name, slug, parent_id)
  VALUES (gen_random_uuid()::text, 'Hair Salons', 'hair-alon', fa_hionandbeauty_id)
  ON CONFLICT (slug) DO UPDATE SET name = EXCLUDED.name, parent_id = EXCLUDED.parent_id;
  INSERT INTO categories (id, name, slug, parent_id)
  VALUES (gen_random_uuid()::text, 'Jewellery', 'jewellery', fa_hionandbeauty_id)
  ON CONFLICT (slug) DO UPDATE SET name = EXCLUDED.name, parent_id = EXCLUDED.parent_id;
  INSERT INTO categories (id, name, slug, parent_id)
  VALUES (gen_random_uuid()::text, 'Makeup Artists', 'makeuparti-t', fa_hionandbeauty_id)
  ON CONFLICT (slug) DO UPDATE SET name = EXCLUDED.name, parent_id = EXCLUDED.parent_id;
  INSERT INTO categories (id, name, slug, parent_id)
  VALUES (gen_random_uuid()::text, 'Nail Studios', 'nail-tudio', fa_hionandbeauty_id)
  ON CONFLICT (slug) DO UPDATE SET name = EXCLUDED.name, parent_id = EXCLUDED.parent_id;
  INSERT INTO categories (id, name, slug, parent_id)
  VALUES (gen_random_uuid()::text, 'Shoe Makers', 'hoemaker', fa_hionandbeauty_id)
  ON CONFLICT (slug) DO UPDATE SET name = EXCLUDED.name, parent_id = EXCLUDED.parent_id;
  INSERT INTO categories (id, name, slug, parent_id)
  VALUES (gen_random_uuid()::text, 'Tailors & Alterations', 'tailor-andalteration', fa_hionandbeauty_id)
  ON CONFLICT (slug) DO UPDATE SET name = EXCLUDED.name, parent_id = EXCLUDED.parent_id;

  -- Finance & Insurance
  INSERT INTO categories (id, name, slug, parent_id)
  VALUES (gen_random_uuid()::text, 'Accountants & Auditors', 'accountant-andauditor', financeandin_urance_id)
  ON CONFLICT (slug) DO UPDATE SET name = EXCLUDED.name, parent_id = EXCLUDED.parent_id;
  INSERT INTO categories (id, name, slug, parent_id)
  VALUES (gen_random_uuid()::text, 'Banks & Microfinance', 'bank-andmicrofinance', financeandin_urance_id)
  ON CONFLICT (slug) DO UPDATE SET name = EXCLUDED.name, parent_id = EXCLUDED.parent_id;
  INSERT INTO categories (id, name, slug, parent_id)
  VALUES (gen_random_uuid()::text, 'Crowdfunding & Investment', 'crowdfundingandinve-tment', financeandin_urance_id)
  ON CONFLICT (slug) DO UPDATE SET name = EXCLUDED.name, parent_id = EXCLUDED.parent_id;
  INSERT INTO categories (id, name, slug, parent_id)
  VALUES (gen_random_uuid()::text, 'Insurance Agents', 'in-uranceagent', financeandin_urance_id)
  ON CONFLICT (slug) DO UPDATE SET name = EXCLUDED.name, parent_id = EXCLUDED.parent_id;
  INSERT INTO categories (id, name, slug, parent_id)
  VALUES (gen_random_uuid()::text, 'Mobile Money & POS', 'mobilemoneyandpo', financeandin_urance_id)
  ON CONFLICT (slug) DO UPDATE SET name = EXCLUDED.name, parent_id = EXCLUDED.parent_id;
  INSERT INTO categories (id, name, slug, parent_id)
  VALUES (gen_random_uuid()::text, 'Payroll Services', 'payroll-ervice', financeandin_urance_id)
  ON CONFLICT (slug) DO UPDATE SET name = EXCLUDED.name, parent_id = EXCLUDED.parent_id;
  INSERT INTO categories (id, name, slug, parent_id)
  VALUES (gen_random_uuid()::text, 'Tax Consultants', 'taxcon-ultant', financeandin_urance_id)
  ON CONFLICT (slug) DO UPDATE SET name = EXCLUDED.name, parent_id = EXCLUDED.parent_id;

  -- Food & Dining
  INSERT INTO categories (id, name, slug, parent_id)
  VALUES (gen_random_uuid()::text, 'Bakeries', 'bakerie', foodanddining_id)
  ON CONFLICT (slug) DO UPDATE SET name = EXCLUDED.name, parent_id = EXCLUDED.parent_id;
  INSERT INTO categories (id, name, slug, parent_id)
  VALUES (gen_random_uuid()::text, 'Cafes & Coffee Shops', 'cafe-andcoffee-hop', foodanddining_id)
  ON CONFLICT (slug) DO UPDATE SET name = EXCLUDED.name, parent_id = EXCLUDED.parent_id;
  INSERT INTO categories (id, name, slug, parent_id)
  VALUES (gen_random_uuid()::text, 'Catering Services', 'catering-ervice', foodanddining_id)
  ON CONFLICT (slug) DO UPDATE SET name = EXCLUDED.name, parent_id = EXCLUDED.parent_id;
  INSERT INTO categories (id, name, slug, parent_id)
  VALUES (gen_random_uuid()::text, 'Fast Food & Takeaway', 'fa-tfoodandtakeaway', foodanddining_id)
  ON CONFLICT (slug) DO UPDATE SET name = EXCLUDED.name, parent_id = EXCLUDED.parent_id;
  INSERT INTO categories (id, name, slug, parent_id)
  VALUES (gen_random_uuid()::text, 'Food Manufacturing', 'foodmanufacturing', foodanddining_id)
  ON CONFLICT (slug) DO UPDATE SET name = EXCLUDED.name, parent_id = EXCLUDED.parent_id;
  INSERT INTO categories (id, name, slug, parent_id)
  VALUES (gen_random_uuid()::text, 'Food Vendors & Bukka', 'foodvendor-andbukka', foodanddining_id)
  ON CONFLICT (slug) DO UPDATE SET name = EXCLUDED.name, parent_id = EXCLUDED.parent_id;
  INSERT INTO categories (id, name, slug, parent_id)
  VALUES (gen_random_uuid()::text, 'Restaurants', 're-taurant', foodanddining_id)
  ON CONFLICT (slug) DO UPDATE SET name = EXCLUDED.name, parent_id = EXCLUDED.parent_id;
  INSERT INTO categories (id, name, slug, parent_id)
  VALUES (gen_random_uuid()::text, 'Suya & Grills', 'uyaandgrill', foodanddining_id)
  ON CONFLICT (slug) DO UPDATE SET name = EXCLUDED.name, parent_id = EXCLUDED.parent_id;
  INSERT INTO categories (id, name, slug, parent_id)
  VALUES (gen_random_uuid()::text, 'Supermarkets & Provision Stores', 'upermarket-andprovi-ion-tore', foodanddining_id)
  ON CONFLICT (slug) DO UPDATE SET name = EXCLUDED.name, parent_id = EXCLUDED.parent_id;
  INSERT INTO categories (id, name, slug, parent_id)
  VALUES (gen_random_uuid()::text, 'Wine & Drinks', 'wineanddrink', foodanddining_id)
  ON CONFLICT (slug) DO UPDATE SET name = EXCLUDED.name, parent_id = EXCLUDED.parent_id;

  -- Health & Medical
  INSERT INTO categories (id, name, slug, parent_id)
  VALUES (gen_random_uuid()::text, 'Clinics & Hospitals', 'clinic-andho-pital', healthandmedical_id)
  ON CONFLICT (slug) DO UPDATE SET name = EXCLUDED.name, parent_id = EXCLUDED.parent_id;
  INSERT INTO categories (id, name, slug, parent_id)
  VALUES (gen_random_uuid()::text, 'Dentists', 'denti-t', healthandmedical_id)
  ON CONFLICT (slug) DO UPDATE SET name = EXCLUDED.name, parent_id = EXCLUDED.parent_id;
  INSERT INTO categories (id, name, slug, parent_id)
  VALUES (gen_random_uuid()::text, 'Diagnostics & Labs', 'diagno-tic-andlab', healthandmedical_id)
  ON CONFLICT (slug) DO UPDATE SET name = EXCLUDED.name, parent_id = EXCLUDED.parent_id;
  INSERT INTO categories (id, name, slug, parent_id)
  VALUES (gen_random_uuid()::text, 'Doctors', 'doctor', healthandmedical_id)
  ON CONFLICT (slug) DO UPDATE SET name = EXCLUDED.name, parent_id = EXCLUDED.parent_id;
  INSERT INTO categories (id, name, slug, parent_id)
  VALUES (gen_random_uuid()::text, 'Gyms & Fitness', 'gym-andfitne', healthandmedical_id)
  ON CONFLICT (slug) DO UPDATE SET name = EXCLUDED.name, parent_id = EXCLUDED.parent_id;
  INSERT INTO categories (id, name, slug, parent_id)
  VALUES (gen_random_uuid()::text, 'Mental Health', 'mentalhealth', healthandmedical_id)
  ON CONFLICT (slug) DO UPDATE SET name = EXCLUDED.name, parent_id = EXCLUDED.parent_id;
  INSERT INTO categories (id, name, slug, parent_id)
  VALUES (gen_random_uuid()::text, 'Nursing & Home Care', 'nur-ingandhomecare', healthandmedical_id)
  ON CONFLICT (slug) DO UPDATE SET name = EXCLUDED.name, parent_id = EXCLUDED.parent_id;
  INSERT INTO categories (id, name, slug, parent_id)
  VALUES (gen_random_uuid()::text, 'Opticians', 'optician', healthandmedical_id)
  ON CONFLICT (slug) DO UPDATE SET name = EXCLUDED.name, parent_id = EXCLUDED.parent_id;
  INSERT INTO categories (id, name, slug, parent_id)
  VALUES (gen_random_uuid()::text, 'Pharmacies', 'pharmacie', healthandmedical_id)
  ON CONFLICT (slug) DO UPDATE SET name = EXCLUDED.name, parent_id = EXCLUDED.parent_id;
  INSERT INTO categories (id, name, slug, parent_id)
  VALUES (gen_random_uuid()::text, 'Spa & Massage', 'paandma-age', healthandmedical_id)
  ON CONFLICT (slug) DO UPDATE SET name = EXCLUDED.name, parent_id = EXCLUDED.parent_id;
  INSERT INTO categories (id, name, slug, parent_id)
  VALUES (gen_random_uuid()::text, 'Traditional & Alternative Medicine', 'traditionalandalternativemedicine', healthandmedical_id)
  ON CONFLICT (slug) DO UPDATE SET name = EXCLUDED.name, parent_id = EXCLUDED.parent_id;
  INSERT INTO categories (id, name, slug, parent_id)
  VALUES (gen_random_uuid()::text, 'Veterinary', 'veterinary', healthandmedical_id)
  ON CONFLICT (slug) DO UPDATE SET name = EXCLUDED.name, parent_id = EXCLUDED.parent_id;

  -- Home Services
  INSERT INTO categories (id, name, slug, parent_id)
  VALUES (gen_random_uuid()::text, 'AC Repair & Installation', 'acrepairandin-tallation', home_ervice_id)
  ON CONFLICT (slug) DO UPDATE SET name = EXCLUDED.name, parent_id = EXCLUDED.parent_id;
  INSERT INTO categories (id, name, slug, parent_id)
  VALUES (gen_random_uuid()::text, 'Cleaners & Housekeeping', 'cleaner-andhou-ekeeping', home_ervice_id)
  ON CONFLICT (slug) DO UPDATE SET name = EXCLUDED.name, parent_id = EXCLUDED.parent_id;
  INSERT INTO categories (id, name, slug, parent_id)
  VALUES (gen_random_uuid()::text, 'Electricians', 'electrician', home_ervice_id)
  ON CONFLICT (slug) DO UPDATE SET name = EXCLUDED.name, parent_id = EXCLUDED.parent_id;
  INSERT INTO categories (id, name, slug, parent_id)
  VALUES (gen_random_uuid()::text, 'Fumigation & Pest Control', 'fumigationandpe-tcontrol', home_ervice_id)
  ON CONFLICT (slug) DO UPDATE SET name = EXCLUDED.name, parent_id = EXCLUDED.parent_id;
  INSERT INTO categories (id, name, slug, parent_id)
  VALUES (gen_random_uuid()::text, 'Gardeners & Landscaping', 'gardener-andland-caping', home_ervice_id)
  ON CONFLICT (slug) DO UPDATE SET name = EXCLUDED.name, parent_id = EXCLUDED.parent_id;
  INSERT INTO categories (id, name, slug, parent_id)
  VALUES (gen_random_uuid()::text, 'Interior Design', 'interiorde-ign', home_ervice_id)
  ON CONFLICT (slug) DO UPDATE SET name = EXCLUDED.name, parent_id = EXCLUDED.parent_id;
  INSERT INTO categories (id, name, slug, parent_id)
  VALUES (gen_random_uuid()::text, 'Laundry & Dry Cleaning', 'laundryanddrycleaning', home_ervice_id)
  ON CONFLICT (slug) DO UPDATE SET name = EXCLUDED.name, parent_id = EXCLUDED.parent_id;
  INSERT INTO categories (id, name, slug, parent_id)
  VALUES (gen_random_uuid()::text, 'Locksmiths', 'lock-mith', home_ervice_id)
  ON CONFLICT (slug) DO UPDATE SET name = EXCLUDED.name, parent_id = EXCLUDED.parent_id;
  INSERT INTO categories (id, name, slug, parent_id)
  VALUES (gen_random_uuid()::text, 'Painters', 'painter', home_ervice_id)
  ON CONFLICT (slug) DO UPDATE SET name = EXCLUDED.name, parent_id = EXCLUDED.parent_id;
  INSERT INTO categories (id, name, slug, parent_id)
  VALUES (gen_random_uuid()::text, 'Plumbers', 'home-plumber', home_ervice_id)
  ON CONFLICT (slug) DO UPDATE SET name = EXCLUDED.name, parent_id = EXCLUDED.parent_id;
  INSERT INTO categories (id, name, slug, parent_id)
  VALUES (gen_random_uuid()::text, 'Waste Disposal', 'wa-tedi-po-al', home_ervice_id)
  ON CONFLICT (slug) DO UPDATE SET name = EXCLUDED.name, parent_id = EXCLUDED.parent_id;

  -- Legal Services
  INSERT INTO categories (id, name, slug, parent_id)
  VALUES (gen_random_uuid()::text, 'Corporate Law', 'corporatelaw', legal_ervice_id)
  ON CONFLICT (slug) DO UPDATE SET name = EXCLUDED.name, parent_id = EXCLUDED.parent_id;
  INSERT INTO categories (id, name, slug, parent_id)
  VALUES (gen_random_uuid()::text, 'Family Law', 'familylaw', legal_ervice_id)
  ON CONFLICT (slug) DO UPDATE SET name = EXCLUDED.name, parent_id = EXCLUDED.parent_id;
  INSERT INTO categories (id, name, slug, parent_id)
  VALUES (gen_random_uuid()::text, 'Immigration & Visa', 'immigrationandvi-a', legal_ervice_id)
  ON CONFLICT (slug) DO UPDATE SET name = EXCLUDED.name, parent_id = EXCLUDED.parent_id;
  INSERT INTO categories (id, name, slug, parent_id)
  VALUES (gen_random_uuid()::text, 'Lawyers & Solicitors', 'lawyer-and-olicitor', legal_ervice_id)
  ON CONFLICT (slug) DO UPDATE SET name = EXCLUDED.name, parent_id = EXCLUDED.parent_id;
  INSERT INTO categories (id, name, slug, parent_id)
  VALUES (gen_random_uuid()::text, 'Notary Public', 'notarypublic', legal_ervice_id)
  ON CONFLICT (slug) DO UPDATE SET name = EXCLUDED.name, parent_id = EXCLUDED.parent_id;
  INSERT INTO categories (id, name, slug, parent_id)
  VALUES (gen_random_uuid()::text, 'Property Law', 'propertylaw', legal_ervice_id)
  ON CONFLICT (slug) DO UPDATE SET name = EXCLUDED.name, parent_id = EXCLUDED.parent_id;

  -- Logistics & Transport
  INSERT INTO categories (id, name, slug, parent_id)
  VALUES (gen_random_uuid()::text, 'Air Freight', 'airfreight', logi_tic_andtran_port_id)
  ON CONFLICT (slug) DO UPDATE SET name = EXCLUDED.name, parent_id = EXCLUDED.parent_id;
  INSERT INTO categories (id, name, slug, parent_id)
  VALUES (gen_random_uuid()::text, 'Bus & Public Transport', 'bu-andpublictran-port', logi_tic_andtran_port_id)
  ON CONFLICT (slug) DO UPDATE SET name = EXCLUDED.name, parent_id = EXCLUDED.parent_id;
  INSERT INTO categories (id, name, slug, parent_id)
  VALUES (gen_random_uuid()::text, 'Cargo & Shipping', 'cargoand-hipping', logi_tic_andtran_port_id)
  ON CONFLICT (slug) DO UPDATE SET name = EXCLUDED.name, parent_id = EXCLUDED.parent_id;
  INSERT INTO categories (id, name, slug, parent_id)
  VALUES (gen_random_uuid()::text, 'Courier Services', 'courier-ervice', logi_tic_andtran_port_id)
  ON CONFLICT (slug) DO UPDATE SET name = EXCLUDED.name, parent_id = EXCLUDED.parent_id;
  INSERT INTO categories (id, name, slug, parent_id)
  VALUES (gen_random_uuid()::text, 'Dispatch Riders', 'logi-di-patchrider', logi_tic_andtran_port_id)
  ON CONFLICT (slug) DO UPDATE SET name = EXCLUDED.name, parent_id = EXCLUDED.parent_id;
  INSERT INTO categories (id, name, slug, parent_id)
  VALUES (gen_random_uuid()::text, 'Haulage & Trucking', 'haulageandtrucking', logi_tic_andtran_port_id)
  ON CONFLICT (slug) DO UPDATE SET name = EXCLUDED.name, parent_id = EXCLUDED.parent_id;
  INSERT INTO categories (id, name, slug, parent_id)
  VALUES (gen_random_uuid()::text, 'Moving & Relocation', 'movingandrelocation', logi_tic_andtran_port_id)
  ON CONFLICT (slug) DO UPDATE SET name = EXCLUDED.name, parent_id = EXCLUDED.parent_id;
  INSERT INTO categories (id, name, slug, parent_id)
  VALUES (gen_random_uuid()::text, 'Taxis & Ride-Hailing', 'taxi-andride-hailing', logi_tic_andtran_port_id)
  ON CONFLICT (slug) DO UPDATE SET name = EXCLUDED.name, parent_id = EXCLUDED.parent_id;
  INSERT INTO categories (id, name, slug, parent_id)
  VALUES (gen_random_uuid()::text, 'Warehousing', 'warehou-ing', logi_tic_andtran_port_id)
  ON CONFLICT (slug) DO UPDATE SET name = EXCLUDED.name, parent_id = EXCLUDED.parent_id;

  -- Manufacturing & Industry
  INSERT INTO categories (id, name, slug, parent_id)
  VALUES (gen_random_uuid()::text, 'Chemicals', 'chemical', manufacturingandindu_try_id)
  ON CONFLICT (slug) DO UPDATE SET name = EXCLUDED.name, parent_id = EXCLUDED.parent_id;
  INSERT INTO categories (id, name, slug, parent_id)
  VALUES (gen_random_uuid()::text, 'Electrical Equipment', 'electricalequipment', manufacturingandindu_try_id)
  ON CONFLICT (slug) DO UPDATE SET name = EXCLUDED.name, parent_id = EXCLUDED.parent_id;
  INSERT INTO categories (id, name, slug, parent_id)
  VALUES (gen_random_uuid()::text, 'Energy & Power', 'energyandpower', manufacturingandindu_try_id)
  ON CONFLICT (slug) DO UPDATE SET name = EXCLUDED.name, parent_id = EXCLUDED.parent_id;
  INSERT INTO categories (id, name, slug, parent_id)
  VALUES (gen_random_uuid()::text, 'Engineering Services', 'engineering-ervice', manufacturingandindu_try_id)
  ON CONFLICT (slug) DO UPDATE SET name = EXCLUDED.name, parent_id = EXCLUDED.parent_id;
  INSERT INTO categories (id, name, slug, parent_id)
  VALUES (gen_random_uuid()::text, 'Food Processing', 'foodproce-ing', manufacturingandindu_try_id)
  ON CONFLICT (slug) DO UPDATE SET name = EXCLUDED.name, parent_id = EXCLUDED.parent_id;
  INSERT INTO categories (id, name, slug, parent_id)
  VALUES (gen_random_uuid()::text, 'Furniture Manufacturing', 'furnituremanufacturing', manufacturingandindu_try_id)
  ON CONFLICT (slug) DO UPDATE SET name = EXCLUDED.name, parent_id = EXCLUDED.parent_id;
  INSERT INTO categories (id, name, slug, parent_id)
  VALUES (gen_random_uuid()::text, 'Industrial Equipment', 'indu-trialequipment', manufacturingandindu_try_id)
  ON CONFLICT (slug) DO UPDATE SET name = EXCLUDED.name, parent_id = EXCLUDED.parent_id;
  INSERT INTO categories (id, name, slug, parent_id)
  VALUES (gen_random_uuid()::text, 'Oil & Gas', 'oilandga', manufacturingandindu_try_id)
  ON CONFLICT (slug) DO UPDATE SET name = EXCLUDED.name, parent_id = EXCLUDED.parent_id;
  INSERT INTO categories (id, name, slug, parent_id)
  VALUES (gen_random_uuid()::text, 'Packaging', 'packaging', manufacturingandindu_try_id)
  ON CONFLICT (slug) DO UPDATE SET name = EXCLUDED.name, parent_id = EXCLUDED.parent_id;
  INSERT INTO categories (id, name, slug, parent_id)
  VALUES (gen_random_uuid()::text, 'Plastics & Rubber', 'pla-tic-andrubber', manufacturingandindu_try_id)
  ON CONFLICT (slug) DO UPDATE SET name = EXCLUDED.name, parent_id = EXCLUDED.parent_id;
  INSERT INTO categories (id, name, slug, parent_id)
  VALUES (gen_random_uuid()::text, 'Steel & Metal Works', 'teelandmetalwork', manufacturingandindu_try_id)
  ON CONFLICT (slug) DO UPDATE SET name = EXCLUDED.name, parent_id = EXCLUDED.parent_id;
  INSERT INTO categories (id, name, slug, parent_id)
  VALUES (gen_random_uuid()::text, 'Textiles', 'textile', manufacturingandindu_try_id)
  ON CONFLICT (slug) DO UPDATE SET name = EXCLUDED.name, parent_id = EXCLUDED.parent_id;
  INSERT INTO categories (id, name, slug, parent_id)
  VALUES (gen_random_uuid()::text, 'Water Treatment', 'watertreatment', manufacturingandindu_try_id)
  ON CONFLICT (slug) DO UPDATE SET name = EXCLUDED.name, parent_id = EXCLUDED.parent_id;

  -- Property & Real Estate
  INSERT INTO categories (id, name, slug, parent_id)
  VALUES (gen_random_uuid()::text, 'Commercial Property', 'commercialproperty', propertyandreale_tate_id)
  ON CONFLICT (slug) DO UPDATE SET name = EXCLUDED.name, parent_id = EXCLUDED.parent_id;
  INSERT INTO categories (id, name, slug, parent_id)
  VALUES (gen_random_uuid()::text, 'Coworking Spaces', 'coworking-pace', propertyandreale_tate_id)
  ON CONFLICT (slug) DO UPDATE SET name = EXCLUDED.name, parent_id = EXCLUDED.parent_id;
  INSERT INTO categories (id, name, slug, parent_id)
  VALUES (gen_random_uuid()::text, 'Estate Agents', 'e-tateagent', propertyandreale_tate_id)
  ON CONFLICT (slug) DO UPDATE SET name = EXCLUDED.name, parent_id = EXCLUDED.parent_id;
  INSERT INTO categories (id, name, slug, parent_id)
  VALUES (gen_random_uuid()::text, 'Facility Management', 'facilitymanagement', propertyandreale_tate_id)
  ON CONFLICT (slug) DO UPDATE SET name = EXCLUDED.name, parent_id = EXCLUDED.parent_id;
  INSERT INTO categories (id, name, slug, parent_id)
  VALUES (gen_random_uuid()::text, 'Land Agents', 'landagent', propertyandreale_tate_id)
  ON CONFLICT (slug) DO UPDATE SET name = EXCLUDED.name, parent_id = EXCLUDED.parent_id;
  INSERT INTO categories (id, name, slug, parent_id)
  VALUES (gen_random_uuid()::text, 'Property Development', 'propertydevelopment', propertyandreale_tate_id)
  ON CONFLICT (slug) DO UPDATE SET name = EXCLUDED.name, parent_id = EXCLUDED.parent_id;
  INSERT INTO categories (id, name, slug, parent_id)
  VALUES (gen_random_uuid()::text, 'Property Management', 'propertymanagement', propertyandreale_tate_id)
  ON CONFLICT (slug) DO UPDATE SET name = EXCLUDED.name, parent_id = EXCLUDED.parent_id;
  INSERT INTO categories (id, name, slug, parent_id)
  VALUES (gen_random_uuid()::text, 'Short-Let Apartments', 'hort-letapartment', propertyandreale_tate_id)
  ON CONFLICT (slug) DO UPDATE SET name = EXCLUDED.name, parent_id = EXCLUDED.parent_id;

  -- Religious & Community
  INSERT INTO categories (id, name, slug, parent_id)
  VALUES (gen_random_uuid()::text, 'Charity & NGOs', 'charityandngo', religiou_andcommunity_id)
  ON CONFLICT (slug) DO UPDATE SET name = EXCLUDED.name, parent_id = EXCLUDED.parent_id;
  INSERT INTO categories (id, name, slug, parent_id)
  VALUES (gen_random_uuid()::text, 'Churches', 'churche', religiou_andcommunity_id)
  ON CONFLICT (slug) DO UPDATE SET name = EXCLUDED.name, parent_id = EXCLUDED.parent_id;
  INSERT INTO categories (id, name, slug, parent_id)
  VALUES (gen_random_uuid()::text, 'Community Centres', 'communitycentre', religiou_andcommunity_id)
  ON CONFLICT (slug) DO UPDATE SET name = EXCLUDED.name, parent_id = EXCLUDED.parent_id;
  INSERT INTO categories (id, name, slug, parent_id)
  VALUES (gen_random_uuid()::text, 'Counselling', 'coun-elling', religiou_andcommunity_id)
  ON CONFLICT (slug) DO UPDATE SET name = EXCLUDED.name, parent_id = EXCLUDED.parent_id;
  INSERT INTO categories (id, name, slug, parent_id)
  VALUES (gen_random_uuid()::text, 'Mosques', 'mo-que', religiou_andcommunity_id)
  ON CONFLICT (slug) DO UPDATE SET name = EXCLUDED.name, parent_id = EXCLUDED.parent_id;
  INSERT INTO categories (id, name, slug, parent_id)
  VALUES (gen_random_uuid()::text, 'Youth Organizations', 'youthorganization', religiou_andcommunity_id)
  ON CONFLICT (slug) DO UPDATE SET name = EXCLUDED.name, parent_id = EXCLUDED.parent_id;

  -- Shopping & Retail
  INSERT INTO categories (id, name, slug, parent_id)
  VALUES (gen_random_uuid()::text, 'Baby & Kids Stores', 'babyandkid-tore', hoppingandretail_id)
  ON CONFLICT (slug) DO UPDATE SET name = EXCLUDED.name, parent_id = EXCLUDED.parent_id;
  INSERT INTO categories (id, name, slug, parent_id)
  VALUES (gen_random_uuid()::text, 'Books & Stationery', 'book-and-tationery', hoppingandretail_id)
  ON CONFLICT (slug) DO UPDATE SET name = EXCLUDED.name, parent_id = EXCLUDED.parent_id;
  INSERT INTO categories (id, name, slug, parent_id)
  VALUES (gen_random_uuid()::text, 'Clothing & Accessories', 'clothingandacce-orie', hoppingandretail_id)
  ON CONFLICT (slug) DO UPDATE SET name = EXCLUDED.name, parent_id = EXCLUDED.parent_id;
  INSERT INTO categories (id, name, slug, parent_id)
  VALUES (gen_random_uuid()::text, 'Electronics & Gadgets', 'electronic-andgadget', hoppingandretail_id)
  ON CONFLICT (slug) DO UPDATE SET name = EXCLUDED.name, parent_id = EXCLUDED.parent_id;
  INSERT INTO categories (id, name, slug, parent_id)
  VALUES (gen_random_uuid()::text, 'Gift Shops', 'gift-hop', hoppingandretail_id)
  ON CONFLICT (slug) DO UPDATE SET name = EXCLUDED.name, parent_id = EXCLUDED.parent_id;
  INSERT INTO categories (id, name, slug, parent_id)
  VALUES (gen_random_uuid()::text, 'Hardware Stores', 'hardware-tore', hoppingandretail_id)
  ON CONFLICT (slug) DO UPDATE SET name = EXCLUDED.name, parent_id = EXCLUDED.parent_id;
  INSERT INTO categories (id, name, slug, parent_id)
  VALUES (gen_random_uuid()::text, 'Home & Garden', 'homeandgarden', hoppingandretail_id)
  ON CONFLICT (slug) DO UPDATE SET name = EXCLUDED.name, parent_id = EXCLUDED.parent_id;
  INSERT INTO categories (id, name, slug, parent_id)
  VALUES (gen_random_uuid()::text, 'Mobile Phone Shops', 'mobilephone-hop', hoppingandretail_id)
  ON CONFLICT (slug) DO UPDATE SET name = EXCLUDED.name, parent_id = EXCLUDED.parent_id;
  INSERT INTO categories (id, name, slug, parent_id)
  VALUES (gen_random_uuid()::text, 'Online Stores', 'online-tore', hoppingandretail_id)
  ON CONFLICT (slug) DO UPDATE SET name = EXCLUDED.name, parent_id = EXCLUDED.parent_id;
  INSERT INTO categories (id, name, slug, parent_id)
  VALUES (gen_random_uuid()::text, 'Provision Stores', 'provi-ion-tore', hoppingandretail_id)
  ON CONFLICT (slug) DO UPDATE SET name = EXCLUDED.name, parent_id = EXCLUDED.parent_id;
  INSERT INTO categories (id, name, slug, parent_id)
  VALUES (gen_random_uuid()::text, 'Supermarkets', 'upermarket', hoppingandretail_id)
  ON CONFLICT (slug) DO UPDATE SET name = EXCLUDED.name, parent_id = EXCLUDED.parent_id;
  INSERT INTO categories (id, name, slug, parent_id)
  VALUES (gen_random_uuid()::text, 'Wholesale', 'whole-ale', hoppingandretail_id)
  ON CONFLICT (slug) DO UPDATE SET name = EXCLUDED.name, parent_id = EXCLUDED.parent_id;

  -- Tourism & Hospitality
  INSERT INTO categories (id, name, slug, parent_id)
  VALUES (gen_random_uuid()::text, 'Apartments & Guest Houses', 'apartment-andgue-thou-e', touri_mandho_pitality_id)
  ON CONFLICT (slug) DO UPDATE SET name = EXCLUDED.name, parent_id = EXCLUDED.parent_id;
  INSERT INTO categories (id, name, slug, parent_id)
  VALUES (gen_random_uuid()::text, 'Attractions & Sightseeing', 'attraction-and-ight-eeing', touri_mandho_pitality_id)
  ON CONFLICT (slug) DO UPDATE SET name = EXCLUDED.name, parent_id = EXCLUDED.parent_id;
  INSERT INTO categories (id, name, slug, parent_id)
  VALUES (gen_random_uuid()::text, 'Bed & Breakfast', 'bedandbreakfa-t', touri_mandho_pitality_id)
  ON CONFLICT (slug) DO UPDATE SET name = EXCLUDED.name, parent_id = EXCLUDED.parent_id;
  INSERT INTO categories (id, name, slug, parent_id)
  VALUES (gen_random_uuid()::text, 'Holiday Homes', 'holidayhome', touri_mandho_pitality_id)
  ON CONFLICT (slug) DO UPDATE SET name = EXCLUDED.name, parent_id = EXCLUDED.parent_id;
  INSERT INTO categories (id, name, slug, parent_id)
  VALUES (gen_random_uuid()::text, 'Hotels & Resorts', 'hotel-andre-ort', touri_mandho_pitality_id)
  ON CONFLICT (slug) DO UPDATE SET name = EXCLUDED.name, parent_id = EXCLUDED.parent_id;
  INSERT INTO categories (id, name, slug, parent_id)
  VALUES (gen_random_uuid()::text, 'Tour Operators', 'touroperator', touri_mandho_pitality_id)
  ON CONFLICT (slug) DO UPDATE SET name = EXCLUDED.name, parent_id = EXCLUDED.parent_id;
  INSERT INTO categories (id, name, slug, parent_id)
  VALUES (gen_random_uuid()::text, 'Travel Agents', 'travelagent', touri_mandho_pitality_id)
  ON CONFLICT (slug) DO UPDATE SET name = EXCLUDED.name, parent_id = EXCLUDED.parent_id;
  INSERT INTO categories (id, name, slug, parent_id)
  VALUES (gen_random_uuid()::text, 'Visa Services', 'vi-a-ervice', touri_mandho_pitality_id)
  ON CONFLICT (slug) DO UPDATE SET name = EXCLUDED.name, parent_id = EXCLUDED.parent_id;

  RAISE NOTICE 'Category taxonomy upgrade complete!';
END $$;