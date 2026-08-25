'use client';

import { DemoCard } from '@/lib/assistant-intents';
import { cn } from '@/lib/utils';

/**
 * Renderers for deterministic demo `card` frames (interview / quiz / flow).
 * Pure presentation: no fetch, no state of its own beyond props; every
 * interactive element posts a deterministic token through the shared
 * onSend callback. Styling reuses the chat's existing token variables so
 * the cards read as native chat bubbles at any width down to 375px.
 */

const chipBase =
  'max-w-full cursor-pointer truncate border border-[var(--dp-border)] bg-[#0d0d0d] px-2 py-1 text-left text-[11px] transition-all hover:border-[var(--dp-accent)]';

function InterviewCard({
  payload,
  onSend
}: {
  payload: Extract<DemoCard, { kind: 'interview' }>;
  onSend: (token: string) => void;
}) {
  const isLast = payload.step >= payload.totalSteps;
  return (
    <div className='chat-msg bot'>
      <span className='msg-tag'>
        INTERVIEW · Q{payload.step}/Q{payload.totalSteps}
      </span>
      <p className='msg-text font-bold'>{payload.question}</p>
      <p className='msg-text leading-relaxed whitespace-pre-wrap'>
        {payload.answer}
      </p>
      <div className='mt-1.5 flex flex-wrap gap-1.5'>
        {payload.receipt.map((r) => (
          <span
            key={r.label}
            className='border border-[var(--dp-border)] px-1.5 py-0.5 text-[10px] text-[var(--dp-text-dim)]'
          >
            ✓ {r.label}
          </span>
        ))}
      </div>
      {!isLast && (
        <button
          onClick={() => onSend(`interview:step:${payload.step}`)}
          className={cn(chipBase, 'mt-2')}
        >
          ▸ continue ({payload.step + 1} of {payload.totalSteps})
        </button>
      )}
    </div>
  );
}

function QuizCard({
  payload,
  onSend
}: {
  payload: Extract<DemoCard, { kind: 'quiz' }>;
  onSend: (token: string) => void;
}) {
  if (payload.result) {
    return (
      <div className='chat-msg bot'>
        <span className='msg-tag'>QUIZ RESULT</span>
        <p className='msg-text'>
          Closest match:{' '}
          <strong className='text-[var(--dp-accent)]'>
            {payload.result.label}
          </strong>
        </p>
      </div>
    );
  }
  return (
    <div className='chat-msg bot'>
      <span className='msg-tag'>
        ROLEFIT QUIZ · {payload.questionIndex}/{payload.totalQuestions}
      </span>
      <p className='msg-text font-bold'>{payload.question}</p>
      <div className='mt-1.5 flex flex-col gap-1.5'>
        {payload.choices.map((c) => {
          const already = payload.answered.includes(c.id);
          return (
            <button
              key={c.id}
              disabled={already}
              onClick={() =>
                onSend(['quiz:answer', ...payload.answered, c.id].join(':'))
              }
              className={cn(
                chipBase,
                'whitespace-normal',
                already && 'opacity-50'
              )}
            >
              {already ? '· ' : '▸ '}
              {c.label}
            </button>
          );
        })}
      </div>
    </div>
  );
}

const NODE_GLYPH: Record<string, string> = {
  input: '▸',
  work: '■',
  decision: '◆',
  output: '●'
};

function FlowCard({
  payload
}: {
  payload: Extract<DemoCard, { kind: 'flow' }>;
}) {
  return (
    <div className='chat-msg bot'>
      <span className='msg-tag'>TASK → FLOW (ILLUSTRATIVE)</span>
      <ol className='ml-4 list-decimal space-y-1 pl-1 text-[11px] leading-relaxed'>
        {payload.nodes.map((n) => (
          <li key={n.id}>
            <span className='font-bold'>
              {NODE_GLYPH[n.type] ?? '■'} {n.label}
            </span>
            {n.type === 'decision' && (
              <span className='text-[var(--dp-text-dim)]'>
                {' '}
                (no sign-off → back to scoping)
              </span>
            )}
            {n.type === 'work' &&
              payload.edges.some((e) => e.from === 'ok' && e.to === n.id) && (
                <span className='text-[var(--dp-text-dim)]'>
                  {' '}
                  — only after sign-off
                </span>
              )}
          </li>
        ))}
      </ol>
      <p className='mt-1.5 text-[10px] leading-relaxed text-[var(--dp-text-dim)] italic'>
        {payload.summary}
      </p>
    </div>
  );
}

export function DemoCards({
  card,
  onSend
}: {
  card: DemoCard;
  onSend: (token: string) => void;
}) {
  if (card.kind === 'interview') {
    return <InterviewCard payload={card} onSend={onSend} />;
  }
  if (card.kind === 'quiz') {
    return <QuizCard payload={card} onSend={onSend} />;
  }
  return <FlowCard payload={card} />;
}
