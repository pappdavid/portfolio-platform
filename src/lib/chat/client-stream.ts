export type ChatEvidence = {
  id: string;
  title: string;
  kind: string;
  summary: string;
  href?: string;
  score: number;
};

export class PortfolioReplyError extends Error {}

function safeEvidenceHref(value: unknown): string | undefined {
  if (typeof value !== 'string' || /[\s\\]/.test(value)) return;
  if (value.startsWith('/') && !value.startsWith('//')) return value;
  try {
    const url = new URL(value);
    if (url.protocol === 'https:' && !url.username && !url.password)
      return value;
  } catch {}
}

export function validateChatEvidence(items: unknown): ChatEvidence[] {
  if (!Array.isArray(items)) return [];
  return items.flatMap((item: unknown) => {
    if (!item || typeof item !== 'object') return [];
    const value = item as Record<string, unknown>;
    if (
      typeof value.id !== 'string' ||
      typeof value.title !== 'string' ||
      typeof value.kind !== 'string' ||
      typeof value.summary !== 'string' ||
      typeof value.score !== 'number' ||
      !Number.isFinite(value.score)
    )
      return [];
    return [
      {
        id: value.id,
        title: value.title,
        kind: value.kind,
        summary: value.summary,
        score: value.score,
        href: safeEvidenceHref(value.href)
      }
    ];
  });
}

// Consume complete SSE frames, including frames split across network chunks.
// Completion without answer text is an error, not a successful empty bubble.
export async function readPortfolioReply(
  response: Response,
  onDelta: (content: string) => void,
  onEvidence: (items: ChatEvidence[]) => void
): Promise<void> {
  if (!response.ok) {
    await response.body?.cancel().catch(() => {});
    if (response.status === 429) {
      throw new PortfolioReplyError(
        'The chat limit has been reached. Please try again later or email contact@davidpapp.dev.'
      );
    }
    throw new PortfolioReplyError(
      'The assistant is unavailable. Please try again or email contact@davidpapp.dev.'
    );
  }
  if (!response.body)
    throw new PortfolioReplyError(
      'The assistant returned no reply. Please try again or email contact@davidpapp.dev.'
    );

  const reader = response.body.getReader();
  const decoder = new TextDecoder();
  let buffer = '';
  let hasText = false;
  let completed = false;
  function frame(value: string) {
    const data = value
      .split('\n')
      .filter((line) => line.startsWith('data:'))
      .map((line) => line.slice(5).trimStart())
      .join('\n')
      .trim();
    if (!data) return;
    if (data === '[DONE]') {
      completed = true;
      return;
    }
    let payload: { type?: string; content?: string; items?: unknown };
    try {
      payload = JSON.parse(data);
    } catch {
      return;
    }
    if (!payload || typeof payload !== 'object') return;
    if (payload.type === 'error')
      throw new PortfolioReplyError(
        'The reply was interrupted. Please try again or email contact@davidpapp.dev.'
      );
    if (payload.type === 'evidence')
      onEvidence(validateChatEvidence(payload.items));
    if (
      payload.type === 'delta' &&
      typeof payload.content === 'string' &&
      payload.content
    ) {
      hasText = true;
      onDelta(payload.content);
    }
  }
  try {
    while (true) {
      const { done, value } = await reader.read();
      buffer += decoder.decode(value, { stream: !done });
      buffer = buffer.replace(/\r\n/g, '\n');
      let boundary = buffer.indexOf('\n\n');
      while (boundary !== -1) {
        frame(buffer.slice(0, boundary));
        buffer = buffer.slice(boundary + 2);
        boundary = buffer.indexOf('\n\n');
      }
      if (done) {
        if (buffer.trim()) frame(buffer);
        break;
      }
    }
    if (!hasText)
      throw new PortfolioReplyError(
        'The assistant returned no reply. Please try again or email contact@davidpapp.dev.'
      );
    if (!completed)
      throw new PortfolioReplyError(
        'The reply was interrupted. Please try again or email contact@davidpapp.dev.'
      );
  } catch (error) {
    await reader.cancel().catch(() => {});
    throw error;
  } finally {
    reader.releaseLock();
  }
}
