-- Referral tracking
CREATE TABLE ref_links (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  token TEXT UNIQUE NOT NULL,
  company TEXT NOT NULL,
  notes TEXT,
  user_id TEXT, -- Clerk user ID
  created_at TIMESTAMPTZ DEFAULT now()
);

CREATE TABLE ref_events (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  link_id UUID REFERENCES ref_links(id) ON DELETE CASCADE,
  event_type TEXT DEFAULT 'visit',
  user_agent TEXT,
  ip_trunc TEXT, -- Last octet stripped (EU compliance)
  country TEXT,
  created_at TIMESTAMPTZ DEFAULT now()
);

-- MCP Sentinel
CREATE TABLE mcp_api_keys (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id TEXT NOT NULL, -- Clerk user ID
  key_hash TEXT UNIQUE NOT NULL,
  key_prefix TEXT NOT NULL, -- First 8 chars for display
  name TEXT,
  revoked_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT now()
);

CREATE TABLE mcp_events (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id TEXT NOT NULL,
  tool_name TEXT NOT NULL,
  action TEXT NOT NULL, -- allow, deny, warn, log
  meta_json JSONB,
  created_at TIMESTAMPTZ DEFAULT now()
);
CREATE INDEX idx_mcp_events_user_time ON mcp_events(user_id, created_at DESC);

-- Training
CREATE TABLE datasets (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id TEXT NOT NULL,
  name TEXT NOT NULL,
  source_type TEXT NOT NULL, -- 'github' | 'upload'
  source_url TEXT,
  storage_path TEXT,
  format TEXT NOT NULL, -- 'jsonl_sft' | 'jsonl_chat'
  record_count INT DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT now()
);

CREATE TABLE training_jobs (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id TEXT NOT NULL,
  dataset_id UUID REFERENCES datasets(id),
  provider TEXT NOT NULL, -- 'huggingface' | 'runpod'
  model TEXT NOT NULL,
  preset TEXT NOT NULL, -- 'cheap' | 'balanced' | 'quality'
  status TEXT DEFAULT 'pending',
  logs_json JSONB,
  artifact_url TEXT,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- Enable RLS
ALTER TABLE ref_links ENABLE ROW LEVEL SECURITY;
ALTER TABLE ref_events ENABLE ROW LEVEL SECURITY;
ALTER TABLE mcp_api_keys ENABLE ROW LEVEL SECURITY;
ALTER TABLE mcp_events ENABLE ROW LEVEL SECURITY;
ALTER TABLE datasets ENABLE ROW LEVEL SECURITY;
ALTER TABLE training_jobs ENABLE ROW LEVEL SECURITY;

-- Policies (service role bypasses; app uses service role key server-side)
-- Public insert for ref_events (tracking endpoint is unauthenticated)
CREATE POLICY "Allow insert ref_events" ON ref_events FOR INSERT WITH CHECK (true);
