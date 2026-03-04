-- Multi-City Expansion: Abuja + Port Harcourt
-- Adds cities, areas, landmarks, and sample businesses for Abuja and Port Harcourt

-- ============================================================
-- 1. CITIES
-- ============================================================

INSERT INTO cities (id, slug, name, state, country, lat, lon) VALUES
('abuja-city-uuid-0001', 'abuja', 'Abuja', 'Federal Capital Territory', 'Nigeria', 9.0579, 7.4951),
('ph-city-uuid-0001', 'port-harcourt', 'Port Harcourt', 'Rivers State', 'Nigeria', 4.8156, 7.0498)
ON CONFLICT (id) DO NOTHING;

-- ============================================================
-- 2. ABUJA AREAS (20 areas with real coordinates)
-- ============================================================

INSERT INTO areas (id, slug, name, city_id, lat, lon, description) VALUES
('abj-area-wuse', 'wuse', 'Wuse', 'abuja-city-uuid-0001', 9.0764, 7.4888, 'Major commercial district in central Abuja'),
('abj-area-garki', 'garki', 'Garki', 'abuja-city-uuid-0001', 9.0388, 7.4942, 'Administrative and business hub in Abuja'),
('abj-area-maitama', 'maitama', 'Maitama', 'abuja-city-uuid-0001', 9.0833, 7.5000, 'Upscale residential and diplomatic district'),
('abj-area-asokoro', 'asokoro', 'Asokoro', 'abuja-city-uuid-0001', 9.0422, 7.5256, 'Prestigious residential area housing the Presidential Villa'),
('abj-area-gwarinpa', 'gwarinpa', 'Gwarinpa', 'abuja-city-uuid-0001', 9.1069, 7.4072, 'Largest housing estate in West Africa'),
('abj-area-jabi', 'jabi', 'Jabi', 'abuja-city-uuid-0001', 9.0667, 7.4333, 'Fast-growing commercial and residential area'),
('abj-area-utako', 'utako', 'Utako', 'abuja-city-uuid-0001', 9.0750, 7.4500, 'Vibrant district with markets and businesses'),
('abj-area-wuye', 'wuye', 'Wuye', 'abuja-city-uuid-0001', 9.0833, 7.4667, 'Residential area between Wuse and Jabi'),
('abj-area-kubwa', 'kubwa', 'Kubwa', 'abuja-city-uuid-0001', 9.1539, 7.3294, 'Major satellite town north of Abuja'),
('abj-area-lugbe', 'lugbe', 'Lugbe', 'abuja-city-uuid-0001', 8.9833, 7.3833, 'Growing residential area near the airport'),
('abj-area-karu', 'karu', 'Karu', 'abuja-city-uuid-0001', 9.0333, 7.5833, 'Satellite town on the eastern outskirts'),
('abj-area-nyanya', 'nyanya', 'Nyanya', 'abuja-city-uuid-0001', 9.0167, 7.5667, 'Busy satellite town east of Abuja'),
('abj-area-mpape', 'mpape', 'Mpape', 'abuja-city-uuid-0001', 9.1167, 7.4833, 'Hillside community near Maitama'),
('abj-area-durumi', 'durumi', 'Durumi', 'abuja-city-uuid-0001', 9.0333, 7.4667, 'Residential district in central Abuja'),
('abj-area-gudu', 'gudu', 'Gudu', 'abuja-city-uuid-0001', 9.0167, 7.4667, 'Quiet residential area south of Garki'),
('abj-area-lifecamp', 'life-camp', 'Life Camp', 'abuja-city-uuid-0001', 9.1000, 7.4000, 'Popular residential and commercial area'),
('abj-area-katampe', 'katampe', 'Katampe', 'abuja-city-uuid-0001', 9.0944, 7.4722, 'Developing area with modern estates'),
('abj-area-apo', 'apo', 'Apo', 'abuja-city-uuid-0001', 9.0000, 7.5167, 'Residential district with legislative quarters'),
('abj-area-lokogoma', 'lokogoma', 'Lokogoma', 'abuja-city-uuid-0001', 8.9667, 7.4333, 'Emerging residential area in southern Abuja'),
('abj-area-galadimawa', 'galadimawa', 'Galadimawa', 'abuja-city-uuid-0001', 8.9833, 7.4500, 'Residential area near Lokogoma')
ON CONFLICT (id) DO NOTHING;

-- ============================================================
-- 3. ABUJA LANDMARKS (10 with real coordinates)
-- ============================================================

INSERT INTO landmarks (id, slug, name, city_id, area_id, lat, lon, type, radius_km) VALUES
('abj-lm-jabilake', 'jabi-lake-mall', 'Jabi Lake Mall', 'abuja-city-uuid-0001', 'abj-area-jabi', 9.0644, 7.4261, 'mall', 3),
('abj-lm-asorock', 'aso-rock', 'Aso Rock', 'abuja-city-uuid-0001', 'abj-area-asokoro', 9.0583, 7.5306, 'landmark', 3),
('abj-lm-natmosque', 'national-mosque', 'National Mosque', 'abuja-city-uuid-0001', 'abj-area-garki', 9.0578, 7.4908, 'religious', 3),
('abj-lm-natchurch', 'national-church', 'National Church', 'abuja-city-uuid-0001', 'abj-area-asokoro', 9.0500, 7.5167, 'religious', 3),
('abj-lm-ceddiplaza', 'ceddi-plaza', 'Ceddi Plaza', 'abuja-city-uuid-0001', 'abj-area-wuse', 9.0764, 7.4888, 'mall', 3),
('abj-lm-millennium', 'millennium-park', 'Millennium Park', 'abuja-city-uuid-0001', 'abj-area-maitama', 9.0750, 7.4833, 'park', 3),
('abj-lm-airport', 'nnamdi-azikiwe-airport', 'Nnamdi Azikiwe International Airport', 'abuja-city-uuid-0001', 'abj-area-lugbe', 9.0069, 7.2631, 'transport', 5),
('abj-lm-transcorp', 'transcorp-hilton', 'Transcorp Hilton', 'abuja-city-uuid-0001', 'abj-area-maitama', 9.0722, 7.4917, 'hotel', 3),
('abj-lm-wusemarket', 'wuse-market', 'Wuse Market', 'abuja-city-uuid-0001', 'abj-area-wuse', 9.0778, 7.4861, 'market', 3),
('abj-lm-nextcash', 'next-cash-and-carry', 'Next Cash and Carry', 'abuja-city-uuid-0001', 'abj-area-jabi', 9.0611, 7.4306, 'mall', 3)
ON CONFLICT (id) DO NOTHING;

-- ============================================================
-- 4. PORT HARCOURT AREAS (15 areas with real coordinates)
-- ============================================================

INSERT INTO areas (id, slug, name, city_id, lat, lon, description) VALUES
('ph-area-gra1', 'gra-phase-1', 'GRA Phase 1', 'ph-city-uuid-0001', 4.8097, 7.0167, 'Premier residential and commercial area'),
('ph-area-gra2', 'gra-phase-2', 'GRA Phase 2', 'ph-city-uuid-0001', 4.8200, 7.0300, 'Upscale area with hotels and entertainment'),
('ph-area-dline', 'd-line', 'D-Line', 'ph-city-uuid-0001', 4.7950, 7.0200, 'Central commercial district'),
('ph-area-oldgra', 'old-gra', 'Old GRA', 'ph-city-uuid-0001', 4.7833, 7.0167, 'Historic residential area'),
('ph-area-rumuola', 'rumuola', 'Rumuola', 'ph-city-uuid-0001', 4.8333, 7.0167, 'Busy commercial junction area'),
('ph-area-rumuokwurushi', 'rumuokwurushi', 'Rumuokwurushi', 'ph-city-uuid-0001', 4.8500, 7.0333, 'Residential area along East-West Road'),
('ph-area-eliozu', 'eliozu', 'Eliozu', 'ph-city-uuid-0001', 4.8667, 7.0500, 'Growing area near the airport'),
('ph-area-transamadi', 'trans-amadi', 'Trans Amadi', 'ph-city-uuid-0001', 4.8167, 7.0500, 'Industrial and commercial zone'),
('ph-area-woji', 'woji', 'Woji', 'ph-city-uuid-0001', 4.8333, 7.0667, 'Residential area near Trans Amadi'),
('ph-area-rukpokwu', 'rukpokwu', 'Rukpokwu', 'ph-city-uuid-0001', 4.8833, 7.0500, 'Developing residential suburb'),
('ph-area-choba', 'choba', 'Choba', 'ph-city-uuid-0001', 4.8833, 6.9167, 'University town hosting UNIPORT'),
('ph-area-diobu', 'diobu', 'Diobu', 'ph-city-uuid-0001', 4.7833, 7.0000, 'Vibrant commercial and residential area'),
('ph-area-borokiri', 'borokiri', 'Borokiri', 'ph-city-uuid-0001', 4.7667, 7.0167, 'Waterfront community area'),
('ph-area-peterodili', 'peter-odili-road', 'Peter Odili Road', 'ph-city-uuid-0001', 4.8333, 7.0333, 'Major road corridor with estates'),
('ph-area-adageorge', 'ada-george', 'Ada George', 'ph-city-uuid-0001', 4.8500, 7.0000, 'Popular residential and commercial area')
ON CONFLICT (id) DO NOTHING;

-- ============================================================
-- 5. PORT HARCOURT LANDMARKS (8 with real coordinates)
-- ============================================================

INSERT INTO landmarks (id, slug, name, city_id, area_id, lat, lon, type, radius_km) VALUES
('ph-lm-phmall', 'port-harcourt-mall', 'Port Harcourt Mall', 'ph-city-uuid-0001', 'ph-area-rumuola', 4.8347, 7.0189, 'mall', 3),
('ph-lm-genesis', 'genesis-cinemas-ph', 'Genesis Deluxe Cinemas PH', 'ph-city-uuid-0001', 'ph-area-gra2', 4.8200, 7.0300, 'entertainment', 3),
('ph-lm-isaacboro', 'isaac-boro-park', 'Isaac Boro Park', 'ph-city-uuid-0001', 'ph-area-oldgra', 4.7833, 7.0167, 'park', 3),
('ph-lm-airport', 'ph-international-airport', 'Port Harcourt International Airport', 'ph-city-uuid-0001', 'ph-area-eliozu', 5.0155, 6.9496, 'transport', 5),
('ph-lm-pleasure', 'pleasure-park-ph', 'Pleasure Park', 'ph-city-uuid-0001', 'ph-area-gra1', 4.8097, 7.0167, 'entertainment', 3),
('ph-lm-oilmill', 'oil-mill-market', 'Oil Mill Market', 'ph-city-uuid-0001', 'ph-area-diobu', 4.7833, 7.0000, 'market', 3),
('ph-lm-presidential', 'hotel-presidential-ph', 'Hotel Presidential', 'ph-city-uuid-0001', 'ph-area-gra2', 4.8200, 7.0300, 'hotel', 3),
('ph-lm-azikiwe', 'azikiwe-road-market', 'Azikiwe Road Market', 'ph-city-uuid-0001', 'ph-area-dline', 4.7950, 7.0200, 'market', 3)
ON CONFLICT (id) DO NOTHING;

-- ============================================================
-- 6. SAMPLE BUSINESSES (3 per city)
-- We need existing category IDs. Query them by slug.
-- ============================================================

-- Abuja Businesses
INSERT INTO businesses (id, slug, name, description, category_id, city_id, area_id, address, lat, lon, phone, whatsapp, active, verified, tier, created_at, updated_at) VALUES
(
  gen_random_uuid()::text, 'abuja-styles-by-amina', 'Styles by Amina',
  'Premium fashion design and tailoring in Wuse, Abuja. Custom aso-oke, corporate wear, and traditional attire for all occasions.',
  (SELECT id FROM categories WHERE slug = 'fashion-tailoring' LIMIT 1),
  'abuja-city-uuid-0001', 'abj-area-wuse',
  'Shop 14, Wuse Market, Wuse Zone 5, Abuja', 9.0764, 7.4888,
  '+2349012345678', '+2349012345678', true, false, 'free',
  CURRENT_TIMESTAMP, CURRENT_TIMESTAMP
),
(
  gen_random_uuid()::text, 'abuja-glam-studio-maitama', 'Glam Studio Maitama',
  'Full-service beauty salon in Maitama offering hair styling, makeup, skincare, and bridal packages.',
  (SELECT id FROM categories WHERE slug = 'hair-beauty' LIMIT 1),
  'abuja-city-uuid-0001', 'abj-area-maitama',
  '23 Aguiyi Ironsi Street, Maitama, Abuja', 9.0833, 7.5000,
  '+2348023456789', '+2348023456789', true, false, 'free',
  CURRENT_TIMESTAMP, CURRENT_TIMESTAMP
),
(
  gen_random_uuid()::text, 'abuja-jabi-kitchen', 'Jabi Kitchen & Grill',
  'Authentic Nigerian cuisine and continental dishes in Jabi. Catering services available for events.',
  (SELECT id FROM categories WHERE slug = 'food-dining' LIMIT 1),
  'abuja-city-uuid-0001', 'abj-area-jabi',
  'Plot 45, Jabi District, Abuja', 9.0667, 7.4333,
  '+2347034567890', '+2347034567890', true, false, 'free',
  CURRENT_TIMESTAMP, CURRENT_TIMESTAMP
)
ON CONFLICT (id) DO NOTHING;

-- Port Harcourt Businesses
INSERT INTO businesses (id, slug, name, description, category_id, city_id, area_id, address, lat, lon, phone, whatsapp, active, verified, tier, created_at, updated_at) VALUES
(
  gen_random_uuid()::text, 'ph-royal-stitches', 'Royal Stitches PH',
  'Expert tailoring and fashion design in GRA Phase 1. Specializing in native wear, suits, and event outfits.',
  (SELECT id FROM categories WHERE slug = 'fashion-tailoring' LIMIT 1),
  'ph-city-uuid-0001', 'ph-area-gra1',
  '15 Tombia Street, GRA Phase 1, Port Harcourt', 4.8097, 7.0167,
  '+2348045678901', '+2348045678901', true, false, 'free',
  CURRENT_TIMESTAMP, CURRENT_TIMESTAMP
),
(
  gen_random_uuid()::text, 'ph-beauty-haven-gra', 'Beauty Haven GRA',
  'Premium hair salon and beauty spa in GRA Phase 2. Offering braids, weaves, locs, facials, and nail art.',
  (SELECT id FROM categories WHERE slug = 'hair-beauty' LIMIT 1),
  'ph-city-uuid-0001', 'ph-area-gra2',
  '8 Aba Road, GRA Phase 2, Port Harcourt', 4.8200, 7.0300,
  '+2349056789012', '+2349056789012', true, false, 'free',
  CURRENT_TIMESTAMP, CURRENT_TIMESTAMP
),
(
  gen_random_uuid()::text, 'ph-mama-put-dline', 'Mama Put D-Line',
  'Delicious local food spot on D-Line. Serving fresh jollof rice, pepper soup, grilled fish, and more.',
  (SELECT id FROM categories WHERE slug = 'food-dining' LIMIT 1),
  'ph-city-uuid-0001', 'ph-area-dline',
  '22 Ikwerre Road, D-Line, Port Harcourt', 4.7950, 7.0200,
  '+2347067890123', '+2347067890123', true, false, 'free',
  CURRENT_TIMESTAMP, CURRENT_TIMESTAMP
)
ON CONFLICT (id) DO NOTHING;

-- ============================================================
-- 7. BUSINESS HOURS for sample businesses
-- ============================================================

-- Styles by Amina (Abuja) - Mon-Sat 9am-7pm
INSERT INTO business_hours (id, business_id, day, open_time, close_time, closed) 
SELECT gen_random_uuid()::text, b.id, d.day, '09:00', '19:00', CASE WHEN d.day = 0 THEN true ELSE false END
FROM businesses b, (VALUES (0),(1),(2),(3),(4),(5),(6)) AS d(day)
WHERE b.slug = 'abuja-styles-by-amina'
ON CONFLICT DO NOTHING;

-- Glam Studio Maitama (Abuja) - Mon-Sat 8am-8pm
INSERT INTO business_hours (id, business_id, day, open_time, close_time, closed)
SELECT gen_random_uuid()::text, b.id, d.day, '08:00', '20:00', CASE WHEN d.day = 0 THEN true ELSE false END
FROM businesses b, (VALUES (0),(1),(2),(3),(4),(5),(6)) AS d(day)
WHERE b.slug = 'abuja-glam-studio-maitama'
ON CONFLICT DO NOTHING;

-- Jabi Kitchen (Abuja) - Daily 10am-10pm
INSERT INTO business_hours (id, business_id, day, open_time, close_time, closed)
SELECT gen_random_uuid()::text, b.id, d.day, '10:00', '22:00', false
FROM businesses b, (VALUES (0),(1),(2),(3),(4),(5),(6)) AS d(day)
WHERE b.slug = 'abuja-jabi-kitchen'
ON CONFLICT DO NOTHING;

-- Royal Stitches PH - Mon-Sat 9am-6pm
INSERT INTO business_hours (id, business_id, day, open_time, close_time, closed)
SELECT gen_random_uuid()::text, b.id, d.day, '09:00', '18:00', CASE WHEN d.day = 0 THEN true ELSE false END
FROM businesses b, (VALUES (0),(1),(2),(3),(4),(5),(6)) AS d(day)
WHERE b.slug = 'ph-royal-stitches'
ON CONFLICT DO NOTHING;

-- Beauty Haven GRA (PH) - Tue-Sun 9am-7pm
INSERT INTO business_hours (id, business_id, day, open_time, close_time, closed)
SELECT gen_random_uuid()::text, b.id, d.day, '09:00', '19:00', CASE WHEN d.day = 1 THEN true ELSE false END
FROM businesses b, (VALUES (0),(1),(2),(3),(4),(5),(6)) AS d(day)
WHERE b.slug = 'ph-beauty-haven-gra'
ON CONFLICT DO NOTHING;

-- Mama Put D-Line (PH) - Daily 7am-9pm
INSERT INTO business_hours (id, business_id, day, open_time, close_time, closed)
SELECT gen_random_uuid()::text, b.id, d.day, '07:00', '21:00', false
FROM businesses b, (VALUES (0),(1),(2),(3),(4),(5),(6)) AS d(day)
WHERE b.slug = 'ph-mama-put-dline'
ON CONFLICT DO NOTHING;
