-- WhatsApp Cloud API messaging layer for MyHustle
-- Created: 2026-07-02

-- WhatsApp configuration (single row for MyHustle)
CREATE TABLE IF NOT EXISTS whatsapp_config (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  phone_number_id text NOT NULL,
  waba_id text NOT NULL,
  access_token text NOT NULL,
  verify_token text NOT NULL DEFAULT 'myhustle_webhook_verify',
  display_phone text,
  business_name text DEFAULT 'MyHustle',
  is_active boolean DEFAULT true,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Message log for all sent/received messages
CREATE TABLE IF NOT EXISTS whatsapp_messages (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  direction text NOT NULL CHECK (direction IN ('inbound', 'outbound')),
  wa_message_id text,
  phone text NOT NULL,
  message_type text NOT NULL DEFAULT 'text',
  template_name text,
  content text,
  status text DEFAULT 'sent',
  status_timestamp timestamptz,
  error_message text,
  conversation_category text,
  cost_ngn numeric(10,4),
  business_id text REFERENCES businesses(id),
  flow_type text,
  metadata jsonb DEFAULT '{}',
  created_at timestamptz DEFAULT now()
);

-- Message templates registered with Meta
CREATE TABLE IF NOT EXISTS whatsapp_templates (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL UNIQUE,
  category text NOT NULL,
  language text DEFAULT 'en',
  status text DEFAULT 'draft',
  components jsonb NOT NULL DEFAULT '[]',
  meta_template_id text,
  flow_type text,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Automation flows tracking
CREATE TABLE IF NOT EXISTS whatsapp_flows (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  business_id text REFERENCES businesses(id),
  flow_type text NOT NULL,
  status text DEFAULT 'pending',
  step integer DEFAULT 0,
  data jsonb DEFAULT '{}',
  next_action_at timestamptz,
  completed_at timestamptz,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- RLS policies
ALTER TABLE whatsapp_config ENABLE ROW LEVEL SECURITY;
ALTER TABLE whatsapp_messages ENABLE ROW LEVEL SECURITY;
ALTER TABLE whatsapp_templates ENABLE ROW LEVEL SECURITY;
ALTER TABLE whatsapp_flows ENABLE ROW LEVEL SECURITY;

-- Service role full access (server-side only)
CREATE POLICY "service_role_whatsapp_config" ON whatsapp_config
  FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "service_role_whatsapp_messages" ON whatsapp_messages
  FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "service_role_whatsapp_templates" ON whatsapp_templates
  FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "service_role_whatsapp_flows" ON whatsapp_flows
  FOR ALL USING (true) WITH CHECK (true);

-- Indexes for performance
CREATE INDEX IF NOT EXISTS idx_wa_messages_phone ON whatsapp_messages(phone);
CREATE INDEX IF NOT EXISTS idx_wa_messages_business ON whatsapp_messages(business_id);
CREATE INDEX IF NOT EXISTS idx_wa_messages_flow ON whatsapp_messages(flow_type);
CREATE INDEX IF NOT EXISTS idx_wa_messages_status ON whatsapp_messages(status);
CREATE INDEX IF NOT EXISTS idx_wa_messages_created ON whatsapp_messages(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_wa_messages_wa_id ON whatsapp_messages(wa_message_id);
CREATE INDEX IF NOT EXISTS idx_wa_flows_business ON whatsapp_flows(business_id);
CREATE INDEX IF NOT EXISTS idx_wa_flows_status ON whatsapp_flows(status);
CREATE INDEX IF NOT EXISTS idx_wa_flows_next_action ON whatsapp_flows(next_action_at)
  WHERE status = 'active';
CREATE INDEX IF NOT EXISTS idx_wa_flows_type_status ON whatsapp_flows(flow_type, status);
