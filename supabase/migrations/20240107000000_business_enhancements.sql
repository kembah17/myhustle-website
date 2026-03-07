-- Business Enhancements: Tagline + Cover Photo
-- Migration: 20240107000000

-- Add tagline column (short catchy business slogan)
ALTER TABLE businesses ADD COLUMN IF NOT EXISTS tagline VARCHAR(100);

-- Add cover photo column (URL to cover/banner image)
ALTER TABLE businesses ADD COLUMN IF NOT EXISTS cover_photo_url TEXT;

-- Update sample businesses with example taglines
UPDATE businesses SET tagline = 'Premium Adire & Ankara Fashion 🎨' WHERE slug = 'adire-lounge-lekki';
UPDATE businesses SET tagline = 'Your Event, Our Sound 🎵' WHERE slug LIKE '%dj%';
UPDATE businesses SET tagline = 'Capturing Your Best Moments 📸' WHERE slug LIKE '%photo%';
UPDATE businesses SET tagline = 'Fresh Cuts, Fresh Style ✂️' WHERE slug LIKE '%barb%';
UPDATE businesses SET tagline = 'Beauty That Speaks For You 💅' WHERE slug LIKE '%beauty%' OR slug LIKE '%salon%';
UPDATE businesses SET tagline = 'Your Trusted Tech Partner 💻' WHERE slug LIKE '%tech%' OR slug LIKE '%computer%';
UPDATE businesses SET tagline = 'Delicious Meals, Happy Customers 🍽️' WHERE slug LIKE '%restaurant%' OR slug LIKE '%food%' OR slug LIKE '%kitchen%';
