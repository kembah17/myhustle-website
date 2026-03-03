-- ============================================================
-- MyHustle.com - Complete Migration + Seed Data
-- Generated: 2026-03-03T11:39:11.000Z
-- Run this entire script in Supabase SQL Editor
-- ============================================================

-- ============================================================
-- PART 1: CREATE TABLES (Migration DDL)
-- ============================================================

-- CreateSchema
CREATE SCHEMA IF NOT EXISTS "public";

-- CreateTable
CREATE TABLE "businesses" (
    "id" TEXT NOT NULL,
    "slug" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "description" TEXT,
    "category_id" TEXT NOT NULL,
    "city_id" TEXT NOT NULL,
    "area_id" TEXT,
    "address" TEXT,
    "lat" DOUBLE PRECISION,
    "lon" DOUBLE PRECISION,
    "phone" TEXT,
    "email" TEXT,
    "whatsapp" TEXT,
    "website" TEXT,
    "tier" TEXT NOT NULL DEFAULT 'free',
    "verified" BOOLEAN NOT NULL DEFAULT false,
    "active" BOOLEAN NOT NULL DEFAULT true,
    "user_id" TEXT,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "businesses_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "categories" (
    "id" TEXT NOT NULL,
    "slug" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "description" TEXT,
    "parent_id" TEXT,
    "icon" TEXT,
    "seo_title_template" TEXT,
    "seo_description_template" TEXT,

    CONSTRAINT "categories_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "cities" (
    "id" TEXT NOT NULL,
    "slug" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "state" TEXT NOT NULL,
    "country" TEXT NOT NULL DEFAULT 'Nigeria',
    "lat" DOUBLE PRECISION NOT NULL,
    "lon" DOUBLE PRECISION NOT NULL,

    CONSTRAINT "cities_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "areas" (
    "id" TEXT NOT NULL,
    "slug" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "city_id" TEXT NOT NULL,
    "lat" DOUBLE PRECISION NOT NULL,
    "lon" DOUBLE PRECISION NOT NULL,
    "description" TEXT,

    CONSTRAINT "areas_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "landmarks" (
    "id" TEXT NOT NULL,
    "slug" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "city_id" TEXT NOT NULL,
    "area_id" TEXT,
    "lat" DOUBLE PRECISION NOT NULL,
    "lon" DOUBLE PRECISION NOT NULL,
    "type" TEXT NOT NULL,
    "radius_km" DOUBLE PRECISION NOT NULL DEFAULT 3,
    "aliases" TEXT[] DEFAULT ARRAY[]::TEXT[],
    "description" TEXT,

    CONSTRAINT "landmarks_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "reviews" (
    "id" TEXT NOT NULL,
    "business_id" TEXT NOT NULL,
    "user_id" TEXT,
    "rating" INTEGER NOT NULL,
    "text" TEXT,
    "verified_booking" BOOLEAN NOT NULL DEFAULT false,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "reviews_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "bookings" (
    "id" TEXT NOT NULL,
    "business_id" TEXT NOT NULL,
    "customer_name" TEXT NOT NULL,
    "customer_phone" TEXT,
    "customer_email" TEXT,
    "service" TEXT,
    "date" TIMESTAMP(3) NOT NULL,
    "time" TEXT,
    "status" TEXT NOT NULL DEFAULT 'pending',
    "source" TEXT NOT NULL DEFAULT 'website',
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "bookings_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "business_hours" (
    "id" TEXT NOT NULL,
    "business_id" TEXT NOT NULL,
    "day" INTEGER NOT NULL,
    "open_time" TEXT,
    "close_time" TEXT,
    "closed" BOOLEAN NOT NULL DEFAULT false,

    CONSTRAINT "business_hours_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "business_photos" (
    "id" TEXT NOT NULL,
    "business_id" TEXT NOT NULL,
    "url" TEXT NOT NULL,
    "alt_text" TEXT,
    "position" INTEGER NOT NULL DEFAULT 0,
    "is_cover" BOOLEAN NOT NULL DEFAULT false,

    CONSTRAINT "business_photos_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "businesses_slug_key" ON "businesses"("slug");

-- CreateIndex
CREATE UNIQUE INDEX "categories_slug_key" ON "categories"("slug");

-- CreateIndex
CREATE UNIQUE INDEX "cities_slug_key" ON "cities"("slug");

-- CreateIndex
CREATE UNIQUE INDEX "areas_slug_key" ON "areas"("slug");

-- CreateIndex
CREATE UNIQUE INDEX "landmarks_slug_key" ON "landmarks"("slug");

-- AddForeignKey
ALTER TABLE "businesses" ADD CONSTRAINT "businesses_category_id_fkey" FOREIGN KEY ("category_id") REFERENCES "categories"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "businesses" ADD CONSTRAINT "businesses_city_id_fkey" FOREIGN KEY ("city_id") REFERENCES "cities"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "businesses" ADD CONSTRAINT "businesses_area_id_fkey" FOREIGN KEY ("area_id") REFERENCES "areas"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "categories" ADD CONSTRAINT "categories_parent_id_fkey" FOREIGN KEY ("parent_id") REFERENCES "categories"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "areas" ADD CONSTRAINT "areas_city_id_fkey" FOREIGN KEY ("city_id") REFERENCES "cities"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "landmarks" ADD CONSTRAINT "landmarks_city_id_fkey" FOREIGN KEY ("city_id") REFERENCES "cities"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "landmarks" ADD CONSTRAINT "landmarks_area_id_fkey" FOREIGN KEY ("area_id") REFERENCES "areas"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "reviews" ADD CONSTRAINT "reviews_business_id_fkey" FOREIGN KEY ("business_id") REFERENCES "businesses"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "bookings" ADD CONSTRAINT "bookings_business_id_fkey" FOREIGN KEY ("business_id") REFERENCES "businesses"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "business_hours" ADD CONSTRAINT "business_hours_business_id_fkey" FOREIGN KEY ("business_id") REFERENCES "businesses"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "business_photos" ADD CONSTRAINT "business_photos_business_id_fkey" FOREIGN KEY ("business_id") REFERENCES "businesses"("id") ON DELETE RESTRICT ON UPDATE CASCADE;



-- ============================================================
-- PART 2: SEED DATA
-- ============================================================

-- City: Lagos
INSERT INTO cities (id, slug, name, state, country, lat, lon) VALUES ('265c74ff-1ca2-59a4-9ff3-01de69cd4065', 'lagos', 'Lagos', 'Lagos State', 'Nigeria', 6.5244, 3.3792);

-- Areas (30 Lagos areas)
INSERT INTO areas (id, slug, name, city_id, lat, lon) VALUES ('5f79c092-1e81-58fa-a172-0a67bc61136b', 'alimosho', 'Alimosho', '265c74ff-1ca2-59a4-9ff3-01de69cd4065', 6.6018, 3.2906);
INSERT INTO areas (id, slug, name, city_id, lat, lon) VALUES ('523bd62b-fc30-502b-9074-34f0f91844b7', 'ajeromi-ifelodun', 'Ajeromi-Ifelodun', '265c74ff-1ca2-59a4-9ff3-01de69cd4065', 6.4483, 3.3313);
INSERT INTO areas (id, slug, name, city_id, lat, lon) VALUES ('d1beed5d-ae43-590d-88af-0a0604c7b6a0', 'kosofe', 'Kosofe', '265c74ff-1ca2-59a4-9ff3-01de69cd4065', 6.5833, 3.3833);
INSERT INTO areas (id, slug, name, city_id, lat, lon) VALUES ('cb7e3bbd-a55f-535a-b7c1-1f3ab91c2d64', 'mushin', 'Mushin', '265c74ff-1ca2-59a4-9ff3-01de69cd4065', 6.5333, 3.35);
INSERT INTO areas (id, slug, name, city_id, lat, lon) VALUES ('daa4d213-ee64-5174-99a7-bd8f4f47903c', 'oshodi-isolo', 'Oshodi-Isolo', '265c74ff-1ca2-59a4-9ff3-01de69cd4065', 6.5569, 3.3414);
INSERT INTO areas (id, slug, name, city_id, lat, lon) VALUES ('0b220955-ac2f-5f97-bcd7-558f3a55b2ea', 'ojo', 'Ojo', '265c74ff-1ca2-59a4-9ff3-01de69cd4065', 6.4676, 3.1814);
INSERT INTO areas (id, slug, name, city_id, lat, lon) VALUES ('34124ece-990e-5ded-a97c-4f97cac8c707', 'ikorodu', 'Ikorodu', '265c74ff-1ca2-59a4-9ff3-01de69cd4065', 6.6194, 3.5105);
INSERT INTO areas (id, slug, name, city_id, lat, lon) VALUES ('58be8775-c792-5c4f-a1fa-860e92c67220', 'surulere', 'Surulere', '265c74ff-1ca2-59a4-9ff3-01de69cd4065', 6.5, 3.35);
INSERT INTO areas (id, slug, name, city_id, lat, lon) VALUES ('8c2329ae-b964-533e-9b7f-0d5e25daffca', 'agege', 'Agege', '265c74ff-1ca2-59a4-9ff3-01de69cd4065', 6.6167, 3.3167);
INSERT INTO areas (id, slug, name, city_id, lat, lon) VALUES ('e7ba0599-9d65-5da9-8de3-333079a602e9', 'ifako-ijaiye', 'Ifako-Ijaiye', '265c74ff-1ca2-59a4-9ff3-01de69cd4065', 6.6667, 3.3);
INSERT INTO areas (id, slug, name, city_id, lat, lon) VALUES ('9dc44cb5-6e8a-5051-96bb-923feb4c9dad', 'somolu', 'Somolu', '265c74ff-1ca2-59a4-9ff3-01de69cd4065', 6.5333, 3.3833);
INSERT INTO areas (id, slug, name, city_id, lat, lon) VALUES ('ce2fc016-1713-555d-a477-9ff1cc5c0ea9', 'amuwo-odofin', 'Amuwo-Odofin', '265c74ff-1ca2-59a4-9ff3-01de69cd4065', 6.45, 3.3167);
INSERT INTO areas (id, slug, name, city_id, lat, lon) VALUES ('3eb17bdd-0e9a-5399-8e38-1c5e8d765b57', 'lagos-mainland', 'Lagos Mainland', '265c74ff-1ca2-59a4-9ff3-01de69cd4065', 6.4969, 3.3903);
INSERT INTO areas (id, slug, name, city_id, lat, lon) VALUES ('33626ef7-4e57-5a4e-bce6-c968f439ee77', 'ikeja', 'Ikeja', '265c74ff-1ca2-59a4-9ff3-01de69cd4065', 6.6018, 3.3515);
INSERT INTO areas (id, slug, name, city_id, lat, lon) VALUES ('7a056a2a-c0a1-53a4-ac00-697f9d561c7d', 'eti-osa', 'Eti-Osa', '265c74ff-1ca2-59a4-9ff3-01de69cd4065', 6.4281, 3.4219);
INSERT INTO areas (id, slug, name, city_id, lat, lon) VALUES ('5c22ac69-ff61-5762-84f2-6e4a7db73c07', 'badagry', 'Badagry', '265c74ff-1ca2-59a4-9ff3-01de69cd4065', 6.4167, 2.8833);
INSERT INTO areas (id, slug, name, city_id, lat, lon) VALUES ('3cb2ea30-747d-5a4f-8760-854736b26dd9', 'apapa', 'Apapa', '265c74ff-1ca2-59a4-9ff3-01de69cd4065', 6.45, 3.3667);
INSERT INTO areas (id, slug, name, city_id, lat, lon) VALUES ('744255bd-33f3-568e-abab-10e96da59498', 'lagos-island', 'Lagos Island', '265c74ff-1ca2-59a4-9ff3-01de69cd4065', 6.4541, 3.3947);
INSERT INTO areas (id, slug, name, city_id, lat, lon) VALUES ('738e5fdc-b069-59f1-b8cc-07418069a9b0', 'epe', 'Epe', '265c74ff-1ca2-59a4-9ff3-01de69cd4065', 6.5833, 3.9833);
INSERT INTO areas (id, slug, name, city_id, lat, lon) VALUES ('9588467b-c896-5273-b05a-652cefa45d61', 'ibeju-lekki', 'Ibeju-Lekki', '265c74ff-1ca2-59a4-9ff3-01de69cd4065', 6.45, 3.6);
INSERT INTO areas (id, slug, name, city_id, lat, lon) VALUES ('9f1ac6d1-0722-57dc-989f-103486ce6ad3', 'victoria-island', 'Victoria Island', '265c74ff-1ca2-59a4-9ff3-01de69cd4065', 6.4281, 3.4219);
INSERT INTO areas (id, slug, name, city_id, lat, lon) VALUES ('25a4e186-2a73-5afd-ba69-c2b8846400e8', 'lekki', 'Lekki', '265c74ff-1ca2-59a4-9ff3-01de69cd4065', 6.4698, 3.5852);
INSERT INTO areas (id, slug, name, city_id, lat, lon) VALUES ('eb43aff8-f232-5ed1-8de5-93ad97b3b8a9', 'ikoyi', 'Ikoyi', '265c74ff-1ca2-59a4-9ff3-01de69cd4065', 6.45, 3.4333);
INSERT INTO areas (id, slug, name, city_id, lat, lon) VALUES ('f45bd3e2-eba2-5003-b461-155117b771e8', 'ajah', 'Ajah', '265c74ff-1ca2-59a4-9ff3-01de69cd4065', 6.4667, 3.5667);
INSERT INTO areas (id, slug, name, city_id, lat, lon) VALUES ('d33f7e82-0557-59c0-93de-e4caf0ce735b', 'yaba', 'Yaba', '265c74ff-1ca2-59a4-9ff3-01de69cd4065', 6.51, 3.38);
INSERT INTO areas (id, slug, name, city_id, lat, lon) VALUES ('b55a8154-cb93-5333-9240-9328d9e9658c', 'gbagada', 'Gbagada', '265c74ff-1ca2-59a4-9ff3-01de69cd4065', 6.55, 3.3833);
INSERT INTO areas (id, slug, name, city_id, lat, lon) VALUES ('d9f97eb6-06ed-5b40-a06c-a91df617812e', 'maryland', 'Maryland', '265c74ff-1ca2-59a4-9ff3-01de69cd4065', 6.5667, 3.3667);
INSERT INTO areas (id, slug, name, city_id, lat, lon) VALUES ('5e37e125-a551-5f0f-8fa9-7621da3e381a', 'ogba', 'Ogba', '265c74ff-1ca2-59a4-9ff3-01de69cd4065', 6.6333, 3.3333);
INSERT INTO areas (id, slug, name, city_id, lat, lon) VALUES ('818550be-4396-5dbb-8594-40af69dc6397', 'festac', 'Festac', '265c74ff-1ca2-59a4-9ff3-01de69cd4065', 6.4667, 3.2833);
INSERT INTO areas (id, slug, name, city_id, lat, lon) VALUES ('8ea147e0-e9b0-5dba-a97e-ba3cb9daf891', 'magodo', 'Magodo', '265c74ff-1ca2-59a4-9ff3-01de69cd4065', 6.6167, 3.3833);

-- Parent Categories (5 verticals)
INSERT INTO categories (id, slug, name, description, parent_id, icon, seo_title_template, seo_description_template) VALUES ('3001203d-a336-5367-a20e-6d27e6141406', 'fashion-tailoring', 'Fashion & Tailoring', 'Fashion designers, tailors, fabric stores and shoe makers in Lagos', NULL, '👗', '{name} - Fashion & Tailoring in {area}, Lagos', 'Book {name} for fashion & tailoring services in {area}, Lagos. Read reviews and get quotes.');
INSERT INTO categories (id, slug, name, description, parent_id, icon, seo_title_template, seo_description_template) VALUES ('4a5cced8-2bf4-5030-acd5-7396e4bb6242', 'hair-beauty', 'Hair & Beauty', 'Hair salons, barber shops, makeup artists and nail studios in Lagos', NULL, '💇', '{name} - Hair & Beauty in {area}, Lagos', 'Book {name} for hair & beauty services in {area}, Lagos. Read reviews and get quotes.');
INSERT INTO categories (id, slug, name, description, parent_id, icon, seo_title_template, seo_description_template) VALUES ('684617dc-53da-5cd2-b759-84ef0d9555f2', 'events', 'Events', 'Event planners, DJs, MCs, decorators and caterers in Lagos', NULL, '🎉', '{name} - Events in {area}, Lagos', 'Book {name} for events services in {area}, Lagos. Read reviews and get quotes.');
INSERT INTO categories (id, slug, name, description, parent_id, icon, seo_title_template, seo_description_template) VALUES ('ad4da7ec-2c66-5ada-a808-8fc5eea9b637', 'photography', 'Photography', 'Photographers, videographers and photo studios in Lagos', NULL, '📸', '{name} - Photography in {area}, Lagos', 'Book {name} for photography services in {area}, Lagos. Read reviews and get quotes.');
INSERT INTO categories (id, slug, name, description, parent_id, icon, seo_title_template, seo_description_template) VALUES ('8f5a08f3-a20c-58c1-8eb4-fdba42b5bf15', 'food-dining', 'Food & Dining', 'Restaurants, cafes, fast food and catering services in Lagos', NULL, '🍽️', '{name} - Food & Dining in {area}, Lagos', 'Book {name} for food & dining services in {area}, Lagos. Read reviews and get quotes.');

-- Subcategories (20)
INSERT INTO categories (id, slug, name, description, parent_id, icon) VALUES ('6ac38fe3-3b2a-5b67-b9cd-29a2ff846c6f', 'fashion-designers', 'Fashion Designers', 'Custom fashion designers in Lagos', '3001203d-a336-5367-a20e-6d27e6141406', '✂️');
INSERT INTO categories (id, slug, name, description, parent_id, icon) VALUES ('37c5372c-c2a6-5770-b0e2-c150c302bf06', 'tailors', 'Tailors', 'Professional tailors in Lagos', '3001203d-a336-5367-a20e-6d27e6141406', '🧵');
INSERT INTO categories (id, slug, name, description, parent_id, icon) VALUES ('48bf03bc-2d4b-5f2f-afd8-4351cc33fab8', 'fabric-stores', 'Fabric Stores', 'Fabric and textile stores in Lagos', '3001203d-a336-5367-a20e-6d27e6141406', '🧶');
INSERT INTO categories (id, slug, name, description, parent_id, icon) VALUES ('2b48f829-73d2-58dc-8527-45e2f990fe9b', 'shoe-makers', 'Shoe Makers', 'Custom shoe makers in Lagos', '3001203d-a336-5367-a20e-6d27e6141406', '👞');
INSERT INTO categories (id, slug, name, description, parent_id, icon) VALUES ('bbeed9c5-0419-5341-9aa3-4a5a90e3ccd6', 'hair-salons', 'Hair Salons', 'Hair salons in Lagos', '4a5cced8-2bf4-5030-acd5-7396e4bb6242', '💇‍♀️');
INSERT INTO categories (id, slug, name, description, parent_id, icon) VALUES ('235cdfe2-8f06-5501-9232-66b9011be8d5', 'barber-shops', 'Barber Shops', 'Barber shops in Lagos', '4a5cced8-2bf4-5030-acd5-7396e4bb6242', '💈');
INSERT INTO categories (id, slug, name, description, parent_id, icon) VALUES ('a093990d-0943-5ece-9002-2f9a673914fb', 'makeup-artists', 'Makeup Artists', 'Professional makeup artists in Lagos', '4a5cced8-2bf4-5030-acd5-7396e4bb6242', '💄');
INSERT INTO categories (id, slug, name, description, parent_id, icon) VALUES ('9623f41b-9baf-5d65-b64f-dcaf9a029e19', 'nail-studios', 'Nail Studios', 'Nail studios and technicians in Lagos', '4a5cced8-2bf4-5030-acd5-7396e4bb6242', '💅');
INSERT INTO categories (id, slug, name, description, parent_id, icon) VALUES ('08d722bf-c011-582e-afc0-98c5a6065c92', 'event-planners', 'Event Planners', 'Event planners and coordinators in Lagos', '684617dc-53da-5cd2-b759-84ef0d9555f2', '📋');
INSERT INTO categories (id, slug, name, description, parent_id, icon) VALUES ('59ef3cfe-1b64-5a2d-8942-c21e3eb501de', 'djs', 'DJs', 'DJs for hire in Lagos', '684617dc-53da-5cd2-b759-84ef0d9555f2', '🎧');
INSERT INTO categories (id, slug, name, description, parent_id, icon) VALUES ('d20a8b64-0e9f-5e60-b339-01fc987d2baf', 'mcs', 'MCs', 'Masters of ceremony in Lagos', '684617dc-53da-5cd2-b759-84ef0d9555f2', '🎤');
INSERT INTO categories (id, slug, name, description, parent_id, icon) VALUES ('6dc6a5a1-5562-5b4a-9556-e70fee04fa58', 'decorators', 'Decorators', 'Event decorators in Lagos', '684617dc-53da-5cd2-b759-84ef0d9555f2', '🎨');
INSERT INTO categories (id, slug, name, description, parent_id, icon) VALUES ('ee326c27-8d5a-503c-bcb7-d68e53a3cf92', 'caterers', 'Caterers', 'Catering services in Lagos', '684617dc-53da-5cd2-b759-84ef0d9555f2', '🍲');
INSERT INTO categories (id, slug, name, description, parent_id, icon) VALUES ('ef14b175-bec0-5f99-bd24-eed5b8af4eef', 'photographers', 'Photographers', 'Professional photographers in Lagos', 'ad4da7ec-2c66-5ada-a808-8fc5eea9b637', '📷');
INSERT INTO categories (id, slug, name, description, parent_id, icon) VALUES ('40aecb0f-dd2c-5599-a97e-31a4531a1a51', 'videographers', 'Videographers', 'Professional videographers in Lagos', 'ad4da7ec-2c66-5ada-a808-8fc5eea9b637', '🎥');
INSERT INTO categories (id, slug, name, description, parent_id, icon) VALUES ('ce650fa5-04e0-5f96-bd65-2173a23f1d7d', 'photo-studios', 'Photo Studios', 'Photo studios in Lagos', 'ad4da7ec-2c66-5ada-a808-8fc5eea9b637', '🖼️');
INSERT INTO categories (id, slug, name, description, parent_id, icon) VALUES ('dd4ac319-bb26-545d-bcca-25fa74d969b0', 'restaurants', 'Restaurants', 'Restaurants in Lagos', '8f5a08f3-a20c-58c1-8eb4-fdba42b5bf15', '🍛');
INSERT INTO categories (id, slug, name, description, parent_id, icon) VALUES ('e2d0b985-8468-5fc0-b77a-eaee2cd00f81', 'cafes', 'Cafes', 'Cafes and coffee shops in Lagos', '8f5a08f3-a20c-58c1-8eb4-fdba42b5bf15', '☕');
INSERT INTO categories (id, slug, name, description, parent_id, icon) VALUES ('1c40f229-13ee-55d1-9fdd-761061883cb3', 'fast-food', 'Fast Food', 'Fast food restaurants in Lagos', '8f5a08f3-a20c-58c1-8eb4-fdba42b5bf15', '🍔');
INSERT INTO categories (id, slug, name, description, parent_id, icon) VALUES ('34ab5b38-b22c-5d5c-8266-b3ae96475dec', 'catering-services', 'Catering Services', 'Catering services in Lagos', '8f5a08f3-a20c-58c1-8eb4-fdba42b5bf15', '🍽️');

-- Landmarks (18 key Lagos landmarks)
INSERT INTO landmarks (id, slug, name, city_id, area_id, lat, lon, type, radius_km, aliases, description) VALUES ('1c40a77c-2795-5915-bd33-66bf4200f77e', 'palms-shopping-mall-lekki', 'Palms Shopping Mall', '265c74ff-1ca2-59a4-9ff3-01de69cd4065', '25a4e186-2a73-5afd-ba69-c2b8846400e8', 6.4312, 3.4275, 'mall', 3, ARRAY['The Palms Lekki', 'Palms Mall'], 'Major shopping mall in Lekki Phase 1');
INSERT INTO landmarks (id, slug, name, city_id, area_id, lat, lon, type, radius_km, aliases, description) VALUES ('6c333d13-035a-5307-a723-c09ac810d8c5', 'ikeja-city-mall', 'Ikeja City Mall', '265c74ff-1ca2-59a4-9ff3-01de69cd4065', '33626ef7-4e57-5a4e-bce6-c968f439ee77', 6.6018, 3.342, 'mall', 3, ARRAY['ICM', 'Ikeja Mall'], 'Largest mall in Ikeja');
INSERT INTO landmarks (id, slug, name, city_id, area_id, lat, lon, type, radius_km, aliases, description) VALUES ('58bcb2b1-dd11-5ebd-b42e-e75071e55141', 'the-palms-vi', 'The Palms Victoria Island', '265c74ff-1ca2-59a4-9ff3-01de69cd4065', '9f1ac6d1-0722-57dc-989f-103486ce6ad3', 6.4281, 3.4219, 'mall', 2, ARRAY['Palms VI', 'The Palms Shopping Centre'], 'Premium shopping centre on Victoria Island');
INSERT INTO landmarks (id, slug, name, city_id, area_id, lat, lon, type, radius_km, aliases, description) VALUES ('e9386be4-cbb7-5856-9531-5cad4ddf612f', 'circle-mall-lekki', 'Circle Mall', '265c74ff-1ca2-59a4-9ff3-01de69cd4065', '25a4e186-2a73-5afd-ba69-c2b8846400e8', 6.444, 3.531, 'mall', 3, ARRAY['Circle Mall Lekki'], 'Shopping mall along Lekki-Epe Expressway');
INSERT INTO landmarks (id, slug, name, city_id, area_id, lat, lon, type, radius_km, aliases, description) VALUES ('0a75d24c-f0a9-5511-bb17-a8118c91c866', 'balogun-market', 'Balogun Market', '265c74ff-1ca2-59a4-9ff3-01de69cd4065', '744255bd-33f3-568e-abab-10e96da59498', 6.45, 3.39, 'market', 2, ARRAY['Balogun', 'Lagos Island Market'], 'Largest textile and general market in Lagos');
INSERT INTO landmarks (id, slug, name, city_id, area_id, lat, lon, type, radius_km, aliases, description) VALUES ('d65cc1a5-ac17-5f66-aa03-a95181f0318e', 'computer-village-ikeja', 'Computer Village', '265c74ff-1ca2-59a4-9ff3-01de69cd4065', '33626ef7-4e57-5a4e-bce6-c968f439ee77', 6.595, 3.345, 'market', 2, ARRAY['Computer Village', 'CV Ikeja'], 'Largest technology market in West Africa');
INSERT INTO landmarks (id, slug, name, city_id, area_id, lat, lon, type, radius_km, aliases, description) VALUES ('1682d10b-414b-58d3-9aa8-c5e2c888897f', 'alaba-international-market', 'Alaba International Market', '265c74ff-1ca2-59a4-9ff3-01de69cd4065', '0b220955-ac2f-5f97-bcd7-558f3a55b2ea', 6.465, 3.19, 'market', 3, ARRAY['Alaba Market', 'Alaba'], 'Major electronics market in Lagos');
INSERT INTO landmarks (id, slug, name, city_id, area_id, lat, lon, type, radius_km, aliases, description) VALUES ('e287ca5c-4cc1-5847-be61-f37de0b9b6b9', 'eko-hotel-vi', 'Eko Hotel & Suites', '265c74ff-1ca2-59a4-9ff3-01de69cd4065', '9f1ac6d1-0722-57dc-989f-103486ce6ad3', 6.4253, 3.4197, 'hotel', 2, ARRAY['Eko Hotel', 'Eko Hotels'], 'Premier luxury hotel on Victoria Island');
INSERT INTO landmarks (id, slug, name, city_id, area_id, lat, lon, type, radius_km, aliases, description) VALUES ('2074da56-ccf1-5e5a-8550-2fc8d27da25c', 'federal-palace-hotel', 'Federal Palace Hotel', '265c74ff-1ca2-59a4-9ff3-01de69cd4065', '9f1ac6d1-0722-57dc-989f-103486ce6ad3', 6.428, 3.415, 'hotel', 2, ARRAY['Federal Palace', 'FPH'], 'Historic luxury hotel on Victoria Island');
INSERT INTO landmarks (id, slug, name, city_id, area_id, lat, lon, type, radius_km, aliases, description) VALUES ('79606077-7ba6-5a6e-8118-9dc714090e76', 'radisson-blu-ikeja', 'Radisson Blu Ikeja', '265c74ff-1ca2-59a4-9ff3-01de69cd4065', '33626ef7-4e57-5a4e-bce6-c968f439ee77', 6.595, 3.34, 'hotel', 2, ARRAY['Radisson Ikeja', 'Radisson Blu Lagos'], 'International hotel near Ikeja GRA');
INSERT INTO landmarks (id, slug, name, city_id, area_id, lat, lon, type, radius_km, aliases, description) VALUES ('81faead3-84e5-5951-822d-bdd7b1f18217', 'unilag-akoka', 'University of Lagos', '265c74ff-1ca2-59a4-9ff3-01de69cd4065', 'd33f7e82-0557-59c0-93de-e4caf0ce735b', 6.5158, 3.389, 'university', 3, ARRAY['UNILAG', 'Unilag Akoka'], 'Premier university in Lagos, Akoka campus');
INSERT INTO landmarks (id, slug, name, city_id, area_id, lat, lon, type, radius_km, aliases, description) VALUES ('c59f3a33-8b24-5f17-8a6e-733b05177b16', 'lasu-ojo', 'Lagos State University', '265c74ff-1ca2-59a4-9ff3-01de69cd4065', '0b220955-ac2f-5f97-bcd7-558f3a55b2ea', 6.4667, 3.2, 'university', 3, ARRAY['LASU', 'Lagos State Uni'], 'State university in Ojo');
INSERT INTO landmarks (id, slug, name, city_id, area_id, lat, lon, type, radius_km, aliases, description) VALUES ('689eeb88-dead-583c-a71d-fcc12ab0e1ab', 'yabatech', 'Yaba College of Technology', '265c74ff-1ca2-59a4-9ff3-01de69cd4065', 'd33f7e82-0557-59c0-93de-e4caf0ce735b', 6.518, 3.375, 'university', 2, ARRAY['Yabatech', 'YCT', 'Yaba Tech'], 'Premier polytechnic in Lagos');
INSERT INTO landmarks (id, slug, name, city_id, area_id, lat, lon, type, radius_km, aliases, description) VALUES ('1d4047ae-d391-57c3-aef2-9e98287d70f4', 'luth-idi-araba', 'Lagos University Teaching Hospital', '265c74ff-1ca2-59a4-9ff3-01de69cd4065', '58be8775-c792-5c4f-a1fa-860e92c67220', 6.51, 3.355, 'hospital', 3, ARRAY['LUTH', 'Idi-Araba Hospital'], 'Major teaching hospital in Idi-Araba');
INSERT INTO landmarks (id, slug, name, city_id, area_id, lat, lon, type, radius_km, aliases, description) VALUES ('4abf093a-3372-5ba0-90dd-2bd5bc979e5c', 'lagos-island-general-hospital', 'Lagos Island General Hospital', '265c74ff-1ca2-59a4-9ff3-01de69cd4065', '744255bd-33f3-568e-abab-10e96da59498', 6.455, 3.395, 'hospital', 2, ARRAY['General Hospital Lagos Island', 'LIGH'], 'General hospital on Lagos Island');
INSERT INTO landmarks (id, slug, name, city_id, area_id, lat, lon, type, radius_km, aliases, description) VALUES ('6854ee97-d837-501f-933f-57f73ec9d460', 'murtala-muhammed-airport', 'Murtala Muhammed International Airport', '265c74ff-1ca2-59a4-9ff3-01de69cd4065', '33626ef7-4e57-5a4e-bce6-c968f439ee77', 6.5774, 3.3212, 'transport', 5, ARRAY['Lagos Airport', 'MMA', 'MMIA', 'Ikeja Airport'], 'Main international airport serving Lagos');
INSERT INTO landmarks (id, slug, name, city_id, area_id, lat, lon, type, radius_km, aliases, description) VALUES ('7d241d8d-df85-5aa6-9435-b694e9ee684d', 'jibowu-bus-terminal', 'Jibowu Bus Terminal', '265c74ff-1ca2-59a4-9ff3-01de69cd4065', 'd33f7e82-0557-59c0-93de-e4caf0ce735b', 6.52, 3.375, 'transport', 2, ARRAY['Jibowu Terminal', 'Jibowu BRT'], 'Major bus terminal in Yaba');
INSERT INTO landmarks (id, slug, name, city_id, area_id, lat, lon, type, radius_km, aliases, description) VALUES ('26c53866-64b5-5cf2-bf7b-392fbd095087', 'broad-street-lagos', 'Broad Street', '265c74ff-1ca2-59a4-9ff3-01de69cd4065', '744255bd-33f3-568e-abab-10e96da59498', 6.451, 3.392, 'business', 2, ARRAY['Broad Street', 'Marina Area'], 'Historic business district on Lagos Island');

-- Sample Businesses (10)
INSERT INTO businesses (id, slug, name, description, category_id, city_id, area_id, address, lat, lon, phone, whatsapp, tier, verified, active, created_at, updated_at) VALUES ('6b063b0d-c461-544f-970f-bb623d44431f', 'adire-lounge-lekki', 'Adire Lounge', 'Premium adire and ankara fashion house specializing in modern African designs', '6ac38fe3-3b2a-5b67-b9cd-29a2ff846c6f', '265c74ff-1ca2-59a4-9ff3-01de69cd4065', '25a4e186-2a73-5afd-ba69-c2b8846400e8', '12 Admiralty Way, Lekki Phase 1', 6.44, 3.475, '+234 801 234 5678', '+234 801 234 5678', 'pro', true, true, '2026-03-03T11:39:11.000Z', '2026-03-03T11:39:11.000Z');
INSERT INTO businesses (id, slug, name, description, category_id, city_id, area_id, address, lat, lon, phone, whatsapp, tier, verified, active, created_at, updated_at) VALUES ('d8cc16ea-cf72-53e7-accf-8c03c7c1c8a8', 'kings-cut-barbers-ikeja', 'King''s Cut Barbers', 'Premium barbershop offering classic and modern cuts for men', '235cdfe2-8f06-5501-9232-66b9011be8d5', '265c74ff-1ca2-59a4-9ff3-01de69cd4065', '33626ef7-4e57-5a4e-bce6-c968f439ee77', '45 Allen Avenue, Ikeja', 6.595, 3.35, '+234 802 345 6789', '+234 802 345 6789', 'starter', true, true, '2026-03-03T11:39:11.000Z', '2026-03-03T11:39:11.000Z');
INSERT INTO businesses (id, slug, name, description, category_id, city_id, area_id, address, lat, lon, phone, whatsapp, tier, verified, active, created_at, updated_at) VALUES ('80871a87-2659-5ff9-88a5-c07580a33525', 'glam-studio-vi', 'Glam Studio', 'Full-service beauty salon and makeup studio on Victoria Island', 'a093990d-0943-5ece-9002-2f9a673914fb', '265c74ff-1ca2-59a4-9ff3-01de69cd4065', '9f1ac6d1-0722-57dc-989f-103486ce6ad3', '8 Adeola Odeku Street, VI', 6.43, 3.42, '+234 803 456 7890', '+234 803 456 7890', 'premium', true, true, '2026-03-03T11:39:11.000Z', '2026-03-03T11:39:11.000Z');
INSERT INTO businesses (id, slug, name, description, category_id, city_id, area_id, address, lat, lon, phone, whatsapp, tier, verified, active, created_at, updated_at) VALUES ('b6d8c48c-8676-5b65-a987-353b45b30b3d', 'naija-events-hub-surulere', 'Naija Events Hub', 'Full-service event planning company for weddings, birthdays and corporate events', '08d722bf-c011-582e-afc0-98c5a6065c92', '265c74ff-1ca2-59a4-9ff3-01de69cd4065', '58be8775-c792-5c4f-a1fa-860e92c67220', '22 Adeniran Ogunsanya Street, Surulere', 6.5, 3.355, '+234 804 567 8901', '+234 804 567 8901', 'pro', true, true, '2026-03-03T11:39:11.000Z', '2026-03-03T11:39:11.000Z');
INSERT INTO businesses (id, slug, name, description, category_id, city_id, area_id, address, lat, lon, phone, whatsapp, tier, verified, active, created_at, updated_at) VALUES ('a7d2f724-4b1b-57b3-a4e8-abde63004c83', 'lens-masters-photography-yaba', 'Lens Masters Photography', 'Professional photography studio for portraits, events and commercial shoots', 'ef14b175-bec0-5f99-bd24-eed5b8af4eef', '265c74ff-1ca2-59a4-9ff3-01de69cd4065', 'd33f7e82-0557-59c0-93de-e4caf0ce735b', '15 Herbert Macaulay Way, Yaba', 6.51, 3.38, '+234 805 678 9012', '+234 805 678 9012', 'starter', true, true, '2026-03-03T11:39:11.000Z', '2026-03-03T11:39:11.000Z');
INSERT INTO businesses (id, slug, name, description, category_id, city_id, area_id, address, lat, lon, phone, whatsapp, tier, verified, active, created_at, updated_at) VALUES ('859914ff-51d1-591c-8b7f-ea8d5a76a8d7', 'mama-nkechi-kitchen-festac', 'Mama Nkechi''s Kitchen', 'Authentic Nigerian cuisine restaurant serving local delicacies', 'dd4ac319-bb26-545d-bcca-25fa74d969b0', '265c74ff-1ca2-59a4-9ff3-01de69cd4065', '818550be-4396-5dbb-8594-40af69dc6397', '3 2nd Avenue, Festac Town', 6.4667, 3.285, '+234 806 789 0123', '+234 806 789 0123', 'free', false, true, '2026-03-03T11:39:11.000Z', '2026-03-03T11:39:11.000Z');
INSERT INTO businesses (id, slug, name, description, category_id, city_id, area_id, address, lat, lon, phone, whatsapp, tier, verified, active, created_at, updated_at) VALUES ('cf529d0d-1a31-5198-b060-aa3d990f8690', 'dj-spinall-entertainment', 'DJ Spinall Entertainment', 'Professional DJ services for weddings, parties and corporate events', '59ef3cfe-1b64-5a2d-8942-c21e3eb501de', '265c74ff-1ca2-59a4-9ff3-01de69cd4065', '25a4e186-2a73-5afd-ba69-c2b8846400e8', 'Lekki Phase 1', 6.45, 3.48, '+234 807 890 1234', '+234 807 890 1234', 'pro', true, true, '2026-03-03T11:39:11.000Z', '2026-03-03T11:39:11.000Z');
INSERT INTO businesses (id, slug, name, description, category_id, city_id, area_id, address, lat, lon, phone, whatsapp, tier, verified, active, created_at, updated_at) VALUES ('338a9cb4-5f03-5e2f-927b-3f485c11e1cf', 'stitch-perfect-tailoring-maryland', 'Stitch Perfect Tailoring', 'Expert tailoring for native and English wear, specializing in agbada and suits', '37c5372c-c2a6-5770-b0e2-c150c302bf06', '265c74ff-1ca2-59a4-9ff3-01de69cd4065', 'd9f97eb6-06ed-5b40-a06c-a91df617812e', '10 Mobolaji Bank Anthony Way, Maryland', 6.565, 3.37, '+234 808 901 2345', '+234 808 901 2345', 'starter', true, true, '2026-03-03T11:39:11.000Z', '2026-03-03T11:39:11.000Z');
INSERT INTO businesses (id, slug, name, description, category_id, city_id, area_id, address, lat, lon, phone, whatsapp, tier, verified, active, created_at, updated_at) VALUES ('f451bd9b-da5b-5b0f-ac5f-a3c9d3a5e4f0', 'brew-haven-cafe-ikoyi', 'Brew Haven Cafe', 'Artisan coffee shop and brunch spot in the heart of Ikoyi', 'e2d0b985-8468-5fc0-b77a-eaee2cd00f81', '265c74ff-1ca2-59a4-9ff3-01de69cd4065', 'eb43aff8-f232-5ed1-8de5-93ad97b3b8a9', '5 Bourdillon Road, Ikoyi', 6.45, 3.435, '+234 809 012 3456', '+234 809 012 3456', 'pro', true, true, '2026-03-03T11:39:11.000Z', '2026-03-03T11:39:11.000Z');
INSERT INTO businesses (id, slug, name, description, category_id, city_id, area_id, address, lat, lon, phone, whatsapp, tier, verified, active, created_at, updated_at) VALUES ('7c910835-802d-5b95-8135-349918e8717e', 'nails-by-temi-ajah', 'Nails by Temi', 'Luxury nail studio offering manicures, pedicures and nail art', '9623f41b-9baf-5d65-b64f-dcaf9a029e19', '265c74ff-1ca2-59a4-9ff3-01de69cd4065', 'f45bd3e2-eba2-5003-b461-155117b771e8', 'Abraham Adesanya, Ajah', 6.47, 3.57, '+234 810 123 4567', '+234 810 123 4567', 'free', false, true, '2026-03-03T11:39:11.000Z', '2026-03-03T11:39:11.000Z');

-- Business Hours (for verified businesses, Mon-Sat 9-6, Sun closed)
INSERT INTO business_hours (id, business_id, day, open_time, close_time, closed) VALUES ('c30c8722-06d2-553b-b095-4a3aa923b06e', '6b063b0d-c461-544f-970f-bb623d44431f', 0, NULL, NULL, true);
INSERT INTO business_hours (id, business_id, day, open_time, close_time, closed) VALUES ('819141d1-ccbc-5acb-8cb6-900d065beb03', '6b063b0d-c461-544f-970f-bb623d44431f', 1, '09:00', '18:00', false);
INSERT INTO business_hours (id, business_id, day, open_time, close_time, closed) VALUES ('81853883-3add-5129-a0bb-a22ce2714e3a', '6b063b0d-c461-544f-970f-bb623d44431f', 2, '09:00', '18:00', false);
INSERT INTO business_hours (id, business_id, day, open_time, close_time, closed) VALUES ('537d1f4e-ef2b-5a82-8c0f-48ac1a037583', '6b063b0d-c461-544f-970f-bb623d44431f', 3, '09:00', '18:00', false);
INSERT INTO business_hours (id, business_id, day, open_time, close_time, closed) VALUES ('7792805e-0452-54b5-8e35-f53f178b8d70', '6b063b0d-c461-544f-970f-bb623d44431f', 4, '09:00', '18:00', false);
INSERT INTO business_hours (id, business_id, day, open_time, close_time, closed) VALUES ('64505f52-b974-525d-83dc-f94ebf532dfe', '6b063b0d-c461-544f-970f-bb623d44431f', 5, '09:00', '18:00', false);
INSERT INTO business_hours (id, business_id, day, open_time, close_time, closed) VALUES ('e904f903-8e7f-5004-abfd-62246f1aaf16', '6b063b0d-c461-544f-970f-bb623d44431f', 6, '09:00', '18:00', false);
INSERT INTO business_hours (id, business_id, day, open_time, close_time, closed) VALUES ('27ae3bf5-eb19-5de1-8984-71fe7d3d4788', 'd8cc16ea-cf72-53e7-accf-8c03c7c1c8a8', 0, NULL, NULL, true);
INSERT INTO business_hours (id, business_id, day, open_time, close_time, closed) VALUES ('9f39d9f7-5fa4-5e5c-9a9d-c147f7744e42', 'd8cc16ea-cf72-53e7-accf-8c03c7c1c8a8', 1, '09:00', '18:00', false);
INSERT INTO business_hours (id, business_id, day, open_time, close_time, closed) VALUES ('f71fcd31-6d6a-5cb4-b9d6-b57c6dd03a34', 'd8cc16ea-cf72-53e7-accf-8c03c7c1c8a8', 2, '09:00', '18:00', false);
INSERT INTO business_hours (id, business_id, day, open_time, close_time, closed) VALUES ('e887f8f3-89aa-5c33-ac1a-2cfc9d42c940', 'd8cc16ea-cf72-53e7-accf-8c03c7c1c8a8', 3, '09:00', '18:00', false);
INSERT INTO business_hours (id, business_id, day, open_time, close_time, closed) VALUES ('0618924a-ea0b-5708-a96d-35ad783a273f', 'd8cc16ea-cf72-53e7-accf-8c03c7c1c8a8', 4, '09:00', '18:00', false);
INSERT INTO business_hours (id, business_id, day, open_time, close_time, closed) VALUES ('93b6a042-177f-547a-9edc-a6c9b57045bf', 'd8cc16ea-cf72-53e7-accf-8c03c7c1c8a8', 5, '09:00', '18:00', false);
INSERT INTO business_hours (id, business_id, day, open_time, close_time, closed) VALUES ('610d9d50-2960-5a2a-a4d8-c796e5aa266c', 'd8cc16ea-cf72-53e7-accf-8c03c7c1c8a8', 6, '09:00', '18:00', false);
INSERT INTO business_hours (id, business_id, day, open_time, close_time, closed) VALUES ('58fe5b44-8ef8-5e1f-9956-ca6ab5144270', '80871a87-2659-5ff9-88a5-c07580a33525', 0, NULL, NULL, true);
INSERT INTO business_hours (id, business_id, day, open_time, close_time, closed) VALUES ('0b3396ed-b07c-5f0b-bef0-7c6e49538fab', '80871a87-2659-5ff9-88a5-c07580a33525', 1, '09:00', '18:00', false);
INSERT INTO business_hours (id, business_id, day, open_time, close_time, closed) VALUES ('de2b5733-5fe9-5dd6-9ebb-d8fea0b95dce', '80871a87-2659-5ff9-88a5-c07580a33525', 2, '09:00', '18:00', false);
INSERT INTO business_hours (id, business_id, day, open_time, close_time, closed) VALUES ('21224c9c-91b7-52fa-9cf8-effb1ba92bf2', '80871a87-2659-5ff9-88a5-c07580a33525', 3, '09:00', '18:00', false);
INSERT INTO business_hours (id, business_id, day, open_time, close_time, closed) VALUES ('4d5900b7-7c18-5ecc-a50c-d147501e5378', '80871a87-2659-5ff9-88a5-c07580a33525', 4, '09:00', '18:00', false);
INSERT INTO business_hours (id, business_id, day, open_time, close_time, closed) VALUES ('0879cb51-25e6-5536-8f0a-713900d3b16b', '80871a87-2659-5ff9-88a5-c07580a33525', 5, '09:00', '18:00', false);
INSERT INTO business_hours (id, business_id, day, open_time, close_time, closed) VALUES ('c66bd3fc-d43d-5f41-8a84-0f9eb5f7c723', '80871a87-2659-5ff9-88a5-c07580a33525', 6, '09:00', '18:00', false);
INSERT INTO business_hours (id, business_id, day, open_time, close_time, closed) VALUES ('eb2d245e-58a6-5450-a11a-ef933479beb6', 'b6d8c48c-8676-5b65-a987-353b45b30b3d', 0, NULL, NULL, true);
INSERT INTO business_hours (id, business_id, day, open_time, close_time, closed) VALUES ('79202197-0cd3-53af-9db1-639db050b83c', 'b6d8c48c-8676-5b65-a987-353b45b30b3d', 1, '09:00', '18:00', false);
INSERT INTO business_hours (id, business_id, day, open_time, close_time, closed) VALUES ('00ca30d7-8ee6-5030-8d40-b5e896b62be9', 'b6d8c48c-8676-5b65-a987-353b45b30b3d', 2, '09:00', '18:00', false);
INSERT INTO business_hours (id, business_id, day, open_time, close_time, closed) VALUES ('beda2c6c-7e54-5793-8e2e-2f2da5a61d82', 'b6d8c48c-8676-5b65-a987-353b45b30b3d', 3, '09:00', '18:00', false);
INSERT INTO business_hours (id, business_id, day, open_time, close_time, closed) VALUES ('19009dc2-fb70-540f-94b8-e5be809d559e', 'b6d8c48c-8676-5b65-a987-353b45b30b3d', 4, '09:00', '18:00', false);
INSERT INTO business_hours (id, business_id, day, open_time, close_time, closed) VALUES ('9845b478-7076-5ca4-a2cc-a34041ea8620', 'b6d8c48c-8676-5b65-a987-353b45b30b3d', 5, '09:00', '18:00', false);
INSERT INTO business_hours (id, business_id, day, open_time, close_time, closed) VALUES ('43ec10cb-6339-5a89-8ecf-e1425e20d968', 'b6d8c48c-8676-5b65-a987-353b45b30b3d', 6, '09:00', '18:00', false);
INSERT INTO business_hours (id, business_id, day, open_time, close_time, closed) VALUES ('0f0fa118-7a24-50ef-a003-521fc2358f2f', 'a7d2f724-4b1b-57b3-a4e8-abde63004c83', 0, NULL, NULL, true);
INSERT INTO business_hours (id, business_id, day, open_time, close_time, closed) VALUES ('a5fdd718-400a-52a6-987e-99ca12bc73c4', 'a7d2f724-4b1b-57b3-a4e8-abde63004c83', 1, '09:00', '18:00', false);
INSERT INTO business_hours (id, business_id, day, open_time, close_time, closed) VALUES ('def6943a-176a-5c28-bec5-a735799fe8b3', 'a7d2f724-4b1b-57b3-a4e8-abde63004c83', 2, '09:00', '18:00', false);
INSERT INTO business_hours (id, business_id, day, open_time, close_time, closed) VALUES ('9ef4923c-5f65-5bb9-8dd5-4f90df52f8c5', 'a7d2f724-4b1b-57b3-a4e8-abde63004c83', 3, '09:00', '18:00', false);
INSERT INTO business_hours (id, business_id, day, open_time, close_time, closed) VALUES ('0a9d984f-f478-57d8-86f3-fc97937cc629', 'a7d2f724-4b1b-57b3-a4e8-abde63004c83', 4, '09:00', '18:00', false);
INSERT INTO business_hours (id, business_id, day, open_time, close_time, closed) VALUES ('c651bac0-7fc2-5c8b-9d0d-2fc710eb9420', 'a7d2f724-4b1b-57b3-a4e8-abde63004c83', 5, '09:00', '18:00', false);
INSERT INTO business_hours (id, business_id, day, open_time, close_time, closed) VALUES ('fa995c95-dbed-5235-baaf-74927022b413', 'a7d2f724-4b1b-57b3-a4e8-abde63004c83', 6, '09:00', '18:00', false);
INSERT INTO business_hours (id, business_id, day, open_time, close_time, closed) VALUES ('01600e2e-e0e7-53a6-93c4-638b63127e48', 'cf529d0d-1a31-5198-b060-aa3d990f8690', 0, NULL, NULL, true);
INSERT INTO business_hours (id, business_id, day, open_time, close_time, closed) VALUES ('b721540b-1135-565f-bea2-00cf62bb67fe', 'cf529d0d-1a31-5198-b060-aa3d990f8690', 1, '09:00', '18:00', false);
INSERT INTO business_hours (id, business_id, day, open_time, close_time, closed) VALUES ('03c1b542-0367-5356-87ed-0984fa93bb3c', 'cf529d0d-1a31-5198-b060-aa3d990f8690', 2, '09:00', '18:00', false);
INSERT INTO business_hours (id, business_id, day, open_time, close_time, closed) VALUES ('3b66576f-baeb-58f1-a418-ddbb315c6e2d', 'cf529d0d-1a31-5198-b060-aa3d990f8690', 3, '09:00', '18:00', false);
INSERT INTO business_hours (id, business_id, day, open_time, close_time, closed) VALUES ('09c2b81c-c528-571e-bec1-93f8c2ef420c', 'cf529d0d-1a31-5198-b060-aa3d990f8690', 4, '09:00', '18:00', false);
INSERT INTO business_hours (id, business_id, day, open_time, close_time, closed) VALUES ('864ba40c-cfa3-5e1c-b286-214449d470bb', 'cf529d0d-1a31-5198-b060-aa3d990f8690', 5, '09:00', '18:00', false);
INSERT INTO business_hours (id, business_id, day, open_time, close_time, closed) VALUES ('942f92e2-bfca-577d-bd1c-d5b980bad730', 'cf529d0d-1a31-5198-b060-aa3d990f8690', 6, '09:00', '18:00', false);
INSERT INTO business_hours (id, business_id, day, open_time, close_time, closed) VALUES ('e2fe160a-c370-5e32-b21e-aefae9b92f55', '338a9cb4-5f03-5e2f-927b-3f485c11e1cf', 0, NULL, NULL, true);
INSERT INTO business_hours (id, business_id, day, open_time, close_time, closed) VALUES ('36d991ab-b494-5079-a98a-fea0404f26fd', '338a9cb4-5f03-5e2f-927b-3f485c11e1cf', 1, '09:00', '18:00', false);
INSERT INTO business_hours (id, business_id, day, open_time, close_time, closed) VALUES ('3970ca0d-6fd8-5078-b5a6-a28f29f86e39', '338a9cb4-5f03-5e2f-927b-3f485c11e1cf', 2, '09:00', '18:00', false);
INSERT INTO business_hours (id, business_id, day, open_time, close_time, closed) VALUES ('72af98dc-98be-508f-96e8-481fee90d92e', '338a9cb4-5f03-5e2f-927b-3f485c11e1cf', 3, '09:00', '18:00', false);
INSERT INTO business_hours (id, business_id, day, open_time, close_time, closed) VALUES ('0439adc5-5a24-5069-acef-e1fc56204860', '338a9cb4-5f03-5e2f-927b-3f485c11e1cf', 4, '09:00', '18:00', false);
INSERT INTO business_hours (id, business_id, day, open_time, close_time, closed) VALUES ('09b1c33f-1a08-524c-8fdf-cfa793d51faa', '338a9cb4-5f03-5e2f-927b-3f485c11e1cf', 5, '09:00', '18:00', false);
INSERT INTO business_hours (id, business_id, day, open_time, close_time, closed) VALUES ('f075df58-636a-5dd6-b055-f683c08dc0bd', '338a9cb4-5f03-5e2f-927b-3f485c11e1cf', 6, '09:00', '18:00', false);
INSERT INTO business_hours (id, business_id, day, open_time, close_time, closed) VALUES ('e4b45cbe-031d-5202-911b-c96883f0cbf2', 'f451bd9b-da5b-5b0f-ac5f-a3c9d3a5e4f0', 0, NULL, NULL, true);
INSERT INTO business_hours (id, business_id, day, open_time, close_time, closed) VALUES ('46df30f1-cffe-516d-880e-9051b27e4d44', 'f451bd9b-da5b-5b0f-ac5f-a3c9d3a5e4f0', 1, '09:00', '18:00', false);
INSERT INTO business_hours (id, business_id, day, open_time, close_time, closed) VALUES ('d9a28c5b-b081-5de9-bc9a-b9ecb317c9ac', 'f451bd9b-da5b-5b0f-ac5f-a3c9d3a5e4f0', 2, '09:00', '18:00', false);
INSERT INTO business_hours (id, business_id, day, open_time, close_time, closed) VALUES ('af06510b-aaf8-5c17-bf90-0096ecf60483', 'f451bd9b-da5b-5b0f-ac5f-a3c9d3a5e4f0', 3, '09:00', '18:00', false);
INSERT INTO business_hours (id, business_id, day, open_time, close_time, closed) VALUES ('47e23543-41e9-55ae-9101-1fa5c4791423', 'f451bd9b-da5b-5b0f-ac5f-a3c9d3a5e4f0', 4, '09:00', '18:00', false);
INSERT INTO business_hours (id, business_id, day, open_time, close_time, closed) VALUES ('002fda0c-35b5-5259-b42e-850e1cefbc9b', 'f451bd9b-da5b-5b0f-ac5f-a3c9d3a5e4f0', 5, '09:00', '18:00', false);
INSERT INTO business_hours (id, business_id, day, open_time, close_time, closed) VALUES ('91f8c713-470f-5e67-b709-6c0d4c952afc', 'f451bd9b-da5b-5b0f-ac5f-a3c9d3a5e4f0', 6, '09:00', '18:00', false);

-- Sample Reviews (8)
INSERT INTO reviews (id, business_id, rating, text, verified_booking, created_at) VALUES ('db09a2fe-0ca3-5cbc-87a8-8a223aa07096', '6b063b0d-c461-544f-970f-bb623d44431f', 5, 'Amazing adire designs! The quality is top-notch and delivery was prompt.', false, '2026-03-03T11:39:11.000Z');
INSERT INTO reviews (id, business_id, rating, text, verified_booking, created_at) VALUES ('c135b20a-5739-53b8-b151-514ae0b41438', '6b063b0d-c461-544f-970f-bb623d44431f', 4, 'Beautiful work, but took a bit longer than expected.', false, '2026-03-03T11:39:11.000Z');
INSERT INTO reviews (id, business_id, rating, text, verified_booking, created_at) VALUES ('43f93c1b-de61-569f-88ee-cd1888139bd1', 'd8cc16ea-cf72-53e7-accf-8c03c7c1c8a8', 5, 'Best barber in Ikeja! Clean cuts every time.', false, '2026-03-03T11:39:11.000Z');
INSERT INTO reviews (id, business_id, rating, text, verified_booking, created_at) VALUES ('8b89e1a5-6e3d-5ade-8ed3-f33796fe4d3a', '80871a87-2659-5ff9-88a5-c07580a33525', 5, 'My go-to makeup artist for events. Always flawless!', false, '2026-03-03T11:39:11.000Z');
INSERT INTO reviews (id, business_id, rating, text, verified_booking, created_at) VALUES ('83180e90-de69-5abb-ab55-78e63c7b8360', 'b6d8c48c-8676-5b65-a987-353b45b30b3d', 4, 'Great event planning service. They handled everything perfectly.', false, '2026-03-03T11:39:11.000Z');
INSERT INTO reviews (id, business_id, rating, text, verified_booking, created_at) VALUES ('ee2ad4af-3198-56a4-8c7d-2095b6f45bdd', 'a7d2f724-4b1b-57b3-a4e8-abde63004c83', 5, 'Incredible photography! The photos came out stunning.', false, '2026-03-03T11:39:11.000Z');
INSERT INTO reviews (id, business_id, rating, text, verified_booking, created_at) VALUES ('f7f08592-f124-577d-b6e0-cc9fcea85160', '859914ff-51d1-591c-8b7f-ea8d5a76a8d7', 4, 'Delicious jollof rice and pounded yam. Very authentic.', false, '2026-03-03T11:39:11.000Z');
INSERT INTO reviews (id, business_id, rating, text, verified_booking, created_at) VALUES ('efaca728-e3b1-51d7-95c0-2d5b0332f2f1', 'f451bd9b-da5b-5b0f-ac5f-a3c9d3a5e4f0', 5, 'Best coffee in Ikoyi! Love the ambiance too.', false, '2026-03-03T11:39:11.000Z');

-- ============================================================
-- SEED COMPLETE
-- Expected: 1 city, 30 areas, 25 categories, 18 landmarks,
--           10 businesses, 56 business hours, 8 reviews
-- ============================================================