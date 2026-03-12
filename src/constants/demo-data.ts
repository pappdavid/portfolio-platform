// Demo data for guest/demo mode — realistic fake data for dashboard widgets

export const DEMO_USER_ID = 'demo_guest';

const now = Date.now();
const mins = (n: number) => new Date(now - n * 60_000).toISOString();
const hours = (n: number) => new Date(now - n * 3_600_000).toISOString();
const days = (n: number) => new Date(now - n * 86_400_000).toISOString();

// ---------------------------------------------------------------------------
// MCP API Keys
// ---------------------------------------------------------------------------
export const demoApiKeys = [
  {
    id: 'demo-key-1',
    key_prefix: 'sk-mcp-a1b2',
    name: 'Production Agent',
    revoked_at: null,
    created_at: days(14)
  },
  {
    id: 'demo-key-2',
    key_prefix: 'sk-mcp-c3d4',
    name: 'Staging Environment',
    revoked_at: null,
    created_at: days(7)
  },
  {
    id: 'demo-key-3',
    key_prefix: 'sk-mcp-e5f6',
    name: 'Local Dev',
    revoked_at: days(3),
    created_at: days(21)
  }
];

// ---------------------------------------------------------------------------
// MCP Events
// ---------------------------------------------------------------------------
export const demoMcpEvents = [
  {
    id: 'demo-ev-1',
    user_id: DEMO_USER_ID,
    tool_name: 'read_file',
    action: 'allow',
    meta_json: { path: '/src/features/auth/components/sign-in-view.tsx' },
    created_at: mins(2)
  },
  {
    id: 'demo-ev-2',
    user_id: DEMO_USER_ID,
    tool_name: 'bash',
    action: 'deny',
    meta_json: { command: 'rm -rf /etc/passwd', reason: 'destructive_path' },
    created_at: mins(5)
  },
  {
    id: 'demo-ev-3',
    user_id: DEMO_USER_ID,
    tool_name: 'search_files',
    action: 'allow',
    meta_json: { query: 'supabase RLS', directory: '/src' },
    created_at: mins(12)
  },
  {
    id: 'demo-ev-4',
    user_id: DEMO_USER_ID,
    tool_name: 'write_file',
    action: 'warn',
    meta_json: { path: '/src/proxy.ts', size_bytes: 1240 },
    created_at: mins(18)
  },
  {
    id: 'demo-ev-5',
    user_id: DEMO_USER_ID,
    tool_name: 'fetch_url',
    action: 'allow',
    meta_json: { url: 'https://api.openai.com/v1/models', status: 200 },
    created_at: mins(27)
  },
  {
    id: 'demo-ev-6',
    user_id: DEMO_USER_ID,
    tool_name: 'bash',
    action: 'allow',
    meta_json: { command: 'npm run lint', exit_code: 0 },
    created_at: hours(1)
  },
  {
    id: 'demo-ev-7',
    user_id: DEMO_USER_ID,
    tool_name: 'read_file',
    action: 'allow',
    meta_json: { path: '/supabase/migrations/001_initial.sql' },
    created_at: hours(2)
  },
  {
    id: 'demo-ev-8',
    user_id: DEMO_USER_ID,
    tool_name: 'bash',
    action: 'deny',
    meta_json: {
      command: 'curl http://internal-vpc/secrets',
      reason: 'ssrf_blocked'
    },
    created_at: hours(3)
  },
  {
    id: 'demo-ev-9',
    user_id: DEMO_USER_ID,
    tool_name: 'search_files',
    action: 'allow',
    meta_json: { query: 'rate limit', results: 4 },
    created_at: hours(5)
  },
  {
    id: 'demo-ev-10',
    user_id: DEMO_USER_ID,
    tool_name: 'write_file',
    action: 'allow',
    meta_json: { path: '/src/lib/rate-limit.ts', size_bytes: 890 },
    created_at: hours(6)
  }
];

// ---------------------------------------------------------------------------
// Training — Datasets
// ---------------------------------------------------------------------------
export const demoDatasets = [
  {
    id: 'demo-ds-1',
    user_id: DEMO_USER_ID,
    name: 'portfolio-platform-sft',
    source_type: 'github',
    source_url: 'https://github.com/pappdavid/portfolio-platform',
    storage_path: 'datasets/demo/portfolio-platform-sft.jsonl',
    format: 'jsonl_sft',
    record_count: 1842,
    created_at: days(5)
  },
  {
    id: 'demo-ds-2',
    user_id: DEMO_USER_ID,
    name: 'mcp-sentinel-chat',
    source_type: 'github',
    source_url: 'https://github.com/pappdavid/mcp-sentinel',
    storage_path: 'datasets/demo/mcp-sentinel-chat.jsonl',
    format: 'jsonl_chat',
    record_count: 632,
    created_at: days(9)
  },
  {
    id: 'demo-ds-3',
    user_id: DEMO_USER_ID,
    name: 'rag-docs-upload',
    source_type: 'upload',
    source_url: null,
    storage_path: 'datasets/demo/rag-docs-upload.jsonl',
    format: 'jsonl_sft',
    record_count: 204,
    created_at: days(12)
  }
];

// ---------------------------------------------------------------------------
// Training — Jobs
// ---------------------------------------------------------------------------
export const demoTrainingJobs = [
  {
    id: 'demo-job-1',
    user_id: DEMO_USER_ID,
    dataset_id: 'demo-ds-1',
    provider: 'huggingface',
    model: 'mistralai/Mistral-7B-v0.1',
    preset: 'balanced',
    status: 'completed',
    logs_json: { steps: 500, loss: 0.182, val_loss: 0.197 },
    artifact_url: 'https://huggingface.co/demo/portfolio-lora',
    created_at: days(4),
    updated_at: days(3)
  },
  {
    id: 'demo-job-2',
    user_id: DEMO_USER_ID,
    dataset_id: 'demo-ds-2',
    provider: 'runpod',
    model: 'meta-llama/Llama-3-8B',
    preset: 'quality',
    status: 'running',
    logs_json: { steps: 210, loss: 0.241 },
    artifact_url: null,
    created_at: days(1),
    updated_at: hours(3)
  },
  {
    id: 'demo-job-3',
    user_id: DEMO_USER_ID,
    dataset_id: 'demo-ds-3',
    provider: 'huggingface',
    model: 'microsoft/phi-2',
    preset: 'cheap',
    status: 'failed',
    logs_json: { error: 'CUDA OOM at step 45', steps: 45 },
    artifact_url: null,
    created_at: days(8),
    updated_at: days(8)
  }
];

// ---------------------------------------------------------------------------
// Referral Links
// ---------------------------------------------------------------------------
export const demoRefLinks = [
  {
    id: 'demo-ref-1',
    token: 'demo-abc123',
    company: 'Acme Corp',
    notes: 'Lead from LinkedIn outreach',
    user_id: DEMO_USER_ID,
    created_at: days(10),
    events: [
      { id: 'demo-ref-ev-1', event_type: 'visit', created_at: days(8) },
      { id: 'demo-ref-ev-2', event_type: 'visit', created_at: days(6) },
      { id: 'demo-ref-ev-3', event_type: 'visit', created_at: days(2) }
    ],
    event_count: 3
  },
  {
    id: 'demo-ref-2',
    token: 'demo-def456',
    company: 'Vercel',
    notes: 'Recruiter cold email',
    user_id: DEMO_USER_ID,
    created_at: days(7),
    events: [{ id: 'demo-ref-ev-4', event_type: 'visit', created_at: days(5) }],
    event_count: 1
  },
  {
    id: 'demo-ref-3',
    token: 'demo-ghi789',
    company: 'Stripe',
    notes: null,
    user_id: DEMO_USER_ID,
    created_at: days(3),
    events: [],
    event_count: 0
  }
];

// ---------------------------------------------------------------------------
// Overview Stats
// ---------------------------------------------------------------------------
export const demoStats = {
  mcpCalls: 1247,
  datasets: 3,
  activeKeys: 2
};
