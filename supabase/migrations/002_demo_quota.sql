-- Demo quota system: companies, quotas, events

CREATE TABLE IF NOT EXISTS companies (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  domain TEXT UNIQUE NOT NULL,
  created_at TIMESTAMPTZ DEFAULT now()
);

CREATE TABLE IF NOT EXISTS demo_quotas (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  company_id UUID REFERENCES companies(id) ON DELETE CASCADE,
  demo_type TEXT NOT NULL, -- 'mcp' | 'training' | 'rag'
  start_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  end_at TIMESTAMPTZ NOT NULL,
  remaining INTEGER NOT NULL,
  status TEXT NOT NULL DEFAULT 'active', -- 'active' | 'expired'
  created_at TIMESTAMPTZ DEFAULT now(),
  UNIQUE (company_id, demo_type)
);

CREATE TABLE IF NOT EXISTS demo_events (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  company_id UUID REFERENCES companies(id) ON DELETE CASCADE,
  user_id TEXT NOT NULL, -- Clerk user ID
  demo_type TEXT NOT NULL,
  metadata JSONB,
  created_at TIMESTAMPTZ DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_demo_events_company ON demo_events(company_id, created_at DESC);
CREATE INDEX IF NOT EXISTS idx_demo_events_user ON demo_events(user_id, created_at DESC);
CREATE INDEX IF NOT EXISTS idx_demo_quotas_company ON demo_quotas(company_id, demo_type);

-- Enable RLS
ALTER TABLE companies ENABLE ROW LEVEL SECURITY;
ALTER TABLE demo_quotas ENABLE ROW LEVEL SECURITY;
ALTER TABLE demo_events ENABLE ROW LEVEL SECURITY;

-- Service role bypasses RLS; app uses service role key server-side
