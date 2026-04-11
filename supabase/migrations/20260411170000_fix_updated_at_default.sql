-- Fix: updated_at column on businesses table has NOT NULL but no default
-- This causes inserts to fail when the application doesn't supply a value

ALTER TABLE businesses
  ALTER COLUMN "updated_at" SET DEFAULT now();

-- Also ensure created_at uses now() for consistency
ALTER TABLE businesses
  ALTER COLUMN "created_at" SET DEFAULT now();
