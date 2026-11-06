import { classifyIntent } from './facts.js';
import { FALLBACK_ANSWER, getAnswerById } from './script-data.js';

export const CONVERSATION_KEY = 'self-interview:conversation:v2';
export const CONVERSATION_VERSION = 2;
export const CONVERSATION_TTL_MS = 6 * 60 * 60 * 1000;
export const MAX_CONVERSATION_MESSAGES = 80;
const MESSAGE_KINDS = new Set(['user', 'recruiter', 'david']);
const ALLOWED_ROLES = new Set(['ai-engineering', 'ai-integration', 'automation', 'product-engineering']);

export function normalizeConversationRole(role) {
  return typeof role === 'string' && ALLOWED_ROLES.has(role) ? role : null;
}

export function createConversationState(role = null, now = Date.now()) {
  return {
    version: CONVERSATION_VERSION,
    createdAt: now,
    expiresAt: now + CONVERSATION_TTL_MS,
    role: normalizeConversationRole(role),
    autoplayIndex: 0,
    scriptTurnPending: false,
    autoplayPaused: false,
    messages: [],
    pendingQuestions: [],
  };
}

export function appendConversationMessage(state, message) {
  if (!state || !message || typeof message !== 'object') return state;
  if (!MESSAGE_KINDS.has(message.kind) || typeof message.id !== 'string' || !message.id || message.id.length > 160) return state;
  if (typeof message.text !== 'string' || message.text.length > (message.kind === 'user' ? 280 : 4000)) return state;
  if (message.source != null && (typeof message.source !== 'string' || message.source.length > 200)) return state;
  if (state.messages.some((item) => item.id === message.id)) return state;
  const normalized = {
    id: message.id,
    kind: message.kind,
    text: message.text,
    source: message.source ?? null,
    complete: message.complete === true,
  };
  return { ...state, messages: [...state.messages, normalized].slice(-MAX_CONVERSATION_MESSAGES) };
}

export function advanceAutoplay(state, nextIndex) {
  if (!state || !Number.isInteger(nextIndex) || nextIndex < state.autoplayIndex) return state;
  return { ...state, autoplayIndex: nextIndex };
}

export function setScriptTurnPending(state, pending) {
  return { ...state, scriptTurnPending: Boolean(pending) };
}

export function setAutoplayPaused(state, paused) {
  return { ...state, autoplayPaused: Boolean(paused) };
}

export function queueConversationQuestion(state, id, text) {
  if (!state || typeof id !== 'string' || !id || id.length > 160) return state;
  if (typeof text !== 'string' || !text.trim() || text.trim().length > 280) return state;
  if (state.pendingQuestions.some((question) => question.id === id) || state.pendingQuestions.length >= 10) return state;
  return { ...state, pendingQuestions: [...state.pendingQuestions, { id, text: text.trim() }] };
}

export function removePendingQuestion(state, id) {
  return { ...state, pendingQuestions: state.pendingQuestions.filter((question) => question.id !== id) };
}

export function materializeCurrentAnswers(messages) {
  const users = new Map(messages.filter((message) => message.kind === 'user').map((message) => [message.id, message]));
  const currentMessages = [];
  for (const message of messages) {
    if (message.kind !== 'david') {
      currentMessages.push(message);
      continue;
    }

    const scriptedId = message.id.match(/^autoplay:([a-z0-9-]+):answer$/)?.[1];
    if (scriptedId) {
      const answer = getAnswerById(scriptedId);
      if (answer) currentMessages.push({ ...message, text: answer.answer, source: answer.source });
      continue;
    }

    const manualId = message.id.match(/^(visitor:[^:]+):answer$/)?.[1];
    if (!manualId) continue;
    const question = users.get(`${manualId}:question`);
    if (!question) continue;
    const answerKey = classifyIntent(question.text);
    const answer = answerKey ? getAnswerById(answerKey) : null;
    currentMessages.push({
      ...message,
      text: answer?.answer ?? FALLBACK_ANSWER,
      source: answer?.source ?? null,
    });
  }
  return currentMessages;
}

function validateState(value, role, scriptLength, now) {
  if (!value || value.version !== CONVERSATION_VERSION || value.role !== normalizeConversationRole(role)) return null;
  if (!Number.isFinite(value.createdAt) || !Number.isFinite(value.expiresAt) || value.expiresAt <= now) return null;
  if (value.expiresAt - value.createdAt > CONVERSATION_TTL_MS) return null;
  if (!Number.isInteger(value.autoplayIndex) || value.autoplayIndex < 0 || value.autoplayIndex > scriptLength) return null;
  if (typeof value.scriptTurnPending !== 'boolean') return null;
  if (typeof value.autoplayPaused !== 'boolean') return null;
  if (!Array.isArray(value.messages) || value.messages.length > MAX_CONVERSATION_MESSAGES) return null;
  if (!Array.isArray(value.pendingQuestions) || value.pendingQuestions.length > 10) return null;
  const pendingQuestions = [];
  const pendingIds = new Set();
  for (const question of value.pendingQuestions) {
    if (typeof question?.id !== 'string' || !question.id || question.id.length > 160) return null;
    if (typeof question.text !== 'string' || !question.text.trim() || question.text.length > 280) return null;
    if (pendingIds.has(question.id)) return null;
    pendingIds.add(question.id);
    pendingQuestions.push({ id: question.id, text: question.text.trim() });
  }
  const messages = [];
  const ids = new Set();
  for (const message of value.messages) {
    if (!MESSAGE_KINDS.has(message?.kind) || typeof message.id !== 'string' || !message.id || message.id.length > 160) return null;
    if (typeof message.text !== 'string' || message.text.length > (message.kind === 'user' ? 280 : 4000)) return null;
    if (message.source != null && (typeof message.source !== 'string' || message.source.length > 200)) return null;
    if (ids.has(message.id)) return null;
    ids.add(message.id);
    if (message.complete === true) messages.push({
      id: message.id, kind: message.kind, text: message.text, source: message.source ?? null, complete: true,
    });
  }
  return {
    version: CONVERSATION_VERSION,
    createdAt: value.createdAt,
    expiresAt: value.expiresAt,
    role: value.role,
    autoplayIndex: value.autoplayIndex,
    scriptTurnPending: value.scriptTurnPending,
    autoplayPaused: value.autoplayPaused,
    messages,
    pendingQuestions,
  };
}

export function saveConversationState(storage, state, scriptLength, now = Date.now()) {
  try {
    if (!storage || state?.version !== CONVERSATION_VERSION) return false;
    const value = {
      ...state,
      createdAt: now,
      expiresAt: now + CONVERSATION_TTL_MS,
    };
    if (!validateState(value, state.role ?? null, scriptLength, now)) return false;
    storage.setItem(CONVERSATION_KEY, JSON.stringify(value));
    return true;
  } catch {
    return false;
  }
}

export function restoreConversationState(storage, role, scriptLength, now = Date.now()) {
  try {
    const raw = storage?.getItem(CONVERSATION_KEY);
    if (!raw) return createConversationState(role, now);
    const value = validateState(JSON.parse(raw), role, scriptLength, now);
    return value
      ? { ...value, messages: materializeCurrentAnswers(value.messages) }
      : createConversationState(role, now);
  } catch {
    return createConversationState(role, now);
  }
}

export function clearConversationState(storage) {
  try { storage?.removeItem(CONVERSATION_KEY); } catch { /* storage may be unavailable */ }
}
