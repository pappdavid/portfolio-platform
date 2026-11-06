/* Self-Interview — chat runtime.
   Autoplay interview with typing animation, tappable chips, and a
   deterministic intent map for typed questions. No network, no LLM. */

import { classifyIntent } from './facts.js'
import { INTERVIEW_SCRIPT, SUGGESTED_QUESTIONS, getAnswerById, FALLBACK_ANSWER } from './script-data.js'
import {
  createConversationState, appendConversationMessage, advanceAutoplay,
  setScriptTurnPending, setAutoplayPaused, queueConversationQuestion, removePendingQuestion,
  saveConversationState, restoreConversationState, clearConversationState, normalizeConversationRole,
} from './conversation-state.js'

const chat = document.getElementById('chat')
const chipsEl = document.getElementById('chips')
const form = document.getElementById('composer-form')
const input = document.getElementById('composer-input')
const clearButton = document.getElementById('clear-conversation')

const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches
const ROLE_LABELS = {
  'ai-engineering': 'the AI Engineering page',
  'ai-integration': 'the AI Integration page',
  automation: 'the Automation page',
  'product-engineering': 'the Product Engineering page',
}
const ROLE_LABEL_MAP = new Map(Object.entries(ROLE_LABELS))

function getSessionStorage() {
  try { return window.sessionStorage; } catch { return null; }
}

const sleep = (ms) => new Promise((r) => setTimeout(r, reducedMotion ? 0 : ms))
function scrollDown() {
  requestAnimationFrame(() => { chat.scrollTop = chat.scrollHeight })
}

const role = (() => {
  try {
    const value = new URLSearchParams(window.location.search).get('role')
    return normalizeConversationRole(value) && ROLE_LABEL_MAP.has(value) ? value : null
  } catch { return null }
})()
const storage = getSessionStorage()
let conversation = restoreConversationState(storage, role, INTERVIEW_SCRIPT.length)
let autoplayPaused = conversation.autoplayPaused
let scriptTurnActive = false
let manualQueueRunning = false
let autoplayGeneration = 0
let interactionsBusy = false

function setInteractionsBusy(busy) {
  interactionsBusy = busy
  input.disabled = false
  form.querySelector('button[type="submit"]').disabled = false
  for (const button of chipsEl.querySelectorAll('button')) button.disabled = false
  syncClearButton()
}

function syncClearButton() {
  clearButton.disabled = scriptTurnActive || manualQueueRunning
}

function persistConversation() {
  saveConversationState(storage, conversation, INTERVIEW_SCRIPT.length)
}

function addMessage(kind, text, { id, source = null, complete = true } = {}) {
  if (id) {
    const existing = Array.from(chat.children).find((item) => item.dataset.messageId === id)
    if (existing) return existing
  }
  const div = document.createElement('div')
  div.className = `msg ${kind}`
  div.textContent = text
  if (id) div.dataset.messageId = id
  chat.appendChild(div)
  if (id) {
    conversation = appendConversationMessage(conversation, { id, kind, text, source, complete })
    persistConversation()
  }
  if (source) attachReceipt(div, source)
  scrollDown()
  return div
}

function completeAnswer(el, answer, source, id) {
  el.textContent = answer
  if (source) attachReceipt(el, source)
  conversation = {
    ...conversation,
    messages: conversation.messages.map((message) => message.id === id
      ? { ...message, text: answer, source: source ?? null, complete: true }
      : message),
  }
  persistConversation()
}

/** Attach the receipt chip (visible fact source) to a bubble. */
function attachReceipt(el, source) {
  if (!source) return
  const chip = document.createElement('span')
  chip.className = 'receipt'
  chip.textContent = `✔ ${source}`
  el.appendChild(chip)
}

async function showTyping() {
  const t = document.createElement('div')
  t.className = 'typing'
  t.innerHTML = '<span></span><span></span><span></span>'
  chat.appendChild(t)
  scrollDown()
  await sleep(650)
  t.remove()
}

/** Play one David answer with a warm typewriter effect + receipt. */
async function playAnswer(answer, source, id) {
  if (conversation.messages.some((message) => message.id === id && message.complete)) return
  await showTyping()
  const el = addMessage('david', '', { id, source, complete: false })
  if (reducedMotion) {
    completeAnswer(el, answer, source, id)
  } else {
    for (let i = 4; i <= answer.length; i += 4) {
      el.textContent = answer.slice(0, i)
      scrollDown()
      await new Promise((r) => setTimeout(r, 12))
    }
    completeAnswer(el, answer, source, id)
  }
}

/* Deep link (?role=<rolegroup>): the roles pages can open this demo with
   context. One honest parenthetical bubble seeds the chat before autoplay.
   Purely cosmetic context — never touches FACTS or the answer DB. */
function roleContextLine() {
  const label = ROLE_LABEL_MAP.get(role)
  return label ? `(You came from ${label} — happy to zoom in on that side of David's work.)` : null
}

/* Autoplay: recruiter question appears, David answers — in script order,
   so the skeptical arc plays itself with zero visitor effort. */
let autoplayStarted = false

async function startAutoplay() {
  if (autoplayStarted) return
  if (conversation.autoplayPaused && !conversation.scriptTurnPending) {
    if (conversation.pendingQuestions.length) await drainPendingQuestions()
    return
  }
  if (conversation.autoplayIndex >= INTERVIEW_SCRIPT.length) {
    if (conversation.pendingQuestions.length) await drainPendingQuestions()
    return
  }
  autoplayStarted = true
  const generation = ++autoplayGeneration
  if (conversation.pendingQuestions.length && !conversation.scriptTurnPending) {
    autoplayPaused = true
    conversation = setAutoplayPaused(conversation, true)
    await drainPendingQuestions()
    return
  }
  const ctx = roleContextLine()
  if (ctx) {
    addMessage('recruiter', ctx, { id: `context:${role}` })
    await sleep(reducedMotion ? 0 : 400)
  }
  for (let index = conversation.autoplayIndex; index < INTERVIEW_SCRIPT.length; index += 1) {
    if (generation !== autoplayGeneration || (autoplayPaused && !conversation.scriptTurnPending)) break
    const item = INTERVIEW_SCRIPT[index]
    scriptTurnActive = true
    setInteractionsBusy(true)
    conversation = setScriptTurnPending(conversation, true)
    persistConversation()
    addMessage('recruiter', item.question, { id: `autoplay:${item.id}:question` })
    await sleep(reducedMotion ? 0 : 400)
    await playAnswer(item.answer, item.source, `autoplay:${item.id}:answer`)
    conversation = advanceAutoplay(conversation, index + 1)
    conversation = setScriptTurnPending(conversation, false)
    scriptTurnActive = false
    setInteractionsBusy(false)
    persistConversation()
    if (conversation.pendingQuestions.length) {
      autoplayPaused = true
      await drainPendingQuestions()
      break
    }
    if (autoplayPaused) break
    await sleep(reducedMotion ? 0 : 500)
  }
  scriptTurnActive = false
  syncClearButton()
}

/* --- visitor interaction ------------------------------------------------- */

function renderChips(list) {
  chipsEl.innerHTML = ''
  for (const text of list) {
    const b = document.createElement('button')
    b.type = 'button'
    b.className = 'chip'
    b.textContent = text
    b.addEventListener('click', () => handleUserQuestion(text))
    chipsEl.appendChild(b)
  }
}

async function handleUserQuestion(text) {

  const question = text.trim().slice(0, 280)
  if (!question) return
  const id = createInteractionId()
  const updated = queueConversationQuestion(conversation, id, question)
  if (updated === conversation) {
    input.setCustomValidity('The pending question queue is full. Wait for an answer and try again.')
    input.reportValidity()
    return
  }
  input.setCustomValidity('')
  input.value = ''
  conversation = updated
  conversation = setAutoplayPaused(conversation, true)
  persistConversation()
  autoplayPaused = true
  if (!scriptTurnActive) await drainPendingQuestions()
}

function createInteractionId() {
  try { return `visitor:${crypto.randomUUID()}`; }
  catch { return `visitor:${Date.now()}-${Math.random().toString(16).slice(2)}`; }
}

async function drainPendingQuestions() {
  if (manualQueueRunning) return
  manualQueueRunning = true
  setInteractionsBusy(true)
  try {
    while (conversation.pendingQuestions.length) {
      const question = conversation.pendingQuestions[0]
      const questionMessageId = `${question.id}:question`
      const answerMessageId = `${question.id}:answer`
      if (!conversation.messages.some((message) => message.id === questionMessageId && message.complete)) {
        addMessage('user', question.text, { id: questionMessageId })
      }
      const answerIsSaved = conversation.messages.some((message) => message.id === answerMessageId && message.complete)
      if (!answerIsSaved) {
        const key = classifyIntent(question.text)
        const item = key ? getAnswerById(key) : null
        await sleep(reducedMotion ? 0 : 300)
        if (item) {
          await playAnswer(item.answer, item.source, answerMessageId)
        } else {
          await showTyping()
          addMessage('david', FALLBACK_ANSWER, { id: answerMessageId })
        }
      }
      conversation = removePendingQuestion(conversation, question.id)
      persistConversation()
    }
  } finally {
    manualQueueRunning = false
    setInteractionsBusy(false)
    if (autoplayPaused && conversation.autoplayIndex < INTERVIEW_SCRIPT.length) {
      guided.hidden = false
      guided.textContent = conversation.autoplayIndex > 0 ? 'Resume guided interview' : 'Start guided interview'
    }
    input.focus({ preventScroll: true })
    scrollDown()
  }
}

function restartConversation() {
  if (scriptTurnActive || manualQueueRunning) return
  autoplayGeneration += 1
  autoplayStarted = false
  autoplayPaused = true
  clearConversationState(storage)
  conversation = setAutoplayPaused(createConversationState(role), true)
  chat.replaceChildren()
  setInteractionsBusy(false)
  guided.hidden = false
  guided.textContent = 'Start guided interview'
  addMessage('david', 'Ask about David’s work, stack, or projects. Answers use reviewed facts. The guided interview is optional.', { id: 'welcome' })
  persistConversation()
  input.focus({ preventScroll: true })
}

for (const message of conversation.messages) {
  const element = addMessage(message.kind, message.text, { id: message.id, source: message.source, complete: true })
  if (!element.querySelector('.receipt') && message.source) attachReceipt(element, message.source)
}

form.addEventListener('submit', (e) => {
  e.preventDefault()
  const text = input.value.trim()
  if (text) handleUserQuestion(text)
})
clearButton.addEventListener('click', restartConversation)

renderChips(SUGGESTED_QUESTIONS)

// Guided playback is opt-in; visitors can ask questions immediately.
conversation = setAutoplayPaused(conversation, true)
autoplayPaused = true
persistConversation()
const guided = document.createElement('button')
guided.type = 'button'
guided.className = 'guided-start'
guided.textContent = conversation.autoplayIndex > 0 ? 'Resume guided interview' : 'Start guided interview'
guided.hidden = conversation.autoplayIndex >= INTERVIEW_SCRIPT.length
guided.addEventListener('click', () => {
  guided.hidden = true
  autoplayStarted = false
  autoplayPaused = false
  conversation = setAutoplayPaused(conversation, false)
  persistConversation()
  startAutoplay()
})
document.querySelector('header').appendChild(guided)
if (!conversation.messages.length) addMessage('david', 'Ask about David’s work, stack, or projects. Answers use reviewed facts. The guided interview is optional.', { id: 'welcome' })
if (conversation.pendingQuestions.length) drainPendingQuestions()
