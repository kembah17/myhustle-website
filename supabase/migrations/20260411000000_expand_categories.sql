-- Migration: Expand Category System
-- Date: 2026-04-11
-- Description: Adds 15 new parent categories with subcategories + "Other" catch-all category
--   for Nigeria's diverse business landscape. Also adds custom category suggestion support.

-- =============================================================
-- Use DO block with variables for parent ID references
-- =============================================================
DO $$
DECLARE
  health_id TEXT := gen_random_uuid()::text;
  education_id TEXT := gen_random_uuid()::text;
  home_id TEXT := gen_random_uuid()::text;
  auto_id TEXT := gen_random_uuid()::text;
  tech_id TEXT := gen_random_uuid()::text;
  realestate_id TEXT := gen_random_uuid()::text;
  legal_id TEXT := gen_random_uuid()::text;
  logistics_id TEXT := gen_random_uuid()::text;
  agric_id TEXT := gen_random_uuid()::text;
  printing_id TEXT := gen_random_uuid()::text;
  laundry_id TEXT := gen_random_uuid()::text;
  supermarket_id TEXT := gen_random_uuid()::text;
  religious_id TEXT := gen_random_uuid()::text;
  entertainment_id TEXT := gen_random_uuid()::text;
  childcare_id TEXT := gen_random_uuid()::text;
  other_id TEXT := gen_random_uuid()::text;
BEGIN

  -- =============================================================
  -- 1. Insert new PARENT categories
  -- =============================================================
  INSERT INTO categories (id, slug, name, icon, description, parent_id, seo_title_template, seo_description_template)
  VALUES
    (health_id, 'health-wellness', 'Health & Wellness', '🏥', 'Pharmacies, gyms, spas, traditional medicine and opticians in Lagos', NULL, '{name} - Health & Wellness in {area}, Lagos', 'Book {name} for health and wellness services in {area}, Lagos. Read reviews and get quotes.'),
    (education_id, 'education-training', 'Education & Training', '📚', 'Tutorial centres, driving schools, computer training and vocational institutes in Lagos', NULL, '{name} - Education & Training in {area}, Lagos', 'Book {name} for education and training services in {area}, Lagos. Read reviews and get quotes.'),
    (home_id, 'home-services', 'Home Services', '🏠', 'Plumbers, electricians, painters, cleaners and AC repair in Lagos', NULL, '{name} - Home Services in {area}, Lagos', 'Book {name} for home services in {area}, Lagos. Read reviews and get quotes.'),
    (auto_id, 'auto-services', 'Auto Services', '🚗', 'Mechanics, car wash, auto electricians, panel beaters and tyre services in Lagos', NULL, '{name} - Auto Services in {area}, Lagos', 'Book {name} for auto services in {area}, Lagos. Read reviews and get quotes.'),
    (tech_id, 'technology-it', 'Technology & IT', '💻', 'Phone repair, computer repair, web design, CCTV installation and networking in Lagos', NULL, '{name} - Technology & IT in {area}, Lagos', 'Book {name} for technology and IT services in {area}, Lagos. Read reviews and get quotes.'),
    (realestate_id, 'real-estate', 'Real Estate', '🏘️', 'Estate agents, property management, short-let apartments and land agents in Lagos', NULL, '{name} - Real Estate in {area}, Lagos', 'Find {name} for real estate services in {area}, Lagos. Read reviews and get quotes.'),
    (legal_id, 'legal-finance', 'Legal & Finance', '⚖️', 'Lawyers, accountants, tax consultants, insurance agents and microfinance in Lagos', NULL, '{name} - Legal & Finance in {area}, Lagos', 'Book {name} for legal and finance services in {area}, Lagos. Read reviews and get quotes.'),
    (logistics_id, 'logistics-transport', 'Logistics & Transport', '🚚', 'Dispatch riders, moving services, haulage and courier services in Lagos', NULL, '{name} - Logistics & Transport in {area}, Lagos', 'Book {name} for logistics and transport services in {area}, Lagos. Read reviews and get quotes.'),
    (agric_id, 'agriculture-farming', 'Agriculture & Farming', '🌾', 'Farm produce, poultry, fish farming, agro-chemicals and farm equipment in Lagos', NULL, '{name} - Agriculture & Farming in {area}, Lagos', 'Find {name} for agriculture and farming products in {area}, Lagos. Read reviews and get quotes.'),
    (printing_id, 'printing-branding', 'Printing & Branding', '🖨️', 'Printing press, signage, branding, gift items and embroidery in Lagos', NULL, '{name} - Printing & Branding in {area}, Lagos', 'Book {name} for printing and branding services in {area}, Lagos. Read reviews and get quotes.'),
    (laundry_id, 'laundry-dry-cleaning', 'Laundry & Dry Cleaning', '👔', 'Laundry services, dry cleaners and ironing services in Lagos', NULL, '{name} - Laundry & Dry Cleaning in {area}, Lagos', 'Book {name} for laundry and dry cleaning services in {area}, Lagos. Read reviews and get quotes.'),
    (supermarket_id, 'supermarkets-retail', 'Supermarkets & Retail', '🛒', 'Supermarkets, mini marts, provision stores and wholesale in Lagos', NULL, '{name} - Supermarkets & Retail in {area}, Lagos', 'Visit {name} for supermarket and retail shopping in {area}, Lagos. Read reviews and see products.'),
    (religious_id, 'religious-spiritual', 'Religious & Spiritual', '⛪', 'Churches, mosques, event halls and counselling services in Lagos', NULL, '{name} - Religious & Spiritual in {area}, Lagos', 'Find {name} for religious and spiritual services in {area}, Lagos. Read reviews and get directions.'),
    (entertainment_id, 'entertainment-leisure', 'Entertainment & Leisure', '🎭', 'Lounges, clubs, game centres, cinemas and recreation in Lagos', NULL, '{name} - Entertainment & Leisure in {area}, Lagos', 'Visit {name} for entertainment and leisure in {area}, Lagos. Read reviews and get directions.'),
    (childcare_id, 'childcare-parenting', 'Childcare & Parenting', '👶', 'Crèches, daycare, children party services and baby stores in Lagos', NULL, '{name} - Childcare & Parenting in {area}, Lagos', 'Find {name} for childcare and parenting services in {area}, Lagos. Read reviews and get quotes.'),
    (other_id, 'other', 'Other', '📦', 'Other businesses and services in Lagos', NULL, '{name} - Business in {area}, Lagos', 'Find {name} in {area}, Lagos. Read reviews and get quotes.')
  ON CONFLICT (slug) DO NOTHING;

  -- =============================================================
  -- 2. Insert SUBCATEGORIES for each new parent
  -- =============================================================

  -- Health & Wellness
  INSERT INTO categories (id, slug, name, icon, description, parent_id, seo_title_template, seo_description_template)
  VALUES
    (gen_random_uuid()::text, 'pharmacies', 'Pharmacies', '💊', 'Pharmacies in Lagos', health_id, NULL, NULL),
    (gen_random_uuid()::text, 'gyms-fitness', 'Gyms & Fitness', '🏋️', 'Gyms and fitness centres in Lagos', health_id, NULL, NULL),
    (gen_random_uuid()::text, 'spa-massage', 'Spa & Massage', '💆', 'Spa and massage services in Lagos', health_id, NULL, NULL),
    (gen_random_uuid()::text, 'traditional-medicine', 'Traditional Medicine', '🌿', 'Traditional medicine practitioners in Lagos', health_id, NULL, NULL),
    (gen_random_uuid()::text, 'opticians', 'Opticians', '👓', 'Opticians and eye care in Lagos', health_id, NULL, NULL)
  ON CONFLICT (slug) DO NOTHING;

  -- Education & Training
  INSERT INTO categories (id, slug, name, icon, description, parent_id, seo_title_template, seo_description_template)
  VALUES
    (gen_random_uuid()::text, 'tutorial-centres', 'Tutorial Centres', '📝', 'Tutorial and lesson centres in Lagos', education_id, NULL, NULL),
    (gen_random_uuid()::text, 'driving-schools', 'Driving Schools', '🚗', 'Driving schools in Lagos', education_id, NULL, NULL),
    (gen_random_uuid()::text, 'computer-training', 'Computer Training', '🖥️', 'Computer training centres in Lagos', education_id, NULL, NULL),
    (gen_random_uuid()::text, 'language-schools', 'Language Schools', '🗣️', 'Language schools in Lagos', education_id, NULL, NULL),
    (gen_random_uuid()::text, 'vocational-training', 'Vocational Training', '🔧', 'Vocational training centres in Lagos', education_id, NULL, NULL)
  ON CONFLICT (slug) DO NOTHING;

  -- Home Services
  INSERT INTO categories (id, slug, name, icon, description, parent_id, seo_title_template, seo_description_template)
  VALUES
    (gen_random_uuid()::text, 'plumbers', 'Plumbers', '🔧', 'Plumbers in Lagos', home_id, NULL, NULL),
    (gen_random_uuid()::text, 'electricians', 'Electricians', '⚡', 'Electricians in Lagos', home_id, NULL, NULL),
    (gen_random_uuid()::text, 'painters', 'Painters', '🎨', 'House painters in Lagos', home_id, NULL, NULL),
    (gen_random_uuid()::text, 'cleaners', 'Cleaners', '🧹', 'Cleaning services in Lagos', home_id, NULL, NULL),
    (gen_random_uuid()::text, 'ac-repair', 'AC Repair', '❄️', 'Air conditioning repair in Lagos', home_id, NULL, NULL),
    (gen_random_uuid()::text, 'fumigation', 'Fumigation', '🪲', 'Fumigation and pest control in Lagos', home_id, NULL, NULL)
  ON CONFLICT (slug) DO NOTHING;

  -- Auto Services
  INSERT INTO categories (id, slug, name, icon, description, parent_id, seo_title_template, seo_description_template)
  VALUES
    (gen_random_uuid()::text, 'mechanics', 'Mechanics', '🔩', 'Auto mechanics in Lagos', auto_id, NULL, NULL),
    (gen_random_uuid()::text, 'car-wash', 'Car Wash', '🚿', 'Car wash services in Lagos', auto_id, NULL, NULL),
    (gen_random_uuid()::text, 'auto-electricians', 'Auto Electricians', '🔌', 'Auto electricians in Lagos', auto_id, NULL, NULL),
    (gen_random_uuid()::text, 'panel-beaters', 'Panel Beaters', '🔨', 'Panel beaters in Lagos', auto_id, NULL, NULL),
    (gen_random_uuid()::text, 'tyre-services', 'Tyre Services', '🛞', 'Tyre services and vulcanizers in Lagos', auto_id, NULL, NULL),
    (gen_random_uuid()::text, 'towing-services', 'Towing Services', '🚛', 'Towing services in Lagos', auto_id, NULL, NULL)
  ON CONFLICT (slug) DO NOTHING;

  -- Technology & IT
  INSERT INTO categories (id, slug, name, icon, description, parent_id, seo_title_template, seo_description_template)
  VALUES
    (gen_random_uuid()::text, 'phone-repair', 'Phone Repair', '📱', 'Phone repair services in Lagos', tech_id, NULL, NULL),
    (gen_random_uuid()::text, 'computer-repair', 'Computer Repair', '💻', 'Computer repair services in Lagos', tech_id, NULL, NULL),
    (gen_random_uuid()::text, 'web-design', 'Web Design', '🌐', 'Web design and development in Lagos', tech_id, NULL, NULL),
    (gen_random_uuid()::text, 'cctv-installation', 'CCTV Installation', '📹', 'CCTV installation services in Lagos', tech_id, NULL, NULL),
    (gen_random_uuid()::text, 'networking', 'Networking', '🔗', 'Network installation and support in Lagos', tech_id, NULL, NULL)
  ON CONFLICT (slug) DO NOTHING;

  -- Real Estate
  INSERT INTO categories (id, slug, name, icon, description, parent_id, seo_title_template, seo_description_template)
  VALUES
    (gen_random_uuid()::text, 'estate-agents', 'Estate Agents', '🏠', 'Estate agents in Lagos', realestate_id, NULL, NULL),
    (gen_random_uuid()::text, 'property-management', 'Property Management', '🏢', 'Property management companies in Lagos', realestate_id, NULL, NULL),
    (gen_random_uuid()::text, 'short-let-apartments', 'Short-Let Apartments', '🛏️', 'Short-let apartments in Lagos', realestate_id, NULL, NULL),
    (gen_random_uuid()::text, 'land-agents', 'Land Agents', '📐', 'Land agents and surveyors in Lagos', realestate_id, NULL, NULL)
  ON CONFLICT (slug) DO NOTHING;

  -- Legal & Finance
  INSERT INTO categories (id, slug, name, icon, description, parent_id, seo_title_template, seo_description_template)
  VALUES
    (gen_random_uuid()::text, 'lawyers', 'Lawyers', '⚖️', 'Lawyers and law firms in Lagos', legal_id, NULL, NULL),
    (gen_random_uuid()::text, 'accountants', 'Accountants', '📊', 'Accountants in Lagos', legal_id, NULL, NULL),
    (gen_random_uuid()::text, 'tax-consultants', 'Tax Consultants', '🧾', 'Tax consultants in Lagos', legal_id, NULL, NULL),
    (gen_random_uuid()::text, 'insurance-agents', 'Insurance Agents', '🛡️', 'Insurance agents in Lagos', legal_id, NULL, NULL),
    (gen_random_uuid()::text, 'microfinance', 'Microfinance', '💰', 'Microfinance banks in Lagos', legal_id, NULL, NULL)
  ON CONFLICT (slug) DO NOTHING;

  -- Logistics & Transport
  INSERT INTO categories (id, slug, name, icon, description, parent_id, seo_title_template, seo_description_template)
  VALUES
    (gen_random_uuid()::text, 'dispatch-riders', 'Dispatch Riders', '🏍️', 'Dispatch riders in Lagos', logistics_id, NULL, NULL),
    (gen_random_uuid()::text, 'moving-services', 'Moving Services', '📦', 'Moving and relocation services in Lagos', logistics_id, NULL, NULL),
    (gen_random_uuid()::text, 'haulage', 'Haulage', '🚛', 'Haulage and trucking services in Lagos', logistics_id, NULL, NULL),
    (gen_random_uuid()::text, 'courier-services', 'Courier Services', '📬', 'Courier and delivery services in Lagos', logistics_id, NULL, NULL)
  ON CONFLICT (slug) DO NOTHING;

  -- Agriculture & Farming
  INSERT INTO categories (id, slug, name, icon, description, parent_id, seo_title_template, seo_description_template)
  VALUES
    (gen_random_uuid()::text, 'farm-produce', 'Farm Produce', '🥬', 'Farm produce suppliers in Lagos', agric_id, NULL, NULL),
    (gen_random_uuid()::text, 'poultry', 'Poultry', '🐔', 'Poultry farms in Lagos', agric_id, NULL, NULL),
    (gen_random_uuid()::text, 'fish-farming', 'Fish Farming', '🐟', 'Fish farms in Lagos', agric_id, NULL, NULL),
    (gen_random_uuid()::text, 'agro-chemicals', 'Agro-chemicals', '🧪', 'Agro-chemical suppliers in Lagos', agric_id, NULL, NULL),
    (gen_random_uuid()::text, 'farm-equipment', 'Farm Equipment', '🚜', 'Farm equipment suppliers in Lagos', agric_id, NULL, NULL)
  ON CONFLICT (slug) DO NOTHING;

  -- Printing & Branding
  INSERT INTO categories (id, slug, name, icon, description, parent_id, seo_title_template, seo_description_template)
  VALUES
    (gen_random_uuid()::text, 'printing-press', 'Printing Press', '🖨️', 'Printing press services in Lagos', printing_id, NULL, NULL),
    (gen_random_uuid()::text, 'signage', 'Signage', '🪧', 'Signage and sign makers in Lagos', printing_id, NULL, NULL),
    (gen_random_uuid()::text, 'branding-services', 'Branding', '🎯', 'Branding services in Lagos', printing_id, NULL, NULL),
    (gen_random_uuid()::text, 'gift-items', 'Gift Items', '🎁', 'Gift items and souvenirs in Lagos', printing_id, NULL, NULL),
    (gen_random_uuid()::text, 'embroidery', 'Embroidery', '🧵', 'Embroidery services in Lagos', printing_id, NULL, NULL)
  ON CONFLICT (slug) DO NOTHING;

  -- Laundry & Dry Cleaning
  INSERT INTO categories (id, slug, name, icon, description, parent_id, seo_title_template, seo_description_template)
  VALUES
    (gen_random_uuid()::text, 'laundry-services', 'Laundry Services', '🧺', 'Laundry services in Lagos', laundry_id, NULL, NULL),
    (gen_random_uuid()::text, 'dry-cleaners', 'Dry Cleaners', '👔', 'Dry cleaning services in Lagos', laundry_id, NULL, NULL),
    (gen_random_uuid()::text, 'ironing-services', 'Ironing Services', '♨️', 'Ironing services in Lagos', laundry_id, NULL, NULL)
  ON CONFLICT (slug) DO NOTHING;

  -- Supermarkets & Retail
  INSERT INTO categories (id, slug, name, icon, description, parent_id, seo_title_template, seo_description_template)
  VALUES
    (gen_random_uuid()::text, 'supermarkets', 'Supermarkets', '🏪', 'Supermarkets in Lagos', supermarket_id, NULL, NULL),
    (gen_random_uuid()::text, 'mini-marts', 'Mini Marts', '🛍️', 'Mini marts in Lagos', supermarket_id, NULL, NULL),
    (gen_random_uuid()::text, 'provision-stores', 'Provision Stores', '🧴', 'Provision stores in Lagos', supermarket_id, NULL, NULL),
    (gen_random_uuid()::text, 'wholesale', 'Wholesale', '📦', 'Wholesale stores in Lagos', supermarket_id, NULL, NULL)
  ON CONFLICT (slug) DO NOTHING;

  -- Religious & Spiritual
  INSERT INTO categories (id, slug, name, icon, description, parent_id, seo_title_template, seo_description_template)
  VALUES
    (gen_random_uuid()::text, 'churches', 'Churches', '⛪', 'Churches in Lagos', religious_id, NULL, NULL),
    (gen_random_uuid()::text, 'mosques', 'Mosques', '🕌', 'Mosques in Lagos', religious_id, NULL, NULL),
    (gen_random_uuid()::text, 'event-halls', 'Event Halls', '🏛️', 'Event halls and venues in Lagos', religious_id, NULL, NULL),
    (gen_random_uuid()::text, 'counselling', 'Counselling', '🤝', 'Counselling services in Lagos', religious_id, NULL, NULL)
  ON CONFLICT (slug) DO NOTHING;

  -- Entertainment & Leisure
  INSERT INTO categories (id, slug, name, icon, description, parent_id, seo_title_template, seo_description_template)
  VALUES
    (gen_random_uuid()::text, 'lounges', 'Lounges', '🍸', 'Lounges in Lagos', entertainment_id, NULL, NULL),
    (gen_random_uuid()::text, 'clubs', 'Clubs', '🎶', 'Night clubs in Lagos', entertainment_id, NULL, NULL),
    (gen_random_uuid()::text, 'game-centres', 'Game Centres', '🎮', 'Game centres in Lagos', entertainment_id, NULL, NULL),
    (gen_random_uuid()::text, 'cinemas', 'Cinemas', '🎬', 'Cinemas in Lagos', entertainment_id, NULL, NULL),
    (gen_random_uuid()::text, 'recreation', 'Recreation', '🎡', 'Recreation centres in Lagos', entertainment_id, NULL, NULL)
  ON CONFLICT (slug) DO NOTHING;

  -- Childcare & Parenting
  INSERT INTO categories (id, slug, name, icon, description, parent_id, seo_title_template, seo_description_template)
  VALUES
    (gen_random_uuid()::text, 'creches', 'Crèches', '🍼', 'Crèches in Lagos', childcare_id, NULL, NULL),
    (gen_random_uuid()::text, 'daycare', 'Daycare', '👶', 'Daycare centres in Lagos', childcare_id, NULL, NULL),
    (gen_random_uuid()::text, 'childrens-party', 'Children''s Party', '🎈', 'Children party services in Lagos', childcare_id, NULL, NULL),
    (gen_random_uuid()::text, 'baby-stores', 'Baby Stores', '🧸', 'Baby stores in Lagos', childcare_id, NULL, NULL)
  ON CONFLICT (slug) DO NOTHING;

END $$;
