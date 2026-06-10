-- Migration: Add seo_description columns to cities and areas tables
-- Run this in Supabase SQL Editor first, then run the population script

ALTER TABLE cities ADD COLUMN IF NOT EXISTS seo_description text;
ALTER TABLE areas ADD COLUMN IF NOT EXISTS seo_description text;
