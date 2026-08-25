// Task-to-Flow — deterministic pattern engine (no LLM, no API keys)
//
// Honesty rule: this is a *deterministic keyword/template* matcher.
// It maps plain-language recruiter input to one of N pre-defined integration
// pattern templates. There is NO LLM, NO external API, NO API keys.
// Numbers (hours saved) are slider-driven by the USER, never claimed by David.

export const PATTERNS = [
  {
    id: 'form-routing',
    title: 'Contact-form lead → notification + routing',
    chip: 'Form replies',
    sample:
      "When customers fill our contact form someone has to reply manually and we're not sure who owns it.",
    explanation:
      'When customers fill your contact form, the message is routed to whoever owns that topic (sales vs support vs billing) with a readable summary — no lead slips through.',
    keywords: [
      'contact form',
      'contact us',
      'lead',
      'leads',
      'message',
      'reply',
      'email',
      'who owns',
      'routing',
      'assign',
      'slip through',
      'follow up',
      'response'
    ],
    steps: [
      { label: 'Customer submits contact form', icon: '📝' },
      { label: 'Details captured in a row', icon: '💾' },
      { label: 'Routed to the right owner', icon: '📍' },
      { label: 'Owner gets a readable summary', icon: '🔔' },
      { label: 'Owner replies from the ticket', icon: '✉️' }
    ]
  },
  {
    id: 'invoice-structuring',
    title: 'Invoice / incoming email → structured data',
    chip: 'Invoices to data',
    sample:
      'Invoices arrive by email and someone copies the amounts into our spreadsheet by hand every week.',
    explanation:
      'Invoices and order emails get read automatically, key fields (amount, VAT, supplier) pulled out, and a row appears in your spreadsheet — no copy/paste.',
    keywords: [
      'invoice',
      'invoices',
      'receipt',
      'amount',
      'vat',
      'spreadsheet',
      'copy',
      'paste',
      'data entry',
      'structured',
      'fields',
      'excel'
    ],
    steps: [
      { label: 'Invoice email arrives', icon: '📧' },
      { label: 'Amount, VAT, supplier pulled out', icon: '🔍' },
      { label: 'Numbers checked against rules', icon: '✅' },
      { label: 'Row added to your spreadsheet', icon: '📊' }
    ]
  },
  {
    id: 'report-generation',
    title: 'Scheduled report → assembled + delivered',
    chip: 'Reports',
    sample:
      'Every morning someone spends an hour copy-pasting numbers into our weekly report.',
    explanation:
      'A report that used to take an hour of copy/pasting now builds itself each morning and lands in your inbox as a PDF.',
    keywords: [
      'report',
      'reports',
      'reporting',
      'dashboard',
      'export',
      'pdf',
      'morning',
      'every day',
      'weekly',
      'schedule',
      'hour'
    ],
    steps: [
      { label: 'Data gathered from sources', icon: '🗂️' },
      { label: 'Report assembled automatically', icon: '🧩' },
      { label: 'Turned into a clean PDF', icon: '📄' },
      { label: 'Sent to your inbox each morning', icon: '📤' }
    ]
  },
  {
    id: 'crm-erp-update',
    title: 'CRM/ERP record update from an event',
    chip: 'System sync',
    sample:
      'When we close a deal someone has to manually update the customer record in the ERP.',
    explanation:
      'A status change in one system (deal won, payment received) automatically updates the matching record in the other, so your two systems stay in sync.',
    keywords: [
      'crm',
      'erp',
      'sync',
      'update',
      'status',
      'deal',
      'payment',
      'record',
      'keep in sync',
      'manually update'
    ],
    steps: [
      { label: 'Change happens in system A', icon: '💡' },
      { label: 'Matching record found in system B', icon: '🔗' },
      { label: 'Record updated automatically', icon: '🔄' },
      { label: 'Change logged for your team', icon: '📖' }
    ]
  },
  {
    id: 'faq-handoff',
    title: 'FAQ question → answer or human handoff',
    chip: 'FAQ answers',
    sample:
      'Our team answers the same customer questions over and over; only the tricky ones really need a human.',
    explanation:
      'Common questions get an instant answer; trickier ones that need a human get passed to your team with full context.',
    keywords: [
      'faq',
      'question',
      'questions',
      'answer',
      'instant',
      'human',
      'handoff',
      'knowledge base',
      'over and over',
      'same questions'
    ],
    steps: [
      { label: 'Question classified', icon: '🏷️' },
      { label: 'Answer found in knowledge base', icon: '📚' },
      { label: 'Answer it, or pass it on?', icon: '❓' },
      { label: 'Instant answer OR ticket created', icon: '💬' }
    ]
  },
  {
    id: 'data-entry-bridge',
    title: 'Data entry between two systems',
    chip: 'Copy-paste bridge',
    sample: 'We copy rows from one tool into another tool manually every day.',
    explanation:
      "Instead of copy/pasting rows from one tool to another, entries flow from A to B automatically and anything it can't read gets flagged.",
    keywords: [
      'two systems',
      'another tool',
      'transfer',
      'migration',
      'rows',
      'from one',
      'into another',
      're-enter',
      'retype'
    ],
    steps: [
      { label: 'New row appears in system A', icon: '👀' },
      { label: 'Fields mapped to system B', icon: '🗺️' },
      { label: 'Row pushed to system B', icon: '📤' },
      { label: 'Unreadable rows flagged for review', icon: '🚩' }
    ]
  }
];

// ---------------------------------------------------------------------------
// Matching engine — pure function, deterministic.
// Scores each pattern by how many of its keywords appear as substrings of the
// lowercased input; ties broken by fewer total keywords (more specific).
// ---------------------------------------------------------------------------
export function matchPattern(input) {
  const lower = input.toLowerCase();
  const ranked = PATTERNS.map((p) => {
    const hits = p.keywords.filter((k) => lower.includes(k));
    return {
      pattern: p,
      score: hits.length,
      confidence: p.keywords.length ? hits.length / p.keywords.length : 0
    };
  }).sort(
    (a, b) =>
      b.score - a.score || a.pattern.keywords.length - b.pattern.keywords.length
  );
  return ranked[0];
}

// ---------------------------------------------------------------------------
// Hours-saved — USER-driven via assumption sliders, never a claimed metric.
// ---------------------------------------------------------------------------
export function hoursPerMonth(tasksPerDay, minutesPerTask) {
  return (tasksPerDay * minutesPerTask * 22) / 60; // 22 working days/month
}
