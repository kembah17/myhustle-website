-- Migration: User Reminders System
-- Tracks reminder state for users who signed up but haven't listed a business
-- Supports dual-channel (Email via Brevo + WhatsApp via Meta Cloud API) reminders

CREATE TABLE IF NOT EXISTS public.user_reminders (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id text NOT NULL,
  user_email text NOT NULL,
  user_phone text,
  user_name text,
  signup_date timestamptz NOT NULL DEFAULT now(),
  has_business boolean NOT NULL DEFAULT false,

  -- Reminder sent timestamps (null = not yet sent)
  reminder_day0_email timestamptz,       -- Welcome email (immediate)
  reminder_day1_whatsapp timestamptz,    -- Day 1 WhatsApp nudge
  reminder_day3_whatsapp timestamptz,    -- Day 3 WhatsApp nudge
  reminder_day7_email timestamptz,       -- Day 7 social proof email
  reminder_day14_email timestamptz,      -- Day 14 value-driven email
  reminder_day30_email timestamptz,      -- Day 30 final email

  opted_out boolean NOT NULL DEFAULT false,
  completed_at timestamptz,              -- When they listed a business

  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

-- Indexes for efficient querying
CREATE INDEX IF NOT EXISTS idx_user_reminders_user_id ON public.user_reminders(user_id);
CREATE INDEX IF NOT EXISTS idx_user_reminders_pending ON public.user_reminders(has_business, opted_out, signup_date)
  WHERE has_business = false AND opted_out = false;
CREATE UNIQUE INDEX IF NOT EXISTS idx_user_reminders_user_id_unique ON public.user_reminders(user_id);

-- Enable RLS
ALTER TABLE public.user_reminders ENABLE ROW LEVEL SECURITY;

-- RLS Policies
-- Users can read their own row
CREATE POLICY "Users can read own reminder row"
  ON public.user_reminders
  FOR SELECT
  TO authenticated
  USING (user_id = auth.uid()::text);

-- Service role can do everything (used by API routes with service role key)
CREATE POLICY "Service role full access"
  ON public.user_reminders
  FOR ALL
  TO service_role
  USING (true)
  WITH CHECK (true);

-- Auto-update updated_at trigger
CREATE OR REPLACE FUNCTION public.update_user_reminders_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER user_reminders_updated_at
  BEFORE UPDATE ON public.user_reminders
  FOR EACH ROW
  EXECUTE FUNCTION public.update_user_reminders_updated_at();
