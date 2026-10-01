// Task-to-Flow — deterministic pattern engine (no LLM, no API keys)
//
// Honesty rule: this is a *deterministic keyword/template* matcher.
// It maps plain-language recruiter input to one of N pre-defined integration
// pattern templates. There is NO LLM, NO external API, NO API keys.
// Numbers (hours saved) are slider-driven by the USER, never claimed by David.

export const PATTERNS = [
  {
    id: "form-routing",
    title: "Contact-form lead → notification + routing",
    chip: "Form replies",
    sample: "When customers fill our contact form someone has to reply manually and we're not sure who owns it.",
    explanation:
      "When customers fill your contact form, the message is routed to whoever owns that topic (sales vs support vs billing) with a readable summary — no lead slips through.",
    keywords: [
      "contact form", "contact us", "lead", "leads", "message", "reply", "email",
      "who owns", "routing", "assign", "slip through", "follow up", "response",
    ],
    steps: [
      { label: "Customer submits contact form", icon: "📝" },
      { label: "Details captured in a row", icon: "💾" },
      { label: "Routed to the right owner", icon: "📍" },
      { label: "Owner gets a readable summary", icon: "🔔" },
      { label: "Owner replies from the ticket", icon: "✉️" },
    ],
    implementation: {
      trigger: "A new submission arrives from the configured contact form.",
      inputs: ["Submission ID", "Name", "Email", "Message", "Form/source"],
      actions: [
        "Check required fields and normalize the contact details.",
        "Choose an owner from an explicit topic-to-team routing table.",
        "Create one lead or ticket, using the submission ID to prevent duplicates.",
        "Notify the owner with the original message and a link back to the submission.",
      ],
      validation: ["Required fields are present", "Contact address is valid", "Submission ID has not been processed"],
      handoff: "Unknown topics, missing owners, or failed notifications stay visible for a person to review.",
      outputs: ["Lead/ticket ID", "Assigned owner", "Notification status"],
      tests: ["Missing email is held for review", "Duplicate submission creates one record", "Unknown topic is not silently routed", "Notification failure remains retryable"],
    },
  },
  {
    id: "invoice-structuring",
    title: "Invoice / incoming email → structured data",
    chip: "Invoices to data",
    sample: "Invoices arrive by email and someone copies the amounts into our spreadsheet by hand every week.",
    explanation:
      "Invoices and order emails get read automatically, key fields (amount, VAT, supplier) pulled out, and a row appears in your spreadsheet — no copy/paste.",
    keywords: [
      "invoice", "invoices", "receipt", "amount", "vat", "spreadsheet",
      "copy", "paste", "data entry", "structured", "fields", "excel",
    ],
    steps: [
      { label: "Invoice email arrives", icon: "📧" },
      { label: "Amount, VAT, supplier pulled out", icon: "🔍" },
      { label: "Numbers checked against rules", icon: "✅" },
      { label: "Row added to your spreadsheet", icon: "📊" },
    ],
    implementation: {
      trigger: "A new invoice attachment reaches the configured intake mailbox or upload folder.",
      inputs: ["File reference", "Supplier", "Invoice number", "Invoice date", "Currency", "Net/tax/total"],
      actions: [
        "Read the supported document and extract the agreed fields.",
        "Normalize dates and amounts before comparing them.",
        "Check arithmetic and look for an existing supplier/invoice-number pair.",
        "Write a new row only when validation passes; otherwise create a review item.",
      ],
      validation: ["Required fields are present", "Net plus tax matches total within an agreed tolerance", "Duplicate invoice is detected"],
      handoff: "Unreadable files, mismatched totals, and uncertain fields are flagged instead of guessed.",
      outputs: ["Validated spreadsheet row", "Source file reference", "Review status"],
      tests: ["Valid invoice creates one row", "Duplicate invoice is not inserted twice", "Amount mismatch goes to review", "Missing supplier is flagged"],
    },
  },
  {
    id: "report-generation",
    title: "Scheduled report → assembled + delivered",
    chip: "Reports",
    sample: "Every morning someone spends an hour copy-pasting numbers into our weekly report.",
    explanation:
      "A report that used to take an hour of copy/pasting now builds itself each morning and lands in your inbox as a PDF.",
    keywords: [
      "report", "reports", "reporting", "dashboard", "export", "pdf",
      "morning", "every day", "weekly", "schedule", "hour",
    ],
    steps: [
      { label: "Data gathered from sources", icon: "🗂️" },
      { label: "Report assembled automatically", icon: "🧩" },
      { label: "Turned into a clean PDF", icon: "📄" },
      { label: "Sent to your inbox each morning", icon: "📤" },
    ],
    implementation: {
      trigger: "A schedule or an authorized manual run starts the requested reporting period.",
      inputs: ["Date range", "Approved source list", "Metric definitions", "Recipient list"],
      actions: [
        "Read the agreed fields from each approved source.",
        "Check date coverage and record which sources were available.",
        "Assemble the report with the definitions and source notes beside each metric.",
        "Render and deliver the report only after the completeness checks pass.",
      ],
      validation: ["Requested period is explicit", "Required sources responded", "Totals reconcile with the chosen definitions"],
      handoff: "A missing or stale source leaves the report marked incomplete for review; it is not presented as a complete run.",
      outputs: ["Report file", "Source/period manifest", "Delivery status"],
      tests: ["Missing source marks the report incomplete", "Wrong period is rejected", "A repeated run does not duplicate a delivery record"],
    },
  },
  {
    id: "crm-erp-update",
    title: "CRM/ERP record update from an event",
    chip: "System sync",
    sample: "When we close a deal someone has to manually update the customer record in the ERP.",
    explanation:
      "A status change in one system (deal won, payment received) automatically updates the matching record in the other, so your two systems stay in sync.",
    keywords: [
      "crm", "erp", "sync", "update", "status", "deal", "payment",
      "record", "keep in sync", "manually update",
    ],
    steps: [
      { label: "Change happens in system A", icon: "💡" },
      { label: "Matching record found in system B", icon: "🔗" },
      { label: "Record updated automatically", icon: "🔄" },
      { label: "Change logged for your team", icon: "📖" },
    ],
    implementation: {
      trigger: "An approved status or payment event arrives from the configured source system.",
      inputs: ["Event ID", "Source record ID", "Destination record ID", "Allowlisted fields", "Event time"],
      actions: [
        "Match records with a stable cross-system identifier.",
        "Reject duplicate or out-of-order events before writing.",
        "Update only the fields approved for this integration.",
        "Record the change and its source event for later inspection.",
      ],
      validation: ["Exactly one destination record matches", "Event ID has not already been applied", "Field values pass destination rules"],
      handoff: "Ambiguous matches, conflicts, or destination errors remain queued for a person; no broad overwrite is attempted.",
      outputs: ["Updated record ID", "Applied field list", "Audit result"],
      tests: ["Duplicate event is idempotent", "Ambiguous match is held", "Disallowed field is not changed", "Destination error is visible"],
    },
  },
  {
    id: "faq-handoff",
    title: "FAQ question → answer or human handoff",
    chip: "FAQ answers",
    sample: "Our team answers the same customer questions over and over; only the tricky ones really need a human.",
    explanation:
      "Common questions get an instant answer; trickier ones that need a human get passed to your team with full context.",
    keywords: [
      "faq", "question", "questions", "answer", "instant", "human",
      "handoff", "knowledge base", "over and over", "same questions",
    ],
    steps: [
      { label: "Question classified", icon: "🏷️" },
      { label: "Answer found in knowledge base", icon: "📚" },
      { label: "Answer it, or pass it on?", icon: "❓" },
      { label: "Instant answer OR ticket created", icon: "💬" },
    ],
    implementation: {
      trigger: "A question arrives through the configured customer-support channel.",
      inputs: ["Question text", "Conversation ID", "Approved knowledge-base version", "Audience"],
      actions: [
        "Classify the request and retrieve only from the approved knowledge base.",
        "Attach the source article and version to the draft answer.",
        "Apply the agreed support threshold before showing an answer.",
        "Create a human-review ticket when evidence is missing or conflicting.",
      ],
      validation: ["Answer has supporting source text", "Source is approved for the audience", "Unsupported requests do not receive an invented answer"],
      handoff: "Low-confidence or unsupported questions go to a person with the conversation context attached.",
      outputs: ["Grounded answer with source", "Or a review ticket with the original question"],
      tests: ["Known question cites its source", "Unapproved source is excluded", "No-match question is handed off", "Conflicting answer is not sent"],
    },
  },
  {
    id: "data-entry-bridge",
    title: "Data entry between two systems",
    chip: "Copy-paste bridge",
    sample: "We copy rows from one tool into another tool manually every day.",
    explanation:
      "Instead of copy/pasting rows from one tool to another, entries flow from A to B automatically and anything it can't read gets flagged.",
    keywords: [
      "two systems", "another tool", "transfer", "migration", "rows",
      "from one", "into another", "re-enter", "retype",
    ],
    steps: [
      { label: "New row appears in system A", icon: "👀" },
      { label: "Fields mapped to system B", icon: "🗺️" },
      { label: "Row pushed to system B", icon: "📤" },
      { label: "Unreadable rows flagged for review", icon: "🚩" },
    ],
    implementation: {
      trigger: "A new or changed row appears in the configured source system.",
      inputs: ["Source row ID", "Selected source fields", "Destination schema", "Mapping rules"],
      actions: [
        "Normalize values using the agreed field mapping.",
        "Validate required destination fields before writing.",
        "Upsert using a stable source ID so retries do not create duplicates.",
        "Record the destination result and the source row reference.",
      ],
      validation: ["Required destination fields are present", "Values fit destination types", "Source row ID has not been copied already"],
      handoff: "Unknown columns, rejected writes, or ambiguous mappings are flagged for review rather than discarded.",
      outputs: ["Destination record ID", "Mapping outcome", "Review/error status"],
      tests: ["Duplicate source row does not duplicate destination record", "Unknown field is flagged", "Destination error remains retryable", "Valid row maps to the expected fields"],
    },
  },
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
      confidence: p.keywords.length ? hits.length / p.keywords.length : 0,
    };
  }).sort((a, b) => b.score - a.score || a.pattern.keywords.length - b.pattern.keywords.length);
  return ranked[0];
}

// ---------------------------------------------------------------------------
// Hours-saved — USER-driven via assumption sliders, never a claimed metric.
// ---------------------------------------------------------------------------
export function hoursPerMonth(tasksPerDay, minutesPerTask) {
  return (tasksPerDay * minutesPerTask * 22) / 60; // 22 working days/month
}
