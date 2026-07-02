import { NextResponse } from 'next/server';
import pg from 'pg';

export const dynamic = 'force-dynamic';

export async function POST(request: Request) {
  const authHeader = request.headers.get('x-migration-key');
  const expectedKey = process.env.SUPABASE_SERVICE_ROLE_KEY?.slice(0, 20);
  if (!authHeader || authHeader !== expectedKey) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const connectionString = "postgresql://postgres:%7BPwd%284%29my-hustle%7D@db.ngqwdfdkvkfgydrtovsq.supabase.co:5432/postgres";
  const client = new pg.Client({ connectionString, ssl: { rejectUnauthorized: false } });

  try {
    await client.connect();

    const sql = `
      CREATE TABLE IF NOT EXISTS whatsapp_config (
        id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
        phone_number_id TEXT,
        waba_id TEXT,
        access_token TEXT,
        verify_token TEXT,
        app_secret TEXT,
        business_phone TEXT,
        display_name TEXT DEFAULT 'MyHustle',
        is_active BOOLEAN DEFAULT false,
        created_at TIMESTAMPTZ DEFAULT now(),
        updated_at TIMESTAMPTZ DEFAULT now()
      );

      CREATE TABLE IF NOT EXISTS whatsapp_messages (
        id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
        wa_message_id TEXT UNIQUE,
        direction TEXT CHECK (direction IN ('inbound', 'outbound')),
        from_number TEXT,
        to_number TEXT,
        message_type TEXT DEFAULT 'text',
        content JSONB DEFAULT '{}',
        status TEXT DEFAULT 'sent',
        flow_type TEXT,
        business_id UUID REFERENCES businesses(id),
        metadata JSONB DEFAULT '{}',
        created_at TIMESTAMPTZ DEFAULT now()
      );

      CREATE TABLE IF NOT EXISTS whatsapp_templates (
        id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
        name TEXT UNIQUE NOT NULL,
        category TEXT DEFAULT 'MARKETING',
        language TEXT DEFAULT 'en',
        components JSONB DEFAULT '[]',
        status TEXT DEFAULT 'draft',
        meta_template_id TEXT,
        created_at TIMESTAMPTZ DEFAULT now(),
        updated_at TIMESTAMPTZ DEFAULT now()
      );

      CREATE TABLE IF NOT EXISTS whatsapp_flows (
        id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
        flow_type TEXT NOT NULL,
        business_id UUID REFERENCES businesses(id),
        phone_number TEXT,
        current_step TEXT DEFAULT 'start',
        flow_data JSONB DEFAULT '{}',
        status TEXT DEFAULT 'active',
        created_at TIMESTAMPTZ DEFAULT now(),
        updated_at TIMESTAMPTZ DEFAULT now()
      );

      CREATE INDEX IF NOT EXISTS idx_wa_messages_business ON whatsapp_messages(business_id);
      CREATE INDEX IF NOT EXISTS idx_wa_messages_direction ON whatsapp_messages(direction);
      CREATE INDEX IF NOT EXISTS idx_wa_messages_flow ON whatsapp_messages(flow_type);
      CREATE INDEX IF NOT EXISTS idx_wa_messages_created ON whatsapp_messages(created_at DESC);
      CREATE INDEX IF NOT EXISTS idx_wa_flows_business ON whatsapp_flows(business_id);
      CREATE INDEX IF NOT EXISTS idx_wa_flows_phone ON whatsapp_flows(phone_number);
      CREATE INDEX IF NOT EXISTS idx_wa_flows_type ON whatsapp_flows(flow_type);

      ALTER TABLE whatsapp_config ENABLE ROW LEVEL SECURITY;
      ALTER TABLE whatsapp_messages ENABLE ROW LEVEL SECURITY;
      ALTER TABLE whatsapp_templates ENABLE ROW LEVEL SECURITY;
      ALTER TABLE whatsapp_flows ENABLE ROW LEVEL SECURITY;
    `;

    const policyStatements = [
      `DO $$ BEGIN IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename='whatsapp_config' AND policyname='Service role full access') THEN CREATE POLICY "Service role full access" ON whatsapp_config FOR ALL USING (auth.role() = 'service_role'); END IF; END $$`,
      `DO $$ BEGIN IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename='whatsapp_messages' AND policyname='Service role full access') THEN CREATE POLICY "Service role full access" ON whatsapp_messages FOR ALL USING (auth.role() = 'service_role'); END IF; END $$`,
      `DO $$ BEGIN IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename='whatsapp_templates' AND policyname='Service role full access') THEN CREATE POLICY "Service role full access" ON whatsapp_templates FOR ALL USING (auth.role() = 'service_role'); END IF; END $$`,
      `DO $$ BEGIN IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename='whatsapp_flows' AND policyname='Service role full access') THEN CREATE POLICY "Service role full access" ON whatsapp_flows FOR ALL USING (auth.role() = 'service_role'); END IF; END $$`,
    ];

    await client.query(sql);

    const policyResults = [];
    for (const stmt of policyStatements) {
      try {
        await client.query(stmt);
        policyResults.push({ success: true });
      } catch (err: any) {
        policyResults.push({ success: false, error: err.message });
      }
    }

    await client.end();
    return NextResponse.json({ success: true, tables: 4, indexes: 7, rls: 4, policies: policyResults });
  } catch (err: any) {
    return NextResponse.json({ error: 'Failed', details: err.message }, { status: 500 });
  }
}
