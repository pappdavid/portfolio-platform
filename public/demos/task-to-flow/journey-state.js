import { PATTERNS, hoursPerMonth } from "./engine.js";

export const RESULT_VERSION = 1;
export const RESULT_TTL_MS = 2 * 60 * 60 * 1000;
export const MAX_CACHED_RESULTS = 6;
export const MAX_TASK_LENGTH = 280;
export const RESULT_STORAGE_PREFIX = `task-to-flow:result:v${RESULT_VERSION}:`;

const ALLOWED_ROLES = new Set([
  "ai-engineering",
  "ai-integration",
  "automation",
  "product-engineering",
]);
const UUID_RE = /^[0-9a-f]{8}-[0-9a-f]{4}-[1-8][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;
const REF_RE = /^[a-f0-9]{16}$/;
const COMPANY_RE = /^[a-z0-9][a-z0-9-]{0,62}[a-z0-9]$/;

function cloneJson(value) {
  return JSON.parse(JSON.stringify(value));
}

function boundedInteger(value, min, max) {
  const number = Number(value);
  return Number.isInteger(number) && number >= min && number <= max ? number : null;
}

export function isResultId(value) {
  return typeof value === "string" && UUID_RE.test(value);
}

export function createResultId(cryptoApi = globalThis.crypto) {
  if (!cryptoApi || typeof cryptoApi.randomUUID !== "function") {
    throw new Error("Secure UUID generation is unavailable in this browser.");
  }
  const id = cryptoApi.randomUUID();
  if (!isResultId(id)) throw new Error("The browser returned an invalid result ID.");
  return id.toLowerCase();
}

export function resultStorageKey(id) {
  return isResultId(id) ? `${RESULT_STORAGE_PREFIX}${id.toLowerCase()}` : null;
}

export function resultHash(id) {
  return isResultId(id) ? `#result/${id.toLowerCase()}` : null;
}

export function implementationHash(id) {
  return isResultId(id) ? `#implementation/${id.toLowerCase()}` : null;
}

export function parseJourneyHash(hash) {
  const match = String(hash ?? "").match(/^#(result|implementation)\/([0-9a-f-]{36})$/i);
  if (!match || !isResultId(match[2])) return null;
  return { view: match[1].toLowerCase(), id: match[2].toLowerCase() };
}

export function normalizeContext(input = {}) {
  const role = typeof input.role === "string" && ALLOWED_ROLES.has(input.role)
    ? input.role
    : null;
  const ref = typeof input.ref === "string" && REF_RE.test(input.ref)
    ? input.ref
    : null;
  const company = typeof (input.company ?? input.c) === "string" && COMPANY_RE.test(input.company ?? input.c)
    ? (input.company ?? input.c)
    : null;
  return { role, ref, company };
}

export function contextFromSearch(search = "") {
  const params = search instanceof URLSearchParams ? search : new URLSearchParams(search);
  return normalizeContext({
    role: params.get("role"),
    ref: params.get("ref"),
    c: params.get("c"),
  });
}

function normalizePattern(pattern) {
  if (!pattern || typeof pattern !== "object") return null;
  const source = PATTERNS.find((candidate) => candidate.id === pattern.id);
  if (!source) return null;
  return {
    id: source.id,
    title: source.title,
    explanation: source.explanation,
    steps: cloneJson(source.steps),
    implementation: cloneJson(source.implementation),
  };
}

export function createResultRecord({
  id,
  task,
  patternId,
  tasksPerDay,
  minutesPerTask,
  context,
  now = Date.now(),
} = {}) {
  const normalizedTask = typeof task === "string" ? task.trim() : "";
  const pattern = normalizePattern({ id: patternId });
  const tasks = boundedInteger(tasksPerDay, 1, 100);
  const minutes = boundedInteger(minutesPerTask, 1, 60);
  if (!isResultId(id) || !normalizedTask || normalizedTask.length > MAX_TASK_LENGTH || !pattern || tasks === null || minutes === null) {
    return null;
  }
  return {
    version: RESULT_VERSION,
    id: id.toLowerCase(),
    createdAt: now,
    expiresAt: now + RESULT_TTL_MS,
    task: normalizedTask,
    pattern,
    assumptions: { tasksPerDay: tasks, minutesPerTask: minutes },
    estimatedHoursPerMonth: Math.round(hoursPerMonth(tasks, minutes)),
    context: normalizeContext(context),
  };
}

function validateResultRecord(record, id, now) {
  if (!record || typeof record !== "object" || record.version !== RESULT_VERSION) return null;
  if (!isResultId(record.id) || record.id.toLowerCase() !== id.toLowerCase()) return null;
  if (!Number.isFinite(record.createdAt) || !Number.isFinite(record.expiresAt)) return null;
  if (record.expiresAt <= now || record.expiresAt - record.createdAt > RESULT_TTL_MS) return null;
  if (typeof record.task !== "string" || !record.task.trim() || record.task.length > MAX_TASK_LENGTH) return null;
  const pattern = normalizePattern(record.pattern);
  if (!pattern) return null;
  const tasksPerDay = boundedInteger(record.assumptions?.tasksPerDay, 1, 100);
  const minutesPerTask = boundedInteger(record.assumptions?.minutesPerTask, 1, 60);
  if (tasksPerDay === null || minutesPerTask === null) return null;
  return {
    version: RESULT_VERSION,
    id: id.toLowerCase(),
    createdAt: record.createdAt,
    expiresAt: record.expiresAt,
    task: record.task.trim(),
    pattern,
    assumptions: { tasksPerDay, minutesPerTask },
    estimatedHoursPerMonth: Math.round(hoursPerMonth(tasksPerDay, minutesPerTask)),
    context: normalizeContext(record.context),
  };
}

function pruneResultCache(storage, now) {
  const keys = [];
  for (let index = 0; index < storage.length; index++) {
    const key = storage.key(index);
    if (key?.startsWith(RESULT_STORAGE_PREFIX)) keys.push(key);
  }

  const keep = [];
  for (const key of keys) {
    let record = null;
    try { record = JSON.parse(storage.getItem(key)); } catch { /* invalid cache entry */ }
    if (!record || !Number.isFinite(record.expiresAt) || record.expiresAt <= now) {
      storage.removeItem(key);
    } else {
      keep.push({ key, createdAt: Number(record.createdAt) || 0 });
    }
  }
  keep.sort((a, b) => b.createdAt - a.createdAt);
  for (const stale of keep.slice(MAX_CACHED_RESULTS)) storage.removeItem(stale.key);
}

export function saveResult(storage, record, now = Date.now()) {
  try {
    const id = record?.id;
    if (!isResultId(id)) return false;
    const validated = validateResultRecord(record, id, now);
    if (!validated) return false;
    storage.setItem(resultStorageKey(id), JSON.stringify(validated));
    pruneResultCache(storage, now);
    return true;
  } catch {
    return false;
  }
}

export function loadResult(storage, id, now = Date.now()) {
  if (!isResultId(id)) return null;
  const key = resultStorageKey(id);
  try {
    const raw = storage.getItem(key);
    if (!raw) return null;
    const validated = validateResultRecord(JSON.parse(raw), id, now);
    if (!validated) storage.removeItem(key);
    return validated;
  } catch {
    return null;
  }
}

export function fullPageUrl(currentHref, id, context = {}) {
  if (!isResultId(id)) return null;
  const url = new URL(currentHref);
  const safeContext = normalizeContext(context);
  url.search = "";
  if (safeContext.role) url.searchParams.set("role", safeContext.role);
  if (safeContext.ref) url.searchParams.set("ref", safeContext.ref);
  if (safeContext.company) url.searchParams.set("c", safeContext.company);
  url.searchParams.set("result", id.toLowerCase());
  url.hash = `implementation/${id.toLowerCase()}`;
  return url.toString();
}

function quoteBlock(text) {
  return String(text ?? "").split("\n").map((line) => `> ${line}`).join("\n");
}

export function resultMarkdown(record) {
  if (!record || !normalizePattern(record.pattern)) return "";
  const { pattern, assumptions } = record;
  const blueprint = pattern.implementation;
  const list = (items) => (items ?? []).map((item) => `- ${item}`).join("\n");
  return [
    `# Build sketch: ${pattern.title}`,
    "",
    "## What you described",
    quoteBlock(record.task),
    "",
    `**Pattern:** ${pattern.title}`,
    `**Illustrative explanation:** ${pattern.explanation}`,
    `**Your assumptions:** ${assumptions.tasksPerDay} tasks/day × ${assumptions.minutesPerTask} minutes/task ≈ ${record.estimatedHoursPerMonth} hrs/month over 22 working days. This is not a measured result.`,
    "",
    "## Implementation outline",
    `**Trigger:** ${blueprint.trigger}`,
    "",
    "### Input schema",
    list(blueprint.inputs),
    "",
    "### Processing",
    list(blueprint.actions),
    "",
    "### Validation",
    list(blueprint.validation),
    "",
    `**Human handoff:** ${blueprint.handoff}`,
    "",
    "### Expected outputs",
    list(blueprint.outputs),
    "",
    "### Acceptance checks",
    list(blueprint.tests),
    "",
    "Illustrative design sketch only. It has not been executed; it created no records, sent no messages, connected to no services, and deployed no automation.",
    "",
  ].join("\n");
}
